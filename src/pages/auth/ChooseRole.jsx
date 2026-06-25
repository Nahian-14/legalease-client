import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiBriefcase, FiArrowRight } from 'react-icons/fi'
import { GiScales } from 'react-icons/gi'
import axiosInstance from '../../utils/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function ChooseRole() {
  const { setDbUser } = useAuth()
  const navigate      = useNavigate()
  const [role, setRole]   = useState(null)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!role) return toast.error('Please select a role')
    setLoading(true)
    try {
      const { data } = await axiosInstance.patch('/api/auth/role', { role })
      setDbUser(data)
      toast.success(`Welcome! You are registered as a ${role}.`)
      navigate(role === 'lawyer' ? '/dashboard/lawyer/manage-legal-profile' : '/')
    } catch { toast.error('Failed to set role') } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--ivory)', padding:'2rem 1.5rem', paddingTop:'5rem' }}>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ width:'100%', maxWidth:600, textAlign:'center' }}>
        <GiScales size={50} color="var(--gold)" style={{ marginBottom:'1.25rem' }} />
        <h2 style={{ marginBottom:'0.5rem' }}>How will you use LegalEase?</h2>
        <p style={{ color:'var(--slate)', marginBottom:'2.5rem' }}>Choose your role. You can only pick once — choose carefully!</p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
          {[
            { value:'user', icon: FiUser, title:'I Need Legal Help', desc:'Browse and hire verified lawyers for your legal needs.', perks:['Browse all lawyers','Send hiring requests','Pay via Stripe','Leave reviews'] },
            { value:'lawyer', icon: FiBriefcase, title:"I'm a Lawyer", desc:'List your services and connect with clients globally.', perks:['Publish your profile','Manage client requests','Build your reputation','Track earnings'] },
          ].map(({ value, icon:Icon, title, desc, perks }) => (
            <motion.div key={value} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              onClick={() => setRole(value)}
              style={{
                padding:'2rem', borderRadius:16, cursor:'pointer', textAlign:'left', transition:'all 0.2s',
                border: `2px solid ${role === value ? 'var(--gold)' : 'var(--ivory-dark)'}`,
                background: role === value ? 'var(--gold-muted)' : 'var(--white)',
                boxShadow: role === value ? 'var(--shadow-gold)' : 'var(--shadow-card)',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
                <div style={{ width:44, height:44, borderRadius:10, background: role===value ? 'var(--gold)' : 'var(--ivory-dark)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={22} color={role===value ? 'white' : 'var(--slate)'} />
                </div>
                <h3 style={{ fontSize:'1.05rem', margin:0 }}>{title}</h3>
              </div>
              <p style={{ color:'var(--slate)', fontSize:'0.88rem', marginBottom:'1rem' }}>{desc}</p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                {perks.map(p => (
                  <li key={p} style={{ fontSize:'0.82rem', color:'var(--slate)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <span style={{ color:'var(--gold)', fontSize:'1rem' }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <button className="btn btn-primary btn-lg" onClick={handleContinue} disabled={!role || loading} style={{ minWidth:200 }}>
          {loading ? 'Setting up…' : <>Continue as {role ? role.charAt(0).toUpperCase()+role.slice(1) : '…'} <FiArrowRight /></>}
        </button>

        <style>{`@media(max-width:600px){ .grid-2 { grid-template-columns:1fr!important; } }`}</style>
      </motion.div>
    </div>
  )
}
