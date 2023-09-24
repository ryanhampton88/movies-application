import {
    onPageLoad,
    movieSeachByInputMatch,
    displayActionMovies,
    displayAdventureMovies,
    displayComedyMovies,
    displayHorrorMovies,
    displayRomanceMovies,
    displayDocumentaryMovies,
    displayAllMovies,
    inputValidation
} from "./movie-utils.js";


//////// MAIN METHOD/////////
(async () => {

    //makes API call to retrieve all movies from local DB and render them on screen
    onPageLoad();

    // validates the add movie from input BEFORE running the function that tries to add the movie to the DB
    inputValidation();

    //event listener for search input
    movieSeachByInputMatch();

    //event listeners for genre nav links
    displayActionMovies();
    displayAdventureMovies();
    displayComedyMovies();
    displayHorrorMovies();
    displayRomanceMovies();
    displayDocumentaryMovies();
    displayAllMovies();


})();


