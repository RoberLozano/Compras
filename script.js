
//Store information about your firebase so we can connect

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//IMPORTANT: REPLACE THESE WITH YOUR VALUES (these ones won't work)
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var config = {
  apiKey: "AIzaSyAuYTgzpd8BydHMLmx4mNhDb-bKGYVZfNo",
  authDomain: "compras-rls777.firebaseapp.com",
  databaseURL: "https://compras-rls777.firebaseio.com/",
  projectId: "compras-rls777",
  storageBucket: "compras-rls777.appspot.com",
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//initialize your firebase
firebase.initializeApp(config);
var database = firebase.database();

var fbListasCollection = database.ref('/listas/');
var fbActual;

//para deshacer
var lastArticulo;
//SELECTS

// el select guay
$('selectpicker').selectpicker();

//tabla
// $('#table_id').DataTable();


//Carga las Listas (listas) al principio
fbListasCollection.on('value', function (listas) {

  $("#listas").children().remove();
  //this is saying foreach Lista do the following function...
  listas.forEach(function (firebaseListaReference) {
    //this gets the actual data (JSON) for the Lista.
    var lista = firebaseListaReference.key;
    console.log(lista); //check your console to see it!
    // addLista(lista);
    addElement2Select(lista, "listas")
  });
});

var colAntes = ""
var colDespues = "";

$('#columnas').on('show.bs.select', function (e) {
  console.log("aparece " + $('#columnas').val());
  colAntes = $('#columnas').val()
});

//para tabla listas
$('#columnas').on('hidden.bs.select', function (e) {
  console.log("se esconde " + $('#columnas').val());
  colDespues = $('#columnas').val()
  console.log(colAntes + "->" + colDespues);

  if (colAntes.join(',') == colDespues.join(',')) return; //si son iguales no hago nada
  // si no son iguales vuelvo a cargar con las nuevas columnas
  createHeader()
  tablaLista();
});

function buscar() {
  let x = document.getElementById("buscador");

  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


function isNumber(value) {
  if (value instanceof Number)
    return true
  else
    return !isNaN(value);
}

function quitarNumero(str) {
  var s = str.substring(str.search(separador) + 1);
  return s;
}
function añadir() {
  nuevoArticulo(new Articulo("nombre", "cantidad", "marca", "EAN=0"));
}

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });

  chart.update();
}


//MIAS

//FULLSCREEN

function pantalla() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

//DARKMODE
function dark() {
  var element = document.body;
  element.classList.toggle("dark-mode");
  //  document.getElementById('tabla').classList.toggle("table-dark");
  document.getElementById('tabla').classList.toggle("dark-mode");
  // $("i").toggleClass("dark-mode");



  // $('#tabla').DataTable();

}


var objetoActual = "";

function cargarLista() {
  console.log($("#listas").val());
  var fbListaActual = database.ref('/listas/' + $("#listas").val());
  // fbListaActual.orderByChild("valor").on('value',function(listas){
  fbListaActual.on('value', function (listas) {

    // let visibles = ["nombre", "unidades", "precio", "total"]
    visibles = $("#columnas").val();
    var articulos = [];

    listas.forEach(function (firebaseListaReference) {
      //this gets the actual data (JSON) for the order.
      // var order = firebaseOrderReference.val().nombre;
      // var precio = firebaseOrderReference.val().precioF;
      let a = firebaseListaReference.val();
      var clase = ArticuloLista;
      // var art = new ArticuloLista(a.nombre);
      var art = new clase(a.nombre);
      art.setAll(a);

      // console.log(a); //check your console to see it!
      articulos.push(art);
    });

    //poner el header
    createHeader();
    // poblar la tabla
    tablaLista(articulos);
    console.log(articulos);


    // $('#header').css('textTransform', 'capitalize');
  });

  $("#beta").html($("#listas").val())
  // $('#myTable').css('textTransform', 'capitalize');
}

var lastLista;
function tablaLista(lista) {
  if (lista) lastLista = lista
  else lista = lastLista

  var visibles = $("#columnas").val();

  // visibles.push(v);

  clear();
  for (a of lista) {
    console.log(a);
    objetoTabla(a, "myTable", visibles)
  };

  checkContexto(); //para los botones de copy paste
}


