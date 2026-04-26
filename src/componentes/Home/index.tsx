import { useState, useEffect } from "react";
import "./style.css"

interface Personaje {
    id: number
    name: string
    status: string
    species: string
    origin: {
        name: string
    }
}

type FiltroTipo = 'personajes' | 'vivos' | 'muertos' | 'humanos' | 'aliens'

function Home() {
    const [todosLosPersonajes, setTodosLosPersonajes] = useState<Personaje[]>([])
    const [filtro, setFiltro] = useState<FiltroTipo>('personajes')
    const [busqueda, setBusqueda] = useState('')

    const [favoritos, setFavoritos] = useState<number[]>(() => {
        return JSON.parse(localStorage.getItem("favoritos") || "[]");
    });

    const filtros: FiltroTipo[] = ['personajes', 'vivos', 'muertos', 'humanos', 'aliens']

    useEffect(() => {
        const fetchData = async () => {
      try {
       
        const res = await fetch('https://rickandmortyapi.com/api/character')
        const data = await res.json()
        const totalPaginas = data.info.pages

       
        const peticiones = []
        for (let i = 1; i <= totalPaginas; i++) {
          peticiones.push(fetch(`https://rickandmortyapi.com/api/character?page=${i}`).then(r => r.json()))
        }

        const resultados = await Promise.all(peticiones)

     
        const todos = resultados.flatMap(r => r.results)
        setTodosLosPersonajes(todos)

      } catch (error) {
        console.error('Error cargando los personajes:', error)
      }
    }
    fetchData()
    }, [])

    const toggleFavorito = (id: number) => {
    const nuevos = favoritos.includes(id)
        ? favoritos.filter((f) => f !== id)
        : [...favoritos, id];
    setFavoritos(nuevos);
    localStorage.setItem("favoritos", JSON.stringify(nuevos));
    console.log("favoritos guardados:", nuevos); // ← agrega esto
};

    function cambiarFiltro(nuevoFiltro: FiltroTipo) {
        setFiltro(nuevoFiltro)
        setBusqueda('')
    }

    const personajesPorFiltro = todosLosPersonajes.filter((p) => {    if (filtro === 'personajes') return true
    if (filtro === 'vivos') return p.status === 'Alive'
    if (filtro === 'muertos') return p.status === 'Dead'
    if (filtro === 'humanos') return p.species === 'Human'
    if (filtro === 'aliens') return p.species === 'Alien'
    return true
  })

  const personajesFiltrados = busqueda.length < 3
    ? personajesPorFiltro
    : personajesPorFiltro.filter((p) =>
        p.name.toLowerCase().includes(busqueda.toLowerCase())
      )

  return (
    <>

      <div className="filtros">
        {filtros.map((unFiltro) => (
          <button
            key={unFiltro}
            onClick={() => cambiarFiltro(unFiltro)}
            className={filtro === unFiltro ? 'activo' : ''}
          >
            {unFiltro}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="tabla-container">
        <table className="tabla-posiciones">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Estado</th>
              <th>Origen</th>
            </tr>
          </thead>
          <tbody>
            {personajesFiltrados.map((personaje, index) => (
              <tr
                key={personaje.id}
                className={
                  busqueda.length >= 3 &&
                  personaje.name.toLowerCase().includes(busqueda.toLowerCase())
                    ? 'resaltado'
                    : ''
                }
              >
                <td>{index + 1}</td>
                <td>{personaje.name}</td>
                <td>{personaje.species}</td>
                <td>{personaje.status}</td>
                <td>{personaje.origin.name}</td>
                <td>
                  <button onClick={() => toggleFavorito(personaje.id)}>
                    {favoritos.includes(personaje.id) ? "❤️" : "🤍"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Home