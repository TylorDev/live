import { useEffect, useState } from "react";

const ConsoleSimulator = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Sobrescribe console.error para capturar errores
    const originalConsoleError = console.error;
    console.error = function (message, ...args) {
      setLogs((prevLogs) => [...prevLogs, `Error: ${message}`]);
      originalConsoleError.apply(console, [message, ...args]);
    };

    // Sobrescribe console.warn para capturar advertencias
    const originalConsoleWarn = console.warn;
    console.warn = function (message, ...args) {
      setLogs((prevLogs) => [...prevLogs, `Advertencia: ${message}`]);
      originalConsoleWarn.apply(console, [message, ...args]);
    };

    // Captura errores globales no capturados
    window.onerror = function (message, source, lineno, colno, error) {
      setLogs((prevLogs) => [
        ...prevLogs,
        `Error global: ${message} en ${source}, línea ${lineno}`,
      ]);
    };

    // Limpieza al desmontar el componente
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Función para lanzar un error con el botón
  const throwError = () => {
    console.error("Error lanzado manualmente desde el botón");
    // O puedes usar: throw new Error("Error manual");
  };

  return (
    <div className="console">
      <h1>Simulador de Consola</h1>
      <button onClick={throwError}>Lanzar Error</button>
      <div style={styles.console}>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  console: {
    backgroundColor: "#222",
    color: "#0f0",
    padding: "10px",
    width: "100%",
    height: "200px",
    overflowY: "auto",
    fontFamily: "monospace",
    border: "1px solid #444",
  },
};

export default ConsoleSimulator;
