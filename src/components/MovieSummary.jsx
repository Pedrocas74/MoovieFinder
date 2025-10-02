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
        background: darkMode ? "#b032eb" : "#8f1919",
        color: darkMode ? "#f5f5e9" : "#1d1814",
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
        style={{
          background: darkMode ? "#1d1814" : "#f5f5e9",
          borderLeft: darkMode ? "7px double #b032eb" : "7px double #8f1919",
          borderRight: darkMode ? "7px double #b032eb" : "7px double #8f1919",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            background: darkMode ? "#1d1814" : "#f5f5e9",
            color: darkMode ? "#f5f5e9" : "#1d1814",
            borderColor: darkMode ? "#f5f5e9" : "#1d1814",
          }}
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
        <h2>{movie.title}</h2>
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
