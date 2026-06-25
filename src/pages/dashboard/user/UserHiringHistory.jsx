import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { FiClock, FiCheckCircle, FiXCircle, FiDollarSign } from 'react-icons/fi'
import axiosInstance from '../../../utils/axiosInstance'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const statusConfig = {
  pending:  { label:'Pending',  cls:'badge-gray',  icon: FiClock },
  accepted: { label:'Accepted', cls:'badge-green', icon: FiCheckCircle },
  rejected: { label:'Rejected', cls:'badge-red',   icon: FiXCircle },
}

export default function UserHiringHistory() {
  const [hires,   setHires]   = useState([])
  const [loading, setLoading] = useState(true)
  const [paying,  setPaying]  = useState(null)

  useEffect(() => {
    axiosInstance.get('/api/hires/my').then(({ data }) => setHires(data)).finally(() => setLoading(false))
  }, [])

  const handlePay = async (hire) => {
    setPaying(hire._id)
    try {
      const { data } = await axiosInstance.post('/api/payments/create-checkout', { hireId: hire._id })
      const stripe   = await stripePromise
      await stripe.redirectToCheckout({ sessionId: data.sessionId })
    } catch { toast.error('Payment failed. Please try again.') } finally { setPaying(null) }
  }

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner" /></div>

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ marginBottom:'0.35rem' }}>Hiring History</h2>
        <p style={{ color:'var(--slate)' }}>All your lawyer hiring requests</p>
      </div>

      {hires.length === 0 ? (
        <div style={{ textAlign:'center', padding:'5rem 2rem', background:'var(--white)', borderRadius:16, border:'1px solid var(--ivory-dark)' }}>
          <FiClock size={40} color="var(--slate-light)" style={{ marginBottom:'1rem' }} />
          <h3 style={{ marginBottom:'0.5rem' }}>No hiring requests yet</h3>
          <p style={{ color:'var(--slate)' }}>Browse lawyers and send a hiring request to get started.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Lawyer</th>
                <th>Specialization</th>
                <th>Fee</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {hires.map(hire => {
                const { label, cls, icon:Icon } = statusConfig[hire.status] || statusConfig.pending
                return (
                  <tr key={hire._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                        <img src={hire.lawyer?.photo || `https://ui-avatars.com/api/?name=${hire.lawyer?.name}&background=152B54&color=C9922A`}
                          alt="" style={{ width:36, height:36, borderRadius:8, objectFit:'cover' }} />
                        <span style={{ fontWeight:600 }}>{hire.lawyer?.name}</span>
                      </div>
                    </td>
                    <td style={{ color:'var(--slate)' }}>{hire.lawyer?.specialization}</td>
                    <td><strong>${hire.lawyer?.fee}</strong>/hr</td>
                    <td style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{new Date(hire.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${cls}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem' }}>
                        <Icon size={11} /> {label}
                      </span>
                    </td>
                    <td>
                      {hire.status === 'accepted' && !hire.isPaid ? (
                        <button className="btn btn-primary btn-sm" onClick={() => handlePay(hire)} disabled={paying === hire._id}>
                          <FiDollarSign size={13} /> {paying === hire._id ? 'Redirecting…' : 'Pay Now'}
                        </button>
                      ) : hire.isPaid ? (
                        <span className="badge badge-green"><FiCheckCircle size={11} /> Paid</span>
                      ) : null}
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
