import type { Movies } from "../types/types";

export async function dbFetch(endpoint: string): Promise<Movies> {
  const options: Object = {
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

  return response.json() as Promise<Movies>;
}

export async function getMovies(page: number = 1): Promise<Movies> {
  const res = await dbFetch(`/movie/popular?api_key=${API_KEY}&page=${page}`);
  return res;
}
