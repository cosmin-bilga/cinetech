import type { Movies } from "../types/types";
import { API_KEY, BASE_URL } from "../config/config.js";

export async function dbFetch(route: string): Promise<Movies> {
  const options: Object = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const response = await fetch(`${BASE_URL}${route}`, options);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<Movies>;
}

export async function getPopularMovies(page: number = 1): Promise<Movies> {
  const res = await dbFetch(`/movie/popular?api_key=${API_KEY}&page=${page}`);
  return res;
}

export async function getMovies(page: number = 1): Promise<Movies> {
  const res = await dbFetch(`/movie/popular?api_key=${API_KEY}&page=${page}`);
  return res;
}
