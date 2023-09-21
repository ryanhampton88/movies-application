import {
    OMDB_KEY
} from "./keys.js"

const userTitleInput = document.getElementById("user-title");
const userRatingInput = document.getElementById("user-rating");
const addMovieButton = document.getElementById("add-movie-button");

/////////////////Gets a movie from the OMDB API, takes a string as an input, return 1 movie object////////////////

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


/////////////////Returns all movies from our local DB, returns the array of movie objects////////////////
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


////////////////takes in a Movie object as an argument, then posts the object to the local DB, then renders in on screen////////////
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
                <form class="modal-form" id="movie-form">
                    <label for="Title">
                        <span>Title</span>
                        <input type="text" name="Title" id="title" value="${movie?.Title ? movie.Title : ""}" />
                    </label>
                    <label for="Ratings">
                        <span>Rating</span>
                        <input required type="number" name="Ratings" id="year" value="${movie?.Ratings ? movie.Ratings : ""}" />
                    </label>
                    <label for="id">
                        <input hidden required type="number" name="id" id="year" value="${movie?.id ? movie.id : ""}" />
                    </label>
                    <label for="Genre">
                        <span>Genre</span>
                        <textarea name="Genre" id="description">${movie?.Genre ? movie.Genre : ""}</textarea>
                    </label>
                    <div class="modal-form-actions">
                        <button type="submit" class="btn btn-cta" data-action="${action}">${action}</button>
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
    // add event listener to the create btn
    // modalFormCreate?.addEventListener("click", async (e) => {
    //     e.preventDefault();
    //     // validate the form data with the native javascript form validation
    //     // TODO: if the form is valid, grab the form data and create a new book object
    //     // REMEMBER, you still have access to the book object here because it was passed as a parameter
    //     // REMEMBER, the categories are a string of comma separated values, so you'll need to split them into an array
    //     alert(`Save button clicked for ${book.title}`);
    //     modal.remove();

    // THEN append it into the DOM
    document.body.appendChild(modal);
};

const renderMovie = (movie) => {

    const movieCard = document.createElement("div");
    const movieDisplay = document.getElementById("display-movies");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
                        <div class="movie-card-title">${movie.Title}<div>
                        <p class="movie-card-ratings">${movie.Ratings}</p>
                        <p class="movie-card-genre">${movie.Genre}</p>
                        <span class="movie-card-plot">${movie.Plot}</span> 
                        <img src="${movie.Poster}"/>      
                        <div class="movie-card-actions">
                            <div class="movie-card-actions-toggle">
                                <svg width="15" height="15" viewBox="0 0 1200 1200">
                                    <g fill="currentColor">
                                        <path d="m700 200c0-55.227-44.77-100-100-100s-100 44.773-100 100 44.77 100 100 100 100-44.773 100-100z"/>
                                        <path d="m600 500c55.23 0 100 44.77 100 100s-44.77 100-100 100-100-44.77-100-100 44.77-100 100-100z"/>
                                        <path d="m600 900c55.23 0 100 44.77 100 100s-44.77 100-100 100-100-44.77-100-100 44.77-100 100-100z"/>
                                    </g>
                                </svg>
                            </div>
                            <div class="movie-card-actions-menu">
                                <div class="movie-card-action" data-action="edit">Edit</div>
                                <div class="movie-card-action" data-action="delete">Delete</div>
                            </div>
                        </div>
                    `;
    // grab nodes from the card for event listeners
    const actionsParent = movieCard.querySelector(".movie-card-actions");
    const actionsToggle = movieCard.querySelector(".movie-card-actions-toggle");
    const editBtn = movieCard.querySelector(".movie-card-action[data-action='edit']");
    // const editBtn = movieCard.querySelector(".movie-card-action")
    const deleteBtn = movieCard.querySelector(".movie-card-action[data-action='delete']");
    // named event handler to close the menu if any click happens outside of it
    const handleMenuClose = (e) => {
        // adding optional chaining to the parameter to avoid errors
        if (!actionsParent.contains(e?.target)) {
            actionsParent.classList.remove("active");
            document.removeEventListener("click", handleMenuClose);
        }
    };
    // add event listener to the toggle
    actionsToggle.addEventListener("click", () => {
        actionsParent.classList.toggle("active");
        // add event listener to the document to close the menu if any click happens outside of it
        document.addEventListener("click", handleMenuClose);
        console.log("actionToggle");
    });
    // add event listener to the edit btn
    editBtn.addEventListener("click", async () => {
        // TODO: add edit functionality
        // REMEMBER, you still have access to the book object here
        handleMenuClose();
        renderModal(movie, "save");

    });
    // add event listener to the delete btn
    deleteBtn.addEventListener("click", async () => {
        // TODO: add delete functionality
        // REMEMBER, you still have access to the book object here
        handleMenuClose();
        alert(`Delete button clicked for ${movie.Title}`);
        console.log("deleteButton")
    });
    // THEN append it into the DOM
    movieDisplay.appendChild(movieCard);
};



/////////////renders the movies on screen, takes a movie object as an argument and builds the HTML based on specified properties
// const renderMovie = (movie) => {
//     const movieCard = document.createElement("div");
//     // movieCard.classList.add("movie-");
//     movieCard.innerHTML = `
//                         <div class="movie-card-title">${movie.Title}<div>
//                         <p class="movie-card-ratings">${movie.Ratings}</p>
//                         <p class="movie-card-genre">${movie.Genre}</p>
//                         <span class="book-card-plot">${movie.Plot}</span>
//                         <div class="book-card-actions-menu">
//                         <button id="delete-button">DELETE</button>
//                         <button id="edit-button">EDIT</button>
//                         </div>
//
//                         `
//     const movieDisplay = document.getElementById("display-movies");
//
//     const deleteBtn = movieCard.querySelector("#delete-button");
//     const editBtn = movieCard.querySelector("#edit-button");
//     editBtn.addEventListener("click", async () => {
//         console.log(movie);
//         patchMovie(movie)
//     });







//////////takes user input and adds new movie to local DB when add movie button is clicked ////////////
function addMovie() {
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

}


export {getMovie, postMovie, getLocalMovie, renderMovie, addMovie}

//TODO: add button that makes the html editable
//allow user to edit
//allow user to submit edits
//when submit clicked, changes get made to SAME object in local JSON DB
//then updated object gets rendered on screen