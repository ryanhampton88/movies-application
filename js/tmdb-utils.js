import {
    TMDB_KEY
} from "./keys.js";
import {strToStandardCase} from "./js-utils.js";


const addMovieButton = document.getElementById("add-movie-button");
const movieSearchInput = document.getElementById("movie-search");
const userTitleInput = document.getElementById("user-title");
const userRatingInput = document.getElementById("user-rating");
const movieDisplay = document.getElementById("display-movies");
const displayActionGenre = document.getElementById("display-action");
const displayAdventureGenre = document.getElementById("display-adventure");
const displayComedyGenre = document.getElementById("display-comedy");
const displayHorrorGenre = document.getElementById("display-horror");
const displayRomanceGenre = document.getElementById("display-romance");
const displayAllGenres = document.getElementById("display-all");
const displayDocumentaryGenre = document.getElementById("display-documentary");
const loadingScreen = document.createElement("div");
const loadingHtml = `<div class="d-flex justify-content-center align-items-center vw-100 h-100 display-1 loading">LOADING...</div>`;
const noMatchesFoundHtml = `<div class="d-flex justify-content-center align-items-center vw-100 h-50 display-1 loading">No Matches Found...</div>`;
loadingScreen.innerHTML = loadingHtml;
const bigMovieDisplay = document.getElementById("big-movie-display");


//runs on initial page load to render all movies that exist in the local DB
const onPageLoad = async () => {
    addEventListener("load", async (e) => {
        movieDisplay.appendChild(loadingScreen);
        let localMovie = await getlocalMovieDb();
        movieDisplay.removeChild(loadingScreen);
        localMovie.forEach((movie) => {
            renderMovie(movie);
        });
        defaultBigMovie();
    });
};

const getTmdbMovies = async (title) => {
    let url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=en-US`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDVhODU2NzM1YWZiYzBmM2RiMzhiNzUzODlmZGZmNyIsInN1YiI6IjY1MGM1NjI5NGRhM2Q0MDE0ZDU1ZWJiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kdRqgsp_HWv4gAIEE6pdhQhNktR3HQyFL-IAowwf0Ts"
        }
    };

    let response = await fetch(url, options);
    let movies = await response.json();
    return movies;
};

const getTmdbMovieDetails = async (id) => {
    let url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDVhODU2NzM1YWZiYzBmM2RiMzhiNzUzODlmZGZmNyIsInN1YiI6IjY1MGM1NjI5NGRhM2Q0MDE0ZDU1ZWJiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kdRqgsp_HWv4gAIEE6pdhQhNktR3HQyFL-IAowwf0Ts"
        }
    };

    let response = await fetch(url, options);
    let movieDetails = await response.json();
    return movieDetails;

};

const getTmdbMovieTrailers = async (id) => {
    let url = `
https://api.themoviedb.org/3/movie/${id}/videos`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDVhODU2NzM1YWZiYzBmM2RiMzhiNzUzODlmZGZmNyIsInN1YiI6IjY1MGM1NjI5NGRhM2Q0MDE0ZDU1ZWJiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kdRqgsp_HWv4gAIEE6pdhQhNktR3HQyFL-IAowwf0Ts"
        }
    };
    let response = await fetch(url, options);
    let movieTrailers = await response.json();
    return movieTrailers;
};

const getTmdbMovieCast = async (id) => {
    let url= `https://api.themoviedb.org/3/movie/${id}/credits`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDVhODU2NzM1YWZiYzBmM2RiMzhiNzUzODlmZGZmNyIsInN1YiI6IjY1MGM1NjI5NGRhM2Q0MDE0ZDU1ZWJiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kdRqgsp_HWv4gAIEE6pdhQhNktR3HQyFL-IAowwf0Ts"
        }
    };
    let response = await fetch(url, options);
    let movieCast = await response.json();
    return movieCast;
}

