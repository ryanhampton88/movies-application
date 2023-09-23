import {
    onPageLoad,getLocalMovie,getlocalMovieDb, searchMovie, renderMovie, movieSeachByInputMatch, displayActionMovies, displayAdventureMovies, displayComedyMovies, displayHorrorMovies, displayRomanceMovies, displayDocumentaryMovies, displayAllMovies
} from "./movie-utils.js";



const movieSearchInput = document.getElementById("movie-search");
const addMovieButton = document.getElementById("add-movie-button");
const loadingScreen = document.createElement("div");
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

movieSeachByInputMatch()


    displayActionMovies()
    displayAdventureMovies()
    displayComedyMovies()
    displayHorrorMovies()
    displayRomanceMovies()
    displayDocumentaryMovies()
    displayAllMovies()



})();
//TODO: fix add movie form, directions require ability for user to enter movie title AND rating
//TODO: fix edit button functionality, use star rating system???
//TODO: make filter by gene tabs functional

