import styles from "./ThemeToggle.module.css";
import { motion } from "framer-motion";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle({ darkMode, setDarkMode }) {

  return (
    <motion.button
      aria-label="Toggle dark/light mode"
      onClick={() => setDarkMode(!darkMode)}
      className={`${styles.toggleButton} actionButton`}
    >
      {darkMode ? (
        <DarkModeIcon sx={{ color: "var(--clr-text)" }} />
      ) : (
        <LightModeIcon sx={{ color: "var(--clr-text)" }} />
      )}
    </motion.button>
  );
}
