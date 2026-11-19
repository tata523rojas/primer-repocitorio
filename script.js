// Sonidos suaves con Web Audio API (sin archivos externos)
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

// Navegación por secciones (Catálogo vs Personalizar tu pedido)
const btnIrCatalogo = document.getElementById("btn-ir-catalogo");
const btnIrPersonalizar = document.getElementById("btn-ir-personalizar");
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
btnVolverCatalogo.addEventListener("click", () => mostrarSeccion("catalogo"));

// Botón Bienvenido con sonido
const btnBienvenida = document.getElementById("btn-bienvenida");
const mensajeBienvenida = document.getElementById("mensaje-bienvenida");

btnBienvenida.addEventListener("click", () => {
  reproducirSonido([523.25, 659.25, 783.99, 1046.5]);
  mensajeBienvenida.textContent =
    "¡Bienvenido a Amor en Detalle! Un amor inolvidable que perdura. Elige tu ramo o personaliza tu pedido.";
});

// Selección de ramos del catálogo
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

// Cálculo dinámico del pedido estimado
const selectColorRosa = document.getElementById("color-rosa");
const selectColorPapel = document.getElementById("color-papel");
const extraCorona = document.getElementById("extra-corona");
const extraMariposas = document.getElementById("extra-mariposas");
const extraCinta = document.getElementById("extra-cinta");
const inputDedicatoria = document.getElementById("dedicatoria");
const totalPedidoEl = document.getElementById("total-pedido");
const detalleCalculoEl = document.getElementById("detalle-calculo");
const enlaceWhatsapp = document.getElementById("enlace-whatsapp");

function calcularPedido() {
  const cantidad = Math.max(1, Number(inputCantidad.value) || ramoSeleccionado.rosasBase);
  const rosasAdicionales = Math.max(0, cantidad - ramoSeleccionado.rosasBase);
  const costoRosasExtra = rosasAdicionales * 4500;

  let costoExtras = 0;
  const extrasElegidos = [];

  [extraCorona, extraMariposas, extraCinta].forEach((chk) => {
    if (chk.checked) {
      costoExtras += Number(chk.dataset.costo);
      extrasElegidos.push(chk.value);
    }
  });

  const total = ramoSeleccionado.precioBase + costoRosasExtra + costoExtras;
  totalPedidoEl.textContent = `Tu pedido estimado es de: ${formatoPesos(total)}`;

  detalleCalculoEl.textContent =
    `Base (${ramoSeleccionado.nombre}): ${formatoPesos(ramoSeleccionado.precioBase)} | ` +
    `Rosas extra (${rosasAdicionales}): ${formatoPesos(costoRosasExtra)} | ` +
    `Extras: ${formatoPesos(costoExtras)}`;

  const resumenTexto =
    `¡Hola! ¿Cómo estás? Quiero pedir en Amor en Detalle: ${ramoSeleccionado.nombre}, ` +
    `color de rosas: ${selectColorRosa.value}, cantidad: ${cantidad}, ` +
    `papel: ${selectColorPapel.value}, ` +
    `extras: ${extrasElegidos.length ? extrasElegidos.join(", ") : "ninguno"}, ` +
    `dedicatoria: "${inputDedicatoria.value.trim() || "sin dedicatoria"}". ` +
    `Total estimado: ${formatoPesos(total)}.`;

  enlaceWhatsapp.href = `https://wa.me/573136777551?text=${encodeURIComponent(resumenTexto)}`;
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
  elemento.addEventListener("input", calcularPedido);
  elemento.addEventListener("change", calcularPedido);
});

// Confirmación de compra
const formPedido = document.getElementById("form-pedido");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");

formPedido.addEventListener("submit", (evento) => {
  evento.preventDefault();
  calcularPedido();
  reproducirSonido([523.25, 659.25, 783.99, 1046.5]);
  mensajeConfirmacion.textContent =
    "¡Muchas gracias por tu pedido, me encantó! Si deseas coordinar o cotizar por fuera, escríbenos al 313 677 7551.";
  mensajeConfirmacion.classList.add("visible");
});

calcularPedido();