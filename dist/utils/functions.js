export function getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    const pageValue = params.get("page");
    const pageNumber = pageValue ? parseInt(pageValue, 10) : 1;
    return isNaN(pageNumber) ? 1 : pageNumber;
}
export function buildPagination(currPage, totalPages) {
    /* PAGINATION */
    const paginationMenu = document.createElement("div");
    paginationMenu.className = "flex justify-center";
    if (currPage > 1) {
        const pagePrev = document.createElement("a");
        pagePrev.href = `/?page=${currPage - 1}`;
        pagePrev.textContent = "<- Page precedente  ";
        paginationMenu.append(pagePrev);
    }
    const pageCurr = document.createElement("p");
    pageCurr.textContent = `${currPage}`;
    paginationMenu.append(pageCurr);
    if (currPage < totalPages) {
        const pageNext = document.createElement("a");
        pageNext.href = `/?page=${currPage + 1}`;
        pageNext.textContent = "  Page suivante ->";
        paginationMenu.append(pageNext);
    }
    return paginationMenu;
}
//# sourceMappingURL=functions.js.map