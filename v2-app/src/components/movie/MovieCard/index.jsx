import styles from "./MovieCard.module.css";
//hooks
import { useCallback, useEffect, useRef, useState } from "react";
//motion
import { motion } from "framer-motion";
//context
import { useLibrary } from "../../../context/LibraryContext";
import placeholder_cover from "/images/placeholder_movie.webp";
//icons
import { Star } from "lucide-react";
import VisibilityIcon from "@mui/icons-material/Visibility"; //watched

import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded"; //in watchlist

import FavoriteIcon from "@mui/icons-material/Favorite"; //favorite
import RadialMenu from "../RadialMenu";

const LONG_PRESS_MS = 200; //200ms to open the radial menu by press holding the card
const MOVE_CANCEL_PX = 10; //during the press holding, if the finger moves 10px somewhere, radial menu opening is canceled

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

  //categories
  const watched = isWatched(movie.id);
  const inWatchlist = isInWatchlist(movie.id);
  const favorite = isFavorite(movie.id);
  //if is saved in any of the categories
  const isSaved = watched || inWatchlist || favorite;

  const [pulseId, setPulseId] = useState(null); //pulse colored animation when quick action is pressed

  const triggerPulse = useCallback(() => {
    //using an incrementing id ensures the animation reliably retriggers on repeated presses
    setPulseId((n) => (n === null ? 0 : n + 1));
  }, []);

  const timerRef = useRef(null);
  const startPtRef = useRef({ x: 0, y: 0 });
  const longPressedRef = useRef(false);

  const [showIcons, setShowIcons] = useState(false); //categories icons from the bottom of the card

  const clearLongPressTimer = useCallback(() => {
    //set long press timer to null
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

  const onPointerDown = (e) => {
    // only left mouse / primary touch
    if (e.pointerType === "mouse" && e.button !== 0) return;

    startPtRef.current = { x: e.clientX, y: e.clientY };
    clearLongPressTimer();

    timerRef.current = setTimeout(() => {
      openMenu();
      //prevent the normal click after long press
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
    //don’t navigate if we just long-pressed or menu is open
    if (menuOpen || longPressedRef.current) return;
    onClick?.(movie);
  };

  const isTouchDevice = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
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
      onContextMenu={(e) => e.preventDefault()}
      onHoverStart={() => setShowIcons(true)}
      onHoverEnd={() => setShowIcons(false)}
    >
      {pulseId !== null && ( //pulse effect
        <span
          key={pulseId}
          className={styles.pulseOverlay}
          aria-hidden="true"
        />
      )}

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

      {!isTouchDevice && ( //only display hoverBtn on computers
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
          aria-label={menuOpen ? "Close quick actions" : "Open quick actions"}
          title="Quick actions"
        >
          {menuOpen ? "-" : "+"}
        </button>
      )}

      <div className={styles.dateAndRate}>
        <p className={`${styles.releaseDate} cardInfo`}>
          {movie.release_date?.slice(0, 4)}
        </p>

        <div
          style={{
            visibility: isTouchDevice
              ? "visible"
              : showIcons
                ? "visible"
                : "hidden",
          }}
          className={styles.iconsContainer}
        >
          <VisibilityIcon
            className={styles.cardIcon}
            sx={{
              color: watched ? "var(--clr-primary)" : "var(--radial)",
              fontSize: "var(--fs-xs)",
            }}
          />
          <PlaylistAddCheckRoundedIcon
            className={styles.cardIcon}
            sx={{
              color: inWatchlist ? "var(--clr-primary)" : "var(--radial)",
              fontSize: "var(--fs-cardIcon)",
            }}
          />
          <FavoriteIcon
            className={styles.cardIcon}
            sx={{
              color: favorite ? "var(--clr-primary)" : "var(--radial)",
              fontSize: "var(--fs-xs)",
            }}
          />
        </div>

        <p
          className={`${styles.rating} cardInfo`}
          aria-label={`Rating ${Number(movie.vote_average).toFixed(
            1,
          )} out of 10`}
        >
          <Star size={10} aria-hidden="true" focusable="false" />{" "}
          {Number(movie.vote_average).toFixed(1)}
        </p>
      </div>

      <RadialMenu
        isOpen={menuOpen}
        onClose={closeMenu}
        movieTitle={movie.title}
        watched={watched}
        inWatchlist={inWatchlist}
        favorite={favorite}
        onToggleWatched={() => {
          triggerPulse();
          toggleWatched(movie);
        }}
        onToggleWatchlist={() => {
          triggerPulse();
          toggleWatchlist(movie);
        }}
        onToggleFavorite={() => {
          triggerPulse();
          toggleFavorite(movie);
        }}
      />
    </motion.div>
  );
}
