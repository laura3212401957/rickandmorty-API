import { useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth"
import { auth } from "../firebaseConfig"
import { useAuth } from "../AuthContexto"
import "./style.css"

function Usuario() {
  const { usuario } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [esRegistro, setEsRegistro] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setError('')
    try {
      if (esRegistro) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('Ese correo ya está registrado')
      else if (err.code === 'auth/wrong-password') setError('Contraseña incorrecta')
      else if (err.code === 'auth/user-not-found') setError('No existe una cuenta con ese correo')
      else if (err.code === 'auth/weak-password') setError('La contraseña debe tener mínimo 6 caracteres')
      else setError('Ocurrió un error, intenta de nuevo')
    }
  }

  async function handleLogout() {
    await signOut(auth)
  }


  // Si hay usuario logueado mostramos su perfil
  if (usuario) {
    return (
      <div className="usuario-container">
        <div className="perfil-card">
          <div className="icono-estado">🟢</div>
          <h2>Bienvenid@</h2>
          <p className="usuario-email">{usuario.email}</p>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    )
  }

  // Si no hay usuario mostramos el formulario sin icono
  return (
    <div className="usuario-container">
      <div className="form-card">
        <h2>{esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-mensaje">{error}</p>}

        <button className="btn-principal" onClick={handleSubmit}>
          {esRegistro ? 'Registrarse' : 'Entrar'}
        </button>

        <p className="cambiar-modo">
          {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <span onClick={() => { setEsRegistro(!esRegistro); setError('') }}>
            {esRegistro ? ' Inicia sesión' : ' Regístrate'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Usuario