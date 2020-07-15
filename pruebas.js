/** tiempo inicial */
var ti;

/** tiempo final */
var tf;

const marcas=["Hacendado","IFA","Carrefour"];

function crear(num) {
    if (!num) num = document.getElementById("n").value;
    let articulos = [];



    for (i = 1; i <= num; i++) {
        
        let a = new Articulo("articulo " + i, 100 + i, "ifa", EAN = 900000 + i)

        addFirestore(JSON.parse(JSON.stringify(a)), (i==num));
    }



    // var lista= new ListaCompra(lista,articulos,"rober");
    // console.log(lista);

    // addFirestore(lista);

}


function crearBatch(num){

    if (!num) num = document.getElementById("n").value;
    if(num>500) num=500; //en batch no permite más de 500
    let articulos = [];

    ti = Date.now();
    console.log(ti);
    // Get a new write batch
    var batch = db.batch();
    for (let i = 1; i <= num; i++) {
        console.log(i%marcas.length);
        let marca=marcas[i%marcas.length];
        console.log(marca);
        let a = new ArticuloLista("articulo " + i, 100+1 , marca, 900000 + i,(Math.random()*10).toFixed(2),1)
        var r = db.collection("a").doc(a.EAN+"");
        batch.set(r,JSON.parse(JSON.stringify(a)));

    }


// Commit the batch
batch.commit().then(function () {
    tf = Date.now()-ti;
    console.log("batch:"+ tf);
});
}

function addFirestore(o, final=false) {
    db.collection("a").add(o)
        .then(function (docRef) {
            // console.log("Document written with ID: ", docRef.id);
            if (final) {
                tf = Date.now()-ti;
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
    tf = Date.now()-ti;
    console.log("tiempo:"+ tf +" ms");
    
}


function crearDB(num) {
    if (!num) num = document.getElementById("n").value;
    i();

    for (let i = 1; i <= num; i++) {
        
        // let a = new Articulo("articulo " + i, (Math.random()*10).toFixed(2), "ifa", EAN = 900000 + i)
        let a = new ArticuloLista("articulo " + i, 100+1 , "ifa", 900000 + i,(Math.random()*10).toFixed(2),1)
            console.log(`Articulo ${a.nombre} guardado en ${a.EAN} `);
            var ref = database.ref("a").child(a.EAN+"")
            ref.set(a)
            console.log(a);
            // guardarArticulo(this);
      
    }
    f();

}

function ordenarFS(campo, asc=true) {
        campo="precio";

        let a=db.collection("a");
// Create a query against the collection.
var query = a.where("precio", ">", 5).where("marca","==","IFA");
var query = a.where("marca","==","Hacendado");

query.get()
.then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
})
.catch(function(error) {
    console.log("Error getting documents: ", error);
});
    
    
}

// citiesRef.orderBy("name", "desc").limit(3)

function ordenarDB(campo, asc=true){
    campo="precio";
    database.ref("a").orderByChild(campo).startAt(3).endAt(6).on("child_added", function(snapshot) {

    // database.ref("a").orderByChild(campo).on("child_added", function(snapshot) {
        // console.log(snapshot.val());
        var dinoName = snapshot.key;
        var dinoData = snapshot.val();
        console.log(snapshot.val());
         console.log(dinoName + " vale " + dinoData.precio + " €");
      });
}


