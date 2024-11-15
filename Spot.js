let currentSong = new Audio();
let songs;
let currentFolder;
let currentIndex = 0;
function convertSecondsToMinutes(seconds) {

    const minutes = Math.floor(seconds / 60);
    
    
    const remainingSeconds = Math.floor(seconds % 60); 

    const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    
    // Return the formatted string as "minutes:seconds".
    return `${minutes}:${paddedSeconds}`;
}
const prevButtonClickHandler = () => {
    if (songs && songs.length > 0) {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : songs.length - 1;
        PlayMusic(songs[currentIndex]);
        console.log("prev button clicked");
    }
};

const nextButtonClickHandler = () => {
    if (songs && songs.length > 0) {
        currentIndex = (currentIndex < songs.length - 1) ? currentIndex + 1 : 0;
        PlayMusic(songs[currentIndex]);
        console.log("next button clicked");
    }
};
//Function to fetch the songs from the dic stored in a array "songs"
async function songsget(folder){
    currentFolder = folder;
    let song_api = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await song_api.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let s_apis = div.getElementsByTagName("a");
    songs = [];
    currentIndex =0;
    for (let i = 0;i<s_apis.length;i++){
        const element = s_apis[i];
        if(element.href.endsWith(".mp3")){
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]));
        }
    }
    document.getElementById("prev").removeEventListener("click", prevButtonClickHandler);
  document.getElementById("next").removeEventListener("click", nextButtonClickHandler);
    //adding the songs to the ul 
let songlist = document.getElementById("songcard_list").getElementsByTagName("ul")[0];
songlist.innerHTML ="";

for (const song of songs){
    let sName = song.replaceAll("%20"," ");
    let aName = sName.split('-')[1];
    songlist.innerHTML = songlist.innerHTML + `<li class="flex gap-8 hover:cursor-pointer  items-center justify-between"> <img src="img/music.svg" alt="" class="inversion">
                            <div class="cardinfo" id="card_info">
                        <div>${sName}</div>
                        <div>${aName.replaceAll(".mp3","")}</div>
                    </div>
                    <div class="text-[13px]" id="playnow">
                        Play Now
                        <img src="img/playbar/playbut.svg" alt=""></div>
                    </li>
    
    </li>`
}
//putting all the list element in a array
let song_array = Array.from(document.getElementById("Songlist").getElementsByTagName("li"));
//running a for each loop to apply the event listner to the clicked song
song_array.forEach(e=>{
    e.addEventListener("click",element=>{
        PlayMusic(e.querySelector(".cardinfo").firstElementChild.innerHTML);
    });

});
document.getElementById("prev").addEventListener("click", prevButtonClickHandler);
document.getElementById("next").addEventListener("click", nextButtonClickHandler);
}
const PlayMusic = (music,pause=false) => {
    currentSong.src = `/${currentFolder}/` + music;
    if(!pause){
        currentSong.play();
        document.getElementById("playy").src = "img/playbar/pause.svg";
    
    }
    
    document.getElementById("songinfo").innerHTML = music;
    console.log("Fetched songs:", songs);
}
async function displayAlbums(){
    let song_api = await fetch(`http://127.0.0.1:5500/Songs/`);
    let response = await song_api.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.getElementById("playlistcard")

    let anchorArray = Array.from(anchors);

    // Loop through each anchor element
    for (let i = 0; i < anchorArray.length; i++) {
        let e = anchorArray[i];
    
        // Check if href contains '/Songs'
        if (e.href.includes("/Songs")) {
            // Use the URL object to parse the URL
            let url = new URL(e.href);
    
            // Split the pathname and extract the folder name
            let pathParts = url.pathname.split("/");
            let folderIndex = pathParts.indexOf("Songs") + 1;
            let folder = folderIndex < pathParts.length ? pathParts[folderIndex] : null;
    
            if (folder) {
                // Log the extracted folder name for debugging
                console.log("Extracted folder name:", folder);
    
                // Fetch the JSON data
                try {
                    let song_api = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`);
                    let response = await song_api.json();
    
                    // Log the response for debugging
                    console.log(response);
    
                    // Update the HTML content
                    cardContainer.innerHTML += `
                        <div data-folder="${folder}" class="min-w-[250px] w-[250px] p-2 relative max-md:w-[300px] hover:cursor-pointer hover:c" id="card">
                            <div class="w-[250px] h-[250px]" id="imgcont">
                                <img src="Songs/${folder}/cover.jpg" alt="" class="w-[250px] h-[250px] object-cover rounded-3xl">
                            </div>
                            <h2>${response.title}</h2>
                            <p class="font-normal">${response.description}</p>
                        </div>`;
                } catch (error) {
                    console.error("Error fetching or parsing JSON:", error);
                }
            }
        }
    }
    let cards = document.querySelectorAll("[data-folder]");
    cards.forEach(card => {
        card.addEventListener("click", async item => {
            songs = await songsget(`Songs/${item.currentTarget.dataset.folder}`);
            
        });
    });
}



async function main(){
    
//getting all the songs in the "songs" folder
await songsget(`Songs/spider-man`);
//For the album playlist
displayAlbums()


//giving event listner to the play bar song buttons
playy.addEventListener("click",()=>{
    if (currentSong.paused){
        currentSong.play();
        playy.src = "img/playbar/pause.svg";
    }
    else{
        currentSong.pause();
        playy.src = "img/playbar/playbut.svg";
    }
});   
    currentSong.addEventListener("timeupdate",()=>{
        document.getElementById("songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`;
        document.querySelector(".seekcirc").style.left = (currentSong.currentTime / currentSong.duration) *100 + "%"

    });
    document.getElementById("seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100; 
        document.querySelector(".seekcirc").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent )/ 100 ;
    });
    hambur.addEventListener("click",()=>{
        document.getElementById("nav").style.left = 0;
    });
    closee.addEventListener("click",()=>{
        document.getElementById("nav").style.left = "-100%";
    });


    document.getElementById("prev").addEventListener("click", prevButtonClickHandler);
    document.getElementById("next").addEventListener("click", nextButtonClickHandler);
    rangee.getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100;

    });
    document.querySelector(".volumee>img").addEventListener("click",e=>{
        if(e.target.src.includes("img/playbar/volume.svg")){
           e.target.src = e.target.src.replace("img/playbar/volume.svg","img/playbar/mute.svg");
            currentSong.volume = 0;
            rangee.getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("img/playbar/mute.svg","img/playbar/volume.svg");
            currentSong.volume = .10;
            rangee.getElementsByTagName("input")[0].value = 50;
        }
    })
    
}
main();
