document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('backdrop-luxury', 'border-b', 'border-border/20');
        } else {
            header.classList.remove('backdrop-luxury', 'border-b', 'border-border/20');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuButton.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.setAttribute('data-lucide', 'menu');
        } else {
            icon.setAttribute('data-lucide', 'x');
        }
        lucide.createIcons();
    });

    // Smooth Scrolling for links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                mobileMenu.classList.add('hidden'); // Close menu after click
            }
        });
    });

    // Modals Logic
    window.showModal = function(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    window.hideModal = function(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Appointment Modal Logic
    const appointmentModal = document.getElementById('appointment-modal');
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentSuccess = document.getElementById('appointment-success');
    const serviceNameInput = document.getElementById('appointment-service-name');
    const timeSelect = document.getElementById('appointment_time');

    // Populate time slots
    for (let hour = 8; hour <= 17; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        }
    }

    window.showAppointmentModal = function(serviceName = 'Consulta') {
        serviceNameInput.value = serviceName;
        showModal('appointment-modal');
    }

    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would send the data to a backend (e.g., Supabase)
        console.log('Form submitted:', {
            service: serviceNameInput.value,
            date: document.getElementById('appointment_date').value,
            time: timeSelect.value,
            name: document.getElementById('client_name').value,
            phone: document.getElementById('client_phone').value,
            notes: document.getElementById('notes').value
        });
        
        appointmentForm.classList.add('hidden');
        appointmentSuccess.classList.remove('hidden');

        setTimeout(() => {
            hideModal('appointment-modal');
            appointmentForm.classList.remove('hidden');
            appointmentSuccess.classList.add('hidden');
        }, 2000);
    });

    // Product Order Modal Logic
    const productOrderModal = document.getElementById('product-order-modal');
    const productOrderForm = document.getElementById('product-order-form');
    const orderSuccess = document.getElementById('order-success');
    const orderProductName = document.getElementById('order-product-name');
    const orderProductPrice = document.getElementById('order-product-price');

    window.showProductOrderModal = function(productName, productPrice) {
        orderProductName.textContent = productName;
        orderProductPrice.textContent = `R$ ${productPrice.toFixed(2)}`
        showModal('product-order-modal');
    }

    productOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would send the data to a backend (e.g., Supabase)
        console.log('Order submitted:', {
            product: orderProductName.textContent,
            price: orderProductPrice.textContent,
            name: document.getElementById('order-client-name').value,
            phone: document.getElementById('order-client-phone').value,
            address: document.getElementById('order-client-address').value
        });

        productOrderForm.classList.add('hidden');
        orderSuccess.classList.remove('hidden');

        setTimeout(() => {
            hideModal('product-order-modal');
            productOrderForm.classList.remove('hidden');
            orderSuccess.classList.add('hidden');
        }, 2000);
    });
});

