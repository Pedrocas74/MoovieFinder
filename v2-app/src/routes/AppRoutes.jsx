import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import Favorites from "../pages/Favorites";
import NotFound from "../pages/NotFound";

export default function AppRoutes({
  searchedMovies,
  setSearchedMovies,
  error,
  setError,
  loading,
  setLoading,
}) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            searchedMovies={searchedMovies}
            setSearchedMovies={setSearchedMovies}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        }
      />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
