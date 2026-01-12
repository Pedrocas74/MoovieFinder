import styles from "./Navbar.module.css";
import { Link, NavLink } from "react-router-dom";
import SearchBar from "../SearchBar";
import { useState } from "react";

import ExploreIcon from "@mui/icons-material/Explore";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import LogoSVG from "../LogoSVG";
import ThemeToggle from "../../ui/ThemeToggle";
import { useTheme } from "../../../context/ThemeContext";

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
      display: "none",
    },
  });

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {!searchOpen && (
          <>
            <Link to="/" id="navLinks" aria-label="Home">
              <LogoSVG aria-hidden="true" focusable="false" />
            </Link>

            <div className={styles.btnContainer}>
              <button
                className={`${styles.iconButton} actionButton`}
                onClick={() => setSearchOpen(true)}
                type="button"
                aria-label="Open search"
              >
                <SearchOutlinedIcon sx={{ color: "var(--clr-text)" }} aria-hidden="true"/>
              </button>

              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

              <AppTooltip title="Discover" arrow>
                <NavLink
                  to="/discover"
                  id="navLinks"
                  onMouseEnter={() => setIsExploreHover(true)}
                  onMouseLeave={() => setIsExploreHover(false)}
                  aria-label="Discover"
                  aria-current={
                    location.pathname === "/discover" ? "page" : undefined
                  }
                >
                  {isExploreHover ? (
                    <ExploreIcon sx={{ color: "var(--clr-text)" }} aria-hidden="true"/>
                  ) : (
                    <ExploreOutlinedIcon sx={{ color: "var(--clr-text)" }} aria-hidden="true"/>
                  )}
                </NavLink>
              </AppTooltip>

              <AppTooltip title="Library" arrow>
                <NavLink
                  to="/library"
                  id="navLinks"
                  onMouseEnter={() => setIsLibraryHover(true)}
                  onMouseLeave={() => setIsLibraryHover(false)}
                  aria-label="Library"
                  aria-current={
                    location.pathname === "/library" ? "page" : undefined
                  }
                >
                  {isLibraryHover ? (
                    <VideoLibraryIcon sx={{ color: "var(--clr-text)" }} aria-hidden="true" />
                  ) : (
                    <VideoLibraryOutlinedIcon
                      sx={{ color: "var(--clr-text)" }}
                      aria-hidden="true"
                    />
                  )}
                </NavLink>
              </AppTooltip>
            </div>
          </>
        )}

        {searchOpen && (
          <div className={styles.searchOverlay}>
            <Link to="/" id="navLinks" aria-label="Home">
              <LogoSVG aria-hidden="true" focusable="false"/>
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
              <CloseOutlinedIcon sx={{ color: "var(--clr-text)" }} aria-hidden="true"/>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
