import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Pecas() {
  const [pecas, setPecas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filiais, setFiliais] = useState([])
  const [form, setForm] = useState({
    nomePeca: '', valor: '', estadoConservacao: 'Usado', quantidade: '',
    categoria: { id: '' }, filial: { id: '' }
  })
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const [p, c, f] = await Promise.all([
      api.get('/pecas'), api.get('/categorias'), api.get('/filiais')
    ])
    setPecas(p.data)
    setCategorias(c.data)
    setFiliais(f.data)
  }

  async function salvar() {
    try {
      if (editando) {
        await api.put(`/pecas/${editando}`, form)
      } else {
        await api.post('/pecas', form)
      }
      setForm({ nomePeca: '', valor: '', estadoConservacao: 'Usado', quantidade: '', categoria: { id: '' }, filial: { id: '' } })
      setEditando(null)
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  function editar(p) {
    setForm({
      nomePeca: p.nomePeca, valor: p.valor, estadoConservacao: p.estadoConservacao,
      quantidade: p.quantidade, categoria: { id: p.categoria.id }, filial: { id: p.filial.id }
    })
    setEditando(p.id)
  }

  async function deletar(id) {
    if (!confirm('Deletar peça?')) return
    try {
      await api.delete(`/pecas/${id}`)
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao deletar')
    }
  }

  return (
    <div>
      <h1 className="page-title">Peças</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Peça' : 'Nova Peça'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome da Peça</label>
            <input value={form.nomePeca} onChange={e => setForm({ ...form, nomePeca: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Valor (R$)</label>
            <input type="number" step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Estado de Conservação</label>
            <select value={form.estadoConservacao} onChange={e => setForm({ ...form, estadoConservacao: e.target.value })}>
              <option value="Novo">Novo</option>
              <option value="Seminovo">Seminovo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>
          <div className="form-group">
            <label>Quantidade</label>
            <input type="number" value={form.quantidade} onChange={e => setForm({ ...form, quantidade: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select value={form.categoria.id} onChange={e => setForm({ ...form, categoria: { id: e.target.value } })}>
              <option value="">Selecione</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nomeCategoria}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Filial</label>
            <select value={form.filial.id} onChange={e => setForm({ ...form, filial: { id: e.target.value } })}>
              <option value="">Selecione</option>
              {filiais.map(f => <option key={f.id} value={f.id}>{f.nomeUnidade}</option>)}
            </select>
          </div>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={salvar}>
            {editando ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          {editando && (
            <button className="btn btn-danger" onClick={() => { setEditando(null); setForm({ nomePeca: '', valor: '', estadoConservacao: 'Usado', quantidade: '', categoria: { id: '' }, filial: { id: '' } }) }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Valor</th><th>Estado</th><th>Qtd</th><th>Categoria</th><th>Filial</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {pecas.length === 0 ? (
              <tr><td colSpan={8} className="vazio">Nenhuma peça cadastrada</td></tr>
            ) : pecas.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nomePeca}</td>
                <td>R$ {Number(p.valor).toFixed(2)}</td>
                <td>{p.estadoConservacao}</td>
                <td>{p.quantidade}</td>
                <td>{p.categoria?.nomeCategoria}</td>
                <td>{p.filial?.nomeUnidade}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-warning btn-sm" onClick={() => editar(p)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deletar(p.id)}>Deletar</button>
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