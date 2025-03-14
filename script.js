// Sample playlist data
const samplePlaylist = [
  {
    id: 1,
    title: "Lama Tkooni",
    artist: "siilawy",
    duration: "2:55",
    url: "https://raw.githubusercontent.com/jooexploit/PureTune/refs/heads/main/siilawy%20-%20Lama%20Tkooni_vocals_no_silence.mp3",
  },
  {
    id: 2,
    title: "Ansaki",
    artist: "Tommy Gun",
    duration: "3:10",
    url: "https://raw.githubusercontent.com/jooexploit/PureTune/refs/heads/main/Tommy%20Gun%20-%20Ansaki_vocals_no_silence.mp3",
  },
  {
    id: 3,
    title: "Ser Alsada",
    artist: "Hussain Aljassmi",
    duration: "2:34",
    url: "https://raw.githubusercontent.com/jooexploit/PureTune/refs/heads/main/Hussain%20Aljassmi%20-%20Ser%20Alsada%20(%20Mountain%20View)_vocals_no_silence.mp3",
  },
  {
    id: 4,
    title: "Yom Gdeed",
    artist: "Amir Eid",
    duration: "2:34",
    url: "https://raw.githubusercontent.com/jooexploit/PureTune/refs/heads/main/Amir%20Eid%20-%20يوم%20جديد_PureTune_no_silence.mp3",
  },
];

let isPlaying = false;
let isMuted = false;
let isLooping = false;
let volume = 50;
let currentTrack = samplePlaylist[0];
let currentTime = 0;
let duration = 0;

const audioPlayer = document.getElementById("audioPlayer");
const playPauseButton = document.getElementById("playPauseButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const loopButton = document.getElementById("loopButton");
const muteButton = document.getElementById("muteButton");
const volumeSlider = document.getElementById("volumeSlider");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const progressTooltip = document.getElementById("progressTooltip");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const playlistContainer = document.getElementById("playlist");
const playlistSection = document.getElementById("playlistSection");
const togglePlaylistButton = document.getElementById("togglePlaylist");

function init() {
  audioPlayer.src = currentTrack.url;
  audioPlayer.volume = volume / 100;
  trackTitle.textContent = currentTrack.title;
  trackArtist.textContent = currentTrack.artist;
  renderPlaylist();
  initMediaSession();
}

function renderPlaylist() {
  playlistContainer.innerHTML = "";
  samplePlaylist.forEach((track, index) => {
    const isActive = currentTrack.id === track.id;
    const button = document.createElement("div");
    button.className = `playlist-item ${isActive ? "active" : ""}`;
    button.innerHTML = `
      <div class="playlist-item-content">
        <span class="track-number">${(index + 1)
          .toString()
          .padStart(2, "0")}</span>
        <div class="track-info-mini">
          <p class="font-medium text-gray-800">${track.title}</p>
          <p class="text-sm text-gray-500">${track.artist}</p>
        </div>
        <div class="track-duration">
          ${
            isActive
              ? '<div class="equalizer"><span></span><span></span><span></span></div>'
              : track.duration
          }
        </div>
      </div>
    `;
    button.onclick = () => handleTrackSelect(track);
    playlistContainer.appendChild(button);
  });
}

function handleTrackSelect(track) {
  currentTrack = track;
  audioPlayer.src = track.url;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  isPlaying = true;
  audioPlayer.play();
  playPauseButton.innerHTML = '<i class="fas fa-pause h-6 w-6"></i>';
  playPauseButton.classList.add("playing");
  renderPlaylist();
  updatePlayerUI();
  initMediaSession();
}

function togglePlayPause() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    audioPlayer.play();
    playPauseButton.innerHTML = '<i class="fas fa-pause h-6 w-6"></i>';
    playPauseButton.classList.add("playing");
    navigator.mediaSession.playbackState = "playing";
  } else {
    audioPlayer.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play h-6 w-6"></i>';
    playPauseButton.classList.remove("playing");
    navigator.mediaSession.playbackState = "paused";
  }
  updatePlayerUI();
}

function stopPlaying() {
  if (isLooping) {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
  } else {
    isPlaying = false;
    playPauseButton.innerHTML = '<i class="fas fa-play h-6 w-6"></i>';
    playPauseButton.classList.remove("playing");
  }
  updatePlayerUI();
}

function updatePlayerUI() {
  if (isPlaying) {
    playPauseButton.classList.add("playing");
  } else {
    playPauseButton.classList.remove("playing");
  }
  renderPlaylist();
}

function handleTimeUpdate() {
  currentTime = audioPlayer.currentTime;
  duration = audioPlayer.duration || 0;
  progress.style.width = `${(currentTime / duration) * 100}%`;
  currentTimeDisplay.textContent = formatTime(currentTime);
  durationDisplay.textContent = formatTime(duration);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function handleProgressClick(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  audioPlayer.currentTime = percent * duration;
}

progressBar.onmousemove = (event) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  const time = percent * duration;
  progressTooltip.textContent = formatTime(time);
  progressTooltip.style.left = `${event.clientX - rect.left}px`;
};

function changeTrack(direction) {
  const currentIndex = samplePlaylist.findIndex(
    (t) => t.id === currentTrack.id
  );
  const newIndex = currentIndex + direction;
  if (newIndex >= 0 && newIndex < samplePlaylist.length) {
    handleTrackSelect(samplePlaylist[newIndex]);
  }
}

function toggleLoop() {
  isLooping = !isLooping;
  audioPlayer.loop = isLooping;
  loopButton.style.color = isLooping ? "#059669" : "#4b5563";
}

function toggleMute() {
  isMuted = !isMuted;
  audioPlayer.muted = isMuted;
  muteButton.innerHTML = isMuted
    ? '<i class="fas fa-volume-mute h-5 w-5"></i>'
    : '<i class="fas fa-volume-up h-5 w-5"></i>';
}

togglePlaylistButton.onclick = () => {
  playlistSection.classList.toggle("active");
};

playPauseButton.onclick = togglePlayPause;
prevButton.onclick = () => changeTrack(-1);
nextButton.onclick = () => changeTrack(1);
loopButton.onclick = toggleLoop;
muteButton.onclick = toggleMute;
volumeSlider.oninput = (e) => {
  volume = parseInt(e.target.value);
  audioPlayer.volume = volume / 100;
  if (isMuted) toggleMute();
};

document.addEventListener("DOMContentLoaded", init);

function initMediaSession() {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: "PureTune",
      artwork: [
        {
          src: "assets/images/pure-tune-logo.png",
          sizes: "512x512",
          type: "image/jpeg",
        },
        {
          src: "assets/images/pure-tune-logo.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => togglePlayPause());
    navigator.mediaSession.setActionHandler("pause", () => togglePlayPause());
    navigator.mediaSession.setActionHandler("previoustrack", () =>
      changeTrack(-1)
    );
    navigator.mediaSession.setActionHandler("nexttrack", () => changeTrack(1));
  }
}
