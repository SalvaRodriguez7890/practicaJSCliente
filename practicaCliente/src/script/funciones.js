/**
 * Constantes y variables
 */
const horaHTML = document.getElementById("current-time");
const fechHTML = document.getElementById("current-date");

// Lista original completa de socios
const listaSocios = sociosClubCompleto;


// Elementos del DOM
const tablaSociosHTML = document.getElementById("members-tbody");
const buscarSocio = document.getElementById("search-input");
const buscarActividad = document.getElementById("filter-activity");
const desplegableOrdenacion = document.getElementById("sort-order");

/**
 * Llamada funciones iniciales
 */

//funcionFecha
muestraFecha();
//funcion que actualiza la hora dentro de un interval
setInterval(actualizarHora, 1000);
//llamada para mostrar la lista de socios
muestraSocios(listaSocios); 

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
    if (textoBusqueda != "") {

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
 * Función que coge los datos de un array de socios y los muestra en la tabla del HTML.
 * @param {Array} arraySocios - Lista de socios que queremos pintar en la tabla.
 */
function muestraSocios(arraySocios) {
  let fila = "";
  
  // Recorro el array y monto las filas llamando a la funcion de formatoFila
  for (let socio of arraySocios) {
    fila += formatoFila(socio);
  }

  //si la fila esta vacia significa que no hay sociios con los filtros puestos
  if(fila == ""){
    tablaSociosHTML.innerHTML = "No se han encontrado socios con esos filtros";
  }else{
  // Limpia el contenido anterior de la tabla y le inserta las nuevas filas generadas
    tablaSociosHTML.innerHTML = "";
    tablaSociosHTML.innerHTML = fila;
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


/**
 * Funciones auxiliares para la hora y fecha etc
 */
function muestraFecha(){
  const fechaHoy = new Date();
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
 * Funcion que genera el campo de las actividades que meto en la tabla (con su clase que tiene sus estilos en css)
 * @param {*} socio 
 * @returns 
 */
function generaActividades(socio) {
  let actividadesHTML = socio.actividades.split(",");
  let finalString = '<div class="flex-actividades">';

  for(let act of actividadesHTML){
    finalString += `<span class="actividades">${act.trim()}</span>`;
  }
  
  finalString += '</div>';
  return finalString;
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
 * Funcion que contiene el formato de cada fila pasandole el socio, (la tuve que hacer porque repetia muchas veces lo mismo)
 * @param {*} socio 
 * @returns 
 */
function formatoFila(socio){
  return `<tr>` +
            `<td><span class="spanAvatar">${generaAvatar(socio)}</span></td>` +
            `<td><b><p class="tdSocio">${socio.nombre} ${socio.apellidos}</p></b></td>` +
            `<td><b>${socio.id}</b></td>` +
            `<td>${escondeMail(socio.email)}</td>` +
            `<td class="tdActividades">${generaActividades(socio)}</td>` +
            `<td>${calcularEdad(socio.fechaNacimiento)}</td>`+
            `<td class="tdCuota">${socio.cuota.toFixed(2)}€</td>` +
         `</tr>`;
}