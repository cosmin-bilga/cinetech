import { getMovies } from "./utils/api.js";
async function displayMovies() {
    const movieSection = document.getElementById("movie-section");
    if (!movieSection) {
        console.error("Movie Section not found.");
        return;
    }
    try {
        const data = await getMovies();
        movieSection.innerHTML = "";
        data.results.forEach((movie) => {
            const movieElement = document.createElement("div");
            movieElement.className = "bg-gray";
            movieElement.innerHTML = `<h3>${movie.title}</h3>`;
            movieSection.appendChild(movieElement);
        });
    }
    catch { }
}
displayMovies();
//# sourceMappingURL=index.js.map