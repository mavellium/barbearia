// script.js
document.addEventListener("DOMContentLoaded", () => {
  /* ================= Header Scroll ================= */
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        header.classList.add("backdrop-luxury", "border-b", "border-border/20");
      } else {
        header.classList.remove("backdrop-luxury", "border-b", "border-border/20");
      }
    });
  }

  /* ================= Mobile Menu ================= */
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      const icon = mobileMenuButton.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", mobileMenu.classList.contains("hidden") ? "menu" : "x");
        lucide.createIcons();
      }
    });
  }

  /* ================= Smooth Scroll ================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        if (mobileMenu) mobileMenu.classList.add("hidden");
      }
    });
  });

  /* ================= Modal Helpers ================= */
  window.showModal = id => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };
  window.hideModal = id => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  };

  /* ================= Agendamento ================= */
  const appointmentForm = document.getElementById("appointment-form");
  const serviceNameInput = document.getElementById("appointment-service-name");
  const timeSelect = document.getElementById("appointment_time");

  if (timeSelect) {
    for (let hour = 8; hour <= 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
      }
    }
  }

  window.showAppointmentModal = (serviceName = "Consulta") => {
    if (serviceNameInput) serviceNameInput.value = serviceName;
    showModal("appointment-modal");
  };

  if (appointmentForm) {
    appointmentForm.addEventListener("submit", e => {
      e.preventDefault();

      // 🔥 redireciona direto para dashboard
      window.location.href = "dashboard.html";
    });
  }


  /* ================= Produto - Modal de Compra ================= */
  const productOrderForm = document.getElementById("product-order-form");
  const orderSuccess = document.getElementById("order-success");
  const orderProductName = document.getElementById("order-product-name");
  const orderProductPrice = document.getElementById("order-product-price");
  const orderQuantity = document.getElementById("order-quantity");

  let selectedProduct = null;

  window.showProductOrderModal = function (nome, preco, id) {
    selectedProduct = { id, nome, preco };

    if (orderProductName) orderProductName.textContent = nome;
    if (orderProductPrice) orderProductPrice.textContent = `R$ ${Number(preco).toFixed(2)}`;
    if (orderQuantity) orderQuantity.value = 1;

    // 🔥 sempre começa no formulário
    productOrderForm.reset();
    productOrderForm.classList.remove("hidden");
    orderSuccess?.classList.add("hidden");

    showModal("product-order-modal");
  };

  if (productOrderForm) {
    productOrderForm.addEventListener("submit", async e => {
      e.preventDefault();

      // pega cookie simples
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
      }

      const clienteId = getCookie("userId");
      if (!clienteId) return (window.location = "/auth.html");

      const quantidade = Number(orderQuantity.value);

      const payload = {
        clienteId,
        itens: [
          {
            produtoId: selectedProduct.id,
            quantidade,
          }
        ]
      };

      try {
        const res = await fetch("https://lipes-cortes.vercel.app/api/vendas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao realizar compra");

        console.log("Venda registrada:", data);

        // esconde formulário e mostra sucesso
        productOrderForm.classList.add("hidden");
        orderSuccess?.classList.remove("hidden");

        document.getElementById("btn-dashboard").onclick = () => {
          window.location.href = "dashboard.html";
        };
        document.getElementById("btn-continue").onclick = () => {
          hideModal("product-order-modal");
          productOrderForm.reset();
          productOrderForm.classList.remove("hidden");
          orderSuccess?.classList.add("hidden");
        };
      } catch (err) {
        console.error(err);
        alert("Erro ao concluir a compra.");
      }
    });
  }

  /* ================= Carregar Produtos ================= */
  async function carregarProdutos() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    try {
      const res = await fetch("https://lipes-cortes.vercel.app/api/produtos");
      if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`);
      const produtos = await res.json();

      grid.innerHTML = "";
      produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "product-card animate-fade-in";

        const imgWrapper = document.createElement("div");
        imgWrapper.className = "product-image-wrapper";
        const img = document.createElement("img");
        img.className = "product-image";
        img.src = produto.imagens[0]?.url ?? "https://placehold.co/600x400?text=Lipe+Cortes";
        img.alt = produto.nome || "Produto";
        imgWrapper.appendChild(img);

        const content = document.createElement("div");
        content.className = "product-content";
        const title = document.createElement("h3");
        title.className = "product-title";
        title.textContent = produto.nome || "Sem nome";
        const desc = document.createElement("p");
        desc.className = "product-description";
        desc.textContent = produto.descricao || "";
        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = `R$ ${Number(produto.preco || 0).toFixed(2)}`;

        const btn = document.createElement("button");
        btn.className = "btn-hero btn-full-width";
        btn.type = "button";
        btn.innerHTML = `<i data-lucide="shopping-cart" class="btn-icon"></i> Comprar`;
        btn.addEventListener("click", () =>
          showProductOrderModal(produto.nome, produto.preco, produto.id)
        );

        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(price);
        content.appendChild(btn);

        card.appendChild(imgWrapper);
        card.appendChild(content);

        grid.appendChild(card);
      });

      window.lucide?.createIcons();
    } catch (err) {
      console.error(err);
      grid.innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
  }
  carregarProdutos();

  /* ================= Carregar Serviços ================= */
  async function carregarServicos() {
    const grid = document.getElementById("servicesGrid");
    if (!grid) return;
    try {
      const response = await fetch("https://lipes-cortes.vercel.app/api/servicos");
      if (!response.ok) throw new Error("Erro ao buscar serviços");
      const servicos = await response.json();
      grid.innerHTML = "";
      servicos.forEach((servico, index) => {
        const card = document.createElement("div");
        card.className = "service-card animate-fade-in";
        card.style.animationDelay = `${index * 150}ms`;
        card.innerHTML = `
          <div class="service-image-wrapper">
            <img src="${servico.imagem || "https://via.placeholder.com/300"}" 
                 alt="${servico.nome}" class="service-image" />
            ${servico.popular ? `<span class="badge badge-popular">
              <i data-lucide="star" class="badge-icon"></i>Mais Pedido
            </span>` : ""}
            <div class="service-overlay"></div>
          </div>
          <div class="service-content">
            <div class="service-details">
              <h3 class="service-title">${servico.nome}</h3>
              <div class="service-pricing">
                <p class="service-price">R$ ${servico.preco.toFixed(2)}</p>
                <p class="service-duration">
                  <i data-lucide="clock" class="service-icon"></i>${servico.duracao || ""}
                </p>
              </div>
            </div>
            <p class="service-description">${servico.descricao || ""}</p>
            <button class="btn-hero btn-full-width" onclick="showAppointmentModal('${servico.nome}')">
              <i data-lucide="calendar" class="btn-icon"></i> Agendar Agora
            </button>
          </div>`;
        grid.appendChild(card);
      });
      lucide.createIcons();
    } catch (err) {
      console.error(err);
      grid.innerHTML = "<p>Erro ao carregar serviços.</p>";
    }
  }
  carregarServicos();
});
