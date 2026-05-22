import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './componentes/Home'
import Favorito from './componentes/Favorito'
import Original from './componentes/Original'
import Informativa from './componentes/Informativa'
import Usuarios from './componentes/Usuario'
import './App.css'

function App() {

  return (
    <>
     <Router>
      <nav className='c-menu'>
        <Link to="/">Home</Link>
        <Link to="/favorito">Favorito</Link>
        <Link to="/original">Original</Link>
        <Link to="/informativa">Informativa</Link>
        <Link to="/usuarios">Usuarios</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/favorito' element={<Favorito/>} />
        <Route path='/original' element={<Original/>} />
        <Route path='/informativa' element={<Informativa/>} />
        <Route path='/usuarios' element={<Usuarios/>} />
      </Routes>

     </Router>
    </>
  )
}

export default App
