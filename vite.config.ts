import { copyFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { models } from './src/data/models'
import { contentRoutes } from './src/lib/routes'
import { generatedArticles } from './src/data/articles.generated'
import { releasedCount } from './src/data/release'

// хоттаб-чан.рф in punycode, which is the form a canonical link and a sitemap
// have to carry. It had been left pointing at жар-дым.рф, a different project's
// domain, so every canonical and every sitemap entry named the wrong site.
/**
 * How many articles the build shows (see src/data/release.ts). ARTICLES_RELEASED
 * overrides the schedule for one build: a number, or `all`.
 */
const articlesReleased = (() => {
  const forced = process.env.ARTICLES_RELEASED
  if (forced === 'all') return generatedArticles.length
  if (forced && /^\d+$/.test(forced)) return Number(forced)
  return releasedCount()
})()

const PRODUCTION_ORIGIN = 'https://xn----7sbbc6db2aay0a.xn--p1ai'

/**
 * Search-engine ownership tags. Yandex Webmaster and Google Search Console ask
 * for a meta tag in the head; the codes arrive as build variables so the tag
 * exists only on the real site and only once a code is set.
 */
function verificationTags(): Plugin {
  return {
    name: 'search-verification-tags',
    transformIndexHtml() {
      const tags = [
        ['yandex-verification', process.env.VITE_YANDEX_VERIFICATION],
        ['google-site-verification', process.env.VITE_GOOGLE_VERIFICATION],
      ] as const

      return tags
        .filter(([, content]) => content && /^[\w-]+$/.test(content))
        .map(([name, content]) => ({
          tag: 'meta',
          attrs: { name, content: content! },
          injectTo: 'head' as const,
        }))
    },
  }
}

/**
 * Prepares the built output for static hosting:
 *
 * - sitemap.xml from the same model data the pages are built from, so the two
 *   cannot drift apart; legal pages are noindex and stay out of it
 * - 404.html as a copy of index.html, because a static host has no server to
 *   route deep links back to the app
 * - .nojekyll, so GitHub Pages serves the asset directories untouched
 */
function staticHostAssets(origin: string): Plugin {
  return {
    name: 'zhar-dym-static-host-assets',
    apply: 'build',
    async closeBundle() {
      const dist = (file: string) => resolve(__dirname, 'dist', file)
      const today = new Date().toISOString().slice(0, 10)
      const paths = [
        '/',
        ...contentRoutes.map((route) => route.path),
        ...models.map((model) => `/${model.slug}`),
        ...generatedArticles
          .slice(0, articlesReleased)
          .map((article) => `/blog/${article.slug}`),
      ]

      const urls = paths
        .map(
          (path) =>
            `  <url>\n` +
            `    <loc>${origin}${path}</loc>\n` +
            `    <lastmod>${today}</lastmod>\n` +
            `    <changefreq>monthly</changefreq>\n` +
            `    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n` +
            `  </url>`,
        )
        .join('\n')

      await writeFile(
        dist('sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        'utf8',
      )

      await copyFile(dist('index.html'), dist('404.html'))
      await writeFile(dist('.nojekyll'), '', 'utf8')
    },
  }
}

/**
 * Снимки лежат в `public/photos` и сохраняют свои имена — в отличие от скриптов
 * и стилей, которым сборка подмешивает хэш. Хостинг же отдаёт картинки с
 * годовым сроком хранения, поэтому заменённый под тем же именем кадр у
 * вернувшегося посетителя так и остался бы старым. Отпечаток содержимого
 * попадает в адрес: пока файл не менялся, адрес прежний и кадр берётся из
 * кэша; изменился — адрес новый и браузер скачивает заново.
 */
function photoFingerprints(): Record<string, string> {
  const dir = resolve(__dirname, 'public/photos')
  const fingerprints: Record<string, string> = {}

  for (const file of readdirSync(dir)) {
    fingerprints[file] = createHash('sha1')
      .update(readFileSync(resolve(dir, file)))
      .digest('hex')
      .slice(0, 8)
  }

  return fingerprints
}

export default defineConfig(({ mode }) => {
  const base = process.env.VITE_BASE_PATH ?? '/'
  const origin = process.env.VITE_SITE_ORIGIN ?? PRODUCTION_ORIGIN

  return {
    base,
    // Passed through to the client so canonicals match where the build lives.
    define: {
      'import.meta.env.VITE_SITE_ORIGIN': JSON.stringify(origin),
      __PHOTO_FINGERPRINTS__: JSON.stringify(photoFingerprints()),
      __ARTICLES_RELEASED__: JSON.stringify(articlesReleased),
    },
    plugins: [react(), tailwindcss(), verificationTags(), staticHostAssets(origin)],
    build: { target: 'es2022', sourcemap: mode !== 'production' },
  }
})
