import {TMDB_KEY} from "./keys.js";
import {
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
} from "./tmdb-utils.js";

const movieSearchInput = document.getElementById("movie-search");
const movieSearchButton = document.getElementById("movie-search-button");


(async () => {

    onPageLoad()
    movieSearchByInput();

    displayActionMovies();
    displayAdventureMovies();
    displayComedyMovies();
    displayHorrorMovies();
    displayRomanceMovies();
    displayDocumentaryMovies();
    displayAllMovies();

    let castInfo = await getTmdbMovieCast("216016");
    console.log(castInfo);

    castInfo.cast.forEach((actor) => {
       console.log(actor.name);
       console.log(actor.character);
       console.log(actor.profile_path);
       console.log(`https://image.tmdb.org/t/p/original/${actor.profile_path}`);
    });


})();

