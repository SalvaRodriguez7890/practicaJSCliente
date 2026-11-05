/**
 * Constantes y variables
 */
const horaHTML = document.getElementById("current-time");
const fechHTML = document.getElementById("current-date");

//section que luego ponemos en pantalla completa
const seccion = document.getElementById('listado-section');

// Lista original completa de socios
const listaSocios = sociosClubCompleto;


// Elementos del DOM
const tablaSociosHTML = document.getElementById("members-tbody");
const buscarSocio = document.getElementById("search-input");
const buscarActividad = document.getElementById("filter-activity");
const desplegableOrdenacion = document.getElementById("sort-order");
const buscaFicha = document.getElementById("search-dni-input");
const divFormularioFicha = document.getElementById("member-card-details");
const btnFicha = document.getElementById('btnBuscaFicha');



/**
 * Llamada funciones iniciales
 */

//funcionFecha
muestraFecha(new Date());
//funcion que actualiza la hora dentro de un interval
setInterval(actualizarHora, 1000);
//llamada para mostrar la lista de socios
muestraSocios(listaSocios); 
//EventListener del boton que pone a pantalla completa la app
document.getElementById('btn-fullscreen').addEventListener('click', appCompleta);

/**
 * Mega funcion, que tiene en cuenta lo que escribimos en el buscador y el filtro por actividad y orden
 */
function filtrarYMostrarSocios() {
  //Variable con el tipo de ordenacion elegido
  const ordenElegido = desplegableOrdenacion.value.trim();

  //Saco el texto introducido sin espacios del input
  const textoBusqueda = buscarSocio.value.trim();

  //Saco lo elegido del desplegable
  const actividadSeleccionada = buscarActividad.value;

  //Crea un array vacío para luego guardar los socios que he filstrado
  let sociosFiltrados = [];

  //Con un for of recorro la lista
  for (let socio of listaSocios) {

    //Creo una variable que inicializo a false para saber si ese socio tiene la actividad 
    let pasaActividad = false;

    //Compruebo si dentro del desplegable se pulsa la opcion todas
    if (actividadSeleccionada === "todas") {

      //Si es "todas" entocnes pongo la variable anterior en true, proque esa lista las tiene todas
      pasaActividad = true;

    } else {

      //Creo un array de actividades del socio donde las separo por la ","
      const actividades = socio.actividades.split(",");

      //Ahora recorro con otro for el array de actividades de cada socio
      for (let act of actividades) {

        //Compruebo si la actividad selecionada esta dentro del array de actividades anterior del socio (usando un trim y un tolowercase para asegurarse) usando un icludes
        if (act.trim().toLowerCase().includes(actividadSeleccionada.toLowerCase())) {

          //Si la actividad seleccionada esta dentro vuelvo a ponerlo a true
            pasaActividad = true;

          // Salgo del bucle de array de actividadessimplemente por si la primera actividad es la que estoy buscando
          break; 
        }
      }
    }

    //Si el socio pasa el filtro de la actividad, sigo con el filtro de texto, si no pues termino
    if (pasaActividad) {
        
    //Creo una variable boleana para saber ahora y filtrar por el texto
    let pasaTexto = true;

    //Si hay algo escrito, osea es diferente de cadena vacia
    if (textoBusqueda != "" && textoBusqueda.length >= 2) {

      //Pongo el nombre en mayusculas y sin tildes
      let nombre = socio.nombre.toUpperCase().replaceAll("[ÁÉÍÓÚ]","[AEIOU]");

      //El apellido igual
      let apellidos = socio.apellidos.toUpperCase().replaceAll("[ÁÉÍÓÚ]","[AEIOU]");

      //Y el correo igual
      let email = socio.email.toUpperCase().replaceAll("[ÁÉÍÓÚ]","[AEIOU]");

      //Ahora el texto que se usa para buscar tambien lo pongo mayusculas para comparar
      let textoMayus = textoBusqueda.toUpperCase();

      //Coparo con includes el nombre apellidos y email con el texto introducido
      if (nombre.includes(textoMayus) || apellidos.includes(textoMayus) || email.includes(textoMayus)) {
        
        //Si conicide algujn texto lo pongo en true
        pasaTexto = true;

      } else {
        
        //Si el texto no coincide pues false
        pasaTexto = false;
      }
    }

    //Comprueba si el socio ha pasado tanto el filtro de actividad como el filtro de texto de búsqueda.
    if (pasaActividad && pasaTexto) {

      //Si el filtro ambos filtros pasa meto el socio al array de socios filtrados
      sociosFiltrados.push(socio);
    }
  }

}

  //Por ultimo ahora voy a ordenar el array sociosFiltrados según hemos elegido en el desplegable usando a su vez 4 funciones diferentes (cada una ordena un array por edad mayor o menor, por id, por nombre y por apellido)

  switch(ordenElegido){

    
    case 'nombre': ordenaString(sociosFiltrados, "nombre"); break;
    case 'apellidos' : ordenaString(sociosFiltrados,"apellidos"); break;
    case 'jovenes' : ordenaEdad(sociosFiltrados); break;
    case 'antiguos' : ordenaViejo(sociosFiltrados); break;
    //si no es ninguno de los anteriores solo puede ser "id", por ID se ordena de forma automatica ya que los socios se muestran y se crean con los id en orden
    default: sociosFiltrados = sociosFiltrados;

  }

  //Por ultimo Llamo a mi fincion de mostrar los socios pero ahora con los socios filtrados
  muestraSocios(sociosFiltrados);

}
/**
 * Ahora cojo el array de socios y con el método compare de los string comparo dos nombres o por apellido segun la variable metodo
 * @param {Array}
 * @returns {Array} 
 */
