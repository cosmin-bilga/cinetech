import {
  getMovieDetail,
  getSerieDetail,
  getMovieReviews,
  getSerieReviews,
  getSerieCredits,
  getMovieCredits,
  getMovieSuggestions,
  getSerieSuggestions,
} from "./utils/api.js";
import {
  getCurrentId,
  changeLocalMovieFavorites,
  changeLocalSerieFavorites,
  isFavoriteMovie,
  isFavoriteSerie,
} from "./utils/functions.js";
import { BASE_IMAGE_URL } from "./config/config.js";
import { handleReply } from "./utils/functions.js";
import type {
  CrewMember,
  CastMember,
  MovieDetail,
  SerieDetail,
} from "./types/types.js";

async function retrieveMovie() {
  const mainElement = document.getElementById("main");
  if (!mainElement) return;

  const movieId = getCurrentId();
  if (movieId === -1) {
    mainElement.innerHTML = "Movie not found";
    return;
  }

  const data = await getMovieDetail(movieId);
  const dataCredits = await getMovieCredits(movieId);
  const reviewData = await getMovieReviews(movieId);
  const suggestionData = await getMovieSuggestions(movieId);
  const localReplies = JSON.parse(localStorage.getItem("replies") || "{}");

  console.log(suggestionData);

  mainElement.className = "bg-linear-to-br from-gray-900 to-gray-800";

  // Section Détails du film
  mainElement.innerHTML = `
  <div class="">
    <h2 class="text-center text-3xl text-amber-500">${data.title}</h2>
    <img src=${BASE_IMAGE_URL + "w500" + data.poster_path} />
  </div>
  <div class="flex flex-col mx-2 justify-around text-amber-100 mb-8">
    <div>
      <h3>Pays d'origine: ${data.production_countries.map((c) => c.name).join(" ") || "Non spécifié"}</h3>
      <p>Durée: ${data.runtime} min</p>
      <p>Date de sortie: ${data.release_date}</p>
      <p></p>
    </div>
    <div>
      <h5>Synopsis</h5>
      <p>${data.overview}</p>
    </div>
     <div>
      <h5 class="text-3xl font-bold text-amber-500 text-center">Producers</h5>
      <div class="flex flew-col justify-center gap-4 md: flex-row">
        ${dataCredits.crew
          .filter((crewMember: CrewMember) => crewMember.job === "Producer")
          .map(
            (producer: CrewMember) => `
      <div class="w-1/2">
          ${
            producer.profile_path
              ? `<img src="${BASE_IMAGE_URL + "w185" + producer.profile_path}" alt="${producer.name}" />`
              : `<img src="../assets/account-avatar-person-profile-user-svgrepo-com.svg" alt="${producer.name}" />`
          }
        <p class="text-center">${producer.name}</p>
      </div>
    `,
          )
          .join("")} 
    </div>
    <div>
      <h5 class="text-2xl text-amber-500 text-center" >Cast</h5>
      <div class="grid grid-cols-4 md:grid-cols-12">
        ${dataCredits.cast
          .slice(0, 20)
          .map(
            (castMember: CastMember) => `
        <div class="">
          ${
            castMember.profile_path
              ? `<img src="${BASE_IMAGE_URL + "w185" + castMember.profile_path}" alt="${castMember.name}" class="h-24 w-24 object-cover rounded-full"/>`
              : `<img src="../assets/account-avatar-person-profile-user-svgrepo-com.svg" alt="${castMember.name}" class="h-24 w-24 object-cover rounded-full"/>`
          }
        <p class="text-center text-sm">${castMember.name}</p>
        </div>
    `,
          )
          .join("")} 
    </div>
    <div class="flex justify-between mt-4">
      <p>Note moyenne: ${data.vote_average.toPrecision(2)}</p>
      ${
        isFavoriteMovie(data.id)
          ? `<button class="border border-black p-2 rounded-2xl bg-red-800"; id="add-favorite-button">Retier favori</button>`
          : `<button class="border border-black p-2 rounded-2xl bg-green-800"; id="add-favorite-button">Ajouter favori</button>`
      }
      
    </div>
  </div>
  `;

  const movieSuggestionContainer = document.createElement("div");
  movieSuggestionContainer.innerHTML = `
  <h4 class="text-amber-500 text-xl mb-4 font-bold">Films similaires</h4>
  <div class="grid grid-cols-2  md:grid-cols-6 gap-2">
    ${suggestionData.results
      .slice(0, 6)
      .map((movie: MovieDetail) => {
        return `
          <div class="mx-2">
            <a href="/detail/movie.html?id=${movie.id}" class="block">
              <div class="relative overflow-hidden rounded-lg aspect-2/3 bg-gray-800">
                <img 
                  src="${movie.poster_path ? BASE_IMAGE_URL + "w342" + movie.poster_path : "../assets/no-poster.png"}" 
                  alt="${movie.title}"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p class="text-sm mt-2 text-amber-100 font-medium truncate group-hover:text-amber-500">
                ${movie.title}
              </p>
            </a>
          </div>
        `;
      })
      .join("")}
  </div>
`;

  mainElement.append(movieSuggestionContainer);

  const movieReviewContainer = document.createElement("div");
  movieReviewContainer.className = "mx-2 text-white";
  movieReviewContainer.innerHTML = `
    <h4 class="text-amber-500 text-xl mb-4">Commentaires</h4>
    ${reviewData.results
      .map((review) => {
        const localRepliesForThisReview = localReplies[review.id] || [];
        return `
        <div id="review-${review.id}" class="ml-2 mb-4 border-b border-gray-700 pb-2">
            <p class="font-bold text-amber-500">${review.author}</p>
            <p>${review.content}</p>
            <div class="replies-container">
                ${localRepliesForThisReview
                  .map(
                    (reply: string) => `
                    <div class="ml-8 mt-2 p-2 bg-gray-800 rounded border-l-2 border-amber-500">
                        <p class="text-xs text-amber-500">Moi (Réponse):</p>
                        <p>${reply}</p>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            <div class="flex mt-2">
                <input id="input-${review.id}" class="text-amber-100 px-2 rounded-l bg-gray-900 border border-gray-600" placeholder="Répondre...">
                <button id="button-${review.id}" class="bg-amber-600 px-3 rounded-r">Envoyer</button>
            </div>
        </div>`;
      })
      .join("")}
  `;

  movieReviewContainer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" && target.id.startsWith("button-")) {
      const reviewId = target.id.replace("button-", "");
      const input = document.getElementById(
        `input-${reviewId}`,
      ) as HTMLInputElement;

      if (input && input.value.trim() !== "") {
        handleReply(reviewId, input.value);
        input.value = "";
      }
    }
  });

  const favoriteButton = document.getElementById("add-favorite-button");
  console.log(favoriteButton);
  favoriteButton?.addEventListener("click", (e) => {
    changeLocalMovieFavorites(data);
    if (isFavoriteMovie(data.id)) {
      favoriteButton.textContent = "Rétirer favori";
      favoriteButton.className =
        "border border-black p-2 rounded-2xl bg-red-800";
    } else {
      favoriteButton.textContent = "Ajouter favori";
      favoriteButton.className =
        "border border-black p-2 rounded-2xl bg-green-800";
    }
  });

  mainElement.append(movieReviewContainer);
}

async function retrieveSerie() {
  const mainElement = document.getElementById("main-serie");
  const serieInfo = document.createElement("div");

  if (!mainElement) {
    //console.error("Main not found");
    return;
  }
  mainElement.className = "bg-linear-to-br from-gray-900 to-gray-800";

  const serieId = getCurrentId();
  if (serieId === -1) {
    mainElement.innerHTML = "Serie not found";
  }

  const data = await getSerieDetail(serieId);
  const dataCredits = await getSerieCredits(serieId);
  const suggestionData = await getSerieSuggestions(serieId);

  /*   const producers = getProducers(dataCredits);
  const actors = getActors(dataCredits); */

  serieInfo.innerHTML = `
  <div class="">
    <h2 class="text-center text-3xl text-amber-500">${data.name}</h2>
    <img src=${BASE_IMAGE_URL + "w500" + data.poster_path} />
  </div>
  <div class="flex flex-col mx-2 justify-around text-amber-100">
    <div>
      <h2 class="hidden">Titre: ${data.name}</h2>
      <h3>Pays d'origine: ${data.production_countries.map((country) => country.name).join(" ") || "Pays non spécifié"}</h3>
      <p>Saisons: ${data.number_of_seasons};
      <p>Episodes: ${data.number_of_episodes}
      <p>Date de debut: ${data.first_air_date}</p>
    </div>
    <div>
      <h5>Synopsis</h5>
      <p>${data.overview}</p>
    <div>
    <div>
      <h5 class="text-3xl font-bold text-amber-500 text-center">Producers</h5>
      <div class="flex justify-center gap-4">
        ${dataCredits.crew
          .filter((crewMember: CrewMember) => crewMember.job === "Producer")
          .map(
            (producer: CrewMember) => `
      <div class="w-1/4">
        <div class="aspect-3/4 rounded">
          ${
            producer.profile_path
              ? `<img src="${BASE_IMAGE_URL + "w500" + producer.profile_path}" alt="${producer.name}" class="w-full h-full object-cover"/>`
              : `<img src="../assets/account-avatar-person-profile-user-svgrepo-com.svg" alt="${producer.name}" class="w-full h-full object-cover" />`
          }
          </div>
        <p>${producer.name}</p>
      </div>
    `,
          )
          .join("")} 
    </div>
    <div>
      <h5 class="text-2xl text-amber-500 text-center">Cast</h5>
      <div class="grid grid-cols-4 md:grid-cols-12">
        ${dataCredits.cast
          .map(
            (castMember: CastMember) => `
        <div class="">
          ${
            castMember.profile_path
              ? `<img src="${BASE_IMAGE_URL + "w500" + castMember.profile_path}" alt="${castMember.name}" class="h-24 w-24 object-cover rounded-full"/>`
              : `<img src="../assets/account-avatar-person-profile-user-svgrepo-com.svg" alt="${castMember.name}" class="h-24 w-24 object-cover rounded-full"/>`
          }
        <p class="text-center text-sm">${castMember.name}</p>
        </div>
    `,
          )
          .join("")} 
    </div>
    </div>
    <div class="flex justify-between">
      <p>Note moyenne: ${data.vote_average.toPrecision(2)}</p>
      ${
        isFavoriteMovie(data.id)
          ? `<button class="border border-black p-2 rounded-2xl bg-red-800"; id="add-favorite-button">Rétier favori</button>`
          : `<button class="border border-black p-2 rounded-2xl bg-green-800"; id="add-favorite-button">Ajouter favori</button>`
      }
    </div>
  </div>
  `;
  mainElement.append(serieInfo);

  const serieSuggestionContainer = document.createElement("div");
  serieSuggestionContainer.innerHTML = `
  <h4 class="text-amber-500 text-xl mb-4 font-bold text-center">Series similaires</h4>
  <div class="grid grid-cols-2  md:grid-cols-6 gap-2">
    ${suggestionData.results
      .slice(0, 6)
      .map((serie: SerieDetail) => {
        return `
          <div class="mx-2">
            <a href="/detail/serie.html?id=${serie.id}" class="block">
              <div class="relative overflow-hidden rounded-lg aspect-2/3 bg-gray-800">
                <img 
                  src="${serie.poster_path ? BASE_IMAGE_URL + "w342" + serie.poster_path : "../assets/no-poster.png"}" 
                  alt="${serie.name}"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p class="text-sm mt-2 text-amber-100 font-medium truncate group-hover:text-amber-500">
                ${serie.name}
              </p>
            </a>
          </div>
        `;
      })
      .join("")}
  </div>
