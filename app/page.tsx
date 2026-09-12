"use client";

import { useState } from "react";

// Definimos la forma que va a tener cada tarea
type Tarea = {
  id: number;
  texto: string;
  completada: boolean;
};

export default function Home() {
  // Lista de tareas (empieza vacía)
  const [tareas, setTareas] = useState<Tarea[]>([]);

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
        id: Date.now(), // usamos la hora actual como id único
        texto: nuevaTarea,
        completada: false,
      };
      setTareas([...tareas, tarea]);
      setNuevaTarea(""); // limpiamos el input después de crear
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

  // DELETE: elimina una tarea de la lista
  function eliminarTarea(id: number) {
    setTareas(tareas.filter((t) => t.id !== id));
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
    setEditandoId(null); // salimos del modo edición
  }

  return (
    <main style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>Mi Lista de Tareas</h1>

      {/* Input para crear una nueva tarea (solo con Enter, sin botón) */}
      <input
        type="text"
        placeholder="Escribe una tarea y presiona Enter..."
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
        onKeyDown={crearTarea}
        style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
      />

      {/* Lista de tareas */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tareas.map((tarea) => (
          <li
            key={tarea.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            {/* Checkbox para completar */}
            <input
              type="checkbox"
              checked={tarea.completada}
              onChange={() => toggleCompletada(tarea.id)}
            />

            {/* Si esta tarea está en modo edición, mostramos un input */}
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
              // Si no está en edición, mostramos el texto normal
              // Al hacer clic, entramos en modo edición
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

            {/* Botón para eliminar */}
            <button onClick={() => eliminarTarea(tarea.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </main>
  );
}