import { API_KEY, API_GET_KEY, BASE_URL } from "../config/config.js";
export async function dbFetch(route, api_key) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${api_key}`,
        },
    };
    //console.log("request", `${BASE_URL}${route}`);
    const response = await fetch(`${BASE_URL}${route}`, options);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
export async function getPopularMovies(page = 1) {
    const res = await dbFetch(`/movie/popular?api_key=${API_KEY}&page=${page}`, API_KEY);
    return res;
}
export async function getPopularSeries(page = 1) {
    const res = await dbFetch(`/tv/popular?api_key=${API_KEY}&page=${page}`, API_KEY);
    return res;
}
export async function getMovies(page = 1) {
    const res = await dbFetch(`/movie/top_rated?api_key=${API_KEY}&page=${page}`, API_KEY);
    return res;
}
export async function getSeries(page = 1) {
    const res = await dbFetch(`/tv/top_rated?api_key=${API_KEY}&page=${page}`, API_KEY);
    return res;
}
export async function getMovieDetail(id) {
    const res = await dbFetch(`/movie/${id}`, API_GET_KEY);
    return res;
}
export async function getSerieDetail(id) {
    const res = await dbFetch(`/tv/${id}`, API_GET_KEY);
    //console.log(res);
    return res;
}
export async function getSerieReviews(id, language = "en-US", page = 1) {
    const res = await dbFetch(`/tv/${id}/reviews?language=${language}&page=${page}`, API_GET_KEY);
    return res;
}
export async function getMovieReviews(id, language = "en-US", page = 1) {
    const res = await dbFetch(`/movie/${id}/reviews?language=${language}&page=${page}`, API_GET_KEY);
    return res;
}
export async function getSerieCredits(id, language = "en-US") {
    const res = await dbFetch(`/tv/${id}/credits?language=${language}`, API_GET_KEY);
    return res;
}
export async function getMovieCredits(id, language = "en-US") {
    const res = await dbFetch(`/movie/${id}/credits?language=${language}`, API_GET_KEY);
    return res;
}
export async function getMovieSuggestions(id) {
    const res = await dbFetch(`/movie/${id}/recommendations`, API_GET_KEY);
    return res;
}
export async function getSerieSuggestions(id) {
    const res = await dbFetch(`/tv/${id}/recommendations`, API_GET_KEY);
    return res;
}
export async function getSearchSuggestions(search_string) {
    const res = await dbFetch(`/search/multi?query=${search_string}`, API_GET_KEY);
    return res;
}
export async function getSearchMovieSuggestions(search_string) {
    const res = await dbFetch(`/search/movie?query=${search_string}`, API_GET_KEY);
    return res.results;
}
export async function getSearchSerieSuggestions(search_string) {
    const res = await dbFetch(`/search/tv?query=${search_string}`, API_GET_KEY);
    return res.results;
}
export async function getSearchMixedSuggestions(search_string) {
    const resMovies = await dbFetch(`/search/movie?query=${search_string}`, API_GET_KEY);
    const resSeries = await dbFetch(`/search/tv?query=${search_string}`, API_GET_KEY);
    const res = resMovies.results
        .splice(0, 5)
        .concat(resSeries.results.splice(0, 5));
    return res;
}
//# sourceMappingURL=api.js.map