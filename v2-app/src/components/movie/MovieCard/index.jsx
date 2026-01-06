import placeholder_cover from "/images/placeholder_movie.webp";
import styles from "./MovieCard.module.css";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLibrary } from "../../../context/LibraryContext";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { useCallback, useEffect, useRef } from "react";

const LONG_PRESS_MS = 450;
const MOVE_CANCEL_PX = 10;

export default function MovieCard({ movie, onClick, menuOpen, onOpenMenu, onCloseMenu }) {
  const {
    toggleWatched,
    toggleWatchlist,
    toggleFavorite,
    isWatched,
    isInWatchlist,
    isFavorite,
  } = useLibrary();

  const watched = isWatched(movie.id);
  const inWatchlist = isInWatchlist(movie.id);
  const favorite = isFavorite(movie.id);

  const isSaved = watched || inWatchlist || favorite;

  // const [menuOpen, setMenuOpen] = useState(false);

  const timerRef = useRef(null);
  const startPtRef = useRef({ x: 0, y: 0 });
  const longPressedRef = useRef(false);

  const clearLongPressTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const openMenu = useCallback(() => {
    longPressedRef.current = true;
    onOpenMenu?.();

    // allow future taps after this gesture finishes
    window.setTimeout(() => {
      longPressedRef.current = false;
    }, 0);
  }, []);

  const closeMenu = useCallback(() => {
  onCloseMenu?.();
}, [onCloseMenu]);

  // close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  const onPointerDown = (e) => {
    // only left mouse / primary touch
    if (e.pointerType === "mouse" && e.button !== 0) return;

    startPtRef.current = { x: e.clientX, y: e.clientY };
    clearLongPressTimer();

    timerRef.current = setTimeout(() => {
      openMenu();
      // prevent the normal click after long press
      // (also helps on iOS Safari)
      try {
        e.preventDefault?.();
      } catch {}
    }, LONG_PRESS_MS);
  };

  const onPointerMove = (e) => {
    if (!timerRef.current) return;
    const dx = e.clientX - startPtRef.current.x;
    const dy = e.clientY - startPtRef.current.y;
    if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) clearLongPressTimer();
  };

  const onPointerUp = () => {
    clearLongPressTimer();
  };

  const onPointerCancel = () => {
    clearLongPressTimer();
  };

  const handleCardClick = () => {
    // don’t navigate if we just long-pressed or menu is open
    if (menuOpen || longPressedRef.current) return;
    onClick?.(movie);
  };

  const handleToggleWatched = (e) => {
    e.stopPropagation();
    toggleWatched(movie);
    closeMenu();
  };

  const handleToggleWatchlist = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
    closeMenu();
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
    closeMenu();
  };

  return (
    <motion.div
      className={`${styles.movieCard} ${isSaved ? styles.saved : ""}`}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerCancel}
      // stops iOS callout / image selection weirdness
      style={{ touchAction: "manipulation" }}
    >
      <div
        className={styles.poster}
        style={{
          backgroundImage: movie.poster_path
            ? `url(https://image.tmdb.org/t/p/w342${movie.poster_path})`
            : `url(${placeholder_cover})`,
        }}
      />

      <div className={styles.dateAndRate}>
        <p className={`${styles.releaseDate} cardInfo`}>
          {movie.release_date?.slice(0, 4)}
        </p>
        <p className={`${styles.rating} cardInfo`}>
          <Star size={10} /> {Number(movie.vote_average).toFixed(1)}
        </p>
      </div>

      {menuOpen && (
        <div
          className={styles.radialOverlay}
          role="dialog"
          aria-label="Quick actions"
        >
          {/* Click outside closes */}
          <button
            type="button"
            className={`${styles.radialBackdrop} actionButton`}
            aria-label="Close quick actions"
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}
          />

          <div
            className={styles.radialMenu}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Watched */}
            <button
              type="button"
              className={`${styles.radialBtn} ${watched ? styles.active : ""} actionButton`}
              onClick={handleToggleWatched}
              aria-pressed={watched}
              aria-label={watched ? "Remove from watched" : "Add to watched"}
              title={watched ? "Remove from watched" : "Add to watched"}
              style={{ "--angle": "270deg" }}
            >
              {watched ? (
                <VisibilityIcon sx={{ color: "var(--clr-primary)" }} />
              ) : (
                <VisibilityOffOutlinedIcon sx={{ color: "var(--clr-muted)" }} />
              )}
            </button>

            {/* Watchlist */}
            <button
              type="button"
              className={`${styles.radialBtn} ${
                inWatchlist ? styles.active : ""
              } actionButton`}
              onClick={handleToggleWatchlist}
              aria-pressed={inWatchlist}
              aria-label={
                inWatchlist ? "Remove from watchlist" : "Add to watchlist"
              }
              title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              style={{ "--angle": "30deg" }}
            >
              {inWatchlist ? (
                <PlaylistAddCheckRoundedIcon
                  sx={{ color: "var(--clr-primary)" }}
                />
              ) : (
                <PlaylistAddRoundedIcon sx={{ color: "var(--clr-muted)" }} />
              )}
            </button>

            {/* Favorite */}
            <button
              type="button"
              className={`${styles.radialBtn} ${favorite ? styles.active : ""} actionButton`}
              onClick={handleToggleFavorite}
              aria-pressed={favorite}
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              title={favorite ? "Remove from favorites" : "Add to favorites"}
              style={{ "--angle": "150deg" }}
            >
              {favorite ? (
                <FavoriteIcon sx={{ color: "var(--clr-primary)" }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: "var(--clr-muted)" }} />
              )}
            </button>

            {/* Optional center “close” dot (nice touch) */}
            <button
              type="button"
              className={`${styles.radialCenter} actionButton`}
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
              }}
              aria-label="Close"
              title="Close"
            >-</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

