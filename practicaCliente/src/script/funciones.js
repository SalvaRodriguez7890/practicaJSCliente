/**
 * Constantes y variables
 */
//Elemento HTML Hora
const horaHTML = document.getElementById("current-time");
//ELEMENTO HTML FECHA
const fechHTML = document.getElementById("current-date");

//lista de socios
const listaSocios = sociosClubCompleto;

//elemento htm tabla socios
const tablaSociosHTML = document.getElementById("members-table");

//Elemento de buscar socios (input)

const buscarSocio = document.getElementById("search-input");

//Elemento de buscar actividades (desplegable)

const buscarActividad = document.getElementById("filter-activity");


/**
 * Llamada funciones
 */

//Funcion Fecha
muestraFecha();

//Funcion Hora con setInterval para que se actualice cada segundo
setInterval(actualizarHora, 1000);

//funcion que recorre el array de socios y los muestra en la tabla del HTML
muestraSocios();












/**
 *Funcion que genera la fecha actual de hoy y muestra la hora cada segundo 
 */

 function muestraFecha(){
 //saco el elemento que muestra la fecha y la hora en el html que voy a usar
 //dentro de la funcion para actualizar los datos


//creo una constante de la fecha que es ahoram ismo
const fechaHoy = new Date();

  // Creo un array para los meses y dias
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const mesesAnio = [   'de Enero', 
                        'de Febrero', 
                        'de Marzo', 
                        'de Abril', 
                        'de Mayo', 
                        'de Junio', 
                        'de Julio', 
                        'de Agosto', 
                        'de Septiembre', 
                        'de Octubre', 
                        'de Noviembre', 
                        'de Diciembre'
                    ];

//Creo una constante la cual le paso el dia que es hoy con el .getDay() (devuelve un numero 0 al 6, 0 es el domingo y nos
//el array nos pasa el dia que es ya que coincide con su index)
  const nombreDia = diasSemana[fechaHoy.getDay()];
//Al numero de dia simplemente saco el numero con .getDate()
  const numeroDia = fechaHoy.getDate();
//Com el mes hago lo mismo que con el dia de la semana, pero el mes empieza en enero
  const nombreMes = mesesAnio[fechaHoy.getMonth()];
//Con el año saco el año sin mas
  const anio = fechaHoy.getFullYear();
  // Unimos todo respetando tu formato exacto
  fechHTML.innerText= `${nombreDia}, ${numeroDia} ${nombreMes} del ${anio}`;
}


/**
 * Función que actualiza la hora actual cada segundo usando toLocaleTimeString
 */
function actualizarHora() {
  const ahora = new Date();
  
  // Pongo 'es-ES' para indicar el formato en español y que el formato sea { hour: '2-digit', minute: '2-digit', second: '2-digit' } 
  // fuerza a que siempre muestre dos dígitos (ej: 05:29:51)
  const horaFormateada = ahora.toLocaleTimeString('es-ES', 
    { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  if (horaHTML) {
    horaHTML.innerText = horaFormateada;
  }
}


/**
 * Funcion que coge la fecha de nacimineto del socio y devuelve la edad
 * @param {*} fechaNacimiento 
 * @returns 
 */
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = nacimiento.getMonth();

  // Comprobamos si aún no ha cumplido años este año
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

/**
 * Funcion que devuelve un string con el la primera letra del nombre y del apellido
 * @param {*} socio 
 * @returns 
 */
function generaAvatar(socio){
  return (socio.nombre[0]+socio.apellidos[0]).toUpperCase();
}

/**
 * Funcxion que por socio devuelve un string con sus actividades metidos dentro de un p
 * donde luego en el css se le da estilos
 * @param {*} socio 
 * @returns 
 */
function generaActividades(socio) {
  let actividadesHTML = socio.actividades.split(",");
  let finalString = '<div class="flex-actividades">';

  for(act of actividadesHTML){
    finalString += `<span class="actividades">${act.trim()}</span>`;
  }
  
  finalString += '</div>';
  return finalString;
}

/**
 * Mediante una expresion regula cambia el email y lo encripta
 * @param {*} email 
 * @returns 
 */
function escondeMail(email){

  //esa expresion regular cambia a partir de las dos primeras todo por * hasta el @
  const emailOculto = email.replace(/(?<=^.{2}).*?(?=@)/, (match) => "*".repeat(match.length));
  return emailOculto;
}

function formatoFila(socio){
  let fila = "";
  fila = `<tr>` +
            `<td><span class="spanAvatar">${generaAvatar(socio)}</span></td>` +
            `<td><b><p class="tdSocio">${socio.nombre} ${socio.apellidos}</p></b></td>` +
            `<td><b>${socio.id}</b></td>` +
            `<td>${escondeMail(socio.email)}</td>` +
            `<td class="tdActividades">${generaActividades(socio)}</td>` +
            `<td>${calcularEdad(socio.fechaNacimiento)}</td>`+
            `<td class="tdCuota">${socio.cuota.toFixed(2)}€</td>` +
            `</tr>`;
  return fila;
}

/**
 * Que siempre escucha al desplegable de actividades y actualiza la lista
 * @param {*} actividad 
 */
buscarActividad.addEventListener("input", (evento) => {

let textoActividad = evento.target.value;
let fila = "";


for(socio of listaSocios){

  if(nombre.includes(textoActividad.toUpperCase()) 
    || email.includes(textoActividad.toUpperCase()) 
    || apellidos.includes(textoActividad.toUpperCase())){
    
     fila += formatoFila(socio);
    
  }
}

 tablaSociosHTML.innerHTML = fila;

}) 

/**
 * Función que coje los datos del array del fichero "datos.js" y los muestra en la tabla de socios del HTML
 * A la fila de actividades le meto un id para luego meterle stylos desde css
 */
function muestraSocios(){
  let fila = "";
  for(socio of listaSocios){
    fila += formatoFila(socio);
  }
  tablaSociosHTML.innerHTML += fila;
}

/**
 * Funcion con addEventListener que escucha al input de buscar socio y realiza al busqueda 
 * actualizando la tabla
 */
buscarSocio.addEventListener("input", (evento) => {

let textoActividad = evento.target.value;
let fila = "";


for(socio of listaSocios){

  let nombre = socio.nombre.toUpperCase().replaceAll("[ÁÉÍÓÚ]","[AEIOU]");
  let apellidos = socio.apellidos.toUpperCase().replaceAll("[ÁÉÍÓÚ]","[AEIOU]");
  let email = socio.email.toUpperCase().replaceAll("[ÁÉÍÓÚ]","[AEIOU]");



  if(nombre.includes(textoActividad.toUpperCase()) 
    || email.includes(textoActividad.toUpperCase()) 
    || apellidos.includes(textoActividad.toUpperCase())){
    
     fila += formatoFila(socio);
    
  }
}

 tablaSociosHTML.innerHTML = fila;

}) 









