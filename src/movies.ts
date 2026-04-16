import { getMovies } from "./utils/api.js";
import type { Movie, Movies } from "./types/types.js";
import { BASE_IMAGE_URL } from "./config/config.js";
import { getCurrentPage, buildPagination } from "./utils/functions.js";

let currentPage: number = getCurrentPage();

console.log(currentPage);

async function displayMovies() {
  const movieSection = document.getElementById(
    "popular-movie-section",
  ) as HTMLElement;

  const paginationSection = document.getElementById(
    "pagination",
  ) as HTMLElement;

  if (!movieSection) {
    console.error("Movie Section not found.");
    return;
  }

  try {
    const data: Movies = await getMovies(currentPage);

    movieSection.innerHTML = "";

    const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin

    /* LISTE DES FILMS */
    data.results.forEach((movie: Movie) => {
      const movieElement = document.createElement("div");
      movieElement.className =
        "p-8 rounded-3xl bg-gray-500/10 w-full md: max-w-100 max-h-200 md:hover:scale-105 hover:bg-gray-400/20 transition-all duration-300";
      movieElement.innerHTML = `<a href="/detail/movie.html?id=${movie.id}"><h3 class="text-2xl text-center mb-4">${movie.title}</h3>
          <img src=${BASE_IMAGE_URL + "w500" + movie.poster_path} />
          <div class="flex flex-col items-center">
              <p>Date de sortie: ${movie.release_date}</p>
              <p>Note moyenne: ${movie.vote_average.toPrecision(2)}</p>
          </div></a>
         `;

      fragment.appendChild(movieElement);
    });

    paginationSection.append(
      buildPagination(currentPage, data.total_pages, "/movies/"),
    );
    movieSection.append(fragment);
  } catch (error: any) {
    console.error("Erreur affichage ", error);
  }
}

async function changePage(page: number) {
  currentPage = page;
}

displayMovies();
