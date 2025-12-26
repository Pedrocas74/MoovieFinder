import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useState } from "react";

import ExploreIcon from "@mui/icons-material/Explore";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export default function Navbar({ setSearchedMovies, setLoading, setError }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isExploreHover, setIsExploreHover] = useState(false);
  const [isDarkHover, setIsDarkHover] = useState(false);
  const [isLibraryHover, setIsLibraryHover] = useState(false);

  const AppTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    "& .MuiTooltip-tooltip": {
      backgroundColor: "var(--clr-primary)",
      fontSize: "var(--fs-sm)",
      padding: "var(--pd-button)",
      borderRadius: "var(--radius-button)",
    },
    "& .MuiTooltip-arrow": {
      color: "var(--clr-primary)",
    },
  });

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {!searchOpen && (
          <>
            <Link to="/">
              <h1>Moo</h1>
            </Link>

            <div className={styles.btnContainer}>
              <AppTooltip title="Search" arrow>
                <button
                  className={styles.iconButton}
                  onClick={() => setSearchOpen(true)}
                  type="button"
                  aria-label="Open search"
                >
                  <SearchOutlinedIcon sx={{ color: "black" }} />
                </button>
              </AppTooltip>

              <AppTooltip title="Dark mode" arrow>
              <button
                className={styles.iconButton}
                type="button"
                aria-label="Toggle dark mode"
                onMouseEnter={() => setIsDarkHover(true)}
                onMouseLeave={() => setIsDarkHover(false)}
              >
                {isDarkHover ? (
                  <DarkModeIcon sx={{ color: "black" }} />
                ) : (
                  <DarkModeOutlinedIcon sx={{ color: "black" }} />
                )}
              </button>
              </AppTooltip>
              
              <AppTooltip title="Discover" arrow>
              <Link
                to="/discover"
                id="navLinks"
                onMouseEnter={() => setIsExploreHover(true)}
                onMouseLeave={() => setIsExploreHover(false)}
                aria-label="Discover"
              >
                {isExploreHover ? (
                  <ExploreIcon sx={{ color: "black" }} />
                ) : (
                  <ExploreOutlinedIcon sx={{ color: "black" }} />
                )}
              </Link>
              </AppTooltip>
                
                <AppTooltip title="Library" arrow>
              <Link
                to="/library"
                id="navLinks"
                onMouseEnter={() => setIsLibraryHover(true)}
                onMouseLeave={() => setIsLibraryHover(false)}
                aria-label="Library"
              >
                {isLibraryHover ? (
                  <VideoLibraryIcon sx={{ color: "black" }} />
                ) : (
                  <VideoLibraryOutlinedIcon sx={{ color: "black" }} />
                )}
              </Link>
              </AppTooltip>
            </div>
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
              type="button"
              aria-label="Close search"
            >
              <CloseOutlinedIcon sx={{ color: "black" }} />
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
