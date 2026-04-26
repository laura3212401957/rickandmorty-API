import { useEffect, useState } from "react"
import "./style.css"

interface Episodio {
  id: number
  name: string
  episode: string   
  characters: string[] 
}

function Usuario() {
  const [episodios, setEpisodios] = useState<Episodio[]>([])
  const [temporada, setTemporada] = useState("S01")
  const [expandido, setExpandido] = useState<number | null>(null)

  const temporadas = ["S01", "S02", "S03", "S04", "S05"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://rickandmortyapi.com/api/episode")
        const data = await res.json()
        const totalPaginas = data.info.pages

        const peticiones = []
        for (let i = 1; i <= totalPaginas; i++) {
          peticiones.push(
            fetch(`https://rickandmortyapi.com/api/episode?page=${i}`).then(r => r.json())
          )
        }

        const resultados = await Promise.all(peticiones)
        const todos = resultados.flatMap(r => r.results)
        setEpisodios(todos)
      } catch (error) {
        console.error("Error cargando episodios:", error)
      }
    }

    fetchData()
  }, [])

  const episodiosFiltrados = episodios.filter((ep) =>
    ep.episode.startsWith(temporada)
  )

  function toggleEpisodio(id: number) {
    setExpandido(expandido === id ? null : id)
  }

  return (
    <div>
      <h1>Episodios</h1>

      <div className="filtros">
        {temporadas.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTemporada(t)
              setExpandido(null)
            }}
            className={temporada === t ? "activo" : ""}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="tabla-container">
        <table className="tabla-posiciones">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {episodiosFiltrados.map((ep) => (
              <>
                <tr key={ep.id} onClick={() => toggleEpisodio(ep.id)} style={{ cursor: "pointer" }}>
                  <td>{ep.episode}</td>
                  <td>{ep.name}</td>
                  <td>{expandido === ep.id ? "▲" : "▼"}</td>
                </tr>

                {expandido === ep.id && (
                  <tr key={`detalle-${ep.id}`} className="fila-expandida">
                    <td colSpan={3}>
                      Personajes en este episodio: <strong>{ep.characters.length}</strong>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Usuario