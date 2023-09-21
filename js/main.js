import {
    getMovie,
    postMovie
} from "./movie-utils.js"


const renderMovie = (movie) => {
    const movieCard = document.createElement("div");
    // movieCard.classList.add("movie-");
    movieCard.innerHTML = `
                        <div class="movie-card-title">${movie.Title}<div>
                        <p class="movie-card-ratings">${movie.Ratings}</p>
                        <p class="movie-card-genre">${movie.Genre}</p>
                        <span class="book-card-plot">${movie.Plot}</span>
                        <button>DELETE</button>
                        `
    const movieDisplay = document.getElementById("display-movies");

    // const editBtn = movieCard.querySelector("button");
    // editBtn.addEventListener("click", async () => {
    //     //     DO THE THANG!
    // });
    movieDisplay.appendChild(movieCard);

}


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

    let postNewMovie = await postMovie(newMovie);
    console.log(postNewMovie);

    renderMovie(movie);

    /////////
})();
