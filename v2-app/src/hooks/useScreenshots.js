import { useState, useEffect } from "react";
import { getMovieImages } from "../services/tmdb";

export function useScreenshots(movieId) {
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    if (!movieId) return;

    async function fetchScreenshots() {
      try {
        const data = await getMovieImages(movieId); 
        setScreenshots(data?.backdrops?.slice(5, 15) || []); 
      } catch (e) {
        console.error(e);
      }
    }

    fetchScreenshots();
  }, [movieId]);

  return { screenshots };
}