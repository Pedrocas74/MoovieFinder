import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMovieDetails } from "../../services/tmdb";
import LoadingSVG from "../../components/ui/LoadingSVG";
import styles from "./MovieDetails.module.css";


export default function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!movie);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If movie data wasn't passed via navigation state, fetch it
    if (!movie) {
      const fetchMovie = async () => {
        try {
          setLoading(true);
          const data = await getMovieDetails(id);
          setMovie(data);
          setError(null);
        } catch (err) {
          setError("Failed to load movie details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMovie();
    }
  }, [id, movie]);

  if (loading) return <LoadingSVG />;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <section className={styles.movieDetailsPage}>
      <h1>{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <p>{movie.overview}</p>
      <p>Release Date: {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</p>
    </section>
  );
}