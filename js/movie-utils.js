import {
    OMDB_KEY
} from "./keys.js";
import {strToStandardCase} from "./js-utils.js"

const userTitleInput = document.getElementById("user-title");
const userRatingInput = document.getElementById("user-rating");
const loading = document.getElementById("display-movies");
const loadingS = document.createElement("div");
const bigMovieCard = document.createElement("div");
const bigMovieDisplay = document.getElementById("big-movie-display");
loadingS.innerHTML = `<h1>LOADING</h1>`;



/////////////////Gets a movie from the OMDB API, takes a string as an input, return 1 movie object////////////////
const getMovie = async (title) => {
    const url = `http://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${title}`;
    const options = {
        "method": "GET",
        "headers": {}
    }

    const response = await fetch(url, options);
    const movie = await response.json();
    return movie;
}


/////////takes user input and appends to URL, makes get request, if valid, grabs movie data, and passes it through postMovie /////////
const searchMovie =  async () => {
    console.log("did this work");
    let newTitle = userTitleInput.value;
    let newRating = userRatingInput.value;
    console.log(newTitle);

    const url = `http://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${strToStandardCase(newTitle)}`;
    const options = {
        "method": "GET",
        "headers": {
        }
    }

    const response = await fetch(url, options);
    const movie = await response.json();
    console.log(movie);

   let newMovie = {
        "Title": `${movie.Title}`,
        "Ratings": `${newRating}`,
        "Genre": `${movie.Genre}`,
        "Plot": `${movie.Plot}`,
        "Poster": `${movie.Poster}`
    }

    if (movie.Error === "Movie not found!") {
        console.log("Movie not found")
        return;
    } else {
        console.log("match!")
        await postMovie(newMovie)
        }
    }



/////////////////Returns all movies from our local DB, returns the array of movie objects////////////////
const getLocalMovie = async () => {
    loading.appendChild(loadingS)
    const url = `http://localhost:3000/movies`;
    const options = {
        "method": "GET",
        "headers": {}
    }

    const response = await fetch(url, options);
    const localMovies = await response.json();

    loading.removeChild(loadingS)

    localMovies.forEach((localMovie) => {

        let test = localMovie.Ratings.split("/")[0]
        renderMovie(localMovie);
    })
}



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
    renderMovie(newId)
    return newId;
    } catch (error) {
        console.log(error);
        return null;
    }
}


//TODO: no longer necessary, pulling movie info from API now
//////////takes user input and converts it into an object, then passes it to postMovie function to add it to the DB////////////
function addMovie() {
    addMovieButton.addEventListener("click", function() {

        let newTitle = userTitleInput.value
        let newRating = userRatingInput.value
        let newMovieObj = {
            "Title": `${strToStandardCase(newTitle)}`,
            "Ratings": `${newRating}`,
            "Genre": "",
            "Plot": ""
        }
        postMovie(newMovieObj)
    })
}

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
    // grab nodes from the modal for event listeners
    const modalClose = modal.querySelector(".modal-close");
    const modalBg = modal.querySelector(".modal-bg");
    const modalForm = modal.querySelector("#movie-form");
    const modalFormCancel = modal.querySelector("[data-action='cancel']");
    const modalFormSave = modal.querySelector("[data-action='save']");
    const modalFormCreate = modal.querySelector("[data-action='create']");
    console.log("got here")

    // add event listener to the close btn
    modalClose?.addEventListener("click", () => {
        modal.remove();
    });
    modalBg?.addEventListener("click", () => {
        modal.remove();
    });
    // add event listener to the cancel btn
    modalFormCancel?.addEventListener("click", (e) => {
        e.preventDefault();
        modal.remove();
    });
    // add event listener to the save btn
    modalForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        let updatedMovieData = new FormData(modalForm, modalFormSave);
        let updatedMovieObj = Object.fromEntries(updatedMovieData);
        console.log(updatedMovieObj);

        // TODO: if the form is valid, grab the form data and create a new movie object
        // REMEMBER, you still have access to the movie object here because it was passed as a parameter

       let updatedMovie = await patchMovie(updatedMovieObj)
       console.log(updatedMovie);
       let refreshedMovies = await getLocalMovie();
       refreshedMovies.forEach((movie) => {
           renderMovie(movie);
       })
        alert(`Save button clicked for ${movie.Title}`);
        modal.remove();
    });

    // THEN append it into the DOM
    document.body.appendChild(modal);
};

