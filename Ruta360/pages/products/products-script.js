tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "surface": "#121414",
                "primary": "#77dd6a",
                "secondary": "#4ce346",
                "on-background": "#e2e2e2",
                "background": "#121414",
                "surface-container": "#1e2020",
                "surface-container-low": "#1a1c1c",
                "surface-container-high": "#282a2b",
                "surface-container-highest": "#333535",
                "surface-container-lowest": "#0c0f0f",
                "outline-variant": "#3f4a3b",
                "primary-container": "#3fa539",
                "on-primary-container": "#003202"
            },
            "spacing": {
                "margin-desktop": "80px",
                "container-max": "1440px",
                "margin-mobile": "20px",
                "gutter": "24px"
            },
            "fontFamily": {
                "body-md": ["Inter"],
                "headline-xl": ["Montserrat"],
                "headline-md": ["Montserrat"],
                "headline-lg": ["Montserrat"]
            }
        }
    }
}

let carrito = JSON.parse(localStorage.getItem('apex_cart')) || [];
const productos = document.querySelectorAll('[data-product-card]');

// 1. FUNCIONALIDAD DE FILTRADO
const searchInput = document.getElementById('search-input');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');
const categoryButtons = document.querySelectorAll('[data-filter-category]');

function filtrarProductos() {
    const texto = searchInput.value.toLowerCase();
    const precioMax = parseInt(priceRange.value);
    const categoriaActiva = document.querySelector('.category-active')?.dataset.filterCategory || 'todas';

    productos.forEach(card => {
        const titulo = card.querySelector('h3').innerText.toLowerCase();
        const descripcion = card.querySelector('p').innerText.toLowerCase();
        const precio = parseInt(card.dataset.price);
        const categoria = card.dataset.category;

        const coincideBusqueda = titulo.includes(texto) || descripcion.includes(texto);
        const coincidePrecio = precio <= precioMax;
        const coincideCategoria = categoriaActiva === 'todas' || categoria === categoriaActiva;

        if (coincideBusqueda && coincidePrecio && coincideCategoria) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Listeners para filtros
searchInput?.addEventListener('input', filtrarProductos);
priceRange?.addEventListener('input', (e) => {
    priceValue.innerText = `$${e.target.value}`;
    filtrarProductos();
});

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('bg-primary-container', 'text-on-primary-container', 'category-active'));
        btn.classList.add('bg-primary-container', 'text-on-primary-container', 'category-active');
        filtrarProductos();
    });
});

// 2. FUNCIONALIDAD DEL CARRITO
function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.innerText = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.classList.toggle('hidden', carrito.length === 0);
    }
    localStorage.setItem('apex_cart', JSON.stringify(carrito));
}

function añadirAlCarrito(e) {
    const card = e.target.closest('[data-product-card]');
    const id = card.dataset.productId;
    const nombre = card.querySelector('h3').innerText;
    const precio = card.dataset.price;

    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    // Feedback visual simple
    const originalText = e.target.innerText;
    e.target.innerText = "¡Añadido!";
    e.target.classList.replace('bg-primary', 'bg-secondary');

    setTimeout(() => {
        e.target.innerText = originalText;
        e.target.classList.replace('bg-secondary', 'bg-primary');
    }, 1000);

    actualizarContadorCarrito();
}

// Asignar eventos a botones de compra
document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', añadirAlCarrito);
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
});