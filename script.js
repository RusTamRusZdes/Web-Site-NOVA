// Страницы
const navLinks = document.querySelectorAll(".nav__link, #auth-btn");
const pages = document.querySelectorAll(".page");

function navigate(pageId) {
  pages.forEach((page) => {
    page.classList.add("hidden");
  });

  const activePage = document.getElementById(`${pageId}-page`);
  if (activePage) {
    activePage.classList.remove("hidden");
  }

  updateActiveLink(pageId);
}

function updateActiveLink(pageId) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === pageId) {
      link.classList.add("active");
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const pageId = link.getAttribute("data-page");

    if (pageId) {
      navigate(pageId);
    }
  });
});

document.getElementById("auth-btn").addEventListener("click", () => {
  navigate("auth");
});

const showLogin = document.getElementById("show-login");
const showReg = document.getElementById("show-reg");
const loginForm = document.getElementById("login-form");
const regForm = document.getElementById("register-form");

showLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  regForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

showReg?.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  regForm.classList.remove("remove", "hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.querySelector("#register-form button");
  const loginForm = document.querySelector("#login-form button");

  const regInputs = document.querySelectorAll("#register-form input");
  const loginInputs = document.querySelectorAll("#login-form input");

  // Регистрация

  regForm.addEventListener("click", () => {
    const name = regInputs[0].value;
    const email = regInputs[1].value;
    const pass = regInputs[2].value;

    if (name && email && pass.length >= 8) {
      const user = { name, email, pass };
      localStorage.setItem("user", JSON.stringify(user));

      alert("Регистрация успешна!");
      showPage("shop");
      updateProfile();
    } else {
      alert("Заполните все поля (пароль от 8 символов)!");
    }
  });

  // Вход
  loginForm.addEventListener("click", () => {
    const email = loginInputs[0].value;
    const pass = loginInputs[1].value;
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser && savedUser.email === email && savedUser.pass === pass) {
      alert(`Добро пожаловать, ${savedUser.name}!`);
      showPage("shop");
      updateProfile();
    } else {
      alert("Неверная почта или пароль!");
    }
  });

  function updateProfile() {
    const profileInfo = document.querySelector(".profile-info");
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      profileInfo.innerHTML = `
                <h3>Привет, ${savedUser.name}!</h3>
                <p>Твоя почта: ${savedUser.email}</p>
                <button class="btn btn--primary" id="logout">Выйти</button>
            `;

      document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("user");
        location.reload();
      });
    }
  }
  updateProfile();
});

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));
  document.getElementById(`${pageId}-page`).classList.remove("hidden");

  if (pageId === "cart") {
    renderCart();
  }
}

// Корзина
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  if (!cartContainer) return;

  console.log("Рисую корзину, товаров в массиве:", cart.length);

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Корзина пока пуста...</p>";
    return;
  }

  cartContainer.innerHTML = "";
  cart.forEach((item, index) => {
    cartContainer.innerHTML += `
            <div class="cart-item" style="display: flex; align-items: center; background: #fff; padding: 15px; margin-bottom: 10px; border-radius: 10px; border: 1px solid #eee;">
                <img src="${item.img}" width="50" style="margin-right: 15px;">
                <div style="flex- grow: 1;">
                    <h4 style="margin:0">${item.name}</h4>
                    <span>${item.price} x ${item.quantity}</span>
                </div>
                <button onclick="removeFromCart(${index})" style="margin-left: auto; color: red; border: none; background: none; cursor: pointer; font-size: 20px;">&times;</button>
            </div>
        `;
  });
}
function addToCart(name, price, img) {
  const existingProduct = cart.find((item) => item.name === name);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ name, price, img, quantity: 1 });
  }

  saveCart();
  updateCartCounter();
  renderCart();
  console.log("Добавлен товар:", name);
}

window.removeFromCart = function (index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCounter();
  renderCart();
};

function updateCartCounter() {
  const counterElement = document.getElementById("cart-count");
  if (counterElement) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    counterElement.innerText = total;
  }
}
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest(".product-card");
    const name = card.querySelector(".product-card__title").innerText;
    const price = card.querySelector(".price").innerText;
    const img = card.querySelector("img").src;
    addToCart(name, price, img);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCounter();
  renderCart();
});

// Рейтинг
let ratings = JSON.parse(localStorage.getItem("productRatings")) || {};

function initRatings() {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card, cardIndex) => {
    const stars = card.querySelectorAll(".star");
    const productName = card.querySelector(".product-card__title").innerText;

    if (ratings[productName]) {
      updateStars(stars, ratings[productName]);
    }

    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        const currentRating = index + 1;

        ratings[productName] = currentRating;
        localStorage.setItem("productRatings", JSON.stringify(ratings));

        updateStars(stars, currentRating);
        console.log(`Рейтинг для ${productName}: ${currentRating}`);
      });
    });
  });
}

function updateStars(stars, rating) {
  stars.forEach((star, i) => {
    if (i < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initRatings();
});
