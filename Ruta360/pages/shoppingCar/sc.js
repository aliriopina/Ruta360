// Configuración de Tailwind CSS
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
                "outline-variant": "#3f4a3b",
                "on-primary": "#003a03",
                "secondary-container": "#04b71a"
            },
            "spacing": {
                "margin-desktop": "80px",
                "container-max": "1440px",
                "gutter": "24px"
            },
            "fontFamily": {
                "body-md": ["Inter"],
                "headline-xl": ["Montserrat"],
                "headline-md": ["Montserrat"],
                "label-bold": ["Inter"]
            }
        }
    }
}

// --- LÓGICA DEL CARRITO ---

document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('cart-items-container');

    // Función para recalcular totales
    const updateTotals = () => {
        let subtotal = 0;
        const items = document.querySelectorAll('.cart-item');

        items.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const qty = parseInt(item.querySelector('.qty-input').value);
            subtotal += price * qty;
        });

        const shipping = subtotal > 0 ? 45 : 0;
        const tax = subtotal * 0.08; // Ejemplo 8%
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').innerText = `$${subtotal.toLocaleString()}`;
        document.getElementById('tax').innerText = `$${tax.toLocaleString()}`;
        document.getElementById('total').innerText = `$${total.toLocaleString()}`;
        document.getElementById('cart-badge').innerText = items.length;
        document.getElementById('cart-summary-text').innerText = `${items.length} Artículos listos para el próximo descenso.`;
    };

    // Eventos para botones de cantidad y eliminar
    itemsContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.cart-item');
        if (!item) return;

        const input = item.querySelector('.qty-input');

        if (e.target.closest('.qty-plus')) {
            input.value = parseInt(input.value) + 1;
            updateTotals();
        }

        if (e.target.closest('.qty-minus')) {
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
                updateTotals();
            }
        }

        if (e.target.closest('.remove-item')) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            setTimeout(() => {
                item.remove();
                updateTotals();
            }, 300);
        }
    });
});