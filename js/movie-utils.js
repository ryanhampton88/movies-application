import {
    OMDB_KEY
} from "./keys.js";
import {strToStandardCase} from "./js-utils.js";

const movieSearchInput = document.getElementById("movie-search");
const userTitleInput = document.getElementById("user-title");
const userRatingInput = document.getElementById("user-rating");
const movieDisplay = document.getElementById("display-movies");
const loading = document.getElementById("display-movies");
const loadingScreen = document.createElement("div");
const bigMovieCard = document.createElement("div");
const bigMovieDisplay = document.getElementById("big-movie-display");
const displayActionGenre = document.getElementById("display-action");
const displayAdventureGenre = document.getElementById("display-adventure");
const displayComedyGenre = document.getElementById("display-comedy");
const displayHorrorGenre = document.getElementById("display-horror");
const displayRomanceGenre = document.getElementById("display-romance");
const displayAllGenres = document.getElementById("display-all");
const displayDocumentaryGenre = document.getElementById("display-documentary");

loadingScreen.innerHTML =
    `
     <div class="d-flex justify-content-center align-items-center w-100 h-100 display-1">LOADING...</div>
`;


const onPageLoad = async () => {

    addEventListener("load", async (e) => {
        loading.appendChild(loadingScreen);
        let localMovie = await getlocalMovieDb();
        loading.removeChild(loadingScreen);
        localMovie.forEach((movie) => {
            renderMovie(movie);
        });
    });
};


/////////////////Gets a movie from the OMDB API, takes a string as an input, return 1 movie object////////////////
const getMovie = async (title) => {
    const url = `http://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${title}`;
    const options = {
        "method": "GET",
        "headers": {}
    };

    const response = await fetch(url, options);
    const movie = await response.json();
    return movie;
};

const clearMovieDisplay = () => {
    movieDisplay.innerHTML = "";
};


/////////takes user input and appends to URL, makes get request, if valid, grabs movie data, and passes it through postMovie /////////
const searchMovie = async () => {
    console.log("did this work");
    let newTitle = userTitleInput.value;
    let newRating = userRatingInput.value;
    console.log(newTitle);
//clears the search input
    userTitleInput.value = "";
    userRatingInput.value = "";
    const url = `http://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${strToStandardCase(newTitle)}`;
    const options = {
        "method": "GET",
        "headers": {}
    };

    const response = await fetch(url, options);
    const movie = await response.json();
    console.log(movie);

    let newMovie = {
        "Title": `${movie.Title}`,
        "Ratings": `${newRating}`,
        "Genre": `${movie.Genre}`,
        "Plot": `${movie.Plot}`,
        "Poster": `${movie.Poster}`,
        "Year": `${movie.Year}`,
        "Director": `${movie.Director}`,
        "Rated": `${movie.Rated}`,
        "Actors": `${movie.Actors}`,
        "Runtime": `${movie.Runtime}`,

    };

    if (movie.Error === "Movie not found!") {
        console.log("Movie not found");
        return;
    } else {
        console.log("match!");
        await postMovie(newMovie);
    }

};


const getlocalMovieDb = async () => {
    const url = `http://localhost:3000/movies`;
    const options = {
        "method": "GET",
        "headers": {}
    };

    const response = await fetch(url, options);
    const localMovies = await response.json();
    return localMovies;
};

/////////////////Returns all movies from our local DB, returns the array of movie objects////////////////
const getLocalMovie = async () => {
    loading.appendChild(loadingScreen);
    const url = `http://localhost:3000/movies`;
    const options = {
        "method": "GET",
        "headers": {}
    };

    const response = await fetch(url, options);
    const localMovies = await response.json();
    loading.removeChild(loadingScreen);
    return localMovies;

};


