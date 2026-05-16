// taller.js — Lógica de interactividad del formulario de reserva

const estado = {
    fecha: null,
    mecanico: null,
    servicio: 'Preventivo',
    mesActual: new Date()
};

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS = ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'];

// ── CALENDARIO ────────────────────────────────────────────────────────────────
function renderCalendario() {
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    const año = estado.mesActual.getFullYear();
    const mes = estado.mesActual.getMonth();

    document.getElementById('cal-titulo').textContent = `${MESES[mes]} ${año}`;

    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';

    // Cabeceras
    DIAS.forEach(d => {
        const el = document.createElement('div');
        el.className = `font-label-sm text-[10px] py-2 text-center ${d === 'DOM' ? 'text-error' : 'text-on-surface-variant'}`;
        el.textContent = d;
        grid.appendChild(el);
    });

    // Offset: primer día del mes (lunes = 0)
    let offset = new Date(año, mes, 1).getDay() - 1;
    if (offset < 0) offset = 6;
    for (let i = 0; i < offset; i++) grid.appendChild(document.createElement('div'));

    // Días
    const totalDias = new Date(año, mes + 1, 0).getDate();
    for (let dia = 1; dia <= totalDias; dia++) {
        const fecha = new Date(año, mes, dia);
        const esDomingo = fecha.getDay() === 0;
        const esPasado  = fecha < hoy;
        const esSeleccionado = estado.fecha && fecha.toDateString() === estado.fecha.toDateString();

        const btn = document.createElement('button');
        btn.textContent = String(dia).padStart(2, '0');
        btn.className = 'aspect-square flex items-center justify-center text-xs transition-all border';

        if (esDomingo || esPasado) {
            btn.className += ' border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed';
            btn.disabled = true;
        } else if (esSeleccionado) {
            btn.className += ' selected-day font-bold';
        } else {
            btn.className += ' border-outline-variant hover:border-primary hover:text-primary';
            btn.addEventListener('click', () => { estado.fecha = fecha; renderCalendario(); actualizarResumen(); });
        }
        grid.appendChild(btn);
    }
}

// ── MECÁNICOS ─────────────────────────────────────────────────────────────────
function seleccionarMecanico(nombre) {
    estado.mecanico = nombre;
    document.querySelectorAll('.card-mecanico').forEach(card => {
        const activo = card.dataset.mecanico === nombre;
        card.classList.toggle('border-primary', activo);
        card.classList.toggle('selected-mechanic', activo);
        card.classList.toggle('border-outline-variant', !activo);
        card.querySelector('.mecanico-check').classList.toggle('hidden', !activo);
        card.querySelector('.mecanico-dot').classList.toggle('hidden', activo);
        card.querySelector('.mecanico-dot-corner').classList.toggle('hidden', !activo);
    });
    actualizarResumen();
}

// ── RESUMEN ───────────────────────────────────────────────────────────────────
function actualizarResumen() {
    document.getElementById('summary-date').textContent = estado.fecha
        ? estado.fecha.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()
        : 'SIN FECHA';

    document.getElementById('summary-mechanic').textContent = estado.mecanico ?? 'SIN MECÁNICO';

    const servicioEl = document.getElementById('summary-service');
    servicioEl.textContent = estado.servicio.toUpperCase();
    servicioEl.className = `font-headline-md text-[20px] ${estado.servicio === 'Reparación' ? 'text-error' : 'text-primary'}`;
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function mostrarToast(mensaje, tipo = 'success') {
    const colores = {
        success: 'bg-primary-container text-on-primary-container',
        error:   'bg-red-500 text-white',
        info:    'bg-surface-container-highest text-on-surface border border-primary'
    };
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 z-[9999] px-6 py-4 text-sm uppercase tracking-wider shadow-2xl transition-all duration-300 ${colores[tipo]}`;
    toast.style.cssText = 'transform:translateY(100px);opacity:0';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)'; toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Navegación del calendario
    document.getElementById('cal-prev').addEventListener('click', () => {
        estado.mesActual = new Date(estado.mesActual.getFullYear(), estado.mesActual.getMonth() - 1, 1);
        renderCalendario();
    });
    document.getElementById('cal-next').addEventListener('click', () => {
        estado.mesActual = new Date(estado.mesActual.getFullYear(), estado.mesActual.getMonth() + 1, 1);
        renderCalendario();
    });

    // Selección de mecánico
    document.querySelectorAll('.card-mecanico').forEach(card => {
        card.addEventListener('click', () => seleccionarMecanico(card.dataset.mecanico));
    });

    // Tipo de servicio
    const ACTIVO   = ['bg-primary-container', 'text-on-primary-container', 'font-bold'];
    const INACTIVO = ['bg-transparent', 'text-on-surface-variant'];

    function setServicio(btnActivo) {
        document.querySelectorAll('.service-btn').forEach(b => {
            ACTIVO.forEach(c => b.classList.remove(c));
            INACTIVO.forEach(c => b.classList.add(c));
        });
        INACTIVO.forEach(c => btnActivo.classList.remove(c));
        ACTIVO.forEach(c => btnActivo.classList.add(c));
        estado.servicio = btnActivo.dataset.service;
        actualizarResumen();
    }

    document.querySelectorAll('.service-btn').forEach(btn => {
        btn.addEventListener('click', () => setServicio(btn));
    });

    // Estado visual inicial
    setServicio(document.querySelector('.service-btn[data-service="Preventivo"]'));

    // Confirmar turno
    document.getElementById('btn-confirmar').addEventListener('click', () => {
        if (!estado.fecha)    { mostrarToast('Selecciona una fecha', 'error'); return; }
        if (!estado.mecanico) { mostrarToast('Selecciona un mecánico', 'error'); return; }
        const detalle = document.querySelector('textarea').value.trim();
        if (!detalle)         { mostrarToast('Describe el estado de tu bicicleta', 'error'); return; }

        const fechaStr = estado.fecha.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
        mostrarToast(`Turno confirmado — ${fechaStr} con ${estado.mecanico}`, 'success');

        // Reset del formulario
        estado.fecha = null; estado.mecanico = null; estado.servicio = 'Preventivo';
        document.querySelector('textarea').value = '';
        setServicio(document.querySelector('.service-btn[data-service="Preventivo"]'));
        document.querySelectorAll('.card-mecanico').forEach(card => {
            card.classList.remove('border-primary', 'selected-mechanic');
            card.classList.add('border-outline-variant');
            card.querySelector('.mecanico-check').classList.add('hidden');
            card.querySelector('.mecanico-dot').classList.remove('hidden');
            card.querySelector('.mecanico-dot-corner').classList.add('hidden');
        });
        renderCalendario();
        actualizarResumen();
    });

    // Botón header → scroll al formulario
    document.getElementById('btn-reserva-header').addEventListener('click', () => {
        document.getElementById('seccion-diagnostico').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Render inicial
    renderCalendario();
    actualizarResumen();
});
