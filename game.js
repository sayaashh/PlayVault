const API_KEY = "0fc615af2f92442e998e02cc855c9fa9";

const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

const container = document.getElementById("game-details");

// ===== FETCH GAME DETAILS =====
fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`)
  .then((res) => res.json())
  .then((game) => {
    container.innerHTML = `
      <div class="details-container">

        <img src="${game.background_image}" class="details-img" />

        <button id="favorite-btn" class="nav-btn">❤️ Add to Favorites</button>

        <div class="details-info">
          <h1>${game.name}</h1>

          <p>⭐ ${game.rating}</p>

          <p class="description">
            ${game.description_raw || "No description available."}
          </p>
        </div>

      </div>

      <div id="trailer"></div>
    `;

    // ===== FAVORITE BUTTON LOGIC =====
    const favoriteBtn = document.getElementById("favorite-btn");

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // If already favorited
    if (favorites.some((g) => g.id == game.id)) {
      favoriteBtn.textContent = "✅ Added";
    }

    favoriteBtn.addEventListener("click", () => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (favorites.some((g) => g.id == game.id)) {
        showToast("Already in favorites");
        return;
      }

      const gameData = {
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
      };

      favorites.push(gameData);
      localStorage.setItem("favorites", JSON.stringify(favorites));

      favoriteBtn.textContent = "✅ Added";
      showToast("❤️ Added to favorites!");
    });

    // Load trailer
    loadTrailer(gameId);
  });

// ===== TRAILER =====
function loadTrailer(id) {
  fetch(`https://api.rawg.io/api/games/${id}/movies?key=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
      const trailerDiv = document.getElementById("trailer");

      if (data.results.length > 0) {
        const video = data.results[0].data.max;

        trailerDiv.innerHTML = `
          <h2>Trailer</h2>
          <video controls width="100%">
            <source src="${video}" type="video/mp4">
          </video>
        `;
      } else {
        trailerDiv.innerHTML = `<p>No trailer available</p>`;
      }
    });
}

// ===== BACK BUTTON =====
function goBack() {
  window.history.back();
}

// ===== TOAST =====
function showToast(message) {
  const container = document.getElementById("toast-container");

  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