///////checks to see if movie already exists in DB before posting it to DB///////////
const searchMovieByTitle = async (title) => {
    const url = `http://localhost:3000/movies?Title=${title}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(url, options);
    const movie = await response.json();
    return movie;
};

////////////////takes in a Movie object as an argument, then posts the object to the local DB, then renders in on screen////////////
const postMovie = async (movie) => {
    try {
        // //todo: validate movie isn't already in the database
        const searchResult = await searchMovieByTitle(movie.Title);
        if (searchResult.length > 0) {
            //movie already exists
            // throw error
            throw new Error("Movie already exists in the database");
        }

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
        renderMovie(newId);
        displayBigMovie(newId)
        return newId;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const patchMovie = async (movie) => {
    try {
        const url = `http://localhost:3000/movies/${movie.id}`;
        const body = movie;
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };
        const response = await fetch(url, options);
        const newId = await response.json();
        location.reload();
        return newId;

    } catch (error) {
        console.log(error);
        return null;
    }
};

const renderModal = (movie, action) => {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-bg"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${movie?.Title ? movie.Title : ""}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <form class="modal-form d-flex flex-column align-items-center" id="movie-form">
                <div class="d-flex flex-column gap-2 mb-2">
                    <label for="Ratings">
                        Rating
                        <input required type="number" name="Ratings" id="Rating" min="0" max="10" value="${movie?.Ratings ? movie.Ratings : ""}" />
                    </label>
                    <label for="id">
                        <input hidden required type="number" name="id" id="year" value="${movie?.id ? movie.id : ""}" />
                    </label>
                    <label for="Genre" class="d-flex align-items-center gap-1">
                        Genre
                        <textarea name="Genre" id="description">${movie?.Genre ? movie.Genre : ""}</textarea>
                    </label>
                    </div>
                    <div class="modal-form-actions">
                        <button type="submit" class="btn btn-cta btn-secondary" data-action="${action}">${action}</button>
                        <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    //nodes from the modal for event listeners
    const modalClose = modal.querySelector(".modal-close");
    const modalBg = modal.querySelector(".modal-bg");
    const modalForm = modal.querySelector("#movie-form");
    const modalFormCancel = modal.querySelector("[data-action='cancel']");
    const modalFormSave = modal.querySelector("[data-action='save']");

    console.log("got here");

    // event listener for close button
    modalClose?.addEventListener("click", () => {
        modal.remove();
    });
    modalBg?.addEventListener("click", () => {
        modal.remove();
    });
    // event listener for cancel button
    modalFormCancel?.addEventListener("click", (e) => {
        e.preventDefault();
        modal.remove();
    });
    // event listener for save button
    modalForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        let updatedMovieData = new FormData(modalForm, modalFormSave);
        let updatedMovieObj = Object.fromEntries(updatedMovieData);
        console.log(updatedMovieObj);

        let updatedMovie = await patchMovie(updatedMovieObj);
        console.log(updatedMovie);
        let refreshedMovies = await getLocalMovie();
        refreshedMovies.forEach((movie) => {
            renderMovie(movie);
        });
        alert(`Save button clicked for ${movie.Title}`);
        modal.remove();
    });

    // appends dynamically created HTML to the DOM
    document.body.appendChild(modal);
};

