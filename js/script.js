
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

/** la lista de articulos */
var articulos = [];

/** nombre de lista */
var lista;

/** nombre del usuario  */
var user;



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
    var _lista = firebaseListaReference.key;
    // console.log(lista); //check your console to see it!
    // addLista(lista);
    addElement2Select(_lista, "listas")
  });


  let listaGuardada = localStorage.getItem("ultimaLista");
  if (listaGuardada) {

    lista = listaGuardada;
    document.getElementById("listas").value = lista;
    console.log($("#listas").val());

    console.log(lista);
    // cargarLista();
    cargarLista(listaGuardada);
  }

  // console.log($("#listas"));

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
  // $(".datepicker-calendar-container").toggleClass("dark-mode");
  $(".input").toggleClass("dark-mode");

  // $("i").toggleClass("dark-mode");



  // $('#tabla').DataTable();

}


var objetoActual = "";

function cargarLista(l) {
  console.log("LISTA->" + $("#listas").val());
  var fbListaActual
  if (l) { fbListaActual = database.ref('/listas/' + l); }
  else {
    fbListaActual = database.ref('/listas/' + $("#listas").val());
    localStorage.setItem("ultimaLista", $("#listas").val())
  }
  // fbListaActual.orderByChild("valor").on('value',function(listas){
  fbListaActual.on('value', function (listas) {

    // let visibles = ["nombre", "unidades", "precio", "total"]
    visibles = $("#columnas").val();
    articulos = [];

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

    lista = '/listas/' + $("#listas").val();

    var listaCompra = new ListaCompra(lista, articulos, user);

    listaCompra.marcados();
    listaCompra.presupuesto();



    // poblar la tabla
    tablaLista(listaCompra.articulos);

    // TODO: Un formato decente, pongo cosas en el footer
    $("#footer").html(`  ${listaCompra.numMarcados()}/${listaCompra.numTotal()} marcados,  ${listaCompra.marcados()}/${listaCompra.presupuesto()} €`)
    console.log(listaCompra.articulos);


    // $('#header').css('textTransform', 'capitalize');
  });

  $("#beta").html($("#listas").val())
  lista = '/listas/' + $("#listas").val();
  // M.toast({ html: `${lista} seleccionada` })
  // $('#myTable').css('textTransform', 'capitalize');
}

var lastLista;
function tablaLista(l) {
  // if (lista) lastLista = lista
  // else lista = lastLista

  var visibles = $("#columnas").val();

  // visibles.push(v);

  clear();
  for (a of articulos) {
    // console.log(a);
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
      valor = (valor == true) ? true : false;
      cell.style = "width: 10px;table-layout: fixed";
      valor = `<label>
      <input type="checkbox" id="cb${id}"  ${valor ? "checked" : ""} />
      <span style="padding:0;"></span>
    </label>`
      // variable is a boolean
      // valor = valor ? `<input type="checkbox" ${valor?"checked":""}  onchange = "AutoCalculateMandateOnChange(this) />` : `<label>
      //   <input type="checkbox" />
      //   <span></span>
      // </label>`
      // console.log(`VALOR: ${valor}`);

    }
    cell.innerHTML = `<i data-toggle="tooltip"  id="${id}|${key}" title="${key}">${valor}</i>`
    // cell.innerHTML = '<i data-toggle="tooltip"  id="' + id + "|" + key + "|" + valor + '" title=' + key + '>' + valor + '</i>';
    crearEventos(object, cell, key);
    i++;
    return cell;
  }
}

function abrirOpciones() {
  //TODO:
}

