// Configuration: update dates, image filenames, or this songs array whenever you add new media.
const festivalDays = [
  { id: "mahalaya", bn: "মহালয়া", name: "Mahalaya", subtitle: "The Invocation of Maa Durga", message: "Before dawn, a conch carries the prayer across the river. Mahalaya welcomes the divine arrival.", date: new Date(2026, 9, 10), arrived: "Maa Durga has arrived", image: "images/mahalaya.jpg", accent: "#8f71ff", rgb: "143,113,255" },
  { id: "shashthi", bn: "ষষ্ঠী", name: "Shashthi", subtitle: "The Arrival of Maa Durga", message: "The pandal glows with lamps and flowers as Maa Durga arrives with her children.", date: new Date(2026, 9, 16), arrived: "Maa Durga has arrived", image: "images/shashthi.jpg", accent: "#ffac4c", rgb: "255,172,76" },
  { id: "saptami", bn: "সপ্তমী", name: "Saptami", subtitle: "The Worship of Nabapatrika", message: "The sacred Nabapatrika is welcomed at sunrise, carrying nature's blessing into the puja.", date: new Date(2026, 9, 17), arrived: "Shubho Saptami", image: "images/saptami.jpg", accent: "#a7dc70", rgb: "167,220,112" },
  { id: "ashtami", bn: "অষ্টমী", name: "Ashtami", subtitle: "The Divine Power", message: "Anjali, incense and a sea of diyas honour the radiant strength of Maa Durga.", date: new Date(2026, 9, 18), arrived: "Shubho Maha Ashtami", image: "images/ashtami.jpg", accent: "#ff6863", rgb: "255,104,99" },
  { id: "navami", bn: "নবমী", name: "Navami", subtitle: "The Celebration of Victory", message: "Festival lights rise through the evening as joy, music and devotion fill the pandal.", date: new Date(2026, 9, 19), arrived: "Shubho Maha Navami", image: "images/navami.jpg", accent: "#ec65f5", rgb: "236,101,245" },
  { id: "dashami", bn: "দশমী", name: "Dashami", subtitle: "The Farewell", message: "A golden farewell by the river, with sindoor, blessings and the promise Maa Durga will return.", date: new Date(2026, 9, 20), arrived: "Subho Bijoya", image: "images/dashami.jpg", accent: "#ff944f", rgb: "255,148,79" }
];

const songs = [
  ["Mahalaya — Original Chandi Path", "audio/Mahalaya __ Original Chandi Path __ Birendra Krishna Bhadra full Chandipath #মহিষাসুরমর্দ্দিনী [YQFNRoi7rEc].mp3"],
  ["Gouri Elo Dekhe Ja Lo", "audio/Gouri-elo-dekhe-ja-lo-mp3-the-bongclub.mp3"],
  ["Dugga Maa Aseche", "audio/dugga-maa-aseche-mp3-the-bongclub.mp3"],
  ["Shiuli Fuler Nolok Debo Debo", "audio/shiuli-fuler-nolok-debo-debo-mp3-the-bongclub.mp3"],
  ["Dhak Baja Kashor Baja", "audio/Dhak-Baja-Kashor-Baja-Mp3-the-bongclub.mp3"]
];

const app = document.getElementById("app");
const nav = document.getElementById("bottomNav");
const audio = document.getElementById("audio");
const drawer = document.createElement("aside");
const pad = value => String(value).padStart(2, "0");
let activeDay = 0;
let activeSong = -1;

function timeLeft(date) {
  const ms = date - Date.now();
  if (ms <= 0) return null;
  return [Math.floor(ms / 86400000), Math.floor(ms % 86400000 / 3600000), Math.floor(ms % 3600000 / 60000), Math.floor(ms % 60000 / 1000)];
}

