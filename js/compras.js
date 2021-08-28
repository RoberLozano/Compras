const TipoCantidad = {
	PRECIO: "PRECIO",
	MASA: "MASA",
	VOLUMEN: "VOLUMEN",
	UNIDADES: "UNIDADES"
}

/**
 * La constante de Cantidades
 */
const ctds = {
	EUROS: {
		simbolo: "€",
		valor: 100,
		palabras: "(€|euros|euro)",
		tipo: TipoCantidad.PRECIO
	},

	CENTIMOS: {
		simbolo: "C",
		valor: 1,
		palabras: "(sentimos|cms|cm|céntimos|céntimo|centimos|centimo)",
		tipo: TipoCantidad.PRECIO,
	},
	KILO: {
		simbolo: "KG",
		valor: 1000,
		palabras: "(kilogramos|kilos|kilogramo|kilo|kg)",
		tipo: TipoCantidad.MASA
	},
	GRAMO: {
		simbolo: "GR",
		valor: 1,
		palabras: "(gramos|gramo|grs|gr|g)",
		tipo: TipoCantidad.MASA
	},
	CENTILITRO: {
		simbolo: "CL",
		valor: 10,
		palabras: "(centilitros|centilitro|cls|cl)",
		tipo: TipoCantidad.VOLUMEN
	},
	MILITRO: {
		simbolo: "ML",
		valor: 1,
		palabras: "(mililitros|mililitro|mls|ml)",
		tipo: TipoCantidad.VOLUMEN
	},
	LITRO: {
		simbolo: "Li",
		valor: 1000,
		palabras: "(litros|litro| ls| l )",
		tipo: TipoCantidad.VOLUMEN
	},

	UNIDADES: {
		simbolo: "UD",
		valor: 1,
		palabras: "(unidades|unidad|uds)",
		tipo: TipoCantidad.UNIDADES
	},
};


/**
 * El articulo básico
 */
class Articulo {
	/**
	 * 
	 * @param {string} nombre Nombre del producto
	 * @param {string} cantidad cantidad de producto (en gramos, litros, etc)
	 * @param {string} marca 
	 * @param {number} EAN El código de barras, debería ser el id
	 */
	constructor(nombre, cantidad = 0, marca = "", EAN = 0) {
		this.nombre = nombre
		this.cantidad = cantidad
		this.marca = marca
		this.EAN = EAN
	}

	/**
	 * 
	 * @param {string} ctd escanea un string buscando el valor de cantidad
	 * @todo también aceptaria precios y unidades
	 */
	setCantidad(ctd, tipoConcreto) {
		if (isNumber(ctd)) this.cantidad = ctd;
		else this.buscarCantidades(ctd, tipoConcreto);//otra ñapa

		console.log(this);


	}

	//TODO-: ver si hago algo con esto
	// litros da fallo si va seguido del numero
	buscarCantidades(r, tipoConcreto) {
		for (let c in ctds) {

			var simbolo = ctds[c]["simbolo"]
			var valor = ctds[c]["valor"]
			var palabras = ctds[c]["palabras"]
			var tipo = ctds[c]["tipo"]

			// var re = new RegExp(palabras,'i');
			// let s = r.replace(re, simbolo);

			let todo = palabras.replace(" ", "", "g")//me salto los espacios

			// console.log(s);

			// let s=r.replace(/(kilogramos|kilos|kilogramo|kilo|kg)/gi, "KG");
			var n = new RegExp("(\\d+[,\\d+]*)\\s*" + todo, "i")
			let encontrado = r.match(n);

			if (encontrado) {
				console.log(encontrado);
				let numero = encontrado[1].replace(',', '.');
				r = r.replace(encontrado[0], ""); //borramos lo que ya hemos hecho
				console.log(numero);
				var cifra = parseFloat(numero) * valor;
				// console.log(r);

				console.log(cifra + tipo);
				if (tipoConcreto) if (tipoConcreto.lastIndexOf(tipo) < 0) return;

				switch (tipo) {//TODO: mirar si debo sumar cantidades del mismo tipo
					case TipoCantidad.MASA: this.cantidad = cifra;
					case TipoCantidad.VOLUMEN: this.cantidad = cifra;
						break;
					case TipoCantidad.PRECIO: this.precio = cifra;
						break;
					//TODO: unidades
					case TipoCantidad.UNIDADES: this.unidades = cifra;
						break;
					default: console.log("What magnitude is it?");
				}
			}

			// if(s!=r) 
			// console.log("REPLACE: "+s);



			//("(\\d+([,\\s]*\\d+)*\\s*" + simbolo + ")");



		}

	}

	setAll(o) {
		for (let key in o) {
			this[key] = o[key];
		}
	}

