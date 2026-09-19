# Cala dei Balcani - virtual tour

Static HTML + CSS + JavaScript built on [Marzipano](https://www.marzipano.net/) (Apache-2.0, bundled in `vendor/`).
No server, database or third-party hosting: upload the folder to any web host. Fonts are bundled in `fonts/`.

## What to upload

```
index.html   css/   js/   vendor/   fonts/   assets/   tiles/   thumbs/   gallery/
```

`images/` (the 12000 px originals), `tools/` and `Istruzioni .docx` are not needed online.
To test locally run `python -m http.server 8000` and open http://localhost:8000
(double-clicking index.html will not load the tiles because of browser security rules).

## How the tour works

- **Home screen**: logo, short text and "Start the walk". Its background panorama is set in `home` in `js/scenes.js`
  (currently `12TorreDrone`, a provisional drone shot; change `home.scene` / `home.view` when the new photo arrives).
- **Hotspots** are small bobbing arrows standing on the spot you can walk to. Hover one (desktop) to see a thumbnail card with the name of the place; on touch screens a name tag sits above the arrow. Positions and opening directions were copied from the reference tour.
- **Moving between scenes**: the view pushes forward toward the clicked arrow with a radial speed trail (no rotation). The new place is switched in underneath the trail straight away, so it loads while the push plays; the 360 pill fills as a progress bar; then the trail dissolves as the new place settles in. Timings and trail strength (`PUSH`, `MAXS`, `MAXT`) are in the `goTo` function of `js/app.js`.
- **Auto-rotate** is on by default (button in the top bar). It pauses while you drag or hover an exit and resumes after 3 seconds.
- **Day / night** toggle (bottom right) starts from the visitor's system theme (dark = night, light = day). It is only a button for now: when night panoramas exist, connect them in `setMode` in `js/app.js`. +/- zoom. Keyboard: arrow keys look around, +/- zoom, PageUp/PageDown previous/next scene, M opens the Menu, A opens the Areas list.
- **Top left**: logo (returns to the welcome screen), **Back** (previous place, or the welcome screen at the start) and **Areas** (all places by area).
- **Top right**: Photos / Auto-rotate / Fullscreen icons, **Inquire** (phone card) and **Menu** (Start the walk, Explore places, Aerial view, Photo galleries, Floor plan, Share this view, Welcome screen).
- **Contact details** (dummy for now) are in `contact` in `js/scenes.js`: phone, email, opening hours. Replace them with the real ones.
- **Welcome text**: `home.lead` in `js/scenes.js`; words between `*stars*` are highlighted.
- **Photos**: scenes with a gallery show a Photos button in the top bar (nothing is placed inside the panorama).

## Updating content (all in `js/scenes.js`)

**Photo galleries.** Each gallery reads `gallery/<scene-id>/01.jpg ... 10.jpg`. The current files are snapshots rendered from each panorama (stand-ins). Replace them with real photos
using the same names (JPG, about 1600 px on the long side; landscape and portrait both work). If you have fewer than 10 photos,
delete the extra numbers: missing files are skipped. To give another scene a gallery add
`gallery: { folder: "gallery/<scene-id>", count: 10, hotspot: { yaw: 0, pitch: 10 } }` to it.

**A scene that is not in the folder yet.** A scene marked `pending: true` has no panorama yet.
While pending, the scene and every hotspot leading to it stay hidden. When you have `18Quercia2.jpg`: put it in `images/`,
run `python tools/build_tiles.py`, and delete `pending: true`.

**New panorama.** Put the 2:1 JPG in `images/`, run `pip install opencv-python numpy` once, then `python tools/build_tiles.py`
(only new files are processed; `--force` rebuilds all). Add the scene to `js/scenes.js`; its `id` is the file name in lowercase
without spaces, underscores or extension.

**Move or add a hotspot.** Open `index.html?edit=1`, click the exact spot in the panorama; a line like
`{ to: "", yaw: 12, pitch: 5 }` is copied and shown. Paste it into the scene's `links` and fill in `to`.
Pitch: 0 is the horizon, positive is down, negative is up.

**Floor plan.** Put the image in `assets/` and set `map: { image: "assets/plan.png", pins: { "01parcheggio": { x: 12, y: 80 } } }`;
a Plan button appears.

**Colours and type.** Variables at the top of `css/style.css`.

## Notes

- Tiles total about 540 MB (about 13 MB per scene); only the parts being viewed are downloaded.
- `12TorreDrone` has no image data near the top and behind the camera; `tools/build_tiles.py` fills those areas (see `FIXES`).
- Direct links use the place name: `index.html#oak-tree-2` (English) or `#quercia-2` (Italian). The address follows the language switch, and old links with the file code (`#18quercia2`) still open the right place.

## Languages

Italian is the default; the round IT / EN button (top right, on every screen) shows the current language, switches the whole interface on click and remembers the choice.
- Interface texts: `js/i18n.js` (both languages side by side).
- Places, areas, welcome text, opening hours: `js/scenes.js`, fields ending in `It` (`nameIt`, `leadIt`, `hoursIt`).
- A new place needs its `nameIt` next to `name`; if it is missing the English name is shown.
