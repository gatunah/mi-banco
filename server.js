const express = require("express");
const moment = require("moment");
const {
  getUltimaTransferencia,
  getCuentas,
  getTransferenciaporcuenta,
  getTSaldo,
  postTransferencia,
  getTransferencia
} = require("./database/connection");
const chalk = require("chalk"); //4.1.2

const app = express();
const port = 3002;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.use(express.json()); //PARA ACCEDER A req.body

//ESTATICOS
app.use(express.static("public"));

//VISTA PRINCIPAL
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/transferencias", async (req, res) => {
  try {
    const result = await getUltimaTransferencia();
    console.log(
      chalk.blue.bgGreen.bold("Última transferencia:" + JSON.stringify(result))
    );
    res.json(result); //DEVUELVE JSON
  } catch (error) {
    console.error("Error al obtener getData", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno al obtener datos" });
  }
});
app.get("/cuentas", async (req, res) => {
  try {
    const result = await getCuentas();
    //console.log(result);
    res.json(result); //DEVUELVE JSON
  } catch (error) {
    console.error("Error al obtener getData", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno al obtener datos" });
  }
});

app.get("/transferenciaporcuenta", async (req, res) => {
  try {
    const id = req.query.id;
    const result = await getTransferenciaporcuenta(id);
    //console.log(idEmisor);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener los datos", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno al obtener los datos" });
  }
});
app.get("/saldoporcuenta", async (req, res) => {
  try {
    const id = req.query.id;
    const result = await getTSaldo(id);
    //console.log(idEmisor);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener los datos", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno al obtener los datos" });
  }
});
app.post("/transferencia", async (req, res) => {

  try {
    const { emisor, receptor, monto, descripcion } = req.body;
    datosCompletos = {
      descripcion: descripcion,
      monto: monto,
      emisor: emisor,
      receptor: receptor,
    };
    //console.log(datosCompletos);
    const result = await postTransferencia(datosCompletos);
    res
      .status(200)
      .json({ success: true, message: "Datos ingresados correctamente" });
  } catch (error) {
    console.error("Error al agregar los datos", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno al agregar los datos" });
  }
});
app.get("/todaslascuentas", async (req, res) => {
  try {
    const result = await getTransferencia();
    res.json(result); //DEVUELVE JSON
  } catch (error) {
    console.error("Error al obtener datos", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno al obtener datos" });
  }
});

