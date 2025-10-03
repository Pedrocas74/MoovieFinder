import { useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo.jsx";
import LoadingSVG from "./LoadingSVG.jsx";
import styles from "../styles/InitializationPage.module.css"; // your styles

export default function InitializationPage({ onFinish, darkMode }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 50000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{ background: darkMode ? "#1d1814" : "#f5f5e9" }}
      className={styles.initPage}
      role="status"
      aria-live="polite"
    >
      <section className={styles.mainContainer}>
        <Logo />
        <motion.h1
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 0.9 }}
          transition={{ delay: 0.5 }}
          style={{ color: darkMode ? "#b032eb" : "#8f1919" }}
        >
          Movie Finder
        </motion.h1>
      </section>
      <div className={styles.textLoading}>
        <LoadingSVG />
        <motion.p 
        initial={{ y: 5, scale: 1.1 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ delay: 0.8 }}
        style={{ color: darkMode ? "#f5f5e9" : "#1d1814" }}>
          Search. Find. Save.
        </motion.p>
      </div>
    </div>
  );
}
