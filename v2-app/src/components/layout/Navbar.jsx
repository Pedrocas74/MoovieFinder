import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useState } from "react";

import ExploreIcon from "@mui/icons-material/Explore";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import LogoSVG from "./LogoSVG";
import ThemeToggle from "../ui/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar({ setSearchedMovies, setLoading, setError }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isExploreHover, setIsExploreHover] = useState(false);
  const [isLibraryHover, setIsLibraryHover] = useState(false);
  const { darkMode, setDarkMode } = useTheme();

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
            <Link to="/" id="navLinks" aria-label="Moo Logo">
              <LogoSVG />
            </Link>

            <div className={styles.btnContainer}>
              <button
                className={`${styles.iconButton} actionButton`}
                onClick={() => setSearchOpen(true)}
                type="button"
                aria-label="Open search"
              >
                <SearchOutlinedIcon sx={{ color: "var(--clr-text)" }} />
              </button>

              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

              <AppTooltip title="Discover" arrow>
                <Link
                  to="/discover"
                  id="navLinks"
                  onMouseEnter={() => setIsExploreHover(true)}
                  onMouseLeave={() => setIsExploreHover(false)}
                  aria-label="Discover"
                >
                  {isExploreHover ? (
                    <ExploreIcon sx={{ color: "var(--clr-text)" }} />
                  ) : (
                    <ExploreOutlinedIcon sx={{ color: "var(--clr-text)" }} />
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
                    <VideoLibraryIcon sx={{ color: "var(--clr-text)" }} />
                  ) : (
                    <VideoLibraryOutlinedIcon
                      sx={{ color: "var(--clr-text)" }}
                    />
                  )}
                </Link>
              </AppTooltip>
            </div>
          </>
        )}

        {searchOpen && (
          <div className={styles.searchOverlay}>
            <Link to="/" id="navLinks">
              <LogoSVG />
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
              <CloseOutlinedIcon sx={{ color: "var(--clr-text)" }} />
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
