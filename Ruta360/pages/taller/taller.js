// taller.js

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "secondary-fixed-dim": "#c6c6c6",
                "on-error": "#690005",
                "on-tertiary-container": "#515253",
                "surface-bright": "#383939",
                "on-surface": "#e2e2e2",
                "secondary": "#c6c6c6",
                "on-primary-fixed-variant": "#005307",
                "error": "#ffb4ab",
                "primary-container": "#77dd6a",
                "surface-container-highest": "#333535",
                "outline": "#899483",
                "inverse-surface": "#e2e2e2",
                "tertiary-fixed-dim": "#c6c6c6",
                "on-primary-container": "#006109",
                "on-secondary-fixed-variant": "#454747",
                "surface-container-low": "#1a1c1c",
                "inverse-primary": "#006e0c",
                "on-error-container": "#ffdad6",
                "error-container": "#93000a",
                "on-background": "#e2e2e2",
                "primary-fixed": "#92fa83",
                "surface-container-high": "#282a2a",
                "outline-variant": "#3f4a3b",
                "on-primary-fixed": "#002201",
                "background": "#121414",
                "tertiary-fixed": "#e2e2e2",
                "surface-dim": "#121414",
                "inverse-on-surface": "#2f3131",
                "surface": "#121414",
                "on-secondary-fixed": "#1a1c1c",
                "on-primary": "#003a03",
                "primary-fixed-dim": "#77dd6a",
                "secondary-fixed": "#e2e2e2",
                "surface-tint": "#77dd6a",
                "tertiary-container": "#c6c6c6",
                "on-tertiary-fixed-variant": "#454747",
                "surface-container": "#1e2020",
                "surface-variant": "#333535",
                "surface-container-lowest": "#0d0f0f",
                "on-surface-variant": "#becab7",
                "on-tertiary": "#2f3131",
                "on-secondary": "#2f3131",
                "on-secondary-container": "#b4b5b5",
                "primary": "#92fa83",
                "tertiary": "#e2e2e2",
                "secondary-container": "#454747",
                "on-tertiary-fixed": "#1a1c1c"
            },
            "borderRadius": {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
            },
            "spacing": {
                "gutter-mobile": "16px",
                "margin-mobile": "20px",
                "margin-desktop": "64px",
                "base": "4px",
                "gutter-desktop": "24px",
                "stack-lg": "32px",
                "stack-sm": "8px",
                "stack-md": "16px"
            },
            "fontFamily": {
                "body-lg": ["Inter"],
                "headline-xl": ["Montserrat"],
                "label-sm": ["Inter"],
                "headline-lg": ["Montserrat"],
                "body-md": ["Inter"],
                "headline-lg-mobile": ["Montserrat"],
                "label-lg": ["Inter"],
                "headline-md": ["Montserrat"]
            },
            "fontSize": {
                "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                "headline-xl": ["48px", {"lineHeight": "1.1", "letterSpacing": "0.05em", "fontWeight": "800"}],
                "label-sm": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "500"}],
                "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "0.02em", "fontWeight": "700"}],
                "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                "headline-lg-mobile": ["28px", {"lineHeight": "1.2", "fontWeight": "700"}],
                "label-lg": ["14px", {"lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "600"}],
                "headline-md": ["24px", {"lineHeight": "1.2", "fontWeight": "700"}]
            }
        }
    }
};