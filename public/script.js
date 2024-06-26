$(document).ready(function () {
  const transferenciasArray = [];
  $("#formTransf").submit(function (e) {
    e.preventDefault();
    var emisor = $("#emisorTransfOption").val();
    var receptor = $("#receptorTransfOption").val();
    var monto = $("#montoInput").val();
    var descripcion = $("#descripcionInput").val();

    if (!emisor || !receptor || !monto || !descripcion) {
      alert("Por favor, complete todos los campos.");
    } else if (emisor === receptor) {
      toastAlert("Emisor y receptor no puede ser el mismo");
      return false;
    } else if (!verificarSaldoEmisor(emisor, monto)) {
      toastAlert(
        "El emisor no tiene suficiente saldo para realizar la transferencia"
      );
      return false;
    }

    const { data } = axios
      .post(`http://localhost:3002/transferencia`, {
        descripcion,
        monto,
        emisor,
        receptor,
      })
      .then(function (response) {
        toastAlert(response.data.message);
        limpiarFormulario();
        getUltimaTransferencia();
      })
      .catch(function (error) {
        console.error("Error:", error);
        toastAlert("Error al enviar la solicitud");
      });
  });

  getUltimaTransferencia();
  getCuentasOption();
  getTodasLasCuentas();
});
async function getUltimaTransferencia() {
  $("#ultimaTransferencia").empty();
  const { data } = await axios.get("http://localhost:3002/transferencias");
  console.log(data);
  data.forEach((t) => {
    $("#ultimaTransferencia").append(`
       <tr>
         <td> ${formatDate(t.fecha)} </td>
         <td> ${t.descripcion} </td>
         <td> ${t.cuenta_origen} </td>
         <td> ${t.cuenta_destino} </td>
         <td> $${t.monto} </td>
       </tr>
     `);
  });
}
async function getCuentasOption() {
  $("#emisorOption").empty();
  $("#cuentaOption").empty();
  $("#emisorTransfOption").empty();
  $("#receptorTransfOption").empty();

  $("#cuentaOption").append(`<option value="">Seleccionar</option>`);
  $("#emisorOption").append(`<option value="">Seleccionar</option>`);
  $("#emisorTransfOption").append(`<option value="">Seleccionar</option>`);
  $("#receptorTransfOption").append(`<option value="">Seleccionar</option>`);
  const { data } = await axios.get("http://localhost:3002/cuentas");
  //console.log(data);
  data.forEach((t) => {
    //console.log(t.id);
    $("#cuentaOption").append(`<option value="${t.id}">${t.id}</option>`);
    $("#emisorOption").append(`<option value="${t.id}">${t.id}</option>`);
    $("#emisorTransfOption").append(`<option value="${t.id}">${t.id}</option>`);
    $("#receptorTransfOption").append(
      `<option value="${t.id}">${t.id}</option>`
    );
  });
}
$("#emisorOption").change(async (e) => {
  let id = $("#emisorOption").val();
  const { data } = await axios.get(
    `http://localhost:3002/transferenciaporcuenta?id=${id}`
  );
  resBusqueda(data);
  //console.log(data);
});
async function resBusqueda(data) {
  $("#transferenciaFiltro").empty();
  data.forEach((t) => {
    $("#transferenciaFiltro").append(`
           <tr>
             <td> ${formatDate(t.fecha)} </td>
             <td> ${t.descripcion} </td>
             <td> ${t.cuenta_origen} </td>
             <td> ${t.cuenta_destino} </td>
             <td> $${t.monto} </td>
           </tr>
         `);
  });
}
$("#cuentaOption").change(async (e) => {
  let id = $("#cuentaOption").val();
  const { data } = await axios.get(
    `http://localhost:3002/saldoporcuenta?id=${id}`
  );
  resSaldo(data);
  //console.log(data);
});
async function resSaldo(data) {
  $("#saldoFiltro").empty();
  data.forEach((t) => {
    $("#saldoFiltro").append(`
           <tr>
             <td> $${t.saldo} </td>
           </tr>
         `);
  });
}
function toastAlert(message) {
  $("#toastContainer").empty();
  const toast = `<div class="toast" role="toastalert" aria-live="assertive" aria-atomic="true" data-delay="5000">
    <div class="toast-header">
      <strong class="me-auto">ToastAlert</strong>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>  </div>
    <div class="toast-body">
      ${message}
    </div>
    </div>`;
  $("#toastContainer").append(toast);
  $(".toast").toast("show");
  $("#exampleModal").modal("hide");
}
function limpiarFormulario() {
  $("#emisorTransfOption").val("");
  $("#receptorTransfOption").val("");
  $("#montoInput").val("");
  $("#descripcionInput").val("");
}

const formatDate = (date) => {
  const dateFormat = moment(date).format("L");
  const timeFormat = moment(date).format("LTS");
  return `${dateFormat} ${timeFormat}`;
};

async function getTodasLasCuentas() {
  const { data } = await axios.get("http://localhost:3002/todaslascuentas");
  transferenciasArray = data;
  //console.log(transferenciasArray);
}

function verificarSaldoEmisor(cuentaEmisor, monto) {
  const emisorInfo = transferenciasArray.find(
    (transf) => transf.id == parseInt(cuentaEmisor)
  );
  //console.log(cuentaEmisor);
  const saldoEmisor = parseFloat(emisorInfo.saldo);
  if (isNaN(saldoEmisor) || saldoEmisor < monto) {
    return false;
  }
  return true;
}