/** Crea una fila en una tabla con las propiedades de objeto
 * 
 * @param {Object} object el objeto que creará la fila
 * @param {string} tabla id de la tabla
 * @param {string[]} visibles la lista de nombres de propiedades a mostrar
 */
function objetoTabla(object, tabla, visibles) {
  var table = document.getElementById(tabla);
  var row = table.insertRow();

  var i = 0
  //el checkbox siempre
  creaCelda(object, 'ok');
  if (visibles) //si solo se han de mostrar los visibles
    for (key of visibles) {//Esto serían todas
      var cell = creaCelda(object, key);
    }
  else { //si se muestran todos
    for (key in object) {//Esto serían todas daría problemas con encabezado y decolocaría NO USAR por ahora
      var cell = creaCelda(object, key);
    }

  }

  /** Crea una celda con la propiedead de un objeto
   * 
   * @param {Object} object el objeto que creará la fila 
   * @param {string} key la propiedad del objeto que se mostrará en al celda
   */
  function creaCelda(object, key) {

    var cell = row.insertCell(i);

    let valor;
    // if (i == 0)
    //   id = object[key];
    id = object.id;
    valor = object[key];
    if (valor === undefined) //si no existe ese valor, imprime un string vacío
      valor = "";

    if (key == "ok") {
      valor = (valor == 'true') ? true : false;

      valor = `<label>
      <input type="checkbox" id="cb${id}"  ${valor ? "checked" : ""} />
      <span></span>
    </label>`
      // variable is a boolean
      // valor = valor ? `<input type="checkbox" ${valor?"checked":""}  onchange = "AutoCalculateMandateOnChange(this) />` : `<label>
      //   <input type="checkbox" />
      //   <span></span>
      // </label>`
      // console.log(`VALOR: ${valor}`);

    }
    cell.innerHTML = `<i data-toggle="tooltip"  id="${id}|${key}" title="${key}"> ${valor}</i>`
    // cell.innerHTML = '<i data-toggle="tooltip"  id="' + id + "|" + key + "|" + valor + '" title=' + key + '>' + valor + '</i>';
    crearEventos(object, cell, key);
    i++;
    return cell;
  }
}

function abrirOpciones() {
  //TODO:
}

function guardarOpciones() { }

function guardarUsuario(usuario, email) {

  usuario = $("#usuario").val();
  email = $("#email").val();

  // if(!!usuario) console.log("usuario",usuario);
  // if(!!email)   console.log("email",email);
  if (!!usuario) localStorage.setItem("usuario", usuario)
  if (!!email) localStorage.setItem("email", email)
}




// console.log(document.getElementById("columnas").options.foreach(x=> x.name));

/**Da un array con todos los nombres de las columnas
 * puede servir para editar esos valores solo
 * @see{editar}
 * @see{editarObjeto}
 * 
 * @returns un string[] con los nombres
 */
function darColumnas() {
  var todasColumnas = [];
  $('#columnas > option').each(function () {
    todasColumnas.push(this.text);
  });
  return todasColumnas;
}

function crearEventos(objeto, cell, key) {

  if (key == "ok") {
    let cb = document.getElementById("cb" + objeto.id);
    cb.addEventListener('change', function () {
      objeto.ok = this.checked;
      //TODO: guardarlo inmediatamente?
      objeto.guardar()
    });
  }
  else //TODO change localStorage to op
    // if (localStorage.marcaSpan && key=="nombre" && objeto.marca) {
    if (key == "nombre" && objeto.marca) {
      cell.innerHTML +=
        ` <span class="new badge" data-badge-caption="${objeto.marca}"> </span>`
      //   `<div class="chip">
      //   ${objeto.marca}
      // </div>`

    }
    else

      if (key == "total") {
        // console.log(objeto+ " a borrar");
        cell.addEventListener('click', function () {
          // objeto.borrar();
          // cell.parentElement.classList.add("selec");
          sel(objeto, cell); //selecciona o deselecciona si ya lo está
        });
      }
      else { //si  no es ok
        cell.addEventListener('click', function () {
          // editar(objeto, "modal", visibles)
          editar(objeto, "modal") //por ahora editar todas, luego poner opcion en menú
          // $('#modal1').modal('open');
        });
      }

}



