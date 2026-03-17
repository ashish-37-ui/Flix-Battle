const axios = require("axios");

const fetchPoster = async (movieTitle) => {
  try {

    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: movieTitle
        }
      }
    );

    const movie = response.data.results[0];

    if (!movie || !movie.poster_path) return null;

    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  } catch (error) {
    console.error("Poster fetch error:", error.message);
    return null;
  }
};

module.exports = fetchPoster;