function ordenaString(array, metodo) {
  
  //si paso la palabra nombre ordena por nombre
  if(metodo == "nombre"){

  array.sort(function(socio1, socio2) {
    // Usamos localeCompare para comparar el nombre del socio1 con el del socio2 alfabéticamente
    return socio1.nombre.localeCompare(socio2.nombre);
  });

  //si le paso apellido pues por apellidos
  }else if(metodo == "apellidos"){
     array.sort(function(socio1, socio2) {
    // Usamos localeCompare para comparar el apellido del socio1 con el del socio2 alfabéticamente
    return socio1.apellidos.localeCompare(socio2.apellidos);
  });
  }

  return array;
}
/**
 * Recibe un array de socios y los ordena por edad
 * @param {*} array 
 */
function ordenaEdad(array){

  //Creo un array, el cual a partir del sort (metiendole una funcion simple para ordenar los sicos) ordeno de jovenes a viejos
  //la funcion usa la funcion que cree para saber que edad tiene cada socio, de forma que coje los dos socios y los compara para saber cual es mayor
  //si da positivo la resta el primero es mayor, y si da negativo el segundo es mayor
  array = array.sort(function(socio1, socio2){
    var edad1 = calcularEdad(socio1.fechaNacimiento);
    var edad2 = calcularEdad(socio2.fechaNacimiento)

    //dentro del return (retrun del sort) meto directamente la resta entre ambos, si quiero ordenar de viejo a joven intercambio el orden de la resta
    return edad1-edad2;
  })

  //ahora con el array ordeando lo devuelvo
  return array;

}

/**
 * Recibe un array de socios y los ordena por ID
 * @param {*} array 
 */
function ordenaViejo(array){

  //este metodo de ordenacion es muy parecido al de las edades, pero usando directamente y restando las fechas de altas mediante crear una varible Date por cada fecha

  array = array.sort(function(socio1, socio2){
    var fechaAlta1 = new Date(socio1.fechaAlta);
    var fechaAlta2 = new Date(socio2.fechaAlta)

    //dentro del return (retrun del sort) meto directamente la resta entre ambos, si quiero ordenar de viejo a joven intercambio el orden de la resta
    return fechaAlta1.getTime() - fechaAlta2.getTime();
  })

  //ahora con el array ordeando lo devuelvo
  return array;

}

/**
 * Función que coge los datos de un array de socios y los muestra en la tabla del HTML usando nodos y appendChild.
 * @param {Array} arraySocios Lista de socios que queremos pintar en la tabla.
 */
