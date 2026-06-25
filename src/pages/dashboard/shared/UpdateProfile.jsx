import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiUpload, FiSave } from 'react-icons/fi'
import { useAuth } from '../../../context/AuthContext'
import { uploadImage } from '../../../utils/uploadImage'
import axiosInstance from '../../../utils/axiosInstance'
import toast from 'react-hot-toast'

export default function UpdateProfile() {
  const { dbUser, setDbUser } = useAuth()
  const [name,     setName]     = useState(dbUser?.name || '')
  const [photo,    setPhoto]    = useState(dbUser?.photo || '')
  const [uploading,setUploading]= useState(false)
  const [saving,   setSaving]   = useState(false)

  const handleImage = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    try { setPhoto(await uploadImage(file)); toast.success('Photo uploaded') }
    catch { toast.error('Upload failed') } finally { setUploading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error('Name cannot be empty')
    setSaving(true)
    try {
      const { data } = await axiosInstance.patch('/api/auth/profile', { name, photo })
      setDbUser(data)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth:520 }}>
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ marginBottom:'0.35rem' }}>Update Profile</h2>
        <p style={{ color:'var(--slate)' }}>Keep your profile information up to date</p>
      </div>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="card" style={{ padding:'2.5rem' }}>
        {/* Avatar */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ position:'relative', display:'inline-block' }}>
            <img
              src={photo || `https://ui-avatars.com/api/?name=${name||'User'}&background=C9922A&color=fff&size=200`}
              alt="Profile" style={{ width:110, height:110, borderRadius:'50%', objectFit:'cover', border:'4px solid var(--gold)' }}
            />
            <label style={{
              position:'absolute', bottom:0, right:0, background:'var(--gold)', color:'white',
              width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', border:'3px solid var(--white)',
            }}>
              <FiUpload size={14} />
              <input type="file" accept="image/*" onChange={handleImage} style={{ display:'none' }} />
            </label>
          </div>
          {uploading && <p style={{ color:'var(--slate)', fontSize:'0.82rem', marginTop:'0.5rem' }}>Uploading photo…</p>}
          <p style={{ color:'var(--slate-light)', fontSize:'0.82rem', marginTop:'0.5rem' }}>Click the icon to change photo</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position:'relative' }}>
              <FiUser style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={{ paddingLeft:'2.75rem' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" value={dbUser?.email || ''} disabled style={{ opacity:0.6, cursor:'not-allowed' }} />
            <p style={{ color:'var(--slate-light)', fontSize:'0.78rem', marginTop:'0.3rem' }}>Email cannot be changed</p>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 1rem', background:'var(--ivory)', borderRadius:8, marginBottom:'1.5rem' }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--gold)', flexShrink:0 }} />
            <div>
              <p style={{ fontWeight:600, fontSize:'0.88rem', color:'var(--navy)', margin:0 }}>Role: <span style={{ color:'var(--gold)' }}>{dbUser?.role?.charAt(0).toUpperCase()+dbUser?.role?.slice(1)}</span></p>
              <p style={{ color:'var(--slate-light)', fontSize:'0.78rem', margin:0 }}>Contact admin to change role</p>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'0.9rem' }} disabled={saving || uploading}>
            <FiSave size={16} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
