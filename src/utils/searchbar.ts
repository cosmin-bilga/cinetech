import { getSearchMovieSuggestions, getSearchSerieSuggestions } from "./api.js";
import type { Movie, Serie } from "../types/types.js";

export function initSearch(search_type: string = "movies") {
  const searchBar = document.getElementById("search-bar") as HTMLInputElement;
  const searchSuggestions = document.getElementById("search-suggestions");
  let searchTimer: number;

  if (!searchBar || !searchSuggestions) return;

  searchBar.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    const query = target.value.trim();

    clearTimeout(searchTimer);

    if (query.length < 3) {
      searchSuggestions.innerHTML = "";
      searchSuggestions.classList.add("hidden");
      return;
    }

    searchTimer = setTimeout(async () => {
      try {
        let searchData: any;
        if (search_type === "series") {
          searchData = await getSearchSerieSuggestions(query);
        } else {
          searchData = await getSearchMovieSuggestions(query);
        }

        if (searchData.length > 0) {
          searchSuggestions.classList.remove("hidden");
          searchSuggestions.innerHTML = searchData
            .slice(0, 10)
            .map(
              (item: Movie | Serie) => `
              <a href="/detail/${search_type === "movies" ? "movie" : "serie"}.html?id=${item.id}" class="block border-b border-gray-700 last:border-none">
                <div class="p-3 hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-3">
                  <span class="text-white">${"title" in item ? item.title : item.name}</span>
                </div>
              </a>
            `,
            )
            .join("");
        } else {
          searchSuggestions.innerHTML = `<div class="p-3 text-gray-400 italic">Aucun résultat...</div>`;
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);
  });

  /* Fermer la div avec la suggestions si on click ailleurs */
  document.addEventListener("click", (e) => {
    if (
      !searchBar.contains(e.target as Node) &&
      !searchSuggestions.contains(e.target as Node)
    ) {
      searchSuggestions.classList.add("hidden");
    }
  });
}
