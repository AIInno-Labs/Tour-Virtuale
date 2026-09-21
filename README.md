# Cala dei Balcani - 360 virtual tour

A browser-based 360 tour built with plain **HTML + CSS + JavaScript** and the free
[Marzipano](https://www.marzipano.net/) viewer (Apache-2.0, bundled in `vendor/`).
There is no server, database, build step or third-party platform: upload the folder to any static host.
Fonts are bundled too, so nothing is loaded from outside.

- 42 places (outdoor areas and interiors) linked by walk-to arrows, in **Italian (default) and English**
- Works on desktop, tablet and phone (touch drag, pinch, back gesture)
- Photo galleries per place, area list, menu, contact card, readable share links

---

## 1. Run it locally

Browsers block the tile files when a page is opened by double-click, so use any static server:

```
python -m http.server 8000
```

then open http://localhost:8000 (or `http://localhost:8000/#hall-2` to open a place directly).

## 2. What is in the folder

| Path | What it is | Edit? |
|---|---|---|
| `index.html` | The page (top bar, panels, welcome screen, gallery markup) | rarely |
| `js/scenes.js` | **All the tour content**: places, links between them, chapters, home screen, contact details | **yes** |
| `js/i18n.js` | Interface texts in English and Italian | sometimes |
| `js/app.js` | The viewer logic (navigation, transition, menu, gallery, language, URLs) | rarely |
| `css/style.css` | All styling. Colours and fonts are variables at the top | sometimes |
| `assets/tiles/` | The panoramas, cut into small tiles (one folder per place) | generated |
| `assets/thumbs/` | Small preview picture per place (menu list and hotspot cards) | generated |
| `assets/gallery/<place-id>/` | Extra photos per place (`01.jpg`, `02.jpg` ...) | **yes** |
| `assets/` | Logo, emblem, browser-tab icon | when the logo changes |
| `assets/fonts/` | Bodoni Moda, Instrument Sans, IBM Plex Mono (self-hosted) | no |
| `vendor/marzipano.js` | The viewer library, unmodified | no |
| `tools/build_tiles.py` | Turns the original panoramas into `assets/tiles/` and `assets/thumbs/` (runs on your computer only) | no |

The original 12000 px panoramas (`images/`, about 2 GB) are **not** part of the website and are kept outside the repository.

## 3. How the tour behaves (for visitors)

- **Welcome screen**: logo, one line of text and a *Start the tour* button. The background is the aerial panorama.
- **Hotspots**: small bobbing arrows standing on the spot you can walk to. Hover one on desktop to see a thumbnail card
  with the place name; on touch screens a name tag sits above the arrow.
- **Changing place**: the view pushes forward toward the clicked arrow with a speed trail (no rotation). The new place
  loads underneath while the push plays; the "360" pill fills like a progress bar; then the trail dissolves.
- **Auto-rotate** is on by default and pauses while you drag or hover an arrow (play/pause button in the top bar).
- **Photos**: places that have a gallery show a Photos button in the top bar. The gallery opens as a grid that keeps every
  photo's own proportions; clicking a photo opens it large with a thumbnail strip underneath.
- **Language**: the round IT / EN button (always visible) switches the whole interface and place names; the choice is remembered.
- **Day / night**: a sun / moon button (top right on desktop and tablet, inside the Menu on phones). It starts from the visitor's
  system theme. **It only records the choice for now** - see "Connecting night panoramas" below.
- **Share links** use the place name and follow the language: `#oak-tree-2` (English) or `#quercia-2` (Italian).
  Old links with the file code (`#18quercia2`) still work. The browser back button / back gesture walks back through places.

### Layout by screen size

| Screen | Layout |
|---|---|
| Desktop / laptop | Top left: logo, Back, Areas. Top right: Photos, Pause/Play, Fullscreen, Day/Night, Language, Inquire, Menu. Bottom left: place name with Previous / Next. Bottom centre: 360 pill (look left / right). Bottom right: zoom. |
| Tablet (up to 1024 px) | Same, with icon-only buttons and a smaller place name. |
| Phone (up to 700 px) | Top left: logo and name (wraps to two lines). Top right: Photos, Pause/Play, Fullscreen, Language, Menu. Bottom left: place name with Previous / Next. Bottom right: round Areas button. Inquire and Day/Night live in the Menu. There is no Back button: use the phone's back gesture. |

### Keyboard

Arrow keys look around, `+` / `-` zoom, `PageUp` / `PageDown` previous / next place, `M` Menu, `A` Areas, `Esc` closes panels / gallery.

## 4. Editing content

Almost everything is in **`js/scenes.js`**. After any change, do a hard refresh (Ctrl+F5) - see section 7.

### A place (scene)

```js
{ id: "18quercia2", chapter: "garden", name: "Oak Tree 2", nameIt: "Quercia 2",
  view: { yaw: -171, pitch: -12 },
  links: [{ to: "19sala1", yaw: -174, pitch: 13 }, { to: "16giardino2", yaw: 94, pitch: 19 }],
  gallery: { folder: "assets/gallery/11torre3", count: 10 } }
```

| Field | Meaning |
|---|---|
| `id` | Must equal the tile folder name in `assets/tiles/`. It is the panorama file name in lowercase, without spaces, underscores or extension (`17_Quercia1.jpg` -> `17quercia1`). |
| `chapter` | Key from `chapters` (groups the place in the Areas list). |
| `name` / `nameIt` | English / Italian title. If `nameIt` is missing the English name is shown. Both also become the share link. |
| `view` | Direction the visitor faces on arrival, in degrees. `yaw` 0 = centre of the picture, positive = right. `pitch` 0 = horizon, **positive = down**, negative = up. |
| `links` | The arrows: `to` (destination id), `yaw`, `pitch` (where the arrow stands). |
| `gallery` | Optional photo gallery: `folder` and `count` (how many numbered files to look for). |
| `pending: true` | Optional: the panorama is not available yet. The place and every arrow leading to it stay hidden. Delete this line once the tiles exist. |

The order of the places in the list is also the order of the Previous / Next buttons.
Fields that still appear in the file but are **no longer used**: `gallery.hotspot`, `home.start`, `contact.hours`, `contact.hoursIt`, `tagline`.

### Add or replace a panorama

1. Put the equirectangular JPG (2:1 ratio, e.g. 12000 x 6000) in an `images/` folder inside the project.
2. `pip install opencv-python numpy` (once), then `python tools/build_tiles.py`.
   Only new files are processed. `--force` rebuilds everything; `python tools/build_tiles.py 05Pineta1` rebuilds one file.
3. Add the place to `js/scenes.js` (see above) and link to it from neighbouring places.
4. Do **not** commit `images/`; only `assets/tiles/` and `assets/thumbs/` go online.

The viewer expects the tile layout the script produces (three levels: 512, 1536, 3072 px per cube face). If you change `LEVELS`
in `tools/build_tiles.py` you must change `LEVELS` and `FACE_SIZE` at the top of `js/app.js` to match.

### Move or add an arrow

Open `index.html?edit=1`, click the exact spot in the panorama: a line like `{ to: "", yaw: 12, pitch: 5 }` is copied to the
clipboard and shown on screen. Paste it into the place's `links` and fill in `to`. (Edit mode skips the welcome screen.)

### Photo galleries

Each gallery reads `assets/gallery/<place-id>/01.jpg ... 10.jpg`. Missing numbers are skipped, so 4 photos work fine.
Landscape and portrait both work and nothing is cropped. To give another place a gallery, add
`gallery: { folder: "assets/gallery/<place-id>", count: 10 }` to it and put the photos in that folder.
**The photos in the repository right now are stand-ins** rendered from the panoramas - replace them with the real photos using
the same file names (JPG, about 1600 px on the long side).

### Texts and languages

- Interface texts (buttons, menu, hints): `js/i18n.js`, English and Italian side by side. Keep both languages complete.
- Place and area names: `name` / `nameIt` in `js/scenes.js`. Welcome sentence: `home.lead` / `home.leadIt`
  (words between `*stars*` are highlighted).
- The Italian texts were written by us and should be read by a native speaker before launch.

### Welcome screen

`home` in `js/scenes.js`: `scene` (background panorama, currently the aerial drone shot), `view` (its opening direction),
`startScene` (where *Start the tour* goes).

### Contact details

`contact` in `js/scenes.js`: `phone` and `email`. **They are dummy values (`+39 000 000 0000`, `info@example.com`) - replace them.**
The phone number appears in the Inquire card and at the bottom of the Menu; on phones it dials when tapped.

### Floor plan (optional)

Put the plan image in `assets/` and set in `js/scenes.js`:
`map: { image: "assets/plan.png", pins: { "01parcheggio": { x: 12, y: 80 } } }` (x / y are percentages of the image).
A Plan button and a Floor plan menu entry then appear automatically.

### Colours and fonts

Variables at the top of `css/style.css` (`--abyss`, `--lagoon`, `--chalk` ...). The palette comes from the logo.

### Connecting night panoramas (later)

The day / night button already exists. To make it work: create night tiles with `tools/build_tiles.py`, add a night version to
each place in `js/scenes.js`, and switch the tile source in `getScene` in `js/app.js` when `mode` changes (`setMode`).

## 5. Deploying

Upload these to any static host:

```
index.html   css/   js/   vendor/   assets/  (fonts, tiles, thumbs, gallery and the logos)
```

(about 580 MB, almost all of it `assets/tiles/`). Do **not** upload `images/`, `tools/` or the client brief.

- **Vercel**: import the repository, framework "Other", no build command, output directory = root.
- **GitHub Pages**: Settings -> Pages -> branch `main`, folder `/ (root)`. All paths are relative and share links use `#`, so
  it works under `/repo-name/` with no server settings.
- Check the host's terms for commercial use (Vercel's free plan is non-commercial only).
- Adding panoramas grows the site by about 13 MB per place.