function muestraSocios(arraySocios) {
  //Nada mas entrar borro lo que haya dentro de la tabla con el .replaceChildren() (borra todo lo que tenga dentro (hijos))
  tablaSociosHTML.replaceChildren();

  // Si no hay socios, mostramos el mensaje de que no se han encontrado
  if (arraySocios.length === 0) {
    let filaVacia = createNode("tr", "", "", "");
    let celdaVacia = createNode("td", "No se han encontrado socios con esos filtros", "", "");
    //Con la propiedad .colSpan le digo que esa celda ocupe las 6 columnas
    celdaVacia.colSpan = 6;
    //sinserto la celda vacia dentro de la fila
    filaVacia.appendChild(celdaVacia);
    //añado la fila a la tabla
    tablaSociosHTML.appendChild(filaVacia);
    //como no se han encontrado socios pues hago un return para salir
    return;
  }
  
  // Recorro el array y voy añadiendo cada fila generada con nodos a la tabla
  for (let socio of arraySocios) {
    tablaSociosHTML.appendChild(formatoFila(socio));
  }
}


/**
 * Event Listeners
 */

// Escucha cambios en el buscador de texto
buscarSocio.addEventListener("input", () => {
  filtrarYMostrarSocios();
});

//Escucha cambios en el desplegable de actividades
buscarActividad.addEventListener("change", () => {
  filtrarYMostrarSocios();
});

//Escucha cambios en el desplegable de ordenación
desplegableOrdenacion.addEventListener("change", () => {
  filtrarYMostrarSocios();
});

// Escucha cambios en el buscador de fichas por id
btnFicha.addEventListener("click", () => {
  //para esconder el elemento que dice que metamos el dni
  document.getElementById("textoIntroduceDNI").hidden=true;
  fichaSocio();
});




/**
 * Funciones auxiliares para la hora y fecha etc
 */
function muestraFecha(fechaHoy){
  
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const mesesAnio = ['de Enero', 'de Febrero', 'de Marzo', 'de Abril', 'de Mayo', 'de Junio', 'de Julio', 'de Agosto', 'de Septiembre', 'de Octubre', 'de Noviembre', 'de Diciembre'];

  const nombreDia = diasSemana[fechaHoy.getDay()];
  const numeroDia = fechaHoy.getDate();
  const nombreMes = mesesAnio[fechaHoy.getMonth()];
  const anio = fechaHoy.getFullYear();
  
  fechHTML.innerText = `${nombreDia}, ${numeroDia} ${nombreMes} del ${anio}`;
}

/**
 * Funcion que actualiza la hora
 */
function actualizarHora() {
  const ahora = new Date();
  const horaFormateada = ahora.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  if (horaHTML) {
    horaHTML.innerText = horaFormateada;
  }
}

/**
 * Funcion que a partir de la fecha de nacimiento dice la edad
 * @param {*} fechaNacimiento 
 * @returns 
 */
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = nacimiento.getMonth();

  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

/**
 * Funcion que crea el logo de cada socio
 * @param {*} socio 
 * @returns 
 */
function generaAvatar(socio){
  return (socio.nombre[0] + socio.apellidos[0]).toUpperCase();
}

/**
 * Funcion que genera el campo de las actividades usando nodos y appendChild
 * @param {*} socio 
 * @returns Elemento div con las actividades
 */
function generaActividades(socio) {
  //parto las actividades con el split y genero un array
  let actividadesHTML = socio.actividades.split(",");

  // Creo un div con la clase flex-actividades
  let contenedorDiv = createNode("div", "", "", "flex-actividades");

  //recorro el array de actividades dodne voy creando un nodo por actividad de
  //tipo span
  for(let act of actividadesHTML){
    // Creamos cada span de actividad y lo añadimos al div 
    let spanAct = createNode("span", act.trim(), "", "actividades");
    contenedorDiv.appendChild(spanAct);
  }
  //devuelvo todo el div con sus actividades
  return contenedorDiv;
}

/**
 * Funcion que esconde el mail
 * @param {*} email 
 * @returns 
 */
function escondeMail(email){
  const emailOculto = email.replace(/(?<=^.{2}).*?(?=@)/, (match) => "*".repeat(match.length));
  return emailOculto;
}

/**
 * Funcion que contiene el formato de cada fila construida mediante nodos y appendChild
 * @param {*} socio 
 * @returns 
 */
