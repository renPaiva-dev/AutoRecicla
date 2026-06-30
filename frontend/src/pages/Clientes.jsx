import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [form, setForm] = useState({ nome: '', cpfCnpj: '', telefone: '', email: '' })
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const res = await api.get('/clientes')
    setClientes(res.data)
  }

  async function salvar() {
    try {
      if (editando) {
        await api.put(`/clientes/${editando}`, form)
      } else {
        await api.post('/clientes', form)
      }
      setForm({ nome: '', cpfCnpj: '', telefone: '', email: '' })
      setEditando(null)
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  function editar(c) {
    setForm({ nome: c.nome, cpfCnpj: c.cpfCnpj, telefone: c.telefone, email: c.email })
    setEditando(c.id)
  }

  async function deletar(id) {
    if (!confirm('Deletar cliente?')) return
    try {
      await api.delete(`/clientes/${id}`)
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao deletar')
    }
  }

  return (
    <div>
      <h1 className="page-title">Clientes</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome</label>
            <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="form-group">
            <label>CPF / CNPJ</label>
            <input value={form.cpfCnpj} onChange={e => setForm({ ...form, cpfCnpj: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={salvar}>
            {editando ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          {editando && (
            <button className="btn btn-danger" onClick={() => { setEditando(null); setForm({ nome: '', cpfCnpj: '', telefone: '', email: '' }) }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nome</th><th>CPF/CNPJ</th><th>Telefone</th><th>Email</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr><td colSpan={6} className="vazio">Nenhum cliente cadastrado</td></tr>
            ) : clientes.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.cpfCnpj}</td>
                <td>{c.telefone}</td>
                <td>{c.email}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-warning btn-sm" onClick={() => editar(c)}>Editar</button>
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