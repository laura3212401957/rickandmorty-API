import { useState } from "react"
import "./style.css"

// Cada pregunta tiene su texto, las opciones y cuál es la correcta
interface Pregunta {
  pregunta: string
  opciones: string[]
  correcta: string
}

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Cómo se llama el planeta donde vive la familia Smith?",
    opciones: ["Marte", "Tierra", "Cronenberg", "Citadela"],
    correcta: "Tierra",
  },
  {
    pregunta: "¿Cuál es el apellido de Morty?",
    opciones: ["Sanchez", "Smith", "Harmon", "Roiland"],
    correcta: "Smith",
  },
  {
    pregunta: "¿Qué es el Meseeks?",
    opciones: ["Un robot", "Una criatura que existe para cumplir una tarea", "Un portal", "Un arma"],
    correcta: "Una criatura que existe para cumplir una tarea",
  },
  {
    pregunta: "¿Cómo se llama la hermana de Morty?",
    opciones: ["Beth", "Summer", "Jessica", "Diane"],
    correcta: "Summer",
  },
  {
    pregunta: "¿Qué lleva Rick siempre en la mano?",
    opciones: ["Un portal gun", "Una bebida", "Un libro", "Un control remoto"],
    correcta: "Una bebida",
  },
  {
    pregunta: "¿Cuántas temporadas tiene la serie hasta 2024?",
    opciones: ["4", "5", "6", "7"],
    correcta: "7",
  },
  {
    pregunta: "¿Quién creó la serie?",
    opciones: ["Seth MacFarlane", "Dan Harmon y Justin Roiland", "Matt Groening", "Trey Parker"],
    correcta: "Dan Harmon y Justin Roiland",
  },
]

function Original() {
  const [indice, setIndice] = useState(0)
  const [respuestas, setRespuestas] = useState<string[]>([])
  const [seleccionada, setSeleccionada] = useState<string | null>(null)
  const [terminada, setTerminada] = useState(false)

  const preguntaActual = preguntas[indice]

  function elegirOpcion(opcion: string) {
    // No dejamos cambiar la respuesta una vez que eligió
    if (seleccionada) return
    setSeleccionada(opcion)
  }

  function siguientePregunta() {
    const nuevasRespuestas = [...respuestas, seleccionada || ""]

    if (indice + 1 === preguntas.length) {
      setRespuestas(nuevasRespuestas)
      setTerminada(true)
    } else {
      setRespuestas(nuevasRespuestas)
      setIndice(indice + 1)
      setSeleccionada(null)
    }
  }

  // Contamos cuántas respondió bien
  const aciertos = respuestas.filter(
    (r, i) => r === preguntas[i].correcta
  ).length

  function reiniciar() {
    setIndice(0)
    setRespuestas([])
    setSeleccionada(null)
    setTerminada(false)
  }

  // Mensaje final según cuántas acertó
  function mensajeFinal() {
    if (aciertos === preguntas.length) return "Eres un verdadero fan de Rick and Morty 🧪"
    if (aciertos >= 5) return "Casi perfecto, sabes bastante de la serie"
    if (aciertos >= 3) return "Conoces lo básico, pero te falta ver más episodios"
    return "Definitivamente necesitas ver la serie desde el principio"
  }

  if (terminada) {
    return (
      <div className="trivia-container">
        <h1>Resultado</h1>
        <p className="resultado-numero">{aciertos} / {preguntas.length} correctas</p>
        <p className="resultado-mensaje">{mensajeFinal()}</p>
        <button onClick={reiniciar}>Intentar de nuevo</button>
      </div>
    )
  }

  return (
    <div className="trivia-container">
      <h1>Trivia Rick and Morty</h1>
      <p className="progreso">Pregunta {indice + 1} de {preguntas.length}</p>

      <div className="pregunta-card">
        <p className="pregunta-texto">{preguntaActual.pregunta}</p>

        <div className="opciones">
          {preguntaActual.opciones.map((opcion) => {
            // Después de elegir mostramos cuál era la correcta y cuál eligió
            let clase = "opcion"
            if (seleccionada) {
              if (opcion === preguntaActual.correcta) clase += " correcta"
              else if (opcion === seleccionada) clase += " incorrecta"
            }

            return (
              <button
                key={opcion}
                className={clase}
                onClick={() => elegirOpcion(opcion)}
              >
                {opcion}
              </button>
            )
          })}
        </div>

        {/* El botón de siguiente solo aparece después de elegir */}
        {seleccionada && (
          <button className="btn-siguiente" onClick={siguientePregunta}>
            {indice + 1 === preguntas.length ? "Ver resultado" : "Siguiente"}
          </button>
        )}
      </div>
    </div>
  )
}

export default Original