const renderAddMovieModal = (movie) => {
    const addMovieModalForm = document.createElement("div");
    addMovieModalForm.classList.add("modal");




    addMovieModalForm.innerHTML = `<div class="modal-bg"></div>
        <div class="modal-content" style="background-color: white;">
            <div class="modal-header">
                <h2 class="modal-title" style="color: red; font-family: Bebas Neue;">${movie.title}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="carousel-card card-animation" style="background-image: url('https://image.tmdb.org/t/p/w500/${movie.poster_path}'); height: 500px">
           
                 </div> 
                 <div class="card-details">
                  <p class="text-black">${movie.overview}</p>
                  </div>
            <div class="modal-body">
                <form class="modal-form d-flex flex-column align-items-center" id="movie-form">
                <div class="d-flex flex-column gap-2 mb-2" style="color: black;">
                    <label for="Ratings">
                        Rating
                        <input required type="number" name="Ratings" id="Ratings" min="0" max="5" value="5" />
                    </label>
                    <label for="id">
                        <input hidden required type="number" name="id" id="id" value="${movie.id}" />
                    </label>
                    </div>
                    <div class="modal-form-actions">
                        <button type="button" class="btn btn-secondary" data-action="save">Add to Favorites</button>
                    </div>
                </form>
            </div>
        </div>`;

    //nodes from the modal for event listeners
    const modalClose = addMovieModalForm.querySelector(".modal-close");
    const modalBackground = addMovieModalForm.querySelector(".modal-bg");
    const modalFormSave = addMovieModalForm.querySelector("[data-action='save']");

    console.log("got here");

    // event listener for close button
    modalClose.addEventListener("click", () => {
        addMovieModalForm.remove();
    });

    //event listener for modal background, allows user to click anywhere on background to close modal
    modalBackground.addEventListener("click", () => {
        addMovieModalForm.remove();
    });

    modalFormSave.addEventListener("click", async (e) => {
        //bucket for the new movie object
        let newMovie;
        //gets the movie details from the API
        let movieDetails = await getTmdbMovieDetails(movie.id);
        let movieGenresArr = [];
        movieDetails.genres.forEach((genre) => {
            movieGenresArr.push(genre.name);
        });
        let movieGenres = movieGenresArr.join(",");
        console.log(movieGenres);


        //gets the movie trailers from the API
        let movieTrailers = await getTmdbMovieTrailers(movie.id);


        newMovie = {
            "Title": `${movie.title}`,
            "ApiId": `${movie.id}`,
            "Genre": `${movieGenres}`,
            "Overview": `${movie.overview}`,
            "Poster": `${movie.poster_path}`,
            "Year": `${movie.release_date}`,
            "Runtime": `${movieDetails.runtime}`,
            "IMDBid": `${movieDetails.imdb_id}`,
            "Trailer": `${movieTrailers.results[0].key}`
        };
        await postMovie(newMovie);
        document.body.removeChild(addMovieModalForm);
    });


    document.body.appendChild(addMovieModalForm);
}


const movieSearchByInput = () => {
    movieSearchInput.addEventListener("keyup", async (e) => {
        e.preventDefault();

        let userInput = movieSearchInput.value;
        //gets the movies from the API if the user input matches the movie title
        let movies = await getTmdbMovies(userInput);
        const searchMatchList = document.querySelector(".list");

        for (let i = 0; i < movies.results.length; i++) {
            if (movies.results[i].title.toLowerCase().startsWith(userInput.toLowerCase()) && userInput.value !== "") {
                //creates a list item that holds the matched movie title from the API array
                let listItem = document.createElement("li");
                listItem.classList.add("list-item");
                listItem.style.cursor = "pointer";
                //Displays the matched part of the movie title in bold
                let word = `${movies.results[i].title.substring(0, movieSearchInput.value.length)} <img src="https://image.tmdb.org/t/p/w500/${movies.results[i].poster_path}"> `;
                word += movies.results[i].title.substring(movieSearchInput.value.length);

                listItem.innerHTML = word;
                searchMatchList.prepend(listItem);

                //event listener for the list item that holds the matched movie title
                listItem.addEventListener("click", async (e) => {
                    e.preventDefault();
                    renderAddMovieModal(movies.results[i]);
                    document.querySelector(".list").innerHTML = "";
                    movieSearchInput.value = "";
                    console.log(movies.results[i].title);
                });


            }

        }


    });

};


