import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { BookOpen, Search, X } from "lucide-react";
import { useState } from "react";

export default function Navbar({ setSearchedMovies, setLoading, setError }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {!searchOpen && (
          <>
            <Link to="/" id="navLinks">
              <h1>Moo</h1>
            </Link>
            <button
              className={`${styles.iconButton} actionButton`}
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} />
            </button>

            <Link to="/library" id="navLinks" >
              <BookOpen size={20} color="black" />
            </Link>
          </>
        )}

        {searchOpen && (
          <div className={styles.searchOverlay}>
            <Link to="/" id="navLinks">
              <h1>Moo</h1>
            </Link>

            <SearchBar
              autoFocus
              onClose={() => setSearchOpen(false)}
              setSearchedMovies={setSearchedMovies}
              setLoading={setLoading}
              setError={setError}
            />

            <button
              className={`${styles.iconButton} actionButton`}
              onClick={() => setSearchOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
