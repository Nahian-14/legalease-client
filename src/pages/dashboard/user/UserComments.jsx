import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageSquare, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi'
import axiosInstance from '../../../utils/axiosInstance'
import toast from 'react-hot-toast'

export default function UserComments() {
  const [comments, setComments] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    axiosInstance.get('/api/comments/my').then(({ data }) => setComments(data)).finally(() => setLoading(false))
  }, [])

  const handleEdit = (c) => { setEditing(c._id); setEditText(c.text) }
  const cancelEdit = () => { setEditing(null); setEditText('') }

  const handleUpdate = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/api/comments/${id}`, { text: editText })
      setComments(cs => cs.map(c => c._id === id ? { ...c, text: data.text } : c))
      cancelEdit()
      toast.success('Comment updated')
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return
    try {
      await axiosInstance.delete(`/api/comments/${id}`)
      setComments(cs => cs.filter(c => c._id !== id))
      toast.success('Comment deleted')
    } catch { toast.error('Delete failed') }
  }

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner" /></div>

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ marginBottom:'0.35rem' }}>My Comments</h2>
        <p style={{ color:'var(--slate)' }}>Manage all your lawyer reviews</p>
      </div>

      {comments.length === 0 ? (
        <div style={{ textAlign:'center', padding:'5rem 2rem', background:'var(--white)', borderRadius:16, border:'1px solid var(--ivory-dark)' }}>
          <FiMessageSquare size={40} color="var(--slate-light)" style={{ marginBottom:'1rem' }} />
          <h3 style={{ marginBottom:'0.5rem' }}>No comments yet</h3>
          <p style={{ color:'var(--slate)' }}>After hiring and working with a lawyer, leave a review on their profile.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {comments.map(c => (
            <motion.div key={c._id} layout initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              className="card" style={{ padding:'1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
                <div style={{ display:'flex', gap:'1rem', alignItems:'center', flex:1 }}>
                  <img src={c.lawyer?.photo || `https://ui-avatars.com/api/?name=${c.lawyer?.name}&background=152B54&color=C9922A`}
                    alt="" style={{ width:48, height:48, borderRadius:10, objectFit:'cover', border:'2px solid var(--ivory-dark)', flexShrink:0 }} />
                  <div>
                    <p style={{ fontWeight:700, color:'var(--navy)', marginBottom:'0.2rem' }}>{c.lawyer?.name}</p>
                    <p style={{ color:'var(--gold)', fontSize:'0.82rem', margin:0 }}>{c.lawyer?.specialization}</p>
                    <p style={{ color:'var(--slate-light)', fontSize:'0.78rem', marginTop:'0.2rem' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
                  <button onClick={() => handleEdit(c)} className="btn btn-ghost btn-sm" title="Edit">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="btn btn-sm" style={{ background:'#FED7D7', color:'var(--red)', border:'none' }} title="Delete">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {editing === c._id ? (
                  <motion.div key="edit" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ marginTop:'1rem' }}>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      style={{ resize:'vertical', marginBottom:'0.75rem' }}
                    />
                    <div style={{ display:'flex', gap:'0.5rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(c._id)}>
                        <FiSave size={13} /> Save
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                        <FiX size={13} /> Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p key="text" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                    style={{ marginTop:'1rem', color:'var(--slate)', lineHeight:1.7, padding:'0.75rem', background:'var(--ivory)', borderRadius:8, fontSize:'0.9rem' }}>
                    {c.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
