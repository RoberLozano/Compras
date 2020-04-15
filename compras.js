class Articulo {
        constructor(nombre,unidades,cantidad,precio,usuario,lista) {
			this.nombre = nombre
			this.unidades = unidades
			this.cantidad = cantidad
			this.precio = precio
			this.usuario = usuario
			this.lista = lista
    }

	setAll(o) {
        for (let key in o) {
            this[key] = o[key];
        }
    }
}
