import styles from "../styles/Header.module.css";
import ThemeToggle from "./ThemeToggle.jsx";


export default function Header({ toggleFavorites }) {
  return (
    <header className={styles.header}>
      <h1>Logo</h1>
      <div className={styles.buttons}>
        <button onClick={toggleFavorites} >❤️</button>
        <ThemeToggle />
      </div>
    </header>
  );
}
