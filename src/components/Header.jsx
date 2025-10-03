import styles from "../styles/Header.module.css";
import ThemeToggle from "./ThemeToggle.jsx";
import Logo from "./Logo.jsx";

export default function Header({ toggleFavorites, darkMode, setDarkMode }) {
  return (
    <header
      className={styles.header}
      style={{ borderBottom: darkMode ? "3px inset #00000013" : undefined }}
    >
      <Logo darkMode={darkMode} />
      <h1 style={{ color: darkMode ? "#f5f5e9" : "#1d1814" }}>
      Search. Find. Save.
    </h1>
      <div className={styles.buttons}>
        <button aria-label="Toggle favorites list" onClick={toggleFavorites}>
          {darkMode ? "🤍" : "❤️"}
        </button>
        <ThemeToggle
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>
    </header>
  );
}
