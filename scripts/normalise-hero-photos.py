"""Normalise the hero shots so every tub reads at the same size on the page.

Each photograph was taken at its own distance, so the bowl's rim takes
anywhere from 28% to 66% of its frame. Two things bring them together: the
dead air at the sides is cropped away, and what remains is given a per-model
render width, so rim x width lands on one number for every model.

Crop boxes and rim measurements were read off a contact sheet with a
percentage grid — automatic detection kept latching onto floors and
reflections rather than the product.
"""
import json
from PIL import Image, ImageDraw

SRC = 'assets/photos-src'
DST = 'public/photos'
OUT = '/tmp/claude-0/-home-user-egor-new/53ae53de-0bea-5941-9b90-6b7814724db0/scratchpad'

# name: (crop_left, crop_right, rim_left, rim_right) — all fractions of the
# original width. The rim is the widest point of the bowl.
SHOTS = {
    'grafit':           (0.00, 1.00, 0.12, 0.78),
    'cherny-brilliant': (0.22, 0.84, 0.30, 0.72),
    'nefrit':           (0.20, 0.80, 0.29, 0.71),
    'oniks':            (0.20, 0.80, 0.24, 0.52),
    'oniks-pro':        (0.14, 0.84, 0.23, 0.60),
    'grant':            (0.12, 0.88, 0.19, 0.53),
}

# Width of the shot on a large screen, as a share of the viewport, before the
# per-model correction. The correction is capped so no shot runs past 80%.
BASE_LG = 0.64
MAX_LG = 0.80

rims = {}
for name, (cl, cr, rl, rr) in SHOTS.items():
    im = Image.open(f'{SRC}/{name}-hero.webp').convert('RGB')
    w, h = im.size
    box = (round(w * cl), 0, round(w * cr), h)
    cropped = im.crop(box)
    cropped.save(f'{DST}/{name}-hero.webp', 'WEBP', quality=88, method=6)
    rims[name] = {
        'rim': (rr - rl) / (cr - cl),
        'cx': ((rl + rr) / 2 - cl) / (cr - cl),
        'size': cropped.size,
    }

# The widest shot sets the ceiling; every other model scales down to match it.
widest = max(MAX_LG * rims[n]['rim'] for n in rims if rims[n]['rim'] == min(r['rim'] for r in rims.values()))
target = widest
scales = {}
for name, info in rims.items():
    lg = min(target / info['rim'], MAX_LG)
    scales[name] = round(lg, 4)

print(json.dumps({n: {'rim': round(rims[n]['rim'], 3), 'cx': round(rims[n]['cx'], 3),
                      'size': rims[n]['size'], 'lg_width': scales[n],
                      'rendered_rim': round(scales[n] * rims[n]['rim'], 4)}
                  for n in SHOTS}, indent=2, ensure_ascii=False))

# Preview: each shot drawn at its final width against a common viewport, so the
# rims can be checked against one another.
VW, ROW = 1100, 300
sheet = Image.new('RGB', (VW, ROW * len(SHOTS)), (12, 12, 14))
d = ImageDraw.Draw(sheet)
y = 0
for name in SHOTS:
    im = Image.open(f'{DST}/{name}-hero.webp')
    tw = round(VW * scales[name])
    th = round(im.height * tw / im.width)
    tile = im.resize((tw, th))
    sheet.paste(tile, (VW - tw, y + max(0, ROW - th)))
    rl = VW - tw + round(tw * (rims[name]['cx'] - rims[name]['rim'] / 2))
    rr = VW - tw + round(tw * (rims[name]['cx'] + rims[name]['rim'] / 2))
    d.line([(rl, y + 4), (rl, y + ROW - 4)], fill=(255, 90, 0), width=3)
    d.line([(rr, y + 4), (rr, y + ROW - 4)], fill=(255, 90, 0), width=3)
    d.text((8, y + 8), f'{name}  w={scales[name]:.2f}', fill=(255, 220, 0))
    y += ROW
sheet.save(f'{OUT}/normalised.png')
print('preview written')
