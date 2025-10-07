import { motion, useAnimation } from "framer-motion";
import styles from "../styles/MovieCard.module.css";
import placeholderImg from "/assets/placeholder_movie.webp";
import { useState, useEffect } from "react";

export default function MovieCard({
  movie,
  onClick,
  toggleFavorite,
  isFavorite,
  isTouchDevice,
  darkMode,
}) {
  const controls = useAnimation();
  const [showFeedback, setShowFeedback] = useState(false);
  const [localFav, setLocalFav] = useState(isFavorite);

  useEffect(() => {
    setLocalFav(isFavorite);
  }, [isFavorite]);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : placeholderImg;

  return (
    <motion.div
      style={{
        background: darkMode ? "#1d1814" : "#f5f5e9",
        color: darkMode ? "#f5f5e9" : "#1d1814",
      }}
      className={styles.movieCard}
      onClick={isTouchDevice ? onClick : null}
      drag={isTouchDevice ? "y" : false} // allow vertical drag on touch
      dragConstraints={{ top: -50, bottom: 0 }} // can only drag up to -50px
      dragElastic={0.05} // slight elasticity
      animate={controls}
      onDragEnd={(e, info) => {
        if (info.offset.y < -50) {
          // if dragged up more than 50px
          setLocalFav(!localFav);
          toggleFavorite(movie);
          setShowFeedback(true);
          setTimeout(() => setShowFeedback(false), 1000);
        }
        controls.start({
          y: 0,
          transition: { type: "spring", stiffness: 400, damping: 20 },
        });
      }}
    >
      <img
        onClick={onClick}
        src={posterUrl}
        role="button"
        aria-label={`View details for ${movie.title}`}
        alt={`Poster of ${movie.title}`}
      />
      <div className={styles.movieText}>
        <h3>{movie.title}</h3>
        <div className={styles.dateAndRate}>
          <p className={styles.releaseDate}>
            {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
          </p>
          <p className={styles.rating}>
            ⭐ {Number(movie.vote_average).toFixed(1)}
          </p>

          {!isTouchDevice && ( //COMPUTER
            <button
              className={styles.heartButton}
              onClick={(e) => {
                e.stopPropagation();
                setLocalFav(!localFav);
                toggleFavorite(movie);
                setShowFeedback(true);
                setTimeout(() => setShowFeedback(false), 1000);
              }}
              style={{ border: "none" }}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite
                ? "💔" // already favorite, show broken heart
                : localFav
                ? darkMode
                  ? "🤍" // just pressed in dark mode
                  : "❤️" // just pressed in light mode
                : darkMode
                ? "🖤" // initially dark mode, black heart
                : "🖤"}{" "}    
            </button>
          )}
        </div>
      </div>

      {/* feedback animation */}
      {showFeedback && !darkMode && (
        <div className={styles.feedback}>{isFavorite ? "💔" : "❤️"}</div>
      )}
      {showFeedback && darkMode && (
        <div className={styles.feedback}>{isFavorite ? "💔" : "🤍"}</div>
      )}
    </motion.div>
  );
}
