import "./App.css";



export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div>
      {/* <Header /> */}
      {/* <SearchBar
        setMovies={setMovies}
        setLoading={setLoading}
        setError={setError}
      /> */}
      {/* {loading && <Loading />} */}
      
      {/* {error && <Error message={error} />} */}

      {/* <MovieList movies={movies} /> */}
    </div>
  );
}
