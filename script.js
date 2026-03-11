console.log('Helllo this is pawan dhaka jiii ');

let currentSong = new Audio();
let songs = [];
let currFolder = "";
let currentIndex = 0;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (let element of as) {
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUl = document.querySelector(".songlist ul");
    songUl.innerHTML = "";

    for (const song of songs) {
        songUl.innerHTML += `
        <li>
            <img class="invert" src="./Images/music.svg" alt="">
            <div class="info">
                <div class="songName">${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
            </div>
            <div class="playNow">
                <div class="playn">Play Now</div>
                <img class="invert" src="./Images/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(document.querySelectorAll(".songlist li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            playmusic(songs[index]);
        });
    });

    return songs;
}

const playmusic = (track, pause = false) => {
    currentIndex = songs.indexOf(track);
    currentSong.src = `/${currFolder}/` + track;

    if (!pause) {
        currentSong.play();
        play.src = "./Images/pause.svg";
    }

    document.querySelector(".songInfo").innerHTML =
        track.replaceAll("%20", " ").replaceAll(".mp3", "");
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function displayAlbum() {
    let a = await fetch(`http://127.0.0.1:5500/Songs/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let cardCont = document.querySelector(".card-cont");
    let allas = Array.from(div.getElementsByTagName("a"));

    for (let e of allas) {
        if (e.href.includes("/Songs/")) {
            let folder = e.href.split("/Songs/")[1];

            let meta = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`);
            let info = await meta.json();

            cardCont.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div>
                       <img class="pic3" src="/Songs/${folder}/cover.jpg" alt="">
                    <div class="playGreen">
                        <img src="./Images/play-black.png" alt="">
                    </div>
                </div>
                <h2>${info.title}</h2>
                <p>${info.discription}</p>
            </div>`;
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async () => {
            await getSongs(`Songs/${card.dataset.folder}`);
            playmusic(songs[0]);
        });
    });
}

function secondtominute(seconds) {
    if (isNaN(seconds)) return "00:00";
    const total = Math.floor(seconds);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

async function main() {
    await getSongs("Songs/Party_Songs");
    playmusic(songs[0], true);

    play.addEventListener("click", () => {
        if (currentSong.paused) {
    currentSong.play();
            play.src = "./Images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "./Images/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML =
            `${secondtominute(currentSong.currentTime)} / ${secondtominute(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });




    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width;
        currentSong.currentTime = currentSong.duration * percent;
        document.querySelector(".circle").style.left = percent * 100 + "%";
    });

    previous.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        playmusic(songs[currentIndex]);
    });

    next.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % songs.length;
        playmusic(songs[currentIndex]);
    });




    //plus and minus
    plus.addEventListener("click", () => {
        currentSong.volume = Math.min(1, currentSong.volume + 0.2);
    });

    minus.addEventListener("click", () => {
        currentSong.volume = Math.max(0, currentSong.volume - 0.2);
    });



    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-250%";
    });

    displayAlbum();
}

main();



