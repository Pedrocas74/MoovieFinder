import styles from "../styles/MovieCard.module.css";
import placeholderImg from "/assets/placeholder_movie.webp";

export default function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : placeholderImg;

  return (
    <div className={styles.movieCard}>
      <img src={posterUrl} alt={movie.title} />
      <div className={styles.movieText}>
        <h3>{movie.title}</h3>
        <div className={styles.dateAndRate}>
          <p className={styles.releaseDate}>
            {movie.release_date?.split("-")[0]}
          </p>
          <p className={styles.rating}>
            ⭐ {Number(movie.vote_average).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
