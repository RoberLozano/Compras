//TODO: el checkbox da por culo porque no utiliza value
class Opcion {
        constructor(nombre,tipo,defecto) {
			this.nombre = nombre
			this.tipo = tipo
			this.defecto = defecto
    }

    set valor(u){
        localStorage[this.nombre]=u;
    }

    get valor(){
        if(this.tipo=="checkbox")
            return localStorage[this.nombre]=="true"?true:false;
        return (localStorage[this.nombre] || "")
    }

    html(){
        let d=`<div class="input-field col s6">
        <input id="${this.nombre}" type="${this.tipo}" value= "${this.valor}" class="validate">
        <label for="${this.nombre}">${this.nombre}</label>
      </div>`;
        return d;    
    }
    edit(){
        document.getElementById(this.nombre).addEventListener('change', (event) => {
            if(this.tipo=="checkbox")
             this.valor=event.target.checked;
            else
            this.valor=event.target.value;
        });
    }
}

class Opciones {
        constructor(...opciones) {
			this.opciones =opciones
    }
/**Modifica el html interno del contenedor que se pasa
 * para que aparezca las opciones
 * 
 * @param {string} contenedor la id del contenedor de las opciones a mostrar
 */
    html(contenedor){  
        let html="";
        this.opciones.forEach(o => {
            html+=o.html()+"<br>"
        });
        document.getElementById(contenedor).innerHTML=html;
        this.opciones.forEach(o => {
            o.edit();
        });
    }

}

// class Opciones {
//         constructor(user,mail) {
// 			this.user = user
// 			this.mail = mail
//         }

//     /** Guarda en localStorage
//      * @param {string} u
//      */
//         set user(u){
//             localStorage.user=u;
//         }

//         get user(){
//             return localStorage.user
//         }

//         set mail(mail){
//             localStorage.mail=mail;
//         }

//         get mail(){
//             return localStorage.mail
//         }




//         crearEditor(editor){

//            ` <div class="input-field col s6">
//             <input id="${}" type="text" class="validate">
//             <label for="last_name">Usuario</label>
//           </div>
//             <div class="input-field col s6">
//               <input id="email" type="email" class="validate">
//               <label for="email">Email</label>
//             </div>`

//         }
// }



