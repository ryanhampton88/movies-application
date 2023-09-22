import {
    getLocalMovie, searchMovie
} from "./movie-utils.js";



const addMovieButton = document.getElementById("add-movie-button");
//////// MAIN METHOD/////////
(async () => {

    await getLocalMovie();


    // addMovieButton.addEventListener("click", () => searchMovie())
    addMovieButton.addEventListener("click", () => {
        console.log("CLICKKKKKKK")
    })


})();
//TODO: fix add movie form, directions require ability for user to enter movie title AND rating
//TODO: fix edit button functionality, use star rating system???
//TODO: make filter by gene tabs functional

