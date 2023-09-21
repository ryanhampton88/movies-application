import {
    getMovie,
    postMovie,
    getLocalMovie,
    renderMovie
} from "./movie-utils.js"


const userTitleInput = document.getElementById("user-title");
const userRatingInput = document.getElementById("user-rating");
const addMovieButton = document.getElementById("add-movie-button");



//////// MAIN METHOD
(async () => {
    /////
    const movie = await getMovie("avatar");
    console.log(movie);

    const newMovie = {
        "title": "Jess and Ryan's Code",
        "Ratings": 5,
        "Genre": "",
        "Plot": ""
    }



    renderMovie(movie);

    let localMovies = await getLocalMovie()
    console.log(localMovies);
    localMovies.forEach((localMovie) => {
        renderMovie(localMovie)
    })

    addMovieButton.addEventListener("click", function() {
        let newTitle = userTitleInput.value
        console.log(newTitle);
        let newRating = userRatingInput.value
        console.log(newRating);
        let newMovieObj = {
            "Title": `${newTitle}`,
            "Ratings": `${newRating}`,
            "Genre": "",
            "Plot": ""
        }
        postMovie(newMovieObj)

    })


    /////////
})();
