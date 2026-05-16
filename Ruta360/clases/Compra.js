/**
 * clases/Compra.js
 * Clase Carrito de Compras — gestiona los items seleccionados por el usuario.
 * Una Compra activa se convierte en Venta al ser procesada.
 */
class Compra {
  /**
   * @param {string} usuarioId - ID del usuario dueño del carrito
   */
  constructor(usuarioId = null) {
    this.id = `compra-${Date.now()}`;
    this.usuarioId = usuarioId;
    this.items = []; // Array de { bicicleta: Bicicleta, cantidad: number }
    this.fechaCreacion = new Date().toISOString();
    this.codigoDescuento = null;
    this.porcentajeDescuento = 0;
  }

  // ── GESTIÓN DE ITEMS ─────────────────────────────────────────────────────

  /**
   * Agrega un producto al carrito. Si ya existe, incrementa la cantidad.
   * @param {Bicicleta} bicicleta
   * @param {number} cantidad
   */
  agregarProducto(bicicleta, cantidad = 1) {
    const itemExistente = this.items.find(i => i.bicicleta.id === bicicleta.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.items.push({ bicicleta, cantidad });
    }

    this._persistir();
  }

  /**
   * Elimina completamente un producto del carrito por su ID.
   * @param {string} bicicletaId
   */
  eliminarProducto(bicicletaId) {
    this.items = this.items.filter(i => i.bicicleta.id !== bicicletaId);
    this._persistir();
  }

  /**
   * Actualiza la cantidad de un item. Si llega a 0, lo elimina.
   * @param {string} bicicletaId
   * @param {number} nuevaCantidad
   */
  actualizarCantidad(bicicletaId, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
      this.eliminarProducto(bicicletaId);
      return;
    }
    const item = this.items.find(i => i.bicicleta.id === bicicletaId);
    if (item) {
      item.cantidad = nuevaCantidad;
      this._persistir();
    }
  }

  /**
   * Vacía completamente el carrito.
   */
  vaciarCarrito() {
    this.items = [];
    this.codigoDescuento = null;
    this.porcentajeDescuento = 0;
    this._persistir();
  }

  // ── CÁLCULOS ─────────────────────────────────────────────────────────────

  /**
   * Calcula el subtotal sin descuentos ni impuestos.
   * @returns {number}
   */
  calcularSubtotal() {
    return this.items.reduce((acc, item) => acc + (item.bicicleta.precio * item.cantidad), 0);
  }

  /**
   * Calcula el monto de descuento aplicado.
   * @returns {number}
   */
  calcularDescuento() {
    return this.calcularSubtotal() * (this.porcentajeDescuento / 100);
  }

  /**
   * Calcula el IVA (8%).
   * @returns {number}
   */
  calcularImpuestos() {
    return (this.calcularSubtotal() - this.calcularDescuento()) * 0.08;
  }

  /**
   * Calcula el envío (gratis si supera $5000).
   * @returns {number}
   */
  calcularEnvio() {
    return this.calcularSubtotal() > 0 ? (this.calcularSubtotal() > 5000 ? 0 : 45) : 0;
  }

  /**
   * Calcula el total final incluyendo descuentos, impuestos y envío.
   * @returns {number}
   */
  calcularTotal() {
    return this.calcularSubtotal() - this.calcularDescuento() + this.calcularImpuestos() + this.calcularEnvio();
  }

  /**
   * Cuenta el total de unidades en el carrito.
   * @returns {number}
   */
  totalItems() {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }

  /**
   * Verifica si el carrito está vacío.
   * @returns {boolean}
   */
  estaVacio() {
    return this.items.length === 0;
  }

  // ── DESCUENTOS ────────────────────────────────────────────────────────────

  /**
   * Códigos de descuento válidos.
   */
  static CODIGOS_VALIDOS = {
    'RUTA10': 10,
    'BICI20': 20,
    'APEX15': 15
  };

  /**
   * Aplica un código de descuento si es válido.
   * @param {string} codigo
   * @returns {{ exito: boolean, mensaje: string }}
   */
  aplicarCodigoDescuento(codigo) {
    const codigoUpper = codigo.toUpperCase().trim();
    const descuento = Compra.CODIGOS_VALIDOS[codigoUpper];

    if (descuento) {
      this.codigoDescuento = codigoUpper;
      this.porcentajeDescuento = descuento;
      this._persistir();
      return { exito: true, mensaje: `¡Descuento del ${descuento}% aplicado!` };
    } else {
      return { exito: false, mensaje: 'Código de descuento inválido.' };
    }
  }

  // ── PERSISTENCIA ──────────────────────────────────────────────────────────

  /**
   * Guarda el carrito en localStorage (solo los datos serializables).
   */
  _persistir() {
    const data = {
      id: this.id,
      usuarioId: this.usuarioId,
      items: this.items.map(i => ({
        bicicletaId: i.bicicleta.id,
        cantidad: i.cantidad
      })),
      codigoDescuento: this.codigoDescuento,
      porcentajeDescuento: this.porcentajeDescuento
    };
    localStorage.setItem('ruta360_carrito', JSON.stringify(data));
  }

  /**
   * Restaura el carrito desde localStorage usando el catálogo provisto.
   * @param {Map<string, Bicicleta>} catalogo - Mapa de id => Bicicleta
   * @returns {Compra}
   */
  static cargarDesdeStorage(catalogo) {
    const compra = new Compra();
    try {
      const data = JSON.parse(localStorage.getItem('ruta360_carrito'));
      if (!data) return compra;

      compra.id = data.id;
      compra.usuarioId = data.usuarioId;
      compra.codigoDescuento = data.codigoDescuento;
      compra.porcentajeDescuento = data.porcentajeDescuento ?? 0;

      data.items.forEach(item => {
        const bicicleta = catalogo.get(item.bicicletaId);
        if (bicicleta) {
          compra.items.push({ bicicleta, cantidad: item.cantidad });
        }
      });
    } catch (e) {
      console.warn('No se pudo restaurar el carrito:', e);
    }
    return compra;
  }
}
