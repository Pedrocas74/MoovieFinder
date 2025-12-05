import styles from "../styles/MovieSummary.module.css";
import placeholderImg from "/assets/placeholder_movie.webp";
import { Star, Calendar, X } from "lucide-react";

export default function MovieSummary({ movie, onClose, darkMode }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : placeholderImg;

  return (
    <div
      className={styles.summary_overlay}
      style={{
        backgroundImage: `
      repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.07) 0 1px,
        transparent 10px 4px
      ),
      repeating-linear-gradient(
        -45deg,
        rgba(255, 255, 255, 0.07) 0 1px,
        transparent 10px 8px
      )
    `,
      }}
      onClick={onClose}
    >
      <div
        className={styles.summary}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-title"
      >
        <button
          aria-label="Close movie details"
          onClick={onClose}
        >
          <X style={{ scale: 0.9, strokeWidth: 4 }} />
        </button>
        <img
          style={{
            borderBottom: darkMode ? "3px solid #f5f5e9" : "3px solid #1d1814",
          }}
          src={posterUrl}
          alt={`Poster of ${movie.title}`}
        />
        <h3 id="movie-title">{movie.title}</h3>
        <p className={styles.rating}>
          <Star
            style={{
              scale: 0.7,
              color: darkMode ? "#f5f5e9" : "#1d1814",
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
              color: darkMode ? "#f5f5e9" : "#1d1814",
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
          <p className={styles.overview}>
            {movie.overview ? movie.overview : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
