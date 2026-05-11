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
    image: string
    gender: string
    type: string
    location: {
        name: string
    }
    episode: string[]
}

type FiltroTipo = 'Personajes' | 'Vivos' | 'Muertos' | 'Humanos' | 'Aliens'

function Home() {
    const [todosLosPersonajes, setTodosLosPersonajes] = useState<Personaje[]>([])
    const [filtro, setFiltro] = useState<FiltroTipo>('Personajes')
    const [busqueda, setBusqueda] = useState('')
    const [seleccionado, setSeleccionado] = useState<Personaje | null>(null) 

    const [favoritos, setFavoritos] = useState<number[]>(() => {
        return JSON.parse(localStorage.getItem("favoritos") || "[]");
    });

    const filtros: FiltroTipo[] = ['Personajes', 'Vivos', 'Muertos', 'Humanos', 'Aliens']

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
    };

    function cambiarFiltro(nuevoFiltro: FiltroTipo) {
        setFiltro(nuevoFiltro)
        setBusqueda('')
    }

    const personajesPorFiltro = todosLosPersonajes.filter((p) => {
        if (filtro === 'Personajes') return true
        if (filtro === 'Vivos') return p.status === 'Alive'
        if (filtro === 'Muertos') return p.status === 'Dead'
        if (filtro === 'Humanos') return p.species === 'Human'
        if (filtro === 'Aliens') return p.species === 'Alien'
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
                            <th>Nombres</th>
                            <th>Especie</th>
                            <th>Estado</th>
                            <th>Origen</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {personajesFiltrados.map((personaje, index) => (
                            <tr
                                key={personaje.id}
                                onClick={() => setSeleccionado(personaje)} 
                                style={{ cursor: 'pointer' }}    
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
                                    <button onClick={(e) => {
                                        e.stopPropagation() 
                                        toggleFavorito(personaje.id)
                                    }}>
                                        {favoritos.includes(personaje.id) ? "❤️" : "🤍"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

          
            {seleccionado && (
                <div
                    className="modal-overlay"
                    onClick={() => setSeleccionado(null)} 
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <button className="modal-cerrar" onClick={() => setSeleccionado(null)}>✕</button>
                        <img src={seleccionado.image} alt={seleccionado.name} />
                        <h2>{seleccionado.name}</h2>
                        <p><strong>Estado:</strong> {seleccionado.status}</p>
                        <p><strong>Especie:</strong> {seleccionado.species}</p>
                        <p><strong>Género:</strong> {seleccionado.gender}</p>
                        <p><strong>Origen:</strong> {seleccionado.origin.name}</p>
                        <p><strong>Ubicación:</strong> {seleccionado.location.name}</p>
                        <p><strong>Episodios:</strong> {seleccionado.episode.length}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Home