function formatoFila(socio){

  //creo la fila
  let fila = createNode("tr", "", "", "");
  
  //Creo la celda del avatar
  let avatar = createNode("td", "", "", "");
  //a su vez creo el span del avatar con su clase que va dentro de la celda avatar
  let spanAvatar = createNode("span", generaAvatar(socio), "", "spanAvatar");
  //añado el avatar a su celda
  avatar.appendChild(spanAvatar);

  //Nombre y Apellidos (con negrita <b> y párrafo)
  //creo la celda para meter el nombre del socio y a la vez creo dos nodos mas para negrita y para decirle que su n tipo p
    let nombreSocio = createNode("td", "", "", "");
  let bNombre = createNode("b", "", "", "");
  let pNombre = createNode("p", `${socio.nombre} ${socio.apellidos}`, "", "tdSocio");

  //añado el texto (p) del nombre a la negrita
  bNombre.appendChild(pNombre);
  //a la celda del nombre le añado la negrita que ya tiene el texto
  nombreSocio.appendChild(bNombre);

  //Creo la celda del id
  let idSocio = createNode("td", "", "", "");
  //como el id esta en negrita tambien creo una para negrita
  let bId = createNode("b", String(socio.id), "", "");
  //meto dentro de la celda del id el id en negrita
  idSocio.appendChild(bId);

  //creo la celda del mail, dentro del texto llamo a la funcion que esconde el mail
  let mailSocio = createNode("td", escondeMail(socio.email), "", "");
  

  //Actividades (recibe el elemento DOM devuelto por generaActividades)
  //creo mi celda para actividades
  let actividadesSocio = createNode("td", "", "", "tdActividades");
  //centro de las actividades le meto las actividades que se hacen en generaActividades())
  actividadesSocio.appendChild(generaActividades(socio));

  //Ahora la edad, como es solo un string del numero llamo a la funcion que devuelve el numero de la edad a 
  //partir de la fecha de nacimiento
  let edadSocio = createNode("td", String(calcularEdad(socio.fechaNacimiento)), "", "");

  //La cuota es migual que la edad, pero le meto un toFixed 2 para que me respete los decimales
  let cuotaSocio = createNode("td", `${socio.cuota.toFixed(2)}€`, "", "tdCuota");

  //Ahora todas las  celdas creadas las meto en lafila
  fila.appendChild(avatar);  
  fila.appendChild(nombreSocio);  
  fila.appendChild(idSocio);  
  fila.appendChild(mailSocio); 
  fila.appendChild(actividadesSocio);  
  fila.appendChild(edadSocio);  
  fila.appendChild(cuotaSocio);  

  //devuelvo el objeto fila con todas sus celdas
  return fila;
}

/**
 * Funcion para poner el section de la aplicacion principal en fullscreen
 */
function appCompleta() {
   if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
   seccion.requestFullscreen();
  }
}


/**
 * 
 * 3.3 Ficha de socio
1. Se insertará un pequeño formulario que nos permita obtener la ficha de un socio por su DNI, se
mostrará:
o Nombre completo e id.
o DNI.
o Email completo y su dominio: (dominio: correo.es).
o Teléfono agrupado de 3 en 3: 612 345 678.
o Fecha de nacimiento en texto y edad: martes, 14 de marzo de 1995 · 31 años.
o Fecha de alta en formato dd/mm/aaaa y días que lleva en el club.
o Días que faltan para su próximo cumpleaños.
o
Actividades y cuota mensual.
2.
La búsqueda por DNI no distingue mayúsculas (12345678z también vale).
3.
Si el DNI no corresponde a ningún socio, aparece un mensaje de error en la ficha.
 */



