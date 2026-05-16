/**
 * clases/Usuario.js
 * Clase base de usuario con autenticación y perfil.
 * Admin extiende Usuario con privilegios de gestión.
 */
class Usuario {
  /**
   * @param {string} id - Identificador único
   * @param {string} nombre - Nombre completo
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña (en producción sería hash)
   */
  constructor(id, nombre, email, password) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this._password = password; // Propiedad "privada" por convención
    this.rol = 'usuario';
    this.fechaRegistro = new Date().toISOString();
    this.historialCompras = []; // Array de IDs de Compra
  }

  /**
   * Verifica si la contraseña ingresada es correcta.
   * @param {string} password
   * @returns {boolean}
   */
  verificarPassword(password) {
    return this._password === password;
  }

  /**
   * Registra el ID de una compra en el historial del usuario.
   * @param {string} compraId
   */
  agregarCompra(compraId) {
    this.historialCompras.push(compraId);
  }

  /**
   * Indica si el usuario es administrador.
   * @returns {boolean}
   */
  esAdmin() {
    return this.rol === 'admin';
  }

  /**
   * Serializa el usuario (sin contraseña) para almacenamiento.
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rol: this.rol,
      fechaRegistro: this.fechaRegistro,
      historialCompras: this.historialCompras
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Subclase Admin — extiende Usuario con privilegios de gestión
// ─────────────────────────────────────────────────────────────────────────────
class Admin extends Usuario {
  /**
   * @param {string} id
   * @param {string} nombre
   * @param {string} email
   * @param {string} password
   */
  constructor(id, nombre, email, password) {
    super(id, nombre, email, password);
    this.rol = 'admin'; // Sobreescribe el rol
    this.permisos = ['gestionar_productos', 'ver_ventas', 'gestionar_usuarios', 'ver_reportes'];
  }

  /**
   * Verifica si el admin tiene un permiso específico.
   * @param {string} permiso
   * @returns {boolean}
   */
  tienePermiso(permiso) {
    return this.permisos.includes(permiso);
  }

  /**
   * Actualiza el precio de una bicicleta en el catálogo.
   * @param {Bicicleta} bicicleta
   * @param {number} nuevoPrecio
   */
  actualizarPrecio(bicicleta, nuevoPrecio) {
    if (nuevoPrecio <= 0) throw new Error('El precio debe ser mayor a 0');
    bicicleta.precio = nuevoPrecio;
    console.log(`[Admin] Precio de "${bicicleta.nombre}" actualizado a $${nuevoPrecio}`);
  }

  /**
   * Actualiza el stock de una bicicleta.
   * @param {Bicicleta} bicicleta
   * @param {number} nuevoStock
   */
  actualizarStock(bicicleta, nuevoStock) {
    if (nuevoStock < 0) throw new Error('El stock no puede ser negativo');
    bicicleta.stock = nuevoStock;
    console.log(`[Admin] Stock de "${bicicleta.nombre}" actualizado a ${nuevoStock}`);
  }

  /**
   * Resumen ejecutivo de ventas (para el dashboard).
   * @param {Venta[]} ventas
   * @returns {Object}
   */
  generarResumenVentas(ventas) {
    const totalIngresos = ventas.reduce((acc, v) => acc + v.total, 0);
    const totalUnidades = ventas.reduce((acc, v) => acc + v.compra.totalItems(), 0);
    const ventasCompletadas = ventas.filter(v => v.estado === 'completada').length;

    return {
      totalIngresos,
      totalUnidades,
      ventasCompletadas,
      ventasPendientes: ventas.length - ventasCompletadas,
      promedioOrden: ventas.length > 0 ? (totalIngresos / ventas.length).toFixed(2) : 0
    };
  }
}
