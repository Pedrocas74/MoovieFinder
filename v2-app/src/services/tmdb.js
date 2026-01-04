const API_KEY = import.meta.env.VITE_TMDB_BEARER_TOKEN; 
const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const today = new Date().toISOString().split("T")[0];

//search movies by query
export async function searchMovies(query, genres = [], pages = 1) {
  if (!query && !genres.length) return [];

  try {
    const allResults = [];
    for (let page = 1; page <= pages; page++) {
      let url = `${BASE_URL}/search/movie?include_adult=false&language=en-US&region=US&page=${page}`;
      if (query) url += `&query=${encodeURIComponent(query)}`;
      if (genres.length) url += `&with_genres=${genres.join(',')}`;
      
      const res = await fetch(url, options);
      const data = await res.json();
      allResults.push(...(data.results || []));
    }
    return allResults;
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}

//get movie details by ID
export async function getMovieDetails(movieId) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}?language=en-US&region=US`,
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
    const res = await fetch(`${BASE_URL}/movie/${movieId}/credits?language=en-US&region=US`, options);
    
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 


//get movie genres list
export async function getGenres() {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, options);
    
    const data = await res.json();
    return data.genres || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}


//get trailer from a movie 
export async function getTrailer(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?language=en-US&region=US`, options);
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 

// -------------------------------------------------------------------------------
//get "Now In Theathers" movies list
export async function getNowInTheathers(page = 1, genres = []) {
  try {
    let url;
    if (genres.length) {
      url = `${BASE_URL}/discover/movie?primary_release_date.gte=${today}&primary_release_date.lte=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&sort_by=popularity.desc&with_genres=${genres.join(',')}&page=${page}`;
    } else {
      url = `${BASE_URL}/movie/now_playing?language=en-US&region=US&page=${page}`;
    }
    const res = await fetch(url, options);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}

//get "Popular" movies list
export async function getPopular(page = 1, genres = []) {
  try {
    let url;
    if (genres.length) {
      url = `${BASE_URL}/discover/movie?sort_by=popularity.desc&with_genres=${genres.join(',')}&page=${page}`;
    } else {
      url = `${BASE_URL}/movie/popular?language=en-US&region=US&page=${page}`;
    }
    const res = await fetch(url, options);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}


// get "Upcoming" movies list (strictly future only)
export async function getUpcoming(page = 1, genres = []) {
  try {
    let url;
    if (genres.length) {
      url = `${BASE_URL}/discover/movie?primary_release_date.gte=${new Date().toISOString().split("T")[0]}&sort_by=release_date.asc&with_genres=${genres.join(",")}&page=${page}`;
    } else {
      url = `${BASE_URL}/movie/upcoming?language=en-US&region=US&page=${page}`;
    }

    const res = await fetch(url, options);
    const data = await res.json();

    const today = new Date().toISOString().split("T")[0];

    return (data.results || []).filter(
      (movie) =>
        movie.release_date &&
        movie.release_date >= today
    );
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}




//get "Trending" movies list
export async function getTrending(page = 1, genres = []) {
  try {
    const url = `${BASE_URL}/trending/movie/day?language=en-US&region=US&page=${page}`;
    const res = await fetch(url, options);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 

//get similar movies
export async function getSimilarMovies(movieId, page = 1) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}/similar?language=en-US&region=US&page=${page}`,
      options
    );
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}

//get movies by source (trending or popular)
export async function getMoviesBySource(source, page = 1, genres = []) {
  switch (source) {
    case "trending":
      return getTrending(page, genres);
    case "popular":
      return getPopular(page, genres);
    case "now_playing":
      return getNowInTheathers(page, genres);
    case "upcoming":
      return getUpcoming(page, genres);
    default:
      return getTrending(page, genres);
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