	listar(lista, id, usuario, unidades = 1, precio = 0) {
		return new ArticuloLista(this.nombre, this.cantidad, this.marca, this.EAN, precio, unidades, id, lista, usuario);
	}
	/**
	 * Devuelve el EAN si tiene, si no false
	 */
	tieneId() {
		//devuelvo EAN o false si no tiene
		return this.EAN ? this.EAN : false
	}
	/**
	 * Devuelve las propiedades establecidas
	 * @param {boolean} array si se devuelve como un array o como un numero
	 * @returns {number|string[]} el numero de propiedades establecidas o el array con los nombres
	 */
	propiedades(array = false) {
		let count = 0;
		for (let key in this) {
			console.log(key + ":" + this[key]);
			if (this[key]) count++;
		}
		console.log(count);

		return count;
	}

	/**
	 * Rellena el artículo con un dictado de voz
	 * @param {string} dictado el texto dictado
	 */
	dictado(dictado) {
		// unidades = 1;
		// isOk = false;
		//probar sin minusculas a ver
		// var r = dictado.toLowerCase().trim();
		var r = dictado
		r = r + " " //para el caso de que la magnitud (l) esté sin espacio al final

		//TODO: tratar lo de los números como texto
		r = r.replace(" una ", " 1 ");
		r = r.replace(" un ", " 1 ");
		r = r.replace(" dos ", " 2 ");
		r = r.replace(" tres ", " 3 ");


		var p;
		var m;

		var act = 0;
		var index = 99999;

		for (let c in ctds) {
			// const p = '   405,7       euros';
			// const regex = /(euros|euro)/gi;
			// const numeros=/(\d+[,\d+]*)\s*€/;
			// let s=(p.replace(regex, '€'));
			// console.log(s.match(numeros)); > Array ["405,7       €", "405,7"]

			var simbolo = ctds[c]["simbolo"]
			var valor = ctds[c]["valor"]
			var palabras = ctds[c]["palabras"]
			var tipo = ctds[c]["tipo"]

			// console.log(ctds[c]["simbolo"]);
			// console.log(ctds[c]["valor"]);
			// console.log(ctds[c]["palabras"]);

			var re = new RegExp(palabras, 'i');
			let s = r.replace(re, simbolo);

			// console.log(s);

			// let s=r.replace(/(kilogramos|kilos|kilogramo|kilo|kg)/gi, "KG");
			var n = new RegExp("(\\d+[,\\d+]*)\\s*" + simbolo)
			let encontrado = s.match(n);

			if (encontrado) {
				// console.log(encontrado);
				let numero = encontrado[1].replace(',', '.');
				r = s.replace(encontrado[0], ""); //borramos lo que ya hemos hecho
				// console.log(numero);
				var cifra = parseFloat(numero) * valor;
				// console.log(r);

				console.log(cifra + tipo);

				switch (tipo) {//TODO: mirar si debo sumar cantidades del mismo tipo
					case TipoCantidad.MASA:	this.cantidad = cifra;
					break;
					case TipoCantidad.VOLUMEN: this.cantidad = cifra;
						break;
					case TipoCantidad.PRECIO: this.precio = cifra;
						break;
					//TODO: unidades
					case TipoCantidad.UNIDADES: this.unidades = cifra;
						break;
					default: console.log("What magnitude is it?");
				}
			}

			// if(s!=r) 
			// console.log("REPLACE: "+s);



			//("(\\d+([,\\s]*\\d+)*\\s*" + simbolo + ")");



		}
		// console.log(this);
		// console.log(r);

		// var re = new RegExp("marca ");

		let s = r.replace(" marca ", " MARCA ");
		var n = new RegExp("MARCA\\s(.*)")
		let encontrado = s.match(n);
		if (encontrado) {
			console.log(encontrado);

			r = s.replace(encontrado[0], ""); //borramos lo que ya hemos hecho
			this.marca = encontrado[1].trim();
			// console.log(numero);
			// console.log(r);

			console.log(cifra + tipo);
		}

		// console.log(s);

		// let s=r.replace(/(kilogramos|kilos|kilogramo|kilo|kg)/gi, "KG");


		if (!this.nombre) this.nombre = r.trim(); //estaría en minúsculas

	}
	/** Edita el artículo con los valores de open food facts  https://world.openfoodfacts.org/
	 * @param {Object} o el objeto de respuesta de open food
	 */
	openFood(aEAN) {
		if (aEAN.code) this.EAN = aEAN.code;
		if (aEAN.product.product_name_es || aEAN.product.product_name)
			this.nombre = aEAN.product.product_name_es || aEAN.product.product_name
		if (aEAN.product.brands) this.marca = aEAN.product.brands
		if (aEAN.product.quantity) {this.cantidad = aEAN.product.quantity
									this.dictado(aEAN.product.quantity)// para que te pille los g
									}
	}

