var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];

var colors = [ 'agua' , 'azul' , 'beis', 'negro', 'blanco', 'blue', 'marron', 'chocolate', 'coral', 'escarlata','rojo', 'verde']
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var resultado="";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;

//true para que escuche todo el tiempo
recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 3;

var boton;
var hablado;

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }


function hablar() {
  boton= document.getElementById("hablar");
  hablado= document.getElementById("hablado");
  if(boton.style.color=="green") //ya esta escuchando y se para
  {
    recognition.stop();
    return;
  }
  console.log('Botón de hablar pulsado');
  recognition.start();
  console.log('Preparado para escuchar');

  boton.style.color = "green";
  
}


// Controlo cuando genera los resultados para evitar el eco en Android https://issuetracker.google.com/issues/152628934
// eliminarlo cuando el bug sea resuelto
var lastTime=0;


recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  let last=event.results[event.results.length-1][0];
  let lastArray=event.results[event.results.length-1];
  // console.log(`Tamaño: ${size}`);

  // console.log('Confidence: ' + last.confidence);
  var time= Date.now();

  console.log(`${last.transcript}  (${last.confidence}) [${time}]`);
  

 if((time-lastTime)<713){//si es el eco del anterior salimos (vamos con 300 ms)
  console.log("repetido");
   return;
  } 

  if(last.confidence<0.5) console.log(event.results[event.results.length-1]);
  else hablado.innerHTML +=last.transcript+ " [" +time+ "] <br>"
  lastTime=time;


  let a=new Articulo();
  a.dictado(last.transcript);

  console.log(a);

  nuevoArticulo(a);


  
  // let numProp=a.propiedades();
  

  //#region alternativas solo si la primera lectura tiene baja confianza
    // TODO: solo si la primera lectura tiene baja confianza
    // var articulos=[];
    // for (let index = 0; index < recognition.maxAlternatives; index++) {
    //   console.log(lastArray[index].transcript +":"+lastArray[index].confidence);
    //     // console.log("CREA:");
    //   // articulos[index]=new Articulo();
    //   // articulos[index].dictado(lastArray[index].transcript);
    //   // console.log(articulos[index]+":"+articulos[index].propiedades());
    // }
    // console.log(articulos);
  //#endregion 
  
  // writeArticulo(new Articulo(last.transcript));


  // console.log(event.results[0][0].transcript);
  // console.log(event.results);
  
}

recognition.onspeechend = function() {
  recognition.stop();
  boton.style.color = "";
}

recognition.onnomatch = function(event) {
  console.log("I didn't recognise that color.");
  boton.style.color = "red";
}

recognition.onerror = function(event) {
  console.log('Error occurred in recognition: ' + event.error);
  boton.style.color = "red";
  
}