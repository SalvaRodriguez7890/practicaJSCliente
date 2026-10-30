/**
 *Funcion que genera la fecha actual de hoy y muestra la hora cada segundo 
 */

 function muestraFecha(){
 //saco el elemento que muestra la fecha y la hora en el html que voy a usar
 //dentro de la funcion para actualizar los datos
const fechHTML = document.getElementById("current-date");

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
//llamo a lafuncion para monstrarla
muestraFecha();

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
  
  const horaHTML = document.getElementById("current-time");
  if (horaHTML) {
    horaHTML.innerText = horaFormateada;
  }
}
//llamo a lafuncion para monstrarla con un interval con cada segundo
setInterval(actualizarHora, 1000);

