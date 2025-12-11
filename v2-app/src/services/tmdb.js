// src/services/tmdb.js

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // from your .env file
const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

// Search movies by query
export async function searchMovies(query) {
  if (!query) return [];

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(
        query
      )}`,
      options
    );
  
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}

// Get movie details by ID
export async function getMovieDetails(movieId) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}?language=en-US`,
      options
    );
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}
