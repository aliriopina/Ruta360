/**
 * clases/Usuario.js
 * Clase base de usuario con autenticación, perfil e historial de compras.
 * Admin extiende Usuario con privilegios de gestión.
 */
class Usuario {
  constructor(id, nombre, email, password) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this._password = password;
    this.rol = 'usuario';
    this.fechaRegistro = new Date().toISOString();
    this.historialCompras = []; // Array de objetos de venta completos
  }

  verificarPassword(password) {
    return this._password === password;
  }

  agregarCompra(ventaObj) {
    this.historialCompras.push(ventaObj);
    this._persistirHistorial();
  }

  _persistirHistorial() {
    const key = `ruta360_historial_${this.id}`;
    try {
      localStorage.setItem(key, JSON.stringify(this.historialCompras));
    } catch (e) {}
  }

  cargarHistorial() {
    const key = `ruta360_historial_${this.id}`;
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(data)) this.historialCompras = data;
    } catch (e) {}
  }

  esAdmin() { return this.rol === 'admin'; }

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

class Admin extends Usuario {
  constructor(id, nombre, email, password) {
    super(id, nombre, email, password);
    this.rol = 'admin';
    this.permisos = ['gestionar_productos', 'ver_ventas', 'gestionar_usuarios', 'ver_reportes'];
  }

  tienePermiso(permiso) { return this.permisos.includes(permiso); }

  actualizarPrecio(bicicleta, nuevoPrecio) {
    if (nuevoPrecio <= 0) throw new Error('El precio debe ser mayor a 0');
    bicicleta.precio = nuevoPrecio;
  }

  actualizarStock(bicicleta, nuevoStock) {
    if (nuevoStock < 0) throw new Error('El stock no puede ser negativo');
    bicicleta.stock = nuevoStock;
  }

  generarResumenVentas(ventas) {
    const totalIngresos = ventas.reduce((acc, v) => acc + v.total, 0);
    const ventasCompletadas = ventas.filter(v => v.estado === 'completada').length;
    return {
      totalIngresos,
      ventasCompletadas,
      ventasPendientes: ventas.length - ventasCompletadas,
      promedioOrden: ventas.length > 0 ? (totalIngresos / ventas.length).toFixed(2) : 0
    };
  }
}
