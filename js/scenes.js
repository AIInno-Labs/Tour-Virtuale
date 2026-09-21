/*
 * TOUR CONTENT - the only file you normally need to edit.
 *
 * Scene fields
 *   id        must match the folder name in tiles/ (made by tools/build_tiles.py)
 *   chapter   key from "chapters" below (groups scenes in the Areas menu)
 *   name      title shown on screen and on the hotspot that leads here
 *   view      opening direction in degrees: yaw (0 = image centre, positive = right) and
 *             pitch (0 = horizon, positive = DOWN, negative = up)
 *   links     hotspots that walk to another scene: { to, yaw, pitch }. Optional label / labelIt: the name shown
 *             on that one hotspot instead of the scene's own name (e.g. Tower 3 calls the aerial photo "Tower 4").
 *   gallery   photo slideshow: { folder, count, hotspot }. Put 01.jpg, 02.jpg ... in "folder";
 *             files that do not exist are skipped, portrait and landscape both work.
 *   pending   true = the panorama has not been added yet; the scene and every link to it stay hidden.
 *             Add the JPG to images/, run tools/build_tiles.py, then delete "pending: true".
 *
 * Tip: open index.html?edit=1 and click the panorama to copy the yaw/pitch of a spot.
 * The order of the scenes below is also the order of the Previous / Next buttons.
 */
