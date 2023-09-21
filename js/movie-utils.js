import {
    OMDB_KEY
} from "./keys.js"
const getMovie = async (title) => {
    const url = `http://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${title}`;
    const options = {
        "method": "GET",
        "headers": {
        }
    }

    const response = await fetch(url, options);
    const movie = await response.json();
    return movie;
}

const getLocalMovie = async () => {
    const url = `http://localhost:3000/movies`;
    const options = {
        "method": "GET",
        "headers": {
        }
    }

    const response = await fetch(url, options);
    const localMovies = await response.json();
    return localMovies;
}

const postMovie = async (movie) => {
    // try {
    // //todo: validate book isn't already in the database
    // const searchResult = await searchBookByTitle(book.title);
    // if (searchResult.length > 0) {
    //     //book already exists
    //     // throw error
    //     throw new Error("Book already exists in the database");
    // }
    const url = `http://localhost:3000/movies`;
    const body = movie;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };
    const response = await fetch(url, options);
    const newId = await response.json();
    renderMovie(newId)
    return newId;
    // } catch (error) {
    //     console.log(error);
    //     return null;
    // }
}

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


export {getMovie, postMovie, getLocalMovie, renderMovie}