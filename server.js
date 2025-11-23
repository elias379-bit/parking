const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------
// CONEXIÓN MYSQL CORREGIDA (HORA DE MÉXICO)
// ---------------------------------------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "parking",
    timezone: "-06:00"   // <<< IMPORTANTE: evita la conversión a UTC
});

// ---------------------------------------------
// REGISTRAR DESOCUPACIÓN – Guarda hora enviada
// SIN convertir a UTC
// ---------------------------------------------
app.post("/api/desocupado", (req, res) => {
    const { id, fecha } = req.body;

    db.query(
        "INSERT INTO desocupaciones (espacio, fecha) VALUES (?, ?)",
        [id, fecha],   // <-- SE GUARDA TAL CUAL VIENE
        err => {
            if (err) return res.status(500).send("Error BD");
            res.send("OK");
        }
    );
});


// ---------------------------------------------
// OBTENER HISTÓRICOS – regresan fecha sin UTC
// ---------------------------------------------
app.get("/api/desocupaciones", (req, res) => {
    db.query(
        "SELECT * FROM desocupaciones ORDER BY fecha DESC",
        (err, rows) => {
            if (err) return res.status(500).send("Error BD");
            res.json(rows);
        }
    );
});

// ---------------------------------------------
// ESTADO ACTUAL DE ESPACIOS
// ---------------------------------------------
let estadoActual = [false, false, false, false];

app.post("/api/estado", (req, res) => {
    const { espacios } = req.body;
    if (espacios && espacios.length === 4) {
        estadoActual = espacios;
        res.send("OK");
    } else {
        res.status(400).send("Formato incorrecto");
    }
});

app.get("/api/estado", (req, res) => {
    res.json({ espacios: estadoActual });
});

// ---------------------------------------------
// INICIO DEL SERVIDOR
// ---------------------------------------------
app.listen(3000, () => console.log("API lista en puerto 3000"));
