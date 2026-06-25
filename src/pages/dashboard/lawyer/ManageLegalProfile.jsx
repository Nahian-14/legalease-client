import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiEdit2, FiTrash2, FiPlus, FiX, FiUpload, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import axiosInstance from '../../../utils/axiosInstance'
import { uploadImage } from '../../../utils/uploadImage'
import { useAuth } from '../../../context/AuthContext'
import toast from 'react-hot-toast'

const SPECIALIZATIONS = ['Criminal Law','Corporate Law','Family Law','Real Estate','Immigration','Intellectual Property','Employment','Tax Law','Civil Litigation','Other']
const EMPTY = { name:'', bio:'', fee:'', specialization:'', photo:'', isAvailable:true }

export default function ManageLegalProfile() {
  const { dbUser } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form,      setForm]      = useState(EMPTY)
  const [editing,   setEditing]   = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    axiosInstance.get('/api/lawyers/my').then(({ data }) => setProfiles(Array.isArray(data) ? data : [data].filter(Boolean))).finally(() => setLoading(false))
  }, [])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModalOpen(true) }
  const openEdit   = (p)  => { setForm({ name:p.name, bio:p.bio, fee:p.fee, specialization:p.specialization, photo:p.photo, isAvailable:p.isAvailable }); setEditing(p._id); setModalOpen(true) }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm(f => ({ ...f, photo: url }))
      toast.success('Image uploaded')
    } catch { toast.error('Image upload failed') } finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!form.name || !form.fee || !form.specialization) return toast.error('Please fill all required fields')
    setSaving(true)
    try {
      if (editing) {
        const { data } = await axiosInstance.put(`/api/lawyers/${editing}`, form)
        setProfiles(ps => ps.map(p => p._id === editing ? data : p))
        toast.success('Profile updated')
      } else {
        const { data } = await axiosInstance.post('/api/lawyers', form)
        setProfiles(ps => [...ps, data])
        toast.success('Legal profile created!')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this profile?')) return
    try {
      await axiosInstance.delete(`/api/lawyers/${id}`)
      setProfiles(ps => ps.filter(p => p._id !== id))
      toast.success('Profile deleted')
    } catch { toast.error('Delete failed') }
  }

  const togglePublish = async (p) => {
    try {
      const { data } = await axiosInstance.patch(`/api/lawyers/${p._id}/toggle-publish`)
      setProfiles(ps => ps.map(x => x._id === p._id ? data : x))
      toast.success(data.isPublished ? 'Profile published' : 'Profile unpublished')
    } catch { toast.error('Failed to toggle') }
  }

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner" /></div>

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h2 style={{ marginBottom:'0.35rem' }}>My Legal Services</h2>
          <p style={{ color:'var(--slate)' }}>Manage your lawyer listings</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <FiPlus /> Add New Listing
        </button>
      </div>

      {profiles.length === 0 ? (
        <div style={{ textAlign:'center', padding:'5rem 2rem', background:'var(--white)', borderRadius:16, border:'2px dashed var(--ivory-dark)' }}>
          <FiBriefcase size={40} color="var(--slate-light)" style={{ marginBottom:'1rem' }} />
          <h3 style={{ marginBottom:'0.5rem' }}>No listings yet</h3>
          <p style={{ color:'var(--slate)', marginBottom:'1.5rem' }}>Create your first legal profile to start getting clients.</p>
          <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Create Profile</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.5rem' }}>
          {profiles.map(p => (
            <motion.div key={p._id} layout className="card" style={{ overflow:'hidden' }}>
              <div style={{ height:4, background: p.isPublished ? 'linear-gradient(90deg,var(--green),#38A169)' : 'linear-gradient(90deg,var(--slate-light),#A0AABF)' }} />
              <div style={{ padding:'1.5rem' }}>
                <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1rem' }}>
                  <img src={p.photo || `https://ui-avatars.com/api/?name=${p.name}&background=152B54&color=C9922A&size=128`}
                    alt={p.name} style={{ width:60, height:60, borderRadius:10, objectFit:'cover', border:'2px solid var(--ivory-dark)' }} />
                  <div style={{ flex:1 }}>
                    <h4 style={{ marginBottom:'0.25rem' }}>{p.name}</h4>
                    <p style={{ color:'var(--gold)', fontSize:'0.85rem', margin:0 }}>{p.specialization}</p>
                    <p style={{ color:'var(--navy)', fontWeight:700, fontSize:'0.95rem', marginTop:'0.25rem' }}>${p.fee}/hr</p>
                  </div>
                </div>

                <p style={{ color:'var(--slate)', fontSize:'0.85rem', lineHeight:1.6, marginBottom:'1rem',
                  overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                  {p.bio}
                </p>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.5rem' }}>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><FiEdit2 size={13} /> Edit</button>
                    <button className="btn btn-sm" style={{ background:'#FED7D7', color:'var(--red)', border:'none' }} onClick={() => handleDelete(p._id)}>
                      <FiTrash2 size={13} /> Delete
                    </button>
                  </div>
                  <button onClick={() => togglePublish(p)} style={{
                    display:'flex', alignItems:'center', gap:'0.4rem', background:'none', border:'none', cursor:'pointer',
                    color: p.isPublished ? 'var(--green)' : 'var(--slate)', fontSize:'0.85rem', fontWeight:500,
                  }}>
                    {p.isPublished ? <FiToggleRight size={18} color="var(--green)" /> : <FiToggleLeft size={18} />}
                    {p.isPublished ? 'Published' : 'Unpublished'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={e => e.target===e.currentTarget && setModalOpen(false)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              style={{ background:'var(--white)', borderRadius:20, padding:'2.5rem', width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(11,29,58,0.2)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.75rem' }}>
                <h3>{editing ? 'Edit Legal Profile' : 'Create Legal Profile'}</h3>
                <button onClick={() => setModalOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--slate)' }}><FiX size={20} /></button>
              </div>

              {/* Image upload */}
              <div style={{ marginBottom:'1.5rem', textAlign:'center' }}>
                <div style={{ position:'relative', display:'inline-block' }}>
                  <img src={form.photo || `https://ui-avatars.com/api/?name=${form.name||'?'}&background=152B54&color=C9922A&size=128`}
                    alt="" style={{ width:90, height:90, borderRadius:12, objectFit:'cover', border:'2px solid var(--ivory-dark)' }} />
                  <label style={{ position:'absolute', bottom:-8, right:-8, background:'var(--gold)', color:'white', width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                    <FiUpload size={13} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display:'none' }} />
                  </label>
                </div>
                {uploading && <p style={{ color:'var(--slate)', fontSize:'0.82rem', marginTop:'0.5rem' }}>Uploading…</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. John A. Smith" />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <select className="form-input form-select" value={form.specialization} onChange={e => setForm(f=>({...f,specialization:e.target.value}))}>
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fee ($/hr) *</label>
                <input className="form-input" type="number" min="0" value={form.fee} onChange={e => setForm(f=>({...f,fee:e.target.value}))} placeholder="e.g. 150" />
              </div>
              <div className="form-group">
                <label className="form-label">Professional Bio</label>
                <textarea className="form-input" rows={4} value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} placeholder="Describe your experience, expertise, and what clients can expect…" style={{ resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
                <label className="form-label" style={{ margin:0 }}>Currently Available</label>
                <button type="button" onClick={() => setForm(f=>({...f,isAvailable:!f.isAvailable}))} style={{ background:'none', border:'none', cursor:'pointer', color: form.isAvailable ? 'var(--green)' : 'var(--slate)' }}>
                  {form.isAvailable ? <FiToggleRight size={28} /> : <FiToggleLeft size={28} />}
                </button>
              </div>

              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={handleSave} disabled={saving || uploading}>
                  {saving ? 'Saving…' : editing ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
