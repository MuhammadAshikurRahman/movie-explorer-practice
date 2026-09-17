import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import Footer from "./components/Footer";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getMovies(query = "") {
    setLoading(true); setError("");
    try {
      const url = query.trim()
        ? `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
        : "https://api.tvmaze.com/shows";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      setMovies(query.trim() ? data.map(item => item.show) : data);
    } catch (err) {
      setError("Movie data load করতে সমস্যা হয়েছে।");
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { getMovies(); }, []);

  function handleSearch(e) {
    e.preventDefault();
    getMovies(search);
  }

  return (
    <div className="app">
      <Navbar />
      <Hero onExplore={() => document.getElementById("movies")?.scrollIntoView({behavior:"smooth"})} />
      <main id="movies" className="movies-section">
        <div className="section-heading">
          <div><p className="eyebrow">MOVIE LIBRARY</p><h2>Explore Shows</h2></div>
          <p className="result-count">{movies.length} results</p>
        </div>
        <form className="search-box" onSubmit={handleSearch}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search for a movie or show..." />
          <button type="submit">Search</button>
        </form>
        {loading && <p className="status">Loading movies...</p>}
        {error && <p className="status error">{error}</p>}
        {!loading && !error && movies.length === 0 && <p className="status">কোনো movie/show পাওয়া যায়নি।</p>}
        <div className="movie-grid">
          {movies.map(movie => <MovieCard key={movie.id} movie={movie} onDetails={() => setSelectedMovie(movie)} />)}
        </div>
      </main>
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
      <Footer />
    </div>
  );
}
export default App;