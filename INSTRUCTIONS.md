# Adding photos and new places - step-by-step

Two different jobs, for two different people:

- **Adding or removing photos in a gallery** - anyone can do this. No code, no software, just a web
  browser and a GitHub login. Start at **Part 1** below - that's the whole job.
- **Adding a brand-new 360° place, or a night version of an existing one** - this needs a developer,
  since a new panorama has to be processed into tiles first. That's **Part 2** and **Part 3**.

If you're only here to add photos, you can stop reading after Part 1 - nothing else in this file
applies to you. If you're adding a new place, read `README.md` section 2 and 4 first; this file
assumes you know what `js/scenes.js` and `tools/build_tiles.py` are for Parts 2 and 3.

---

## Part 1 - Adding or removing gallery photos

*No coding, no software to install - just a web browser and your GitHub login. This is the entire
job, start to finish.*

Every place in the tour already has two folders sitting ready for photos: one for daytime photos,
one for night-time photos. Putting a photo into the right one is the whole task - there is nothing
else to set up, nothing to rename, nothing to tell the website separately. A photo you upload
appears on the live site automatically, usually within a minute.

### Step 1 - Open the repository on GitHub

Go to `github.com/AIInno-Labs/Tour-Virtuale` and sign in.

### Step 2 - Find the right folder

Every place's photos live at one of these two paths:

```
assets / gallery / <area> / <place>          <- daytime photos
assets / gallery-night / <area> / <place>     <- night-time photos
```