const renderMovie = (movie) => {
    console.log("rendering movie");
    const movieCard = document.createElement("div");
    const movieDisplay = document.getElementById("display-movies");

    movieCard.classList.add("carousel-card");
    movieCard.setAttribute("style", `background-image: url('${movie.Poster}')`);
    movieCard.setAttribute("data-id", movie.id);
    movieCard.innerHTML = `
            <div class="card-details">
              <div class="card-header">
                <h3 class="card-title">${movie.Title}</h3>
                <p class="card-description">${movie.Plot}</p>
              </div>
              <div class="card-rating">
                <ion-icon name="heart-outline" class="heart-icon"></ion-icon>
                <ion-icon name="heart-outline" class="heart-icon"></ion-icon>
                <ion-icon name="heart-outline" class="heart-icon"></ion-icon>
                <ion-icon name="heart-outline" class="heart-icon"></ion-icon>
                <ion-icon name="heart-outline" class="heart-icon"></ion-icon>
              </div>
              <div class="card-call-to-action movie-card-actions-menu">
                <button class="card-btn primary movie-card-action" data-action="edit">Edit</button>
                <button class="card-btn movie-card-action" data-action="delete">Delete</button>
              </div>
            </div>    
    `;


    // const test = Array.from(document.querySelectorAll(movieCard[movie.id]));
    movieCard.addEventListener("click", () => {
        displayBigMovie(movie);
    });

    // grab nodes from the card for event listeners
    const editBtn = movieCard.querySelector(".movie-card-action[data-action='edit']");
    const deleteBtn = movieCard.querySelector(".movie-card-action[data-action='delete']");

    // event listener for edit movie button
    editBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("click");
        renderModal(movie, "save");

    });
    // event listener for delete movie button
    deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        alert(`${movie.Title} was deleted.`);
        movieCard.remove();
        await deleteMovie(movie);
    });

    // prepends to targeted DOM element
    movieDisplay.prepend(movieCard);
};


//displays big movie details for first movie in list
let defaultBigMovie = async () => {
    let movies = await getlocalMovieDb();
    displayBigMovie(movies[movies.length - 1]);
};

function displayBigMovie(movie) {
    const bigMovieDisplay = document.getElementById("big-movie-display");
    // bigMovieDisplay.setAttribute("style", `background-image: url('${movie.Poster}'); background-repeat: no-repeat;`)
    bigMovieDisplay.innerHTML = `
             <p class="d-flex flex-column display-3 fw-bolder">${movie.Title}</p>
        <div class="d-flex gap-4"><p><span class="fw-bold">Rating:</span> ${movie.Ratings}</p>
          <p><span class="fw-bold">Released:</span> ${movie.Year}</p>
          <p><span class="fw-bold">Genre:</span> ${movie.Genre}</p></div>
          <div class="my-2 text wrap w-50"><span class="fw-bold">Actors:</span> ${movie.Actors}</div>
        <div class="my-2 text wrap w-50">${movie.Plot}</div>
        </div>   
    `;
}

const deleteMovie = async (movie) => {
    try {
        const url = `http://localhost:3000/movies/${movie.id}`;
        const body = movie;
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };
        const response = await fetch(url, options);
        const deletedMovie = await response.json();
        location.reload();
        return deletedMovie;

    } catch (error) {
        console.log(error);
        return null;
    }
};


const movieSeachByInputMatch = () => {
    movieSearchInput.addEventListener("input", async (e) => {
        e.preventDefault();
        console.log(e.target.value);
        const url = `http://localhost:3000/movies`;
        const options = {
            "method": "GET",
        };

        const response = await fetch(url, options);
        const localMovies = await response.json();

        let movieSearchMatch = [];

        for (let i = 0; i < localMovies.length; i++) {
            if (
                localMovies[i].Title
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            ) {
                movieSearchMatch.push(localMovies[i]);
            }
        }

        clearMovieDisplay();

        movieSearchMatch.forEach((movie) => {
            renderMovie(movie);
        });
        displayBigMovie(movieSearchMatch[movieSearchMatch.length-1])
    });
};

const displayActionMovies = () => {
    displayActionGenre.addEventListener(`click`, async (e) => {
        e.preventDefault();
        let localMovies = await getlocalMovieDb();
        let actionMovies = [];

        localMovies.forEach((localMovie) => {
            if (localMovie.Genre.includes("Action")) {
                actionMovies.push(localMovie);
            }
        });
        if (actionMovies.length === 0) {
            clearMovieDisplay();
            movieDisplay.innerHTML = `<h1>No matches found.</h1>`;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            actionMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(actionMovies[actionMovies.length-1])
        }
    });

};

