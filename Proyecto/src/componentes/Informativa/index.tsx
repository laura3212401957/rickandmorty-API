import { useEffect, useState } from "react"
import "./style.css"

interface ConteoRecurso {
 info: {
    count: number
 }
}

function Informativa() {
  const [totalPersonajes, setTotalPersonajes] = useState(0)
  const [totalEpisodios, setTotalEpisodios] = useState(0)
  const [totalLocaciones, setTotalLocaciones] = useState(0)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
   
        const [resPersonajes, resEpisodios, resLocaciones] = await Promise.all([
          fetch("https://rickandmortyapi.com/api/character"),
          fetch("https://rickandmortyapi.com/api/episode"),
          fetch("https://rickandmortyapi.com/api/location"),
        ])

        const personajes: ConteoRecurso = await resPersonajes.json()
        const episodios: ConteoRecurso = await resEpisodios.json()
        const locaciones: ConteoRecurso = await resLocaciones.json()

        setTotalPersonajes(personajes.info.count)
        setTotalEpisodios(episodios.info.count)
        setTotalLocaciones(locaciones.info.count)
      } catch (error) {
        console.error("Error cargando los datos:", error)
      } finally {
        setCargando(false)
      }
    }

    fetchData()
  }, [])

  if (cargando) return <p>Cargando información...</p>

  return (
    <div className="informativa-container">
      <h1>Sobre Rick and Morty</h1>

      <p>
        Rick and Morty es una serie animada de ciencia ficción creada por Dan Harmon
        y Justin Roiland. Sigue las aventuras de Rick, un científico brillante pero
        caótico, y su nieto Morty a través de diferentes universos y dimensiones.
      </p>

      <img src="./src/assets/rickandmorty.png"></img>
      <h2>Datos de la serie</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-numero">{totalPersonajes}</span>
          <span className="stat-label">Personajes</span>
        </div>
        <div className="stat-card">
          <span className="stat-numero">{totalEpisodios}</span>
          <span className="stat-label">Episodios</span>
        </div>
        <div className="stat-card">
          <span className="stat-numero">{totalLocaciones}</span>
          <span className="stat-label">Locaciones</span>
        </div>
      </div>

      <h2>Sobre la API</h2>
      <p>
        Los datos de esta aplicación vienen de la Rick and Morty API, una API
        pública y gratuita que tiene información detallada de todos los personajes,
        episodios y locaciones de la serie.
      </p>
      <a href="https://rickandmortyapi.com" target="_blank" rel="noreferrer">
        Ver documentación oficial
      </a>
    </div>
  )
}

export default Informativa