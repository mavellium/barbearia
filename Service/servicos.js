import API_URL from "../API_URL.js";

document.addEventListener("DOMContentLoaded", () => {
  carregarServicos();
  carregarProdutos();  
});

async function carregarProdutos() {
  try {
    const response = await fetch(`${API_URL}/produtos`);
    if (!response.ok) throw new Error("Erro ao buscar produtos");

    const produtos = await response.json();
    const grid = document.getElementById("productsGrid");

    grid.innerHTML = ""; // limpa antes de renderizar

    produtos.forEach((produto, index) => {
      const avaliacao = produto.avaliacao ?? 5;
      const preco = produto.preco ?? 0;
      const imagem = produto.imagens[0]?.url || "https://placehold.co/600x400?text=Lipe+Cortes";

      const card = document.createElement("div");
      card.className = "product-card animate-fade-in";
      card.style.animationDelay = `${index * 100}ms`;

      card.innerHTML = `
        <div class="product-image-wrapper">
          <img src="${imagem}" alt="${produto.nome}" class="product-image" />
          ${produto.destaque ? `<span class="badge badge-featured">Destaque</span>` : ""}
          <div class="product-overlay"></div>
        </div>
        <div class="product-content">
          <div class="product-rating">
            ${renderStars(avaliacao)}
            <span class="rating-text">(${avaliacao.toFixed(1)})</span>
          </div>
          <h3 class="product-title">${produto.nome}</h3>
          <p class="product-description">${produto.descricao}</p>
          <div class="product-pricing">
            <span class="product-price">${Number(produto.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          </div>
          <button class="btn-hero btn-full-width" onclick="showProductOrderModal('${produto.nome}', ${preco}, ${produto.id})">
            <i data-lucide="shopping-cart" class="btn-icon"></i>
            Comprar Agora
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    lucide.createIcons();
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

function renderStars(nota = 5) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i data-lucide="star" class="star-icon ${i <= nota ? "star-filled" : "star-empty"}"></i>`;
  }
  return stars;
}

async function carregarServicos() {
  const servicesGrid = document.querySelector(".services-grid");

  fetch(`${API_URL}/servicos`)
    .then(res => {
      if (!res.ok) throw new Error("Erro na API");
      return res.json();
    })
    .then(servicos => {
      servicesGrid.innerHTML = ""; // limpa os serviços estáticos
      servicos.forEach((servico, index) => {
        const card = document.createElement("div");
        card.className = "service-card animate-fade-in";
        card.style.animationDelay = `${index * 150}ms`;

        card.innerHTML = `
          <div class="service-image-wrapper">
            <img src="${servico.imagem || 'https://placehold.co/600x400?text=Lipe+Cortes'}" alt="${servico.nome}" class="service-image" />
            <div class="service-overlay"></div>
          </div>
          <div class="service-content">
            <div class="service-details">
              <h3 class="service-title">${servico.nome}</h3>
              <div class="service-pricing">
                <p class="service-price">
                  ${Number(servico.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <p class="service-duration">
                  <i data-lucide="clock" class="service-icon"></i>${servico.duracao}m
                </p>
              </div>
            </div>
            <p class="service-description">${servico.descricao}</p>
            <a href="dashboard.html"><button class="btn-hero btn-full-width" onclick="showAppointmentModal('${servico.nome}')">
              <i data-lucide="calendar" class="btn-icon"></i>
              Agendar Agora
            </button></a>
          </div>
        `;

        servicesGrid.appendChild(card);
      });

      // re-render icons do Lucide
      lucide.createIcons();
    })
    .catch(err => console.error("Erro ao carregar serviços:", err));
}