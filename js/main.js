import {
    getLocalMovie, searchMovie
} from "./movie-utils.js";
import {strToStandardCase} from "./js-utils.js";


const addMovieButton = document.getElementById("add-movie-button");
//////// MAIN METHOD/////////
(async () => {

    getLocalMovie();


    addMovieButton.addEventListener("click", () => searchMovie())


})();
//TODO: fix add movie form, directions require ability for user to enter movie title AND rating
//TODO: fix edit button functionality, use star rating system???
//TODO: make filter by gene tabs functional

