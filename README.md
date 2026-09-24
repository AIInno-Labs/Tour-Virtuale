# Cala dei Balcani - 360 virtual tour

A browser-based 360 tour built with plain **HTML + CSS + JavaScript** and the free
[Marzipano](https://www.marzipano.net/) viewer (Apache-2.0, bundled in `vendor/`).
There is no server, database, build step or third-party platform: upload the folder to any static host.
Fonts are bundled too, so nothing is loaded from outside.

- 42 day places (outdoor areas and interiors) linked by walk-to hotspots, in **Italian (default) and English**
- A separate **night view** with its own 38 places, own names, own area list and its own Previous / Next order - see
  "Night view" below
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
| `assets/tiles/<area>/` | The panoramas, cut into small tiles (one folder per place, grouped by area - see below) | generated |
| `assets/thumbs/<area>/` | Small preview picture per place (menu list and hotspot cards), grouped by area | generated |
| `assets/gallery/<area>/<place-id>/` | Extra photos per place (`01.jpg`, `02.jpg` ...) | **yes** |
| `assets/` | Logo, emblem, browser-tab icon | when the logo changes |
| `assets/fonts/` | Bodoni Moda, Instrument Sans, IBM Plex Mono (self-hosted) | no |
| `vendor/marzipano.js` | The viewer library, unmodified | no |
| `tools/build_tiles.py` | Turns the original panoramas into `assets/tiles/<area>/` and `assets/thumbs/<area>/` (runs on your computer only) | no |

The original 12000 px panoramas (`images/`, about 2 GB) are **not** part of the website and are kept outside the repository.

## 3. How the tour behaves (for visitors)

- **Welcome screen**: logo, one line of text and a *Start the tour* button. The background is the aerial panorama, and it
  is always the same photo whether the visitor is in day or night mode.
- **Hotspots**: a flat, round direction pin standing on the spot you can walk to, with an arrow inside pointing the way -
  no bobbing/idle animation, no hover-scale. Hover one on desktop to see a thumbnail card with the place name; on touch
  screens a name tag sits above the pin.
- **Changing place**: the view pushes forward toward the clicked pin with a speed trail (no rotation). The new place
  loads underneath while the push plays; the "360" pill fills like a progress bar; then the trail dissolves.
- **Auto-rotate** is on by default and pauses while you drag or hover a hotspot (play/pause button in the top bar).
- **Gallery**: places that have a photo gallery show a Gallery button in the top bar. The gallery opens as a grid that
  keeps every photo's own proportions; clicking a photo opens it large with a thumbnail strip underneath. Galleries work
  the same in day and night mode.
- **Language**: the round IT / EN button (always visible) switches the whole interface and place names; the choice is remembered.
- **Day / night**: a sun / moon button (top right on desktop and tablet, inside the Menu on phones) switches to a
  completely separate night tour - its own places, names, area list and Previous / Next order (only the photo gallery is
  shared between the two). If the current place has no night photo, it jumps to the nearest place (in tour order) that
  does. The choice is remembered across visits (like the language), and *Start the tour* (welcome screen button or Menu)
  opens the first place of whichever tour - day or night - is currently selected. See "Night view" below for how the data
  is put together.
- **Share links** use the place name and follow the language: `#oak-tree-2` (English) or `#quercia-2` (Italian).
  Old links with the file code (`#18quercia2`) still work. The browser back button / back gesture walks back through places.

### Layout by screen size

| Screen | Layout |
|---|---|
| Desktop / laptop | Top left: logo, Back, Areas. Top right: Gallery, Pause/Play, Fullscreen, Day/Night, Language, Website, Inquire, Menu. Bottom left: place name with Previous / Next. Bottom centre: 360 pill (look left / right). Bottom right: zoom. |
| Tablet (up to 1024 px) | Same, with icon-only buttons and a smaller place name. |
| Phone (up to 700 px) | Top left: logo and name (wraps to two lines). Top right: Pause/Play, Fullscreen, Language, Website, Menu. Bottom left: place name with Previous / Next. Bottom right: round Gallery and Areas buttons (Gallery sits to the left of Areas). Inquire and Day/Night live in the Menu. There is no Back button: use the phone's back gesture. |

### Keyboard

Arrow keys look around, `+` / `-` zoom, `PageUp` / `PageDown` previous / next place, `M` Menu, `A` Areas, `Esc` closes panels / gallery.

## 4. Editing content

Almost everything is in **`js/scenes.js`**. After any change, do a hard refresh (Ctrl+F5) - see section 7.

For a full, step-by-step walkthrough of adding a brand-new place or a photo gallery - including
where the `images/` folder goes and exactly what to write and where - see **`INSTRUCTIONS.md`**.

### A place (scene)

```js
{ id: "18quercia2", chapter: "garden", name: "Oak Tree 2", nameIt: "Quercia 2",
  view: { yaw: -171, pitch: -12 },
  links: [{ to: "19sala1", yaw: -174, pitch: 13 }, { to: "16giardino2", yaw: 94, pitch: 19 }],
  gallery: { folder: "assets/gallery/la-torre/11torre3", count: 10 } }
```

| Field | Meaning |
|---|---|
| `id` | Must equal the tile folder name inside its area in `assets/tiles/<area>/`. It is the panorama file name in lowercase, without spaces, underscores or extension (`17_Quercia1.jpg` -> `17quercia1`). |
| `chapter` | Key from `chapters` (groups the place in the Areas list). This also decides `<area>`: it is the chapter's `nameIt` turned into a folder name (spaces to dashes, lowercase) - e.g. chapter `tower` ("La Torre") stores its tiles under `assets/tiles/la-torre/`. `tools/build_tiles.py` works this out on its own by reading `chapters` here, so a new place only needs the right `chapter`, nothing to set by hand. |
| `name` / `nameIt` | English / Italian title. If `nameIt` is missing the English name is shown. Both also become the share link. |
| `view` | Direction the visitor faces on arrival, in degrees. `yaw` 0 = centre of the picture, positive = right. `pitch` 0 = horizon, **positive = down**, negative = up. |
| `links` | The arrows: `to` (destination id), `yaw`, `pitch` (where the arrow stands). |
| `gallery` | Optional photo gallery: `folder` and `count` (how many numbered files to look for). |
| `pending: true` | Optional: the panorama is not available yet. The place and every arrow leading to it stay hidden. Delete this line once the tiles exist. |
| `night` | Optional: makes this place exist at night too. `{ positions, view, name, nameIt }` - see "Night view" below. A place with no `night` field simply does not exist in night mode. |
| `homeOnly: true` | Only ever used once, for the welcome-screen background (`panohome`). Keeps a scene out of Areas and Previous / Next entirely. |
| `nightOnly: true` | The opposite of `homeOnly`: a place that only exists at night, with no day photo at all (see "Night view"). |

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

### Move or add a hotspot

Open `index.html?edit=1`, click the exact spot in the panorama: a line like `{ to: "", yaw: 12, pitch: 5 }` is copied to the
clipboard and shown on screen. Paste it into the place's `links` (or, in night mode, its `night.positions`) and fill in `to`.
(Edit mode skips the welcome screen.)

### Photo galleries

Each gallery reads `assets/gallery/<area>/<place-id>/01.jpg ... 10.jpg`. Missing numbers are skipped, so 4 photos work fine.
Landscape and portrait both work and nothing is cropped. To give another place a gallery, add
`gallery: { folder: "assets/gallery/<area>/<place-id>", count: 10 }` to it and put the photos in that folder. Galleries are
shared between day and night mode - there is only ever one gallery per place, not a day and a night version.

### Texts and languages

- Interface texts (buttons, menu, hints): `js/i18n.js`, English and Italian side by side. Keep both languages complete.
- Place and area names: `name` / `nameIt` in `js/scenes.js`. Welcome sentence: `home.lead` / `home.leadIt`
  (words between `*stars*` are highlighted).
- The Italian texts were written by us and should be read by a native speaker before launch.

### Welcome screen

`home` in `js/scenes.js`: `scene` (background panorama - a dedicated `homeOnly: true` scene that
does not appear in Areas or Previous / Next), `aerial` (which place the Menu's *Aerial view* item
opens), `view` (the background's opening direction), `startScene` (where *Start the tour* goes).

### Contact details

`contact` in `js/scenes.js`: `phone`, `email` and `website`. They appear in the Inquire card, at the bottom of the Menu,
and on the Website button in the top bar; on phones the phone number dials when tapped.

### Floor plan (optional)

Put the plan image in `assets/` and set in `js/scenes.js`:
`map: { image: "assets/plan.png", pins: { "01parcheggio": { x: 12, y: 80 } } }` (x / y are percentages of the image).
A Plan button and a Floor plan menu entry then appear automatically.

### Colours and fonts

Variables at the top of `css/style.css` (`--abyss`, `--lagoon`, `--chalk` ...). The palette comes from the logo.

### Night view

Night is a **second, independent tour** layered on top of the day one, not a reskin of it. A place's day identity
(`id`, `chapter`, day `name`/`nameIt`, day `view`, day `links`) never changes; everything night-specific lives in one
extra field, `night`, so the two can never leak into each other:

```js
{ id: "19sala1", chapter: "halls",
  night: { positions: { "20sala2": { yaw: 4.9, pitch: 13.9 }, "18quercia2": { yaw: 175.8, pitch: 22.3 } },
           view: { yaw: 4.9, pitch: 13.9 } },
  name: "Hall 1", nameIt: "Sala 1",
  view: { yaw: 3, pitch: 10 },
  links: [{ to: "18quercia2", yaw: -180, pitch: 32 }, { to: "20sala2", yaw: 5, pitch: 26 }] },
```

| `night` field | Meaning |
|---|---|
| `positions` | The **only** source of hotspots shown in night mode: `{ "<destination id>": { yaw, pitch } }`. Independent of `links` - a night place can connect to different neighbours than its day version, or to a `nightOnly` place that has no day version at all. |
| `view` | Opening direction in night mode. Always set it to face one of the place's own `positions` (a visitor should never open a night scene staring at the ground or a wall). |
| `name` / `nameIt` | Optional: only needed when the place should be called something different at night than during the day (e.g. `10torre2` is "Tower 2" by day but "Tower 3" at night, because a night-only photo gets inserted before it). Leave them out and the day name is reused. |

A place with no `night` field does not exist at night at all - it is skipped by every night-mode list (Areas, Previous /
Next, hotspots). The welcome-screen background (`panohome`) is deliberately given no `night` field, which is what
guarantees it looks identical in both modes.

**A place that only exists at night** (a photo with no day equivalent) is a normal scene entry with `nightOnly: true`
and no day `view`/`links` of its own - only `night.positions`/`night.view`, mirrored into `links` so both modes read
consistent data:

```js
{ id: "torre2b", chapter: "tower", nightOnly: true,
  night: { positions: { "10torre2": { yaw: 69.9, pitch: 9.8 }, "09torre1": { yaw: 165.9, pitch: 10.1 } },
           view: { yaw: 69.9, pitch: 9.8 } },
  name: "Tower 2", nameIt: "Torre 2",
  links: [{ to: "10torre2", yaw: 69.9, pitch: 9.8 }, { to: "09torre1", yaw: 165.9, pitch: 10.1 }] },
```

**Building night tiles** uses the same script, one flag added, and a folder to the side of `images/`:

```
images-night/<id>.jpg              # e.g. images-night/19sala1.jpg - named after the scene id directly, no camera-name step
python tools/build_tiles.py --night              # process only new night images
python tools/build_tiles.py --night --force       # rebuild all night tiles
python tools/build_tiles.py --night 19sala1       # rebuild one night image
```

This produces `assets/tiles-night/<area>/<id>/` and `assets/thumbs-night/<area>/<id>.jpg` (same `<area>` folder-naming
rule as the day tiles). The site picks tiles-night/thumbs-night automatically for any scene that has a `night` field
while night mode is on (`tileBase()` / `thumbSrc()` in `js/app.js`); a day-only place is simply never asked for its
night tiles.

**Matching a night photo to a place**: there is no shortcut for this - open each night panorama and the equivalent day
panorama side by side and confirm it is really the same physical spot before naming the file after that place's `id`.
Two night photos that look similar from a distance (e.g. two indoor hall shots) can still be genuinely different
viewpoints - check pixel content, not just the general impression, before assuming a match.

**Finding `night.positions` yaw/pitch values**: same tool as for day links - `index.html?edit=1`, in night mode, click
the spot in the panorama.

**Switching mode while touring**: `resolveNightTarget()` in `js/app.js` walks forward through the day order from the
current place until it finds one with a `night` field, so toggling to night from a day-only place always lands
somewhere sensible instead of showing an error. Toggling on the welcome screen never pre-navigates - it only remembers
the choice - so *Start the tour* still plays the normal loading animation for whichever tour is selected.

Night does **not** need to mirror day one-for-one: a chapter can have 2 night places where it has 5 day places, or a
night-only place with nothing on the day side, and none of this affects the day tour.

## 5. Deploying

Upload these to any static host:

```
index.html   css/   js/   vendor/   assets/  (fonts, tiles, tiles-night, thumbs, thumbs-night, gallery and the logos)
```

(almost all of it `assets/tiles/` and `assets/tiles-night/`). Do **not** upload `images/`, `images-night/`,
`images-night-raw/`, `tools/` or the client brief.

- **Vercel**: import the repository, framework "Other", no build command, output directory = root.
- **GitHub Pages**: Settings -> Pages -> branch `main`, folder `/ (root)`. All paths are relative and share links use `#`, so
  it works under `/repo-name/` with no server settings.
- Check the host's terms for commercial use (Vercel's free plan is non-commercial only).
- Adding panoramas grows the site by about 13 MB per place.

## 6. Status and known to-dos

- **Night view is fully built**: 38 night places, their own Areas list and Previous / Next order, hotspots matched
  against the client's reference tour, mode remembered across visits. See "Night view" above.
- **`12TorreDrone`** was replaced with the client-supplied `Torre04.jpg`. If a future replacement photo also has blank
  data at the very top / behind the camera, `tools/build_tiles.py` already fills that in (`FIXES`, keyed by file stem).
- **`18Quercia2` (Oak Tree 2) was rebuilt from the reference tour's tiles** because the original file was missing. It is about the
  same resolution but was compressed twice. Replace it with the original: put `18Quercia2.jpg` in `images/` and run
  `python tools/build_tiles.py 18Quercia2`.
- The source file names contain small numbering slips (two files with the same number, gaps at 18 and 38). They do not affect the tour.

## 7. Troubleshooting

- **A change does not show up**: the browser cached the old files. Hard refresh (Ctrl+F5). When you deploy an update, also bump the
  `?v=` number on the three script tags and the stylesheet link in `index.html` (currently `?v=32`) so visitors get the new files.
- **Blank screen / no tiles when opening `index.html`**: use a local server (section 1).
- **A place does not appear in the menu**: its `id` does not match a folder in `assets/tiles/<area>/`, or it is marked `pending: true`.
- **A hotspot leads nowhere**: the `to` id does not exist or the target is `pending`; hidden targets are skipped silently.
- **Hotspots jump or look shifted after re-tiling**: `LEVELS` / `FACE_SIZE` in `js/app.js` must match `tools/build_tiles.py`.
- **The transition feels too fast / slow or the trail too strong**: `PUSH`, `MAXS` and `MAXT` in the `goTo` function of `js/app.js`.
- **A night hotspot is missing or points to the wrong place**: night hotspots come only from that scene's `night.positions`,
  never from `links` - check `night.positions` has an entry for that destination, not the day `links` array.
- **Toggling night mode does nothing / shows a toast**: no scene forward of the current one (in day order) has a `night`
  field yet - see `resolveNightTarget()` in `js/app.js`.
