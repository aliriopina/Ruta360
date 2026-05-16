/**
 * app.js — Controlador principal de la aplicación Ruta 360
 */

const App = {
  catalogo: new Map(),
  compraActiva: null,
  usuarioActual: null,
  ventas: [],
  usuarios: [],

  init() {
    this._inicializarCatalogo();
    this._inicializarUsuarios();
    this._cargarSesion();
    this._cargarVentas();
    this.compraActiva = Compra.cargarDesdeStorage(this.catalogo);
    Renderer.actualizarBadgeCarrito(this.compraActiva.totalItems());
    this._configurarBotonUsuario();
    console.log('[Ruta360] App inicializada ✓');
  },

  _inicializarCatalogo() {
    PRODUCTOS_DATA.forEach(data => {
      const bicicleta = Bicicleta.fromJSON(data);
      this.catalogo.set(bicicleta.id, bicicleta);
    });
  },

  _inicializarUsuarios() {
    // Cargar usuarios guardados (registros nuevos) + defaults
    let guardados = [];
    try {
      guardados = JSON.parse(localStorage.getItem('ruta360_usuarios_extra')) || [];
    } catch (e) {}

    this.usuarios = [
      new Admin('admin-001', 'Carlos Vélez', 'admin@ruta360.com', 'admin123'),
      new Usuario('user-001', 'Laura Gómez', 'user@ruta360.com', 'user123'),
      ...guardados.map(u => {
        const usr = new Usuario(u.id, u.nombre, u.email, u._password || u.password);
        return usr;
      })
    ];

    // Cargar historial de cada usuario desde localStorage
    this.usuarios.forEach(u => u.cargarHistorial());
  },

  _cargarSesion() {
    try {
      const sesion = JSON.parse(localStorage.getItem('ruta360_sesion'));
      if (sesion) {
        this.usuarioActual = this.usuarios.find(u => u.id === sesion.id) || null;
      }
    } catch (e) {
      this.usuarioActual = null;
    }
  },

  _cargarVentas() {
    try {
      this.ventas = JSON.parse(localStorage.getItem('ruta360_ventas')) || [];
    } catch (e) {
      this.ventas = [];
    }
  },

  // ── REGISTRO ────────────────────────────────────────────────────────────────
  registrar(nombre, email, password) {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      return { exito: false, mensaje: 'Todos los campos son obligatorios.' };
    }
    if (this.usuarios.find(u => u.email === email)) {
      return { exito: false, mensaje: 'Ya existe una cuenta con ese email.' };
    }
    if (password.length < 6) {
      return { exito: false, mensaje: 'La contraseña debe tener mínimo 6 caracteres.' };
    }

    const id = `user-${Date.now()}`;
    const nuevoUsuario = new Usuario(id, nombre.trim(), email.trim(), password);
    this.usuarios.push(nuevoUsuario);

    // Persistir usuarios extra
    let guardados = [];
    try { guardados = JSON.parse(localStorage.getItem('ruta360_usuarios_extra')) || []; } catch (e) {}
    guardados.push({ id, nombre: nombre.trim(), email: email.trim(), _password: password });
    localStorage.setItem('ruta360_usuarios_extra', JSON.stringify(guardados));

    return { exito: true, usuario: nuevoUsuario };
  },

  // ── AUTENTICACIÓN ────────────────────────────────────────────────────────────
  login(email, password) {
    const usuario = this.usuarios.find(u => u.email === email);
    if (!usuario) return { exito: false, mensaje: 'No existe una cuenta con ese email.' };
    if (!usuario.verificarPassword(password)) return { exito: false, mensaje: 'Contraseña incorrecta.' };

    this.usuarioActual = usuario;
    localStorage.setItem('ruta360_sesion', JSON.stringify({ id: usuario.id }));
    this._actualizarUIUsuario();
    return { exito: true, usuario };
  },

  logout() {
    this.usuarioActual = null;
    localStorage.removeItem('ruta360_sesion');
    this._actualizarUIUsuario();
    Renderer.mostrarToast('Sesión cerrada', 'info');
  },

  // ── CARRITO ─────────────────────────────────────────────────────────────────
  agregarAlCarrito(bicicleta) {
    if (!this.usuarioActual) {
      Renderer.mostrarModalSesion(
        (email, pass) => this.login(email, pass),
        (nombre, email, pass) => this.registrar(nombre, email, pass)
      );
      Renderer.mostrarToast('Debes iniciar sesión para comprar', 'error');
      return;
    }
    if (!bicicleta.estaDisponible()) {
      Renderer.mostrarToast('Producto agotado', 'error');
      return;
    }
    this.compraActiva.agregarProducto(bicicleta);
    Renderer.actualizarBadgeCarrito(this.compraActiva.totalItems());
    Renderer.mostrarToast(`"${bicicleta.nombre}" añadido al carrito ✓`, 'success');
  },

  procesarCompra() {
    if (!this.usuarioActual) {
      Renderer.mostrarModalSesion(
        (email, pass) => this.login(email, pass),
        (nombre, email, pass) => this.registrar(nombre, email, pass)
      );
      return null;
    }
    if (this.compraActiva.estaVacio()) {
      Renderer.mostrarToast('Tu carrito está vacío', 'error');
      return null;
    }
    try {
      this.compraActiva.items.forEach(item => {
        item.bicicleta.reducirStock(item.cantidad);
      });
    } catch (e) {
      Renderer.mostrarToast(e.message, 'error');
      return null;
    }

    const venta = new Venta(this.compraActiva, this.usuarioActual);

    // Guardar en historial del usuario (objeto completo)
    this.usuarioActual.agregarCompra(venta.toJSON());

    // Guardar en ventas globales
    this.ventas.push(venta.toJSON());
    localStorage.setItem('ruta360_ventas', JSON.stringify(this.ventas));

    this.compraActiva.vaciarCarrito();
    Renderer.actualizarBadgeCarrito(0);
    return venta;
  },

  // ── UI ───────────────────────────────────────────────────────────────────────
  _configurarBotonUsuario() {
    const btnUsuario = document.getElementById('btn-usuario');
    if (!btnUsuario) return;
    this._actualizarUIUsuario();

    btnUsuario.addEventListener('click', () => {
      if (this.usuarioActual) {
        this._mostrarMenuUsuario(btnUsuario);
      } else {
        Renderer.mostrarModalSesion(
          (email, pass) => this.login(email, pass),
          (nombre, email, pass) => this.registrar(nombre, email, pass)
        );
      }
    });
  },

  _mostrarMenuUsuario(btnUsuario) {
    const existing = document.getElementById('menu-usuario');
    if (existing) { existing.remove(); return; }

    const menu = document.createElement('div');
    menu.id = 'menu-usuario';
    menu.className = 'absolute right-0 top-full mt-2 bg-surface-container border border-outline-variant shadow-2xl z-50 min-w-[220px]';

    // Historial
    const historial = this.usuarioActual.historialCompras.slice(-3).reverse();
    const historialHTML = historial.length > 0
      ? historial.map(v => `
          <div class="px-4 py-2 border-b border-outline-variant/50">
            <p class="text-on-surface text-xs font-bold">${v.numeroSeguimiento}</p>
            <p class="text-on-surface-variant text-xs">$${v.total?.toLocaleString('en-US', {minimumFractionDigits:2})} · ${new Date(v.fecha).toLocaleDateString('es-CO')}</p>
          </div>`).join('')
      : `<p class="text-on-surface-variant text-xs px-4 py-2">Sin compras aún</p>`;

    menu.innerHTML = `
      <div class="p-4 border-b border-outline-variant bg-surface-container-high">
        <p class="text-primary font-bold font-headline-md">${this.usuarioActual.nombre}</p>
        <p class="text-on-surface-variant text-xs">${this.usuarioActual.email}</p>
        <span class="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${this.usuarioActual.esAdmin() ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'}">${this.usuarioActual.rol}</span>
      </div>
      <div class="py-2">
        <p class="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold px-4 py-1">Últimas compras</p>
        ${historialHTML}
      </div>
      ${this.usuarioActual.esAdmin() ? `<a href="${window.location.pathname.includes('/pages/') ? '../admin/admin.html' : 'pages/admin/admin.html'}" class="block px-4 py-3 text-primary text-sm hover:bg-surface-container-high transition-colors border-t border-outline-variant">Panel Admin</a>` : ''}
      <button id="btn-logout" class="w-full text-left px-4 py-3 text-red-400 text-sm hover:bg-surface-container-high transition-colors border-t border-outline-variant">Cerrar Sesión</button>
    `;

    const container = btnUsuario.closest('.flex');
    const wrapper = btnUsuario.parentElement;
    wrapper.style.position = 'relative';
    wrapper.appendChild(menu);

    menu.querySelector('#btn-logout')?.addEventListener('click', () => {
      this.logout();
      menu.remove();
    });

    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== btnUsuario) menu.remove();
      }, { once: true });
    }, 10);
  },

  _actualizarUIUsuario() {
    const btnUsuario = document.getElementById('btn-usuario');
    if (!btnUsuario) return;
    const icon = btnUsuario.querySelector('.material-symbols-outlined');
    const nameSpan = btnUsuario.querySelector('.user-name-label');

    if (this.usuarioActual) {
      if (icon) icon.textContent = 'account_circle';
      btnUsuario.title = this.usuarioActual.nombre;
      btnUsuario.classList.add('text-primary');
      // Mostrar nombre si existe el span
      if (nameSpan) {
        nameSpan.textContent = this.usuarioActual.nombre;
        nameSpan.classList.remove('hidden');
      }
    } else {
      if (icon) icon.textContent = 'person';
      btnUsuario.title = 'Iniciar sesión';
      btnUsuario.classList.remove('text-primary');
      if (nameSpan) nameSpan.classList.add('hidden');
    }
  }
};
