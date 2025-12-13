const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

//search movies by query
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

//get movie details by ID
export async function getMovieDetails(movieId) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}?language=en-US`,
      options
    );
    
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}


//get Credits (cast/crew) of a movie 
export async function getCredits(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/credits?language=en-US`, options);
    
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 


//get trailer from a movie 
export async function getTrailer(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?language=en-US`, options);
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 

// -------------------------------------------------------------------------------
//get "Now In Theathers" movies list
export async function getNowInTheathers() {
  try {
    const res = await fetch(`${BASE_URL}/movie/now_playing?language=en-US&page=1`, options);
    
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 

//get "Popular" movies list
export async function getPopular() {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=1`, options);
    
    const data = await res.json();
    return data.results || []; 
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 

//get "Upcoming" movies list
export async function getUpcoming() {
  try {
    const res = await fetch(`${BASE_URL}/movie/upcoming?language=en-US&page=1`, options);
    
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 


//get "Trending" movies list
export async function getTrending() {
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/day?language=en-US`, options);
    
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 

// ---------------------IMAGES------------------------

export async function getMovieImages(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/images?include_image_language=en,null`,
    options
  );
  return res.json();
}



//-----------------------PERSONS--------------------------
//person details (bio, birthday, etc.)
export async function getPersonDetails(personId) {
  const res = await fetch(`${BASE_URL}/person/${personId}?language=en-US`, options);
  return res.json();
}

//person credits (movies they acted in or worked on)
export async function getPersonMovieCredits(personId) {
  const res = await fetch(`${BASE_URL}/person/${personId}/movie_credits?language=en-US`, options);
  return res.json();
}
