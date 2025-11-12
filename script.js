/* =====================================================
   Actividad 13 — Google Maps + Mashup Multimedia
   - Búsqueda con Autocomplete (Places)
   - Marcadores con InfoWindow
   - Lista sincronizada con el mapa
   - Dock multimedia (audio, imagen, video/YouTube)
===================================================== */

let map, bounds, markers = [], activeIndex = -1, infoWindow, autocomplete;

// Catálogo de puntos de interés (ejemplo en CABA)
const poiData = [
  {
    title: "Obelisco",
    position: { lat: -34.6037389, lng: -58.3815704 },
    media: { type: "image", src: "https://upload.wikimedia.org/wikipedia/commons/6/6f/ObeliscoBA2015.2.jpg" },
    caption: "Símbolo de Buenos Aires"
  },
  {
    title: "Teatro Colón",
    position: { lat: -34.601944, lng: -58.383333 },
    media: { type: "audio", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    caption: "Audio ilustrativo de ambiente (demo)"
  },
  {
    title: "Museo Nacional de Bellas Artes",
    position: { lat: -34.583889, lng: -58.393056 },
    media: { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    caption: "Video MP4 de muestra (demo)"
  },
  {
    title: "Planetario Galileo Galilei",
    position: { lat: -34.5725, lng: -58.403333 },
    media: { type: "youtube", src: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    caption: "Video de YouTube (embed)"
  }
];

// Inicializa Google Maps y UI
window.initMap = function initMap(){
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.6037, lng: -58.3816 },
    zoom: 13,
    mapId: "DEMO_MAP_ID" // opcional, si tenés Map Styles
  });
  bounds = new google.maps.LatLngBounds();
  infoWindow = new google.maps.InfoWindow();

  // Autocomplete
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("search-input"),
    { fields: ["geometry", "name"] }
  );
  autocomplete.bindTo("bounds", map);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    map.panTo(place.geometry.location);
    map.setZoom(15);
  });

  // Crear marcadores y lista
  buildMarkersAndList();

  // Controles del Dock
  document.getElementById("btn-prev").addEventListener("click", () => selectIndex((activeIndex - 1 + poiData.length) % poiData.length));
  document.getElementById("btn-next").addEventListener("click", () => selectIndex((activeIndex + 1) % poiData.length));
  document.getElementById("btn-play").addEventListener("click", togglePlay);
};

function buildMarkersAndList(){
  const list = document.getElementById("poi-list");
  list.innerHTML = "";
  markers = [];
  bounds = new google.maps.LatLngBounds();

  poiData.forEach((poi, idx) => {
    // Lista
    const item = document.createElement("div");
    item.className = "poi";
    item.innerHTML = `
      <div class="title">${poi.title}</div>
      <div class="meta">${poi.position.lat.toFixed(4)}, ${poi.position.lng.toFixed(4)}</div>
      <div class="meta">${labelMedia(poi.media.type)} · ${poi.caption}</div>
    `;
    item.addEventListener("click", () => selectIndex(idx));
    list.appendChild(item);

    // Marker
    const marker = new google.maps.Marker({
      position: poi.position,
      map,
      title: poi.title
    });
    marker.addListener("click", () => selectIndex(idx, true));
    markers.push(marker);

    bounds.extend(poi.position);
  });

  map.fitBounds(bounds);
}

function selectIndex(idx, fromMarker = false){
  activeIndex = idx;
  const poi = poiData[idx];

  // Centrar mapa y abrir infoWindow
  map.panTo(poi.position);
  map.setZoom(Math.max(map.getZoom(), 14));
  const html = `
    <div style="max-width:240px">
      <strong>${poi.title}</strong><br/>
      <small>${poi.caption}</small><br/>
      <em>${labelMedia(poi.media.type)}</em>
    </div>
  `;
  infoWindow.setContent(html);
  infoWindow.open(map, markers[idx]);

  // Pintar en Dock
  setDock(poi);

  // Destacar en lista
  document.querySelectorAll(".poi").forEach((el, i) => {
    el.style.outline = (i === idx) ? "2px solid var(--accent)" : "none";
  });

  // Si vino de marker, hacer scroll hacia el ítem
  if (fromMarker) {
    const node = document.querySelectorAll(".poi")[idx];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function labelMedia(type){
  switch(type){
    case "image": return "Imagen";
    case "audio": return "Audio";
    case "video": return "Video";
    case "youtube": return "YouTube";
    default: return "Medio";
  }
}

function setDock(poi){
  const title = document.getElementById("dock-title");
  const media = document.getElementById("dock-media");
  title.textContent = poi.title + " — " + poi.caption;
  media.innerHTML = ""; // limpiar

  if (poi.media.type === "image"){
    const img = document.createElement("img");
    img.src = poi.media.src;
    img.alt = poi.title;
    media.appendChild(img);
  } else if (poi.media.type === "audio"){
    const audio = document.createElement("audio");
    audio.src = poi.media.src;
    audio.controls = true;
    audio.autoplay = true;
    media.appendChild(audio);
  } else if (poi.media.type === "video"){
    const video = document.createElement("video");
    video.src = poi.media.src;
    video.controls = true;
    video.autoplay = true;
    media.appendChild(video);
  } else if (poi.media.type === "youtube"){
    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "200";
    iframe.src = poi.media.src + "?rel=0&showinfo=0";
    iframe.title = poi.title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    media.appendChild(iframe);
  }
}

function togglePlay(){
  const media = document.querySelector("#dock-media audio, #dock-media video");
  if (!media) return;
  if (media.paused) { media.play(); } else { media.pause(); }
}
