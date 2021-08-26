function roundTo(precision, num) {
  //redondeamos a gramos  
  return +(Math.round(num + "e+" + precision) + "e-" + precision);
}

function isNumber(value) {
  if (value instanceof Number)
    return true
  else
    return !isNaN(value);
}
/**Guarda o consulta un objeto en LocalStorage con JSON
 * 
 * @param {String} nombre Nombre del objeto
 * @param {Object|null} valor El valor a guardar del objero o nada para que lo devuelva
 * @returns El objeto guardado si no se ha indicado valor
 */
function ls(nombre, valor) {
  if (valor) {
    console.log( JSON.stringify(valor));
    localStorage.setItem(nombre, JSON.stringify(valor))
  }
  else {
    return JSON.parse(localStorage.getItem(nombre))
  }
}

/** Escala un valor x entre m1 y M1 a otro valor entre m2 y M2
*  x [m1,M1]->[m2,M2]
* @param {Number} x 
* @param {Number} m1 
* @param {Number} M1 
* @param {Number} m2 
* @param {Number} M2 
*/
function escalar(x, m1, M1, m2, M2) {
  let d1 = M1 - m1;
  let d2 = M2 - m2;
  return (x - m1) * (d2 / d1) + m2;
}

// acts like Array##splice for parent's childNodes
function spliceChildNodes(parent, start, deleteCount /*[, newNode1, newNode2]*/) {
  var childNodes = parent.childNodes;
  var removedNodes = [];

  // If `start` is negative, begin that many nodes from the end
  start = start < 0 ? childNodes.length + start : start

  // remove the element at index `start` `deleteCount` times
  var stop = typeof deleteCount === 'number' ? start + deleteCount : childNodes.length;
  for (var i = start; i < stop && childNodes[start]; i++) {
    removedNodes.push(parent.removeChild(childNodes[start]));
  }

  // add new nodes at index `start`
  if (arguments.length > 3) {
    var newNodes = [].slice.call(arguments, 3);

    // stick nodes in a document fragment
    var docFrag = document.createDocumentFragment();
    newNodes.forEach(function (el) {
      docFrag.appendChild(el);
    });

    // place in `parent` at index `start`
    parent.insertBefore(docFrag, childNodes[start]);
  }

  return removedNodes;
}

/**
 * 
 * @param {string} id La id del select
 * @returns un array con los nombres que aparecen en el select
 */
function nombresSelect(id) {

    var x = document.getElementById(id);
    var nombres = [];
    var i;
    for (i = 0; i < x.length; i++) {
      nombres.push(x.options[i].text)
    }
    
    return nombres

  
}

function alto() {
  return window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

}

function ancho() {
  return window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
}


/**
* Modifica una fecha.
* 
* @param interval  One of: año, mes, dia, segundo,...
* @param units  Numero de unidades a añadir o restar, si negativas.
*/
Date.prototype.mod = function (interval, units) {
  var ret = new Date(this.valueOf()); //don't change original date
    console.log(interval);
  switch (interval.toLowerCase()) {
    case 'año': ret.setFullYear(ret.getFullYear() + units); break;
    case 'mes': ret.setMonth(ret.getMonth() + units); break;
    case 'semana': ret.setDate(ret.getDate() + 7 * units); break;
    case 'dia': ret.setDate(ret.getDate() + units);console.log('en día'); break;
    case 'hora': ret.setTime(ret.getTime() + units * 3600000); break;
    case 'minuto': ret.setTime(ret.getTime() + units * 60000); break;
    case 'segundo': ret.setTime(ret.getTime() + units * 1000); break;
    default: return ret; break;//en default undefined o pasar la original?
  }
  return ret;
}

/**
 * @returns {String} fecha sin hora (pude dar unos minutos menos)
 */
Date.prototype.fecha = function () {
  return this.toISOString().substring(0, 10)
}


