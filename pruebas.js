/** tiempo inicial */
var ti;

/** tiempo final */
var tf;

const marcas = ["Hacendado", "IFA", "Carrefour"];
var articulos = [];
var listaprecios=[];

/**
 * Modifica una fecha.
 * 
 * @param interval  One of: año, mes, dia, segundo,...
 * @param units  Numero de unidades a añadir o restar, si negativas.
 */
Date.prototype.mod = function (interval, units) {
    var ret = new Date(this.valueOf()); //don't change original date

    switch (interval.toLowerCase()) {
        case 'año': ret.setFullYear(ret.getFullYear() + units); break;
        case 'mes': ret.setMonth(ret.getMonth() + units); break;
        case 'semana': ret.setDate(ret.getDate() + 7 * units); break;
        case 'dia': ret.setDate(ret.getDate() + units); break;
        case 'hora': ret.setTime(ret.getTime() + units * 3600000); break;
        case 'minuto': ret.setTime(ret.getTime() + units * 60000); break;
        case 'segundo': ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;//en default undefined o pasar la original?
    }
    return ret;
}

/**
 * Fecha en formato ISO local
 * 
 * @returns {string} La fecha que nos devolvera en formato ISO local
 */
Date.prototype.iso =
    function () {
        const date = new Date(this.valueOf());
        const offsetMs = date.getTimezoneOffset() * 60 * 1000;
        const msLocal = date.getTime() - offsetMs;
        const dateLocal = new Date(msLocal);
        const iso = dateLocal.toISOString();
        const isoLocal = iso;
        // const isoLocal = iso.slice(0, 19);
        return isoLocal;
    }

function crear(num) {
    if (!num) num = document.getElementById("n").value;
    larticulos = [];

    for (i = 1; i <= num; i++) {

        let a = new ArticuloLista("articulo " + i, 100 + 1, marcas[i % marcas.length], 900000 + i, (Math.random() * 10).toFixed(2), 1)
        articulos.push(a)
    }

    // var lista= new ListaCompra(lista,articulos,"rober");
    // console.log(lista);

    // addFirestore(lista);

}

function ordenar(params) {

}


function crearBatch(num) {

    let min = document.getElementById("min").value;
    let max = document.getElementById("max").value;
    let articulos = [];

    ti = Date.now();
    console.log(ti);
    // Get a new write batch
    var batch = db.batch();
    for (let i = min; i <= max; i++) {
        let a = new ArticuloLista("articulo " + i, 100 + 1, marcas[i % marcas.length], 900000 + i, (Math.random() * 10).toFixed(2), 1)
        var r = db.collection("a").doc(a.EAN + "");
        batch.set(r, JSON.parse(JSON.stringify(a)));

    }


    // Commit the batch
    batch.commit().then(function () {
        tf = Date.now() - ti;
        console.log("batch:" + tf);
    });
}

function addFirestore(o, final = false) {
    db.collection("a").add(o)
        .then(function (docRef) {
            // console.log("Document written with ID: ", docRef.id);
            if (final) {
                tf = Date.now() - ti;
                console.log(tf);
            }
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}
/**
 * toma tiempo inicial
 */
function i() {
    ti = Date.now();
    console.log(ti);

}

/**
 * toma tiempo final
 */
function f() {
    tf = Date.now() - ti;
    console.log("tiempo:" + tf + " ms");

}


function crearDB(num) {

    let min = document.getElementById("min").value;
    let max = document.getElementById("max").value;
    i();

    for (let i = min; i <= max; i++) {

        // let a = new Articulo("articulo " + i, (Math.random()*10).toFixed(2), "ifa", EAN = 900000 + i)
        let a = new ArticuloLista("articulo " + i, 100 + 1, marcas[i % marcas.length], 900000 + i, (Math.random() * 10).toFixed(2), 1)
        console.log(`Articulo ${a.nombre} guardado en ${a.EAN} `);
        var ref = database.ref("a").child(a.EAN + "")
        ref.set(a)
        console.log(a);
        // guardarArticulo(this);

    }
    f();

}

function ordenarFS(campo, asc = true) {

    campo = "precio";
    articulos = []

    let a = db.collection("a");
    // Create a query against the collection.
    // var query = a.orderBy("marca").orderBy("precio");
    var query = a.where("precio", "<", 5);
    // var query = a.where("precio", "<", 5).where("marca", "==", "IFA");
    // var query = a.where("marca","==","Hacendado");
    i();

    query.get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                articulos.push(doc.data())

            });
            f();
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });


}

// citiesRef.orderBy("name", "desc").limit(3)

function ordenarDB(campo, asc = true) {
    i();
    campo = "marca";
    // database.ref("a").orderByChild(campo).startAt(3).endAt(6).on("child_added", function(snapshot) {
    database.ref("a").orderByChild(campo).on("child_added", function (snapshot) {

        // database.ref("a").orderByChild(campo).on("child_added", function(snapshot) {
        // console.log(snapshot.val());
        var dinoName = snapshot.key;
        var dinoData = snapshot.val();
        // console.log(snapshot.val());
        console.log(dinoName + " vale " + dinoData.marca + " €");
        f();
    });


}

