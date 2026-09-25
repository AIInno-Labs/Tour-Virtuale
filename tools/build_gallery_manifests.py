"""
Writes a manifest.json into every place folder under assets/gallery/ and assets/gallery-night/,
listing whatever image files are actually sitting in that folder. This is what lets a gallery photo
be added or removed just by dropping/deleting a file - no scenes.js edit, no renaming, no count.

Runs automatically on every push via .github/workflows/gallery-manifests.yml. To run it by hand:
    python tools/build_gallery_manifests.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
BASES = ["assets/gallery", "assets/gallery-night"]


def is_image(name):
    return os.path.splitext(name)[1].lower() in IMAGE_EXTS


def build(base):
    base_path = os.path.join(ROOT, base)
    if not os.path.isdir(base_path):
        return
    for area in sorted(os.listdir(base_path)):
        area_path = os.path.join(base_path, area)
        if not os.path.isdir(area_path):
            continue
        for place in sorted(os.listdir(area_path)):
            place_path = os.path.join(area_path, place)
            if not os.path.isdir(place_path):
                continue
            files = sorted(f for f in os.listdir(place_path) if is_image(f))
            manifest_path = os.path.join(place_path, "manifest.json")
            with open(manifest_path, "w", encoding="utf-8", newline="\n") as fh:
                json.dump(files, fh, ensure_ascii=False, indent=2)
                fh.write("\n")
            print(f"{base}/{area}/{place}: {len(files)} photo(s)")


if __name__ == "__main__":
    for b in BASES:
        build(b)
