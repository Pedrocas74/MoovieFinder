import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navbar({ setSearchedMovies, setLoading, setError }) {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link to="/" id="navLinks">
        <h1>Moo</h1>
        </Link>
        <SearchBar
          setSearchedMovies={setSearchedMovies}
          setLoading={setLoading}
          setError={setError}
        />
        {/* <ul>
          <li>
            <Link to="/favorites">Favorites</Link>
          </li>
        </ul> */}
      </nav>
    </header>
  );
}
