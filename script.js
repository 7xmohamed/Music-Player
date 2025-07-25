const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const albumEl = document.getElementById('album');
const yearEl = document.getElementById('year');
const miniTitleEl = document.getElementById('mini-title');
const miniArtistEl = document.getElementById('mini-artist');
const coverArt = document.getElementById('cover-art');
const miniCover = document.getElementById('mini-cover');
const playlistBody = document.getElementById('playlist-body');
const songCountEl = document.getElementById('song-count');
const totalDurationEl = document.getElementById('total-duration');

let isPlaying = false;
let isShuffled = false;
let isRepeated = false;
let currentSongIndex = 0;

let isDraggingProgress = false;

const musicNoteSVG = `
    <svg class="music-icon" viewBox="0 0 24 24">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
`;

const songs = [
    {
        title: "HARD (Tape Version)",
        artist: "GLAVO",
        album: "Tape Sessions",
        year: "2023",
        duration: "5:11",
        file: "./music/HARD (Tape Version).mp3",
        cover: "./img/august.jpg"
    },
    {
        title: "HOW I FEEL",
        artist: "GLAVO",
        album: "Tape Sessions",
        year: "2023",
        duration: "3:07",
        file: "./music/HOW I FEEL.mp3",
        cover: "./img/august.jpg"
    },
    {
        title: "NO GOOD",
        artist: "GLAVO",
        album: "Tape Sessions",
        year: "2023",
        duration: "3:05",
        file: "./music/NO GOOD.mp3",
        cover: "./img/august.jpg"
    },
    {
        title: "Runaway",
        artist: "GLAVO",
        album: "Tape Sessions",
        year: "2023",
        duration: "3:18",
        file: "./music/Runaway.mp3",
        cover: "./img/august.jpg"
    },
    {
        title: "Unknown",
        artist: "GLAVO",
        album: "Tape Sessions",
        year: "2023",
        duration: "4:40",
        file: "./music/Unknown.mp3",
        cover: "./img/august.jpg"
    },
    {
        title: "Who I was",
        artist: "GLAVO",
        album: "Tape Sessions",
        year: "2023",
        duration: "3:53",
        file: "./music/Who I was.mp3",
        cover: "./img/august.jpg"
    }
];

function renderPlaylist() {
    playlistBody.innerHTML = '';

    songs.forEach((song, index) => {
        const row = document.createElement('tr');
        row.className = index === currentSongIndex && isPlaying ? 'playing' : '';
        row.innerHTML = `
            <td>${index + 1}</td>
            <td class="song-title">${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.duration}</td>
        `;
        row.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        playlistBody.appendChild(row);
    });
}

function updatePlaylistStats() {
    songCountEl.textContent = `${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`;

    let totalSeconds = 0;
    songs.forEach(song => {
        const [minutes, seconds] = song.duration.split(':').map(Number);
        totalSeconds += minutes * 60 + seconds;
    });

    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);
    totalDurationEl.textContent = `• ${totalMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.file;
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    albumEl.textContent = song.album;
    yearEl.textContent = song.year;
    miniTitleEl.textContent = song.title;
    miniArtistEl.textContent = song.artist;

    document.title = `${song.title} • ${song.artist} | MusicLover`;

    if (song.cover) {
        coverArt.innerHTML = `<img src="${song.cover}" alt="${song.title}">`;
        miniCover.innerHTML = `<img src="${song.cover}" alt="${song.title}">`;
    } else {
        coverArt.innerHTML = musicNoteSVG;
        miniCover.innerHTML = musicNoteSVG;
    }

    renderPlaylist();

    if (isPlaying) {
        audioPlayer.play().catch(e => console.error("Playback failed:", e));
    }
}

function playSong() {
    isPlaying = true;
    audioPlayer.play().catch(e => console.error("Playback failed:", e));
    playBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    coverArt.classList.add('playing');
    renderPlaylist();
}

function pauseSong() {
    isPlaying = false;
    audioPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play</span>';
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    coverArt.classList.remove('playing');
}

function nextSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

function prevSong() {
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
}

function toggleRepeat() {
    isRepeated = !isRepeated;
    repeatBtn.classList.toggle('active', isRepeated);
}

function updateProgress() {
    if (!isDraggingProgress && audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        updateTimeDisplay();
    }
}

function updateTimeDisplay() {
    const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
    const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;

    const durationMinutes = Math.floor(audioPlayer.duration / 60);
    const durationSeconds = Math.floor(audioPlayer.duration % 60);
    if (!isNaN(durationMinutes)) {
        durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
}

function setProgress(e) {
    if (!audioPlayer.duration) return;
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

function startDragProgress() {
    isDraggingProgress = true;
}

function endDragProgress() {
    isDraggingProgress = false;
    updateProgress();
}

function updateVolume() {
    audioPlayer.volume = volumeSlider.value;
    if (audioPlayer.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (audioPlayer.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

function init() {
    renderPlaylist();
    updatePlaylistStats();
    if (songs.length > 0) {
        loadSong(currentSongIndex);
    }

    audioPlayer.addEventListener('error', () => {
        console.error("Audio playback error:", audioPlayer.error);
        nextSong();
    });

    playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
    playPauseBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('durationchange', updateTimeDisplay);
    audioPlayer.addEventListener('ended', () => {
        if (isRepeated) {
            audioPlayer.currentTime = 0;
            playSong();
        } else {
            nextSong();
        }
    });
    progressContainer.addEventListener('click', setProgress);
    progressContainer.addEventListener('mousedown', startDragProgress);
    document.addEventListener('mouseup', endDragProgress);
    volumeSlider.addEventListener('input', updateVolume);

    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                isPlaying ? pauseSong() : playSong();
                break;
            case 'ArrowRight':
                if (e.ctrlKey) {
                    audioPlayer.currentTime += 10;
                } else {
                    nextSong();
                }
                break;
            case 'ArrowLeft':
                if (e.ctrlKey) {
                    audioPlayer.currentTime -= 10;
                } else {
                    prevSong();
                }
                break;
            case 'ArrowUp':
                volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
                updateVolume();
                break;
            case 'ArrowDown':
                volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
                updateVolume();
                break;
            case 'KeyM':
                audioPlayer.muted = !audioPlayer.muted;
                volumeIcon.className = audioPlayer.muted ? 'fas fa-volume-mute' :
                    audioPlayer.volume < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up';
                break;
        }
    });
}

init();