	/** Devuelve el Articulo que corresponde con ese EAN
	 * 	o false si no existe
	 * 
	 * @param {number} ean El numero EAN a comprobar
	 * @returns {Articulo|boolean} El articulo con ese EAn o false si no existe (DEVUELVE Promise)
	 */
	static porEAN(ean) {
		return firebase.database().ref('/articulos/EAN/' + ean).once('value').then(function (snapshot) {
			if (!snapshot.val()) {
				console.log("no existe");
				return false;
			}
			let a = new Articulo();
			a.setAll(snapshot.val())
			console.log(a);
			// objetoTabla(a, "myTable", visibles)
			return a;
		});
	}

	/**Comprueba que dos articulos son iguales
	 * 
	 * @param {Articulo} articulo el articulo con el cual comparar
	 * @returns true si el articulo es igual o false si no
	 */
	igual(articulo){
		if(this.nombre && this.nombre === a.nombre) return true;
		if(this.nombre === a.nombre && this.cantidad === a.cantidad && this.marca === a.marca) return true;
		return false;
	}

	similar(articulo){
		if(this.nombre === a.nombre){}

	}
}


class ArticuloLista extends Articulo {
	constructor(nombre, cantidad, marca, EAN = 0, precio, unidades, id, lista, usuario = "", ok = false) {
		super(nombre, cantidad, marca, EAN);
		this.unidades = unidades
		this.precio = precio ? precio : 0; //por si es null o undefined
		if(id) this.id = id;
		if(lista) this.lista = lista;
		this.total = unidades * precio;
		if(ok) this.ok = ok;
	}

	/**
	 * Divide el total entre el número de unidades y pone ese precio
	 */
	set total(t) {
		let pu = +t / this.unidades
		// console.log(pu);
		if (!isNaN(pu)) this.precio = pu;
	}

	get total() {

		if (this.descuento) { //si hay descuento
			let precioInicial = this.precio * this.unidades;
			let descuento = Math.trunc(this.unidades / this.descuento.unidades) * (this.descuento.descuento / 100) * this.precio
			console.log(this.unidades / this.descuento.unidades + "x" + this.descuento.descuento / 100 + " desc:" + descuento);

			return precioInicial - descuento;
		}
		return this.precio * this.unidades;
	}

	precioCantidad(){
		if(this.precio && this.cantidad) return roundTo(2,this.precio/parseInt(this.cantidad)*10);
	}

	setDescuento(descuento, unidades) {
		this.descuento = new Descuento(descuento, unidades);
	}

	quitarDescuento() {
		delete this.descuento;
	}


	guardar() {
		console.log(`Articulo ${this.nombre} guardado en ${this.lista}  ${this.id} `);
		var ref = database.ref(this.lista).child(this.id)
		ref.set(this)
		console.log(this);
		// guardarArticulo(this);
	}

	borrar() {
		console.log(`Articulo ${this.nombre} borrado de ${this.lista}`);
		// borrarArticulo(this);
		var ref = database.ref(this.lista).child(this.id)
		ref.remove()

	}
	/**Guardamos el articulo en 'articulos/EAN/[EAN]' 
	 */
	guardarEAN() {
		if (!this.EAN) return;

		//Si ponemos este objeto metemos demasiada info
		// console.log(`Articulo ${this.nombre} guardado con EAN ${this.EAN}`);
		// var ref = database.ref("/articulos/EAN/").child(this.EAN)
		// ref.set(this)
		// console.log(this);

		let a = new Articulo(this.nombre, this.cantidad, this.marca, this.EAN)
		console.log(`Articulo ${this.nombre} guardado con EAN ${this.EAN}`);
		var ref = database.ref("/articulos/EAN/").child(this.EAN)
		ref.set(a)
		console.log(a);

	}

	/** Asigna el precio de la suma de las unidades, para que se divida entre estas
	 * 
	 * @param {number} pt precio total de todas las unidades
	 * @deprecated total debería hacer mejor función
	 */
	precioTotal(pt) {
		this.precio = pt / this.unidades;
	}
}

//Hacer el truco para que lo pille como property

// Object.defineProperty(ArticuloLista, 'total', {
// 	get() {
// 		return this.precio*this.unidades;
// 	},

// 	set(t) {
// 		let pu=+t/this.unidades
// 			console.log(pu);
// 		if(!isNaN(pu)) this.precio=pu;
// 	}
//   });

class Tienda {
		constructor(nombre,direccion,grupo,localizacion) {
			this.nombre = nombre
			this.direccion = direccion
			this.grupo = grupo
			this.localizacion = localizacion
	}
}

