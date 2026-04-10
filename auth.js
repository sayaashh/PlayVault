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

// ===== SIGNUP =====
function signup() {
  showToast("✅ Account created! You can now login.");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}

// ===== LOGIN =====
function login() {
  const username = document.getElementById("username")?.value;
  const password = document.getElementById("password")?.value;

  if (username === "bob" && password === "bobpass") {
    localStorage.setItem("loggedIn", "true");

    showToast("✅ Login successful");

    setTimeout(() => {
      window.location.replace("index.html");
    }, 500);
  } else {
    showToast("❌ Invalid login");
  }
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}
