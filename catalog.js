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
                <div class="detail-meta">
                    <div class="detail-meta-row"><span class="detail-meta-label">Sizes</span><span>${escapeHtml(selected.sizeRange)}</span></div>
                    <div class="detail-meta-row"><span class="detail-meta-label">Care</span><span>${escapeHtml(selected.care)}</span></div>
                </div>
                <ul class="detail-list">${detailsList}</ul>
            </div>
        `;

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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
