import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Modelos() {
  const [modelos, setModelos] = useState([])
  const [marcas, setMarcas] = useState([])
  const [form, setForm] = useState({ nomeModelo: '', marca: { id: '' } })
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const [m, mk] = await Promise.all([api.get('/modelos'), api.get('/marcas')])
    setModelos(m.data)
    setMarcas(mk.data)
  }

  async function salvar() {
    try {
      if (editando) {
        await api.put(`/modelos/${editando}`, form)
      } else {
        await api.post('/modelos', form)
      }
      setForm({ nomeModelo: '', marca: { id: '' } })
      setEditando(null)
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  function editar(m) {
    setForm({ nomeModelo: m.nomeModelo, marca: { id: m.marca.id } })
    setEditando(m.id)
  }

  async function deletar(id) {
    if (!confirm('Deletar modelo?')) return
    try {
      await api.delete(`/modelos/${id}`)
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao deletar')
    }
  }

  return (
    <div>
      <h1 className="page-title">Modelos</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Modelo' : 'Novo Modelo'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome do Modelo</label>
            <input value={form.nomeModelo} onChange={e => setForm({ ...form, nomeModelo: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Marca</label>
            <select value={form.marca.id} onChange={e => setForm({ ...form, marca: { id: e.target.value } })}>
              <option value="">Selecione</option>
              {marcas.map(m => <option key={m.id} value={m.id}>{m.nomeMarca}</option>)}
            </select>
          </div>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={salvar}>
            {editando ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          {editando && (
            <button className="btn btn-danger" onClick={() => { setEditando(null); setForm({ nomeModelo: '', marca: { id: '' } }) }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Marca</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {modelos.length === 0 ? (
              <tr><td colSpan={4} className="vazio">Nenhum modelo cadastrado</td></tr>
            ) : modelos.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nomeModelo}</td>
                <td>{m.marca?.nomeMarca}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-warning btn-sm" onClick={() => editar(m)}>Editar</button>
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