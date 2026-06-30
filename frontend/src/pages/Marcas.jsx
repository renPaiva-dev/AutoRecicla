import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Marcas() {
  const [marcas, setMarcas] = useState([])
  const [form, setForm] = useState({ nomeMarca: '' })
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const res = await api.get('/marcas')
    setMarcas(res.data)
  }

  async function salvar() {
    try {
      if (editando) {
        await api.put(`/marcas/${editando}`, form)
      } else {
        await api.post('/marcas', form)
      }
      setForm({ nomeMarca: '' })
      setEditando(null)
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  async function deletar(id) {
    if (!confirm('Deletar marca?')) return
    try {
      await api.delete(`/marcas/${id}`)
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao deletar')
    }
  }

  return (
    <div>
      <h1 className="page-title">Marcas</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Marca' : 'Nova Marca'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome da Marca</label>
            <input value={form.nomeMarca} onChange={e => setForm({ nomeMarca: e.target.value })} />
          </div>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={salvar}>
            {editando ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          {editando && (
            <button className="btn btn-danger" onClick={() => { setEditando(null); setForm({ nomeMarca: '' }) }}>
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
            {marcas.length === 0 ? (
              <tr><td colSpan={3} className="vazio">Nenhuma marca cadastrada</td></tr>
            ) : marcas.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nomeMarca}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-warning btn-sm" onClick={() => { setForm({ nomeMarca: m.nomeMarca }); setEditando(m.id) }}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deletar(m.id)}>Deletar</button>
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