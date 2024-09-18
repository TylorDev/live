import http from "http";
import fetch from "node-fetch";
import cors from "cors";
import express from "express";
import path from "path";
import url from "url";

const app = express();
const port = 8000;
const m3u8BaseUrl =
  "https://video.gumlet.io/5f462c1561cf8a766464ffc4/635789f017629894d4d125a4/main.m3u8";

// Habilita CORS para todas las solicitudes
app.use(cors());

// Ruta para la lista M3U8 principal
app.get("/proxy.m3u8", async (req, res) => {
  try {
    const response = await fetch(m3u8BaseUrl);
    const data = await response.text();

    res.writeHead(200, { "Content-Type": "application/vnd.apple.mpegurl" });
    res.write(data);
    res.end();
  } catch (error) {
    res.status(500).send("Error al obtener el flujo M3U8");
  }
});

// Ruta para los segmentos de vídeo (archivos .ts o .m3u8)
app.get("/*.ts", async (req, res) => {
  try {
    // Obtener la URL completa del segmento desde la petición
    const segmentUrl = url.resolve(m3u8BaseUrl, req.path);
    const response = await fetch(segmentUrl);

    if (!response.ok) throw new Error("Segmento no encontrado");

    const data = await response.buffer();
    res.writeHead(200, { "Content-Type": "video/mp2t" });
    res.write(data);
    res.end();
  } catch (error) {
    res.status(500).send("Error al obtener el segmento de vídeo");
  }
});

// Ruta para los archivos M3U8 secundarios (si existen)
app.get("/*.m3u8", async (req, res) => {
  try {
    const segmentUrl = url.resolve(m3u8BaseUrl, req.path);
    const response = await fetch(segmentUrl);

    if (!response.ok) throw new Error("Segmento M3U8 no encontrado");

    const data = await response.text();
    res.writeHead(200, { "Content-Type": "application/vnd.apple.mpegurl" });
    res.write(data);
    res.end();
  } catch (error) {
    res.status(500).send("Error al obtener el archivo M3U8");
  }
});

app.listen(port, () => {
  console.log(`Proxy M3U8 corriendo en el puerto ${port}`);
});
