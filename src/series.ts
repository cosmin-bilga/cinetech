import { getSeries } from "./utils/api.js";
import type { Serie, Series } from "./types/types.js";
import { BASE_IMAGE_URL } from "./config/config.js";
import { getCurrentPage, buildPagination } from "./utils/functions.js";
import { initSearch } from "./utils/searchbar.js";

let currentPage: number = getCurrentPage();

async function displaySeries() {
  const movieSection = document.getElementById("series-section") as HTMLElement;

  const paginationSection = document.getElementById(
    "pagination",
  ) as HTMLElement;

  if (!movieSection) {
    console.error("Movie Section not found.");
    return;
  }

  try {
    const data: Series = await getSeries(currentPage);

    movieSection.innerHTML = "";

    const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin

    /* LISTE DES FILMS */
    data.results.forEach((serie: Serie) => {
      const serieElement = document.createElement("div");
      serieElement.className =
        "py-4 px-2 rounded-2xl bg-linear-to-br from-gray-500/10 to-gray-300/10 w-full md: max-w-100 max-h-200 hover:scale-102 transition-all duration-300";
      serieElement.innerHTML = `
        <a href="/detail/serie.html?id=${serie.id}" class="flex flex-col justify-between">
          <h3 class="text-xl font-bold text-center mb-4 text-amber-500 italic h-16 line-clamp-2">${serie.name}</h3>
          <img src=${BASE_IMAGE_URL + "w500" + serie.poster_path} class="aspect-2/3" />
          <div class="flex flex-col items-center mt-auto">
              <p class="text-sm">Date de debut: <span class="text-white">${serie.first_air_date}</span></p>
              <p class="text-sm">
                <span class="text-white">${serie.vote_average.toPrecision(2)}</span>
                <span class="text-yellow-500">★</span>
              </p>
          </div>
        </a>
         `;

      fragment.appendChild(serieElement);
    });

    paginationSection.append(
      buildPagination(currentPage, data.total_pages, "/series/"),
    );
    movieSection.append(fragment);
  } catch (error: any) {
    console.error("Erreur affichage ", error);
  }
}

async function changePage(page: number) {
  currentPage = page;
}

displaySeries();
initSearch();
