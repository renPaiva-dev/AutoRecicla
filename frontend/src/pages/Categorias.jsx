import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({ nomeCategoria: '' })
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const res = await api.get('/categorias')
    setCategorias(res.data)
  }

  async function salvar() {
    try {
      if (editando) {
        await api.put(`/categorias/${editando}`, form)
      } else {
        await api.post('/categorias', form)
      }
      setForm({ nomeCategoria: '' })
      setEditando(null)
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  async function deletar(id) {
    if (!confirm('Deletar categoria?')) return
    try {
      await api.delete(`/categorias/${id}`)
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao deletar')
    }
  }

  return (
    <div>
      <h1 className="page-title">Categorias</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Categoria' : 'Nova Categoria'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome da Categoria</label>
            <input value={form.nomeCategoria} onChange={e => setForm({ nomeCategoria: e.target.value })} />
          </div>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={salvar}>
            {editando ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          {editando && (
            <button className="btn btn-danger" onClick={() => { setEditando(null); setForm({ nomeCategoria: '' }) }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr><td colSpan={3} className="vazio">Nenhuma categoria cadastrada</td></tr>
            ) : categorias.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nomeCategoria}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-warning btn-sm" onClick={() => { setForm({ nomeCategoria: c.nomeCategoria }); setEditando(c.id) }}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deletar(c.id)}>Deletar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}