On the GitHub page, click through the folders in order: **assets** -> **gallery** (or
**gallery-night**, if it's a night photo) -> the area -> the place.

"Area" here is just a folder name, and it matches the areas already on the site:

| Area, as shown on the site | Folder name on GitHub |
|---|---|
| Arrival | `arrivo` |
| Path to the Tower | `sentiero-della-torre` |
| Pine Grove | `pineta` |
| The Tower | `la-torre` |
| Entrance & Atrium | `ingresso-e-atrio` |
| Garden | `giardino` |
| The Halls | `le-sale` |
| Courtyard & Appetizers | `corte-e-antipasti` |
| Stairs & Terraces | `scale-e-terrazze` |
| Drover's Trail | `tratturo` |

Not sure of the exact place folder name? Open that area's folder on GitHub - every place inside it
is already listed by name, so you can just look for the right one.

### Step 3 - Upload the photo(s)

Once you're inside the right place's folder:

1. Click the green **Add file** button (top right of the file list), then choose **Upload files**.
2. Drag your photos in, or click "choose your files" and pick them - you can upload several at once.
3. **Don't rename anything.** Whatever your camera or phone called the file is fine exactly as it is.
4. Scroll down to the "Commit changes" box. Type a short note describing what you added (e.g. "Add
   Tower 1 daytime photos") and click the green **Commit changes** button.

### Step 4 - Wait about a minute, then check the site

Committing the photo automatically starts a short process that updates that place's gallery. It
normally finishes in well under a minute. After that, open the live site, go to that place, and the
**Gallery** button (the picture icon in the top toolbar) will show your new photo - no other step.

### Removing a photo

Open the same folder on GitHub, click the photo you want gone, click the trash-can icon
(**Delete file**), write a short commit message, and commit. It disappears from the site the same
way, automatically, once that same short process finishes.

### Which folder - day or night?

Judge each photo by what it actually shows, the same way the panoramas were sorted:

- **Bright sky, sunlight, no lights on** -> it's a day photo -> `assets/gallery/...`
- **Dark sky, string lights/candles lit, evening party lighting** -> it's a night photo ->
  `assets/gallery-night/...`

A place only *has* a `gallery-night` folder if it actually has a night version on the site. If you
don't see one when browsing, that place doesn't have night mode yet, and a night photo for it
wouldn't be reachable by visitors anyway - it goes in `assets/gallery/` instead.

### If a place's gallery folder doesn't exist yet

This should only come up for a brand-new place added to the site after this system was set up (see
Part 2). If browsing to `assets/gallery/<area>/` doesn't show that place's folder, you can create it
in the same upload step: after clicking **Upload files**, click on the greyed-out filename shown in
the upload box and type the folder path in front of it, for example:

```
giardino/20loungearea/my-photo.jpg
```

GitHub creates the `20loungearea` folder automatically the moment you commit - there's no separate
"create a folder" button needed.

### If something doesn't work

- **Photo still isn't showing after a couple of minutes**: on the repository's GitHub page, click
  the **Actions** tab near the top. Look for the most recent run named "Rebuild gallery manifests".
  A green check means it finished - if the photo still isn't showing, double-check you uploaded to
  the right place's folder. A red X means it failed (pass this to your developer). Still spinning
  means it just needs a bit more time.
- **Uploaded to the wrong place or the wrong folder (day/night)**: delete it from the wrong spot
  ("Removing a photo" above) and upload it again to the right one.
- **Photo appears sideways or upside down on the site**: rotate the photo file itself before
  uploading - the site shows it exactly as it was uploaded.

---

## Before you start Part 2 or 3

*(Only relevant from here on - if you only came here to add gallery photos, you're already done.)*

**The `images/` folder does not exist in this project, and that's on purpose.** It would hold the
original panoramas at full size (each one is 30-100 MB, an equirectangular JPG, 2:1 ratio - e.g.
12000 x 6000 px), so the whole folder can reach several gigabytes. That's far too big to keep in
the website's own files, so it is never included in what you download or deploy.

**You have to create it yourself, once:**

```
Tour-Virtuale/
  images/          <- create this folder, empty, right next to index.html
  index.html
  css/
  js/
  assets/
  tools/
  ...
```

Anything you drop into `images/` stays local to your computer. It is only ever read by
`tools/build_tiles.py`, which turns it into the small tiles the website actually uses (in
`assets/tiles/`). **Nothing in `images/` is uploaded when the site is deployed** - see README
section 5. You can delete a photo from `images/` after its tiles are built if you want to save
disk space; the website no longer needs the original once the tiles exist.

You also need, once:

```
pip install opencv-python numpy
```

---

## Part 2 - Adding a brand-new place (panorama)

There are five things involved, in this order: **the photo**, **its area**, **its entry in
`js/scenes.js`**, **running the build script**, and **linking it to its neighbours**. The order
matters - in particular, the `js/scenes.js` entry has to exist *before* you run the build script,
because the script reads that file to know which area a new photo belongs to.

### Step 1 - Prepare the photo

- It must be an **equirectangular** 360 photo, 2:1 ratio (width = 2 x height). A typical size is
  11904 x 5952 or 12000 x 6000 px.
- Name the file after the place, in any readable way - capitals, spaces and underscores are all
  fine here (`20 Lounge Area.jpg`, `20LoungeArea.jpg`, `20_Lounge_Area.jpg` all work equally).
- Put the file directly inside `images/`.

### Step 2 - Work out its `id`

The site turns the filename into a lowercase id by stripping everything that isn't a letter or a
digit. `20 Lounge Area.jpg` becomes `20loungearea`. This id is what you type into `scenes.js`, and
it has to match exactly - if it doesn't, the place won't appear (see Troubleshooting below).

This id must be **unique across the whole tour**, not just within one area.

### Step 3 - Choose its area (chapter)

Open `js/scenes.js` and look at the `chapters` array near the top:

```js
chapters: [
  { id: "arrival", name: "Arrival", nameIt: "Arrivo" },
  { id: "path", name: "Path to the Tower", nameIt: "Sentiero della Torre" },
  { id: "pine", name: "Pine Grove", nameIt: "Pineta" },
  { id: "tower", name: "The Tower", nameIt: "La Torre" },
  { id: "entrance", name: "Entrance & Atrium", nameIt: "Ingresso e Atrio" },
  { id: "garden", name: "Garden", nameIt: "Giardino" },
  { id: "halls", name: "The Halls", nameIt: "Le Sale" },
  { id: "courtyard", name: "Courtyard & Appetizers", nameIt: "Corte e Antipasti" },
  { id: "terraces", name: "Stairs & Terraces", nameIt: "Scale e Terrazze" },
  { id: "trail", name: "Drover's Trail", nameIt: "Tratturo" }
],
```

Either use one of these existing `id`s for your new place, or add a brand-new one if it's a new
area of the property, following the same shape:

```js
{ id: "lounge", name: "Lounge Area", nameIt: "Zona Lounge" },
```

Keep the chapter's own `id` lowercase letters only (no spaces, digits or dashes) - it is used
internally and doesn't need to look nice. Keep the new line in exactly this shape too (one line,
same spacing, nothing extra) - `tools/build_tiles.py` reads this file as plain text looking for
this exact pattern, not as real JavaScript, so a reformatted line won't be recognised.

**This choice also decides where the photo's tiles are stored on disk.** The folder name is
generated automatically from the chapter's `nameIt` (its Italian name) - e.g. chapter `tower`
("La Torre") stores its tiles in `assets/tiles/la-torre/`. A new chapter `lounge` ("Zona Lounge")
would store its tiles in `assets/tiles/zona-lounge/`. You never type this folder name anywhere -
`tools/build_tiles.py` and the website both work it out from `nameIt` the same way, so they always
agree. (This is also the same folder name Part 1's gallery photos live under.)

### Step 4 - Add the place to `js/scenes.js`

In the `scenes` array, add an entry for it. The safest way is to add it with `pending: true` first,
so it stays completely hidden (no hotspot, no menu entry) until it's ready:

```js
{ id: "20loungearea", chapter: "lounge", name: "Lounge Area", nameIt: "Zona Lounge",
  pending: true,
  view: { yaw: 0, pitch: 0 },
  links: [] },
```

A few rules that matter:

- **`id` must come first, then `chapter` right after it** (or, only for the one place used as the
  welcome screen's background, `homeOnly: true` can sit between them - see README). This exact
  order is what `tools/build_tiles.py` looks for when it reads the file; if the order is different,
  the script won't find this place's chapter, and will refuse to build its tiles.
- `name` / `nameIt` are what's shown on screen (English / Italian). If you leave out `nameIt`, the
  English name is shown in both languages.
- `view` and `links` you'll fill in properly in step 6 below - for now, placeholders are fine
  because the place is hidden (`pending: true`).
- Where in the array you put this entry decides where it falls in the Previous / Next order.

### Step 5 - Run the build script

```
python tools/build_tiles.py
```

This only processes photos that don't have tiles yet, so it's safe to run any time. Two useful
variants:

```
python tools/build_tiles.py 20LoungeArea     # rebuild just this one file
python tools/build_tiles.py --force          # rebuild everything from scratch
```

(Use the file's name *without* the `.jpg` extension, exactly as it's written in `images/`.)

If it works, you'll see:

```
1 of 1 images to process
  20loungearea: ok
```

and two new things will exist: `assets/tiles/zona-lounge/20loungearea/` (the cube-map tiles) and
`assets/thumbs/zona-lounge/20loungearea.jpg` (the small preview picture used in menus and hotspot
cards).

**If instead you see `unknown chapter - add this scene to js/scenes.js first, then re-run`**, it
means step 4 wasn't done yet, or the `id` in `scenes.js` doesn't exactly match the filename-derived
id from step 2, or the `chapter` value doesn't match any chapter `id`. Fix `scenes.js` and run the
command again.

### Step 6 - Set its opening view and link it to its neighbours

With the tiles built, open the tour with `index.html?edit=1` (this also skips the welcome screen).
Go to the new place - since it's `pending: true` you can't walk to it normally, so open it directly
by its id: `index.html?edit=1#20loungearea`.

Click anywhere in the panorama: a line like `{ to: "", yaw: 12, pitch: 5 }` is copied to your
clipboard and shown on screen. This is how you find every yaw/pitch value you need:

1. **The place's own opening `view`**: look around until you're facing the direction you want
   visitors to see first, note that direction's yaw/pitch (pitch 0 here, since `view` has no `to`),
   and put it in the `view: { yaw: ..., pitch: ... }` field.
2. **A link out of this place**, e.g. back toward the place you'd naturally arrive from: click on
   that spot in the panorama, fill in `to: "<the neighbour's id>"`, and add it to this place's
   `links` array.
3. **A link into this place from its neighbour**: go to the neighbouring place (also in edit mode),
   click the spot where this new place should appear, and add
   `{ to: "20loungearea", yaw: ..., pitch: ... }` to *that* place's `links` array.

Remember: `pitch` 0 is the horizon, **positive pitch looks down** (use it for hotspots that stand on
the ground), negative pitch looks up.

### Step 7 - Turn it on

Once `view` and `links` are set, delete the `pending: true` line. The place now shows up in the
Areas list, the Menu, and Previous / Next, and its hotspot appears in every place that links to it.

Do a hard refresh (Ctrl+F5) to see the change - see README section 7 for why, and remember to bump
the `?v=` number in `index.html` before you deploy, so visitors get the new files too.

### Worked example, start to finish

Say you're adding a new lounge photo, `images/20 Lounge Area.jpg`, as a brand-new area reachable
from the existing Garden 2 (`16giardino2`):

```js
// 1. New chapter, added to the chapters array:
{ id: "lounge", name: "Lounge Area", nameIt: "Zona Lounge" },

// 2. New scene, added to the scenes array (first as pending: true):
{ id: "20loungearea", chapter: "lounge", name: "Lounge Area", nameIt: "Zona Lounge",
  pending: true,
  view: { yaw: 0, pitch: 0 },
  links: [] },
```

```
python tools/build_tiles.py
```

Then, in edit mode, walk to Garden 2 and click where the new place should appear; suppose that
gives yaw 140, pitch 8. Add that to Garden 2's own `links`:

```js
{ id: "16giardino2", chapter: "garden", name: "Garden 2", nameIt: "Giardino 2",
  view: { yaw: 130, pitch: -15 },
  links: [{ to: "15giardino1", yaw: 26, pitch: 5 }, { to: "17quercia1", yaw: 84, pitch: 8 },
    { to: "18quercia2", yaw: 168, pitch: 2 }, { to: "23spalliera1", yaw: -162, pitch: 14 },
    { to: "20loungearea", yaw: 140, pitch: 8 }] },
```

Then open the new place itself (`?edit=1#20loungearea`), find a good opening direction (say yaw 0,
pitch 0 already looks right) and the spot to walk back to Garden 2 (say yaw 180, pitch 6), and
finish its entry:

```js
{ id: "20loungearea", chapter: "lounge", name: "Lounge Area", nameIt: "Zona Lounge",
  view: { yaw: 0, pitch: 0 },
  links: [{ to: "16giardino2", yaw: 180, pitch: 6 }] },
```

Refresh, and the lounge is now part of the tour. If it should have a photo gallery too, see Part 1
above - once this place exists, its gallery folders can be created the same "type the path while
uploading" way described there.

---

## Part 3 - Adding a night version of a place

Two cases: giving an existing day place a night photo too, and adding a place that only exists at
night (no day equivalent). Both use the `night` field described in README's "Night view" section -
read that first for what each part of `night` means. You need `images-night/` (create it next to
`images/` - same "never uploaded" rule) and the same `pip install opencv-python numpy` from before
Part 2.

### 3a. Giving an existing day place a night photo

Say `07pineta1` ("Pine Grove 1") gets a night photo.

**Step 1 - Prepare the photo.** Equirectangular, 2:1, same as day photos. Name it directly after the
scene's `id`, with no camera-name step: `images-night/07pineta1.jpg`. Before naming it, confirm by
eye that it really is the same physical spot as the day photo, not just a similar-looking one - see
README's "Matching a night photo to a place".

**Step 2 - Build its tiles.**
```
python tools/build_tiles.py --night
```
Same rules as the day build: only new files are processed, `--night --force` rebuilds everything,
`python tools/build_tiles.py --night 07pineta1` rebuilds just this one. This produces
`assets/tiles-night/pineta/07pineta1/` and `assets/thumbs-night/pineta/07pineta1.jpg`.

**Step 3 - Add the `night` field**, positions empty for now:
```js
{ id: "07pineta1", chapter: "pine", night: { positions: {} }, name: "Pine Grove 1", nameIt: "Pineta 1",
  view: { yaw: -62, pitch: 7 },
  links: [ ... ] },
```
This alone makes the place show up in night mode's Areas list and Previous / Next order, just with no
hotspots yet.

**Step 4 - Set its night hotspots and opening view.** Switch the site into night mode, then open
`index.html?edit=1#07pineta1`. Click the panorama the same way as for a day link: a line like
`{ to: "", yaw: 12, pitch: 5 }` is copied - paste it into `night.positions` instead of `links`, keyed
by the destination id (`"08pineta2": { yaw: 12, pitch: 5 }`). Repeat for every neighbour reachable at
night - it does not have to be the same neighbours as by day. Also add the matching hotspot the other
way, on each neighbour's own `night.positions`. Then pick one of those positions as the opening
`view` (never leave a night place facing the ground or a blank wall):
```js
{ id: "07pineta1", chapter: "pine",
  night: { positions: { "08pineta2": { yaw: 12, pitch: 5 } }, view: { yaw: 12, pitch: 5 } },
  name: "Pine Grove 1", nameIt: "Pineta 1",
  view: { yaw: -62, pitch: 7 },
  links: [ ... ] },
```

**Step 5 - Rename it for night, only if needed.** If the place should be called something different
at night (common when a night-only photo gets inserted before it and everything after it shifts by
one - see `10torre2`, night name "Tower 3", for a real example), add `name` / `nameIt` inside the
`night` object too. Otherwise the day name is reused automatically - do not repeat it for no reason.

**Step 6 - Give it a night gallery folder, if you want one.** A `gallery-night` folder for this place
is only created once it has a `night` field, so after this step is done, create
`assets/gallery-night/<area>/<id>/` the same "type the path while uploading" way described in Part 1
- it won't already exist.

### 3b. Adding a place that only exists at night

Use this when a night photo has no day equivalent at all (e.g. a lounge area only visible with the
string lights on). It is a normal scene entry, marked `nightOnly: true`, with only night data - no
day `view` of its own:

```js
{ id: "torre2b", chapter: "tower", nightOnly: true,
  night: { positions: { "10torre2": { yaw: 69.9, pitch: 9.8 }, "09torre1": { yaw: 165.9, pitch: 10.1 } },
           view: { yaw: 69.9, pitch: 9.8 } },
  name: "Tower 2", nameIt: "Torre 2",
  links: [{ to: "10torre2", yaw: 69.9, pitch: 9.8 }, { to: "09torre1", yaw: 165.9, pitch: 10.1 }] },
```

The steps are the same as 3a (photo in `images-night/<id>.jpg`, `python tools/build_tiles.py --night`,
find positions with `?edit=1` in night mode), with two differences:

- Set `nightOnly: true` right after `chapter`.
- **Also copy `night.positions` into a top-level `links` array**, same `to` / `yaw` / `pitch` values.
  This is easy to forget, and the result is a place with a correct Areas listing and Previous / Next
  but zero hotspots showing in night mode: `getScene()` reads `night.positions` for hotspots when
  night mode is on, but other code (prefetching neighbouring tiles, for one) still reads `links`, so
  both need the same data.
- Where the entry sits in the `scenes` array no longer decides day order (it's filtered out of the
  day list by `nightOnly`) - it now only decides where it falls in the **night** Previous / Next
  order, relative to the other night-capable scenes around it.

### Checking it

Switch to night mode and refresh. The place should appear in the night Areas list under the right
chapter, with the right name, a working opening view, and a hotspot to and from each neighbour you
connected it to. As with day places, remember to bump `?v=` in `index.html` before deploying.

---

## Part 4 - Quick reference

| Where | What you do there |
|---|---|
| `assets/gallery/<area>/<place-id>/`, `assets/gallery-night/<area>/<place-id>/` | Already exist for every place that has one. Drop photos in (any filename) on GitHub and commit - the Action writes `manifest.json`, nothing else to do. See Part 1. |
| `.github/workflows/gallery-manifests.yml`, `tools/build_gallery_manifests.py` | Run automatically on push; don't edit unless the gallery mechanism itself needs to change - see Part 1. |
| `images/` (create it yourself, project root) | Drop original full-size day panoramas here. Never uploaded/deployed. Safe to delete a photo once its tiles are built. |
| `images-night/` (create it yourself, project root) | Same, for night panoramas - named directly after the scene id (no camera-name step). |
| `js/scenes.js` | Add the chapter (if new), add the scene entry, set `view` / `links`, add the `night` field for a night version. This is the only file you *must* edit for new content - galleries never touch it. |
| `assets/tiles/<area>/<id>/`, `assets/thumbs/<area>/<id>.jpg` | Day tiles/thumb, generated by `tools/build_tiles.py`. Never edit these by hand or move them - re-run the script instead. |
| `assets/tiles-night/<area>/<id>/`, `assets/thumbs-night/<area>/<id>.jpg` | Same, for night, generated by `tools/build_tiles.py --night`. |
| `tools/build_tiles.py` | Run it, don't edit it (unless you're changing the tiling itself - see README section 4, "Add or replace a panorama"). `--night` switches it to the night folders. |

`<area>` is never typed by hand anywhere - it's always the chapter's Italian name (`nameIt`),
lowercased with spaces turned into dashes (e.g. "La Torre" -> `la-torre`). Both the website and the
build script compute it the same way from `js/scenes.js`, so they can't drift apart.

## Part 5 - Checklist - adding a new place

- [ ] Photo is equirectangular, 2:1, saved into `images/` (create that folder if it doesn't exist)
- [ ] Worked out its `id` from the filename (lowercase, letters and digits only)
- [ ] Chapter chosen or added in `scenes.js`'s `chapters` array
- [ ] Scene entry added to `scenes.js`'s `scenes` array, `id` immediately followed by `chapter`, marked `pending: true`
- [ ] `python tools/build_tiles.py` run without an "unknown chapter" error
- [ ] `view` set using `?edit=1`
- [ ] A link added *from* this place to a neighbour, and *from* that neighbour back to this place
- [ ] `pending: true` removed
- [ ] Hard refresh (Ctrl+F5) to check it; `?v=` bumped in `index.html` before deploying
- [ ] (optional) Gallery photos uploaded on GitHub into `assets/gallery/<area>/<id>/` (create the
      folder by typing its path into the first upload's filename - see Part 1) - no `scenes.js` edit needed
- [ ] (optional) Night version added: photo confirmed to be the same spot, `images-night/<id>.jpg`,
      `python tools/build_tiles.py --night`, `night.positions` / `night.view` set with `?edit=1` in
      night mode (see Part 3)

## Part 6 - Troubleshooting specific to this

- **`unknown chapter - add this scene to js/scenes.js first, then re-run`** when running
  `build_tiles.py`: the scene's `id` / `chapter` aren't in `scenes.js` yet, the `id` doesn't match
  the filename, or `id` and `chapter` aren't next to each other in the entry (see Part 2 step 4's
  rules).
- **The new place doesn't show up anywhere**: it still has `pending: true`, or its `chapter` value
  doesn't match any `id` in the `chapters` array (typo, most often).
- **A night place has no hotspots even though Areas/Previous-Next look right**: its `night.positions`
  is empty, or (for a `nightOnly` place) `night.positions` was set but not also copied into `links` -
  see Part 3b.
- **Its hotspot leads nowhere, or is missing**: check the `to` value in the neighbouring place's
  `links` array matches this place's `id` exactly.
- **The Gallery button doesn't appear for a gallery**: check the repo's Actions tab - the
  `gallery-manifests` workflow either hasn't run yet (give it under a minute after the commit) or
  failed; failing that, the folder path doesn't exactly match the `<area>/<place-id>` convention
  (compare it letter-for-letter, including day vs. night), or the file's extension isn't one
  `IMAGE_EXTS` in `tools/build_gallery_manifests.py` recognises. See also Part 1's own
  troubleshooting notes for the non-technical version of this.
- **Tiles built into the wrong area folder**: the `chapter` value on that scene doesn't say what you
  think it does - double check it against the `chapters` array, then re-run
  `python tools/build_tiles.py <name> --force`.

For anything not covered here (colours, fonts, deploying, the welcome screen, contact details,
languages, keyboard shortcuts...), see `README.md`.