function fichaSocio(){
  //buscaFicha.value es el dni que se supone que hemos metido en el input
  let dni = buscaFicha.value;
  //inicializo el socioEncontrado a null.
  let socioEncontrado = null;

  if(buscaFicha.value != ""){

    //entro en un bucle de la lista de socios original y y voy buscando por DNI
    for(let soc of listaSocios){
      //el método compare devuelve -1 o 1 para saber que string alfabeticamente va primero, pero si devuelve 0 significa que son el mismo string
      if(soc.dni.localeCompare(dni) == 0){
        socioEncontrado = soc;
        break;//pongo un break para que se salga del bucle porque ya encontró al socio con ese dni
      }
    }

    //si el socioEncontrado es diferente de null pues creo el formulario con los datos
    if(socioEncontrado != "null"){
     
        //Creo un salto de linea que despues voy metiendo
        let br = createNode("br","","","");

        //Creo la parte nombre
        let labelNombre= createNode("label", "Nombre: ", "", "");
        let inputNombre= createNode("input", "", "", "");
        inputNombre.value = socioEncontrado.nombre;
       
        //Creo la parte ID
        let labelID= createNode("label", "ID: ", "", "");
        let inputID= createNode("input", "", "", "");
        inputID.value = socioEncontrado.id;

        //Creo la parte mail
        let labelEmail= createNode("label", "Email: ", "", "");
        let inputEmail= createNode("input", "", "", "");
        inputEmail.value = socioEncontrado.email;

        //el domiinio lo saco a partir de hacer un split con el @
        //como se crea un array de dos celdas 0 y 1, se que en la parte del 1
        // está el dominio
        let partesEmail = socioEncontrado.email.split("@");
        let labelDominio = createNode("label","Dominio: " + partesEmail[1],"","");
        
        //Para mostrar el telefono uso el match, el cual mediante una expreision regular le digo que agrupe de 1 a 3 caracteres y con el .join los uno con un esapcio
        //Con {1,3} le digo que cree 1 grupo de 3 caracteres y con la g que siga adelante y cree otro gurpo con los otros caracteres que se vaya encontrando.
        //match me devuelve un array con los numeros separados en 3 y el .join une ese array en una sola variable con los espacios
        let telefonoFormateado = (socioEncontrado.telefono).match(/.{1,3}/g).join(' ');
        let labelNumero = createNode("label","Numero: ","","");
        let inputNumero = createNode("input", "", "", "");
        inputNumero.value = telefonoFormateado;
        
        //Fecha de nacimiento
        let labelFechaNac = createNode("labe", "Fecha de Nacimiento: ");
        let inputFechaNac = createNode("input", "","","" );
        inputFechaNac.value = creaFechaNac(new Date(socioEncontrado.fechaNacimiento)) + " " +calcularEdad(socioEncontrado.fechaNacimiento);
        
        


      divFormularioFicha.appendChild(labelNombre);
      divFormularioFicha.appendChild(inputNombre);
      divFormularioFicha.appendChild(labelID);      
      divFormularioFicha.appendChild(inputID);
      divFormularioFicha.appendChild(br)
      divFormularioFicha.appendChild(labelEmail);      
      divFormularioFicha.appendChild(inputEmail);
      divFormularioFicha.appendChild(labelDominio);
      divFormularioFicha.appendChild(br)
      divFormularioFicha.appendChild(labelNumero);
      divFormularioFicha.appendChild(inputNumero);
      divFormularioFicha.appendChild(br);
      divFormularioFicha.appendChild(labelFechaNac);
      divFormularioFicha.appendChild(inputFechaNac);
    }
    
  }

}


function creaFechaNac(fecha){



  let diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  let mesesAnio = ['de Enero', 'de Febrero', 'de Marzo', 'de Abril', 'de Mayo', 'de Junio', 'de Julio', 'de Agosto', 'de Septiembre', 'de Octubre', 'de Noviembre', 'de Diciembre'];

  let nombreDia = diasSemana[fecha.getDay()];
  let numeroDia = fecha.getDate();
  let nombreMes = mesesAnio[fecha.getMonth()];
  let anio = fecha.getFullYear();
  
  return `${nombreDia}, ${numeroDia} ${nombreMes} del ${anio}`;
}










/**
 * Funcion que crea nodos con clases
 * @param string tipo
 * @param string texto
 * @param string id
 * @param string clase
 * @return node o null si no se crea el nodo
 * 
 */
function createNode(tipo, texto, id, clase){
    let elemento = null;

   if((tipo) && (typeof tipo === "string")){
   elemento = document.createElement(tipo);
   } else{
    return null;
   }
   
   if((texto != "")&& (typeof texto === "string")){
    let elementoText = document.createTextNode(texto);
    elemento.appendChild(elementoText);
   }

   if(id != ""){
    elemento.id = id;
   }
   if(clase && typeof clase =="string" && clase != ""){
    elemento.className = clase;
   }

   return elemento;
}