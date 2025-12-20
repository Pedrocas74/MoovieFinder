import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import PersonDetails from "../pages/PersonDetails";
import NotFound from "../pages/NotFound";
import SearchResults from "../pages/SearchResults";
import Library from "../pages/Library";

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
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        }
      />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/person/:id" element={<PersonDetails />} />
      <Route path="/library" element={<Library />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