## 6. Status and known to-dos

- **Contact details are dummy values** (see above).
- **Gallery photos are stand-ins** rendered from the panoramas (see above).
- **`12TorreDrone` is a provisional drone photo.** It has no picture data at the very top and behind the camera, so
  `tools/build_tiles.py` fills those areas with a soft sky (`FIXES`). Replace the file when the new drone shot arrives
  (and tune `home.view`).
- **`18Quercia2` (Oak Tree 2) was rebuilt from the reference tour's tiles** because the original file was missing. It is about the
  same resolution but was compressed twice. Replace it with the original: put `18Quercia2.jpg` in `images/` and run
  `python tools/build_tiles.py 18Quercia2`.
- **Arrow positions and opening directions were copied from the reference tour** (`fotocantoro.it/calagiorno`) and should be checked
  against the floor plan.
- **Day / night is only a button** until night panoramas exist.
- The source file names contain small numbering slips (two files with the same number, gaps at 18 and 38). They do not affect the tour.

## 7. Troubleshooting

- **A change does not show up**: the browser cached the old files. Hard refresh (Ctrl+F5). When you deploy an update, also bump the
  `?v=` number on the three script tags and the stylesheet link in `index.html` (currently `?v=32`) so visitors get the new files.
- **Blank screen / no tiles when opening `index.html`**: use a local server (section 1).
- **A place does not appear in the menu**: its `id` does not match a folder in `assets/tiles/`, or it is marked `pending: true`.
- **An arrow leads nowhere**: the `to` id does not exist or the target is `pending`; hidden targets are skipped silently.
- **Arrows jump or hotspots look shifted after re-tiling**: `LEVELS` / `FACE_SIZE` in `js/app.js` must match `tools/build_tiles.py`.
- **The transition feels too fast / slow or the trail too strong**: `PUSH`, `MAXS` and `MAXT` in the `goTo` function of `js/app.js`.
