"""
Convert equirectangular 360 JPGs (images/) into Marzipano cube-map tiles (assets/tiles/<area>/<id>/)
and small thumbnails (assets/thumbs/<area>/<id>.jpg). <area> is read from each scene's chapter in
js/scenes.js, so a new panorama must have its scene entry (with the right chapter) added there first.

Usage:
    python tools/build_tiles.py              # process only new images
    python tools/build_tiles.py --force      # rebuild everything
    python tools/build_tiles.py 05Pineta1    # rebuild one image (name without .jpg)

Requires: pip install opencv-python numpy
"""
import os
import re
import sys
import math
from multiprocessing import Pool

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "images")
OUT_TILES = os.path.join(ROOT, "assets", "tiles")
OUT_THUMBS = os.path.join(ROOT, "assets", "thumbs")
SCENES_JS = os.path.join(ROOT, "js", "scenes.js")
OUT_PREVIEW = os.environ.get("PREVIEW_DIR")  # optional: low-res equirect previews


def slugify(s):
    """Same rule as the site's own slugify() in app.js, so folder names always match."""
    import unicodedata
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("'", "").replace("’", "")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def load_scene_folders():
    """Tiles / thumbnails are grouped on disk by area, in a folder named after the chapter's
    Italian name (js/scenes.js is the only place that says which scene belongs to which chapter,
    so it is read from there instead of being duplicated here)."""
    src = open(SCENES_JS, encoding="utf-8").read()
    chapter_folder = {}
    for cid, name_it in re.findall(r'\{ id: "([a-z]+)", name: "[^"]*", nameIt: "([^"]*)" \}', src):
        chapter_folder[cid] = slugify(name_it)
    scene_folder = {}
    for sid, cid in re.findall(r'\{ id: "([a-zA-Z0-9]+)"(?:, homeOnly: true)?, chapter: "([a-z]+)"', src):
        if cid in chapter_folder:
            scene_folder[sid] = chapter_folder[cid]
    return scene_folder


SCENE_FOLDER = load_scene_folders()

# (face size in px, tile size in px). Index in this list == {z} in the tile URL.
LEVELS = [(512, 512), (1536, 1536), (3072, 1536)]
QUALITY = 85
FACES = ["f", "b", "l", "r", "u", "d"]


def fill_empty_border(img, keep=()):
    """Fill blank (pure white) regions touching the image border. Used for drone panoramas
    that have no data near the poles / behind the camera.
    keep: (cx, cy, r) circles in relative width units where white is real (e.g. the sun)."""
    h, w = img.shape[:2]
    white = (img.min(axis=2) >= 250).astype(np.uint8)
    white = cv2.morphologyEx(white, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    n, labels, stats, _ = cv2.connectedComponentsWithStats(white, connectivity=4)
    hole = np.zeros((h, w), np.uint8)
    for i in range(1, n):
        x, y, cw, ch, area = stats[i]
        if area > 20000 and (x == 0 or y == 0 or x + cw == w or y + ch == h):
            hole[labels == i] = 1
    if not hole.any():
        return img
    for cx, cy, r in keep:
        cv2.circle(hole, (int(cx * w), int(cy * w)), int(r * w), 0, -1)
    hole = cv2.dilate(hole, np.ones((7, 7), np.uint8))

    sw, sh = w // 2, h // 2
    small = cv2.resize(img, (sw, sh), interpolation=cv2.INTER_AREA).astype(np.float32)
    hs = cv2.resize(hole, (sw, sh), interpolation=cv2.INTER_NEAREST).astype(bool)
    filled = small.copy()
    xs = np.arange(sw)
    rows_done = np.zeros(sh, bool)
    for y in range(sh):
        valid = ~hs[y]
        if valid.sum() < 0.4 * sw:
            continue
        vx = xs[valid]
        for c in range(3):
            filled[y, :, c] = np.interp(xs, vx, small[y, valid, c], period=sw)
        rows_done[y] = True
    last = None
    for y in range(sh):
        if rows_done[y]:
            last = y
            break
    for y in range(last - 1, -1, -1):
        filled[y] = filled[last]
    for y in range(sh):
        if not rows_done[y] and y > last:
            filled[y] = filled[y - 1]
    filled = cv2.GaussianBlur(filled, (0, 0), 25)
    big = cv2.resize(filled, (w, h), interpolation=cv2.INTER_CUBIC)
    soft = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 3)[..., None]
    out = img.astype(np.float32) * (1 - soft) + big * soft
    return np.clip(out, 0, 255).astype(np.uint8)


