//Creo padre, y con windows.opener le asigno la ventana desde la que se a abierto, osea desde donde se a creado 
//seria la aplicacion principal
const padre = window.opener;

//Si se abre este archivo directamente, sin pasar por el index, no hay nada que modificar
//osea si abro el index a parte sin usar la aplicacion
if (!padre || padre.closed || !padre.obtenerSocioActual || !padre.obtenerSocioActual()) {
    //Con replaceChildren borro todo lo que hay y le meto un mensaje
  document.body.replaceChildren(createMensaje("No hay ningún socio seleccionado. Cierra esta ventana y pulsa Modificar desde la ficha."));
} else {
    //si no inicialzo el formulario usando la funcion
  iniciaFormulario();
}

//funcion para crear un mensaje de texto
function createMensaje(texto) {
  const p = document.createElement("p");
  p.className = "placeholder-text";
  p.textContent = texto;
  return p;
}

/**
 * Funcion que rellena el formulario del formularioModificaSocio.html
 */
function iniciaFormulario() {

  //Referencia al mismo objeto que hay dentro de listaSocios
  //padre es la ventana princiapl, donde existe la funcion que nos devuelve el socio encontrado
  const socio = padre.obtenerSocioActual();

  //Relleno el formulario con los datos del socio
  document.getElementById("mod-id").value = socio.id;
  document.getElementById("mod-dni").value = socio.dni;
  document.getElementById("mod-nombre").value = socio.nombre;
  document.getElementById("mod-apellidos").value = socio.apellidos;
  document.getElementById("mod-email").value = socio.email;
  document.getElementById("mod-telefono").value = socio.telefono;
  document.getElementById("mod-fecha-nacimiento").value = socio.fechaNacimiento;
  document.getElementById("mod-fecha-alta").value = socio.fechaAlta;
  document.getElementById("mod-cuota").value = socio.cuota.toFixed(2); //le meto fixed para que muestre los 2 decimales

  //Marco los checkboxes de las actividades que ya tiene el socio
  //Con el split "," creo un array con las actividades
const actividadesSocio = socio.actividades.split(",");

//Cojo todos los checkboxes del formulario, con querySelectorAll cuyo name es actividades los cojo y creo un array de checks
const checkboxes = document.querySelectorAll('input[name="actividades"]');

//Recorro cada checkbox
for (let chk of checkboxes) {

  //Empiezo suponiendo que NO está marcado
  chk.checked = false;

  //Recorro las actividades del socio para ver si alguna coincide con este checkbox
  for (let act of actividadesSocio) {

    //Le meto trim y toLowerCase para quitarle espacios y ponerlos en minusculas
    //si alguno coincice pues ese chk.checked se pone a true osea que lo marco para decir
    //que ese socio tiene esa actividad contratada
    if (act.trim().toLowerCase() == chk.value) {
      chk.checked = true;
    }
  }
}
//obtengo los dos botones y le meto un arrow simple, donde window.close() cierra la ventana para cancelarlo
//y guardarCambios(socio) le cambia los datos nuevos al socio
  document.getElementById("mod-cancelar").addEventListener("click", () => window.close());
  document.getElementById("mod-guardar").addEventListener("click", () => guardaCambios(socio));
}

/**
 * Funcion que guarda los nuevos datos en el array del padre
 * @param {*} socio 
 * @returns 
 */
function guardaCambios(socio) {

    //cojo el div para los mensajes y le borro todo lo que tenga (si esque tiene algo)
  const contenedorMensajes = document.getElementById("mod-mensajes");
  contenedorMensajes.replaceChildren();

  //saco los datos nuevos del formulario que he modificado
  //como curiosidad el ID del socio y el DNI no los puedo cambiar ni tampoco la fecha de alta
  const nombre = document.getElementById("mod-nombre").value.trim();
  const apellidos = document.getElementById("mod-apellidos").value.trim();
  const email = document.getElementById("mod-email").value.trim();
  const telefono = document.getElementById("mod-telefono").value.trim();
  const fechaNacimiento = document.getElementById("mod-fecha-nacimiento").value;
  const cuota = parseFloat(document.getElementById("mod-cuota").value) || 0;

  //relleno un array con las nuevas actividades
  const actividadesNuevas = [];
  for (let chk of document.querySelectorAll('input[name="actividades"]:checked')) {
    actividadesNuevas.push(chk.value);
  }

  //Validaciones, reutilizando las funciones de la página principal.
  //Creo un array de erroes y voy mirando si algun campo Está vacio
  //tambien uso las mismas validaciones que usaba al meter un socio nuevo llamando a padre (que era la ventana principal)
  const errores = [];

  //Valido nombre
  if (nombre == ""){
    errores.push("Nombre no indicado");
  }
  if (apellidos == "") {
    errores.push("Apellidos no indicados");
  }

  //valido email
  if (email == "") {
    errores.push("Email no indicado");
  }else if (!padre.validarEmail(email)){ 
    errores.push("Formato de email inválido");
  }

  //valido telefono nuevo
  if (telefono == "") {
    errores.push("Teléfono no indicado");
  }else if (!padre.validarTelefono(telefono)){
    errores.push("Formato de teléfono inválido");
  }

  //valido la fecha de nacimineto
  if (fechaNacimiento == ""){
    errores.push("Fecha de nacimiento no indicada");
  }else if (padre.calcularEdad(fechaNacimiento) < 14) {
    errores.push("No se permiten menores de 14");
  }

  //valido la cuota que no sea 0 ni negativa
  if (cuota <= 0) {
    errores.push("Cuota no indicada");
  }
  //que almenos tenga alguna actividad
  if (actividadesNuevas.length == 0){
    errores.push("Sin actividades seleccionadas");
  }

  //si el array de erroes tiene algun error pues lo muestro
  if (errores.length > 0) {
    const divErrores = document.createElement("div");
    divErrores.className = "error-alta-socio";

    //recorro el array y con span voy metiendo cada fallo en amyuscula
    for (let i = 0; i < errores.length; i++) {
      const span = document.createElement("span");
      span.textContent = "-" + errores[i].toUpperCase();
      //añado cada span al div de Erorres
      divErrores.appendChild(span);
      //si es la ultima vuelta le meto un br
      if (i < errores.length - 1) {
        divErrores.appendChild(document.createElement("br"));
      }
    }
    //al contenedor de mensajes le meto el div con los errores
    contenedorMensajes.appendChild(divErrores);
    return;
  }

  //Si todo esta bien pues solo cambio los datos del socio por los nuevos
  //arriba le asigne a socio "padre.obtenerSocioActual();" el cual es directamente
  //el socioEncontrado dentro del array listaSocios, por lo que actualizando los datos aqui 
  //tambien se cambian
  socio.nombre = nombre;
  socio.apellidos = apellidos;
  socio.email = email;
  socio.telefono = telefono.replace(/\s/g, ""); //le quito los espacios para guardarlos
  socio.fechaNacimiento = fechaNacimiento;
  socio.cuota = cuota;
  socio.actividades = actividadesNuevas.join(", "); //Con el join ", " creo un solo string a partir del array de actividades, metiendole una coma a cada actividad y un espacio

  //Refresco la página principal

  //mostrando y filtrando los socios de nuevo 
  padre.filtrarYMostrarSocios();

  //modificando las nuevas estadisticas
  padre.estadisticas();

  //Refresco la ficha del socio con los nuevos datos
  padre.fichaSocio();

  //tras actualizar los datos cierro la ventana
  window.close();
}