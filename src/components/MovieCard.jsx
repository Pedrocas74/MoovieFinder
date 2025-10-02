import { motion, useAnimation } from "framer-motion";
import styles from "../styles/MovieCard.module.css";
import placeholderImg from "/assets/placeholder_movie.webp";
import { useState } from "react";

export default function MovieCard({
  movie,
  onClick,
  toggleFavorite,
  isFavorite,
  isTouchDevice,
  darkMode,
  showFavorites,
}) {
  const controls = useAnimation();
  const [showFeedback, setShowFeedback] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : placeholderImg;

  return (
    <motion.div
      className={styles.movieCard}
      onClick={isTouchDevice ? onClick : null }
      drag={isTouchDevice ? "y" : false}          // allow vertical drag on touch
      dragConstraints={{ top: -50, bottom: 0 }}   // can only drag up to -50px
      dragElastic={0.05}  // slight elasticity
      animate={controls}                       
      onDragEnd={(e, info) => {
        if (info.offset.y < -50) { // if dragged up more than 50px
          toggleFavorite(movie);
          setShowFeedback(true);
          setTimeout(() => setShowFeedback(false), 1000);
        }
        controls.start({ y: 0, transition: { type: "spring", stiffness: 400, damping: 20 } });
      }}  
    >
      <img onClick={onClick} src={posterUrl} alt={movie.title} />
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
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(movie);
                setShowFeedback(true);
                setTimeout(() => setShowFeedback(false), 1000);
              }}
              style={{border: "none",  cursor: "pointer", fontSize: "1rem"}}
            >
              {isFavorite ? "💔" : "❤️"}
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