/**
 * @returns {String} fecha con hora ("0007-01-01T00:00:00.000") sin Z
 */
Date.prototype.fechahora = function () {
  return (this.toISOString().slice(0, -1))
}

/**
 * @returns {String} fecha con hora local ("0007-01-01T00:00:00.000") sin Z
 */
 Date.prototype.fechahoraLocal = function () {
  return this.mod('minuto',-this.getTimezoneOffset()).fechahora()
}

/**Busca las diferencias de dos objetos, con respecto al primero
 * 
 * @param {Object} o1 el primer objeto
 * @param {Object} o2 el segundo objeto
 * @param {boolean} verbose false en caso de que no quiera info
 * @param {String} ruta la ruta interna
 * @returns {Number} el número de diferencias
 */
function diferencia(o1, o2,verbose=true,ruta="") {
  let n=0;
  for (k in o1) {
    //si o2[k] no existe saltamos a la siguiente (sumar como diferencia?)
    if((typeof o2[k] === "undefined")) {if(verbose)console.log(`NADA ${ruta} ${k} -> ${o2[k]}`);n++;continue;}
    if(o1[k] instanceof Object){
      n+=diferencia(o1[k],o2[k],verbose,ruta+'/'+k);
    } 
    else
      if (o1[k] != o2[k]) {
        if(verbose)console.log(`${ruta} ${k} ${o1[k]} -> ${o2[k]}`);
        n++
      }  
  }

  return n
}


function sizeJSON(obj) {
  // console.log(JSON.stringify(obj));
  return encodeURI(JSON.stringify(obj)).split(/%..|./).length - 1;
  
}

function probarRnd(f, caras=100,veces=100) {
  let resultados = [];
  for (let i = 0; i < caras; i++)
	resultados[i] = 0;

  let dado= new Dado("1d6")
for (let i = 0; i < veces; i++) {
	// Alex intenta entender qué hago aquí
	resultados[dado.tirar() - 1]++;
}
console.log(resultados);
  
}

/**Muestra lo que tarda en ejecutarse la función f
 * 
 * @param {Function} f Función
 * @param {} a argumentos
 * @returns {Number} milisegundos de ejecucuón
 */
function time(f,a) {
  let t;
  let t0= Date.now()
  f(a);
  t=Date.now()-t0
  console.log(f.name,t);
  return t;
}

/**Devuelve una copia del objeto de su misma clase
 * 
 * @param {Object} o El objeto a copiar
 * @returns la copia del objeto
 */
function copiar(o) {
  let copia;
  // eval(`copia = new ${o.constructor.name}()`); //elegir uno
  copia = (Function('return new ' + o.constructor.name))() 
  for (let key in o) 
    copia[key] = o[key];
  return copia;
}

/**
 * Guarda el texto como una descarga
 * @param {String} filename nombre del archivo
 * @param {String} text texto del archivo
 */
function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);
  pom.style.display = 'none';
  document.body.appendChild(pom);
  pom.click();
  document.body.removeChild(pom);
}


//cargar archivo con Promise
function uploadText(fileInputId) {
  //Reference the FileUpload element.
  var fileUpload = document.getElementById(fileInputId);
 
    if (typeof (FileReader) != "undefined") {
      var temporaryFileReader = new FileReader();


         //devuelve el objeto 
         return new Promise((resolve, reject) => {
          temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
          };
      
          temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
          };
          temporaryFileReader.readAsText(fileUpload.files[0]);
        });
 
};
}

 async function pjUpload(fileInputId='inputfile'){
  var texto=await uploadText(fileInputId)
    alert(texto);
    pj= Clase.convertir(JSON.parse(texto));
    
    if (pj.fecha){
      console.log(pj.fecha);
      pj.fecha=(new Date(pj.fecha))
      document.getElementById('dtFecha').value= pj.fecha.fechahora()
      act()
    } 
    
    

}


