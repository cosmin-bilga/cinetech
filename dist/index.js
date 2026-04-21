import { getPopularMovies, getSearchMovieSuggestions } from "./utils/api.js";
import { BASE_IMAGE_URL } from "./config/config.js";
import { getCurrentPage, buildPagination } from "./utils/functions.js";
import { initSearch } from "./utils/searchbar.js";
let currentPage = getCurrentPage();
async function displayMovies() {
    const movieSection = document.getElementById("popular-movie-section");
    const paginationSection = document.getElementById("pagination");
    if (!movieSection) {
        console.error("Movie Section not found.");
        return;
    }
    try {
        const data = await getPopularMovies(currentPage);
        movieSection.innerHTML = "";
        const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin
        /* LISTE DES FILMS */
        data.results.forEach((movie) => {
            const movieElement = document.createElement("div");
            movieElement.className =
                "py-4 px-2 rounded-2xl bg-linear-to-br from-gray-500/10 to-gray-300/10 w-full md: max-w-100 max-h-200 hover:scale-102 transition-all duration-300";
            movieElement.innerHTML = `<a href="/detail/movie.html?id=${movie.id}"><h3 class="text-2xl font-bold text-center mb-4 text-amber-500 italic">${movie.title}</h3>
          <img src=${BASE_IMAGE_URL + "w500" + movie.poster_path} />
          <div class="flex flex-col items-center">
              <p class="text-sm">Date de sortie: <span class="text-white">${movie.release_date}</span></p>
              <p class="text-sm">Note moyenne: <span class="text-white">${movie.vote_average.toPrecision(2)}</span></p>
          </div></a>
         `;
            fragment.appendChild(movieElement);
        });
        paginationSection.append(buildPagination(currentPage, data.total_pages, "/"));
        movieSection.append(fragment);
    }
    catch (error) {
        console.error("Erreur affichage ", error);
    }
}
async function changePage(page) {
    currentPage = page;
}
displayMovies();
initSearch("movies");
//# sourceMappingURL=index.js.map