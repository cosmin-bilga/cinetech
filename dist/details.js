import { getMovieDetail, getSerieDetail, 
//getMovieReviews,
getSerieReviews, } from "./utils/api.js";
import { getCurrentId } from "./utils/functions.js";
import { BASE_IMAGE_URL } from "./config/config.js";
async function retrieveMovie() {
    const mainElement = document.getElementById("main");
    if (!mainElement) {
        //console.error("Main not found");
        return;
    }
    const movieId = getCurrentId();
    if (movieId === -1) {
        mainElement.innerHTML = "Movie not found";
    }
    const data = await getMovieDetail(getCurrentId());
    mainElement.className = "bg-linear-to-br from-gray-900 to-gray-800";
    mainElement.innerHTML = `
  <div class="">
    <h2 class="text-center text-3xl text-amber-500">${data.title}</h2>
    <img src=${BASE_IMAGE_URL + "w500" + data.poster_path} />
  </div>
  <div class="flex flex-col mx-2 justify-around text-amber-100">
    <div>
      <h2 class="hidden">Titre: ${data.title}</h2>
      <h3>Pays d'origine: ${data.production_countries.map((country) => country.name).join(" ") || "Pays non spécifié"}</h3>
      <p>Durée: ${data.runtime}
      <p>Date de sortie: ${data.release_date}</p>
    </div>
    <div>
      <h5>Synopsis</h5>
      <p>${data.overview}</p>
    <div>
    <div class="flex justify-between">
      <p>Note moyenne: ${data.vote_average.toPrecision(2)}</p>
      <button class="border border-black p-2 rounded-2xl bg-gray-700">Ajouter aux favoris</button>
    </div>
  </div>
  `;
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
    const data = await getSerieDetail(getCurrentId());
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
    <div class="flex justify-between">
      <p>Note moyenne: ${data.vote_average.toPrecision(2)}</p>
      <button class="border border-black p-2 rounded-2xl bg-gray-700">Ajouter aux favoris</button>
    </div>
  </div>
  `;
    mainElement.append(serieInfo);
    const reviewData = await getSerieReviews(data.id);
    console.log(reviewData);
    const localReplies = JSON.parse(localStorage.getItem("replies") || "{}");
    const serieReview = document.createElement("div");
    // Event listener pour les boutons reponse
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
                input.value = ""; // Efface l'input après envoi
            }
        }
    });
    function handleReply(reviewId, content) {
        const targetDiv = document.getElementById(`review-${reviewId}`);
        const replyDiv = document.createElement("div");
        replyDiv.className =
            "ml-8 mt-2 p-2 bg-gray-800 rounded border-l-2 border-amber-500";
        replyDiv.innerHTML = `<p class="text-xs text-amber-500">Moi (Réponse):</p><p>${content}</p>`;
        targetDiv?.appendChild(replyDiv);
        saveLocalReply(reviewId, content);
    }
    function saveLocalReply(reviewId, content) {
        const allReplies = JSON.parse(localStorage.getItem("replies") || "{}");
        if (!allReplies[reviewId]) {
            allReplies[reviewId] = [];
        }
        allReplies[reviewId].push(content);
        localStorage.setItem("replies", JSON.stringify(allReplies));
    }
    mainElement.append(serieReview);
    const reviewButton = document.getElementById("button-" + reviewData.id);
    const reviewInput = document.getElementById("input-" + reviewData.id);
}
retrieveMovie();
retrieveSerie();
//# sourceMappingURL=details.js.map