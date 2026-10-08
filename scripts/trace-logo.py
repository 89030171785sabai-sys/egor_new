"""Trace the logo picture into the single contour `src/components/ui/Logo.tsx` draws.

The logo is supplied as a square picture on a white plate. Carried as an image
it would blur at the size the footer shows it and could not change colour, so
it is traced once into a path: sharp at any size, and inherited colour, which
is what lets one drawing serve the white header and the dark footer.

Polarity matters — the tracer reads a bitmap where the *low* values are the
shape, so the ink mask goes in inverted. Traced the other way round it returns
the plate with the letters punched out of it, which renders as a solid block.

    python3 scripts/trace-logo.py

Prints the path; paste it into `ARTWORK` and regenerate `public/favicon.svg`
with the emblem crop.
"""
import numpy as np
import potrace
from PIL import Image

SRC = 'assets/brand/logo.png'

image = Image.open(SRC).convert('L')
ink = np.asarray(image) < 128

# turdsize drops specks left by the scan; the rest is potrace's defaults for
# curve fitting, which hold the serifs and the flames without over-smoothing.
path = potrace.Bitmap(~ink).trace(turdsize=6, alphamax=1.0, opticurve=True, opttolerance=0.2)

point = lambda q: f'{q.x:.1f} {q.y:.1f}'
parts = []
for curve in path:
    parts.append('M' + point(curve.start_point))
    for segment in curve:
        parts.append(
            'L' + point(segment.c) + 'L' + point(segment.end_point)
            if segment.is_corner
            else 'C' + point(segment.c1) + ' ' + point(segment.c2) + ' ' + point(segment.end_point)
        )
    parts.append('Z')
print(''.join(parts))

# Where the three parts of the lockup sit, for the crops.
rows = ink.any(axis=1)
bands, start = [], None
for y, on in enumerate(rows):
    if on and start is None:
        start = y
    if not on and start is not None:
        bands.append((start, y - 1))
        start = None
if start is not None:
    bands.append((start, len(rows) - 1))
for top, bottom in bands:
    cols = np.where(ink[top : bottom + 1].any(axis=0))[0]
    print(f'# band y {top}-{bottom}  x {cols.min()}-{cols.max()}')
