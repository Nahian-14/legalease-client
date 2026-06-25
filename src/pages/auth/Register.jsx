import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { GiScales } from 'react-icons/gi'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../utils/axiosInstance'
import toast from 'react-hot-toast'

export default function Register() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]     = useState({ name:'', email:'', password:'', confirm:'' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const fbUser = await register(form.email, form.password, form.name)
      // Create user in DB
      await axiosInstance.post('/api/auth/register', { name: form.name, email: form.email, photo: fbUser.photoURL || null })
      toast.success('Account created! Choose your role.')
      navigate('/choose-role')
    } catch (err) {
      toast.error(err.code === 'auth/email-already-in-use' ? 'Email already in use' : 'Registration failed')
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle()
      navigate('/choose-role')
    } catch { toast.error('Google sign-up failed') }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--ivory)', padding:'5rem 1.5rem' }}>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} style={{ width:'100%', maxWidth:480 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.25rem' }}>
            <GiScales size={26} color="var(--gold)" />
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.4rem', color:'var(--navy)' }}>LegalEase</span>
          </Link>
          <h2 style={{ marginBottom:'0.4rem' }}>Create your account</h2>
          <p style={{ color:'var(--slate)' }}>Join thousands of clients and legal professionals</p>
        </div>

        <div className="card" style={{ padding:'2.5rem' }}>
          <button onClick={handleGoogle} style={{
            width:'100%', padding:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem',
            background:'var(--white)', border:'2px solid var(--ivory-dark)', borderRadius:8, cursor:'pointer', fontSize:'0.95rem', fontWeight:500, marginBottom:'1.5rem', color:'var(--navy)', transition:'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--ivory-dark)'}
          >
            <FcGoogle size={20} /> Sign up with Google
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
            <div style={{ flex:1, height:1, background:'var(--ivory-dark)' }} />
            <span style={{ color:'var(--slate-light)', fontSize:'0.82rem' }}>or with email</span>
            <div style={{ flex:1, height:1, background:'var(--ivory-dark)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position:'relative' }}>
                <FiUser style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
                <input className="form-input" value={form.name} onChange={update('name')} placeholder="John Smith" required style={{ paddingLeft:'2.75rem' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position:'relative' }}>
                <FiMail style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
                <input className="form-input" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required style={{ paddingLeft:'2.75rem' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <FiLock style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
                <input className="form-input" type={showPw ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="Min. 6 characters" required style={{ paddingLeft:'2.75rem', paddingRight:'2.75rem' }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--slate-light)' }}>
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position:'relative' }}>
                <FiLock style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
                <input className="form-input" type="password" value={form.confirm} onChange={update('confirm')} placeholder="Repeat password" required style={{ paddingLeft:'2.75rem' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'0.9rem', marginTop:'0.5rem' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'1.5rem', color:'var(--slate)', fontSize:'0.92rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--gold)', fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