function guardarUsuario(usuario, email) {

  usuario = $("#usuario").val();
  email = $("#email").val();

  // if(!!usuario) console.log("usuario",usuario);
  // if(!!email)   console.log("email",email);
  if (!!usuario) { localStorage.setItem("usuario", usuario); user = usuario }
  if (!!email) localStorage.setItem("email", email)

  cargarOpciones(); //para que refresca el sidenav
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

  //FORMATOS
  if (key == "nombre" && objeto.marca) {
    cell.innerHTML +=
      ` <span class="new badge" data-badge-caption="${objeto.marca}"> </span>`
    //   `<div class="chip">
    //   ${objeto.marca}
    // </div>`

  }

  if (key == "nombre" && objeto.usuario && objeto.usuario != user) {
    console.log(objeto.usuario + "!=" + user);

    cell.innerHTML +=
      ` <span class="new badge red" data-badge-caption="${objeto.usuario}"> </span>`
    //   `<div class="chip">
    //   ${objeto.marca}
    // </div>`

  }


  if (key == "ok") {
    let cb = document.getElementById("cb" + objeto.id);
    cb.addEventListener('change', function () {
      objeto.ok = this.checked;
      console.log(objeto.nombre + " cheched=" + this.checked);

      //TODO: guardarlo inmediatamente?
      objeto.guardar()
    });
  }
  else //TODO change localStorage to op
    // if (localStorage.marcaSpan && key=="nombre" && objeto.marca) {

    if (key == "total") {
      // console.log(objeto+ " a borrar");
      cell.addEventListener('click', function () {
        // objeto.borrar();
        // cell.parentElement.classList.add("selec");
        sel(objeto, cell); //selecciona o deselecciona si ya lo está
        console.log(objeto);

      });
    }
    else {
      cell.addEventListener('click', function () {
        if ($("#cbMostrar").prop("checked")) //si es la opcion del menú
          editar(objeto, "modal", visibles)
        else
          editar(objeto, "modal")
        // $('#modal1').modal('open');
      });
    }

}


function nuevaLista(nombreLista) {

  console.log("nuevalista");

  let d = `
  <h3> Nueva Lista </h3>
  <div class="input-field col s12">
        <input id="nombreLista" type="text" class="validate" placeholder="Nueva Lista">
        <label class="active" for="nombreLista">Nombre</label>
      </div>`

  $("#modal").html(d);

  var instance = M.Modal.getInstance(document.getElementById("modal1"));
  instance.open();
  $("#ok").one("click", function () {
    nombreLista = $("#nombreLista").val();

    let repe = false;
    $("#listas option").each(function () {
      if (nombreLista === $(this).text()) {
        console.log("IGUALES"); repe = true; return;
      }
    });
    if (repe) { alert("Nombre de lista en uso"); return }

    let ruta = '/listas/' + nombreLista + "/";
    var ref = database.ref(ruta);
    ref.set(false);//false porque hay que pasar un argumento
    console.log("NUEVA LISTA " + nombreLista);

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

  articulo = articulo.listar(ruta, newPostRef.key, localStorage.usuario || "Rober", articulo.unidades, articulo.precio);
  // articulo.id=newPostRef.key;
  newPostRef.set(articulo)
  lastArticulo = articulo

}

function borrarLista(lista) {
  //TODO
  alert("Función por implementar");
}

function borrarArticulo(a = lastArticulo, lista) {
  console.log(a);

  let ruta = `/listas/${$("#listas").val()}/${a.id}`
  console.log(ruta);
  database.ref(ruta).remove()
}

function guardarArticulo(articulo, lista) {
  let ruta = '/listas/' + $("#listas").val();
  console.log(articulo);
  console.log(`listas/${$("#listas").val()}  ${articulo.id}`);

  var ref = database.ref(ruta).child(articulo.id)
  ref.set(articulo)
}


function aceptarEAN() {
  console.log($("#dbr"));

  console.log("EAN-->" + $("#dbr").html());
  console.log("EAN-->" + EAN);

  $("#editEAN").val(EAN);
}

/**
 * El nombre de las propiedades que salen en el edit
 */
var edits = []

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
  // console.log(backup);
  edits = [];
  editor.innerHTML = ""; //clear editor
  if (propiedades)
    for (key of propiedades) {
      // editor.innerHTML = editor.innerHTML + ' <b>' + key.toUpperCase() + '</b>' +
      //   `<input data-toggle="tooltip"  id="edit${key}" value='${objeto[key]}' title="${key}" >`

      if (key === "EAN") {
        editor.innerHTML = editor.innerHTML +

            `<div class="input-field col s12">
            <input id="edit${key}" type="${isNumber(objeto[key]) ? "number" : "text"}" class="validate" value="${objeto[key]}">
            <label class="active" for="edit${key}">${key}</label>
          </div>`

    //       `<div class="row">
    //   <div class="input-field col s6">
    //     <input placeholder="Placeholder" id="first_name" type="text" class="validate">
    //     <label for="first_name">First Name</label>
    //   </div>
    //   <div class="input-field col s6">
    //     <input id="last_name" type="text" class="validate">
    //     <label for="last_name">Last Name</label>
    //   </div>
    // </div>`

      }
      else

        //experimental
        editor.innerHTML = editor.innerHTML + `<div class="input-field col s12">
        <input id="edit${key}" type="${isNumber(objeto[key]) ? "number" : "text"}" class="validate" value="${objeto[key]}">
        <label class="active" for="edit${key}">${key}</label>
      </div>`

      edits.push(key);
    }
  else
    for (key in objeto) {

      if (key === "EAN") {
        editor.innerHTML = editor.innerHTML +

          //   `<div class="input-field col s12">
          //   <input id="edit${key}" type="${isNumber(objeto[key]) ? "number" : "text"}" class="validate" value="${objeto[key]}">
          //   <label class="active" for="edit${key}">${key}</label>
          // </div>`


          // ' <b>' + key.toUpperCase() + '</b>' +"<button>SCAN</button>"+
          //   `<input data-toggle="tooltip"  id="edit${key}" value='${objeto[key]}' title="${key}" >`

          `<div class="row">
      <div class="col s12">
      <button id="scan">SCAN</button><button id="ir">IR</button>
        <div class="input-field inline">
          <input id="edit${key}" type="${isNumber(objeto[key]) ? "number" : "text"}" class="validate" value="${objeto[key]}">
          <label class="active" for="edit${key}">${key}</label>
          
        </div>
      </div>  
    </div>`

      }
      else
        editor.innerHTML = editor.innerHTML + ' <b>' + key.toUpperCase() + '</b>' +
          `<input data-toggle="tooltip"  id="edit${key}" value='${objeto[key]}' title="${key}" >`
      edits.push(key);
    }

  // editor.innerHTML = editor.innerHTML + '<button onclick="editarObjeto(objeto)">Guardar</button>'

  $("#scan").on("click", function () {
    console.log("click en scan");

    var cam = M.Modal.getInstance(document.getElementById("modalcamara"));
    cam.open();

    document.getElementById('go').click();
  });

  $("#ir").on("click", function () {
    //que abra open food en nueva pestaña
    // var win = window.open('https://es.openfoodfacts.org/producto/' + objeto.EAN, '_blank');
    // win.focus();


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        aEAN = JSON.parse(this.responseText);
        console.log(aEAN);
        
        a=new Articulo();
        a.openFood(aEAN);
        console.log(a);
        
      }
    };
    xmlhttp.open("GET", "https://world.openfoodfacts.org/api/v0/product/"+objeto.EAN+".json", true);
    console.log("https://world.openfoodfacts.org/api/v0/product"+objeto.EAN+".json");
    xmlhttp.send();
  });




  $("#ok").off();

  $("#ok").on("click", function () {
    editarObjeto(objeto, propiedades) //propiedades da igual
    actListaArticulo(objeto) //actualizar la propiedad lista del articulo a la lista cargada
    objeto.guardar();
    console.log("GUARDAR " + objeto.nombre);

  });

  actPrecios(objeto);
  var instance = M.Modal.getInstance(document.getElementById("modal1"));
  instance.open();

}