const displayAdventureMovies = () => {
    displayAdventureGenre.addEventListener(`click`, async (e) => {
        e.preventDefault();
        let localMovies = await getlocalMovieDb();
        let adventureMovies = [];

        localMovies.forEach((localMovie) => {
            if (localMovie.Genre.includes("Adventure")) {
                adventureMovies.push(localMovie);
            }
        });
        if (adventureMovies.length === 0) {
            clearMovieDisplay();
            movieDisplay.innerHTML = `<h1>No matches found.</h1>`;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            adventureMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(adventureMovies[adventureMovies.length-1])
        }
    });

};

const displayComedyMovies = () => {
    displayComedyGenre.addEventListener(`click`, async (e) => {
        e.preventDefault();
        let localMovies = await getlocalMovieDb();
        let comedyMovies = [];

        localMovies.forEach((localMovie) => {
            if (localMovie.Genre.includes("Comedy")) {
                comedyMovies.push(localMovie);
            }
        });
        if (comedyMovies.length === 0) {
            clearMovieDisplay();
            movieDisplay.innerHTML = `<h1>No matches found.</h1>`;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            comedyMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(comedyMovies[comedyMovies.length-1])
        }
    });
};

const displayHorrorMovies = () => {
    displayHorrorGenre.addEventListener(`click`, async (e) => {
        e.preventDefault();
        let localMovies = await getlocalMovieDb();
        let horrorMovies = [];

        localMovies.forEach((localMovie) => {
            if (localMovie.Genre.includes("Horror")) {
                horrorMovies.push(localMovie);
            }
        });
        if (horrorMovies.length === 0) {
            clearMovieDisplay();
            movieDisplay.innerHTML = `<h1>No matches found.</h1>`;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            horrorMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(horrorMovies[horrorMovies.length-1])
        }
    });
};

const displayRomanceMovies = () => {
    displayRomanceGenre.addEventListener(`click`, async (e) => {
        e.preventDefault();
        let localMovies = await getlocalMovieDb();
        let romanceMovies = [];

        localMovies.forEach((localMovie) => {
            if (localMovie.Genre.includes("Romance")) {
                romanceMovies.push(localMovie);
            }
        });
        if (romanceMovies.length === 0) {
            clearMovieDisplay();
            movieDisplay.innerHTML = `<h1>No matches found.</h1>`;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            romanceMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(romanceMovies[romanceMovies.length-1])
        }
    });
};

const displayDocumentaryMovies = () => {
    displayDocumentaryGenre.addEventListener(`click`, async (e) => {
        e.preventDefault();
        let localMovies = await getlocalMovieDb();
        let documentaryMovies = [];

        localMovies.forEach((localMovie) => {
            if (localMovie.Genre.includes("Documentary")) {
                documentaryMovies.push(localMovie);
            }
        });
        console.log(documentaryMovies);
        if (documentaryMovies.length === 0) {
            clearMovieDisplay();
            movieDisplay.innerHTML = `<h1>No matches found.</h1>`;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            documentaryMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(documentaryMovies[documentaryMovies.length-1])
        }

    });
};
const displayAllMovies = () => {
    displayAllGenres.addEventListener(`click`, async (e) => {
        e.preventDefault();
        let localMovies = await getlocalMovieDb();
        clearMovieDisplay();
        localMovies.forEach((movie) => {
            renderMovie(movie);
        });
        displayBigMovie(localMovies[localMovies.length-1])

    });

};


export {
    onPageLoad,
    getMovie,
    getlocalMovieDb,
    getLocalMovie,
    searchMovie,
    renderMovie,
    movieSeachByInputMatch,
    displayAdventureMovies,
    displayActionMovies,
    displayComedyMovies,
    displayHorrorMovies,
    displayRomanceMovies,
    displayDocumentaryMovies,
    displayAllMovies,
    clearMovieDisplay,
    defaultBigMovie
};