window.TOUR = {
  name: "Cala dei Balcani",
  tagline: "Virtual tour",

  // The first screen. "scene" is the panorama shown behind it; "aerial" is where the Menu's Aerial view goes.
  home: {
    scene: "panohome",
    aerial: "12torredrone",
    view: { yaw: -35, pitch: 4 },
    lead: "Stroll through the location: the *pine grove*, the ancient *Saracen Tower*, the *Cathedral Hall* and the rooms with a *view of the sea*.",
    start: "Start the walk",
    leadIt: "Passeggia nella location: la *pineta*, l'antica *Torre Saracena*, la *Sala Cattedrale* e gli ambienti con *vista sul mare*.",
    startScene: "01parcheggio"
  },

  // Contact details for the Inquire card and the Menu. DUMMY VALUES - replace with the real ones.
  contact: { phone: "+39 000 000 0000", email: "info@example.com", website: "https://www.example.com", hours: "Open every day, 9:00 to 19:00", hoursIt: "Aperto tutti i giorni, dalle 9:00 alle 19:00" },

  // Optional floor plan. Put the image in assets/ and give scenes a pin (x, y as % of the image).
  map: { image: null, pins: { /* "01parcheggio": { x: 12, y: 80 }, */ } },

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

  scenes: [
    // The picture behind the welcome screen only (homeOnly keeps it out of the Areas list and Previous / Next).
    { id: "panohome", homeOnly: true, chapter: "arrival", name: "Home", nameIt: "Home", view: { yaw: -35, pitch: 4 }, links: [] },
    { id: "01parcheggio", chapter: "arrival", name: "Parking 1", nameIt: "Parcheggio 1",
      view: { yaw: 12, pitch: -8 },
      links: [{ to: "02parcheggio", yaw: 4, pitch: 5 }, { to: "12torredrone", yaw: 40, pitch: -13 }] },
    { id: "02parcheggio", chapter: "arrival", name: "Parking 2", nameIt: "Parcheggio 2",
      view: { yaw: 15, pitch: -6 },
      links: [{ to: "03ingressotorre", yaw: -31, pitch: 5 }, { to: "01parcheggio", yaw: 144, pitch: 5 }] },
    { id: "03ingressotorre", chapter: "path", name: "Tower Entrance", nameIt: "Ingresso Torre",
      view: { yaw: 148, pitch: -4 },
      links: [{ to: "04percorsotorre1", yaw: 112, pitch: -2 }, { to: "02parcheggio", yaw: -167, pitch: 9 }, { to: "42tratturo3", yaw: -9, pitch: 10 }] },
    { id: "04percorsotorre1", chapter: "path", name: "Tower Path 1", nameIt: "Percorso Torre 1",
      view: { yaw: -21, pitch: -7 },
      links: [{ to: "03ingressotorre", yaw: -155, pitch: 25 }, { to: "02parcheggio", yaw: 113, pitch: 9 }, { to: "05percorsotorre2", yaw: -28, pitch: 5 }] },
    { id: "05percorsotorre2", chapter: "path", name: "Tower Path 2", nameIt: "Percorso Torre 2",
      view: { yaw: -137, pitch: -7 },
      links: [{ to: "04percorsotorre1", yaw: 96, pitch: 26 }, { to: "06percorsotorre3", yaw: -132, pitch: 1 }] },
    { id: "06percorsotorre3", chapter: "path", name: "Tower Path 3", nameIt: "Percorso Torre 3",
      view: { yaw: 3, pitch: -16 },
      links: [{ to: "05percorsotorre2", yaw: -170, pitch: 17 }, { to: "07pineta1", yaw: 7, pitch: 12 }] },
    { id: "07pineta1", chapter: "pine", name: "Pine Grove 1", nameIt: "Pineta 1",
      view: { yaw: -62, pitch: 7 },
      links: [{ to: "06percorsotorre3", yaw: 120, pitch: 13 }, { to: "08pineta2", yaw: 15, pitch: 22 }, { to: "10torre2", yaw: -97, pitch: 9 }] },
    { id: "08pineta2", chapter: "pine", name: "Pine Grove 2", nameIt: "Pineta 2",
      view: { yaw: -92, pitch: -7 },
      links: [{ to: "07pineta1", yaw: -110, pitch: 11 }, { to: "05percorsotorre2", yaw: -180, pitch: 8 }, { to: "10torre2", yaw: -76, pitch: 6 }] },
    { id: "09torre1", chapter: "tower", name: "Tower 1", nameIt: "Torre 1",
      view: { yaw: 132, pitch: 10 },
      links: [{ to: "10torre2", yaw: 111, pitch: 20 }, { to: "07pineta1", yaw: -121, pitch: 19 }] },
    { id: "10torre2", chapter: "tower", name: "Tower 2", nameIt: "Torre 2",
      view: { yaw: 8, pitch: -19 },
      links: [{ to: "11torre3", yaw: -152, pitch: 33 }, { to: "07pineta1", yaw: -7, pitch: 4 }] },
    { id: "11torre3", chapter: "tower", name: "Tower 3", nameIt: "Torre 3",
      view: { yaw: 12, pitch: 3 },
      links: [{ to: "10torre2", yaw: 12, pitch: 5 }, { to: "12torredrone", yaw: 172, pitch: -2, label: "Tower 4", labelIt: "Torre 4" }],
      gallery: { folder: "gallery/11torre3", count: 10, hotspot: { yaw: 6, pitch: 10 } } },
    { id: "12torredrone", chapter: "tower", name: "Aerial View", nameIt: "Vista aerea",
      view: { yaw: -72, pitch: 32 },
      links: [{ to: "11torre3", yaw: -132, pitch: 37 }, { to: "13ingressoroma", yaw: -11, pitch: 37 }, { to: "34terrazza2", yaw: -35, pitch: 29 }] },
    { id: "13ingressoroma", chapter: "entrance", name: "Roma Entrance", nameIt: "Ingresso Roma",
      view: { yaw: 10, pitch: -19 },
      links: [{ to: "12torredrone", yaw: -95, pitch: -26 }, { to: "14atrio1", yaw: 5, pitch: 12 }] },
    { id: "14atrio1", chapter: "entrance", name: "Atrium", nameIt: "Atrio",
      view: { yaw: 50, pitch: -3 },
      links: [{ to: "15giardino1", yaw: 83, pitch: 13 }, { to: "13ingressoroma", yaw: -160, pitch: 14 }, { to: "17quercia1", yaw: 17, pitch: 13 }] },
    { id: "15giardino1", chapter: "garden", name: "Garden 1", nameIt: "Giardino 1",
      view: { yaw: 45, pitch: -12 },
      links: [{ to: "16giardino2", yaw: 97, pitch: 6 }, { to: "14atrio1", yaw: -5, pitch: 3 }] },
    { id: "16giardino2", chapter: "garden", name: "Garden 2", nameIt: "Giardino 2",
      view: { yaw: 130, pitch: -15 },
      links: [{ to: "15giardino1", yaw: 26, pitch: 5 }, { to: "17quercia1", yaw: 84, pitch: 8 }, { to: "18quercia2", yaw: 168, pitch: 2 }, { to: "23spalliera1", yaw: -162, pitch: 14 }] },
    { id: "17quercia1", chapter: "garden", name: "Oak Tree 1", nameIt: "Quercia 1",
      view: { yaw: 16, pitch: -12 },
      links: [{ to: "18quercia2", yaw: -24, pitch: 8 }, { to: "16giardino2", yaw: 51, pitch: 11 }, { to: "14atrio1", yaw: -179, pitch: 12 }] },
    { id: "18quercia2", chapter: "garden", name: "Oak Tree 2", nameIt: "Quercia 2",
      view: { yaw: -171, pitch: -12 },
      links: [{ to: "19sala1", yaw: -174, pitch: 13 }, { to: "16giardino2", yaw: 94, pitch: 19 }, { to: "23spalliera1", yaw: 7, pitch: 27 }, { to: "24corte1", yaw: -89, pitch: 20 }, { to: "31scaladx", yaw: -130, pitch: 1 }, { to: "32scalasx", yaw: 145, pitch: 1 }] },
    { id: "19sala1", chapter: "halls", name: "Hall 1", nameIt: "Sala 1",
      view: { yaw: 3, pitch: 10 },
      links: [{ to: "18quercia2", yaw: -180, pitch: 32 }, { to: "20sala2", yaw: 5, pitch: 26 }] },
    { id: "20sala2", chapter: "halls", name: "Hall 2", nameIt: "Sala 2",
      view: { yaw: 2, pitch: -6 },
      links: [{ to: "23sala5", yaw: -2, pitch: 22 }, { to: "21sala3", yaw: 62, pitch: 19 }, { to: "19sala1", yaw: 179, pitch: 10 }, { to: "22sala4", yaw: -68, pitch: 18 }] },
    { id: "21sala3", chapter: "halls", name: "Hall 3", nameIt: "Sala 3",
      view: { yaw: 4, pitch: 3 },
      links: [{ to: "20sala2", yaw: 1, pitch: 14 }] },
    { id: "22sala4", chapter: "halls", name: "Hall 4", nameIt: "Sala 4",
      view: { yaw: 179, pitch: -4 },
      links: [{ to: "20sala2", yaw: 161, pitch: 15 }] },
    { id: "23sala5", chapter: "halls", name: "Hall 5", nameIt: "Sala 5",
      view: { yaw: -166, pitch: 0 },
      links: [{ to: "20sala2", yaw: -166, pitch: 18 }, { to: "21sala3", yaw: 152, pitch: 14 }, { to: "22sala4", yaw: -124, pitch: 13 }] },
    { id: "23spalliera1", chapter: "courtyard", name: "Trellis Walk 1", nameIt: "Spalliera 1",
      view: { yaw: 10, pitch: -14 },
      links: [{ to: "18quercia2", yaw: 11, pitch: 5 }, { to: "16giardino2", yaw: -70, pitch: 7 }, { to: "30spalliera2", yaw: 86, pitch: 6 }] },
    { id: "24corte1", chapter: "courtyard", name: "Courtyard 1", nameIt: "Corte 1",
      view: { yaw: -48, pitch: 2 },
      links: [{ to: "18quercia2", yaw: -97, pitch: 10 }, { to: "25corte2", yaw: -8, pitch: 20 }, { to: "27antipasti1", yaw: 45, pitch: 12 }] },
    { id: "25corte2", chapter: "courtyard", name: "Courtyard 2", nameIt: "Corte 2",
      view: { yaw: -91, pitch: 7 },
      links: [{ to: "24corte1", yaw: -81, pitch: 12 }, { to: "26corte3", yaw: 85, pitch: 0 }, { to: "27antipasti1", yaw: -137, pitch: 9 }] },
    { id: "26corte3", chapter: "courtyard", name: "Courtyard 3", nameIt: "Corte 3",
      view: { yaw: 11, pitch: -13 },
      links: [{ to: "25corte2", yaw: -2, pitch: 16 }] },
    { id: "27antipasti1", chapter: "courtyard", name: "Appetizers 1", nameIt: "Antipasti 1",
      view: { yaw: -5, pitch: 12 },
      links: [{ to: "24corte1", yaw: -73, pitch: 13 }, { to: "25corte2", yaw: 25, pitch: 8 }, { to: "28antipasti2", yaw: 97, pitch: 16 }, { to: "29antipasti3", yaw: -171, pitch: 26 }, { to: "30spalliera2", yaw: -121, pitch: 15 }] },
    { id: "28antipasti2", chapter: "courtyard", name: "Appetizers 2", nameIt: "Antipasti 2",
      view: { yaw: 58, pitch: -6 },
      links: [{ to: "25corte2", yaw: 61, pitch: 20 }, { to: "29antipasti3", yaw: -35, pitch: 17 }, { to: "39tratturo1", yaw: -174, pitch: 11 }, { to: "24corte1", yaw: 27, pitch: 9 }] },
    { id: "29antipasti3", chapter: "courtyard", name: "Appetizers 3", nameIt: "Antipasti 3",
      view: { yaw: 164, pitch: 6 },
      links: [{ to: "27antipasti1", yaw: -159, pitch: 17 }, { to: "28antipasti2", yaw: -112, pitch: 20 }, { to: "30spalliera2", yaw: 104, pitch: 9 }, { to: "24corte1", yaw: 151, pitch: 9 }] },
    { id: "30spalliera2", chapter: "courtyard", name: "Trellis Walk 2", nameIt: "Spalliera 2",
      view: { yaw: -30, pitch: -1 },
      links: [{ to: "29antipasti3", yaw: 51, pitch: 5 }, { to: "23spalliera1", yaw: -77, pitch: 15 }, { to: "18quercia2", yaw: -54, pitch: -6 }] },
    { id: "31scaladx", chapter: "terraces", name: "Right Staircase", nameIt: "Scala destra",
      view: { yaw: 33, pitch: 4 },
      links: [{ to: "18quercia2", yaw: -85, pitch: 35 }, { to: "33terrazza1", yaw: 76, pitch: 10 }, { to: "37terrazza4", yaw: -2, pitch: 11 }] },
    { id: "32scalasx", chapter: "terraces", name: "Left Staircase", nameIt: "Scala sinistra",
      view: { yaw: 3, pitch: 7 },
      links: [{ to: "18quercia2", yaw: 104, pitch: 32 }, { to: "37terrazza4", yaw: 20, pitch: 11 }, { to: "35terrazza3", yaw: -67, pitch: 12 }] },
    { id: "33terrazza1", chapter: "terraces", name: "Terrace 1", nameIt: "Terrazza 1",
      view: { yaw: 0, pitch: 0 },
      links: [{ to: "31scaladx", yaw: -39, pitch: 9 }, { to: "34terrazza2", yaw: 32, pitch: 11 }, { to: "26corte3", yaw: -143, pitch: 33 }] },
    { id: "34terrazza2", chapter: "terraces", name: "Terrace 2", nameIt: "Terrazza 2",
      view: { yaw: 2, pitch: 12 },
      links: [{ to: "38terrazza5", yaw: -2, pitch: 14 }, { to: "33terrazza1", yaw: -122, pitch: 10 }, { to: "35terrazza3", yaw: 102, pitch: 13 }] },
    { id: "35terrazza3", chapter: "terraces", name: "Terrace 3", nameIt: "Terrazza 3",
      view: { yaw: 2, pitch: 3 },
      links: [{ to: "32scalasx", yaw: 51, pitch: 9 }, { to: "34terrazza2", yaw: -49, pitch: 10 }] },
    { id: "37terrazza4", chapter: "terraces", name: "Terrace 4", nameIt: "Terrazza 4",
      view: { yaw: -179, pitch: -13 },
      links: [{ to: "31scaladx", yaw: -107, pitch: 11 }, { to: "32scalasx", yaw: 103, pitch: 9 }, { to: "38terrazza5", yaw: 175, pitch: 9 }, { to: "12torredrone", yaw: -178, pitch: -22 }] },
    { id: "38terrazza5", chapter: "terraces", name: "Terrace 5", nameIt: "Terrazza 5",
      view: { yaw: 2, pitch: -1 },
      links: [{ to: "34terrazza2", yaw: -177, pitch: 17 }, { to: "37terrazza4", yaw: -2, pitch: 13 }, { to: "31scaladx", yaw: -55, pitch: 6 }, { to: "32scalasx", yaw: 48, pitch: 6 }] },
    { id: "39tratturo1", chapter: "trail", name: "Drover's Trail 1", nameIt: "Tratturo 1",
      view: { yaw: 4, pitch: -5 },
      links: [{ to: "40tratturo2", yaw: 165, pitch: 0 }, { to: "28antipasti2", yaw: 7, pitch: 23 }] },
    { id: "40tratturo2", chapter: "trail", name: "Drover's Trail 2", nameIt: "Tratturo 2",
      view: { yaw: 172, pitch: -3 },
      links: [{ to: "41tratturo3", yaw: -15, pitch: -12 }, { to: "39tratturo1", yaw: -176, pitch: 29 }] },
    { id: "41tratturo3", chapter: "trail", name: "Drover's Trail 3", nameIt: "Tratturo 3",
      view: { yaw: 141, pitch: 24 },
      links: [{ to: "40tratturo2", yaw: 177, pitch: 17 }, { to: "42tratturo3", yaw: -13, pitch: -7 }] },
    { id: "42tratturo3", chapter: "trail", name: "Drover's Trail 4", nameIt: "Tratturo 4",
      view: { yaw: 140, pitch: 13 },
      links: [{ to: "41tratturo3", yaw: 147, pitch: 23 }, { to: "03ingressotorre", yaw: -22, pitch: 13 }] }
  ]
};
