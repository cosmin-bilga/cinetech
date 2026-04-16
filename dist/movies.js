import { getMovies } from "./utils/api.js";
import { BASE_IMAGE_URL } from "./config/config.js";
import { getCurrentPage, buildPagination } from "./utils/functions.js";
let currentPage = getCurrentPage();
console.log(currentPage);
async function displayMovies() {
    const movieSection = document.getElementById("popular-movie-section");
    const paginationSection = document.getElementById("pagination");
    if (!movieSection) {
        console.error("Movie Section not found.");
        return;
    }
    try {
        const data = await getMovies(currentPage);
        movieSection.innerHTML = "";
        const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin
        /* LISTE DES FILMS */
        data.results.forEach((movie) => {
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
        paginationSection.append(buildPagination(currentPage, data.total_pages, "/movies/"));
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
//# sourceMappingURL=movies.js.map