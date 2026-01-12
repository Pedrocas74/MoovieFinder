import styles from "./ThemeToggle.module.css";
import { motion, useReducedMotion } from "framer-motion";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle({ darkMode, setDarkMode }) {
  const reduceMotion = useReducedMotion();
  const nextLabel = darkMode ? "Switch to light mode" : "Switch to dark mode";
  
  return (
    <motion.button
      type="button"
      aria-label={nextLabel}
      aria-pressed={darkMode}
      onClick={() => setDarkMode(!darkMode)}
      className={`${styles.toggleButton} actionButton`}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
    >
      {darkMode ? (
        <LightModeIcon sx={{ color: "var(--clr-text)" }} aria-hidden="true" focusable="false"  />
      ) : (
        <DarkModeIcon sx={{ color: "var(--clr-text)" }} aria-hidden="true" focusable="false"  />
      )}
    </motion.button>
  );
}
