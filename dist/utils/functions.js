import { getMovieDetail, getSerieDetail } from "./api.js";
export function getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    const pageValue = params.get("page");
    const pageNumber = pageValue ? parseInt(pageValue, 10) : 1;
    return isNaN(pageNumber) ? 1 : pageNumber;
}
export function getCurrentId() {
    const params = new URLSearchParams(window.location.search);
    const idValue = params.get("id");
    const id = idValue ? parseInt(idValue, 10) : -1;
    return id;
}
export function buildPagination(currPage, totalPages, route = "/") {
    /* PAGINATION */
    const paginationMenu = document.createElement("div");
    paginationMenu.className = "flex justify-center";
    if (currPage > 1) {
        const pagePrev = document.createElement("a");
        pagePrev.href = `${route}?page=${currPage - 1}`;
        pagePrev.textContent = "<- Page precedente  ";
        paginationMenu.append(pagePrev);
    }
    const pageCurr = document.createElement("p");
    pageCurr.textContent = `${currPage}`;
    paginationMenu.append(pageCurr);
    if (currPage < totalPages) {
        const pageNext = document.createElement("a");
        pageNext.href = `${route}?page=${currPage + 1}`;
        pageNext.textContent = "  Page suivante ->";
        paginationMenu.append(pageNext);
    }
    return paginationMenu;
}
export function handleReply(reviewId, content) {
    const targetDiv = document.getElementById(`review-${reviewId}`);
    const replyDiv = document.createElement("div");
    replyDiv.className =
        "ml-8 mt-2 p-2 bg-gray-800 rounded border-l-2 border-amber-500";
    replyDiv.innerHTML = `<p class="text-xs text-amber-500">Moi (Réponse):</p><p>${content}</p>`;
    targetDiv?.appendChild(replyDiv);
    saveLocalReply(reviewId, content);
}
export function saveLocalReply(reviewId, content) {
    const allReplies = JSON.parse(localStorage.getItem("replies") || "{}");
    if (!allReplies[reviewId]) {
        allReplies[reviewId] = [];
    }
    allReplies[reviewId].push(content);
    localStorage.setItem("replies", JSON.stringify(allReplies));
}
export function changeLocalMovieFavorites(movie) {
    const favoriteMovies = JSON.parse(localStorage.getItem("favorite-movies") || "[]");
    if (!favoriteMovies.includes(movie.id)) {
        favoriteMovies.push(movie.id);
        localStorage.setItem("favorite-movies", JSON.stringify(favoriteMovies));
    }
    else {
        const index = favoriteMovies.indexOf(movie.id);
        if (index != -1)
            favoriteMovies.splice(index, 1);
        localStorage.setItem("favorite-movies", JSON.stringify(favoriteMovies));
    }
}
export function changeLocalSerieFavorites(movie) {
    const favoriteSeries = JSON.parse(localStorage.getItem("favorite-series") || "[]");
    if (!favoriteSeries.includes(movie.id)) {
        favoriteSeries.push(movie.id);
        localStorage.setItem("favorite-series", JSON.stringify(favoriteSeries));
    }
    else {
        const index = favoriteSeries.indexOf(movie.id);
        if (index != -1)
            favoriteSeries.splice(index, 1);
        localStorage.setItem("favorite-series", JSON.stringify(favoriteSeries));
    }
}
export function isFavoriteMovie(id) {
    const favoriteMovies = JSON.parse(localStorage.getItem("favorite-movies") || "[]");
    if (favoriteMovies.includes(id))
        return true;
    return false;
}
export function isFavoriteSerie(id) {
    const favoriteSeries = JSON.parse(localStorage.getItem("favorite-series") || "[]");
    if (favoriteSeries.includes(id))
        return true;
    return false;
}
export async function getFavoriteMovieList() {
    const favoriteMovies = JSON.parse(localStorage.getItem("favorite-movies") || "[]");
    const moviePromises = favoriteMovies.map((id) => getMovieDetail(id));
    const results = await Promise.all(moviePromises);
    return results;
}
export async function getFavoriteSerieList() {
    const favoriteSeries = JSON.parse(localStorage.getItem("favorite-series") || "[]");
    const seriePromises = favoriteSeries.map((id) => getSerieDetail(id));
    const results = await Promise.all(seriePromises);
    return results;
}
//# sourceMappingURL=functions.js.map