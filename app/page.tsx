"use client";

import { useState } from "react";

// Definimos la forma que va a tener cada tarea
type Tarea = {
  id: number;
  texto: string;
  completada: boolean;
};

export default function Home() {
  // Lista de tareas activas
  const [tareas, setTareas] = useState<Tarea[]>([]);

  // Lista de tareas eliminadas (la papelera)
  const [papelera, setPapelera] = useState<Tarea[]>([]);

  // Qué vista se está mostrando: la lista normal o la papelera
  const [vista, setVista] = useState<"tareas" | "papelera">("tareas");

  // Texto que el usuario está escribiendo en el input de crear
  const [nuevaTarea, setNuevaTarea] = useState("");

  // Guarda el id de la tarea que se está editando actualmente (null si ninguna)
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Texto temporal mientras se edita una tarea
  const [textoEditado, setTextoEditado] = useState("");

  // CREATE: se ejecuta cuando el usuario presiona Enter en el input principal
  function crearTarea(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && nuevaTarea.trim() !== "") {
      const tarea: Tarea = {
        id: Date.now(),
        texto: nuevaTarea,
        completada: false,
      };
      setTareas([...tareas, tarea]);
      setNuevaTarea("");
    }
  }

  // UPDATE (completar): marca o desmarca una tarea como hecha
  function toggleCompletada(id: number) {
    setTareas(
      tareas.map((t) =>
        t.id === id ? { ...t, completada: !t.completada } : t
      )
    );
  }

  // DELETE (ahora "mueve a papelera" en vez de borrar para siempre)
  function eliminarTarea(id: number) {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;

    setPapelera([...papelera, tarea]); // la agregamos a la papelera
    setTareas(tareas.filter((t) => t.id !== id)); // la quitamos de la lista activa
  }

  // RESTAURAR: saca una tarea de la papelera y la regresa a la lista activa
  function restaurarTarea(id: number) {
    const tarea = papelera.find((t) => t.id === id);
    if (!tarea) return;

    setTareas([...tareas, tarea]);
    setPapelera(papelera.filter((t) => t.id !== id));
  }

  // ELIMINAR DEFINITIVO: borra una tarea de la papelera para siempre
  function eliminarDefinitivo(id: number) {
    setPapelera(papelera.filter((t) => t.id !== id));
  }

  // Empieza el modo edición al hacer clic sobre el texto
  function empezarEdicion(tarea: Tarea) {
    setEditandoId(tarea.id);
    setTextoEditado(tarea.texto);
  }

  // Guarda los cambios cuando el usuario sale del campo de edición
  function guardarEdicion(id: number) {
    setTareas(
      tareas.map((t) =>
        t.id === id ? { ...t, texto: textoEditado } : t
      )
    );
    setEditandoId(null);
  }

  return (
    <main style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "sans-serif" }}>
      {/* Encabezado con título y botón de papelera, como el álbum de Fotos */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>{vista === "tareas" ? "Mi Lista de Tareas" : "Papelera"}</h1>

        {vista === "tareas" ? (
          <button onClick={() => setVista("papelera")}>
            🗑️ Papelera ({papelera.length})
          </button>
        ) : (
          <button onClick={() => setVista("tareas")}>← Volver</button>
        )}
      </div>

      {/* VISTA: LISTA DE TAREAS ACTIVAS */}
      {vista === "tareas" && (
        <>
          <input
            type="text"
            placeholder="Escribe una tarea y presiona Enter..."
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            onKeyDown={crearTarea}
            style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
          />

          <ul style={{ listStyle: "none", padding: 0 }}>
            {tareas.map((tarea) => (
              <li
                key={tarea.id}
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}
              >
                <input
                  type="checkbox"
                  checked={tarea.completada}
                  onChange={() => toggleCompletada(tarea.id)}
                />

                {editandoId === tarea.id ? (
                  <input
                    type="text"
                    value={textoEditado}
                    onChange={(e) => setTextoEditado(e.target.value)}
                    onBlur={() => guardarEdicion(tarea.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") guardarEdicion(tarea.id);
                    }}
                    autoFocus
                    style={{ flex: 1, padding: "4px" }}
                  />
                ) : (
                  <span
                    onClick={() => empezarEdicion(tarea)}
                    style={{
                      flex: 1,
                      textDecoration: tarea.completada ? "line-through" : "none",
                      cursor: "pointer",
                    }}
                  >
                    {tarea.texto}
                  </span>
                )}

                <button onClick={() => eliminarTarea(tarea.id)}>🗑️</button>
              </li>
            ))}
          </ul>

          {tareas.length === 0 && (
            <p style={{ color: "#888" }}>No tienes tareas activas.</p>
          )}
        </>
      )}

      {/* VISTA: PAPELERA */}
      {vista === "papelera" && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {papelera.map((tarea) => (
            <li
              key={tarea.id}
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}
            >
              <span style={{ flex: 1, color: "#888", textDecoration: "line-through" }}>
                {tarea.texto}
              </span>
              <button onClick={() => restaurarTarea(tarea.id)}>↩️ Restaurar</button>
              <button onClick={() => eliminarDefinitivo(tarea.id)}>❌ Eliminar</button>
            </li>
          ))}

          {papelera.length === 0 && (
            <p style={{ color: "#888" }}>La papelera está vacía.</p>
          )}
        </ul>
      )}
    </main>
  );
}