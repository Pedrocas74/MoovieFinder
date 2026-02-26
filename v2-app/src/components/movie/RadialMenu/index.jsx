import styles from "./RadialMenu.module.css";
//motion
import { AnimatePresence, motion } from "framer-motion";
//icons
import VisibilityIcon from "@mui/icons-material/Visibility"; //watched
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded"; //in watchlist

import FavoriteIcon from "@mui/icons-material/Favorite"; //favorite
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
//hooks
import { useEffect, useRef } from "react";
//custom hooks
import { useClickOutside } from "../../../hooks/useClickOutside";

// Animation variants
const overlayV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const menuV = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const itemV = { //quick actions movement when radialMenu opens/closes
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

export default function RadialMenu({
  isOpen,
  onClose,
  movieTitle,
  watched,
  inWatchlist,
  favorite,
  onToggleWatched,
  onToggleWatchlist,
  onToggleFavorite,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const menuRef = useRef(null);
  useClickOutside(menuRef, () => { //close radial menu, if user clicks outside the card
    onClose();
  })

  const handleToggle = (fn) => (e) => {
    e.stopPropagation();
    fn();
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={menuRef}
          className={styles.radialOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Quick actions for ${movieTitle}`}
          variants={overlayV}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {/* Middle card close button */}
          <motion.button
            type="button"
            className={`${styles.radialBackdrop} actionButton`}
            aria-label="Close quick actions"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
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
              className={`${styles.radialBtn} ${watched ? styles.active : ""} actionButton`}
              onClick={handleToggle(onToggleWatched)}
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
                        color: "var(--clr-text)",
                      },
                    }}
                    aria-hidden="true"
                    focusable="false"
                  />
                ) : (
                  <VisibilityOffOutlinedIcon
                    sx={{
                      color: "var(--clr-muted)",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "var(--clr-bg)",
                      },
                    }}
                    aria-hidden="true"
                    focusable="false"
                  />
                )}
              </motion.div>
            </motion.button>

            {/* Watchlist */}
            <motion.button
              type="button"
              className={`${styles.radialBtn} ${inWatchlist ? styles.active : ""} actionButton`}
              onClick={handleToggle(onToggleWatchlist)}
              aria-pressed={inWatchlist}
              aria-label={
                inWatchlist ? "Remove from watchlist" : "Add to watchlist"
              }
              title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
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
                        color: "var(--clr-text)",
                      },
                    }}
                    aria-hidden="true"
                    focusable="false"
                  />
                ) : (
                  <PlaylistAddRoundedIcon
                    sx={{
                      color: "var(--clr-muted)",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "var(--clr-bg)",
                      },
                    }}
                    aria-hidden="true"
                    focusable="false"
                  />
                )}
              </motion.div>
            </motion.button>

            {/* Favorite */}
            <motion.button
              type="button"
              className={`${styles.radialBtn} ${favorite ? styles.active : ""} actionButton`}
              onClick={handleToggle(onToggleFavorite)}
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
                        color: "var(--clr-text)",
                      },
                    }}
                    aria-hidden="true"
                    focusable="false"
                  />
                ) : (
                  <FavoriteBorderIcon
                    sx={{
                      color: "var(--clr-muted)",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "var(--clr-bg)",
                      },
                    }}
                    aria-hidden="true"
                    focusable="false"
                  />
                )}
              </motion.div>
            </motion.button>

            {/* center close dot */}
            <button
              type="button"
              className={styles.radialCenter}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close"
              title="Close"
            >
              X
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
