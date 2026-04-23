import { getSearchMovieSuggestions, getSearchSerieSuggestions, getSearchMixedSuggestions, } from "./api.js";
export function initSearch(search_type = "movies") {
    const searchBar = document.getElementById("search-bar");
    const searchSuggestions = document.getElementById("search-suggestions");
    let searchTimer;
    if (!searchBar || !searchSuggestions)
        return;
    searchBar.addEventListener("input", (e) => {
        const target = e.target;
        const query = target.value.trim();
        clearTimeout(searchTimer);
        if (query.length < 3) {
            searchSuggestions.innerHTML = "";
            searchSuggestions.classList.add("hidden");
            return;
        }
        searchTimer = setTimeout(async () => {
            try {
                let searchData;
                /*  if (search_type === "series") {
                  searchData = await getSearchSerieSuggestions(query);
                } else {
                  searchData = await getSearchMovieSuggestions(query);
                } */
                searchData = await getSearchMixedSuggestions(query);
                if (searchData.length > 0) {
                    searchSuggestions.classList.remove("hidden");
                    searchSuggestions.innerHTML = searchData
                        .slice(0, 10)
                        .map((item) => `
              <a href="/detail/${"title" in item ? "movie" : "serie"}.html?id=${item.id}" class="block border-b border-gray-700 last:border-none">
                <div class="p-3 hover:bg-amber-300 transition-colors cursor-pointer flex items-center gap-3">
                  <span class="text-gray-900">
                  ${"title" in item ? '<span class="text-xs text-gray-400 text-right">film  </span>' + item.title : '<span class="text-xs text-gray-400 text-end">serie  </span>' + item.name}</span>
                </div>
              </a>
            `)
                        .join("");
                }
                else {
                    searchSuggestions.innerHTML = `<div class="p-3 text-gray-400 italic">Aucun résultat...</div>`;
                }
            }
            catch (error) {
                console.error("Search error:", error);
            }
        }, 300);
    });
    /* Fermer la div avec la suggestions si on click ailleurs */
    document.addEventListener("click", (e) => {
        if (!searchBar.contains(e.target) &&
            !searchSuggestions.contains(e.target)) {
            searchSuggestions.classList.add("hidden");
        }
    });
}
/* TOGGLE MENU MOBILE */
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
//const mobileHeader = document.getElementById("mobile-header");
menuToggle?.addEventListener("click", () => {
    navMenu?.classList.toggle("hidden");
    navMenu?.classList.toggle("flex");
    menuToggle?.textContent === "MENU ☰"
        ? (menuToggle.textContent = "X")
        : (menuToggle.textContent = "MENU ☰");
});
//# sourceMappingURL=searchbar.js.map