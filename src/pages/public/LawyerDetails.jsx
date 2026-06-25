import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiDollarSign, FiMessageCircle, FiX, FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { GiScales } from 'react-icons/gi'
import axiosInstance from '../../utils/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function LawyerDetails() {
  const { id }           = useParams()
  const { user, dbUser } = useAuth()

  const [lawyer,   setLawyer]   = useState(null)
  const [comments, setComments] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [hireOpen, setHireOpen] = useState(false)
  const [hiring,   setHiring]   = useState(false)
  const [comment,  setComment]  = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [canComment, setCanComment] = useState(false)

  useEffect(() => {
    Promise.all([
      axiosInstance.get(`/api/lawyers/${id}`),
      axiosInstance.get(`/api/comments/${id}`),
    ]).then(([l, c]) => {
      setLawyer(l.data)
      setComments(c.data || [])
    }).finally(() => setLoading(false))

    if (user) {
      axiosInstance.get(`/api/hires/can-comment/${id}`).then(r => setCanComment(r.data.canComment)).catch(() => {})
    }
  }, [id, user])

  const handleHire = async () => {
    if (!user) return toast.error('Please login to hire a lawyer')
    setHiring(true)
    try {
      await axiosInstance.post('/api/hires', { lawyerId: id })
      toast.success('Hiring request sent successfully!')
      setHireOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send hiring request')
    } finally { setHiring(false) }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      if (editingComment) {
        const { data } = await axiosInstance.put(`/api/comments/${editingComment._id}`, { text: comment })
        setComments(cs => cs.map(c => c._id === data._id ? data : c))
        setEditingComment(null)
        toast.success('Comment updated')
      } else {
        const { data } = await axiosInstance.post('/api/comments', { lawyerId: id, text: comment })
        setComments(cs => [data, ...cs])
        toast.success('Comment added')
      }
      setComment('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit comment')
    }
  }

  const deleteComment = async (cid) => {
    if (!confirm('Delete this comment?')) return
    try {
      await axiosInstance.delete(`/api/comments/${cid}`)
      setComments(cs => cs.filter(c => c._id !== cid))
      toast.success('Comment deleted')
    } catch { toast.error('Failed to delete') }
  }

  if (loading) return (
    <div style={{ paddingTop:70 }}>
      <div style={{ height:'40vh', background:'var(--ivory-dark)' }} className="skeleton" />
      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{ height:40, marginBottom:'1rem', borderRadius:8 }} />)}
      </div>
    </div>
  )

  if (!lawyer) return (
    <div style={{ paddingTop:100, textAlign:'center', padding:'8rem 2rem' }}>
      <h2>Lawyer not found</h2>
      <Link to="/browse-lawyers" className="btn btn-primary" style={{ marginTop:'1rem', display:'inline-flex' }}>Back to Browse</Link>
    </div>
  )

  return (
    <div style={{ paddingTop:70 }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg, #0B1D3A, #152B54)', padding:'3rem 0 2.5rem' }}>
        <div className="container">
          <div style={{ display:'flex', gap:'2rem', alignItems:'flex-start', flexWrap:'wrap' }}>
            <img src={lawyer.photo} alt={lawyer.name} style={{ width:120, height:120, borderRadius:16, objectFit:'cover', border:'3px solid var(--gold)', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                <h1 style={{ color:'var(--white)', fontSize:'2rem', margin:0 }}>{lawyer.name}</h1>
                <span className={`badge ${lawyer.isAvailable ? 'badge-green' : 'badge-red'}`}>
                  {lawyer.isAvailable ? 'Available' : 'Busy'}
                </span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                <GiScales color="var(--gold)" size={16} />
                <span style={{ color:'var(--gold)', fontWeight:500 }}>{lawyer.specialization}</span>
              </div>
              <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap' }}>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.92rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <FiDollarSign color="var(--gold)" /> <strong style={{ color:'var(--white)' }}>${lawyer.fee}</strong>/hr
                </div>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.92rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <FiCalendar color="var(--gold)" /> Joined {new Date(lawyer.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long' })}
                </div>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.92rem' }}>
                  <strong style={{ color:'var(--white)' }}>{lawyer.totalHires || 0}</strong> clients served
                </div>
              </div>
            </div>
            {dbUser?.role === 'user' && (
              <button className="btn btn-primary btn-lg" onClick={() => setHireOpen(true)} style={{ flexShrink:0 }}>
                <FiCheckCircle /> Hire Now
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2.5rem 1.5rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem', alignItems:'start' }}>

          {/* Main content */}
          <div>
            {/* Bio */}
            <div className="card" style={{ padding:'2rem', marginBottom:'1.5rem' }}>
              <h3 style={{ marginBottom:'1rem' }}>Professional Summary</h3>
              <div className="accent-line" />
              <p style={{ lineHeight:1.9, marginTop:'1rem', color:'var(--slate)' }}>{lawyer.bio}</p>
            </div>

            {/* Comments section */}
            <div className="card" style={{ padding:'2rem' }}>
              <h3 style={{ marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <FiMessageCircle color="var(--gold)" /> Client Reviews ({comments.length})
              </h3>
              <div className="accent-line" style={{ marginBottom:'1.5rem' }} />

              {/* Add comment */}
              {user ? (
                canComment || editingComment ? (
                  <form onSubmit={handleComment} style={{ marginBottom:'2rem' }}>
                    <label className="form-label">{editingComment ? 'Edit Comment' : 'Leave a Review'}</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Share your experience with this lawyer…"
                      style={{ resize:'vertical' }}
                    />
                    <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.75rem' }}>
                      <button type="submit" className="btn btn-primary btn-sm">
                        {editingComment ? 'Update Comment' : 'Post Review'}
                      </button>
                      {editingComment && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditingComment(null); setComment('') }}>Cancel</button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div style={{ background:'var(--ivory)', borderRadius:8, padding:'1rem', marginBottom:'1.5rem', fontSize:'0.88rem', color:'var(--slate)' }}>
                    ⚠️ You can only comment after hiring this lawyer.
                  </div>
                )
              ) : (
                <div style={{ background:'var(--ivory)', borderRadius:8, padding:'1rem', marginBottom:'1.5rem' }}>
                  <Link to="/login" className="btn btn-primary btn-sm">Login to Leave a Review</Link>
                </div>
              )}

              {/* Comment list */}
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {comments.length === 0 ? (
                  <p style={{ color:'var(--slate)', fontStyle:'italic', textAlign:'center', padding:'2rem' }}>No reviews yet. Be the first to review!</p>
                ) : (
                  comments.map(c => (
                    <div key={c._id} style={{ padding:'1.25rem', background:'var(--ivory)', borderRadius:10, border:'1px solid var(--ivory-dark)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                          <img src={c.user?.photo || `https://ui-avatars.com/api/?name=${c.user?.name}&background=152B54&color=C9922A`}
                            alt="" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover' }} />
                          <div>
                            <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--navy)', margin:0 }}>{c.user?.name}</p>
                            <p style={{ fontSize:'0.78rem', color:'var(--slate-light)', margin:0 }}>{new Date(c.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {dbUser?._id === c.user?._id && (
                          <div style={{ display:'flex', gap:'0.4rem' }}>
                            <button onClick={() => { setEditingComment(c); setComment(c.text) }} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--slate)', padding:'0.25rem' }}>
                              <FiEdit2 size={14} />
                            </button>
                            <button onClick={() => deleteComment(c._id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)', padding:'0.25rem' }}>
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p style={{ color:'var(--slate)', fontSize:'0.9rem', margin:0 }}>{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position:'sticky', top:90 }}>
            <div className="card" style={{ padding:'1.75rem', marginBottom:'1rem' }}>
              <h4 style={{ marginBottom:'1rem' }}>Quick Info</h4>
              {[
                { label:'Specialization', value: lawyer.specialization },
                { label:'Hourly Rate',    value: `$${lawyer.fee}` },
                { label:'Status',        value: lawyer.isAvailable ? 'Available' : 'Busy' },
                { label:'Total Clients', value: lawyer.totalHires || 0 },
              ].map(({ label, value }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'0.75rem 0', borderBottom:'1px solid var(--ivory-dark)' }}>
                  <span style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{label}</span>
                  <span style={{ fontWeight:600, color:'var(--navy)', fontSize:'0.88rem' }}>{value}</span>
                </div>
              ))}
              {dbUser?.role === 'user' && (
                <button className="btn btn-primary" style={{ width:'100%', marginTop:'1.25rem', justifyContent:'center' }} onClick={() => setHireOpen(true)}>
                  Hire {lawyer.name.split(' ')[0]}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hire Modal */}
      <AnimatePresence>
        {hireOpen && (
          <motion.div className="modal-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={e => e.target === e.currentTarget && setHireOpen(false)}>
            <motion.div className="modal-box" initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                <h3>Confirm Hiring Request</h3>
                <button onClick={() => setHireOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--slate)' }}><FiX size={20} /></button>
              </div>
              <div style={{ background:'var(--ivory)', borderRadius:10, padding:'1.25rem', marginBottom:'1.5rem' }}>
                <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
                  <img src={lawyer.photo} alt="" style={{ width:56, height:56, borderRadius:8, objectFit:'cover' }} />
                  <div>
                    <p style={{ fontWeight:700, color:'var(--navy)', marginBottom:'0.2rem' }}>{lawyer.name}</p>
                    <p style={{ color:'var(--gold)', fontSize:'0.88rem', margin:0 }}>{lawyer.specialization}</p>
                    <p style={{ color:'var(--slate)', fontSize:'0.88rem', marginTop:'0.2rem' }}>Consultation Fee: <strong>${lawyer.fee}/hr</strong></p>
                  </div>
                </div>
              </div>
              <p style={{ color:'var(--slate)', fontSize:'0.9rem', marginBottom:'1.5rem', lineHeight:1.7 }}>
                Sending a hiring request to <strong>{lawyer.name}</strong>. Once the lawyer accepts, you'll be able to complete payment from your dashboard.
              </p>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setHireOpen(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={handleHire} disabled={hiring}>
                  {hiring ? 'Sending…' : 'Send Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media(max-width:900px){ .container > div { grid-template-columns:1fr!important; } }`}</style>
    </div>
  )
}
