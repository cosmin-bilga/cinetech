import { BASE_IMAGE_URL } from "./config/config.js";
import type { MovieDetail, SerieDetail } from "./types/types.js";
import {
  changeLocalMovieFavorites,
  changeLocalSerieFavorites,
  getFavoriteMovieList,
  getFavoriteSerieList,
} from "./utils/functions.js";
import { initSearch } from "./utils/searchbar.js";

async function renderFavoriteMovies() {
  const favoriteSection = document.getElementById("favorite-movies");

  if (!favoriteSection) return;

  const data = await getFavoriteMovieList();

  const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin

  /* LISTE DES FILMS */

  if (data.length === 0) {
    const emptySection = document.createElement("p");
    emptySection.classList = "w-full text-center italic text-gray-300";
    emptySection.textContent = "Aucun film favori...";
    fragment.append(emptySection);
  }

  data.forEach((movie: MovieDetail) => {
    const movieElement = document.createElement("div");
    movieElement.className =
      "py-4 px-2 rounded-2xl bg-linear-to-br from-gray-500/10 to-gray-300/10 w-full md:w-1/6 hover:scale-102 transition-all duration-300";
    movieElement.innerHTML = `
        <a href="/detail/movie.html?id=${movie.id}" class="flex flex-col justify-between">
          <h3 class="text-2xl font-bold text-center mb-4 text-amber-500 italic h-16 line-clamp-2">${movie.title}</h3>
          <img src=${BASE_IMAGE_URL + "w500" + movie.poster_path} class="aspect2/3"/>
          <div class="flex flex-col items-center mt-auto">
              <p class="text-sm">Date de sortie: <span class="text-white">${movie.release_date}</span></p>
              <p class="text-sm">
                <span class="text-white">${movie.vote_average.toPrecision(2)}</span>
                <span class="text-yellow-500">★</span>
              </p>
          </div>
        </a>
        <button id="button-" + ${movie.id} class="mx-auto block rounded border bg-red-800 hover:bg-red-700 hover:outline-amber-500 hover:outline text-white p-2 w-1/2">Rétirer favori</button>
         `;

    movieElement.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      if (target.id.startsWith("button-")) {
        changeLocalMovieFavorites(movie);
        movieElement.innerHTML = "";
      }
    });

    fragment.appendChild(movieElement);
  });

  favoriteSection.append(fragment);
}

async function renderFavoriteSeries() {
  const favoriteSection = document.getElementById("favorite-series");

  if (!favoriteSection) return;

  const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin

  const data = await getFavoriteSerieList();

  /* LISTE DES SERIES */

  if (data.length === 0) {
    const emptySection = document.createElement("p");
    emptySection.classList = "w-full text-center italic text-gray-300";
    emptySection.textContent = "Aucune serie favorite...";
    fragment.append(emptySection);
  }

  data.forEach((serie: SerieDetail) => {
    const serieElement = document.createElement("div");
    serieElement.className =
      "py-4 px-2 rounded-2xl bg-linear-to-br from-gray-500/10 to-gray-300/10 w-full md:w-1/6 hover:scale-102 transition-all duration-300";
    serieElement.innerHTML = `
        <a href="/detail/serie.html?id=${serie.id}" class="flex flex-col justify-between">
          <h3 class="text-2xl font-bold text-center mb-4 text-amber-500 italic h-16 line-clamp-2">${serie.name}</h3>
          <img src=${BASE_IMAGE_URL + "w500" + serie.poster_path} class="aspect2/3"/>
          <div class="flex flex-col items-center mt-auto">
              <p class="text-sm">Date de debut: <span class="text-white">${serie.first_air_date}</span></p>
              <p class="text-sm">
                <span class="text-white">${serie.vote_average.toPrecision(2)}</span>
                <span class="text-yellow-500">★</span>
              </p>
          </div>
        </a>
        <button id="button-" + ${serie.id} class="rounded border bg-red-800 text-white p-2 mx-auto">Rétirer favori</button>
         `;

    serieElement.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      if (target.id.startsWith("button-")) {
        changeLocalSerieFavorites(serie);
        serieElement.innerHTML = "";
      }
    });

    fragment.appendChild(serieElement);
  });

  favoriteSection.append(fragment);
}

renderFavoriteMovies();
renderFavoriteSeries();
initSearch("movies");
