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
const divAltaSocio = document.getElementById("alta-notification")
const btnAltaSocio = document.getElementById("darAltaSocio");


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

// Escucha cuando clicamos en el boton del buscador ficha
btnFicha.addEventListener("click", () => {
  //para esconder el elemento que dice que metamos el dni

  fichaSocio();
});

// Escucha cuando clicamos en insertar socio
btnAltaSocio.addEventListener("click", () => {
  //para esconder el elemento que dice que metamos el dni

    darAltaSocio();
  
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
  let avatar = (socio.nombre[0] + socio.apellidos[0]).toUpperCase();
  if(typeof avatar == "undefined" || avatar == null){
    return "AA"
  }else{
    return avatar;
  }
   
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
 * Funcion que crea e inserta la ficha de los socios segun el DNI que se le pasa
 */
function fichaSocio(){
  // buscaFicha.value es el dni que se supone que hemos metido en el input
  let dni = buscaFicha.value;
  // inicializo el socioEncontrado a null.
  let socioEncontrado = null;
  // pregunto si el nodo tiene algo dentro, si tiene lo borro
  if (divFormularioFicha.hasChildNodes()) {
    divFormularioFicha.replaceChildren();
  }
  
  if(buscaFicha.value != ""){

    // entro en un bucle de la lista de socios original y voy buscando por DNI
    for(let soc of listaSocios){
      if(soc.dni.localeCompare(dni) == 0){
        socioEncontrado = soc;
        break; // salgo del bucle porque ya encontró al socio
      }
    }

    // si el socioEncontrado es diferente de null creo el formulario con los datos
    if(socioEncontrado != null){
     
        // Creo un salto de línea
        let br = createNode("br", "", "", "");

        // Creo la parte nombre
        let labelNombre = createNode("label", "Nombre: ", "", "ficha-label");
        let inputNombre = createNode("input", "", "", "ficha-input");
        inputNombre.value = socioEncontrado.nombre;
       
        // Creo la parte ID
        let labelID = createNode("label", "ID: ", "", "ficha-label");
        let inputID = createNode("input", "", "", "ficha-input");
        inputID.value = socioEncontrado.id;

        // Creo la parte mail
        let labelEmail = createNode("label", "Email: ", "", "ficha-label");
        let inputEmail = createNode("input", "", "", "ficha-input");
        inputEmail.value = socioEncontrado.email;

        // Dominio a partir de split con @
        let partesEmail = socioEncontrado.email.split("@");
        let labelDominio = createNode("label", "Dominio: ", "", "ficha-label");
        let inputDominio = createNode("input","","","ficha-input");
        inputDominio.value = partesEmail[1];

        
        // Teléfono formateado
        let telefonoFormateado = (socioEncontrado.telefono).match(/.{1,3}/g).join(' ');
        let labelNumero = createNode("label", "Numero: ", "", "ficha-label");
        let inputNumero = createNode("input", "", "", "ficha-input");
        inputNumero.value = telefonoFormateado;
        
        // Fecha de nacimiento
        let labelFechaNac = createNode("label", "Fecha de Nacimiento: ", "", "ficha-label");
        let inputFechaNac = createNode("input", "", "", "ficha-input");
        inputFechaNac.value = creaFechaNac(new Date(socioEncontrado.fechaNacimiento)) + " - " + calcularEdad(socioEncontrado.fechaNacimiento) + " años";
        
        // Tiempo y fecha que lleva de alta
        let labelFechaAlta = createNode("label", "Fecha de Alta: ", "", "ficha-label");
        let inputFechaAlta = createNode("input", "", "", "ficha-input");
        inputFechaAlta.value = socioEncontrado.fechaAlta + " - Lleva " + optenerDias(socioEncontrado.fechaAlta) + " días";
         
        // Días que faltan para su cumpleaños
        let labelCumple = createNode("label", "Próximo cumpleaños: ", "", "ficha-label");
        let inputCumple = createNode("input", "", "", "ficha-input");
        inputCumple.value = "Quedan " + diasHastaCumpleaños(socioEncontrado.fechaNacimiento) + " días para su próximo cumpleaños";

        // Actividades
        let labelActividades = createNode("label", "Actividades: ", "", "ficha-label");
        let actividadesSocio2 = createNode("div", "", "", "ficha-actividades-container");
        actividadesSocio2.appendChild(generaActividades(socioEncontrado));

        // Cuota
        let labelCuota = createNode("label", "Cuota: ", "", "ficha-label");
        let cuotaMensualSocio = createNode("input", "", "", "ficha-input");
        cuotaMensualSocio.value = socioEncontrado.cuota.toFixed(2) + "€";
       
        // Añadimos todo al contenedor del formulario
        divFormularioFicha.appendChild(labelNombre);
        divFormularioFicha.appendChild(inputNombre);
        divFormularioFicha.appendChild(labelID);      
        divFormularioFicha.appendChild(inputID);
        divFormularioFicha.appendChild(br);
        divFormularioFicha.appendChild(labelEmail);      
        divFormularioFicha.appendChild(inputEmail);
        divFormularioFicha.appendChild(labelDominio);inputDominio
        divFormularioFicha.appendChild(inputDominio);
        divFormularioFicha.appendChild(br);
        divFormularioFicha.appendChild(labelNumero);
        divFormularioFicha.appendChild(inputNumero);
        divFormularioFicha.appendChild(br);
        divFormularioFicha.appendChild(labelFechaNac);
        divFormularioFicha.appendChild(inputFechaNac);
        divFormularioFicha.appendChild(br);
        divFormularioFicha.appendChild(labelFechaAlta);
        divFormularioFicha.appendChild(inputFechaAlta);
        divFormularioFicha.appendChild(br);
        divFormularioFicha.appendChild(labelCumple);
        divFormularioFicha.appendChild(inputCumple);
        divFormularioFicha.appendChild(br);
        divFormularioFicha.appendChild(labelActividades);
        divFormularioFicha.appendChild(actividadesSocio2);
        divFormularioFicha.appendChild(br);
        divFormularioFicha.appendChild(labelCuota);
        divFormularioFicha.appendChild(cuotaMensualSocio);

    } else if (socioEncontrado == null) {
      divFormularioFicha.replaceChildren();
      let pIntroDNI = createNode("p", "Introduce un DNI válido arriba para consultar la ficha completa del socio.", "", "ficha-placeholder");
      divFormularioFicha.appendChild(pIntroDNI);
    }
  }
}
/**
 * Funcion que se le pasa una fecha de alta y devuelve los dias que lleva el tio apuntado
 * @param {*} fecha 
 * @returns 
 */
function optenerDias(fecha){

  let fechaHoy = new Date();
  let fechaAlta = new Date(fecha);


  // Diferencia en milisegundos
  let diferenciaMs = fechaHoy - fechaAlta;

  // Milisegundos en un día (1000ms * 60s * 60min * 24horas)
  let msPorDia = 1000 * 60 * 60 * 24;

  // Divido y redondeo hacia abajo para obtener días enteros
  return Math.floor(diferenciaMs / msPorDia);
}

/**
 * Funcion que se le pasa la fecha de cumpleaños y calcula los dias que faltan
 * @param {*} fecha 
 * @returns 
 */
function diasHastaCumpleaños(fechaNacimiento) {
  //saco la fecha de hoy
  let hoy = new Date();
  hoy.setHours(0, 0, 0, 0); //Pongo la fecha de hoy a las 00:00 para que no de problemas al calcular

  //saco la fecha de nacimento en tipo date
  let nacimiento = new Date(fechaNacimiento);
  
  //Ahora voy a pasar la fecha de nacimiento pero a este año, osea cojo dia y mes de la fecha de nacimiento
  //y la pongo con el año en el que estamos
  let cumpleEsteAno = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());

  // Si el cumpleaños de este año ya pasó, calculamos para el año que viene
  if (cumpleEsteAno < hoy) {
    cumpleEsteAno.setFullYear(hoy.getFullYear() + 1);
  }

  // Diferencia en milisegundos y conversión a días
  let diferenciaMs = cumpleEsteAno - hoy;
  let msPorDia = 1000 * 60 * 60 * 24;

  return Math.round(diferenciaMs / msPorDia);
}

/**
 * Fuyncion que a partir de una fecha en formato año-mes-dia te da un string de la fecha
 * @param {*} fecha 
 * @returns 
 */
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
 * Valido el formato de los DNI nuevos (solo que sean 8 numerosy  una letra)
 * @param {*} dni 
 * @returns 
 */
function validarDNI(dni) {
  //Comprobar el formato básico: 8 dígitos y una letra al final
  const regex = /^\d{8}[a-zA-Z]$/;
  if (!regex.test(dni)) {
    return false; // El formato no coincide
  }

  //Extraer el número y la letra introducida (convertida a mayúscula)
  const numero = parseInt(dni.slice(0, 8), 10);
  const letraIngresada = dni.slice(-1).toUpperCase();

  //Cadena oficial de letras para el cálculo del DNI
  const letrasValidas = "TRWAGMYFPDXBNJZSQVHLCKE";

  //Calcular la letra correcta usando el resto de dividir entre 23
  const letraCalculada = letrasValidas.charAt(numero % 23);

  //Comprobar si coincide
  return letraCalculada === letraIngresada;
}


 /* Validacion del telefono
 * @param {*} telefono 
 * @returns 
 */
function validarTelefono(telefono) {
  return /^[6789](\s*\d){8}$/.test(telefono);
}

/**
 * Validacion emial.
 * @param {*} email 
 * @returns 
 */
function validarEmail(email) {
  // Comprueba usuario @ dominio . extensión de 2 o más letras
  const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

/**
 * Función para dar de alta a un nuevo socio recogiendo los datos del formulario HTML
 */
function darAltaSocio() {
  // Limpiamos el contenedor de mensajes previo utilizando nodos si es necesario o reseteando su contenido
  divAltaSocio.innerHTML = ""; // Limpieza inicial del contenedor destino

  // Recogemos los valores básicos de los inputs de texto, email, tel, date y number
  const nombreApellidos = document.getElementById("add-nombre").value.trim();
  const dni = document.getElementById("add-dni").value.trim();
  const email = document.getElementById("add-email").value.trim();
  const telefono = document.getElementById("add-telefono").value.trim();
  const fechaNacimiento = document.getElementById("add-fecha-nacimiento").value;
  const cuota = parseFloat(document.getElementById("add-cuota").value) || 0;

  const arrayErrores = [];
  // Recogemos las actividades marcadas de los checkboxes
  const checkboxesActividades = document.querySelectorAll('#form-add-member input[name="actividades"]:checked');
  let actividadesSeleccionadas = [];
  
  for (let chk of checkboxesActividades) {
    actividadesSeleccionadas.push(chk.value);
  }
  let stringActividades = actividadesSeleccionadas.join(",");

  // Validaciones básicas obligatorias
  if (nombreApellidos.length == 0 || nombreApellidos == "") {    
     arrayErrores.push("Nombre No INDICADO");
  }

  // Busco el socio por el DNI para ver si existe
  let socioEncontrado = null;
  for (let soc of listaSocios) {
    if (soc.dni.localeCompare(dni) == 0) {
      socioEncontrado = soc;
      break;
    }
  }
  
  if (socioEncontrado != null) {
    arrayErrores.push("Ese DNI YA EXISTE");
  }

  if (!validarDNI(dni)) {
    arrayErrores.push("FORMATO DNI INVÁLIDO");
  }
  if (dni == "" || dni.length == 0) {
     arrayErrores.push("DNI NO INDICADO");
  }
  
  if (!validarEmail(email)) {
    arrayErrores.push("FORMATO EMAIL INVÁLIDO");
  }
  if (email == "" || email.length == 0) {
    arrayErrores.push("Email NO INDICADO");
  }

  if (telefono == "" || telefono.length == 0) {
    arrayErrores.push("Numero de telefono no indicado");
  }
  if (!validarTelefono(telefono)) {
    arrayErrores.push("FORMATO de Numero IVANLIDO");
  }
 
  if (fechaNacimiento == "" || fechaNacimiento.length == 0) {
    arrayErrores.push("Fecha de nacimiento NO INDICADO");
  }
  
  let edad = calcularEdad(fechaNacimiento);
  if (edad < 14) {
    arrayErrores.push("No se permiten menores de 14");
  }

  if (cuota == 0) {
    arrayErrores.push("Cuota NO INDICADO");
  }

  if (actividadesSeleccionadas.length == 0) {
    arrayErrores.push("Sin actividades seleccionadas");
  }

  // SI HAY ERRORES: Creamos el contenedor con createNode y añadimos cada error con <br> o divs mediante nodos
  if (arrayErrores.length > 0) {
    let contenedorErrores = createNode("div", "", "", "error-alta-socio");
    
    for (let i = 0; i < arrayErrores.length; i++) {
      let textoError = createNode("span","-"+arrayErrores[i].toUpperCase(), "", "");
      contenedorErrores.appendChild(textoError);
      
      // Si no es el último error, añadimos un salto de línea para separar
      if (i < arrayErrores.length - 1) {
        contenedorErrores.appendChild(createNode("br", "", "", ""));
      }
    }
    
    divAltaSocio.appendChild(contenedorErrores);
    return; // Para salir de la funcion
  }

  // Separamos Nombre y Apellidos
  let partesNombre = nombreApellidos.split(" ");
  let nombre = partesNombre[0];
  let apellidos = partesNombre.slice(1).join(" ");

  // Generamos un ID automático nuevo
  let ultimoSocio = listaSocios[listaSocios.length - 1];
  let partesId = ultimoSocio.id.split("-");
  let numeroSiguiente = parseInt(partesId[1], 10) + 1;
  let numeroFormateado = String(numeroSiguiente).padStart(4, '0');
  let nuevoId = "SOC-" + numeroFormateado;

  // Obtenemos la fecha actual
  let hoy = new Date();
  let anio = hoy.getFullYear();
  let mes = String(hoy.getMonth() + 1).padStart(2, '0');
  let dia = String(hoy.getDate()).padStart(2, '0');
  let fechaAltaActual = `${anio}-${mes}-${dia}`;

  // Creamos el objeto del nuevo socio
  let nuevoSocio = {
    id: nuevoId,
    nombre: nombre,
    apellidos: apellidos,
    dni: dni,
    email: email,
    telefono: telefono,
    fechaNacimiento: fechaNacimiento,
    fechaAlta: fechaAltaActual,
    cuota: cuota,
    actividades: stringActividades
  };

  // Añadimos el socio a la lista original
  listaSocios.push(nuevoSocio);

  // Actualizamos la tabla de la interfaz
  filtrarYMostrarSocios();

  // Limpio el formulario si todo sale bien
  document.getElementById("form-add-member").reset();
  
  // SI TODO SALE BIEN: Mensaje de éxito con createNode y appendChild con estilo verde
  let mensajeExito = `¡Socio ${nombre} con ID ${nuevoId} dado de alta correctamente!`;
  let contenedorExito = createNode("div", mensajeExito, "", "exito-alta-socio");
  divAltaSocio.appendChild(contenedorExito);
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
