import { BASE_IMAGE_URL } from "./config/config.js";
import type { MovieDetail } from "./types/types.js";
import {
  getFavoriteMovieList,
  getFavoriteSerieList,
} from "./utils/functions.js";

async function renderFavoriteMovies() {
  const favoriteSection = document.getElementById("favorite-movies");

  if (!favoriteSection) return;

  favoriteSection.className = "flex flex-wrap gap-4 justify-center";
  const data = await getFavoriteMovieList();

  const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin

  console.log(data, Array.isArray(data), JSON.stringify(data));
  /* LISTE DES FILMS */
  data.forEach((movie: MovieDetail) => {
    const movieElement = document.createElement("div");
    movieElement.className =
      "p-8 rounded-3xl bg-gray-500/10 w-full md: max-w-100 max-h-200 md:hover:scale-105 hover:bg-gray-400/20 transition-all duration-300";
    movieElement.innerHTML = `
        <a href="/detail/movie.html?id=${movie.id}">
            <h3 class="text-2xl text-center mb-4">${movie.title}</h3>
            <img src=${BASE_IMAGE_URL + "w500" + movie.poster_path} />
            <div class="flex flex-col items-center">
                <p>Date de sortie: ${movie.release_date}</p>
                <p>Note moyenne: ${movie.vote_average.toPrecision(2)}</p>
            </div>
        </a>
        <button id="button-">Rétirer favori</button>
           `;

    fragment.appendChild(movieElement);
  });

  // favoriteSection.innerHTML = "<h1>FAVORITE MOVIES</h1>";
  favoriteSection.append(fragment);
}

function renderFavoriteSeries(): void {
  const favoriteSection = document.getElementById("favorite-series");

  if (!favoriteSection) return;

  const data = getFavoriteSerieList();

  console.log(data);
  favoriteSection.innerHTML = `
    <h1>FAVORITE SERIESs</h1>
    `;
}

renderFavoriteMovies();
