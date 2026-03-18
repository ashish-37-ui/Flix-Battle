
const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

async function fetchPoster(name, type = "movies") {
  try {
    // ❌ Skip bad inputs
    if (!name || name.length < 2) return null;

    // ❌ Skip generic phrases (VERY IMPORTANT)
    const invalidKeywords = ["best", "top", "vs", "battle"];

    const lower = name.toLowerCase();
    if (invalidKeywords.some(k => lower.includes(k))) {
      return null;
    }

    let url = "";

    if (type === "movies") {
      url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`;
    } else if (type === "tv") {
      url = `${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`;
    } else {
      url = `${BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`;
    }

    // ✅ safety check
    if (!url) return null;

    const res = await axios.get(url);

    const result = res.data.results?.[0];
    if (!result) return null;

    if (type === "movies" || type === "tv") {
      return result.poster_path
        ? IMAGE_BASE + result.poster_path
        : null;
    } else {
      return result.profile_path
        ? IMAGE_BASE + result.profile_path
        : null;
    }

  } catch (err) {
    console.log("TMDB safe fail:", name); // cleaner log
    return null;
  }
}

module.exports = fetchPoster;

