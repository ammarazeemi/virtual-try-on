// Navigation State
let currentView = 'brands';
let selectedBrand = null;
let selectedCategory = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Logo click handler
document.querySelector('.logo').addEventListener('click', () => {
    navigateTo('brands');
});

// Modal overlay click handler
document.querySelector('.modal-overlay').addEventListener('click', closeModal);

// Initialize the application
function initApp() {
    navigateTo('brands');
}

// Navigation function
function navigateTo(view, brand = null, category = null) {
    currentView = view;
    selectedBrand = brand;
    selectedCategory = category;

    updateBreadcrumb();
    renderView();
}

// Update breadcrumb navigation
function updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    let breadcrumbHTML = '';

    if (currentView === 'brands') {
        breadcrumbHTML = `<span class="breadcrumb-item">Brands</span>`;
    } else if (currentView === 'categories') {
        breadcrumbHTML = `
            <a href="#" class="breadcrumb-item" onclick="navigateTo('brands'); return false;">Brands</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-item">${getBrandName(selectedBrand)}</span>
        `;
    } else if (currentView === 'clothes') {
        breadcrumbHTML = `
            <a href="#" class="breadcrumb-item" onclick="navigateTo('brands'); return false;">Brands</a>
            <span class="breadcrumb-separator">›</span>
            <a href="#" class="breadcrumb-item" onclick="navigateTo('categories', '${selectedBrand}'); return false;">${getBrandName(selectedBrand)}</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-item">${getCategoryName(selectedCategory)}</span>
        `;
    }

    breadcrumb.innerHTML = breadcrumbHTML;
}

// Render the current view
function renderView() {
    const contentGrid = document.getElementById('content-grid');
    const pageTitle = document.getElementById('page-title');

    // Add fade-out effect
    contentGrid.style.opacity = '0';
    pageTitle.style.opacity = '0';

    setTimeout(() => {
        if (currentView === 'brands') {
            renderBrands();
        } else if (currentView === 'categories') {
            renderCategories();
        } else if (currentView === 'clothes') {
            renderClothes();
        }

        // Fade-in effect
        contentGrid.style.transition = 'opacity 0.5s ease';
        pageTitle.style.transition = 'opacity 0.5s ease';
        contentGrid.style.opacity = '1';
        pageTitle.style.opacity = '1';
    }, 300);
}

// Render brands view
function renderBrands() {
    const pageTitle = document.getElementById('page-title');
    const contentGrid = document.getElementById('content-grid');

    pageTitle.textContent = 'Choose Your Brand';

    let html = '';
    storeData.brands.forEach(brand => {
        html += `
            <div class="card" onclick="navigateTo('categories', '${brand.id}')">
                <div class="card-content">
                    <img src="${brand.image}" alt="${brand.name}" class="card-image">
                    <h3 class="card-title">${brand.name}</h3>
                    <p class="card-description">${brand.description}</p>
                </div>
            </div>
        `;
    });

    contentGrid.innerHTML = html;
}

// Render categories view
function renderCategories() {
    const pageTitle = document.getElementById('page-title');
    const contentGrid = document.getElementById('content-grid');

    const brand = storeData.brands.find(b => b.id === selectedBrand);
    pageTitle.textContent = `${brand.name} Collections`;

    let html = '';
    brand.categories.forEach(catId => {
        const category = storeData.categories[catId];
        html += `
            <div class="card" onclick="navigateTo('clothes', '${selectedBrand}', '${catId}')">
                <div class="card-content">
                    <h3 class="card-title">${category.name}</h3>
                    <p class="card-description">${category.description}</p>
                    <span class="card-badge">Explore Collection</span>
                </div>
            </div>
        `;
    });

    contentGrid.innerHTML = html;
}

// Render clothes view
function renderClothes() {
    const pageTitle = document.getElementById('page-title');
    const contentGrid = document.getElementById('content-grid');

    const brand = getBrandName(selectedBrand);
    const category = getCategoryName(selectedCategory);

    pageTitle.textContent = `${brand} - ${category}`;

    const clothesList = storeData.clothes[selectedBrand][selectedCategory];

    if (!clothesList || clothesList.length === 0) {
        contentGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3 style="color: var(--text-secondary);">No items available in this category yet.</h3>
            </div>
        `;
        return;
    }

    let html = '';
    clothesList.forEach(item => {
        html += `
            <div class="card">
                <div class="card-content">
                    <img src="${item.image}" alt="${item.name}" class="card-image">
                    <span class="card-badge">${item.category}</span>
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-description">${item.description}</p>
                    <p class="card-price">${item.price}</p>
                    <button class="btn btn-primary" onclick="tryOnClothes('${item.name}')">Try On</button>
                </div>
            </div>
        `;
    });

    contentGrid.innerHTML = html;
}

// Try on clothes (show success modal)
function tryOnClothes(itemName) {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Helper: Get brand name by ID
function getBrandName(brandId) {
    const brand = storeData.brands.find(b => b.id === brandId);
    return brand ? brand.name : '';
}

// Helper: Get category name by ID
function getCategoryName(categoryId) {
    const category = storeData.categories[categoryId];
    return category ? category.name : '';
}
