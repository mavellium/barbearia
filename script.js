// script.js (substitua seu arquivo por este)
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = "http://192.168.0.107:3000"; // <- ajuste se mudar de host/porta

    /* ========== Header scroll (safe) ========== */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('backdrop-luxury', 'border-b', 'border-border/20');
            } else {
                header.classList.remove('backdrop-luxury', 'border-b', 'border-border/20');
            }
        });
    }

    /* ========== Mobile menu (safe) ========== */
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
                lucide.createIcons();
            }
        });
    }

    /* ========== Smooth scrolling ========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });

    /* ========== Safe modal helpers ========== */
    window.showModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return console.warn('Modal não encontrado:', modalId);
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    window.hideModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return console.warn('Modal não encontrado:', modalId);
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    /* ========== Appointment modal logic (guarded) ========== */
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentSuccess = document.getElementById('appointment-success');
    const serviceNameInput = document.getElementById('appointment-service-name');
    const timeSelect = document.getElementById('appointment_time');

    if (timeSelect) {
        for (let hour = 8; hour <= 17; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            }
        }
    }

    window.showAppointmentModal = function (serviceName = 'Consulta') {
        if (serviceNameInput) serviceNameInput.value = serviceName;
        showModal('appointment-modal');
    };

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const payload = {
                service: serviceNameInput?.value || '',
                date: document.getElementById('appointment_date')?.value || '',
                time: timeSelect?.value || '',
                name: document.getElementById('client_name')?.value || '',
                phone: document.getElementById('client_phone')?.value || '',
                notes: document.getElementById('notes')?.value || ''
            };
            console.log('Form submitted:', payload);

            appointmentForm.classList.add('hidden');
            if (appointmentSuccess) appointmentSuccess.classList.remove('hidden');

            setTimeout(() => {
                hideModal('appointment-modal');
                appointmentForm.classList.remove('hidden');
                if (appointmentSuccess) appointmentSuccess.classList.add('hidden');
            }, 2000);
        });
    }

    /* ========== Product order modal (guarded) ========== */
    const productOrderForm = document.getElementById('product-order-form');
    const orderSuccess = document.getElementById('order-success');
    const orderProductName = document.getElementById('order-product-name');
    const orderProductPrice = document.getElementById('order-product-price');

    window.showProductOrderModal = function (productName, productPrice) {
        if (orderProductName) orderProductName.textContent = productName;
        if (orderProductPrice) orderProductPrice.textContent = `R$ ${Number(productPrice).toFixed(2)}`;
        showModal('product-order-modal');
    };

    if (productOrderForm) {
        productOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const payload = {
                product: orderProductName?.textContent || '',
                price: orderProductPrice?.textContent || '',
                name: document.getElementById('order-client-name')?.value || '',
                phone: document.getElementById('order-client-phone')?.value || '',
                address: document.getElementById('order-client-address')?.value || ''
            };
            console.log('Order submitted:', payload);

            productOrderForm.classList.add('hidden');
            if (orderSuccess) orderSuccess.classList.remove('hidden');

            setTimeout(() => {
                hideModal('product-order-modal');
                productOrderForm.classList.remove('hidden');
                if (orderSuccess) orderSuccess.classList.add('hidden');
            }, 2000);
        });
    }

    /* ========== Carregar produtos (safe fetch e DOM creation) ========== */
    async function carregarProdutos() {
        const grid = document.getElementById('productsGrid');
        if (!grid) {
            // não existe na página atual — ignora silenciosamente
            return;
        }

        try {
            const res = await fetch(`https://lipes-cortes.vercel.app/api/produtos`);
            if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`);
            const produtos = await res.json();

            grid.innerHTML = ''; // limpa

            // cria cards de forma segura (textContent)
            produtos.forEach(produto => {
                const card = document.createElement('div');
                card.className = 'product-card animate-fade-in';

                // imagem
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'product-image-wrapper';
                const img = document.createElement('img');
                img.className = 'product-image';
                img.src = produto.imagem || 'https://via.placeholder.com/300';
                img.alt = produto.nome || 'Produto';
                imgWrapper.appendChild(img);

                // conteúdo
                const content = document.createElement('div');
                content.className = 'product-content';
                const title = document.createElement('h3');
                title.className = 'product-title';
                title.textContent = produto.nome || 'Sem nome';
                const desc = document.createElement('p');
                desc.className = 'product-description';
                desc.textContent = produto.descricao || '';
                const price = document.createElement('p');
                price.className = 'product-price';
                price.textContent = `R$ ${Number(produto.preco || 0).toFixed(2)}`;

                const btn = document.createElement('button');
                btn.className = 'btn-hero btn-full-width';
                btn.type = 'button';
                btn.innerHTML = `<i data-lucide="shopping-cart" class="btn-icon"></i> Comprar`;
                btn.addEventListener('click', () => showProductOrderModal(produto.nome, produto.preco));

                content.appendChild(title);
                content.appendChild(desc);
                content.appendChild(price);
                content.appendChild(btn);

                card.appendChild(imgWrapper);
                card.appendChild(content);

                grid.appendChild(card);
            });

            // atualiza ícones (apenas se lucide estiver disponível)
            if (window.lucide?.createIcons) lucide.createIcons();
        } catch (err) {
            console.error(err);
            grid.innerHTML = '<p>Erro ao carregar produtos. Verifique se a API está online e se o CORS está configurado.</p>';
        }
    }

    // rodar carregamento de produtos (se existir a seção)
    carregarProdutos();

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
                    <img src="${servico.imagem || 'https://via.placeholder.com/300'}" 
                         alt="${servico.nome}" 
                         class="service-image" />
                    ${servico.popular ? `<span class="badge badge-popular">
                        <i data-lucide="star" class="badge-icon"></i>Mais Pedido
                    </span>` : ''}
                    <div class="service-overlay"></div>
                </div>
                <div class="service-content">
                    <div class="service-details">
                        <h3 class="service-title">${servico.nome}</h3>
                        <div class="service-pricing">
                            <p class="service-price">R$ ${servico.preco.toFixed(2)}</p>
                            <p class="service-duration">
                                <i data-lucide="clock" class="service-icon"></i>${servico.duracao || ''}
                            </p>
                        </div>
                    </div>
                    <p class="service-description">${servico.descricao || ''}</p>
                    <button class="btn-hero btn-full-width" onclick="showAppointmentModal('${servico.nome}')">
                        <i data-lucide="calendar" class="btn-icon"></i>
                        Agendar Agora
                    </button>
                </div>
            `;

                grid.appendChild(card);
            });

            lucide.createIcons(); // atualiza os ícones dinâmicos
        } catch (err) {
            console.error(err);
            grid.innerHTML = "<p>Erro ao carregar serviços.</p>";
        }
    }

    document.addEventListener("DOMContentLoaded", carregarServicos);

});
