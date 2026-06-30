import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function NotaDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [nota, setNota] = useState(null)
  const [itens, setItens] = useState([])
  const [pecas, setPecas] = useState([])
  const [form, setForm] = useState({ pecaId: '', quantidade: 1 })
  const [formPagamento, setFormPagamento] = useState({ formaPagamento: 'Pix' })
  const [erro, setErro] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const [n, i, p] = await Promise.all([
      api.get(`/notas/${id}`),
      api.get(`/notas/${id}/itens`),
      api.get('/pecas')
    ])
    setNota(n.data)
    setItens(i.data)
    setPecas(p.data)
  }

  async function adicionarPeca() {
    try {
      await api.post(`/notas/${id}/itens`, form)
      setForm({ pecaId: '', quantidade: 1 })
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao adicionar peça')
    }
  }

  async function finalizar() {
    if (!confirm('Finalizar nota?')) return
    try {
      await api.patch(`/notas/${id}/finalizar`, formPagamento)
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao finalizar')
    }
  }

  async function cancelar() {
    if (!confirm('Cancelar nota? O estoque será devolvido.')) return
    try {
      await api.patch(`/notas/${id}/cancelar`)
      setErro('')
      carregar()
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao cancelar')
    }
  }

  function badgeClass(status) {
    if (status === 'Aberto') return 'badge badge-aberto'
    if (status === 'Finalizado') return 'badge badge-finalizado'
    return 'badge badge-cancelado'
  }

  if (!nota) return <p>Carregando...</p>

  return (
    <div>
      <button className="btn btn-primary btn-sm" style={{ marginBottom: '1rem' }} onClick={() => navigate('/')}>
        ← Voltar
      </button>

      <h1 className="page-title">Nota #{nota.id}</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div><strong>Cliente:</strong> {nota.cliente?.nome}</div>
          <div><strong>Vendedor:</strong> {nota.vendedor?.nome}</div>
          <div><strong>Filial:</strong> {nota.vendedor?.filial?.nomeUnidade}</div>
          <div><strong>Status:</strong> <span className={badgeClass(nota.status)}>{nota.status}</span></div>
          <div><strong>Total:</strong> R$ {Number(nota.valorTotal || 0).toFixed(2)}</div>
          {nota.formaPagamento && <div><strong>Pagamento:</strong> {nota.formaPagamento}</div>}
          {nota.dataVenda && <div><strong>Data venda:</strong> {new Date(nota.dataVenda).toLocaleDateString('pt-BR')}</div>}
        </div>
      </div>

      {nota.status === 'Aberto' && (
        <>
          <div className="form-card">
            <h2>Adicionar Peça</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Peça</label>
                <select value={form.pecaId} onChange={e => setForm({ ...form, pecaId: e.target.value })}>
                  <option value="">Selecione</option>
                  {pecas.filter(p => p.filial?.id === nota.vendedor?.filial?.id).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nomePeca} — R$ {Number(p.valor).toFixed(2)} (Estoque: {p.quantidade})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantidade</label>
                <input type="number" min="1" value={form.quantidade} onChange={e => setForm({ ...form, quantidade: Number(e.target.value) })} />
              </div>
            </div>
            <button className="btn btn-success" onClick={adicionarPeca}>Adicionar</button>
          </div>

          <div className="form-card">
            <h2>Finalizar Nota</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Forma de Pagamento</label>
                <select value={formPagamento.formaPagamento} onChange={e => setFormPagamento({ formaPagamento: e.target.value })}>
                  <option>Pix</option>
                  <option>Dinheiro</option>
                  <option>Cartão de Crédito</option>
                  <option>Cartão de Débito</option>
                  <option>Boleto</option>
                </select>
              </div>
            </div>
            <div className="btn-group">
              <button className="btn btn-success" onClick={finalizar}>Finalizar</button>
              <button className="btn btn-danger" onClick={cancelar}>Cancelar Nota</button>
            </div>
          </div>
        </>
      )}

      <div className="table-card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>Itens da Nota</h2>
        <table>
          <thead>
            <tr><th>Peça</th><th>Qtd</th><th>Valor Unit.</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {itens.length === 0 ? (
              <tr><td colSpan={4} className="vazio">Nenhuma peça adicionada</td></tr>
            ) : itens.map((item, i) => (
              <tr key={i}>
                <td>{item.peca?.nomePeca}</td>
                <td>{item.quantidade}</td>
                <td>R$ {Number(item.valorVendido).toFixed(2)}</td>
                <td>R$ {(Number(item.valorVendido) * item.quantidade).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}