const renderMovie = (movie) => {
    // localMovie.Ratings.split("/")[0]
    // const movieRatings = catchRating.split("/")
    const movieCard = document.createElement("div");
    const movieDisplay = document.getElementById("display-movies");
    movieCard.classList.add("carousel-card");
    movieCard.setAttribute("style", `background-image: url('${movie.Poster}')` )
    movieCard.setAttribute("data-id", movie.id)
    movieCard.innerHTML = `
            <div class="card-details">
              <div class="card-header">
                <h3 class="card-title">${movie.Title}</h3>
                <p class="card-description">${movie.Plot}</p>
              </div>
              <div class="card-rating">
                <ion-icon name="heart-outline" class='heart-icon'></ion-icon>
                <ion-icon name="heart-outline" class='heart-icon'></ion-icon>
                <ion-icon name="heart-outline" class='heart-icon'></ion-icon>
                <ion-icon name="heart-outline" class='heart-icon'></ion-icon>
                <ion-icon name="heart-outline" class='heart-icon'></ion-icon>
              </div>
              <div class="card-call-to-action movie-card-actions-menu">
                <button class="card-btn primary movie-card-action" data-action="edit" id="edit-button">Edit</button>
                <button class="card-btn movie-card-action" data-action="delete" id="delete-button">Delete</button>
                 <button class="card-btn movie-card-action">View Details</button>
              </div>
            </div>    
    `
    const test = Array.from(document.querySelectorAll(movieCard[movie.id]));
        movieCard.addEventListener('click', () => {
            //your ajax code here
            displayBigMovie(movie)
        });


    // const test = document.getAttribute(movie.id)
    // test.addEventListener('click', () => {
    //     displayBigMovie(movie);
    // });

    // grab nodes from the card for event listeners
    const actionsParent = movieCard.querySelector(".movie-card-actions");
    const actionsToggle = movieCard.querySelector(".movie-card-actions-toggle");
    const editBtn = movieCard.querySelector(".movie-card-action[data-action='edit']");
    // const editBtn = movieCard.querySelector(".movie-card-action")
    const deleteBtn = movieCard.querySelector(".movie-card-action[data-action='delete']");

    editBtn.addEventListener("click", async () => {
        console.log("click")
        // handleMenuClose();
        renderModal(movie, "save");

    });
    // add event listener to the delete btn
    deleteBtn.addEventListener("click", async () => {
        alert(`${movie.Title} was deleted.`);
        movieCard.remove()
        console.log("deleteButton")

        await deleteMovie(movie);
    });

    // THEN append it into the DOM
    movieDisplay.appendChild(movieCard);
};

function displayBigMovie (movie)  {
    const bigMovieCard = document.createElement("div");
    const bigMovieDisplay = document.getElementById("big-movie-display");
// bigMovieCard.classList.add("d-none");
    bigMovieCard.setAttribute("style", `background-image: url('${movie.Poster}'); background-repeat: no-repeat;`)
    bigMovieCard.innerHTML = `
             <p class="d-flex flex-column display-3">${movie.Title}</p>
        <div class="d-flex gap-4"><p>${movie.Ratings}</p>
          <p>Year</p>
          <p>${movie.Genre}</p></div>
        <div class="my-2 text wrap w-50">${movie.Plot}</div>
        </div>   
    `
    bigMovieDisplay.appendChild(bigMovieCard);
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


export { getMovie, getLocalMovie, searchMovie }

//TODO: add button that makes the html editable
//allow user to edit
//allow user to submit edits
//when submit clicked, changes get made to SAME object in local JSON DB
//then updated object gets rendered on screen