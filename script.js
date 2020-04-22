
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
  nuevoArticulo(new Articulo("nombre", "cantidad", "marca", "ENA=0"));
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
  $("i").toggleClass("dark-mode");



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
      var art= new clase(a.nombre);
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
  if (visibles) //si solo se han de mostrar los visibles
    for (key of visibles) {//Esto serían todas
      var cell = creaCelda(object,key);
    }
  else { //si se muestran todos
    for (key in object) {//Esto serían todas daría problemas con encabezado y decolocaría NO USAR por ahora
      var cell = creaCelda(object,key);
    }

  }

  /** Crea una celda con la propiedead de un objeto
   * 
   * @param {Object} object el objeto que creará la fila 
   * @param {string} key la propiedad del objeto que se mostrará en al celda
   */
  function creaCelda(object,key) {
    var cell = row.insertCell(i);
    let valor;
    if (i == 0)
      id = object[key];
    valor = object[key];
    if (valor === undefined) //si no existe ese valor, imprime un string vacío
      valor = "";

    cell.innerHTML = '<i data-toggle="tooltip"  id="' + id + "|" + key + "|" + valor + '" title=' + key + '>' + valor + '</i>';
    crearEventos(object, cell, key);
    i++;
    return cell;
  }
}

function crearEventos(object, cell, key) {
    cell.addEventListener('click', function () {
      alert("log")
  });

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
  var ref= database.ref(ruta).child(articulo.id)
  ref.set(articulo)
}

/**
 * 
 * @param {Articulo} objeto el articulo a editar
 * @param {modal-context} editor el contexto de la ventana modal que aparecera para editar
 */
function editar(objeto,editor) {

  var editor = document.getElementById(editor);
  editor.innerHTML = ""; //clear editor
  for( key in objeto) {
    editor.innerHTML = editor.innerHTML + ' <b>' + k.toUpperCase() + ':</b>' +
    `<input data-toggle="tooltip"  id="edit${key}" value='${objeto[key]}' title="${key}" >`
  }

  editor.innerHTML = editor.innerHTML + '<button onclick="editarObjeto(objeto)">Guardar</button>'

  $( "#ok" ).on( "click", function() {
    editarObjeto(objeto)
    objeto.guardar();
  });
 
  var instance = M.Modal.getInstance(document.getElementById("modal1"));
  instance.open();

}

/** Guarda los cambios de edición que se hacen en la ventana modal en el artículo
 * 
 * @param {Articulo} objeto el articulo en que se guardaran los cambios editados
 */
function editarObjeto(objeto) {
  for( key in objeto) {
    var valor = $('#edit' + key).val();
    if (isNumber(valor)) objeto[key] = +valor;
    else objeto[key] = valor;
  }
}


function createHeader(header = "header") {
  visibles = $("#columnas").val()
  var th = document.getElementById(header);
  th.innerHTML = ""; //clear header
  var row = th.insertRow(0);
  for (var i in visibles) {
    var cell = row.insertCell(i);
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
  var name = $('#campoNombre').val();
  fbListasCollection.child(name).set({
    nombre: name, //another way you could write is $('#myForm [name="fullname"]').
    tipo: $('#tipo').val(),
    valor: $('#campoValor').val(), //another way you could write is $('#myForm [name="fullname"]').

  });
}

//BUSCAR
$("#buscar").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#myTable tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

//Carga las Listas (listas) al principio
fbListasCollection.on('value', function (listas) {

  $("#listas").children().remove();
  //this is saying foreach Lista do the following function...
  listas.forEach(function (firebaseListaReference) {
    //this gets the actual data (JSON) for the Lista.
    var lista = firebaseListaReference.key;
    // console.log(lista); //check your console to see it!
    // addLista(lista);
    addElement2Select(lista, "listas")
  });
});

// $(document).ready( function () {
// $('#tabla').DataTable();

//   } );