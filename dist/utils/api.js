export async function dbFetch(endpoint) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
    };
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
export async function getMovies(page = 1) {
    const res = await dbFetch(`/movie/popular?api_key=${API_KEY}&page=${page}`);
    return res;
}
//# sourceMappingURL=api.js.map