/////////////////Gets a movie from the API, takes a string movie title as an input, returns 1 movie object////////////////
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


//removes anything that is being displayed in the move-display div
//runs before prepending/displaying any new data to movie-display div
const clearMovieDisplay = () => {
    movieDisplay.innerHTML = "";
};

const clearBigMovieDisplay = () => {
    bigMovieDisplay.innerHTML = "";
};


////validates add Movies form input, if valid, calls the searchMovieAndAdd function to try and add the movie to the local DB
const inputValidation = () => {
    addMovieButton.addEventListener("click", async (e) => {
        e.preventDefault();
        if (userRatingInput.value === "Rating") {
            userRatingInput.setAttribute("style", "border: 2px solid red");
            userRatingInput.placeholder = "Selection Required";
            return;
        } else if (userTitleInput.value === "") {
            userTitleInput.setAttribute("style", "border: 2px solid red");
            userTitleInput.placeholder = "Input Required";
            return;
        } else {
            searchMovieAndAdd();
        }

    });
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
    movieDisplay.appendChild(loadingScreen);
    const url = `http://localhost:3000/movies`;
    const options = {
        "method": "GET",
        "headers": {}
    };

    const response = await fetch(url, options);
    const localMovies = await response.json();
    movieDisplay.removeChild(loadingScreen);
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
    // try {
    //     //validates movie isn't already in the database
    //     const searchResult = await searchMovieByTitle(movie.Title);
    //     if (searchResult.length > 0) {
    //         //movie already exists
    //         // throw error
    //         throw new Error("Movie already exists in the database");
    //     }

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
    displayBigMovie(newId);
    return newId;
    // } catch (error) {
    //     console.log(error);
    //     return null;
    // }
};


//updates movie object properties in the local DB after user submits an edit
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
        alert(error);
        return null;
    }
};


