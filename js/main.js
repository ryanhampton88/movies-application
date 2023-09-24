import {
    onPageLoad,
    getLocalMovie,
    getlocalMovieDb,
    searchMovie,
    renderMovie,
    movieSeachByInputMatch,
    displayActionMovies,
    displayAdventureMovies,
    displayComedyMovies,
    displayHorrorMovies,
    displayRomanceMovies,
    displayDocumentaryMovies,
    displayAllMovies,
    defaultBigMovie
} from "./movie-utils.js";


const movieSearchInput = document.getElementById("movie-search");
const addMovieButton = document.getElementById("add-movie-button");
const loadingScreen = document.createElement("div");
const bigDisplay = document.getElementById("video");
loadingScreen.innerHTML =
    `
     <div class="d-flex justify-content-center align-items-center w-100 h-100 display-1">LOADING...</div>
`;
const loading = document.getElementById("display-movies");

//////// MAIN METHOD/////////
(async () => {

    //makes API call to retrieve all movies from local DB and render them on screen
    onPageLoad();


    addMovieButton.addEventListener("click", (e) => {
        e.preventDefault();
        searchMovie();
    });

    movieSeachByInputMatch();


    displayActionMovies();
    displayAdventureMovies();
    displayComedyMovies();
    displayHorrorMovies();
    displayRomanceMovies();
    displayDocumentaryMovies();
    displayAllMovies();

    defaultBigMovie();


    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDVhODU2NzM1YWZiYzBmM2RiMzhiNzUzODlmZGZmNyIsInN1YiI6IjY1MGM1NjI5NGRhM2Q0MDE0ZDU1ZWJiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kdRqgsp_HWv4gAIEE6pdhQhNktR3HQyFL-IAowwf0Ts"
        }
    };

    // fetch("https://api.themoviedb.org/3/movie/19995/videos?language=en-US", options)
    //     .then(response => response.json())
    //     .then((data) => {
    //         console.log(data.results[0].key);
    //         let youtubeKey = data.results[0].key;
    //         let trailorUrl = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1`;
    //         console.log(trailorUrl);
    //         let iframe = document.createElement("div");
    //         let youtubeTrailor = `<iframe width="560" height="315" src="${trailorUrl}" frameborder="0"></iframe>`;
    //         iframe.innerHTML = youtubeTrailor
    //         bigDisplay.appendChild(iframe);
    //     })
    //     .catch(err => console.error(err));


})();
//TODO: fix add movie form, directions require ability for user to enter movie title AND rating
//TODO: fix edit button functionality, use star rating system???
//TODO: make filter by gene tabs functional

