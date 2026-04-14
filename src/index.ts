import { getMovies } from "./utils/api.js";
import type { Movie, Movies } from "./types/types.js";

async function displayMovies() {
  const movieSection = document.getElementById("movie-section") as HTMLElement;

  if (!movieSection) {
    console.error("Movie Section not found.");
    return;
  }

  try {
    const data = await getMovies();

    movieSection.innerHTML = "";

    data.results.forEach((movie: Movie) => {
      const movieElement = document.createElement("div");
      movieElement.className = "bg-gray";
      movieElement.innerHTML = `<h3>${movie.title}</h3>`;

      movieSection.appendChild(movieElement);
    });
  } catch {}
}

displayMovies();