function upload(fileInputId,personaje) {
  //Reference the FileUpload element.
  var fileUpload = document.getElementById(fileInputId);
  var objeto=null;

    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();

      //For Browsers other than IE.
      if (reader.readAsText) {
        reader.onload = function (e) {
         alert(e.target.result);
         //devuelve el objeto 
         personaje= Clase.convertir(JSON.parse(e.target.result));
         console.log(personaje);
         pj=personaje;
         act();
        };
        // reader.readAsBinaryString(fileUpload.files[0]);
        reader.readAsText(fileUpload.files[0]);

      } else {
        //For IE Browser.
        reader.onload = function (e) {
          var data = "";
          var bytes = new Uint8Array(e.target.result);
          for (var i = 0; i < bytes.byteLength; i++) {
            data += String.fromCharCode(bytes[i]);
          }
          console.log(data);
        };
        reader.readAsArrayBuffer(fileUpload.files[0]);
      }
    } else {
      alert("This browser does not support HTML5.");
    }

};

function mayuscula(string) {
  return string[0].toUpperCase() + string.slice(1);
  
}

/** Elimina los diacríticos de un texto (excepto la ñ)
 * 
 * @param {String} texto el texto que normalizar
 * @returns un string sin diacríticos
 */
 function eliminarDiacriticos(texto) {
  return texto
         .normalize('NFD')
         .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
         .normalize();
}

function conNumeros(texto) {
  return texto.replace(' uno',  ' 1')
              .replace(' una',  ' 1')
              .replace(' un',   ' 1')
              .replace(' dos',  ' 2')
              .replace(' tres', ' 3');
}

//#region similitud de cadenas
//similitud de cadenas

/**Similitud de cadenas Jaro-Winkler
 * 
 * @param {string} s1 cadena 1
 * @param {string} s2 cadena 2
 * @param {boolean} sinDiacriticos False si se diferencian diacríticos
 * @returns el coeficiente de similitud
 */
  function jaroWrinker(s1, s2,sinDiacriticos=true) {
  var m = 0;
  if(sinDiacriticos){
    s1= eliminarDiacriticos(s1);
    s2= eliminarDiacriticos(s2);
  }
  // Exit early if either are empty.
  if ( s1.length === 0 || s2.length === 0 ) {
      return 0;
  }

  // Exit early if they're an exact match.
  if ( s1 === s2 ) {
      return 1;
  }

  var range     = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1,
      s1Matches = new Array(s1.length),
      s2Matches = new Array(s2.length);

  for ( i = 0; i < s1.length; i++ ) {
      var low  = (i >= range) ? i - range : 0,
          high = (i + range <= s2.length) ? (i + range) : (s2.length - 1);

      for ( j = low; j <= high; j++ ) {
      if ( s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j] ) {
          ++m;
          s1Matches[i] = s2Matches[j] = true;
          break;
      }
      }
  }

  // Exit early if no matches were found.
  if ( m === 0 ) {
      return 0;
  }

  // Count the transpositions.
  var k = n_trans = 0;

  for ( i = 0; i < s1.length; i++ ) {
      if ( s1Matches[i] === true ) {
      for ( j = k; j < s2.length; j++ ) {
          if ( s2Matches[j] === true ) {
          k = j + 1;
          break;
          }
      }

      if ( s1[i] !== s2[j] ) {
          ++n_trans;
      }
      }
  }

  var weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3,
      l      = 0,
      p      = 0.1;

  if ( weight > 0.7 ) {
      while ( s1[l] === s2[l] && l < 4 ) {
      ++l;
      }

      weight = weight + l * p * (1 - weight);
  }

  return weight;
}

function masParecida(cadena, lista) {
  console.log('mas parecida');
  console.log(cadena, lista);
  var max=0;
  let mejor;
  lista.forEach(l => {
    if(jaroWrinker(cadena,l)>max){
      mejor=l;
    }
  });
}

//#endregion