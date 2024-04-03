const historial = "historial"


class HistorialArticulo {
    constructor(articulo) {
		this._articulo = articulo
        this._historial= {}
    }

	get articulo() { return this._articulo}
    set articulo(articulo) { this._articulo =articulo} 

    add(fecha,precio,tienda){
        this._historial[tienda][fecha]=precio;
    }

}


class Historial {
        constructor(source) {
			this.source = source
    }

    daPrecio(id,fecha){}

}

class HistorialLocal extends Historial{
    constructor(source) {
        this.datos=localStorage.getItem(historial);

}

}


