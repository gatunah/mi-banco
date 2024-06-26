const { Pool } = require("pg");

// CONFIG BD
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "banco",
  password: "admin",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const getUltimaTransferencia = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM transferencias ORDER BY fecha DESC LIMIT 1"
    );
    return result.rows;
  } catch (error) {
    console.error("Error al obtener datos de tranferencias", error);
  }
};

const getCuentas = async () => {
  try {
    const result = await pool.query("SELECT * FROM cuentas ORDER BY id ASC;");
    return result.rows;
  } catch (error) {
    console.error("Error al obtener cuentas", error);
  }
};
const getTransferenciaporcuenta = async (id) => {
  try {
    const result = await pool.query({
      text: "SELECT * FROM transferencias WHERE cuenta_origen = $1 OR cuenta_destino = $1 ORDER BY fecha DESC LIMIT 10;",
      values: [id],
    });
    return result.rows;
  } catch (error) {
    console.error("Error al obtener cuentas", error);
  }
};
const getTSaldo = async (id) => {
  try {
    const result = await pool.query({
      text: "SELECT * FROM cuentas WHERE id = $1;",
      values: [id],
    });
    return result.rows;
  } catch (error) {
    console.error("Error al obtener saldo", error);
  }
};
const postTransferencia = async (datos) => {
  try {
    const { descripcion, monto, emisor, receptor } = datos;

    await pool.query("BEGIN");
    
    await pool.query({
      text: "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2;",
      values: [monto, emisor],
    });

    await pool.query({
      text: "UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2;",
      values: [monto, receptor],
    });

    await pool.query({
      text: "INSERT INTO transferencias (descripcion, fecha, monto, cuenta_origen, cuenta_destino) VALUES ($1, NOW(), $2, $3, $4);",
      values: [descripcion, monto, emisor, receptor],
    });

    await pool.query("COMMIT");
    return { success: true };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al ingresar datos", error);
    return { success: false, error: "Error al ingresar datos" };
  }
};
const getTransferencia = async () => {
  try {
    const result = await pool.query({
      text: "SELECT * FROM cuentas;"
    });
    return result.rows;
  } catch (error) {
    console.error("Error al obtener datos", error);
    return { success: false, error: "Error al obtener datos" };
  }
};


module.exports = {
  getUltimaTransferencia,
  getCuentas,
  getTransferenciaporcuenta,
  getTSaldo,
  postTransferencia,
  getTransferencia
};
