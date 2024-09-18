import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import fs from "fs";

import { fileURLToPath } from "url";

// Obtener el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo JSON
const configFilePath = path.resolve(__dirname, "config.json");

// Leer y parsear el contenido del archivo JSON
const config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/live/",
  server: {
    host: true, // Permite que el servidor sea accesible desde la red local
    port: 5173,
    proxy: {
      "/uno": {
        ///
        target: config.apiTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/uno/, ""),
      },
      "/rede": {
        target: "https://live-b.cf.dmcdn.ne4t",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/rede/, ""),
      },
    },
  },
});
