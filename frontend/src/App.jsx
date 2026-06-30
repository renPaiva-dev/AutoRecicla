import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Filiais from './pages/Filiais'
import Vendedores from './pages/Vendedores'
import Clientes from './pages/Clientes'
import Marcas from './pages/Marcas'
import Modelos from './pages/Modelos'
import Categorias from './pages/Categorias'
import Pecas from './pages/Pecas'
import Notas from './pages/Notas'
import NotaDetalhe from './pages/NotaDetalhe'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Notas />} />
          <Route path="/notas/:id" element={<NotaDetalhe />} />
          <Route path="/filiais" element={<Filiais />} />
          <Route path="/vendedores" element={<Vendedores />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/modelos" element={<Modelos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/pecas" element={<Pecas />} />
        </Routes>
      </div>
    </div>
  )
}