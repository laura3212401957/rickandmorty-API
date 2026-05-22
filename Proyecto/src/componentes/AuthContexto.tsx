import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "./firebaseConfig"

// Definimos qué datos va a tener el contexto
interface AuthContextType {
  usuario: User | null
  cargando: boolean
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  cargando: true
})

// Este componente envuelve toda la app y comparte el estado del usuario
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Firebase nos avisa automáticamente cuando el usuario se loguea o desloguea
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      setCargando(false)
    })

    // Limpiamos el listener cuando el componente se desmonta
    return () => unsuscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar el contexto fácilmente en cualquier componente
export function useAuth() {
  return useContext(AuthContext)
}