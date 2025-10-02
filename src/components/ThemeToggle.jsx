import styles from '../styles/ThemeToggle.module.css';
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react"; // icons

export default function ThemeToggle({ darkMode, setDarkMode }) {

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={styles.toggleButton}
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Moon size={20} color="#b032eb" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Sun size={20} color="#8f1919" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
