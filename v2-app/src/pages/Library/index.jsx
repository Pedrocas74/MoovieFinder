import styles from "./Library.module.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "../../components/movie/MovieList";
import { useLibrary } from "../../context/LibraryContext";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function Library() {
  const navigate = useNavigate();
  const { watched, watchlist, favorites } = useLibrary();

  const [value, setValue] = useState(0);

  const movies = useMemo(() => {
    if (value === 0) return watched;
    if (value === 1) return watchlist;
    return favorites;
  }, [value, watched, favorites, watchlist]);

  const handleOpenDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabSx = {
    color: "var(--clr-text)",
    transition: "color 250ms ease, transform 250ms ease",

    "&.Mui-selected": {
      color: "var(--clr-primary)",
    },

    "&:hover": {
      color: "var(--clr-primary)",
    },

    "& .MuiSvgIcon-root": {
      transition: "transform 250ms ease",
    },

    "&.Mui-selected .MuiSvgIcon-root": {
      transform: "scale(1.10)",
    },
  };

  return (
    <section className={styles.librarySection}>
      {/* <h2>My Library</h2> */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 5 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="library tabs"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--clr-primary)",
              height: 3,
              borderRadius: 999,
              transition: "left 250ms ease, width 250ms ease",
            },
          }}
        >
          <Tab
            icon={
              value === 0 ? (
                <VisibilityIcon sx={{ color: "currentColor" }} />
              ) : (
                <VisibilityOutlinedIcon sx={{ color: "currentColor" }} />
              )
            }
            label="WATCHED"
            sx={tabSx}
          />

          <Tab
            icon={
              value === 1 ? (
                <PlaylistAddCheckRoundedIcon sx={{ color: "currentColor" }} />
              ) : (
                <PlaylistAddRoundedIcon sx={{ color: "currentColor" }} />
              )
            }
            label="WATCHLIST"
            sx={tabSx}
          />

          <Tab
            icon={
              value === 2 ? (
                <FavoriteIcon sx={{ color: "currentColor" }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: "currentColor" }} />
              )
            }
            label="FAVORITES"
            sx={tabSx}
          />
        </Tabs>
      </Box>

      {movies.length === 0 ? (
        <p>No movies here yet.</p>
      ) : (
        <MovieList
          movies={movies}
          layout="grid"
          onMovieClick={handleOpenDetails}
        />
      )}
    </section>
  );
}