//renders the edit or save
const renderModal = (movie, action) => {
    const modal = document.createElement("div");
    let existingGenres = movie.Genre;
    let splitGenres = existingGenres.split(",");
    console.log(splitGenres);
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-bg"></div>
        <div class="modal-content" style="background-color: white;">
            <div class="modal-header">
                <h2 class="modal-title" style="color: red; font-family: Bebas Neue;">${movie.Title}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <form class="modal-form d-flex flex-column align-items-center" id="movie-form">
                <div class="d-flex flex-column gap-2 mb-2" style="color: black;">
                    <label for="Ratings">
                        Rating
                        <input required type="number" name="Ratings" id="Ratings" min="0" max="5" value="${movie.Ratings}" />
                    </label>
                    <label for="id">
                        <input hidden required type="number" name="id" id="id" value="${movie.id}" />
                    </label>
                    <label><input type="checkbox" name="genres" value="Action">Action </label>
                    <label><input type="checkbox" name="genres" value="Adventure">Adventure</label>
                    <label><input type="checkbox" name="genres" value="Animation">Animation</label>
                    <label><input type="checkbox" name="genres" value="Comedy">Comedy</label>
                    <label> <input type="checkbox" name="genres" value="Horror">Horror</label>
                    <label> <input type="checkbox" name="genres" value="Romance">Romance</label>
                    <label> <input type="checkbox" name="genres" value="Documentary">Documentary</label>
                    <label> <input type="checkbox" name="genres" value="Drama">Drama</label>
                    <label> <input type="checkbox" name="genres" value="Fantasy">Fantasy</label>
                    <label> <input type="checkbox" name="genres" value="War">War</label>
                    <label> <input type="checkbox" name="genres" value="Sci-Fi">Sci-Fi</label>
                    <label> <input type="checkbox" name="genres" value="Thriller">Thriller</label>
                    <label> <input type="checkbox" name="genres" value="Biography">Biography</label>
                    <label> <input type="checkbox" name="genres" value="Sport">Sport</label>
                    <label> <input type="checkbox" name="genres" value="Mystery">Mystery</label>
                    </div>
                    <div class="modal-form-actions">
                        <button type="submit" class="btn btn-cta btn-secondary" data-action="${action}">${action}</button>
                        <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    //checks the checkboxes for the genres that the movie already has
    let checkboxes = modal.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
        if (splitGenres.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });


    //nodes from the modal for event listeners
    const modalForm = modal.querySelector("#movie-form");
    const modalClose = modal.querySelector(".modal-close");
    const modalBackground = modal.querySelector(".modal-bg");
    const modalFormCancel = modal.querySelector("[data-action='cancel']");
    const modalFormSave = modal.querySelector("[data-action='save']");

    console.log("got here");

    // event listener for close button
    modalClose.addEventListener("click", () => {
        modal.remove();
    });

    //event listener for modal background, allows user to click anywhere on background to close modal
    modalBackground.addEventListener("click", () => {
        modal.remove();
    });

    // event listener for cancel button
    modalFormCancel.addEventListener("click", (e) => {
        e.preventDefault();
        modal.remove();
    });
    // event listener for save button, captures the submitted form input values to patch updates to the changed movie properties
    modalFormSave.addEventListener("click", async (e) => {
        e.preventDefault();
        let movieId = document.getElementById("id").value;
        let newRating = document.getElementById("Ratings").value;

        //loops through the checkboxes, if they are checked, looks to see if the movie already has those genres, if it does not, adds the new genres. prevents duplicates //if the value is not checked, and the movie already has that genre, removes the genre from the movie object
        for (let i = 0; i < modalForm.genres.length; i++) {
            if (modalForm.genres[i].checked) {
                modalForm.genres[i].value;
                if (!splitGenres.includes(modalForm.genres[i].value)) {
                    splitGenres.push(modalForm.genres[i].value);
                }
            } else if (!modalForm.genres[i].checked) {
                if (splitGenres.includes(modalForm.genres[i].value)) {
                    splitGenres.splice(splitGenres.indexOf(modalForm.genres[i].value), 1);
                }
            }
        }


        let newGenres = (splitGenres.join(","));

        let updatedMovieObj = {
            id: `${movieId}`,
            Ratings: `${newRating}`,
            Genre: `${newGenres}`
        };

        //posts the updates to the DB
        await patchMovie(updatedMovieObj);

        alert(`${movie.Title} has been updated.`);
        let refreshedMovies = await getLocalMovie();
        refreshedMovies.forEach((movie) => {
            renderMovie(movie);
        });
        modal.remove();
    });

    // appends the modal to the DOM
    document.body.appendChild(modal);
};

const renderMovie = (movie) => {
    console.log("rendering movie");
    const movieCard = document.createElement("div");
    const movieDisplay = document.getElementById("display-movies");
    let ratingHtml = ``;


//determines how many stars should be included in movie card html based on the rating stored in the movie object
    if (Number(movie.Ratings) < 2) {
        ratingHtml = `<a  href="#" class="star-icon">&#9733;</a>`;
    } else if (Number(movie.Ratings) < 3) {
        ratingHtml = `<a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>`;
    } else if (Number(movie.Ratings) < 4) {
        ratingHtml = `<a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>`;
    } else if (Number(movie.Ratings) < 5) {
        ratingHtml = `<a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>`;
    } else if (Number(movie.Ratings) < 6) {
        ratingHtml = `<a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>
                      <a  href="#" class="star-icon">&#9733;</a>`;
    }


    //builds the html for the Big Movie Display (hero section)
    movieCard.classList.add("carousel-card");
    movieCard.classList.add("card-animation");
    movieCard.setAttribute("style", `background-image: url('https://image.tmdb.org/t/p/w500/${movie.Poster}')`);
    // movieCard.setAttribute("data-id", movie.);
    movieCard.innerHTML = `<div class="card-details">
                  <div class="card-header">
                  <h3 class="card-title">${movie.Title}</h3>
                  </div>
                  <div class="card-call-to-action movie-card-actions-menu">
                <button class="card-btn primary movie-card-action" data-action="edit">Edit</button>
                <button class="card-btn movie-card-action" data-action="delete">Delete</button>
              </div>
                  </div>
           
    `;


    //event listener, displays Big Movie details for the movie card that is clicked
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
        //renders the modal for user to edit the movie, then saves the changes to the local DB
        renderModal(movie, "save");

    });

    // event listener for delete movie button
    deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        alert(`${movie.Title} was deleted.`);
        //remove the card from the DOM
        movieCard.remove();
        //deletes the movie from the local DB
        await deleteMovie(movie);
    });

    // prepends to targeted DOM element, so most recently added movies are displayed in the list FIRST
    movieDisplay.prepend(movieCard);
};


