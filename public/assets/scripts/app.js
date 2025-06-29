// MENU RESPONSIVO
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

// SCROLL REVEAL CONFIGURAÇÕES
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__container h1", scrollRevealOption);
ScrollReveal().reveal(".header__container p", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".header__container form", { ...scrollRevealOption, delay: 1000 });
ScrollReveal().reveal(".feature__card", { duration: 1000, interval: 500 });
ScrollReveal().reveal(".destination__card", { ...scrollRevealOption, interval: 500 });
ScrollReveal().reveal(".package__card", { ...scrollRevealOption, interval: 500 });

// SWIPER PARA CLIENTES
const swiper = new Swiper('.clientSwiper', {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    320: { slidesPerView: 1, spaceBetween: 10 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 30 },
  }
});

// CARREGAR USUÁRIOS DO JSONSERVER
async function carregarUsuarios() {
  const res = await fetch("http://localhost:3000/usuarios");
  const usuarios = await res.json();
  const wrapper = document.getElementById("user-slider-wrapper");

  wrapper.innerHTML = usuarios.map(user => `
    <div class="swiper-slide">
      <div class="client__card">
        <img src="${user.image}" alt="${user.name}" />
        <span><i class="ri-double-quotes-l"></i></span>
        <p>${user.review || "Nenhuma avaliação disponível."}</p>
        <h4>${user.name}</h4>
        <h5>${user.profession || user.description || ""}</h5>
      </div>
    </div>
  `).join("");

  new Swiper(".clientSwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }
  });
}

carregarUsuarios();

// CARREGAR DESTAQUES
async function carregarDestaques() {
  try {
    const res = await fetch("http://localhost:3000/destinos?destaque=true");
    const destaques = await res.json();
    const carouselInner = document.getElementById("carousel-inner-destaques");

    if (!carouselInner) return;

    if (destaques.length === 0) {
      carouselInner.innerHTML = `<div class="text-center">Nenhum item em destaque encontrado.</div>`;
      return;
    }

    carouselInner.innerHTML = destaques.map((item, index) => `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <a href="detalhes.html?destino=${encodeURIComponent(item.nome)}" style="text-decoration: none; color: inherit;">
          <img src="${item.imagem}" class="d-block w-100" alt="${item.nome}">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
            <h5>${item.nome}</h5>
            <p>${item.descricao}</p>
          </div>
        </a>
      </div>
    `).join("");
  } catch (error) {
    console.error("Erro ao carregar destaques:", error);
  }
}

carregarDestaques();

// TROCA SUAVE DO BACKGROUND DO HEADER
const imagensHeader = [
  "assets/img/header.jpg",
  "assets/img/header2.jpg",
  "assets/img/header3.jpg"
];

let indexAtual = 0;
const headerElement = document.querySelector(".header");

function trocarImagemDeFundo() {
  headerElement.style.backgroundImage = `
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url('${imagensHeader[indexAtual]}')
  `;
  indexAtual = (indexAtual + 1) % imagensHeader.length;
}

trocarImagemDeFundo();
setInterval(trocarImagemDeFundo, 5000);

// ========== LOGIN / LOGOUT DINÂMICO ==========
function getUsuarioLogado() {
  return JSON.parse(sessionStorage.getItem("usuarioLogado"));
}

function setUsuarioLogado(usuario) {
  sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
}

function logout() {
  sessionStorage.removeItem("usuarioLogado");
  window.location.reload();
}

function atualizarMenu() {
  const usuario = getUsuarioLogado();
  const loginLogoutItem = document.getElementById("loginLogoutItem");
  const favoritosItem = document.getElementById("favoritosItem");

  if (!loginLogoutItem) return;

  if (usuario) {
    loginLogoutItem.innerHTML = `<a href="#" id="logoutLink">Logout</a>`;
    favoritosItem && (favoritosItem.style.display = "inline");

    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    loginLogoutItem.innerHTML = `<a href="login.html">Login</a>`;
    favoritosItem && (favoritosItem.style.display = "none");
  }
}

// ========== FAVORITOS ==========
function atualizarFavoritosNaTela() {
  const usuario = getUsuarioLogado();
  if (!usuario) return;

  const favoritos = usuario.favoritos || [];
  const icones = document.querySelectorAll(".favorite-icon");

  icones.forEach((icone) => {
    const parent = icone.closest(".destination__card, .package__card");
    const destinoEl = parent.querySelector("h4, .destination__content");
    const destino = destinoEl?.innerText?.trim();

    if (!destino) return;

    if (favoritos.includes(destino)) {
      icone.classList.remove("ri-heart-line");
      icone.classList.add("ri-heart-fill");
    } else {
      icone.classList.add("ri-heart-line");
      icone.classList.remove("ri-heart-fill");
    }

    icone.addEventListener("click", () => {
      let user = getUsuarioLogado();
      if (!user) {
        alert("Você precisa estar logado para favoritar.");
        return;
      }

      const favs = user.favoritos || [];
      if (favs.includes(destino)) {
        user.favoritos = favs.filter(d => d !== destino);
      } else {
        user.favoritos.push(destino);
      }

      setUsuarioLogado(user);
      atualizarFavoritosNaTela();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarMenu();
  atualizarFavoritosNaTela();
});
