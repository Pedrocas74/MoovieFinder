import styles from "../styles/Header.module.css";

export default function Header({ toggleFavorites }) {
  return (
    <header className={styles.header}>
      <h1>Logo</h1>
      <div className={styles.buttons}>
        <button onClick={toggleFavorites} >❤️</button>
        <button>Dark</button>
      </div>
    </header>
  );
}
