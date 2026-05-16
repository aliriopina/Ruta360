/**
 * clases/Venta.js
 * Clase Venta — representa una transacción completada.
 * Se genera al procesar un Compra (carrito).
 */
class Venta {
  /**
   * @param {Compra} compra - La compra procesada
   * @param {Usuario} usuario - El usuario que realizó la compra
   */
  constructor(compra, usuario) {
    this.id = `venta-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    this.compra = compra;
    this.usuario = usuario;
    this.fecha = new Date().toISOString();
    this.estado = 'completada'; // 'completada' | 'pendiente' | 'cancelada'
    this.subtotal = compra.calcularSubtotal();
    this.descuento = compra.calcularDescuento();
    this.impuestos = compra.calcularImpuestos();
    this.envio = compra.calcularEnvio();
    this.total = compra.calcularTotal();
    this.metodoPago = 'tarjeta'; // Podría expandirse
    this.numeroSeguimiento = this._generarSeguimiento();
  }

  /**
   * Genera un número de seguimiento aleatorio.
   * @private
   * @returns {string}
   */
  _generarSeguimiento() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix = Array.from({ length: 3 }, () => letras[Math.floor(Math.random() * letras.length)]).join('');
    const numeros = Math.floor(100000 + Math.random() * 900000);
    return `R360-${prefix}${numeros}`;
  }

  /**
   * Devuelve la fecha formateada legible.
   * @returns {string}
   */
  get fechaFormateada() {
    return new Date(this.fecha).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  /**
   * Devuelve el total formateado como string.
   * @returns {string}
   */
  get totalFormateado() {
    return `$${this.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  /**
   * Cancela la venta y devuelve el stock a los productos.
   */
  cancelar() {
    if (this.estado === 'cancelada') {
      throw new Error('La venta ya fue cancelada.');
    }
    // Devolver stock
    this.compra.items.forEach(item => {
      item.bicicleta.aumentarStock(item.cantidad);
    });
    this.estado = 'cancelada';
  }

  /**
   * Resumen de los items de la venta (para mostrar en UI).
   * @returns {Array<{nombre: string, cantidad: number, subtotal: number}>}
   */
  resumenItems() {
    return this.compra.items.map(item => ({
      nombre: item.bicicleta.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.bicicleta.precio,
      subtotal: item.bicicleta.precio * item.cantidad
    }));
  }

  /**
   * Serializa la venta para localStorage.
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      usuarioId: this.usuario?.id,
      usuarioNombre: this.usuario?.nombre,
      fecha: this.fecha,
      estado: this.estado,
      subtotal: this.subtotal,
      descuento: this.descuento,
      impuestos: this.impuestos,
      envio: this.envio,
      total: this.total,
      numeroSeguimiento: this.numeroSeguimiento,
      items: this.resumenItems()
    };
  }
}
