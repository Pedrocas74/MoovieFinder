const API_KEY = import.meta.env.VITE_TMDB_BEARER_TOKEN; 
const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

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
export async function getNowInTheathers(pages = 1) {
  try {
    const allResults = [];
    for (let page = 1; page <= pages; page++) {
      const res = await fetch(`${BASE_URL}/movie/now_playing?language=en-US&region=US&page=${page}`, options);
      const data = await res.json();
      allResults.push(...(data.results || []));
    }
    return allResults;
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}

//get "Popular" movies list
export async function getPopular(pages = 1) {
  try {
    const allResults = [];
    for (let page = 1; page <= pages; page++) {
      const res = await fetch(`${BASE_URL}/movie/popular?language=en-US&region=US&page=${page}`, options);
      const data = await res.json();
      allResults.push(...(data.results || []));
    }
    return allResults;
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}

//get "Upcoming" movies list
export async function getUpcoming(pages = 1) {
  try {
    const allResults = [];
    for (let page = 1; page <= pages; page++) {
      const res = await fetch(`${BASE_URL}/movie/upcoming?language=en-US&region=US&page=${page}`, options);
      const data = await res.json();
      allResults.push(...(data.results || []));
    }
    return allResults;
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
}


//get "Trending" movies list
export async function getTrending(pages = 1) {
  try {
    const allResults = [];
    for (let page = 1; page <= pages; page++) {
      const res = await fetch(`${BASE_URL}/trending/movie/day?language=en-US&region=US&page=${page}`, options);
      const data = await res.json();
      allResults.push(...(data.results || []));
    }
    return allResults;
  } catch (err) {
    console.error("TMDB Error:", err);
    throw err;
  }
} 

//get movies by source (trending or popular)
export async function getMoviesBySource(source, pages = 5) {
  switch (source) {
    case "trending":
      return getTrending(pages);
    case "popular":
      return getPopular(pages);
    default:
      return getTrending(pages);
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





