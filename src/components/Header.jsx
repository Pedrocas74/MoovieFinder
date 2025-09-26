import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1>Logo</h1>
      <button>Dark</button>
    </header>
  );
}
