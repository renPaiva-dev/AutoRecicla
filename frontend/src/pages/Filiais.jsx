import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Filiais() {
  const [filiais, setFiliais] = useState([])
  const [form, setForm] = useState({ nomeUnidade: '', cidade: '', endereco: '', cnpj: '' })
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const res = await api.get('/filiais')
    setFiliais(res.data)
  }

  async function salvar() {
    try {
      if (editando) {
        await api.put(`/filiais/${editando}`, form)
      } else {
        await api.post('/filiais', form)
      }
      setForm({ nomeUnidade: '', cidade: '', endereco: '', cnpj: '' })
      setEditando(null)
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  function editar(f) {
    setForm({ nomeUnidade: f.nomeUnidade, cidade: f.cidade, endereco: f.endereco, cnpj: f.cnpj })
    setEditando(f.id)
  }

  async function deletar(id) {
    if (!confirm('Deletar filial?')) return
    try {
      await api.delete(`/filiais/${id}`)
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao deletar')
    }
  }

  return (
    <div>
      <h1 className="page-title">Filiais</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Filial' : 'Nova Filial'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome da Unidade</label>
            <input value={form.nomeUnidade} onChange={e => setForm({ ...form, nomeUnidade: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Cidade</label>
            <input value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} />
          </div>
          <div className="form-group">
            <label>CNPJ</label>
            <input value={form.cnpj} onChange={e => setForm({ ...form, cnpj: e.target.value })} />
          </div>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={salvar}>
            {editando ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          {editando && (
            <button className="btn btn-danger" onClick={() => { setEditando(null); setForm({ nomeUnidade: '', cidade: '', endereco: '', cnpj: '' }) }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nome</th><th>Cidade</th><th>Endereço</th><th>CNPJ</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filiais.length === 0 ? (
              <tr><td colSpan={6} className="vazio">Nenhuma filial cadastrada</td></tr>
            ) : filiais.map(f => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.nomeUnidade}</td>
                <td>{f.cidade}</td>
                <td>{f.endereco}</td>
                <td>{f.cnpj}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-warning btn-sm" onClick={() => editar(f)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deletar(f.id)}>Deletar</button>
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