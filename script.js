const ramosCatalogo = [
  { id: 1, nombre: "Ramo Clásico Dulce", precioBase: 35000 },
  { id: 2, nombre: "Ramo Romántico Satín", precioBase: 50000 },
  { id: 3, nombre: "Ramo Especial Sorpresa", precioBase: 75000 }
];

const listaRamos = document.getElementById("lista-ramos");
const formPedido = document.getElementById("form-pedido");
const listaCarrito = document.getElementById("lista-carrito");
const totalPedido = document.getElementById("total-pedido");

let totalAcumulado = 0;

function renderizarCatalogo() {
  listaRamos.innerHTML = "";
  ramosCatalogo.forEach((ramo) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-ramo";
    tarjeta.innerHTML = `
      <h3>${ramo.nombre}</h3>
      <p>Rosas eternas en satín elaboradas a mano.</p>
      <p class="precio">$${ramo.precioBase.toLocaleString("es-CO")}</p>
      <button type="button" class="btn-principal" onclick="agregarRamoBase(${ramo.id})">
        Elegir ramo
      </button>
    `;
    listaRamos.appendChild(tarjeta);
  });
}

function agregarItemAlCarrito(descripcion, valor) {
  const item = document.createElement("li");
  item.textContent = `${descripcion} — $${valor.toLocaleString("es-CO")}`;
  listaCarrito.appendChild(item);

  totalAcumulado += valor;
  totalPedido.textContent = `Total estimado: $${totalAcumulado.toLocaleString("es-CO")}`;
}

window.agregarRamoBase = function (id) {
  const ramo = ramosCatalogo.find((r) => r.id === id);
  if (ramo) {
    agregarItemAlCarrito(ramo.nombre, ramo.precioBase);
  }
};

formPedido.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const color = document.getElementById("color-rosa").value;
  const cantidad = parseInt(document.getElementById("cantidad-rosas").value, 10) || 12;
  const dedicatoria = document.getElementById("dedicatoria").value.trim();

  const valorPersonalizado = cantidad * 3000;
  const detalleExtra = dedicatoria ? ` (${dedicatoria})` : "";
  const descripcion = `Pedido: ${cantidad} rosas ${color}${detalleExtra}`;

  agregarItemAlCarrito(descripcion, valorPersonalizado);
  formPedido.reset();
  document.getElementById("cantidad-rosas").value = 12;
});

renderizarCatalogo();