var aEAN;

/**Para comprobar que la propiedad lista del articulo es la misma en al que esta cargado
 */
function actListaArticulo(a) {
  //El valor de listas se va a veces
  // let lista="/listas/"+$("#listas").val()
  if (lista)
    if (a.lista != lista)
      a.lista = lista

}


function actPrecios(o) {
  let objeto = new ArticuloLista();
  objeto.setAll(o);

  $("#editunidades").change(function () {
    objeto.unidades = $(this).val();
    $("#edittotal").val(objeto.total)
  });

  $("#edittotal").change(function () {
    console.log("actualizo precios de " + objeto.nombre);

    objeto.total = $(this).val();
    $("#editprecio").val(objeto.precio);
  });

  $("#editprecio").change(function () {
    console.log("actualizo precios de " + objeto.nombre);

    objeto.precio = $(this).val();
    $("#edittotal").val(objeto.total)
  });
}




/** Guarda los cambios de edición que se hacen en la ventana modal en el artículo
 * 
 * @param {Articulo} objeto el articulo en que se guardaran los cambios editados
 * @param {string[]} propiedades lista de las propiedades a editar,
 *                                si null o undefined edita todas
 * @see {@link editar}
 */
function editarObjeto(objeto, propiedades) {
  // if(propiedades) console.log(propiedades);
  // if (propiedades)
  //   for (key of propiedades) {
  //     var valor = $('#edit' + key).val();
  //     if (isNumber(valor)) objeto[key] = +valor;
  //     else objeto[key] = valor;
  //   }
  // else
  console.log(Object.getOwnPropertyNames(objeto));
  // console.log(Object.getOwnPropertyDescriptors(objeto));

  for (key of edits) { //para que guarde solo lo que sale en el editor
    var valor = $('#edit' + key).val();
    if (valor == undefined) continue; //si no tiene valor definido no se modifica

    if (isNumber(valor)) objeto[key] = +valor;
    else objeto[key] = valor;

    if (key === "EAN") {
      console.log("ME METO EN EAN");

      objeto.guardarEAN(); //si es del tipo EAN, guardamos el articulo en 'articulos/EAN/[EAN]' 
    }
    // console.log(`${key} ${valor}`);

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
  // console.log(x);

  x.innerHTML += `<option value="${element}">${element}</option> `
  // var option = document.createElement("option");
  // option.text = element;
  // x.add(option);

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

function descuento() {
  //TODO: DESCUENTO
  $('#descuento').modal('open');
  $('#rg-descuento').change(function () {
    console.log(this.value);
  });

  $('#quitarDescuento').one("click", function () {
    selected.forEach(element => {
      element.quitarDescuento();
      element.guardar();
    });
  });

  $('#descuentoOk').one("click", function () {
    nombreLista = $("#nombreLista").val();
    let d = $("#sl-descuento").val();
    // console.log(d);
    selected.forEach(element => {
      let des;
      if (d === "ud") { des = new Descuento(+$('#rg-descuento').val(), 1); }
      else des = Descuento.oferta(d);
      element.descuento = des;
      // console.log(des);
      console.log(`${element.nombre} => ${element.total}`);
      element.guardar();
    });
  });

}


function checkContexto() {
  if (selected.length < 1) { //si no hay seleccionados
    $("#fb-copiar").hide();
    $("#fb-cortar").hide();
    $("#fb-eliminar").hide();
    // $("#fb-descuento").hide();
    $("#deseleccionarTodo").hide();


  }
  else {
    $("#fb-copiar").show();
    $("#fb-cortar").show();
    $("#fb-eliminar").show();
    // $("#fb-descuento").show();
    $("#deseleccionarTodo").show();
  }

  if (copiado.length < 1) {
    $("#fb-pegar").hide();
  }
  else {
    $("#fb-pegar").show();
  }


}

function invertirSeleccion() {
  $("#myTable").children('tr').each(function (i) {

    var pos = selected.indexOf(articulos[i]);
    if (pos > -1) { //deselecciono si ya está
      selected.splice(pos, 1);
      this.classList.remove("selec"); //quito la clase de seleccionado
    }
    else { //si no está lo selecciono
      selected.push(articulos[i]);
      this.classList.add("selec");//pongo formato seleccionado
    }


  });
  checkContexto();

}


function deseleccionarTodo() {
  console.log(articulos);
  selected = [];
  $("#myTable").children('tr').each(function (i) {
    this.classList.remove("selec");
  });
  checkContexto();
}

function seleccionarTodo() {
  console.log(articulos);
  selected = articulos;
  $("#myTable").children('tr').each(function (i) {
    this.classList.add("selec");
  });
  checkContexto();

  M.toast({ html: `${selected.length} seleccionado${selected.length > 1 ? 's' : ''}` })

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

// function opciones(contenedor) {
//   contenedor = "contenedor"
//   var op = new Opciones(
//     new Opcion("usuario", "text", "Rober"),
//     new Opcion("email", "email", "mail@mail.es"),
//     new Opcion("fecha", "date", "0777-07-07"),
//     new Opcion("hora", "time", "07:07"),
//     new Opcion("dark", "checkbox", "false")
//   )
//   op.html(contenedor);

//   // let m = M.Modal.getInstance(document.getElementById("opciones"));
//   // m.open();
// }

/** Guarda las opciones en local
 */
function guardarOpciones() {
  localStorage.setItem("cbMostrar", $("#cbMostrar").prop("checked"));
}

/** Carga las opciones guardadas */
function cargarOpciones() {
  if (localStorage["cbMostrar"])
    $("#cbMostrar").prop("checked", localStorage["cbMostrar"] === "true")

  if (localStorage["usuario"]) {

    $("#span-usuario").text(localStorage["usuario"])
    $("#usuario").val(localStorage["usuario"])
    user = localStorage["usuario"];
  }

  if (localStorage["email"]) {
    $("#span-email").text(localStorage["email"])
    $("#email").val(localStorage["email"])
  }



}


//cargo las opciones
cargarOpciones();
document.getElementById('version').innerHTML= "0.0137"

// let listaGuardada = localStorage.getItem("ultimaLista");
// if(listaGuardada){

//   lista=listaGuardada;
//   document.getElementById("listas").value = lista;
//   console.log($("#listas").val());

//   console.log(lista);
//   // cargarLista();
//   cargarLista(listaGuardada);
// } 

// $(document).ready( function () {
// $('#tabla').DataTable();

//   } );