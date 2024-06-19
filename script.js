let currentSongs = new Audio();
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        if (as[index].href.endsWith(".mp3")) {
            songs.push(as[index].href.split(`/${folder}/`)[1]);
        }
    }
    let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML +
            `<li>
                            <img  class = "invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Ayushman</div>
                            </div>
                            <div class="playNow invert">
                                <span class = "invert"> Play Now</span>
                                <img src="play.svg" alt="">
                            </div>
                        </li>`;
    }
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs;

}
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    let cardContainer = document.querySelector(".cardContainer")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
   for (let index = 0; index < array.length; index++) {
    const e = array[index];
    console.log(e)
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML +
                `<div data-folder = ${folder} class="card">
                        <div class = "play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="#000000" stroke-width="1.5" fill="#000" stroke-linejoin="round" />
                            </svg>
                        </div>                        
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.Description}</p>
                    </div>`
        }
    }
    
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}
let songs;
function formatTime(seconds) {
    // Calculate minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = parseInt(seconds % 60);

    // Pad single digit seconds with a leading zero  
    // Return the formatted time
    return `${minutes}:${remainingSeconds}`;
}
const playMusic = (track, pause = false) => {
    currentSongs.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSongs.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00/00:00"

}
async function main() {
    displayAlbums();
    await getSongs("songs/ncs");
    playMusic(songs[0], true)

    play.addEventListener("click", () => {
        if (currentSongs.paused) {
            currentSongs.play();
            play.src = "pause.svg"

        }
        else {
            currentSongs.pause();
            play.src = "play.svg"
        }
    })
    currentSongs.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSongs.currentTime)}/${formatTime(currentSongs.duration)}`
        document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSongs.currentTime = ((currentSongs.duration) * percent) / 100;

    })

    document.querySelector(".ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0]);
        if ((index + 1) < length) {
            playMusic(songs[index + 1]);
        }
    })
    document.querySelector(".range").addEventListener("change", (e) => {

        currentSongs.volume = parseInt(e.target.value) / 100;
    })
    document.querySelector(".volume>img").addEventListener("click",e=>{
       if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg","mute.svg");
        currentSongs.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
       }
       else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg");
        currentSongs.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
       }
    })


}
main();