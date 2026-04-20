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

export async function dbFetch(route: string, api_key: string): Promise<any> {
  const options: Object = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${api_key}`,
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
  const res = await dbFetch(
    `/movie/popular?api_key=${API_KEY}&page=${page}`,
    API_KEY,
  );
  return res;
}

export async function getMovies(page: number = 1): Promise<Movies> {
  const res = await dbFetch(
    `/movie/top_rated?api_key=${API_KEY}&page=${page}`,
    API_KEY,
  );
  return res;
}

export async function getSeries(page: number = 1): Promise<Series> {
  const res = await dbFetch(
    `/tv/top_rated?api_key=${API_KEY}&page=${page}`,
    API_KEY,
  );
  return res;
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const res = await dbFetch(`/movie/${id}`, API_GET_KEY);
  return res;
}

export async function getSerieDetail(id: number): Promise<SerieDetail> {
  const res = await dbFetch(`/tv/${id}`, API_GET_KEY);
  console.log(res);
  return res;
}

export async function getSerieReviews(
  id: number,
  language: string = "en-US",
  page: number = 1,
): Promise<Reviews> {
  const res = await dbFetch(
    `/tv/${id}/reviews?language=${language}&page=${page}`,
    API_GET_KEY,
  );
  return res;
}

export async function getMovieReviews(
  id: number,
  language: string = "en-US",
  page: number = 1,
): Promise<Reviews> {
  const res = await dbFetch(
    `/movie/${id}/reviews?language=${language}&page=${page}`,
    API_GET_KEY,
  );
  return res;
}

export async function getSerieCredits(id: number, language: string = "en-US") {
  const res = await dbFetch(
    `/tv/${id}/credits?language=${language}`,
    API_GET_KEY,
  );
  return res;
}

export async function getMovieCredits(id: number, language: string = "en-US") {
  const res = await dbFetch(
    `/movie/${id}/credits?language=${language}`,
    API_GET_KEY,
  );
  return res;
}
