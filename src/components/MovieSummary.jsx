import styles from "../styles/MovieSummary.module.css";
import placeholderImg from "/assets/placeholder_movie.webp";
import { Star, Calendar, X } from "lucide-react";

export default function MovieSummary({ movie, onClose }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : placeholderImg;

  return (
    <div className={styles.summary_overlay} onClick={onClose}>
      <div className={styles.summary} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>
          <X style={{ scale: 0.9, strokeWidth: 4 }} />
        </button>
        <img src={posterUrl} alt={`Poster of ${movie.title}`} />
        <h2>{movie.title}</h2>
        <p className={styles.rating}>
          <Star
            style={{
              scale: 0.7,
              color: "#1d1814 ",
              strokeWidth: 3,
              marginRight: 5,
            }}
          />{" "}
          {Number(movie.vote_average).toFixed(1)}
        </p>
        <p className={styles.releaseDate}>
          <Calendar
            style={{
              scale: 0.7,
              color: "#1d1814 ",
              strokeWidth: 3,
              marginRight: 5,
            }}
          />
          {movie.release_date
            ? movie.release_date.split("-").reverse().join("-")
            : "N/A"}
        </p>
        <div className={styles.overviewContainer}>
          <h4>Overview:</h4>
          <p className={styles.overview}>{movie.overview ? movie.overview : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
