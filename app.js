const API_BASE_URL = "http://localhost:8000";

const list = document.querySelector("#movies-list");
const statusMessage = document.querySelector("#status-message");
const refreshButton = document.querySelector("#refresh-button");
const searchInput = document.querySelector("#search-input");
const clearSearchButton = document.querySelector("#clear-search-button");
const cardTemplate = document.querySelector("#movie-card-template");
let debounceTimer;
let requestVersion = 0;

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = ("status-message " + type).trim();
}

function renderMovies(movies, genresById) {
  list.replaceChildren();
  for (const movie of movies) {
    const card = cardTemplate.content.cloneNode(true);
    card.querySelector(".genre").textContent =
      genresById.get(movie.genre_id) || ("Жанр #" + movie.genre_id);
    card.querySelector(".title").textContent = movie.title;
    card.querySelector(".rating").textContent = movie.rating + " / 10";
    card.querySelector(".duration").textContent = movie.duration + " хв";
    list.append(card);
  }
}

function apiErrorMessage(payload) {
  return (payload && payload.error && payload.error.message) ||
    "Не вдалося отримати дані з API.";
}

function updateClearButton() {
  clearSearchButton.disabled = searchInput.value.trim() === "";
}

async function loadMovies() {
  const requestId = ++requestVersion;
  const searchQuery = searchInput.value.trim();
  const queryString = searchQuery === ""
    ? ""
    : "?search=" + encodeURIComponent(searchQuery);
  refreshButton.disabled = true;
  list.replaceChildren();
  setStatus("Завантажуємо фільми…");
  try {
    const responses = await Promise.all([
      fetch(API_BASE_URL + "/api/movies/" + queryString, { headers: { Accept: "application/json" } }),
      fetch(API_BASE_URL + "/api/genres/", { headers: { Accept: "application/json" } }),
    ]);
    const moviesResponse = responses[0];
    const genresResponse = responses[1];
    if (!moviesResponse.ok || !genresResponse.ok) {
      const failedResponse = !moviesResponse.ok ? moviesResponse : genresResponse;
      const payload = await failedResponse.json().catch(function () { return null; });
      throw new Error(apiErrorMessage(payload));
    }
    const data = await Promise.all([moviesResponse.json(), genresResponse.json()]);
    const movies = data[0];
    const genres = data[1];
    if (requestId !== requestVersion) {
      return;
    }
    const genresById = new Map(genres.map(function (genre) {
      return [genre.id, genre.name];
    }));
    if (movies.length === 0) {
      setStatus(
        searchQuery === ""
          ? "Поки що немає доданих фільмів."
          : "За вашим запитом фільмів не знайдено.",
        "empty"
      );
      return;
    }
    renderMovies(movies, genresById);
    setStatus("Знайдено фільмів: " + movies.length + ".");
  } catch (error) {
    setStatus("Помилка: " + error.message, "error");
  } finally {
    if (requestId === requestVersion) {
      refreshButton.disabled = false;
    }
  }
}

refreshButton.addEventListener("click", loadMovies);
searchInput.addEventListener("input", function () {
  updateClearButton();
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(loadMovies, 300);
});
clearSearchButton.addEventListener("click", function () {
  searchInput.value = "";
  updateClearButton();
  window.clearTimeout(debounceTimer);
  loadMovies();
});
updateClearButton();
loadMovies();