function render() {
  const day = festivalDays[activeDay];
  const left = timeLeft(day.date);
  const values = left || [0, 0, 0, 0];
  const labels = ["Days", "Hours", "Minutes", "Seconds"];
  app.innerHTML = `<section class="sheet sheet--${day.id}" style="background-image:url('${day.image}');--accent:${day.accent};--accent-rgb:${day.rgb}">
    <div class="particle-field"></div>
    <header class="topbar"><div class="brand">দুর্গোৎসব<small>Durga Puja 2026</small></div><p class="day-count">Day ${activeDay + 1} of 6</p></header>
    <div class="hero"><p class="eyebrow">${day.bn} · ${day.name}</p><h1>${day.name}<span>${day.subtitle}</span></h1><p class="message">${day.message}</p>
      <div class="countdown-card"><p class="countdown-heading"><span id="countdownMessage">${left ? "Countdown to " + day.name : day.arrived}</span><span>${day.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></p>
      <div class="countdown">${values.map((number, index) => `<div class="unit"><b data-timer="${index}">${pad(number)}</b><span>${labels[index]}</span></div>`).join("")}</div></div>
    </div>
    <div class="lower"><button id="previousDay" class="page-button" type="button" ${activeDay === 0 ? "disabled" : ""}>← Previous</button><p class="music-summary">${songs.length} Devotional Songs<br><button id="openPlaylist" type="button">Open playlist &amp; play music</button></p><button id="nextDay" class="page-button" type="button" ${activeDay === festivalDays.length - 1 ? "disabled" : ""}>Next →</button></div>
  </section>`;
  document.getElementById("previousDay").onclick = () => chooseDay(activeDay - 1);
  document.getElementById("nextDay").onclick = () => chooseDay(activeDay + 1);
  document.getElementById("openPlaylist").onclick = togglePlaylist;
  nav.innerHTML = festivalDays.map((item, index) => `<button class="nav-day ${index === activeDay ? "active" : ""}" data-index="${index}" type="button">${item.name}</button>`).join("");
  nav.querySelectorAll(".nav-day").forEach(button => button.onclick = () => chooseDay(Number(button.dataset.index)));
}

function chooseDay(index) {
  if (index < 0 || index >= festivalDays.length) return;
  activeDay = index;
  render();
  if (activeDay === 0) selectSong(0, false);
  scrollTo({ top: 0, behavior: "smooth" });
}

function renderPlaylist() {
  drawer.className = "playlist-drawer";
  drawer.innerHTML = `<h2>${songs.length} Devotional Songs</h2><p>Select a song to play.</p><div class="playlist">${songs.map(([name], index) => `<button class="song ${index === activeSong ? "active" : ""}" data-song="${index}" type="button"><span class="song-number">${pad(index + 1)}</span><span><span class="song-name">${name}</span><span class="song-artist">The Bong Club</span></span></button>`).join("")}</div>`;
  drawer.querySelectorAll(".song").forEach(button => button.onclick = () => selectSong(Number(button.dataset.song), true));
}

function togglePlaylist() {
  const isOpen = drawer.classList.toggle("open");
  document.getElementById("playlistToggle").setAttribute("aria-expanded", String(isOpen));
}

function mediaUrl(src) {
  return src.split("/").map(encodeURIComponent).join("/");
}

function selectSong(index, playNow) {
  if (!songs[index][1]) return;
  activeSong = index;
  audio.src = mediaUrl(songs[index][1]);
  audio.load();
  document.getElementById("trackTitle").textContent = songs[index][0];
  document.getElementById("trackArtist").textContent = "The Bong Club";
  renderPlaylist();
  if (playNow) audio.play();
}

function nextSong(direction) {
  for (let tries = 0, index = activeSong; tries < songs.length; tries++) {
    index = (index + direction + songs.length) % songs.length;
    if (songs[index][1]) return selectSong(index, true);
  }
}

function format(seconds) { return Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${pad(Math.floor(seconds % 60))}` : "0:00"; }

document.body.append(drawer);
renderPlaylist();
render();
selectSong(0, false);
document.getElementById("playlistToggle").onclick = togglePlaylist;
document.getElementById("previous").onclick = () => nextSong(-1);
document.getElementById("next").onclick = () => nextSong(1);
document.getElementById("playPause").onclick = () => activeSong < 0 ? selectSong(0, true) : audio.paused ? audio.play() : audio.pause();
document.getElementById("volume").oninput = event => audio.volume = event.target.value;
document.getElementById("progress").oninput = event => { if (audio.duration) audio.currentTime = audio.duration * event.target.value / 100; };
audio.onplay = () => {
  document.getElementById("playPause").textContent = "❚❚";
  document.getElementById("playPause").setAttribute("aria-label", "Pause selected song");
};
audio.onpause = () => {
  document.getElementById("playPause").textContent = "▶";
  document.getElementById("playPause").setAttribute("aria-label", "Play selected song");
};
audio.onerror = () => {
  document.getElementById("trackArtist").textContent = "Unable to load this audio file";
  document.getElementById("playPause").textContent = "▶";
};
audio.onended = () => nextSong(1);
audio.onloadedmetadata = () => {
  document.getElementById("progress").value = 0;
  document.getElementById("time").textContent = `0:00 / ${format(audio.duration)}`;
};
audio.ontimeupdate = () => {
  document.getElementById("progress").value = audio.duration ? audio.currentTime / audio.duration * 100 : 0;
  document.getElementById("time").textContent = `${format(audio.currentTime)} / ${format(audio.duration)}`;
};

setInterval(() => {
  const left = timeLeft(festivalDays[activeDay].date);
  if (!left) return;
  document.querySelectorAll("[data-timer]").forEach((element, index) => element.textContent = pad(left[index]));
}, 1000);
