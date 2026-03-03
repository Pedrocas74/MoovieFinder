import { useState } from "react";
import { getTrailer } from "../services/tmdb";
import { selectBestTrailer } from "../utils/trailer";

export function useTrailer() {
  const [trailerKey, setTrailerKey] = useState(null); //key for each movie's trailer
  const [showTrailer, setShowTrailer] = useState(false);
  const [noTrailer, setNoTrailer] = useState(false); //toast notification -> trailer not existing

  async function fetchTrailer(movieId) {
    try {
      const data = await getTrailer(movieId); //fetch videos for this movieId
      //picks the best trailer
      const trailer = selectBestTrailer(data?.results);

      if (!trailer) { //toaster notification in case there are no videos to show
        setNoTrailer(true);
        return;
      }

      setTrailerKey(trailer.key); //key is embedded on iframe
      setShowTrailer(true); //show trailer
    } catch (e) {
      console.error(e);
    }
  }

  return {
    trailerKey,
    showTrailer,
    noTrailer,
    fetchTrailer,
    setShowTrailer,
    setNoTrailer,
  };
}