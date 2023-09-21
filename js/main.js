import {
    getMovie,
    postMovie,
    getLocalMovie,
    renderMovie, addMovie
} from "./movie-utils.js"


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


        let localMovies = await getLocalMovie()
        localMovies.forEach((localMovie) => {
            renderMovie(localMovie)
        })

    addMovie();


    /////////
})();
