import { getSeries } from "./utils/api.js";
import { BASE_IMAGE_URL } from "./config/config.js";
import { getCurrentPage, buildPagination } from "./utils/functions.js";
let currentPage = getCurrentPage();
console.log(currentPage);
async function displaySeries() {
    const movieSection = document.getElementById("series-section");
    const paginationSection = document.getElementById("pagination");
    if (!movieSection) {
        console.error("Movie Section not found.");
        return;
    }
    try {
        const data = await getSeries(currentPage);
        movieSection.innerHTML = "";
        const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin
        /* LISTE DES FILMS */
        data.results.forEach((serie) => {
            const movieElement = document.createElement("div");
            movieElement.className =
                "p-8 rounded-3xl bg-gray-500/10 w-full md: max-w-100 max-h-200 md:hover:scale-105 hover:bg-gray-400/20 transition-all duration-300";
            movieElement.innerHTML = `<a href="/detail/serie.html?id=${serie.id}"><h3 class="text-2xl text-center mb-4">${serie.name}</h3>
          <img src=${BASE_IMAGE_URL + "w500" + serie.poster_path} />
          <div class="flex flex-col items-center">
              <p>Note moyenne: ${serie.vote_average.toPrecision(2)}</p>
          </div></a>
         `;
            fragment.appendChild(movieElement);
        });
        paginationSection.append(buildPagination(currentPage, data.total_pages, "/series/"));
        movieSection.append(fragment);
    }
    catch (error) {
        console.error("Erreur affichage ", error);
    }
}
async function changePage(page) {
    currentPage = page;
}
displaySeries();
//# sourceMappingURL=series.js.map