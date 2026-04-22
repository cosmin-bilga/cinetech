import { getPopularMovies, getPopularSeries } from "./utils/api.js";
import { BASE_IMAGE_URL } from "./config/config.js";
import { initSearch } from "./utils/searchbar.js";
async function displayMovies() {
    const movieSection = document.getElementById("popular-movie-section");
    const serieSection = document.getElementById("popular-serie-section");
    if (!movieSection || !serieSection) {
        console.error("Section not found.");
        return;
    }
    movieSection.innerHTML = "<p>Aucun film retrouvé...</p>";
    serieSection.innerHTML = "<p>Aucune serie retrouvée...</p>";
    try {
        const moviesData = await getPopularMovies();
        movieSection.innerHTML = "";
        const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin
        /* LISTE DES FILMS */
        moviesData.results.splice(0, 12).forEach((movie) => {
            const movieElement = document.createElement("div");
            movieElement.className =
                "py-4 px-2 rounded-2xl bg-linear-to-br from-gray-500/10 to-gray-300/10 w-full md: max-w-100 max-h-200 hover:scale-102 transition-all duration-300";
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
         `;
            fragment.appendChild(movieElement);
        });
        movieSection.append(fragment);
    }
    catch (error) {
        console.error("Erreur affichage ", error);
    }
    try {
        const seriesData = await getPopularSeries();
        serieSection.innerHTML = "";
        const fragment = document.createDocumentFragment(); // pour modifier le DOM une seule fois, à la fin
        /* LISTE DES SERIES */
        fragment.appendChild;
        seriesData.results.splice(0, 12).forEach((serie) => {
            const serieElement = document.createElement("div");
            serieElement.className =
                "py-4 px-2 rounded-2xl bg-linear-to-br from-gray-500/10 to-gray-300/10 w-full md: max-w-100 max-h-200 hover:scale-102 transition-all duration-300";
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
         `;
            fragment.appendChild(serieElement);
        });
        serieSection.append(fragment);
    }
    catch (error) {
        console.error("Erreur affichage ", error);
    }
}
displayMovies();
initSearch("movies");
//# sourceMappingURL=index.js.map