class Descuento {
	/**
	 * 
	 * @param {number} descuento el % de descuento
	 * @param {number} unidades cada cuantas unidades se hace el descuento 
	 * 							ej: (2) en la segunda unidad ese descuento
	 */
	constructor(descuento, unidades = 1) {
		this.descuento = descuento
		this.unidades = unidades
	}

	/** Devuelve un descuento 3x2
	 */
	static d3x2() { return new Descuento(100, 3) }

	/** Devuelve un descuento 2x1
	 */
	static d2x1() { return new Descuento(100, 2) }

	static oferta(o) {
		switch (o) {
			case "2x1": return new Descuento(100, 2)
				break;
			case "3x2": return new Descuento(100, 3)
				break;
			case "3x1": return new Descuento(200, 3)
				break;
			case "70% 2ª ud": return new Descuento(70, 2)
				break;
			default:
				break;
		}
	}


}

/**
 * Entidad para la gestión del historial de compras de usuario
 */
class Compra {
	constructor(user, lista, fecha, tienda="") {
		this.user = user
		this.lista = lista
		this.fecha = fecha
		this.tienda = tienda

		let p = 0;
		this.lista.forEach(a => {
			p += a.total;
			//historial de precios
			if(a.EAN && a.precio) new Precio(a.EAN,a.precio,this.fecha,this.tienda).guardar();
		});

		this.gastado= p / 100; //lo doy en €
	}

	guardar(){
		console.log(` ${this.lista.length} articulos guardados en historial de ${this.user} el  ${this.fecha}`);
		var ref = database.ref(`/usuarios/${this.user}/historial/`).child(this.fecha)
		// ref.set(a)
		ref.set(this)
		console.log(this);
	}

}

class ListaCompra {
	constructor(nombre, articulos, usuario) {
		this.nombre = nombre
		this.articulos = articulos
		this.usuario = usuario
	}

	/** Da el precio de TODOS los articulos de la lista*/
	presupuesto() {
		let p = 0;
		this.articulos.forEach(a => {
			console.log(a.nombre);

			p += a.total;
		});

		console.log("PRESUPUESTO:" + p);
		return p / 100; //lo doy en €
	}

	/** Da el precio de TODOS los articulos marcados de la lista*/
	marcados() {
		// console.log("MARCADOS array:");
		// console.log(this.compra());
		let p = 0;
		this.articulos.forEach(a => {
			//no contaría los "true", creo
			if ((a.ok == true) ? true : false) { console.log(a.nombre + ":" + a.total); p += a.total; }
		});

		console.log("MARCADOS:" + p);
		return p / 100;
	}

	/** Devuelve el numero de elementos marcados
	 * 
	 */
	numMarcados() {
		let p = 0;
		this.articulos.forEach(a => {
			//no contaría los "true", creo
			if ((a.ok == true) ? true : false) { console.log(a.nombre + ":" + a.total); p++; }
		});
		return p;
	}

	numTotal() {
		return this.articulos.length
	}

/**
 * Devuelve un objeto Compra con los articulos marcados y fecha actual
 */
	compra(){
		let marcados = articulos.filter((a) => (a.ok == true) );
		return new Compra(this.usuario,marcados, Date.now().toISOString());
	}


}

//TODO: ver si lo hado así o fecha normal y me dejo de mierdas

class Fecha {
	// constructor(base) {
	// 	this.base = base
	// 	var d = +date;
	// 	d = parseInt(d / 1000) //me suda la polla los ms y ahorramos datos
	// 	var e = (+d).toString(base);

	// }
	static string2date(string, base = 16) {
		return new Date(parseInt(string, base));
	}

	static date2string(date, base = 16) {
		return (+date).toString(base)
	}

	static number2date(number) {
		return new Date(number);
	}

	/**Para ordenar por más reciente
	 * @param {Date} date fecha a codificar
	 * @param {Date} max La fecha máxima a la que restar
	 * @param {number} base La base por defecto 16 (hexadecimal)
	 */
	static inverseDate2String(date, max, base = 16) {

		return ((+max) - (+date)).toString(base);

	}

}

class Precio {
		constructor(EAN,precio,fecha,tienda) {
			this.EAN = EAN
			this.precio = precio
			this.fecha = fecha
			if(tienda) this.tienda= tienda
	}

	guardar(){
		var ref = database.ref(`/articulos/precios/historial/`).child(this.EAN).child(this.fecha);
		ref.set(this);


	}

	static cargar(ean){
		
	}
}

// let base = 32;
// var d = new Date();
// // d = parseInt(d / 1000) //me suda la polla los ms y ahorramos datos
// var e = (+d).toString(base);

// let año3000= new Date("3000-01-01")
// console.log(año3000.toISOString());
// console.log(+año3000);
// console.log((+año3000).toString(base));


// console.log(Fecha.date2string(d));
// console.log(e);
// console.log(Fecha.string2date(e, base));
// console.log();
