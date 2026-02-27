(function () {
    'use strict';

    const products = window.ARIVINE_PRODUCTS || [];

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // --- Cart Management ---
    const CART_KEY = 'ARIVINE_CART';

    function getCart() {
        const stored = localStorage.getItem(CART_KEY);
        try {
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse cart', e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
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

    function addToCart(product, size, color, quantity = 1) {
        const cart = getCart();
        const existingIndex = cart.findIndex(item =>
            item.slug === product.slug &&
            item.size === size &&
            item.color === color
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
        } else {
            cart.push({
                id: Date.now(),
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                color: color,
                quantity: quantity
            });
        }
        saveCart(cart);
    }

    function productCardMarkup(product) {
        return `
            <article class="product-card">
                <a href="product.html?slug=${encodeURIComponent(product.slug)}" class="product-link" aria-label="View ${escapeHtml(product.name)}">
                    <div class="product-image-wrap">
                        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}" class="product-image" loading="lazy">
                    </div>
                    <div class="product-content">
                        <p class="product-line">${escapeHtml(product.line)}</p>
                        <h2 class="product-name">${escapeHtml(product.name)}</h2>
                        <p class="product-price">${escapeHtml(product.price)}</p>
                        <p class="product-description">${escapeHtml(product.shortDescription)}</p>
                    </div>
                </a>
            </article>
        `;
    }

    function initCollectionPage() {
        const toolbar = document.getElementById('collection-toolbar');
        const grid = document.getElementById('product-grid');
        const count = document.getElementById('result-count');

        if (!toolbar || !grid || !count) {
            return;
        }

        const lines = Array.from(new Set(products.map(product => product.line)));
        const filters = ['All'].concat(lines);
        let activeFilter = 'All';

        function renderFilters() {
            const buttons = filters.map(filter => {
                const activeClass = filter === activeFilter ? 'active' : '';
                return `<button class="filter-button ${activeClass}" data-filter="${escapeHtml(filter)}">${escapeHtml(filter)}</button>`;
            }).join('');

            toolbar.innerHTML = `<div class="filter-list">${buttons}</div>`;
        }

        function renderProducts() {
            const filtered = activeFilter === 'All'
                ? products
                : products.filter(product => product.line === activeFilter);

            grid.innerHTML = filtered.map(productCardMarkup).join('');
            count.textContent = `${filtered.length} Product${filtered.length === 1 ? '' : 's'}`;
        }

        renderFilters();
        renderProducts();

        toolbar.addEventListener('click', event => {
            const button = event.target.closest('.filter-button');

            if (!button) {
                return;
            }

            activeFilter = button.getAttribute('data-filter') || 'All';
            renderFilters();
            renderProducts();
        });
    }

    function initProductPage() {
        const detailContainer = document.getElementById('product-detail');

        if (!detailContainer) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');
        const selected = products.find(product => product.slug === slug) || products[0];

        if (!selected) {
            detailContainer.innerHTML = `
                <section class="empty-state">
                    <h1 class="catalog-title">No products available</h1>
                    <p class="catalog-subtitle">Please add products to <code>products.js</code>.</p>
                </section>
            `;
            return;
        }

        const detailsList = selected.details
            .map(item => `<li>${escapeHtml(item)}</li>`)
            .join('');

        const sizeOptions = (selected.availableSizes || [])
            .map(size => `<button class="option-btn size-btn" data-size="${escapeHtml(size)}">${escapeHtml(size)}</button>`)
            .join('');

        const colorOptions = (selected.availableColors || [])
            .map(color => `<button class="option-btn color-btn" data-color="${escapeHtml(color)}">${escapeHtml(color)}</button>`)
            .join('');

        detailContainer.innerHTML = `
            <div class="product-detail-image-wrap">
                <img src="${escapeHtml(selected.image)}" alt="${escapeHtml(selected.alt)}" class="product-detail-image">
            </div>
            <div class="product-detail-content">
                <a href="collection.html" class="back-link">← Back to collection</a>
                <p class="product-line">${escapeHtml(selected.line)}</p>
                <h1 class="detail-title">${escapeHtml(selected.name)}</h1>
                <p class="detail-price">${escapeHtml(selected.price)}</p>
                <p class="detail-copy">${escapeHtml(selected.description)}</p>
                
                <div class="selectors">
                    <div class="selector-group">
                        <label class="selector-label">Size</label>
                        <div class="option-grid">${sizeOptions}</div>
                    </div>
                    <div class="selector-group">
                        <label class="selector-label">Color</label>
                        <div class="option-grid">${colorOptions}</div>
                    </div>
                    <div class="selector-group">
                        <label class="selector-label">Quantity</label>
                        <div class="quantity-control">
                            <button class="qty-btn" id="qty-minus">-</button>
                            <span id="qty-value" class="qty-value">1</span>
                            <button class="qty-btn" id="qty-plus">+</button>
                        </div>
                    </div>
                </div>

                <button id="add-to-cart-btn" class="add-to-cart-btn" disabled>Select Size & Color</button>

                <div class="detail-meta">
                    <div class="detail-meta-row"><span class="detail-meta-label">Sizes</span><span>${escapeHtml(selected.sizeRange)}</span></div>
                    <div class="detail-meta-row"><span class="detail-meta-label">Care</span><span>${escapeHtml(selected.care)}</span></div>
                </div>
                <ul class="detail-list">${detailsList}</ul>
            </div>
        `;

        // Selection Logic
        let selectedSize = null;
        let selectedColor = null;
        let quantity = 1;
        const addBtn = document.getElementById('add-to-cart-btn');
        const qtyValue = document.getElementById('qty-value');

        detailContainer.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                detailContainer.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedSize = btn.dataset.size;
                updateAddBtnState();
            });
        });

        detailContainer.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                detailContainer.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedColor = btn.dataset.color;
                updateAddBtnState();
            });
        });

        document.getElementById('qty-plus').addEventListener('click', () => {
            quantity++;
            qtyValue.textContent = quantity;
        });

        document.getElementById('qty-minus').addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                qtyValue.textContent = quantity;
            }
        });

        function updateAddBtnState() {
            if (selectedSize && selectedColor) {
                const cart = getCart();
                const existing = cart.find(item =>
                    item.slug === selected.slug &&
                    item.size === selectedSize &&
                    item.color === selectedColor
                );

                if (existing) {
                    addBtn.disabled = false;
                    addBtn.textContent = `In Cart (Qty: ${existing.quantity || 1}) — Add More`;
                } else {
                    addBtn.disabled = false;
                    addBtn.textContent = 'Add to Cart';
                }
            } else {
                addBtn.disabled = true;
                addBtn.textContent = 'Select Size & Color';
            }
        }

        addBtn.addEventListener('click', () => {
            addToCart(selected, selectedSize, selectedColor, quantity);

            // Temporary feedback
            const originalText = addBtn.textContent;
            addBtn.textContent = 'Added to Cart';
            addBtn.classList.add('success');

            setTimeout(() => {
                addBtn.classList.remove('success');
                updateAddBtnState();
            }, 2000);
        });

        const relatedGrid = document.getElementById('related-grid');

        if (relatedGrid) {
            const related = products.filter(product => product.slug !== selected.slug).slice(0, 3);
            relatedGrid.innerHTML = related.map(productCardMarkup).join('');
        }

        document.title = `ARIVINE — ${selected.name}`;
    }

    function init() {
        const page = document.body.dataset.page;

        if (page === 'collection') {
            initCollectionPage();
        }

        if (page === 'product') {
            initProductPage();
        }

        updateNavCartCount();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
