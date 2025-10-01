import styles from "../styles/Header.module.css";
import ThemeToggle from "./ThemeToggle.jsx";
import Logo from "./Logo.jsx";

export default function Header({ toggleFavorites }) {
  return (
    <header className={styles.header}>
      <Logo />

      <div className={styles.buttons}>
        <button onClick={toggleFavorites}>❤️</button>
        <ThemeToggle />
      </div>
    </header>
  );
}
