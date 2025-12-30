import styles from "./ThemeToggle.module.css";
import { motion } from "framer-motion";

import { useState } from "react";

import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle({ darkMode, setDarkMode }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <motion.button
      aria-label="Toggle dark/light mode"
      onClick={() => setDarkMode(!darkMode)}
      className={styles.toggleButton}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {
        darkMode ? (
          isHover ? (
            <DarkModeIcon /> 
          ) : (
            <DarkModeOutlinedIcon />
          ) 
        ) : isHover ? (
          <LightModeIcon /> 
        ) : (
          <LightModeOutlinedIcon />
        ) 
      }
    </motion.button>
  );
}