/**
* Saves a new articulo to the Firebase DB.
*/
function nuevoArticulo(articulo, lista) {

  // // Get a key for a new Post.
  // var newPostKey = database.ref('/listas/' + $("#listas").val()).push().key;
  // // Write the new post's data simultaneously in the posts list and the user's post list.
  // var updates = {};
  // updates['/listas/'+$("#listas").val()+"/" + newPostKey] = articulo;
  // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  // return firebase.database().ref().update(updates);

  let ruta = '/listas/' + $("#listas").val();

  var newPostRef = database.ref(ruta).push();

  articulo = articulo.listar(ruta, newPostRef.key, "Rober", articulo.unidades, articulo.precio);
  // articulo.id=newPostRef.key;
  newPostRef.set(articulo)
  lastArticulo = articulo

}

function borrarArticulo(a = lastArticulo, lista) {
  console.log(a);

  let ruta = `/listas/${$("#listas").val()}/${a.id}`
  console.log(ruta);
  database.ref(ruta).remove()
}

function guardarArticulo(articulo, lista) {
  let ruta = '/listas/' + $("#listas").val();
  var ref = database.ref(ruta).child(articulo.id)
  ref.set(articulo)
}


function aceptarEAN(){
  console.log($("#dbr"));
  
  console.log("EAN-->"+$("#dbr").html());
  console.log("EAN-->"+EAN);
  
  $("#editEAN").val($("#dbr").val());
}

/**
 * 
 * @param {Articulo} objeto el articulo a editar
 * @param {modal} editor el contexto de la ventana modal que aparecera para editar
 * @param {string[]} propiedades lista de las propiedades a editar,
 *                                si null o undefined muestra todas
 * @fires editarObjeto
 * @see {@link editarObjeto}
 */
function editar(objeto, editor, propiedades) {
  var editor = document.getElementById(editor);
  const backup = editor.innerHTML;
  console.log(backup);

  editor.innerHTML = ""; //clear editor
  if (propiedades)
    for (key of propiedades) {
      editor.innerHTML = editor.innerHTML + ' <b>' + key.toUpperCase() + '</b>' +
        `<input data-toggle="tooltip"  id="edit${key}" value='${objeto[key]}' title="${key}" >`
    }
  else
    for (key in objeto) {
      editor.innerHTML = editor.innerHTML + ' <b>' + key.toUpperCase() + '</b>' +
        `<input data-toggle="tooltip"  id="edit${key}" value='${objeto[key]}' title="${key}" >`
    }

  // editor.innerHTML = editor.innerHTML + '<button onclick="editarObjeto(objeto)">Guardar</button>'

  $("#editEAN").on("click", function () {
    console.log("click en ean");

    var cam = M.Modal.getInstance(document.getElementById("modalcamara"));
    cam.open();
  });

  $("#ok").on("click", function () {
    editarObjeto(objeto)
    objeto.guardar();
  });

  var instance = M.Modal.getInstance(document.getElementById("modal1"));
  instance.open();

}

/** Guarda los cambios de edición que se hacen en la ventana modal en el artículo
 * 
 * @param {Articulo} objeto el articulo en que se guardaran los cambios editados
 * @param {string[]} propiedades lista de las propiedades a editar,
 *                                si null o undefined edita todas
 * @see {@link editar}
 */
function editarObjeto(objeto, propiedades) {
  for (key in objeto) {
    var valor = $('#edit' + key).val();
    if (isNumber(valor)) objeto[key] = +valor;
    else objeto[key] = valor;
  }
}


