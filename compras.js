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
		palabras: "(litros|litro| ls|l)",
		tipo: TipoCantidad.VOLUMEN
	},

	UNIDADES: {
		simbolo: "UD",
		valor:  1,
		palabras:"(unidades|unidad|uds)",
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
	setCantidad(ctd,tipoConcreto){
		if (isNumber(ctd)) this.cantidad=ctd;
		else this.buscarCantidades(ctd,tipoConcreto);//otra ñapa

		console.log(this);
		

	}

	//TODO-: ver si hago algo con esto
	// litros da fallo si va seguido del numero
	buscarCantidades(r,tipoConcreto){
		for (let c in ctds) {

			var simbolo = ctds[c]["simbolo"]
			var valor = ctds[c]["valor"]
			var palabras = ctds[c]["palabras"]
			var tipo = ctds[c]["tipo"]

			// var re = new RegExp(palabras,'i');
			// let s = r.replace(re, simbolo);

			let todo=palabras.replace(" ","","g")//me salto los espacios

			// console.log(s);
			
			// let s=r.replace(/(kilogramos|kilos|kilogramo|kilo|kg)/gi, "KG");
			var n = new RegExp("(\\d+[,\\d+]*)\\s*" + todo,"i")
			let encontrado = r.match(n);

			if (encontrado) {
				console.log(encontrado);
				let numero = encontrado[1].replace(',', '.');
				r=r.replace(encontrado[0],""); //borramos lo que ya hemos hecho
				console.log(numero);
				var cifra = parseFloat(numero) * valor;
				// console.log(r);
				
				console.log(cifra + tipo);
				if(tipoConcreto) if (tipoConcreto.lastIndexOf(tipo)<0) return;

				switch (tipo) {//TODO: mirar si debo sumar cantidades del mismo tipo
					case TipoCantidad.MASA:
					case TipoCantidad.VOLUMEN: this.cantidad=cifra;
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
	propiedades(array=false){
		let count=0;
		for (let key in this) {
			console.log(key+":"+this[key]);	
			if(this[key]) count++;
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
		r=r+" " //para el caso de que la magnitud (l) esté sin espacio al final

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

			var re = new RegExp(palabras,'i');
			let s = r.replace(re, simbolo);

			// console.log(s);
			
			// let s=r.replace(/(kilogramos|kilos|kilogramo|kilo|kg)/gi, "KG");
			var n = new RegExp("(\\d+[,\\d+]*)\\s*" + simbolo)
			let encontrado = s.match(n);

			if (encontrado) {
				// console.log(encontrado);
				let numero = encontrado[1].replace(',', '.');
				r=s.replace(encontrado[0],""); //borramos lo que ya hemos hecho
				// console.log(numero);
				var cifra = parseFloat(numero) * valor;
				// console.log(r);
				
				console.log(cifra + tipo);

				switch (tipo) {//TODO: mirar si debo sumar cantidades del mismo tipo
					case TipoCantidad.MASA:
					case TipoCantidad.VOLUMEN: this.cantidad=cifra;
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
		var n = new RegExp("MARCA\\s(.*)" )
		let encontrado = s.match(n);
		if (encontrado) {
			console.log(encontrado);

			r=s.replace(encontrado[0],""); //borramos lo que ya hemos hecho
			this.marca=encontrado[1].trim();
			// console.log(numero);
			// console.log(r);
			
			console.log(cifra + tipo);
		}

		// console.log(s);
		
		// let s=r.replace(/(kilogramos|kilos|kilogramo|kilo|kg)/gi, "KG");


		 if(!this.nombre) this.nombre= r.trim(); //estaría en minúsculas

	}
}


class ArticuloLista extends Articulo {
	constructor(nombre, cantidad, marca, EAN = 0, precio, unidades, id, lista, usuario = "",ok=false) {
		super(nombre, cantidad, marca, EAN);
		this.unidades = unidades
		this.precio = precio ? precio : 0; //por si es null o undefined
		this.id=id;
		this.lista = lista;
		this.total = unidades * precio;
		this.ok =ok;
	}

	guardar(){
		console.log(`Articulo ${this.nombre} guardado en ${this.lista}`);
		guardarArticulo(this);
	}
	borrar(){
		console.log(`Articulo ${this.nombre} borrado de ${this.lista}`);
		borrarArticulo(this);

	}
/** Asigna el precio de la suma de las unidades, para que se divida entre estas
 * 
 * @param {number} pt precio total de todas las unidades
 */
	precioTotal(pt){
		this.precio= pt/this.unidades;
	}
}




