import express from "express";
import { pool } from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.use(express.json());

app.get("/", async (req,res) => {
    try {
        res.sendFile("/index.html")
    } catch (error) {
        res
      .status(500)
      .json({ error: "Error" });
    }
})

// Agregar canción
app.post("/cancion", async (req, res) => {
  const { titulo, artista, tono } = req.body;

  try {
    const query =
      "INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3) RETURNING *";
    const values = [titulo, artista, tono];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al insertar la canción en la base de datos" });
  }
});

// Obtener canciones
app.get("/canciones", async (req, res) => {
  try {
    const query = "SELECT * FROM canciones";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener las canciones de la base de datos" });
  }
});

//Editar canción
app.put("/cancion/:id", async (req, res) => {
    const {id} = req.params
  const { titulo, artista, tono } = req.body;

  try {
    const query =
      "UPDATE canciones SET titulo = $2, artista = $3, tono = $4 WHERE id = $1 RETURNING *";
    const values = [id, titulo, artista, tono];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al editar la canción en la base de datos" });
  }
});

//Eliminar canción
app.delete("/cancion", async (req, res) => {
  const { id } = req.query;

  try {
    const query = "DELETE FROM canciones WHERE id = $1";
    const values = [id];
    await pool.query(query, values);
    res.json({ message: "Canción eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar la canción de la base de datos" });
  }
});

app.listen(PORT, () => {
    console.log(`Servidor conectado al puerto ${PORT}`);
  });
  