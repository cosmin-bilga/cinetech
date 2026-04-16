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
