const container = document.getElementById("favorites-list");

// Protect page
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

// ===== DISPLAY FAVORITES =====
function renderFavorites() {
  // Always sync with localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Empty state
  if (!favorites || favorites.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>🎮 No favorites yet</h3>
        <p>Start adding games to your favorites to see them here.</p>
        <a href="index.html" class="nav-btn">Browse Games</a>
      </div>
    `;
    return;
  }

  // Build UI
  let html = "";

  favorites.forEach((game) => {
    html += `
      <div class="game-card" onclick="goToGame(${game.id})">
        <img src="${game.background_image}" />

        <div class="game-info">
          <h3>${game.name}</h3>
          <p>⭐ ${game.rating}</p>

          <button onclick="event.stopPropagation(); removeFavorite(${game.id})">
            ❌ Remove
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ===== REMOVE FAVORITE =====
function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites = favorites.filter((game) => game.id !== id);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  showToast("❌ Removed from favorites");

  // Re-render UI instantly
  renderFavorites();
}

// ===== NAVIGATE TO GAME =====
function goToGame(id) {
  window.location.href = `game.html?id=${id}`;
}

// ===== TOAST =====
function showToast(message) {
  const toastContainer = document.getElementById("toast-container");

  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ===== INITIAL LOAD =====
renderFavorites();
