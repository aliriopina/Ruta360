/**
 * ui/Renderer.js — Módulo de renderizado dinámico del DOM. Ruta 360.
 */
const Renderer = {

  crearTarjetaProducto(bicicleta, onAgregar) {
    const card = document.createElement('div');
    card.className = 'bg-surface-container border border-outline-variant group transition-all duration-300 hover:border-primary overflow-hidden flex flex-col';
    card.dataset.productId = bicicleta.id;
    card.dataset.categoria = bicicleta.categoria;
    card.dataset.precio = bicicleta.precio;

    const badgeHTML = bicicleta.badge
      ? `<div class="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 font-label-bold text-xs">${bicicleta.badge}</div>`
      : '';
    const stockHTML = !bicicleta.estaDisponible()
      ? `<div class="absolute inset-0 bg-black/60 flex items-center justify-center"><span class="text-white font-bold uppercase tracking-widest">Agotado</span></div>`
      : '';

    card.innerHTML = `
      <div class="relative h-64 overflow-hidden bg-black">
        <img src="${bicicleta.imagen}" 
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
             alt="${bicicleta.nombre}"
             onerror="this.src='https://via.placeholder.com/400x300/1e2020/77dd6a?text=Ruta+360'"/>
        ${badgeHTML}
        ${stockHTML}
      </div>
      <div class="p-6 bg-surface-container-high flex-1 flex flex-col justify-between">
        <div>
          <p class="text-primary text-xs font-bold uppercase mb-1">${bicicleta.categoria.charAt(0).toUpperCase() + bicicleta.categoria.slice(1)}</p>
          <h3 class="font-headline-md text-on-surface mb-2 font-bold text-lg">${bicicleta.nombre}</h3>
          <p class="text-on-surface-variant text-sm mb-3 line-clamp-2">${bicicleta.descripcion}</p>
          <p class="text-on-surface-variant text-xs">Stock: <span class="text-primary font-bold">${bicicleta.stock} unidades</span></p>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xl text-primary font-bold font-headline-md">${bicicleta.precioFormateado}</span>
          <button 
            class="btn-agregar bg-primary text-on-primary px-5 py-3 font-bold text-sm flex items-center gap-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            ${!bicicleta.estaDisponible() ? 'disabled' : ''}
            data-product-id="${bicicleta.id}">
            <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">shopping_cart</span>
            Añadir
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-agregar').addEventListener('click', () => onAgregar(bicicleta));
    return card;
  },

  crearItemCarrito(item, onEliminar, onCambiarCantidad) {
    const { bicicleta, cantidad } = item;
    const div = document.createElement('div');
    div.className = 'cart-item group bg-surface-container border border-outline-variant p-6 flex flex-col md:flex-row items-center gap-6 transition-all duration-300 hover:border-primary/50';
    div.dataset.productId = bicicleta.id;

    div.innerHTML = `
      <div class="w-full md:w-48 h-40 bg-surface-container-low overflow-hidden flex-shrink-0">
        <img src="${bicicleta.imagen}" 
             class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
             alt="${bicicleta.nombre}"
             onerror="this.src='https://via.placeholder.com/200x160/1e2020/77dd6a?text=Ruta360'"/>
      </div>
      <div class="flex-grow space-y-2 w-full">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-on-surface text-lg font-headline-md">${bicicleta.nombre}</h3>
            <p class="text-on-surface-variant text-sm">${bicicleta.categoria.charAt(0).toUpperCase() + bicicleta.categoria.slice(1)}</p>
          </div>
          <span class="text-xl text-primary font-bold font-headline-md">${bicicleta.precioFormateado}</span>
        </div>
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center border border-outline-variant bg-surface-container-low">
            <button class="qty-minus p-2 hover:text-primary transition-colors">
              <span class="material-symbols-outlined">remove</span>
            </button>
            <input class="qty-input w-12 text-center bg-transparent border-none focus:ring-0 font-bold" 
                   type="text" value="${cantidad}" readonly/>
            <button class="qty-plus p-2 hover:text-primary transition-colors">
              <span class="material-symbols-outlined">add</span>
            </button>
          </div>
          <div class="text-right">
            <p class="text-on-surface-variant text-xs mb-1">Subtotal</p>
            <p class="subtotal-item text-primary font-bold">$${(bicicleta.precio * cantidad).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <button class="btn-eliminar flex items-center text-on-surface-variant hover:text-red-400 transition-colors uppercase font-bold tracking-widest text-xs">
            <span class="material-symbols-outlined text-sm mr-1">delete</span> Eliminar
          </button>
        </div>
      </div>
    `;

    div.querySelector('.qty-minus').addEventListener('click', () => onCambiarCantidad(bicicleta.id, cantidad - 1));
    div.querySelector('.qty-plus').addEventListener('click', () => onCambiarCantidad(bicicleta.id, cantidad + 1));
    div.querySelector('.btn-eliminar').addEventListener('click', () => {
      div.style.transition = 'all 0.3s ease';
      div.style.opacity = '0';
      div.style.transform = 'translateX(20px)';
      setTimeout(() => onEliminar(bicicleta.id), 300);
    });

    return div;
  },

  mostrarToast(mensaje, tipo = 'success') {
    const colores = {
      success: 'bg-primary text-on-primary',
      error: 'bg-red-500 text-white',
      info: 'bg-surface-container-highest text-on-surface border border-primary'
    };
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 z-[9999] px-6 py-4 font-bold text-sm uppercase tracking-wider shadow-2xl transition-all duration-300 ${colores[tipo]}`;
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  actualizarBadgeCarrito(total) {
    document.querySelectorAll('[data-cart-badge]').forEach(badge => {
      badge.textContent = total;
      badge.classList.toggle('hidden', total === 0);
    });
  },

  actualizarResumenCarrito(compra) {
    const fmt = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('resumen-subtotal', fmt(compra.calcularSubtotal()));
    set('resumen-descuento', `-${fmt(compra.calcularDescuento())}`);
    set('resumen-impuestos', fmt(compra.calcularImpuestos()));
    set('resumen-envio', compra.calcularEnvio() === 0 ? '¡Gratis!' : fmt(compra.calcularEnvio()));
    set('resumen-total', fmt(compra.calcularTotal()));
    set('resumen-items', `${compra.totalItems()} artículo${compra.totalItems() !== 1 ? 's' : ''} en tu carrito.`);
    this.actualizarBadgeCarrito(compra.totalItems());
  },

  // ── MODAL LOGIN / REGISTRO ──────────────────────────────────────────────────
  mostrarModalSesion(onLogin, onRegistro) {
    const existing = document.getElementById('modal-sesion');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'modal-sesion';
    overlay.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4';

    overlay.innerHTML = `
      <div class="bg-surface-container border border-outline-variant w-full max-w-md p-8 relative">
        <button id="cerrar-modal" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>

        <!-- Tabs -->
        <div class="flex border-b border-outline-variant mb-6">
          <button id="tab-login" class="tab-btn flex-1 py-3 text-sm font-bold uppercase tracking-widest text-primary border-b-2 border-primary transition-all">Iniciar Sesión</button>
          <button id="tab-registro" class="tab-btn flex-1 py-3 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">Registrarse</button>
        </div>

        <!-- Panel LOGIN -->
        <div id="panel-login">
          <p class="text-on-surface-variant text-sm mb-6">Accede a tu cuenta para comprar.</p>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-on-surface-variant text-xs uppercase tracking-widest mb-2">Email</label>
              <input id="login-email" type="email" placeholder="tu@email.com"
                     class="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 transition-colors"/>
            </div>
            <div>
              <label class="block text-on-surface-variant text-xs uppercase tracking-widest mb-2">Contraseña</label>
              <input id="login-password" type="password" placeholder="••••••••"
                     class="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 transition-colors"/>
            </div>
          </div>
          <p id="login-error" class="text-red-400 text-sm mb-4 hidden"></p>
          <button id="btn-login" class="w-full py-4 bg-primary text-on-primary font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
            Entrar
          </button>
          <div class="mt-6 p-4 bg-surface-container-low border border-outline-variant text-xs text-on-surface-variant">
            <p class="font-bold text-primary mb-1">Cuentas de prueba:</p>
            <p>Admin: admin@ruta360.com / admin123</p>
            <p>Usuario: user@ruta360.com / user123</p>
          </div>
        </div>

        <!-- Panel REGISTRO -->
        <div id="panel-registro" class="hidden">
          <p class="text-on-surface-variant text-sm mb-6">Crea tu cuenta gratis para comprar.</p>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-on-surface-variant text-xs uppercase tracking-widest mb-2">Nombre completo</label>
              <input id="reg-nombre" type="text" placeholder="Tu nombre"
                     class="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 transition-colors"/>
            </div>
            <div>
              <label class="block text-on-surface-variant text-xs uppercase tracking-widest mb-2">Email</label>
              <input id="reg-email" type="email" placeholder="tu@email.com"
                     class="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 transition-colors"/>
            </div>
            <div>
              <label class="block text-on-surface-variant text-xs uppercase tracking-widest mb-2">Contraseña</label>
              <input id="reg-password" type="password" placeholder="Mínimo 6 caracteres"
                     class="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 transition-colors"/>
            </div>
          </div>
          <p id="reg-error" class="text-red-400 text-sm mb-4 hidden"></p>
          <button id="btn-registro" class="w-full py-4 bg-primary text-on-primary font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
            Crear Cuenta
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Tabs
    const panelLogin = overlay.querySelector('#panel-login');
    const panelRegistro = overlay.querySelector('#panel-registro');
    const tabLogin = overlay.querySelector('#tab-login');
    const tabReg = overlay.querySelector('#tab-registro');

    tabLogin.addEventListener('click', () => {
      panelLogin.classList.remove('hidden');
      panelRegistro.classList.add('hidden');
      tabLogin.classList.add('text-primary', 'border-b-2', 'border-primary');
      tabReg.classList.remove('text-primary', 'border-b-2', 'border-primary');
      tabReg.classList.add('text-on-surface-variant');
    });
    tabReg.addEventListener('click', () => {
      panelRegistro.classList.remove('hidden');
      panelLogin.classList.add('hidden');
      tabReg.classList.add('text-primary', 'border-b-2', 'border-primary');
      tabLogin.classList.remove('text-primary', 'border-b-2', 'border-primary');
      tabLogin.classList.add('text-on-surface-variant');
    });

    // Cerrar
    overlay.querySelector('#cerrar-modal').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    // Login
    overlay.querySelector('#btn-login').addEventListener('click', () => {
      const email = overlay.querySelector('#login-email').value.trim();
      const pass = overlay.querySelector('#login-password').value;
      const errorEl = overlay.querySelector('#login-error');
      const resultado = onLogin(email, pass);
      if (resultado.exito) {
        overlay.remove();
        Renderer.mostrarToast(`¡Bienvenido, ${resultado.usuario.nombre}!`, 'success');
      } else {
        errorEl.textContent = resultado.mensaje;
        errorEl.classList.remove('hidden');
      }
    });

    // Registro
    overlay.querySelector('#btn-registro').addEventListener('click', () => {
      const nombre = overlay.querySelector('#reg-nombre').value.trim();
      const email = overlay.querySelector('#reg-email').value.trim();
      const pass = overlay.querySelector('#reg-password').value;
      const errorEl = overlay.querySelector('#reg-error');
      const resultado = onRegistro(nombre, email, pass);
      if (resultado.exito) {
        overlay.remove();
        // Auto-login tras registro
        onLogin(email, pass);
        Renderer.mostrarToast(`¡Bienvenido, ${resultado.usuario.nombre}! Cuenta creada ✓`, 'success');
      } else {
        errorEl.textContent = resultado.mensaje;
        errorEl.classList.remove('hidden');
      }
    });
  }
};
