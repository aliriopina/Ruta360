// Configuración de Tailwind CSS (Extendiendo el tema existente)
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "tertiary-fixed": "#e5e2e1",
                "secondary-container": "#04b71a",
                "primary-fixed-dim": "#77dd6a",
                "tertiary": "#c8c6c5",
                "surface": "#121414",
                "on-error": "#690005",
                "surface-container": "#1e2020",
                "primary-container": "#3fa539",
                "surface-container-low": "#1a1c1c",
                "primary-fixed": "#92fa83",
                "on-tertiary": "#313030",
                "on-tertiary-container": "#2a2a2a",
                "outline": "#899483",
                "secondary-fixed-dim": "#4ce346",
                "secondary-fixed": "#75ff68",
                "error": "#ffb4ab",
                "tertiary-container": "#929090",
                "primary": "#77dd6a",
                "on-secondary-fixed": "#002201",
                "on-error-container": "#ffdad6",
                "on-primary-container": "#003202",
                "surface-variant": "#333535",
                "on-background": "#e2e2e2",
                "on-primary-fixed": "#002201",
                "on-surface": "#e2e2e2",
                "on-surface-variant": "#becab7",
                "tertiary-fixed-dim": "#c8c6c5",
                "on-tertiary-fixed": "#1c1b1b",
                "inverse-primary": "#006e0c",
                "outline-variant": "#3f4a3b",
                "surface-dim": "#121414",
                "surface-tint": "#77dd6a",
                "secondary": "#4ce346",
                "on-primary-fixed-variant": "#005307",
                "surface-container-lowest": "#0c0f0f",
                "on-primary": "#003a03",
                "on-secondary-container": "#003f03",
                "inverse-surface": "#e2e2e2",
                "on-tertiary-fixed-variant": "#474746",
                "surface-container-high": "#282a2b",
                "error-container": "#93000a",
                "surface-bright": "#38393a",
                "on-secondary-fixed-variant": "#005306",
                "on-secondary": "#003a03",
                "background": "#121414",
                "surface-container-highest": "#333535",
                "inverse-on-surface": "#2f3131"
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
                "headline-lg": ["Montserrat"],
                "label-bold": ["Inter"]
            }
        }
    }
}

// Lógica simple para efectos de interacción (opcional)
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            // Se puede añadir lógica de analytics o sonidos sutiles aquí
        });
    });
});