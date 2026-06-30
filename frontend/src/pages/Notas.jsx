import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Notas() {
  const [notas, setNotas] = useState([])
  const [clientes, setClientes] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [form, setForm] = useState({ clienteId: '', vendedorId: '' })
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const [n, c, v] = await Promise.all([
      api.get('/notas'), api.get('/clientes'), api.get('/vendedores')
    ])
    setNotas(n.data)
    setClientes(c.data)
    setVendedores(v.data)
  }

  async function abrirNota() {
    try {
      const res = await api.post('/notas', form)
      setForm({ clienteId: '', vendedorId: '' })
      setErro('')
      navigate(`/notas/${res.data.id}`)
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao abrir nota')
    }
  }

  function badgeClass(status) {
    if (status === 'Aberto') return 'badge badge-aberto'
    if (status === 'Finalizado') return 'badge badge-finalizado'
    return 'badge badge-cancelado'
  }

  return (
    <div>
      <h1 className="page-title">Notas de Venda</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>Abrir Nova Nota</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Cliente</label>
            <select value={form.clienteId} onChange={e => setForm({ ...form, clienteId: e.target.value })}>
              <option value="">Selecione</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Vendedor</label>
            <select value={form.vendedorId} onChange={e => setForm({ ...form, vendedorId: e.target.value })}>
              <option value="">Selecione</option>
              {vendedores.filter(v => v.ativo).map(v => (
                <option key={v.id} value={v.id}>{v.nome} — {v.filial?.nomeUnidade}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={abrirNota}>Abrir Nota</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Cliente</th><th>Vendedor</th><th>Status</th><th>Total</th><th>Data</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {notas.length === 0 ? (
              <tr><td colSpan={7} className="vazio">Nenhuma nota cadastrada</td></tr>
            ) : notas.map(n => (
              <tr key={n.id}>
                <td>{n.id}</td>
                <td>{n.cliente?.nome}</td>
                <td>{n.vendedor?.nome}</td>
                <td><span className={badgeClass(n.status)}>{n.status}</span></td>
                <td>R$ {Number(n.valorTotal || 0).toFixed(2)}</td>
                <td>{n.dataCriacao ? new Date(n.dataCriacao).toLocaleDateString('pt-BR') : '-'}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/notas/${n.id}`)}>
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}