//displays big movie details for first movie in the local DB, will run on initial page load
//also runs when specific Genre links are clicked to display the first movie in that specific genre list
let defaultBigMovie = async () => {
    let movies = await getlocalMovieDb();
    displayBigMovie(movies[movies.length - 1]);
};

// take a movie object as an argument, then displays that movie objects details in the big-movie display div
// called in displayActionMovies, displayAdventureMovies ect.....
let displayBigMovie = async (movie) => {
    // bigMovieDisplay.setAttribute("style", `background: url('https://www.youtube.com/watch?v=${movie.Trailer}'); background-repeat: no-repeat;`);
    let castDetails = document.createElement("div");
    bigMovieDisplay.innerHTML = `
             <p class="d-flex flex-column display-3 fw-bolder movie-title" style="color: white;">${movie.Title}</p>
         <div class="d-flex gap-4" style="color: white;">
          <p><span class="fw-bold" style="color: white;">Released:</span> ${movie.Year.substring(0, movie.Year.indexOf("-"))}</p>
          <p><span class="fw-bold" style="color: white;">Genre:</span> ${movie.Genre}</p>
          <p><span class="fw-bold" style="color: white;">Runtime:</span> ${movie.Runtime} mins</p></div>
        <div class="my-2 text wrap w-50" style="color: white;">${movie.Overview}</div>
        <button class="btn btn-outline-danger">View More Details</button>
    `;

    }


//deletes a movie object from the local JSON DB
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


//allows search inout field to produce list of matches by movie title as the user is typing
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
        displayBigMovie(movieSearchMatch[movieSearchMatch.length - 1]);
    });
};


/*Below functions are event listeners for filter by Genre links, renders the movies that include the Genre when the specified genre link is clicked*/
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
            clearBigMovieDisplay();
            movieDisplay.innerHTML = noMatchesFoundHtml;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            actionMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(actionMovies[actionMovies.length - 1]);
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
            clearBigMovieDisplay();
            movieDisplay.innerHTML = noMatchesFoundHtml;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            adventureMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(adventureMovies[adventureMovies.length - 1]);
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
            clearBigMovieDisplay();
            movieDisplay.innerHTML = noMatchesFoundHtml;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            comedyMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(comedyMovies[comedyMovies.length - 1]);
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
            clearBigMovieDisplay();
            movieDisplay.innerHTML = noMatchesFoundHtml;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            horrorMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(horrorMovies[horrorMovies.length - 1]);
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
            clearBigMovieDisplay();
            movieDisplay.innerHTML = noMatchesFoundHtml;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            romanceMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(romanceMovies[romanceMovies.length - 1]);
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
            clearBigMovieDisplay();
            movieDisplay.innerHTML = noMatchesFoundHtml;
            console.log("no matches");
        } else {
            clearMovieDisplay();
            documentaryMovies.forEach((movie) => {
                renderMovie(movie);
            });
            displayBigMovie(documentaryMovies[documentaryMovies.length - 1]);
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
        displayBigMovie(localMovies[localMovies.length - 1]);

    });

};


export {
    onPageLoad,
    getMovie,
    getlocalMovieDb,
    getLocalMovie,
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
    defaultBigMovie,
    postMovie, movieSearchByInput, getTmdbMovieCast
};