# Panoramas that need a fix before tiling (file stem -> function)
FIXES = {"12TorreDrone": lambda im: fill_empty_border(im, keep=[(0.23, 0.21, 0.05)])}


def scene_id(filename):
    stem = os.path.splitext(filename)[0]
    return re.sub(r"[^a-z0-9]", "", stem.lower())


def face_map(face, size, w, h):
    j, i = np.mgrid[0:size, 0:size].astype(np.float32)
    u = (i + 0.5) / size * 2 - 1
    v = 1 - (j + 0.5) / size * 2
    one = np.ones_like(u)
    x, y, z = {
        "f": (u, v, one),
        "b": (-u, v, -one),
        "l": (-one, v, u),
        "r": (one, v, -u),
        "u": (u, one, -v),
        "d": (u, -one, v),
    }[face]
    lon = np.arctan2(x, z)
    lat = np.arctan2(y, np.sqrt(x * x + z * z))
    map_x = ((lon / (2 * math.pi) + 0.5) * w - 0.5).astype(np.float32)
    map_y = ((0.5 - lat / math.pi) * h - 0.5).astype(np.float32)
    return map_x, map_y


def build(filename):
    sid = scene_id(filename)
    folder = SCENE_FOLDER.get(sid)
    if not folder:
        return sid, "unknown chapter - add this scene to js/scenes.js first, then re-run"
    out = os.path.join(OUT_TILES, folder, sid)
    thumb_dir = os.path.join(OUT_THUMBS, folder)
    cv2.setNumThreads(2)
    img = cv2.imread(os.path.join(SRC, filename), cv2.IMREAD_COLOR)
    if img is None:
        return sid, "unreadable"
    top = LEVELS[-1][0]
    target_w = top * 4
    if img.shape[1] != target_w:
        img = cv2.resize(img, (target_w, target_w // 2), interpolation=cv2.INTER_AREA)
    stem = os.path.splitext(filename)[0]
    if stem in FIXES:
        img = FIXES[stem](img)
    h, w = img.shape[:2]

    if OUT_PREVIEW:
        os.makedirs(OUT_PREVIEW, exist_ok=True)
        small = cv2.resize(img, (1000, 500), interpolation=cv2.INTER_AREA)
        cv2.imwrite(os.path.join(OUT_PREVIEW, sid + ".jpg"), small, [cv2.IMWRITE_JPEG_QUALITY, 80])

    for face in FACES:
        mx, my = face_map(face, top, w, h)
        big = cv2.remap(img, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_WRAP)
        if face == "f":
            side = cv2.resize(big, (1024, 1024), interpolation=cv2.INTER_AREA)
            crop = side[224:224 + 576, :]
            crop = cv2.resize(crop, (480, 270), interpolation=cv2.INTER_AREA)
            os.makedirs(thumb_dir, exist_ok=True)
            cv2.imwrite(os.path.join(thumb_dir, sid + ".jpg"), crop, [cv2.IMWRITE_JPEG_QUALITY, 78])
        for z, (size, tile) in enumerate(LEVELS):
            level = big if size == top else cv2.resize(big, (size, size), interpolation=cv2.INTER_AREA)
            n = size // tile
            for y in range(n):
                d = os.path.join(out, str(z), face, str(y))
                os.makedirs(d, exist_ok=True)
                for x in range(n):
                    t = level[y * tile:(y + 1) * tile, x * tile:(x + 1) * tile]
                    cv2.imwrite(os.path.join(d, f"{x}.jpg"), t, [cv2.IMWRITE_JPEG_QUALITY, QUALITY])
    return sid, "ok"


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    files = sorted(f for f in os.listdir(SRC) if f.lower().endswith((".jpg", ".jpeg")))
    if args:
        files = [f for f in files if os.path.splitext(f)[0] in args]
        force = True
    def already_built(f):
        sid = scene_id(f)
        folder = SCENE_FOLDER.get(sid)
        return folder and os.path.isdir(os.path.join(OUT_TILES, folder, sid))
    todo = [f for f in files if force or not already_built(f)]
    print(f"{len(todo)} of {len(files)} images to process", flush=True)
    with Pool(3) as pool:
        for sid, status in pool.imap_unordered(build, todo):
            print(f"  {sid}: {status}", flush=True)
