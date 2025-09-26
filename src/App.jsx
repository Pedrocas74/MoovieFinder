import "./App.css";

import { useState } from "react";

import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
import MovieCard from "./components/MovieCard.jsx";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searched = movies.length > 0;

  return (
    <div className="app-flex">
      <Header />
    
      <SearchBar
        setMovies={setMovies}
        setLoading={setLoading}
        setError={setError}
      />

      {/* {loading && <Loading />} */}
      
      {/* {error && <Error message={error} />} */}
    {searched && (
        <MovieList movies={movies} />
    )}  
    </div>
  );
}