function borrarDB() {
    var ref = database.ref("a")
    ref.remove();

}

function preciosBatch(periodo = 1) {
    let min = document.getElementById("min").value;
    let max = document.getElementById("max").value;

    ti = Date.now();
    console.log(ti);
    // Get a new write batch
    var batch = db.batch();
    for (let i = min; i <= max; i++) {
        for (let d = 1; d <= periodo; d++) {
            let p = pi(i, new Date().mod('dia', -d));
            console.log(p);
            var r = db.collection("p").doc(p.EAN + p.fecha.iso());
            batch.set(r, JSON.parse(JSON.stringify(p)));

        }
        // let p = new Precio( 900000 + i, Math.round(( (Math.random() * 10)+ Number.EPSILON) * 100) / 100 ,Date.now())
        // batch.set(r, p);
        // batch.set(r,{
        //     EAN: p.EAN,
        //     precio: p.precio,
        //     fecha:firebase.firestore.FieldValue.serverTimestamp(),
        // });
        // batch.set(r, JSON.parse(JSON.stringify(p)));
    }


    // Commit the batch
    batch.commit().then(function () {
        tf = Date.now() - ti;
        console.log("batch:" + tf);
    });


}


function rndFecha(fecha, dias) {
    let d = Math.random() * dias;
    return fecha.mod('dia', d)
}

/**
 * Crea un articulo a partir de un índice
 * @param {number} i El índice
 */
function ai(i) {
    new ArticuloLista("articulo " + i, 100 + 1, marcas[i % marcas.length], 900000 + i, (Math.random() * 10).toFixed(2), 1)
}

/** Crea un precio a partir de un índice
 * @param {number} i El índice
 */
function pi(i, dia) {
    if (!dia) dia = new Date().mod('dia', -i)
    var d = new Date();
    return new Precio(900000 + i, euros(), dia)
}

/** Crea un precio aleatorio en € con 2 decimales
 * @param {Number} max El máximo de euros, 20 por defecto
 * @param {Number} min El mínimo de €, 0 por defecto
 */
function euros(max = 20, min = 0) {
    return (Math.round(((Math.random() * max) + Number.EPSILON) * 100) / 100) + min;
}

function rnd(max, min = 0, int = true) {
    let r = (Math.random() * max) + min
    if (int) r = Math.trunc(r);
    return r;
}

function buscarEAN(ean) {
    campo = "precio";
    articulos = [];
    listaprecios=[];
    // a = []

    let p = db.collection("p");
    // Create a query against the collection.
    // var query = a.orderBy("marca").orderBy("precio");
    var query = p.where("EAN", "==", ean);
    // var query = a.where("precio", "<", 5).where("marca", "==", "IFA");
    // var query = a.where("marca","==","Hacendado");
    i();

    query.get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                listaprecios.push({
                    t: doc.data().fecha.slice(0,19)+"Z",
                    y: (doc.data().precio)
                })

                let fecha=new Date(doc.data().fecha);
                console.log(fecha);
                articulos.push([fecha,doc.data().precio])
            });
            f();
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
    console.log(articulos);

}

buscarEAN(900003);
// myChart.data.datasets[0].label="enga"
// myChart.data.datasets[0].data = articulos;
// myChart.update();

function datos(params) {

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Time of Day');
    data.addColumn('number', 'Rating');

    
  data.addRows(
articulos
  );

chart.draw(data);
console.log(("MAP"))
console.log(listaprecios.sort(function(a, b) {
    var dateA = new Date(a.t), dateB = new Date(b.t);
    return dateA - dateB;
}));

console.log(listaprecios.map((x)=>x.t));
myChart.data.labels=listaprecios.map((x)=>x.t.slice(0,10));
myChart.data.datasets[0].label="precio"
myChart.data.datasets[0].data = listaprecios.sort(function(a, b) {
    var dateA = new Date(a.t), dateB = new Date(b.t);
    return dateA - dateB;
});
myChart.update();
}


var fecha = new Date("2020-12-31");



// for (let index = 0; index < 10; index++) {
//     console.log(rndFecha(fecha,+7));  
// }

// for (let index = 0; index < 10; index++) {
//     console.log(rndFecha(fecha,-7));  
// }

// var veces = []
// let n = 10;
// for (let i = 0; i <= n; i++) {
//     veces[i] = 0;
// }
// for (let i = 0; i < 100000; i++) {
//     veces[rnd(10)]++;
// }
// console.log(veces);





// fecha= new Date()
// var m1=fecha.mod('hora',1);
// console.log(fecha);
// console.log(fecha.iso());
// console.log(m1);
// console.log(m1.iso());


