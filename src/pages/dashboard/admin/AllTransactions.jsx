import { useEffect, useState } from 'react'
import { FiDollarSign, FiSearch } from 'react-icons/fi'
import axiosInstance from '../../../utils/axiosInstance'

export default function AllTransactions() {
  const [txns,    setTxns]    = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    axiosInstance.get('/api/admin/transactions').then(({ data }) => setTxns(data)).finally(() => setLoading(false))
  }, [])

  const filtered = txns.filter(t =>
    t.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
    t.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    t.lawyerEmail?.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = txns.reduce((s, t) => s + (t.amount || 0), 0)

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner" /></div>

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ marginBottom:'0.35rem' }}>All Transactions</h2>
        <p style={{ color:'var(--slate)' }}>Complete payment history across the platform</p>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { label:'Total Revenue',      value:`$${totalRevenue.toFixed(2)}`, color:'var(--green)' },
          { label:'Total Transactions', value: txns.length,                  color:'var(--navy)' },
          { label:'Avg. Transaction',   value: txns.length ? `$${(totalRevenue/txns.length).toFixed(2)}` : '$0', color:'var(--gold)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:'var(--white)', borderRadius:12, padding:'1.5rem', border:'1px solid var(--ivory-dark)' }}>
            <div style={{ fontSize:'1.8rem', fontWeight:700, color, fontFamily:'var(--font-display)', marginBottom:'0.25rem' }}>{value}</div>
            <div style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:'1.25rem', maxWidth:360 }}>
        <FiSearch style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
        <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by ID, email…" style={{ paddingLeft:'2.5rem' }} />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User Email</th>
              <th>Lawyer Email</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t._id}>
                <td>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.8rem', color:'var(--slate)', background:'var(--ivory)', padding:'0.2rem 0.5rem', borderRadius:4 }}>
                    {t.transactionId?.slice(0,18)}…
                  </span>
                </td>
                <td style={{ fontSize:'0.88rem', color:'var(--slate)' }}>{t.userEmail}</td>
                <td style={{ fontSize:'0.88rem', color:'var(--slate)' }}>{t.lawyerEmail}</td>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
                    <FiDollarSign size={13} color="var(--green)" />
                    <strong style={{ color:'var(--green)' }}>{t.amount?.toFixed(2)}</strong>
                  </div>
                </td>
                <td style={{ fontSize:'0.88rem', color:'var(--slate)' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td><span className="badge badge-green">Completed</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'3rem', color:'var(--slate)' }}>No transactions found.</div>
        )}
      </div>
    </div>
  )
}
