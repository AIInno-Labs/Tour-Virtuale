/*
 * TOUR CONTENT - the only file you normally need to edit.
 *
 * Scene fields
 *   id        must match the folder name in assets/tiles/ (made by tools/build_tiles.py)
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
    leadFr: "Flânez à travers le lieu : la *pinède*, l'ancienne *Tour Sarrasine*, la *Salle Cathédrale* et les pièces avec *vue sur la mer*.",
    leadEs: "Pasea por el lugar: el *pinar*, la antigua *Torre Sarracena*, la *Sala Catedral* y las estancias con *vista al mar*.",
    leadDe: "Schlendern Sie durch die Location: den *Pinienhain*, den alten *Sarazenturm*, den *Kathedralensaal* und die Räume mit *Meerblick*.",
    startScene: "01parcheggio"
  },

  // Contact details for the Inquire card, the Menu and the Website button.
  contact: { phone: "+39 334 998 5447", email: "info@caladeibalcani.it", website: "https://www.caladeibalcani.it", hours: "Open every day, 9:00 to 19:00", hoursIt: "Aperto tutti i giorni, dalle 9:00 alle 19:00" },

  // Optional floor plan. Put the image in assets/ and give scenes a pin (x, y as % of the image).
  map: { image: null, pins: { /* "01parcheggio": { x: 12, y: 80 }, */ } },

  chapters: [
    { id: "arrival", name: "Arrival", nameIt: "Arrivo", nameFr: "Arrivée", nameEs: "Llegada", nameDe: "Ankunft" },
    { id: "path", name: "Path to the Tower", nameIt: "Sentiero della Torre", nameFr: "Chemin vers la Tour", nameEs: "Camino a la Torre", nameDe: "Weg zum Turm" },
    { id: "pine", name: "Pine Grove", nameIt: "Pineta", nameFr: "Pinède", nameEs: "Pinar", nameDe: "Pinienhain" },
    { id: "tower", name: "The Tower", nameIt: "La Torre", nameFr: "La Tour", nameEs: "La Torre", nameDe: "Der Turm" },
    { id: "entrance", name: "Entrance & Atrium", nameIt: "Ingresso e Atrio", nameFr: "Entrée & Atrium", nameEs: "Entrada y Atrio", nameDe: "Eingang & Atrium" },
    { id: "garden", name: "Garden", nameIt: "Giardino", nameFr: "Jardin", nameEs: "Jardín", nameDe: "Garten" },
    { id: "halls", name: "The Halls", nameIt: "Le Sale", nameFr: "Les Salles", nameEs: "Las Salas", nameDe: "Die Säle" },
    { id: "courtyard", name: "Courtyard & Appetizers", nameIt: "Corte e Antipasti", nameFr: "Cour & Antipasti", nameEs: "Patio y Antipasti", nameDe: "Innenhof & Antipasti" },
    { id: "terraces", name: "Stairs & Terraces", nameIt: "Scale e Terrazze", nameFr: "Escaliers & Terrasses", nameEs: "Escaleras y Terrazas", nameDe: "Treppen & Terrassen" },
    { id: "trail", name: "Drover's Trail", nameIt: "Tratturo", nameFr: "Chemin des Bergers", nameEs: "Camino de los Pastores", nameDe: "Triftweg" }
  ],

  scenes: [
    // The picture behind the welcome screen only (homeOnly keeps it out of the Areas list and Previous / Next).
    { id: "panohome", homeOnly: true, chapter: "arrival", name: "Home", nameIt: "Home", nameFr: "Accueil", nameEs: "Inicio", nameDe: "Startseite", view: { yaw: -35, pitch: 4 }, links: [] },
    { id: "01parcheggio", chapter: "arrival", name: "Parking 1", nameIt: "Parcheggio 1", nameFr: "Parking 1", nameEs: "Aparcamiento 1", nameDe: "Parkplatz 1",
      view: { yaw: 12, pitch: -8 },
      links: [{ to: "02parcheggio", yaw: 4, pitch: 5 }, { to: "12torredrone", yaw: 40, pitch: -13 }] },
    { id: "02parcheggio", chapter: "arrival", name: "Parking 2", nameIt: "Parcheggio 2", nameFr: "Parking 2", nameEs: "Aparcamiento 2", nameDe: "Parkplatz 2",
      view: { yaw: 15, pitch: -6 },
      links: [{ to: "03ingressotorre", yaw: -31, pitch: 5 }, { to: "01parcheggio", yaw: 144, pitch: 5 }] },
    { id: "03ingressotorre", chapter: "path", name: "Tower Entrance", nameIt: "Ingresso Torre", nameFr: "Entrée de la Tour", nameEs: "Entrada a la Torre", nameDe: "Turmeingang",
      view: { yaw: 148, pitch: -4 },
      links: [{ to: "04percorsotorre1", yaw: 112, pitch: -2 }, { to: "02parcheggio", yaw: -167, pitch: 9 }, { to: "42tratturo3", yaw: -9, pitch: 10 }] },
    { id: "04percorsotorre1", chapter: "path", night: { positions: { "05percorsotorre2": { yaw: -69.8, pitch: -2.1 } }, view: { yaw: -69.8, pitch: -2.1 } }, name: "Tower Path 1", nameIt: "Percorso Torre 1", nameFr: "Chemin de la Tour 1", nameEs: "Camino de la Torre 1", nameDe: "Turmweg 1",
      view: { yaw: -21, pitch: -7 },
      links: [{ to: "03ingressotorre", yaw: -155, pitch: 25 }, { to: "02parcheggio", yaw: 113, pitch: 9 }, { to: "05percorsotorre2", yaw: -28, pitch: 5 }] },
    { id: "05percorsotorre2", chapter: "path", night: { positions: { "06percorsotorre3": { yaw: 0.0, pitch: 0.0 }, "04percorsotorre1": { yaw: 175.7, pitch: 19.7 } }, view: { yaw: 0.0, pitch: 0.0 } }, name: "Tower Path 2", nameIt: "Percorso Torre 2", nameFr: "Chemin de la Tour 2", nameEs: "Camino de la Torre 2", nameDe: "Turmweg 2",
      view: { yaw: -137, pitch: -7 },
      links: [{ to: "04percorsotorre1", yaw: 96, pitch: 26 }, { to: "06percorsotorre3", yaw: -132, pitch: 1 }] },
    { id: "06percorsotorre3", chapter: "path", night: { positions: { "05percorsotorre2": { yaw: 177.7, pitch: 16.4 }, "08pineta2": { yaw: 71.4, pitch: 9.3 }, "09torre1": { yaw: -5.4, pitch: 9.3 } }, view: { yaw: 177.7, pitch: 16.4 } }, name: "Tower Path 3", nameIt: "Percorso Torre 3", nameFr: "Chemin de la Tour 3", nameEs: "Camino de la Torre 3", nameDe: "Turmweg 3",
      view: { yaw: 3, pitch: -16 },
      links: [{ to: "05percorsotorre2", yaw: -170, pitch: 17 }, { to: "07pineta1", yaw: 7, pitch: 12 }] },
    { id: "07pineta1", chapter: "pine", name: "Pine Grove 1", nameIt: "Pineta 1", nameFr: "Pinède 1", nameEs: "Pinar 1", nameDe: "Pinienhain 1",
      view: { yaw: -62, pitch: 7 },
      links: [{ to: "06percorsotorre3", yaw: 120, pitch: 13 }, { to: "08pineta2", yaw: 15, pitch: 22 }, { to: "10torre2", yaw: -97, pitch: 9 }] },
    { id: "08pineta2", chapter: "pine", night: { positions: { "09torre1": { yaw: -48.3, pitch: 6.6 }, "06percorsotorre3": { yaw: -136.5, pitch: 8.3 } }, view: { yaw: -48.3, pitch: 6.6 }, name: "Pine Grove 1", nameIt: "Pineta 1", nameFr: "Pinède 1", nameEs: "Pinar 1", nameDe: "Pinienhain 1" }, name: "Pine Grove 2", nameIt: "Pineta 2", nameFr: "Pinède 2", nameEs: "Pinar 2", nameDe: "Pinienhain 2",
      view: { yaw: -92, pitch: -7 },
      links: [{ to: "07pineta1", yaw: -110, pitch: 11 }, { to: "05percorsotorre2", yaw: -180, pitch: 8 }, { to: "10torre2", yaw: -76, pitch: 6 }] },
    { id: "09torre1", chapter: "tower", night: { positions: { "06percorsotorre3": { yaw: -172.8, pitch: 11.6 }, "08pineta2": { yaw: 128.6, pitch: 9.8 }, "torre2b": { yaw: -37, pitch: 6 } }, view: { yaw: -172.8, pitch: 11.6 } }, name: "Tower 1", nameIt: "Torre 1", nameFr: "Tour 1", nameEs: "Torre 1", nameDe: "Turm 1",
      view: { yaw: 132, pitch: 10 },
      links: [{ to: "10torre2", yaw: 111, pitch: 20 }, { to: "07pineta1", yaw: -121, pitch: 3 }] },
    // Night-only: no day photo exists for this spot (a lounge area near the tower, visible in
    // the reference tour). It never appears in day mode.
    { id: "torre2b", chapter: "tower", nightOnly: true, night: { positions: { "10torre2": { yaw: 69.9, pitch: 9.8 }, "09torre1": { yaw: 165.9, pitch: 10.1 } }, view: { yaw: 69.9, pitch: 9.8 } }, name: "Tower 2", nameIt: "Torre 2", nameFr: "Tour 2", nameEs: "Torre 2", nameDe: "Turm 2",
      view: { yaw: 0, pitch: 0 },
      links: [{ to: "10torre2", yaw: 69.9, pitch: 9.8 }, { to: "09torre1", yaw: 165.9, pitch: 10.1 }] },
    { id: "10torre2", chapter: "tower", night: { positions: { "09torre1": { yaw: 120.0, pitch: 5.0 }, "11torre3": { yaw: -5.3, pitch: 14.9 }, "torre2b": { yaw: -149.0, pitch: -1.4 } }, view: { yaw: 120.0, pitch: 5.0 }, name: "Tower 3", nameIt: "Torre 3", nameFr: "Tour 3", nameEs: "Torre 3", nameDe: "Turm 3" }, name: "Tower 2", nameIt: "Torre 2", nameFr: "Tour 2", nameEs: "Torre 2", nameDe: "Turm 2",
      view: { yaw: 8, pitch: -19 },
      links: [{ to: "11torre3", yaw: -152, pitch: 33 }, { to: "07pineta1", yaw: -7, pitch: 4 }] },
    { id: "11torre3", chapter: "tower", night: { positions: {  }, name: "Tower 4", nameIt: "Torre 4", nameFr: "Tour 4", nameEs: "Torre 4", nameDe: "Turm 4" }, name: "Tower 3", nameIt: "Torre 3", nameFr: "Tour 3", nameEs: "Torre 3", nameDe: "Turm 3",
      view: { yaw: 12, pitch: 3 },
      links: [{ to: "10torre2", yaw: 12, pitch: 5 }, { to: "12torredrone", yaw: 172, pitch: -2, label: "Tower 4", labelIt: "Torre 4", labelFr: "Tour 4", labelEs: "Torre 4", labelDe: "Turm 4" }] },
    { id: "12torredrone", chapter: "tower", name: "Aerial View", nameIt: "Vista aerea", nameFr: "Vue aérienne", nameEs: "Vista aérea", nameDe: "Luftaufnahme",
      view: { yaw: -72, pitch: 32 },
      links: [{ to: "11torre3", yaw: -132, pitch: 37 }, { to: "13ingressoroma", yaw: -11, pitch: 37 }, { to: "34terrazza2", yaw: -35, pitch: 29 }] },
    { id: "13ingressoroma", chapter: "entrance", night: { positions: { "14atrio1": { yaw: 7.3, pitch: 5.3 } }, view: { yaw: 7.3, pitch: 5.3 } }, name: "Roma Entrance", nameIt: "Ingresso Roma", nameFr: "Entrée Roma", nameEs: "Entrada Roma", nameDe: "Roma-Eingang",
      view: { yaw: 10, pitch: -19 },
      links: [{ to: "12torredrone", yaw: -95, pitch: -26 }, { to: "14atrio1", yaw: 5, pitch: 12 }] },
    { id: "14atrio1", chapter: "entrance", night: { positions: { "13ingressoroma": { yaw: -135.3, pitch: 12.2 }, "15giardino1": { yaw: 136.9, pitch: 14.5 }, "17quercia1": { yaw: 47.2, pitch: 5.5 } }, view: { yaw: -135.3, pitch: 12.2 } }, name: "Atrium", nameIt: "Atrio", nameFr: "Atrium", nameEs: "Atrio", nameDe: "Atrium",
      view: { yaw: 50, pitch: -3 },
      links: [{ to: "15giardino1", yaw: 83, pitch: 13 }, { to: "13ingressoroma", yaw: -160, pitch: 14 }, { to: "17quercia1", yaw: 17, pitch: 13 }] },
    { id: "15giardino1", chapter: "garden", night: { positions: { "16giardino2": { yaw: 11.9, pitch: 9.1 }, "14atrio1": { yaw: -82.1, pitch: 14.5 }, "13ingressoroma": { yaw: -144.5, pitch: 7.5 } }, view: { yaw: 11.9, pitch: 9.1 } }, name: "Garden 1", nameIt: "Giardino 1", nameFr: "Jardin 1", nameEs: "Jardín 1", nameDe: "Garten 1",
      view: { yaw: 45, pitch: -12 },
      links: [{ to: "16giardino2", yaw: 97, pitch: 6 }, { to: "14atrio1", yaw: -5, pitch: 3 }] },
    { id: "16giardino2", chapter: "garden", night: { positions: { "23spalliera1": { yaw: 172.6, pitch: 14.1 }, "17quercia1": { yaw: 97.9, pitch: 7.0 }, "15giardino1": { yaw: 26.2, pitch: 1.9 } }, view: { yaw: 172.6, pitch: 14.1 } }, name: "Garden 2", nameIt: "Giardino 2", nameFr: "Jardin 2", nameEs: "Jardín 2", nameDe: "Garten 2",
      view: { yaw: 130, pitch: -15 },
      links: [{ to: "15giardino1", yaw: 26, pitch: 5 }, { to: "17quercia1", yaw: 84, pitch: 8 }, { to: "18quercia2", yaw: 168, pitch: 2 }, { to: "23spalliera1", yaw: -162, pitch: 14 }] },
    { id: "17quercia1", chapter: "garden", night: { positions: { "14atrio1": { yaw: 25.6, pitch: 9.3 }, "16giardino2": { yaw: -29.9, pitch: 13.3 }, "18quercia2": { yaw: 141.3, pitch: 15.8 } }, view: { yaw: 25.6, pitch: 9.3 } }, name: "Oak Tree 1", nameIt: "Quercia 1", nameFr: "Chêne 1", nameEs: "Roble 1", nameDe: "Eiche 1",
      view: { yaw: 16, pitch: -12 },
      links: [{ to: "18quercia2", yaw: -24, pitch: 8 }, { to: "16giardino2", yaw: 51, pitch: 11 }, { to: "14atrio1", yaw: -179, pitch: 12 }] },
    { id: "18quercia2", chapter: "garden", night: { positions: { "17quercia1": { yaw: 59.8, pitch: 9.0 }, "23spalliera1": { yaw: 5.6, pitch: 11.2 }, "24corte1": { yaw: -45.0, pitch: 10.3 }, "31scaladx": { yaw: -96.4, pitch: -13.5 }, "32scalasx": { yaw: 113.4, pitch: -14.0 }, "19sala1": { yaw: -174.8, pitch: 12.2 } }, view: { yaw: 59.8, pitch: 9.0 } }, name: "Oak Tree 2", nameIt: "Quercia 2", nameFr: "Chêne 2", nameEs: "Roble 2", nameDe: "Eiche 2",
      view: { yaw: -171, pitch: -12 },
      links: [{ to: "19sala1", yaw: -174, pitch: 13 }, { to: "16giardino2", yaw: 94, pitch: 19 }, { to: "23spalliera1", yaw: 7, pitch: 27 }, { to: "24corte1", yaw: -89, pitch: 20 }, { to: "31scaladx", yaw: -130, pitch: 1 }, { to: "32scalasx", yaw: 145, pitch: 1 }] },
    { id: "19sala1", chapter: "halls", night: { positions: { "20sala2": { yaw: 4.9, pitch: 13.9 }, "18quercia2": { yaw: 175.8, pitch: 22.3 } }, view: { yaw: 4.9, pitch: 13.9 } }, name: "Hall 1", nameIt: "Sala 1", nameFr: "Salle 1", nameEs: "Sala 1", nameDe: "Saal 1",
      view: { yaw: 3, pitch: 10 },
      links: [{ to: "18quercia2", yaw: -180, pitch: 32 }, { to: "20sala2", yaw: 5, pitch: 26 }] },
    { id: "20sala2", chapter: "halls", night: { positions: { "21sala3": { yaw: 3.9, pitch: 16.4 }, "23sala5": { yaw: -84.7, pitch: 1.2 }, "22sala4": { yaw: 91.7, pitch: -1.1 }, "19sala1": { yaw: -178, pitch: 8 } }, view: { yaw: 3.9, pitch: 16.4 } }, name: "Hall 2", nameIt: "Sala 2", nameFr: "Salle 2", nameEs: "Sala 2", nameDe: "Saal 2",
      view: { yaw: 2, pitch: -6 },
      links: [{ to: "23sala5", yaw: -2, pitch: 22 }, { to: "21sala3", yaw: 62, pitch: 19 }, { to: "19sala1", yaw: 179, pitch: 10 }, { to: "22sala4", yaw: -68, pitch: 18 }] },
    { id: "21sala3", chapter: "halls", night: { positions: { "20sala2": { yaw: -174.1, pitch: 18.0 } }, view: { yaw: -174.1, pitch: 18.0 } }, name: "Hall 3", nameIt: "Sala 3", nameFr: "Salle 3", nameEs: "Sala 3", nameDe: "Saal 3",
      view: { yaw: 4, pitch: 3 },
      links: [{ to: "20sala2", yaw: 1, pitch: 14 }] },
    { id: "22sala4", chapter: "halls", night: { positions: { "20sala2": { yaw: -174.7, pitch: 14.7 } }, view: { yaw: -174.7, pitch: 14.7 } }, name: "Hall 4", nameIt: "Sala 4", nameFr: "Salle 4", nameEs: "Sala 4", nameDe: "Saal 4",
      view: { yaw: 179, pitch: -4 },
      links: [{ to: "20sala2", yaw: 161, pitch: 15 }] },
    { id: "23sala5", chapter: "halls", night: { positions: { "20sala2": { yaw: -1.0, pitch: 9.3 } }, view: { yaw: -1.0, pitch: 9.3 } }, name: "Hall 5", nameIt: "Sala 5", nameFr: "Salle 5", nameEs: "Sala 5", nameDe: "Saal 5",
      view: { yaw: -166, pitch: 0 },
      links: [{ to: "20sala2", yaw: -166, pitch: 18 }, { to: "21sala3", yaw: 152, pitch: 14 }, { to: "22sala4", yaw: -124, pitch: 13 }] },
    { id: "23spalliera1", chapter: "courtyard", night: { positions: { "30spalliera2": { yaw: -101.6, pitch: 9.5 }, "16giardino2": { yaw: 84.2, pitch: 10.0 }, "18quercia2": { yaw: 176.6, pitch: -0.5 } }, view: { yaw: -101.6, pitch: 9.5 } }, name: "Trellis Walk 1", nameIt: "Spalliera 1", nameFr: "Allée des Treilles 1", nameEs: "Paseo del Emparrado 1", nameDe: "Spalierweg 1",
      view: { yaw: 10, pitch: -14 },
      links: [{ to: "18quercia2", yaw: 11, pitch: 5 }, { to: "16giardino2", yaw: -70, pitch: 7 }, { to: "30spalliera2", yaw: 86, pitch: 6 }] },
    { id: "24corte1", chapter: "courtyard", night: { positions: { "18quercia2": { yaw: 4.0, pitch: 12.0 }, "28antipasti2": { yaw: 161.7, pitch: 12.0 }, "25corte2": { yaw: 111.3, pitch: 8.4 } }, view: { yaw: 4.0, pitch: 12.0 } }, name: "Courtyard 1", nameIt: "Corte 1", nameFr: "Cour 1", nameEs: "Patio 1", nameDe: "Innenhof 1",
      view: { yaw: -48, pitch: 2 },
      links: [{ to: "18quercia2", yaw: -97, pitch: 10 }, { to: "25corte2", yaw: -8, pitch: 20 }, { to: "27antipasti1", yaw: 45, pitch: 12 }] },
    { id: "25corte2", chapter: "courtyard", night: { positions: { "26corte3": { yaw: -172.5, pitch: 0.6 }, "28antipasti2": { yaw: -60.5, pitch: 19.5 }, "24corte1": { yaw: 5.2, pitch: 11.3 } }, view: { yaw: -172.5, pitch: 0.6 } }, name: "Courtyard 2", nameIt: "Corte 2", nameFr: "Cour 2", nameEs: "Patio 2", nameDe: "Innenhof 2",
      view: { yaw: -91, pitch: 7 },
      links: [{ to: "24corte1", yaw: -81, pitch: 12 }, { to: "26corte3", yaw: 85, pitch: 0 }, { to: "27antipasti1", yaw: -137, pitch: 9 }] },
    { id: "26corte3", chapter: "courtyard", night: { positions: { "25corte2": { yaw: 0.6, pitch: -1.7 } }, view: { yaw: 0.6, pitch: -1.7 } }, name: "Courtyard 3", nameIt: "Corte 3", nameFr: "Cour 3", nameEs: "Patio 3", nameDe: "Innenhof 3",
      view: { yaw: 11, pitch: -13 },
      links: [{ to: "25corte2", yaw: -2, pitch: 16 }] },
    { id: "27antipasti1", chapter: "courtyard", name: "Appetizers 1", nameIt: "Antipasti 1", nameFr: "Antipasti 1", nameEs: "Antipasti 1", nameDe: "Antipasti 1",
      view: { yaw: -5, pitch: 12 },
      links: [{ to: "24corte1", yaw: -73, pitch: 13 }, { to: "25corte2", yaw: 25, pitch: 8 }, { to: "28antipasti2", yaw: 97, pitch: 16 }, { to: "29antipasti3", yaw: -171, pitch: 26 }, { to: "30spalliera2", yaw: -121, pitch: 15 }] },
    { id: "28antipasti2", chapter: "courtyard", night: { positions: { "39tratturo1": { yaw: -175.7, pitch: 10.7 }, "25corte2": { yaw: 102.0, pitch: 17.6 }, "24corte1": { yaw: 34.8, pitch: 12.2 }, "29antipasti3": { yaw: -47.7, pitch: 21.9 } }, view: { yaw: -175.7, pitch: 10.7 }, name: "Appetizers 1", nameIt: "Antipasti 1", nameFr: "Antipasti 1", nameEs: "Antipasti 1", nameDe: "Antipasti 1" }, name: "Appetizers 2", nameIt: "Antipasti 2", nameFr: "Antipasti 2", nameEs: "Antipasti 2", nameDe: "Antipasti 2",
      view: { yaw: 58, pitch: -6 },
      links: [{ to: "25corte2", yaw: 61, pitch: 20 }, { to: "29antipasti3", yaw: -35, pitch: 17 }, { to: "39tratturo1", yaw: -174, pitch: 11 }, { to: "24corte1", yaw: 27, pitch: 9 }] },
    { id: "29antipasti3", chapter: "courtyard", night: { positions: { "30spalliera2": { yaw: 18.1, pitch: 10.8 }, "28antipasti2": { yaw: 101.5, pitch: 17.6 }, "39tratturo1": { yaw: 168.7, pitch: 9.3 } }, view: { yaw: 18.1, pitch: 10.8 }, name: "Appetizers 2", nameIt: "Antipasti 2", nameFr: "Antipasti 2", nameEs: "Antipasti 2", nameDe: "Antipasti 2" }, name: "Appetizers 3", nameIt: "Antipasti 3", nameFr: "Antipasti 3", nameEs: "Antipasti 3", nameDe: "Antipasti 3",
      view: { yaw: 164, pitch: 6 },
      links: [{ to: "27antipasti1", yaw: -159, pitch: 17 }, { to: "28antipasti2", yaw: -112, pitch: 20 }, { to: "30spalliera2", yaw: 104, pitch: 9 }, { to: "24corte1", yaw: 151, pitch: 9 }] },
    { id: "30spalliera2", chapter: "courtyard", night: { positions: { "29antipasti3": { yaw: -10.6, pitch: 2.7 }, "23spalliera1": { yaw: -159.7, pitch: 5.0 } }, view: { yaw: -10.6, pitch: 2.7 } }, name: "Trellis Walk 2", nameIt: "Spalliera 2", nameFr: "Allée des Treilles 2", nameEs: "Paseo del Emparrado 2", nameDe: "Spalierweg 2",
      view: { yaw: -30, pitch: -1 },
      links: [{ to: "29antipasti3", yaw: 51, pitch: 5 }, { to: "23spalliera1", yaw: -77, pitch: 15 }, { to: "18quercia2", yaw: -54, pitch: -6 }] },
    { id: "31scaladx", chapter: "terraces", night: { positions: { "18quercia2": { yaw: 14.2, pitch: 34.0 }, "33terrazza1": { yaw: -177.4, pitch: 9.7 }, "37terrazza4": { yaw: 100.0, pitch: 10.6 } }, view: { yaw: 14.2, pitch: 34.0 } }, name: "Right Staircase", nameIt: "Scala destra", nameFr: "Escalier droit", nameEs: "Escalera derecha", nameDe: "Rechte Treppe",
      view: { yaw: 33, pitch: 4 },
      links: [{ to: "18quercia2", yaw: -85, pitch: 35 }, { to: "33terrazza1", yaw: 76, pitch: 10 }, { to: "37terrazza4", yaw: -2, pitch: 11 }] },
    { id: "32scalasx", chapter: "terraces", night: { positions: { "35terrazza3": { yaw: -86.2, pitch: 12.8 }, "37terrazza4": { yaw: 4.2, pitch: 14.4 }, "18quercia2": { yaw: 96.5, pitch: 32.1 } }, view: { yaw: -86.2, pitch: 12.8 } }, name: "Left Staircase", nameIt: "Scala sinistra", nameFr: "Escalier gauche", nameEs: "Escalera izquierda", nameDe: "Linke Treppe",
      view: { yaw: 3, pitch: 7 },
      links: [{ to: "18quercia2", yaw: 104, pitch: 32 }, { to: "37terrazza4", yaw: 20, pitch: 11 }, { to: "35terrazza3", yaw: -67, pitch: 12 }] },
    { id: "33terrazza1", chapter: "terraces", night: { positions: { "34terrazza2": { yaw: 104.7, pitch: 13.6 }, "31scaladx": { yaw: 6.1, pitch: 8.9 } }, view: { yaw: 104.7, pitch: 13.6 } }, name: "Terrace 1", nameIt: "Terrazza 1", nameFr: "Terrasse 1", nameEs: "Terraza 1", nameDe: "Terrasse 1",
      view: { yaw: 0, pitch: 0 },
      links: [{ to: "31scaladx", yaw: -39, pitch: 9 }, { to: "34terrazza2", yaw: 32, pitch: 11 }, { to: "26corte3", yaw: -143, pitch: 33 }] },
    { id: "34terrazza2", chapter: "terraces", night: { positions: { "35terrazza3": { yaw: 74.3, pitch: 12.9 }, "33terrazza1": { yaw: -93.3, pitch: 9.1 }, "38terrazza5": { yaw: 0.4, pitch: 15.9 } }, view: { yaw: 74.3, pitch: 12.9 } }, name: "Terrace 2", nameIt: "Terrazza 2", nameFr: "Terrasse 2", nameEs: "Terraza 2", nameDe: "Terrasse 2",
      view: { yaw: 2, pitch: 12 },
      links: [{ to: "38terrazza5", yaw: -2, pitch: 14 }, { to: "33terrazza1", yaw: -122, pitch: 10 }, { to: "35terrazza3", yaw: 102, pitch: 13 }] },
    { id: "35terrazza3", chapter: "terraces", night: { positions: { "32scalasx": { yaw: 20.6, pitch: 7.2 }, "34terrazza2": { yaw: -79.3, pitch: 13.4 } }, view: { yaw: 20.6, pitch: 7.2 } }, name: "Terrace 3", nameIt: "Terrazza 3", nameFr: "Terrasse 3", nameEs: "Terraza 3", nameDe: "Terrasse 3",
      view: { yaw: 2, pitch: 3 },
      links: [{ to: "32scalasx", yaw: 51, pitch: 9 }, { to: "34terrazza2", yaw: -49, pitch: 10 }] },
    { id: "37terrazza4", chapter: "terraces", night: { positions: { "32scalasx": { yaw: 89.0, pitch: 16.2 }, "31scaladx": { yaw: -95.7, pitch: 14.5 }, "38terrazza5": { yaw: 174.5, pitch: 24.1 } }, view: { yaw: 89.0, pitch: 16.2 } }, name: "Terrace 4", nameIt: "Terrazza 4", nameFr: "Terrasse 4", nameEs: "Terraza 4", nameDe: "Terrasse 4",
      view: { yaw: -179, pitch: -13 },
      links: [{ to: "31scaladx", yaw: -107, pitch: 11 }, { to: "32scalasx", yaw: 103, pitch: 9 }, { to: "38terrazza5", yaw: 175, pitch: 9 }, { to: "12torredrone", yaw: -178, pitch: -22 }] },
    { id: "38terrazza5", chapter: "terraces", night: { positions: { "37terrazza4": { yaw: -0.6, pitch: 13.8 }, "34terrazza2": { yaw: -172.7, pitch: 14.5 } }, view: { yaw: -0.6, pitch: 13.8 } }, name: "Terrace 5", nameIt: "Terrazza 5", nameFr: "Terrasse 5", nameEs: "Terraza 5", nameDe: "Terrasse 5",
      view: { yaw: 2, pitch: -1 },
      links: [{ to: "34terrazza2", yaw: -177, pitch: 17 }, { to: "37terrazza4", yaw: -2, pitch: 13 }, { to: "31scaladx", yaw: -55, pitch: 6 }, { to: "32scalasx", yaw: 48, pitch: 6 }] },
    { id: "39tratturo1", chapter: "trail", night: { positions: { "40tratturo2": { yaw: -179.4, pitch: 11.7 }, "28antipasti2": { yaw: 7.4, pitch: 11.9 } }, view: { yaw: -179.4, pitch: 11.7 } }, name: "Drover's Trail 1", nameIt: "Tratturo 1", nameFr: "Chemin des Bergers 1", nameEs: "Camino de los Pastores 1", nameDe: "Triftweg 1",
      view: { yaw: 4, pitch: -5 },
      links: [{ to: "40tratturo2", yaw: 165, pitch: 0 }, { to: "28antipasti2", yaw: 7, pitch: 23 }] },
    { id: "40tratturo2", chapter: "trail", night: { positions: { "39tratturo1": { yaw: 4.2, pitch: 12.9 }, "tratturo3b": { yaw: 129.6, pitch: -5.5 } }, view: { yaw: 4.2, pitch: 12.9 } }, name: "Drover's Trail 2", nameIt: "Tratturo 2", nameFr: "Chemin des Bergers 2", nameEs: "Camino de los Pastores 2", nameDe: "Triftweg 2",
      view: { yaw: 172, pitch: -3 },
      links: [{ to: "41tratturo3", yaw: -15, pitch: -12 }, { to: "39tratturo1", yaw: -176, pitch: 29 }] },
    // Night-only: photo 121, no day photo exists for this spot. It never appears in day mode.
    { id: "tratturo3b", chapter: "trail", nightOnly: true, night: { positions: { "40tratturo2": { yaw: -7.7, pitch: 5.3 }, "41tratturo3": { yaw: -176.8, pitch: -11.2 } }, view: { yaw: -7.7, pitch: 5.3 } }, name: "Drover's Trail 3", nameIt: "Tratturo 3", nameFr: "Chemin des Bergers 3", nameEs: "Camino de los Pastores 3", nameDe: "Triftweg 3",
      view: { yaw: 0, pitch: 0 },
      links: [{ to: "40tratturo2", yaw: -7.7, pitch: 5.3 }, { to: "41tratturo3", yaw: -176.8, pitch: -11.2 }] },
    { id: "41tratturo3", chapter: "trail", night: { positions: { "42tratturo3": { yaw: -160.5, pitch: -15.2 }, "tratturo3b": { yaw: 18.9, pitch: 10.2 } }, view: { yaw: -160.5, pitch: -15.2 }, name: "Drover's Trail 4", nameIt: "Tratturo 4", nameFr: "Chemin des Bergers 4", nameEs: "Camino de los Pastores 4", nameDe: "Triftweg 4" }, name: "Drover's Trail 3", nameIt: "Tratturo 3", nameFr: "Chemin des Bergers 3", nameEs: "Camino de los Pastores 3", nameDe: "Triftweg 3",
      view: { yaw: 141, pitch: 24 },
      links: [{ to: "40tratturo2", yaw: 177, pitch: 17 }, { to: "42tratturo3", yaw: -13, pitch: -7 }] },
    { id: "42tratturo3", chapter: "trail", night: { positions: { "04percorsotorre1": { yaw: 167.2, pitch: -9.2 }, "41tratturo3": { yaw: 1.6, pitch: -1.8 } }, view: { yaw: 167.2, pitch: -9.2 }, name: "Drover's Trail 5", nameIt: "Tratturo 5", nameFr: "Chemin des Bergers 5", nameEs: "Camino de los Pastores 5", nameDe: "Triftweg 5" }, name: "Drover's Trail 4", nameIt: "Tratturo 4", nameFr: "Chemin des Bergers 4", nameEs: "Camino de los Pastores 4", nameDe: "Triftweg 4",
      view: { yaw: 140, pitch: 13 },
      links: [{ to: "41tratturo3", yaw: 147, pitch: 23 }, { to: "03ingressotorre", yaw: -22, pitch: 13 }] }
  ]
};
