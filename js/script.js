
import {
    onPageLoad,
    displayAdventureMovies,
    displayActionMovies,
    displayComedyMovies,
    displayHorrorMovies,
    displayRomanceMovies,
    displayDocumentaryMovies,
    displayAllMovies,
    movieSearchByInput
} from "./tmdb-utils.js";


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

    // let castInfo = await getTmdbMovieCast("216016");



})();

