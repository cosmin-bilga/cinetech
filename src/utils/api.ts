import type {
  Movies,
  Movie,
  MovieDetail,
  Serie,
  Series,
  SerieDetail,
  Reviews,
  Review,
} from "../types/types";
import { API_KEY, API_GET_KEY, BASE_URL } from "../config/config.js";

export async function dbFetch(route: string): Promise<any> {
  const options: Object = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  console.log("request", `${BASE_URL}${route}`);
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
  const res = await dbFetch(`/movie/top_rated?api_key=${API_KEY}&page=${page}`);
  return res;
}

export async function getSeries(page: number = 1): Promise<Series> {
  const res = await dbFetch(`/tv/top_rated?api_key=${API_KEY}&page=${page}`);
  return res;
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const options: Object = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_GET_KEY}`,
    },
  };

  console.log("request", `${BASE_URL}/movie/${id}`);
  const response = await fetch(`${BASE_URL}/movie/${id}`, options);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getSerieDetail(id: number): Promise<SerieDetail> {
  const options: Object = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_GET_KEY}`,
    },
  };

  console.log("request", `${BASE_URL}/tv/${id}`);
  const response = await fetch(`${BASE_URL}/tv/${id}`, options);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getSerieReviews(
  id: number,
  language: string = "en-US",
  page: number = 1,
): Promise<Reviews> {
  const options: Object = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_GET_KEY}`,
    },
  };

  console.log("request", `${BASE_URL}/tv/${id}`);
  const response = await fetch(
    `${BASE_URL}/tv/${id}/reviews?language=${language}&page=${page}`,
    options,
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
