import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Notas' },
  { to: '/pecas', label: 'Peças' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/vendedores', label: 'Vendedores' },
  { to: '/filiais', label: 'Filiais' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/marcas', label: 'Marcas' },
  { to: '/modelos', label: 'Modelos' },
]

export default function Navbar() {
  return (
    <nav>
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}