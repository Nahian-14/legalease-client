import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { GiScales } from 'react-icons/gi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : 'Login failed')
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle()
      toast.success('Welcome!')
      navigate(from, { replace: true })
    } catch { toast.error('Google login failed') }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--ivory)' }}>
      {/* Left panel */}
      <div style={{ flex:1, background:'linear-gradient(135deg, #0B1D3A, #152B54)', display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem' }} className="auth-panel">
        <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7 }} style={{ maxWidth:440, textAlign:'center' }}>
          <GiScales size={64} color="var(--gold)" style={{ marginBottom:'1.5rem' }} />
          <h2 style={{ color:'var(--white)', marginBottom:'1rem', fontSize:'2.2rem' }}>Justice Made Accessible</h2>
          <p style={{ color:'rgba(255,255,255,0.65)', lineHeight:1.8, marginBottom:'2rem' }}>
            Thousands of verified legal professionals are ready to help you navigate your legal challenges.
          </p>
          {['"Fast, professional, and completely transparent."', '"Found the right lawyer in minutes."', '"Resolved my case in half the time."'].map((q, i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.3 + i*0.15 }}
              style={{ background:'rgba(255,255,255,0.06)', borderRadius:10, padding:'1rem', marginBottom:'0.75rem', borderLeft:'3px solid var(--gold)', textAlign:'left' }}>
              <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.88rem', margin:0 }}>{q}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right panel – form */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem 2rem' }}>
        <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }} style={{ width:'100%', maxWidth:440 }}>
          <div style={{ marginBottom:'2.5rem' }}>
            <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', marginBottom:'2rem' }}>
              <GiScales size={20} color="var(--gold)" />
              <span style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'var(--navy)' }}>LegalEase</span>
            </Link>
            <h2 style={{ marginBottom:'0.4rem' }}>Welcome back</h2>
            <p style={{ color:'var(--slate)' }}>Sign in to your account</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} style={{
            width:'100%', padding:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem',
            background:'var(--white)', border:'2px solid var(--ivory-dark)', borderRadius:8, cursor:'pointer', fontSize:'0.95rem', fontWeight:500, marginBottom:'1.5rem',
            transition:'border-color 0.2s', color: 'var(--navy)',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--ivory-dark)'}
          >
            <FcGoogle size={20} /> Continue with Google
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
            <div style={{ flex:1, height:1, background:'var(--ivory-dark)' }} />
            <span style={{ color:'var(--slate-light)', fontSize:'0.82rem' }}>or continue with email</span>
            <div style={{ flex:1, height:1, background:'var(--ivory-dark)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position:'relative' }}>
                <FiMail style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required style={{ paddingLeft:'2.75rem' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <FiLock style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
                <input className="form-input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required style={{ paddingLeft:'2.75rem', paddingRight:'2.75rem' }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--slate-light)' }}>
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'0.9rem', marginTop:'0.5rem' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'1.5rem', color:'var(--slate)', fontSize:'0.92rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'var(--gold)', fontWeight:600 }}>Create one</Link>
          </p>
        </motion.div>
      </div>

      <style>{`@media(max-width:768px){ .auth-panel { display:none!important; } }`}</style>
    </div>
  )
}