function createHeader(header = "header") {
  visibles = $("#columnas").val()
  console.log("VISIBLES:" + visibles);

  var th = document.getElementById(header);
  th.innerHTML = ""; //clear header
  var row = th.insertRow(0);
  //el primero el chechbox
  var cb = row.insertCell(0);
  cb.innerHTML = `<label>
                    <input type="checkbox" />
                    <span></span>
                  </label>`
  for (var i in visibles) { //+1 del checkbox que es el 0
    var cell = row.insertCell(+i + 1);
    if (visibles[i] == "unidades") //TODO: ñapa
      cell.innerHTML = '<b>' + "ud" + '</b>';
    else
      cell.innerHTML = '<b>' + visibles[i] + '</b>';
  }
  // if (header === "header") {//si es listas
  //   // El total si sale siempre cambiar cuando se aplique tb a inventario
  //   // a no ser que ponga el peso total
  //   cell = row.insertCell();
  //   cell.innerHTML = '<b>' + "TOTAL" + '</b>';
  //   th.appendChild(row);
  // }

}

function clear() {
  $("#myTable").children().remove();

  // var tb = document.getElementById('myTable');
  //       while(tb.rows.length > 0) {
  //       tb.deleteRow(0);
  //       }
}

// addElement2Select("HOLA","listas")

/**
 * Añade un elemento a un select
 * @param {string} element a añadir
 * @param {select} select id del select
 */
function addElement2Select(element, select) {
  var x = document.getElementById(select);
  var option = document.createElement("option");
  option.text = element;
  x.add(option);
}

function writeLista(userId, name, valor) {
  // var name = $('#campoNombre').val();
  // fbListasCollection.child(name).set({
  //   nombre: name, //another way you could write is $('#myForm [name="fullname"]').
  //   tipo: $('#tipo').val(),
  //   valor: $('#campoValor').val(), //another way you could write is $('#myForm [name="fullname"]').

  // });
}

//BUSCAR
$("#buscar").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#myTable tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

//#region edición

var selected = [];
var copiado = [];


function checkContexto() {
  if (selected.length < 1) {
    $("#fb-copiar").hide();
    $("#fb-cortar").hide();
    $("#fb-eliminar").hide();

  }
  else {
    $("#fb-copiar").show();
    $("#fb-cortar").show();
    $("#fb-eliminar").show();
  }

  if (copiado.length < 1) {
    $("#fb-pegar").hide();
  }
  else {
    $("#fb-pegar").show();
  }


}

/**
 * 
 * @param {Object} objeto el objeto seleccionado
 * @param {Cell} celda la celda sobre la que se actúa
 */
function sel(objeto, celda) {

  console.log(selected);
  var pos = selected.indexOf(objeto);
  console.log("pos:" + pos);
  if (pos > -1) { //deselecciono si ya está
    selected.splice(pos, 1);
    celda.parentElement.classList.remove("selec"); //quito la clase de seleccionado
  }
  else { //si no está lo selecciono
    selected.push(objeto);
    celda.parentElement.classList.add("selec");//pongo formato seleccionado
  }

  checkContexto();
  console.log(selected);

}

// function seleccionar(objeto) {
//   console.log(selected);
//   var pos = selected.indexOf(objeto);
//   console.log("pos:" + pos);
//   if (pos > -1) return; //ya está seleccionado
//   selected.push(objeto);
//   console.log(selected);
// }

// function deseleccionar(objeto) {
//   var pos = selected.indexOf(objeto);
//   console.log("Encontrado en pos:" + pos);
//   if (pos > -1) selected.splice(pos, 1);
//   console.log(selected);

// }

function copiar() {
  copiado = selected;
  checkContexto();
}

function cortar() {
  // copiado.push(objetoActual);
  copiar();
  eliminar();
  // pj.inventario.navegar(nav).sacar(objetoActual);
  // pj.save();
  // cargarPersonaje(true);
}

function eliminar() {
  selected.forEach(element => {
    element.borrar();
  });
  // $("#fb-pegar").hide();

  // M.toast({html: selected.length +" eliminados"})
  M.toast({ html: `${selected.length} eliminado${selected.length > 1 ? 's' : ''}` })
  selected = [];
  checkContexto();

}

function pegar() {
  copiado.forEach(element => {
    nuevoArticulo(element);
  });
  // copiado = [];
  selected = [];
  checkContexto();


}



//#endregion



// $(document).ready( function () {
// $('#tabla').DataTable();

//   } );