`;

  mainElement.append(serieSuggestionContainer);

  const reviewData = await getSerieReviews(data.id);
  console.log(reviewData);
  const localReplies = JSON.parse(localStorage.getItem("replies") || "{}");
  const serieReview = document.createElement("div");

  serieReview.className = "mx-2 text-white";

  serieReview.innerHTML = `<div>
    ${reviewData.results
      .map((review) => {
        const localRepliesForThisReview = localReplies[review.id] || [];

        return `
        <div id="review-${review.id}" class="ml-2 mb-2 border-b border-gray-700 pb-2">
            <p class="font-bold text-amber-500">${review.author}</p>
            <p>${review.content}</p>
            
            <div class="replies-container">
                ${localRepliesForThisReview
                  .map(
                    (reply: string) => `
                    <div class="ml-8 mt-2 p-2 bg-gray-800 rounded border-l-2 border-amber-500">
                        <p class="text-xs text-amber-500">Localuser:</p>
                        <p>${reply}</p>
                    </div>
                `,
                  )
                  .join("")}
            </div>

            <div class="flex mt-2">
                <input id="input-${review.id}" class="text-amber-100 px-2 rounded-l outline-1" placeholder="Répondre...">
                <button id="button-${review.id}" class="bg-amber-600 px-3 rounded-r outline-1">Envoyer</button>
            </div>
        </div>`;
      })
      .join("")}
</div>`;

  serieReview.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.tagName === "BUTTON" && target.id.startsWith("button-")) {
      const reviewId = target.id.replace("button-", "");
      const input = document.getElementById(
        `input-${reviewId}`,
      ) as HTMLInputElement;

      if (input && input.value.trim() !== "") {
        handleReply(reviewId, input.value);
        input.value = "";
      }
    }
  });

  const favoriteButton = document.getElementById("add-favorite-button");
  console.log(favoriteButton);
  favoriteButton?.addEventListener("click", (e) => {
    changeLocalSerieFavorites(data);
    if (isFavoriteSerie(data.id)) {
      favoriteButton.textContent = "Rétirer favori";
      favoriteButton.className =
        "border border-black p-2 rounded-2xl bg-red-800";
    } else {
      favoriteButton.textContent = "Ajouter favori";
      favoriteButton.className =
        "border border-black p-2 rounded-2xl bg-green-800";
    }
  });

  mainElement.append(serieReview);
}

retrieveMovie();
retrieveSerie();
