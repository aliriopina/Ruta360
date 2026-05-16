/**
 * app.js — Controlador principal de la aplicación Ruta 360
 * Inicializa las clases, gestiona el estado global y conecta UI con lógica.
 */

// ── ESTADO GLOBAL DE LA APP ──────────────────────────────────────────────────
const App = {
  // Catálogo: Map<id, Bicicleta>
  catalogo: new Map(),

  // Carrito activo
  compraActiva: null,

  // Usuario en sesión
  usuarioActual: null,

  // Registro de ventas (persistido en localStorage)
  ventas: [],

  // Usuarios del sistema (en producción vendría de un backend)
  usuarios: [],

  // ── INICIALIZACIÓN ──────────────────────────────────────────────────────────

  /**
   * Punto de entrada de la aplicación.
   * Se llama desde DOMContentLoaded en cada página.
   */
  init() {
    this._inicializarCatalogo();
    this._inicializarUsuarios();
    this._cargarSesion();
    this._cargarVentas();

    // Restaurar carrito del localStorage
    this.compraActiva = Compra.cargarDesdeStorage(this.catalogo);

    // Actualizar badge del carrito
    Renderer.actualizarBadgeCarrito(this.compraActiva.totalItems());

    // Configurar botón de usuario en el header
    this._configurarBotonUsuario();

    console.log('[Ruta360] App inicializada ✓');
  },

  /**
   * Crea instancias de Bicicleta desde los datos y las guarda en el catálogo.
   * @private
   */
  _inicializarCatalogo() {
    PRODUCTOS_DATA.forEach(data => {
      const bicicleta = Bicicleta.fromJSON(data);
      this.catalogo.set(bicicleta.id, bicicleta);
    });
  },

  /**
   * Registra los usuarios del sistema (incluyendo el admin).
   * @private
   */
  _inicializarUsuarios() {
    // Admin del sistema
    const adminPrincipal = new Admin('admin-001', 'Carlos Vélez', 'admin@ruta360.com', 'admin123');

    // Usuario regular
    const usuarioRegular = new Usuario('user-001', 'Laura Gómez', 'user@ruta360.com', 'user123');

    this.usuarios = [adminPrincipal, usuarioRegular];
  },

  /**
   * Restaura la sesión del usuario desde localStorage.
   * @private
   */
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

  /**
   * Carga el historial de ventas desde localStorage.
   * @private
   */
  _cargarVentas() {
    try {
      this.ventas = JSON.parse(localStorage.getItem('ruta360_ventas')) || [];
    } catch (e) {
      this.ventas = [];
    }
  },

  // ── AUTENTICACIÓN ──────────────────────────────────────────────────────────

  /**
   * Intenta autenticar un usuario.
   * @param {string} email
   * @param {string} password
   * @returns {{ exito: boolean, usuario?: Usuario, mensaje?: string }}
   */
  login(email, password) {
    const usuario = this.usuarios.find(u => u.email === email);

    if (!usuario) {
      return { exito: false, mensaje: 'No existe una cuenta con ese email.' };
    }
    if (!usuario.verificarPassword(password)) {
      return { exito: false, mensaje: 'Contraseña incorrecta.' };
    }

    this.usuarioActual = usuario;
    localStorage.setItem('ruta360_sesion', JSON.stringify({ id: usuario.id }));
    this._actualizarUIUsuario();

    return { exito: true, usuario };
  },

  /**
   * Cierra la sesión del usuario actual.
   */
  logout() {
    this.usuarioActual = null;
    localStorage.removeItem('ruta360_sesion');
    this._actualizarUIUsuario();
    Renderer.mostrarToast('Sesión cerrada', 'info');
  },

  // ── CARRITO ────────────────────────────────────────────────────────────────

  /**
   * Agrega una bicicleta al carrito y actualiza la UI.
   * @param {Bicicleta} bicicleta
   */
  agregarAlCarrito(bicicleta) {
    if (!bicicleta.estaDisponible()) {
      Renderer.mostrarToast('Producto agotado', 'error');
      return;
    }

    this.compraActiva.agregarProducto(bicicleta);
    Renderer.actualizarBadgeCarrito(this.compraActiva.totalItems());
    Renderer.mostrarToast(`"${bicicleta.nombre}" añadido al carrito ✓`, 'success');
  },

  /**
   * Procesa la compra y crea una Venta.
   * @returns {Venta|null}
   */
  procesarCompra() {
    if (this.compraActiva.estaVacio()) {
      Renderer.mostrarToast('Tu carrito está vacío', 'error');
      return null;
    }

    // Reducir stock
    try {
      this.compraActiva.items.forEach(item => {
        item.bicicleta.reducirStock(item.cantidad);
      });
    } catch (e) {
      Renderer.mostrarToast(e.message, 'error');
      return null;
    }

    // Crear venta
    const venta = new Venta(this.compraActiva, this.usuarioActual);

    // Registrar en historial del usuario
    if (this.usuarioActual) {
      this.usuarioActual.agregarCompra(venta.id);
    }

    // Guardar venta
    this.ventas.push(venta.toJSON());
    localStorage.setItem('ruta360_ventas', JSON.stringify(this.ventas));

    // Vaciar carrito
    this.compraActiva.vaciarCarrito();
    Renderer.actualizarBadgeCarrito(0);

    return venta;
  },

  // ── UI HELPERS ─────────────────────────────────────────────────────────────

  /**
   * Configura el botón de usuario en el header.
   * @private
   */
  _configurarBotonUsuario() {
    const btnUsuario = document.getElementById('btn-usuario');
    if (!btnUsuario) return;

    this._actualizarUIUsuario();

    btnUsuario.addEventListener('click', () => {
      if (this.usuarioActual) {
        // Menú contextual simple
        const menu = document.createElement('div');
        menu.className = 'absolute right-0 top-12 bg-surface-container border border-outline-variant p-4 z-50 min-w-[200px]';
        menu.innerHTML = `
          <p class="text-on-surface font-bold mb-1">${this.usuarioActual.nombre}</p>
          <p class="text-on-surface-variant text-xs mb-4">${this.usuarioActual.rol.toUpperCase()}</p>
          ${this.usuarioActual.esAdmin() ? `<a href="../admin/admin.html" class="block text-primary text-sm mb-3 hover:underline">Panel Admin</a>` : ''}
          <button id="btn-logout" class="text-red-400 text-sm hover:underline">Cerrar Sesión</button>
        `;
        const container = btnUsuario.parentElement;
        container.style.position = 'relative';

        const existing = container.querySelector('.absolute');
        if (existing) { existing.remove(); return; }

        container.appendChild(menu);
        menu.querySelector('#btn-logout')?.addEventListener('click', () => {
          this.logout();
          menu.remove();
        });
        document.addEventListener('click', (e) => {
          if (!menu.contains(e.target) && e.target !== btnUsuario) menu.remove();
        }, { once: true });
      } else {
        Renderer.mostrarModalSesion((email, pass) => this.login(email, pass));
      }
    });
  },

  /**
   * Actualiza el ícono y tooltip del botón de usuario según sesión activa.
   * @private
   */
  _actualizarUIUsuario() {
    const btnUsuario = document.getElementById('btn-usuario');
    if (!btnUsuario) return;

    if (this.usuarioActual) {
      const icon = btnUsuario.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'account_circle';
      btnUsuario.title = this.usuarioActual.nombre;
      btnUsuario.classList.add('text-primary');
    } else {
      const icon = btnUsuario.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'person';
      btnUsuario.title = 'Iniciar sesión';
      btnUsuario.classList.remove('text-primary');
    }
  }
};
