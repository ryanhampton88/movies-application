import {
    getMovie, postMovie, getLocalMovie, renderMovie, searchMovie
} from "./movie-utils.js";
import {strToStandardCase} from "./js-utils.js";


const addMovieButton = document.getElementById("add-movie-button");
//////// MAIN METHOD/////////
(async () => {


    let localMovies = await getLocalMovie();
    localMovies.forEach((localMovie) => {
        console.log(localMovie);
        let test = localMovie.Ratings.split("/")[0]
        console.log(test);

        renderMovie(localMovie);
    });


    addMovieButton.addEventListener("click", () => searchMovie())


})();
//TODO: fix add movie form, directions require ability for user to enter movie title AND rating
//TODO: actually DELETE movie from DB when delete button is clicked
//TODO: fix edit button functionality, use star rating system???
//TODO: loading screen, display laoding message, remove loading message when fetch request in obatined
//TODO: make filter by gene tabs functional

