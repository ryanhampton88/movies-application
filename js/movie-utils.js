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
    return newId;
    // } catch (error) {
    //     console.log(error);
    //     return null;
    // }
}

export {getMovie, postMovie}