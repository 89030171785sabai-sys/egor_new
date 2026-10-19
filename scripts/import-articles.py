#!/usr/bin/env python3
"""
Импорт статей блога из папок «NNN тема» (Статья.html + Title, description, URL.txt).

Что делает с каждой статьёй:
  * берёт из метафайла адрес, заголовок, описание, рубрику и время чтения;
  * из «Статья.html» — вводный абзац, главное фото и тело статьи (разделы,
    таблицы, схемы); схемы остаются встроенным SVG, фото выносятся в файлы;
  * фото сжимает в webp: `public/blog/<slug>/hero.webp`, `thumb.webp`, `NN.webp`;
  * тело статьи кладёт в `src/content/articles/<slug>.html`;
  * общий список пишет в `src/data/articles.generated.ts`.

Запуск (повторный безопасен, всё перезаписывается):
    python3 scripts/import-articles.py "<папка с распакованными статьями>"
"""
import base64
import html as htmllib
import io
import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_IMAGES = ROOT / 'public' / 'blog'
OUT_BODIES = ROOT / 'src' / 'content' / 'articles'
OUT_DATA = ROOT / 'src' / 'data' / 'articles.generated.ts'

HERO_WIDTH, THUMB_WIDTH, BODY_WIDTH = 1280, 640, 1100

# В исходных файлах дат нет. По просьбе заказчика статья № 1 датирована днём
# FIRST_DATE, каждая следующая — на STEP_DAYS дней раньше: в блоге новее всех
# первая, порядок 001 → 129 сохраняется. Чтобы сдвинуть даты, поправьте здесь.
FIRST_DATE = date(2026, 10, 19)
STEP_DAYS = 2

DATA_URI = re.compile(r'data:image/(?:jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=]+)')


def fail(message: str):
    sys.exit(f'Ошибка: {message}')


KEYS = {
    'TITLE': 'title',
    'DESCRIPTION': 'description',
    'H1': 'h1',
    'URL': 'url',
    'РУБРИКА В БЛОГЕ': 'tag',
    'ВРЕМЯ ЧТЕНИЯ': 'minutes',
}


def read_meta(path: Path) -> dict:
    """Метафайл: строка-заголовок («TITLE (52 знаков…)», «H1», «URL»…) и значение под ней."""
    meta = {name: [] for name in KEYS.values()}
    current = None
    for line in path.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        head = re.sub(r'\s*\(.*\)$', '', line)
        if head in KEYS and (line == head or line.endswith(')')):
            current = KEYS[head]
        elif current and line:
            meta[current].append(line)
    return {name: ' '.join(lines).strip() for name, lines in meta.items()}


def to_webp(raw: bytes, width: int, quality: int = 80) -> bytes:
    image = Image.open(io.BytesIO(raw)).convert('RGB')
    if image.width > width:
        image = image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)
    out = io.BytesIO()
    image.save(out, 'WEBP', quality=quality, method=6)
    return out.getvalue()


def scope_svg_styles(content: str, number: int) -> str:
    """
    У встроенной схемы свой <style> с классами .t, .s, .m…, а в браузере такой стиль
    действует на всю страницу: цвета одной схемы перекрасили бы другие. Каждой схеме
    даём уникальный id и ставим его перед каждым селектором.
    """
    counter = 0

    def scope(match):
        nonlocal counter
        counter += 1
        uid = f'a{number}s{counter}'
        svg = match.group(0)
        svg = svg.replace('<svg', f'<svg id="{uid}"', 1)
        return re.sub(
            r'<style>(.*?)</style>',
            lambda st: '<style>' + re.sub(r'(^|\})\s*(\.[\w-]+)', lambda r: f'{r.group(1)}#{uid} {r.group(2)}', st.group(1)) + '</style>',
            svg,
            flags=re.S,
        )

    return re.sub(r'<svg\b.*?</svg>', scope, content, flags=re.S)


def strip_tags(value: str) -> str:
    return htmllib.unescape(re.sub(r'<[^>]+>', '', value)).strip()


