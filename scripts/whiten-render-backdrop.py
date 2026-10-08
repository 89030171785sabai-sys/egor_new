"""Lift the water-circuit render's backdrop to pure white.

The render arrived on a #fdfdfd plate — two units off the white of the card it
sits in. That is invisible on its own and unmistakable as a rectangle: the eye
finds the straight edge long before it finds the shade. Fading the edges with
a mask only blurred the line.

So the plate is flooded from the border and set to white. Only backdrop
connected to the frame's edge is touched, which leaves the light glass and the
highlights inside the product alone, and the anti-aliased pixels right against
the product are left as they are — a two-unit halo nobody can see, where a
hard threshold would leave a cut-out edge.

    python3 scripts/whiten-render-backdrop.py
"""
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = 'assets/photos-src/benefit-water-circuit.webp'
DST = 'public/photos/benefit-water-circuit.webp'

# The plate's own value, and how far a pixel may stray and still be plate.
PLATE = 253
TOLERANCE = 3

image = Image.open(SRC).convert('RGB')
pixels = np.asarray(image).astype(np.int16)

near = np.abs(pixels - PLATE).max(axis=2) <= TOLERANCE
labels, _ = ndimage.label(near)
edge = set(labels[0]) | set(labels[-1]) | set(labels[:, 0]) | set(labels[:, -1])
edge.discard(0)
plate = np.isin(labels, list(edge))

out = pixels.copy()
out[plate] = 255
Image.fromarray(out.astype(np.uint8)).save(DST, 'WEBP', quality=92, method=6)
print(f'плита: {plate.mean():.1%} кадра выбелено')
