import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiCheckCircle, FiXCircle, FiUser } from 'react-icons/fi'
import axiosInstance from '../../../utils/axiosInstance'
import toast from 'react-hot-toast'

const statusConfig = {
  pending:  { label:'Pending',  cls:'badge-gray' },
  accepted: { label:'Accepted', cls:'badge-green' },
  rejected: { label:'Rejected', cls:'badge-red' },
}

export default function LawyerHiringHistory() {
  const [hires,   setHires]   = useState([])
  const [loading, setLoading] = useState(true)
  const [acting,  setActing]  = useState(null)

  useEffect(() => {
    axiosInstance.get('/api/hires/incoming').then(({ data }) => setHires(data)).finally(() => setLoading(false))
  }, [])

  const handleAction = async (id, action) => {
    setActing(id + action)
    try {
      await axiosInstance.patch(`/api/hires/${id}/status`, { status: action })
      setHires(hs => hs.map(h => h._id === id ? { ...h, status: action } : h))
      toast.success(`Request ${action}`)
    } catch { toast.error('Action failed') } finally { setActing(null) }
  }

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner" /></div>

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ marginBottom:'0.35rem' }}>Hiring Requests</h2>
        <p style={{ color:'var(--slate)' }}>Manage incoming client requests</p>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { label:'Total',    value: hires.length,                              color:'var(--navy)', bg:'var(--ivory-dark)' },
          { label:'Accepted', value: hires.filter(h=>h.status==='accepted').length, color:'var(--green)', bg:'var(--green-light)' },
          { label:'Pending',  value: hires.filter(h=>h.status==='pending').length,  color:'var(--gold)',  bg:'var(--gold-muted)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background:'var(--white)', borderRadius:12, padding:'1.25rem', border:'1px solid var(--ivory-dark)', textAlign:'center' }}>
            <div style={{ fontSize:'1.8rem', fontWeight:700, color, fontFamily:'var(--font-display)' }}>{value}</div>
            <div style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{label} Requests</div>
          </div>
        ))}
      </div>

      {hires.length === 0 ? (
        <div style={{ textAlign:'center', padding:'5rem 2rem', background:'var(--white)', borderRadius:16, border:'1px solid var(--ivory-dark)' }}>
          <FiUser size={40} color="var(--slate-light)" style={{ marginBottom:'1rem' }} />
          <h3 style={{ marginBottom:'0.5rem' }}>No requests yet</h3>
          <p style={{ color:'var(--slate)' }}>Client hiring requests will appear here.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hires.map(hire => {
                const { label, cls } = statusConfig[hire.status] || statusConfig.pending
                return (
                  <tr key={hire._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                        <img src={hire.user?.photo || `https://ui-avatars.com/api/?name=${hire.user?.name}&background=C9922A&color=fff`}
                          alt="" style={{ width:36, height:36, borderRadius:8, objectFit:'cover' }} />
                        <span style={{ fontWeight:600 }}>{hire.user?.name}</span>
                      </div>
                    </td>
                    <td style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{hire.user?.email}</td>
                    <td style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{new Date(hire.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge ${cls}`}>{label}</span></td>
                    <td>
                      {hire.isPaid
                        ? <span className="badge badge-green"><FiCheckCircle size={11} style={{ marginRight:3 }} />Paid</span>
                        : <span className="badge badge-gray">Unpaid</span>}
                    </td>
                    <td>
                      {hire.status === 'pending' && (
                        <div style={{ display:'flex', gap:'0.5rem' }}>
                          <button className="btn btn-sm" style={{ background:'var(--green-light)', color:'var(--green)', border:'none' }}
                            onClick={() => handleAction(hire._id, 'accepted')} disabled={!!acting}>
                            <FiCheckCircle size={13} /> Accept
                          </button>
                          <button className="btn btn-sm" style={{ background:'#FED7D7', color:'var(--red)', border:'none' }}
                            onClick={() => handleAction(hire._id, 'rejected')} disabled={!!acting}>
                            <FiXCircle size={13} /> Reject
                          </button>
                        </div>
                      )}
                      {hire.status !== 'pending' && (
                        <span style={{ color:'var(--slate-light)', fontSize:'0.82rem', fontStyle:'italic' }}>No action needed</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