def main():
    if len(sys.argv) != 2:
        fail('укажите папку со статьями')
    source = Path(sys.argv[1])
    folders = sorted(p for p in source.iterdir() if p.is_dir() and re.match(r'^\d{3} ', p.name))
    if not folders:
        fail('в папке нет подпапок вида «001 тема»')

    OUT_BODIES.mkdir(parents=True, exist_ok=True)
    OUT_IMAGES.mkdir(parents=True, exist_ok=True)
    articles = []
    problems = []

    for folder in folders:
        number = int(folder.name[:3])
        meta = read_meta(next(folder.glob('Title*.txt')))
        if not meta['url'].startswith('/blog/'):
            problems.append(f'{folder.name}: странный адрес «{meta["url"]}»')
            continue
        slug = meta['url'].removeprefix('/blog/').strip('/')
        page = (folder / 'Статья.html').read_text(encoding='utf-8')

        start = page.index('ВСТАВИТЬ НА САЙТ: начало')
        end = page.index('ВСТАВИТЬ НА САЙТ: конец')
        fragment = page[start:end]
        fragment = fragment[fragment.index('</style>') + len('</style>'):]

        lead = re.search(r'<p class="ht-lead">(.*?)</p>', fragment, re.S)
        hero = re.search(r'<div class="ht-hero">.*?src="(data:[^"]+)".*?</div>', fragment, re.S)
        body = re.search(
            r'<div class="ht-wrap ht-body">(.*?)</div>\s*(?:<div class="ht-cta">|</article>)', fragment, re.S
        )
        if not (lead and body):
            problems.append(f'{folder.name}: не нашёл вводный абзац или тело статьи')
            continue
        if not hero:
            problems.append(f'{folder.name}: нет главного фото — в списке будет снимок с сайта')

        image_dir = OUT_IMAGES / slug
        image_dir.mkdir(parents=True, exist_ok=True)
        hero_alt = None
        if hero:
            hero_raw = base64.b64decode(DATA_URI.search(hero.group(1)).group(1))
            (image_dir / 'hero.webp').write_bytes(to_webp(hero_raw, HERO_WIDTH))
            (image_dir / 'thumb.webp').write_bytes(to_webp(hero_raw, THUMB_WIDTH, 78))
            hero_alt = re.search(r'alt="([^"]*)"', hero.group(0))

        counter = 0

        def save_photo(match):
            nonlocal counter
            counter += 1
            name = f'{counter:02d}.webp'
            (image_dir / name).write_bytes(to_webp(base64.b64decode(match.group(1)), BODY_WIDTH))
            return f'/blog/{slug}/{name}'

        content = DATA_URI.sub(save_photo, body.group(1)).strip()
        content = content.replace(' loading="eager"', ' loading="lazy"')
        if 'data:image' in content:
            problems.append(f'{folder.name}: остались встроенные картинки')
        # Схемы встроены в страницу, поэтому лишние атрибуты с фиксированным размером убираем.
        content = re.sub(r'(<svg[^>]*?) width="\d+" height="\d+"', r'\1', content)

        # Подпись подлинности (c2pa) весит по несколько КБ на каждую схему и сайту не нужна.
        content = re.sub(r'<metadata>.*?</metadata>', '', content, flags=re.S)
        content = scope_svg_styles(content, number)

        (OUT_BODIES / f'{slug}.html').write_text(content + '\n', encoding='utf-8')

        minutes = int(re.search(r'\d+', meta['minutes'] or '5').group(0))
        articles.append({
            'slug': slug,
            'order': number,
            'date': (FIRST_DATE - timedelta(days=STEP_DAYS * (number - 1))).isoformat(),
            'title': meta['h1'] or meta['title'],
            'excerpt': strip_tags(lead.group(1)),
            'tag': meta['tag'] or 'Статьи',
            'readingMinutes': minutes,
            'seoTitle': meta['title'],
            'seoDescription': meta['description'],
            'hasHero': bool(hero),
            'heroAlt': htmllib.unescape(hero_alt.group(1)) if hero_alt else meta['h1'],
        })

    articles.sort(key=lambda a: a['order'])
    seen = {}
    for article in articles:
        if article['slug'] in seen:
            problems.append(f'повтор адреса {article["slug"]}')
        seen[article['slug']] = True

    body = json.dumps(articles, ensure_ascii=False, indent=2)
    OUT_DATA.write_text(
        '// Файл создаёт scripts/import-articles.py — руками не правится.\n'
        "import type { ArticleSummary } from './articles.types'\n\n"
        f'export const generatedArticles: ArticleSummary[] = {body}\n',
        encoding='utf-8',
    )
    print(f'Статей: {len(articles)}')
    for problem in problems:
        print('!', problem)


if __name__ == '__main__':
    main()
