if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

// ===== NAVBAR =====
function updateNavbar() {
  const nav = document.getElementById("nav-links");

  if (!nav) return;

  if (localStorage.getItem("loggedIn") === "true") {
    nav.innerHTML = `
      <a href="dashboard.html" class="nav-btn">Favorites</a>
      <a href="#" onclick="logout()" class="nav-btn">Logout</a>
    `;
  } else {
    nav.innerHTML = `
      <a href="login.html" class="nav-btn">Login</a>
    `;
  }
}

updateNavbar();

// ===== GLOBAL VARIABLES =====
const API_KEY = "0fc615af2f92442e998e02cc855c9fa9";
const container = document.getElementById("game-list");
const modal = document.getElementById("modal");
const video = document.getElementById("video");

let allGames = [];

// ===== FETCH GAMES =====
let currentPage = 1;
const MAX_PAGES = 3;

function loadGames(page = 1) {
  const loader = document.getElementById("loader");

  loader.style.display = "block";
  container.innerHTML = "";

  fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=12`,
  )
    .then((res) => res.json())
    .then((data) => {
      allGames = data.results;
      displayGames(allGames);

      loader.style.display = "none";
      updateButtons();
    });
}

// initial load
loadGames(currentPage);

// ===== DISPLAY GAMES =====
function displayGames(games) {
  container.innerHTML = "";

  games.forEach((game) => {
    container.innerHTML += `
      <div class="game-card" onclick="goToGame(${game.id})">
        <img src="${game.background_image}" />

        <div class="game-info">
          <h3>${game.name}</h3>
          <p>⭐ ${game.rating}</p>

          <button onclick="event.stopPropagation(); addToFavorites(${game.id})">
            ❤️ Favorite
          </button>
        </div>
      </div>
    `;
  });
}

// ===== TRAILER MODAL =====
function openTrailer(link) {
  modal.style.display = "flex";
  video.src = `https://www.youtube.com/embed?search=${link}`;
}

modal.addEventListener("click", () => {
  modal.style.display = "none";
  video.src = "";
});

// ===== AUTH =====
function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

function logout() {
  localStorage.removeItem("loggedIn");
  location.reload();
}

// ===== FAVORITES =====
function addToFavorites(gameId) {
  if (!isLoggedIn()) {
    showToast("⚠️ Please login to add favorites");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);

    return;
  }

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const game = allGames.find((g) => g.id === gameId);

  if (!favorites.some((g) => g.id === gameId)) {
    favorites.push(game); // ✅ store full object
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showToast("❤️ Added to favorites!");
  } else {
    showToast("Already in favorites");
  }
}

// ===== SEARCH =====
const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = allGames.filter((game) =>
      game.name.toLowerCase().includes(value),
    );

    displayGames(filtered);
  });
}

function showToast(message) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  container.appendChild(toast);

  // Remove after 2.5s
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

function nextPage() {
  if (currentPage < MAX_PAGES) {
    currentPage++;
    loadGames(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadGames(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function updateButtons() {
  document.querySelector(".prev-btn").disabled = currentPage === 1;
  document.querySelector(".next-btn").disabled = currentPage === MAX_PAGES;
}

function goToGame(id) {
  window.location.href = `game.html?id=${id}`;
}
