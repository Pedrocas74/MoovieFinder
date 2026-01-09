import placeholder_cover from "/images/placeholder_movie.webp";
import styles from "./MovieCard.module.css";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLibrary } from "../../../context/LibraryContext";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { useCallback, useEffect, useRef } from "react";

const LONG_PRESS_MS = 150;
const MOVE_CANCEL_PX = 10;

const overlayV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const menuV = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const itemV = {
  hidden: { x: 0, y: 0, scale: 0.5, opacity: 0 },
  show: (custom) => ({
    x: Math.cos((custom.angle * Math.PI) / 180) * 54,
    y: Math.sin((custom.angle * Math.PI) / 180) * 54,
    scale: 1,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 1000, damping: 1000 },
      y: { type: "spring", stiffness: 1000, damping: 1000 },
      scale: { type: "spring", stiffness: 1000, damping: 1000 },
      opacity: { duration: 0.1, delay: 0.6 },
    },
  }),
  exit: (custom) => ({
    x: 0,
    y: 0,
    scale: 0.6,
    opacity: 0,
    transition: {
      duration: 1,
      delay: custom.angle === 150 ? 0 : custom.angle === 270 ? 0.08 : 0.2,
    },
  }),
};

//spring scale feedback animation for button tap
const buttonFeedbackV = {
  tap: {
    scale: 1.15,
    boxShadow: "0 0 0 6px rgba(var(--clr-primary-rgb, 255, 107, 107), 0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
      mass: 0.5,
    },
  },
};

//glow pulse animation for button feedback (released after tap)
const glowPulseV = {
  initial: {
    boxShadow: "0 0 0 0px rgba(var(--clr-primary-rgb, 255, 107, 107), 0.4)",
  },
  animate: {
    boxShadow: "0 0 0 8px rgba(var(--clr-primary-rgb, 255, 107, 107), 0)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function MovieCard({
  movie,
  onClick,
  menuOpen,
  onOpenMenu,
  onCloseMenu,
}) {
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

  const isTouchDevice = window.matchMedia(
    "(hover: none) and (pointer: coarse)"
  ).matches;

  return (
    <motion.div
      className={`${styles.movieCard} ${isSaved ? styles.saved : ""}`}
      onClick={handleCardClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerCancel}
    >
      <div
        className={styles.poster}
        style={{
          backgroundImage: movie.poster_path
            ? `url(https://image.tmdb.org/t/p/w342${movie.poster_path})`
            : `url(${placeholder_cover})`,
        }}
      >
        {!movie.poster_path && (
          <span className={styles.titleCard}>{movie.title}</span>
        )}
      </div>

      {!isTouchDevice && ( //only on computers
        <button
          className={`${styles.hoverBtn} actionButton`}
          onClick={(e) => {
            if (!menuOpen) {
              e.stopPropagation();
              openMenu();
            } else {
              closeMenu();
            }
          }}
          aria-label="Open quick actions"
          title="Quick actions"
        >
          {menuOpen ? "-" : "+"}
        </button>
      )}

      <div className={styles.dateAndRate}>
        <p className={`${styles.releaseDate} cardInfo`}>
          {movie.release_date?.slice(0, 4)}
        </p>
        <p className={`${styles.rating} cardInfo`}>
          <Star size={10} /> {Number(movie.vote_average).toFixed(1)}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            className={styles.radialOverlay}
            role="dialog"
            aria-label="Quick actions"
            variants={overlayV}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Click outside closes */}
            <motion.button
              type="button"
              className={`${styles.radialBackdrop} actionButton`}
              aria-label="Close quick actions"
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
              }}
              variants={overlayV}
            />

            <motion.div
              className={styles.radialMenu}
              onClick={(e) => e.stopPropagation()}
              variants={menuV}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {/* Watched */}
              <motion.button
                type="button"
                className={`${styles.radialBtn} ${
                  watched ? styles.active : ""
                } actionButton`}
                onClick={handleToggleWatched}
                aria-pressed={watched}
                aria-label={watched ? "Remove from watched" : "Add to watched"}
                title={watched ? "Remove from watched" : "Add to watched"}
                style={{ "--angle": "150deg" }}
                variants={itemV}
                custom={{ angle: 150 }}
                whileTap={buttonFeedbackV.tap}
                animate={watched ? glowPulseV.animate : {}}
              >
                <motion.div
                  className={styles.iconWrapper}
                  animate={watched ? { scale: [0.9, 1] } : { scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                    duration: 0.15,
                  }}
                >
                  {watched ? (
                    <VisibilityIcon
                      sx={{
                        color: "var(--clr-primary)",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "var(--clr-bg)",
                        },
                      }}
                    />
                  ) : (
                    <VisibilityOffOutlinedIcon
                      sx={{
                        color: "var(--clr-muted)",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "var(--clr-text)",
                        },
                      }}
                    />
                  )}
                </motion.div>
              </motion.button>

              {/* Watchlist */}
              <motion.button
                type="button"
                className={`${styles.radialBtn} ${
                  inWatchlist ? styles.active : ""
                } actionButton`}
                onClick={handleToggleWatchlist}
                aria-pressed={inWatchlist}
                aria-label={
                  inWatchlist ? "Remove from watchlist" : "Add to watchlist"
                }
                title={
                  inWatchlist ? "Remove from watchlist" : "Add to watchlist"
                }
                style={{ "--angle": "270deg" }}
                variants={itemV}
                custom={{ angle: 270 }}
                whileTap={buttonFeedbackV.tap}
                animate={inWatchlist ? glowPulseV.animate : {}}
              >
                <motion.div
                  className={styles.iconWrapper}
                  animate={inWatchlist ? { scale: [0.9, 1] } : { scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                    duration: 0.15,
                  }}
                >
                  {inWatchlist ? (
                    <PlaylistAddCheckRoundedIcon
                      sx={{
                        color: "var(--clr-primary)",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "var(--clr-bg)",
                        },
                      }}
                    />
                  ) : (
                    <PlaylistAddRoundedIcon
                      sx={{
                        color: "var(--clr-muted)",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "var(--clr-text)",
                        },
                      }}
                    />
                  )}
                </motion.div>
              </motion.button>

              {/* Favorite */}
              <motion.button
                type="button"
                className={`${styles.radialBtn} ${
                  favorite ? styles.active : ""
                } actionButton`}
                onClick={handleToggleFavorite}
                aria-pressed={favorite}
                aria-label={
                  favorite ? "Remove from favorites" : "Add to favorites"
                }
                title={favorite ? "Remove from favorites" : "Add to favorites"}
                style={{ "--angle": "30deg" }}
                variants={itemV}
                custom={{ angle: 30 }}
                whileTap={buttonFeedbackV.tap}
                animate={favorite ? glowPulseV.animate : {}}
              >
                <motion.div
                  className={styles.iconWrapper}
                  animate={favorite ? { scale: [0.9, 1] } : { scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                    duration: 0.15,
                  }}
                >
                  {favorite ? (
                    <FavoriteIcon
                      sx={{
                        color: "var(--clr-primary)",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "var(--clr-bg)",
                        },
                      }}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      sx={{
                        color: "var(--clr-muted)",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "var(--clr-text)",
                        },
                      }}
                    />
                  )}
                </motion.div>
              </motion.button>

              {/* center close dot */}
              <button
                type="button"
                className={`${styles.radialCenter} actionButton`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeMenu();
                }}
                aria-label="Close"
                title="Close"
              >
                -
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
