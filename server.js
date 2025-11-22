const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "parking"
});

// Ruta para registrar desocupación
app.post("/api/desocupado", (req, res) => {
    const { id, fecha } = req.body;
    console.log(fecha)
    db.query(
        "INSERT INTO desocupaciones (espacio, fecha) VALUES (?, ?)",
        [id, fecha],
        err => {
            if (err) return res.status(500).send("Error BD");
            res.send("OK");
        }
    );
});

// Ruta para obtener registros históricos
app.get("/api/desocupaciones", (req, res) => {
    db.query(
        "SELECT * FROM desocupaciones ORDER BY fecha DESC",
        (err, rows) => {
            if (err) return res.status(500).send("Error BD");
            res.json(rows);
        }
    );
});

let estadoActual = [false, false, false, false]; // 4 espacios

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


app.listen(3000, () => console.log("API lista en puerto 3000"));
