(function () {
    'use strict';

    const CART_KEY = 'ARIVINE_CART';

    function getCart() {
        const stored = localStorage.getItem(CART_KEY);
        try {
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateNavCartCount();
    }

    function updateNavCartCount() {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const countEl = document.getElementById('cart-count');
        if (countEl) {
            countEl.textContent = `(${count})`;
        }
    }

    function renderCart() {
        const cart = getCart();
        const container = document.getElementById('cart-items');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<p style="opacity: 0.5;">Your cart is currently empty.</p>';
            subtotalEl.textContent = '₹0';
            totalEl.textContent = '₹0';
            updateNavCartCount();
            return;
        }

        container.innerHTML = cart.map((item, index) => {
            const qty = item.quantity || 1;
            const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''));
            const itemTotal = priceNum * qty;
            const formattedItemTotal = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(itemTotal);

            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <div class="cart-item-meta">${item.size} | ${item.color} | Qty: ${qty}</div>
                        <div class="cart-item-price">${item.price} (Total: ${formattedItemTotal})</div>
                    </div>
                </div>
            `;
        }).join('');

        const total = cart.reduce((sum, item) => {
            const price = parseInt(item.price.replace(/[^0-9]/g, ''));
            return sum + (price * (item.quantity || 1));
        }, 0);

        const formattedTotal = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(total);

        subtotalEl.textContent = formattedTotal;
        totalEl.textContent = formattedTotal;
        updateNavCartCount();
    }

    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = document.querySelector('.complete-order-btn');
            btn.textContent = 'Processing...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                localStorage.removeItem(CART_KEY);
                alert('Thank you for your order. An ARIVINE specialist will contact you shortly to confirm your private commission.');
                window.location.href = 'index.html';
            }, 2500);
        });
    }

    renderCart();
})();
