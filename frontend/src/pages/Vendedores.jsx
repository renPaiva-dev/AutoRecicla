import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Vendedores() {
  const [vendedores, setVendedores] = useState([])
  const [filiais, setFiliais] = useState([])
  const [form, setForm] = useState({ nome: '', cpf: '', cargo: '', ativo: true, filial: { id: '' } })
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const [v, f] = await Promise.all([api.get('/vendedores'), api.get('/filiais')])
    setVendedores(v.data)
    setFiliais(f.data)
  }

  async function salvar() {
    try {
      if (editando) {
        await api.put(`/vendedores/${editando}`, form)
      } else {
        await api.post('/vendedores', form)
      }
      setForm({ nome: '', cpf: '', cargo: '', ativo: true, filial: { id: '' } })
      setEditando(null)
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  function editar(v) {
    setForm({ nome: v.nome, cpf: v.cpf, cargo: v.cargo, ativo: v.ativo, filial: { id: v.filial.id } })
    setEditando(v.id)
  }

  async function deletar(id) {
    if (!confirm('Deletar vendedor?')) return
    try {
      await api.delete(`/vendedores/${id}`)
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao deletar')
    }
  }

  return (
    <div>
      <h1 className="page-title">Vendedores</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Vendedor' : 'Novo Vendedor'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome</label>
            <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Cargo</label>
            <input value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Filial</label>
            <select value={form.filial.id} onChange={e => setForm({ ...form, filial: { id: e.target.value } })}>
              <option value="">Selecione</option>
              {filiais.map(f => <option key={f.id} value={f.id}>{f.nomeUnidade}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.value === 'true' })}>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={salvar}>
            {editando ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          {editando && (
            <button className="btn btn-danger" onClick={() => { setEditando(null); setForm({ nome: '', cpf: '', cargo: '', ativo: true, filial: { id: '' } }) }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>CPF</th><th>Cargo</th><th>Filial</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {vendedores.length === 0 ? (
              <tr><td colSpan={7} className="vazio">Nenhum vendedor cadastrado</td></tr>
            ) : vendedores.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.nome}</td>
                <td>{v.cpf}</td>
                <td>{v.cargo}</td>
                <td>{v.filial?.nomeUnidade}</td>
                <td>
                  <span className={`badge ${v.ativo ? 'badge-finalizado' : 'badge-cancelado'}`}>
                    {v.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-warning btn-sm" onClick={() => editar(v)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deletar(v.id)}>Deletar</button>
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