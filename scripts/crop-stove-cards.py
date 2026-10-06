"""Crop the stove close-ups to the shape of the heating cards.

The client shoots the whole tub in portrait; the cards want a landscape frame
of the stove itself — the firebox, the grate, the ash drawer, and just enough
of the bowl above it to say what the stove belongs to. The crop is given as
fractions of the original so it survives a reshoot at another resolution.

Both takes of a stove — colour and silver — are cropped identically, so the
card can crossfade between them without anything shifting.

    python3 scripts/crop-stove-cards.py
"""
from PIL import Image

SRC = 'assets/photos-src'
DST = 'public/photos'
RATIO = 4 / 3

# name: (left, right, top, bottom) as fractions of the original. The width is
# then trimmed to the card's ratio about the same centre.
CROPS = {
    'stove-stationary': (0.152, 0.768, 0.58, 0.95),
    'stove-demountable': (0.253, 0.887, 0.55, 0.93),
}

# Which takes exist for each stove. Вальцовавич's two renders put the removed
# grate and ash drawer on opposite sides and light the firebox differently, so
# crossfading them reads as a glitch — that card runs the colour take alone and
# the page desaturates it.
TAKES = {
    'stove-stationary': ('color', 'grey'),
    'stove-demountable': ('color',),
}


def crop(name: str, box: tuple[float, float, float, float]) -> None:
    left, right, top, bottom = box
    for take in TAKES.get(name, ('color', 'grey')):
        src = Image.open(f'{SRC}/{name}-{take}.webp').convert('RGB')
        w, h = src.size
        x0, x1 = left * w, right * w
        y0, y1 = top * h, bottom * h

        # Hold the vertical range and fit the width to the card's ratio.
        height = y1 - y0
        width = height * RATIO
        cx = (x0 + x1) / 2
        x0, x1 = cx - width / 2, cx + width / 2
        if x0 < 0:
            x0, x1 = 0, width
        if x1 > w:
            x0, x1 = w - width, w

        out = src.crop((round(x0), round(y0), round(x1), round(y1)))
        out.save(f'{DST}/{name}-{take}.webp', 'WEBP', quality=90, method=6)
        print(f'{name}-{take}: {out.size[0]}x{out.size[1]}')


for shot_name, geometry in CROPS.items():
    crop(shot_name, geometry)
