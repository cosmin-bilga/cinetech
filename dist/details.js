import { getMovieDetail, getSerieDetail, getMovieReviews, getSerieReviews, getSerieCredits, getMovieCredits, getMovieSuggestions, getSerieSuggestions, } from "./utils/api.js";
import { getCurrentId, changeLocalMovieFavorites, changeLocalSerieFavorites, isFavoriteMovie, isFavoriteSerie, } from "./utils/functions.js";
import { BASE_IMAGE_URL } from "./config/config.js";
import { handleReply } from "./utils/functions.js";
import { initSearch } from "./utils/searchbar.js";
async function retrieveMovie() {
    const mainElement = document.getElementById("main");
    if (!mainElement)
        return;
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
    mainElement.className =
        "bg-linear-to-br from-gray-900 to-gray-800 md:px-[12.5%]";
    // Section Détails du film
    mainElement.innerHTML = `
  <div class="">
    <h2 class="text-center text-3xl text-amber-500 mb-8 pt-8 font-bold">${data.title}</h2>
    <div class="w-full">
      <img src=${BASE_IMAGE_URL + "w500" + data.poster_path} class="max-w-100 aspect-auto mx-auto"/>
    </div>
  </div>
  <div class="flex flex-col mx-2 justify-around text-amber-100 mb-8 ">
    <div>
      <h3><span class="text-amber-300">Pays d'origine:</span> ${data.production_countries.map((c) => c.name).join(" ") || "Non spécifié"}</h3>
      <p><span class="text-amber-300">Durée:</span> ${data.runtime} min</p>
      <p><span class="text-amber-300">Date de sortie:</span> ${data.release_date}</p>
    </div>
    <div>
      <h5 class="text-amber-300 font-bold ">Synopsis</h5>
      <p>${data.overview}</p>
    </div>
    <div class="flex justify-between mt-4 mx-10">
      <p>${data.vote_average.toPrecision(2)}
      <span class="text-yellow-500">★</span></p>
      ${isFavoriteMovie(data.id)
        ? `<button class="border border-black p-2 rounded-2xl bg-red-800"; id="add-favorite-button">Retier favori</button>`
        : `<button class="border border-black p-2 rounded-2xl bg-green-800"; id="add-favorite-button">Ajouter favori</button>`}
      
    </div>
     <div>
      <h5 class="text-3xl font-bold text-amber-500 text-center">Producers</h5>
      <div class="flex flew-col justify-center gap-4 md: flex-row">
        ${dataCredits.crew
        .filter((crewMember) => crewMember.job === "Producer")
        .map((producer) => `
        <div class="w-30 aspect-2/3">
          ${producer.profile_path
        ? `<img src="${BASE_IMAGE_URL + "w185" + producer.profile_path}" alt="${producer.name}" />`
        : `<img src="../assets/account-avatar-person-profile-user-svgrepo-com.svg" alt="${producer.name}" />`}
        <p class="text-center">${producer.name}</p>
      </div>
    `)
        .join("")} 
    </div>
    <div>
      <h5 class="text-2xl text-amber-500 text-center" >Cast</h5>
      <div class="grid grid-cols-4 gap-2 md:flex md:flex-wrap md:justify-center md:gap-8">
        ${dataCredits.cast
        .slice(0, 20)
        .map((castMember) => `
        <div class="">
          ${castMember.profile_path
        ? `<img src="${BASE_IMAGE_URL + "w185" + castMember.profile_path}" alt="${castMember.name}" class="h-24 w-24 object-cover rounded-full"/>`
        : `<img src="../assets/account-avatar-person-profile-user-svgrepo-com.svg" alt="${castMember.name}" class="h-24 w-24 object-cover rounded-full"/>`}
        <p class="text-center text-sm">${castMember.name}</p>
        </div>
    `)
        .join("")} 
    </div>
    
  </div>
  `;
    const movieSuggestionContainer = document.createElement("div");
    movieSuggestionContainer.innerHTML = `
  <h4 class="text-amber-500 text-xl mb-4 font-bold">Films similaires</h4>
  <div class="grid grid-cols-2  md:grid-cols-6 gap-2">
    ${suggestionData.results
        .slice(0, 6)
        .map((movie) => {
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
    const userCommentsKey = `movie-comments-${movieId}`;
    const userComments = JSON.parse(localStorage.getItem(userCommentsKey) || "[]");
    const userCommentsHTML = userComments
        .map((comment, index) => `
  <div class="ml-2 mb-4 border-b border-gray-700 pb-2">
    <p class="font-bold text-amber-500">Moi</p>
    <p class="text-white mt-1 italic">"${comment.content}"</p>
  </div>
`)
        .join("");
    const movieReviewContainer = document.createElement("div");
    movieReviewContainer.className = "mx-2 text-white";
    movieReviewContainer.innerHTML = `
    <h4 class="text-amber-500 text-2xl font-bold my-8 pl-12 border-t ">Commentaires</h4>
    ${createUserCommentInput(movieId, "movie")}
    ${userCommentsHTML}
    ${reviewData.results
        .map((review) => {
        const localRepliesForThisReview = localReplies[review.id] || [];
        return `
        <div id="review-${review.id}" class="ml-2 mb-4 border-b border-gray-700 pb-2">
            <p class="font-bold text-amber-500">${review.author}</p>
            <p>${review.content}</p>
            <div class="replies-container">
                ${localRepliesForThisReview
            .map((reply) => `
                    <div class="ml-8 mt-2 p-2 bg-gray-800 rounded border-l-2 border-amber-500">
                        <p class="text-xs text-amber-500">Moi (Réponse):</p>
                        <p>${reply}</p>
                    </div>
                `)
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
        const target = e.target;
        if (target.tagName === "BUTTON" && target.id.startsWith("button-")) {
            const reviewId = target.id.replace("button-", "");
            const input = document.getElementById(`input-${reviewId}`);
            if (input && input.value.trim() !== "") {
                handleReply(reviewId, input.value);
                input.value = "";
            }
        }
    });
    const favoriteButton = document.getElementById("add-favorite-button");
    favoriteButton?.addEventListener("click", (e) => {
        changeLocalMovieFavorites(data);
        if (isFavoriteMovie(data.id)) {
            favoriteButton.textContent = "Rétirer favori";
            favoriteButton.className =
                "border border-black p-2 rounded-2xl bg-red-800";
        }
        else {
            favoriteButton.textContent = "Ajouter favori";
            favoriteButton.className =
                "border border-black p-2 rounded-2xl bg-green-800";
        }
    });
    mainElement.append(movieReviewContainer);
    const submitBtn = document.getElementById("submit-user-comment");
    submitBtn?.addEventListener("click", () => {
        const textarea = document.getElementById("user-new-comment");
        const content = textarea.value.trim();
        if (content) {
            const storageKey = `movie-comments-${movieId}`;
            const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
            const newComment = {
                content: content,
                date: new Date().toLocaleDateString("fr-FR"),
                id: Date.now(),
            };
            existing.unshift(newComment);
            localStorage.setItem(storageKey, JSON.stringify(existing));
            window.location.reload();
        }
    });
    initSearch("movies");
}
async function retrieveSerie() {
    const mainElement = document.getElementById("main-serie");
    const serieInfo = document.createElement("div");
    if (!mainElement) {
        //console.error("Main not found");
        return;
    }
    mainElement.className = "md:px-[12.5%]";
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
    <h2 class="text-center text-3xl text-amber-500 mb-8 pt-8 font-bold">${data.name}</h2>
    <div class="w-full">
      <img src=${BASE_IMAGE_URL + "w500" + data.poster_path} class="max-w-100 aspect-auto mx-auto"/>
    </div>
  </div>
  <div class="flex flex-col mx-2 justify-around text-amber-100">
    <div>
      <h2 class="hidden">Titre: ${data.name}</h2>
      <h3><span class="text-amber-300">Pays d'origine:</span> ${data.production_countries.map((country) => country.name).join(" ") || "Pays non spécifié"}</h3>
      <p><span class="text-amber-300">Saisons:</span> ${data.number_of_seasons};
      <p><span class="text-amber-300">Episodes:</span> ${data.number_of_episodes}
      <p><span class="text-amber-300">Date de debut:</span> ${data.first_air_date}</p>
    </div>
    <div>
      <h5 class="text-amber-300 font-bold ">Synopsis</h5>
      <p>${data.overview}</p>
    <div>
    <div class="flex justify-between mt-4 mx-10">
      <p> ${data.vote_average.toPrecision(2)}
      <span class="text-yellow-500">★</span></p>
      ${isFavoriteMovie(data.id)
        ? `<button class="border border-black p-2 rounded-2xl bg-red-800"; id="add-favorite-button">Rétier favori</button>`
        : `<button class="border border-black p-2 rounded-2xl bg-green-800"; id="add-favorite-button">Ajouter favori</button>`}
    </div>
    <div>
      <h5 class="text-3xl font-bold text-amber-500 text-center">Producers</h5>
      <div class="flex justify-center gap-4">
        ${dataCredits.crew
        .filter((crewMember) => crewMember.job === "Producer")
        .map((producer) => `
      <div class="w-30 aspect-2/3">
        <div class="aspect-3/4 rounded">
          ${producer.profile_path
        ? `<img src="${BASE_IMAGE_URL + "w500" + producer.profile_path}" alt="${producer.name}" class="w-full h-full object-cover"/>`
        : `<img src="../assets/account-avatar-person-profile-user-svgrepo-com.svg" alt="${producer.name}" class="w-full h-full object-cover" />`}
          </div>
        <p>${producer.name}</p>
      </div>
    `)
        .join("")} 
    </div>
    <div>
      <h5 class="text-2xl text-amber-500 text-center">Cast</h5>
      <div class="grid grid-cols-4 gap-2 md:flex md:flex-wrap md:justify-center md:gap-8">
        ${dataCredits.cast
        .map((castMember) => `
        <div class="">
          ${castMember.profile_path
        ? `<img src="${BASE_IMAGE_URL + "w500" + castMember.profile_path}" alt="${castMember.name}" class="h-24 w-24 object-cover rounded-full"/>`
        : `<img src="../assets/account-avatar-person-profile-user-svgrepo-com.svg" alt="${castMember.name}" class="h-24 w-24 object-cover rounded-full"/>`}
        <p class="text-center text-sm">${castMember.name}</p>
        </div>
      `)
        .join("")} 
      </div>
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
        .map((serie) => {
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
    const localReplies = JSON.parse(localStorage.getItem("replies") || "{}");
    const serieReview = document.createElement("div");
    serieReview.className = "mx-2 text-white";
    const userCommentsKey = `serie-comments-${serieId}`;
    const userComments = JSON.parse(localStorage.getItem(userCommentsKey) || "[]");
    const userCommentsHTML = userComments
        .map((comment, index) => `
  <div class="ml-2 mb-4 border-b border-gray-700 pb-2">
    <p class="font-bold text-amber-500">Moi</p>
    <p class="text-white mt-1 italic">"${comment.content}"</p>
  </div>
`)
        .join("");
    serieReview.innerHTML = `<div>
   
    ${reviewData.results
        .map((review) => {
        const localRepliesForThisReview = localReplies[review.id] || [];
        return `
         <h4 class="text-amber-500 text-2xl font-bold my-8 pl-12 border-t ">Commentaires</h4>
          ${createUserCommentInput(serieId, "serie")}
          ${userCommentsHTML}
          <div id="review-${review.id}" class="ml-2 mb-2 border-b border-gray-700 pb-2">
            <p class="font-bold text-amber-500">${review.author}</p>
            <p>${review.content}</p>
            
            <div class="replies-container">
                ${localRepliesForThisReview
            .map((reply) => `
                    <div class="ml-8 mt-2 p-2 bg-gray-800 rounded border-l-2 border-amber-500">
                        <p class="text-xs text-amber-500">Localuser:</p>
                        <p>${reply}</p>
                    </div>
                `)
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
        const target = e.target;
        if (target.tagName === "BUTTON" && target.id.startsWith("button-")) {
            const reviewId = target.id.replace("button-", "");
            const input = document.getElementById(`input-${reviewId}`);
            if (input && input.value.trim() !== "") {
                handleReply(reviewId, input.value);
                input.value = "";
            }
        }
    });
    const favoriteButton = document.getElementById("add-favorite-button");
    favoriteButton?.addEventListener("click", (e) => {
        changeLocalSerieFavorites(data);
        if (isFavoriteSerie(data.id)) {
            favoriteButton.textContent = "Rétirer favori";
            favoriteButton.className =
                "border border-black p-2 rounded-2xl bg-red-800";
        }
        else {
            favoriteButton.textContent = "Ajouter favori";
            favoriteButton.className =
                "border border-black p-2 rounded-2xl bg-green-800";
        }
    });
    mainElement.append(serieReview);
    const submitBtn = document.getElementById("submit-user-comment");
    submitBtn?.addEventListener("click", () => {
        const textarea = document.getElementById("user-new-comment");
        const content = textarea.value.trim();
        if (content) {
            const storageKey = `serie-comments-${serieId}`;
            const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
            const newComment = {
                content: content,
                date: new Date().toLocaleDateString("fr-FR"),
                id: Date.now(),
            };
            existing.unshift(newComment);
            localStorage.setItem(storageKey, JSON.stringify(existing));
            window.location.reload();
        }
    });
    initSearch("series");
}
function createUserCommentInput(id, type) {
    return `
    <div class="bg-gray-800/50 p-6 rounded-xl mb-10 border border-gray-700">
      <h4 class="text-amber-500 text-xl font-bold mb-4">Laissez un avis</h4>
      <textarea id="user-new-comment" 
                class="w-full bg-gray-200 text-black p-3 rounded-lg border border-gray-600 focus:border-amber-500 outline-none h-24" 
                placeholder="Qu'avez-vous pensé de ce ${type === "movie" ? "film" : "série"} ?"></textarea>
      <button id="submit-user-comment" 
              class="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
        Publier l'avis
      </button>
    </div>
  `;
}
retrieveMovie();
retrieveSerie();
//# sourceMappingURL=details.js.map