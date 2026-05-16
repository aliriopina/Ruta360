/**
 * data.js — Datos centralizados de productos Ruta 360
 * Fuente única de verdad para el catálogo de bicicletas y accesorios.
 */

const PRODUCTOS_DATA = [
  {
    id: "bike-001",
    nombre: "Summit Apex Carbon",
    descripcion: "Bestia del Enduro con suspensión de 160mm y construcción en fibra de carbono de alto módulo ultra ligera.",
    precio: 6499,
    categoria: "montana",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDznZw7m1wZCol-EzNpmi0_BV2kXsOHCmnaRv-7lnLNrAs_fh9jF3zvKsjgBQyR3EKAak5hCkdZpRHKAD1Bgf8yuQGmmBNqAIJkrL00rAWK6l6DcS9Cj22cwrlyIyEq36CPsKg7Y9WIQDk4zXVAXjMGXtWkaRwHOHGwQyY0t93FW94Tz9F18ENzTIGb0GOwUA50AlTG3svK3QXx3SjYaZ_Vanyd5yovCrGXWtVuz8RoeHNZ2BrwVlKaY2lO9eQkuN-XUKMnt0pdddR9",
    badge: "NOVEDAD",
    especificaciones: { cuadro: "Carbono HM", peso: "12.8 kg", transmision: "Apex Pro Wireless", suspension: "160mm" }
  },
  {
    id: "bike-002",
    nombre: "Ruta 360 Classic",
    descripcion: "La compañera definitiva con geometría reactiva y cambios electrónicos inalámbricos de 12 velocidades.",
    precio: 4250,
    categoria: "ruta",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXo9W8lvVjDvxBWBKR2y9LvGMvO5T1qwJz-Ym57ntKvce0aP_aqd2b-klwmkQJX21YoQXgXfxxB4w9c2KNgCggUa8P19RV0NnCDTfzbaZa8Bi_KViL6D8cViOmZ51CoglsVYtgcIlrMsNMj-1ZN2-jcLgyZ0vxa2peZPjTj7oWf5aJS-F0nDfZieDcltZqXCgmuieIfGbFaPNUFWWcnNRQOoaf075fjH2NDoEZyoFfY_oJOSVTC7StU3YhnwGAYtQ5eq2lv_EIgJhS",
    badge: "MÁS VENDIDO",
    especificaciones: { cuadro: "Aluminio Ultra-Lite", peso: "14.2 kg", transmision: "Apex Sport 12s", suspension: "Rígida" }
  },
  {
    id: "bike-003",
    nombre: "Volt-X Enduro E",
    descripcion: "Potente motor central de 85Nm con batería de alta capacidad para los ascensos más exigentes.",
    precio: 8199,
    categoria: "electrica",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiXkCzrP6uhgOmAQB-WaahYcnlc1tCOpecTd0vSGpDqDgQFo2Xro956oSK3UPcInrVPyogdUvVc_qYwEF3btR1oCfioLHlRQ7_3ohzV1ADnzeQu7Jovp2fWjbFUONj9sJ5_O_9wKFqFG9DCxkjdf9lCndhfIK2tOrHOa_Mq0l69R8-BZIs-hm-ZZXv5VTNCUsMiOtl5TW8pv3IwMJtrqsDQ7WHwzWE5qoWkXCCSa5-BktLsCOV5QHOEo_-MVUcvU9s-dXEWQK_qjrE",
    badge: "E-BIKE",
    especificaciones: { cuadro: "Aluminio Reforzado", peso: "24.5 kg", transmision: "Shimano Deore XT", motor: "85Nm" }
  },
  {
    id: "bike-004",
    nombre: "Apex Trail X1",
    descripcion: "Fibra de carbono de alto módulo con geometría agresiva para dominar el terreno técnico.",
    precio: 4299,
    categoria: "montana",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJJvmdN1717WrNw7CPd6E0SXQpL3FqbSOPolIzMwJswgzlD4aMtgcZ4nRGYKcBrdOSFoMymZcAX8xwWvJ3mf4r6lq9fzg4sqRJQWQryss-7ZbaPBqgfXvLWpWsBs9vNkUytWd9QFNhw6GtAjocZBUrZBpgvv0iZQjmHqFi17xvxHm9SmitBd1Pym0PXnOeNBTVQI5DhrUr5QmdE-EjgTCMO_9iPLdPAt_UJdmcf_D5fWnU53YdJkIer3NcuKhp19GMpYhzO65N_2a6",
    badge: null,
    especificaciones: { cuadro: "Carbono HM", peso: "9.4 kg", transmision: "SRAM Eagle AXS", suspension: "120mm" }
  },
  {
    id: "acc-001",
    nombre: "Casco Carbon Shell",
    descripcion: "Casco de carbono con ventilación optimizada y sistema MIPS para máxima protección.",
    precio: 299,
    categoria: "accesorio",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHdPwPsvXQVSeSu59-ve6ndIZaIgNc0utlOm4xtc1E8T-ix1gTTVLI-NMKdYRk7EKJS3RHzeUFVvRvLnnsMeudG8sR8pYbHFdCCn7mdHsHQKJXRHVWiHP46jbj-ejhzfG8cR6qZ79YI-Kziluflx7ypilz9vkFrWBoQAhniwoZJTM7_CsMGG1omJICkTYqC1KhwAlzPCQK1SHe7BSbUEogxKeiAMMnBx7Zx7DD2dXCzdvnih6EWSbb7ey8CZgG34GqHbuQr3V_QHrr",
    badge: null,
    especificaciones: { material: "Carbono", tecnologia: "MIPS", peso: "280g", tallas: "S/M/L/XL" }
  },
  {
    id: "acc-002",
    nombre: "Velocity Groupset V2",
    descripcion: "Transmisión de precisión de 12 velocidades con cambios inalámbricos AXS.",
    precio: 1850,
    categoria: "componente",
    imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuApXfFIyya7EB5vt7x5yAC39Zz-siIV_jepXjGsfTDN_CI6OVceWdPRSe7unUMWWYEbjsYbwaN7qlCEIdONDr7I8S_ehKC_2DL9RWJLz3hrPlkzqjD_jD3Fc8A1ZIq3Op0vwC_mtVu6th6vo3RRVdDrOjTcTOK7rvD_xqNxFWm2f-3kAT1fWkF1zlZo1mxCwOTi_o3UKBjrDcm5roc9_eT8mEHYN1mKZE3fBLAqv64du0DErZTDMkxbsIQDPmOjPVhtbe5s-c0fCgSx",
    badge: null,
    especificaciones: { velocidades: "12", tipo: "Inalámbrico AXS", peso: "2.1 kg", compatibilidad: "Universal" }
  }
];

// Paleta de colores Tailwind reutilizable (para referencia)
const TAILWIND_CONFIG = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
        "on-primary-container": "#003202",
        "on-primary": "#003a03",
        "on-surface": "#e2e2e2",
        "on-surface-variant": "#8a9e85",
        "error": "#cf6679"
      },
      spacing: {
        "margin-desktop": "80px",
        "container-max": "1440px",
        "margin-mobile": "20px",
        "gutter": "24px"
      },
      fontFamily: {
        "body-md": ["Inter"],
        "headline-xl": ["Montserrat"],
        "headline-md": ["Montserrat"],
        "headline-lg": ["Montserrat"],
        "label-bold": ["Inter"]
      }
    }
  }
};
