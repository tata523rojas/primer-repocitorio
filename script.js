
 function reproducirSonido(notas = [523.25, 659.25, 783.99]) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  notas.forEach((frecuencia, indice) => {
    const osc = ctx.createOscillator();
    const ganancia = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frecuencia;

    const inicio = ctx.currentTime + indice * 0.09;
    ganancia.gain.setValueAtTime(0.001, inicio);
    ganancia.gain.exponentialRampToValueAtTime(0.11, inicio + 0.025);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.2);

    osc.connect(ganancia);
    ganancia.connect(ctx.destination);
    osc.start(inicio);
    osc.stop(inicio + 0.22);
  });
}

function formatoPesos(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

const btnIrCatalogo = document.getElementById("btn-ir-catalogo");
const btnIrPersonalizar = document.getElementById("btn-ir-personalizar");
const btnIrPersonalizarAbajo = document.getElementById("btn-ir-personalizar-abajo");
const btnVolverCatalogo = document.getElementById("btn-volver-catalogo");
const seccionCatalogo = document.getElementById("seccion-catalogo");
const seccionPersonalizar = document.getElementById("seccion-personalizar");

function mostrarSeccion(nombreSeccion, conSonido = true) {
  const esPersonalizar = nombreSeccion === "personalizar";
  seccionCatalogo.classList.toggle("activa", !esPersonalizar);
  seccionPersonalizar.classList.toggle("activa", esPersonalizar);

  btnIrCatalogo.classList.toggle("activo", !esPersonalizar);
  btnIrPersonalizar.classList.toggle("activo", esPersonalizar);

  if (conSonido) {
    reproducirSonido(esPersonalizar ? [587.33, 783.99] : [659.25, 523.25]);
  }
}

btnIrCatalogo.addEventListener("click", () => mostrarSeccion("catalogo"));
btnIrPersonalizar.addEventListener("click", () => mostrarSeccion("personalizar"));
if (btnIrPersonalizarAbajo) {
  btnIrPersonalizarAbajo.addEventListener("click", () => mostrarSeccion("personalizar"));
}
btnVolverCatalogo.addEventListener("click", () => mostrarSeccion("catalogo"));

const btnBienvenida = document.getElementById("btn-bienvenida");
const mensajeBienvenida = document.getElementById("mensaje-bienvenida");

btnBienvenida.addEventListener("click", () => {
  reproducirSonido([523.25, 659.25, 783.99, 1046.5]);
  mensajeBienvenida.textContent =
    "Bienvenido a Amor en Detalle. Un detalle único que tú nunca olvidarás — elige tu ramo o cotízalo aquí.";
});

const tarjetasRamo = document.querySelectorAll(".tarjeta-ramo");
const ramoActualInfo = document.getElementById("ramo-actual-info");
const inputCantidad = document.getElementById("cantidad-rosas");

let ramoSeleccionado = {
  nombre: "Ramo de 3 Rosas",
  precioBase: 25000,
  rosasBase: 3
};

function obtenerRosasBaseDeNombre(nombre) {
  if (nombre.includes("4")) return 4;
  if (nombre.includes("5")) return 5;
  return 3;
}

tarjetasRamo.forEach((tarjeta) => {
  const boton = tarjeta.querySelector(".btn-elegir-ramo");
  boton.addEventListener("click", () => {
    tarjetasRamo.forEach((t) => t.classList.remove("seleccionada"));
    tarjeta.classList.add("seleccionada");

    const nombre = tarjeta.dataset.nombre;
    const precioBase = Number(tarjeta.dataset.precio);
    const rosasBase = obtenerRosasBaseDeNombre(nombre);

    ramoSeleccionado = { nombre, precioBase, rosasBase };
    inputCantidad.value = rosasBase;
    ramoActualInfo.textContent = `Ramo base seleccionado: ${nombre} (${formatoPesos(precioBase)})`;

    reproducirSonido([523.25, 783.99]);
    mostrarSeccion("personalizar", false);
    calcularPedido();
  });
});

const selectColorRosa = document.getElementById("color-rosa");
const selectColorPapel = document.getElementById("color-papel");
const extraCorona = document.getElementById("extra-corona");
const extraMariposas = document.getElementById("extra-mariposas");
const extraCinta = document.getElementById("extra-cinta");
const inputDedicatoria = document.getElementById("dedicatoria");
const totalPedidoEl = document.getElementById("total-pedido");
const detalleCalculoEl = document.getElementById("detalle-calculo");
const enlaceWhatsapp = document.getElementById("enlace-whatsapp");
const enlaceWhatsappCatalogo = document.getElementById("enlace-whatsapp-catalogo");

function calcularPedido() {
  const cantidad = Math.max(1, Number(inputCantidad.value) || ramoSeleccionado.rosasBase);
  const rosasAdicionales = Math.max(0, cantidad - ramoSeleccionado.rosasBase);
  const costoRosasExtra = rosasAdicionales * 4500;

  let costoExtras = 0;
  const extrasElegidos = [];

  [extraCorona, extraMariposas, extraCinta].forEach((chk) => {
    if (chk && chk.checked) {
      costoExtras += Number(chk.dataset.costo);
      extrasElegidos.push(chk.value);
    }
  });

  const total = ramoSeleccionado.precioBase + costoRosasExtra + costoExtras;
  totalPedidoEl.textContent = `Valor estimado de tu ramo: ${formatoPesos(total)}`;

  detalleCalculoEl.textContent =
    `Base (${ramoSeleccionado.nombre}): ${formatoPesos(ramoSeleccionado.precioBase)} | ` +
    `Rosas extra (${rosasAdicionales}): ${formatoPesos(costoRosasExtra)} | ` +
    `Extras: ${formatoPesos(costoExtras)}`;

  const resumenTexto =
    `¡Hola! ¿Cómo estás? Quiero cotizar en Amor en Detalle: ${ramoSeleccionado.nombre}, ` +
    `color de rosas: ${selectColorRosa.value}, cantidad: ${cantidad}, ` +
    `papel: ${selectColorPapel.value}, ` +
    `extras: ${extrasElegidos.length ? extrasElegidos.join(", ") : "ninguno"}, ` +
    `dedicatoria/acomodo: "${inputDedicatoria.value.trim() || "sin detalle extra"}". ` +
    `Valor estimado: ${formatoPesos(total)}.`;

  const urlWs = `https://wa.me/573136777551?text=${encodeURIComponent(resumenTexto)}`;
  if (enlaceWhatsapp) {
    enlaceWhatsapp.href = urlWs;
  }
  if (enlaceWhatsappCatalogo) {
    enlaceWhatsappCatalogo.href = urlWs;
  }
}

[
  selectColorRosa,
  inputCantidad,
  selectColorPapel,
  extraCorona,
  extraMariposas,
  extraCinta,
  inputDedicatoria
].forEach((elemento) => {
  if (!elemento) return;
  elemento.addEventListener("input", calcularPedido);
  elemento.addEventListener("change", calcularPedido);
});

const formPedido = document.getElementById("form-pedido");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");

formPedido.addEventListener("submit", (evento) => {
  evento.preventDefault();
  calcularPedido();
  reproducirSonido([523.25, 659.25, 783.99, 1046.5]);
  mensajeConfirmacion.textContent =
    "¡Muchas gracias por tu pedido, me encantó! Si deseas cotizar por fuera o ajustar detalles, escríbenos al 313 677 7551.";
  mensajeConfirmacion.classList.add("visible");
});

calcularPedido();

  
  
