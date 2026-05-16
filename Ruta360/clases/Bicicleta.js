/**
 * clases/Bicicleta.js
 * Clase que representa un producto (bicicleta o accesorio) en el catálogo.
 */
class Bicicleta {
  /**
   * @param {string} id - Identificador único
   * @param {string} nombre - Nombre del producto
   * @param {string} descripcion - Descripción del producto
   * @param {number} precio - Precio en dólares
   * @param {string} categoria - Categoría: 'montana', 'ruta', 'electrica', 'accesorio', 'componente'
   * @param {string} imagen - URL de la imagen
   * @param {string|null} badge - Etiqueta destacada (ej: "NOVEDAD")
   * @param {Object} especificaciones - Especificaciones técnicas
   */
  constructor(id, nombre, descripcion, precio, categoria, imagen, badge = null, especificaciones = {}) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
    this.badge = badge;
    this.especificaciones = especificaciones;
    this.stock = 10; // Stock inicial por defecto
  }

  /**
   * Devuelve el precio formateado como string legible.
   * @returns {string} Ej: "$4,299.00"
   */
  get precioFormateado() {
    return `$${this.precio.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  /**
   * Verifica si el producto está disponible en stock.
   * @returns {boolean}
   */
  estaDisponible() {
    return this.stock > 0;
  }

  /**
   * Reduce el stock en la cantidad indicada.
   * @param {number} cantidad
   */
  reducirStock(cantidad = 1) {
    if (this.stock >= cantidad) {
      this.stock -= cantidad;
    } else {
      throw new Error(`Stock insuficiente para "${this.nombre}"`);
    }
  }

  /**
   * Aumenta el stock (útil para el panel admin).
   * @param {number} cantidad
   */
  aumentarStock(cantidad = 1) {
    this.stock += cantidad;
  }

  /**
   * Serializa la bicicleta a objeto plano (para localStorage).
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      categoria: this.categoria,
      imagen: this.imagen,
      badge: this.badge,
      especificaciones: this.especificaciones,
      stock: this.stock
    };
  }

  /**
   * Crea una instancia de Bicicleta desde un objeto plano.
   * @param {Object} obj
   * @returns {Bicicleta}
   */
  static fromJSON(obj) {
    const b = new Bicicleta(
      obj.id, obj.nombre, obj.descripcion, obj.precio,
      obj.categoria, obj.imagen, obj.badge, obj.especificaciones
    );
    b.stock = obj.stock ?? 10;
    return b;
  }
}
