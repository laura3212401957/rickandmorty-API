import { useEffect, useState } from "react";

interface Personaje {
  id: number;
  name: string;
  species: string;
  status: string;
}

function Favorito() {
  const [favoritos] = useState<number[]>(() => {
    return JSON.parse(localStorage.getItem("favoritos") || "[]");
  });
  const [personajes, setPersonajes] = useState<Personaje[]>([]);

  useEffect(() => {
    if (favoritos.length === 0) return;
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/${favoritos.join(",")}`
        );
        const data = await res.json();
        const resultado = Array.isArray(data) ? data : [data];
        setPersonajes(resultado);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      }
    };
    fetchData();
  }, [favoritos]);

  return (
    <div>
      <h1>Favoritos</h1>
      {favoritos.length === 0 ? (
        <p>No tienes personajes favoritos</p>
      ) : (
        <ul>
          {personajes.map((personaje) => (
            <li key={personaje.id}>
              {personaje.name} — {personaje.species} — {personaje.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorito;