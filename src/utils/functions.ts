import type { Movie } from "../types/types";

export function getCurrentPage(): number {
  const params = new URLSearchParams(window.location.search);
  const pageValue = params.get("page");
  const pageNumber = pageValue ? parseInt(pageValue, 10) : 1;
  return isNaN(pageNumber) ? 1 : pageNumber;
}

export function getCurrentId(): number {
  const params = new URLSearchParams(window.location.search);
  const idValue = params.get("id");
  const id = idValue ? parseInt(idValue, 10) : -1;
  return id;
}

export function buildPagination(
  currPage: number,
  totalPages: number,
  route: string = "/",
): HTMLElement {
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

export function handleReply(reviewId: string, content: string) {
  const targetDiv = document.getElementById(`review-${reviewId}`);
  const replyDiv = document.createElement("div");
  replyDiv.className =
    "ml-8 mt-2 p-2 bg-gray-800 rounded border-l-2 border-amber-500";
  replyDiv.innerHTML = `<p class="text-xs text-amber-500">Moi (Réponse):</p><p>${content}</p>`;
  targetDiv?.appendChild(replyDiv);
  saveLocalReply(reviewId, content);
}

export function saveLocalReply(reviewId: string, content: string) {
  const allReplies = JSON.parse(localStorage.getItem("replies") || "{}");
  if (!allReplies[reviewId]) {
    allReplies[reviewId] = [];
  }
  allReplies[reviewId].push(content);
  localStorage.setItem("replies", JSON.stringify(allReplies));
}

export function saveLocalMovieFavorites(movie: Movie) {
  const favoriteMovies = JSON.parse(
    localStorage.getItem("favorite-movies") || "[]",
  );
  if (!favoriteMovies.includes(movie)) {
    favoriteMovies.append(movie);
    localStorage.setItem("favorite-movies", JSON.stringify(favoriteMovies));
  }
}

export function removeLocalMovieFavorites(movie: Movie) {
  const favoriteMovies = JSON.parse(
    localStorage.getItem("favorite-movies") || "[]",
  );
  if (favoriteMovies.includes(movie)) {
    favoriteMovies.append(movie);
    localStorage.setItem("favorite-movies", JSON.stringify(favoriteMovies));
  }
}
