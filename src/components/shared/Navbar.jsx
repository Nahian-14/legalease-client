import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSearch, FiSun, FiMoon, FiChevronDown, FiUser, FiLogOut, FiGrid } from 'react-icons/fi'
import { GiScales } from 'react-icons/gi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, dbUser, logout } = useAuth()
  const { dark, toggle }         = useTheme()
  const navigate                 = useNavigate()

  const [menuOpen, setMenuOpen]     = useState(false)
  const [dropOpen, setDropOpen]     = useState(false)
  const [search,   setSearch]       = useState('')
  const [scrolled, setScrolled]     = useState(false)
  const dropRef                     = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/browse-lawyers?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const role = dbUser?.role
  const dashboardLinks = {
    user:   [
      { to: '/dashboard/user/hiring-history',   label: 'Hiring History' },
      { to: '/dashboard/user/comments',         label: 'My Comments' },
      { to: '/dashboard/user/update-profile',   label: 'Update Profile' },
    ],
    lawyer: [
      { to: '/dashboard/lawyer/hiring-history',       label: 'Hiring History' },
      { to: '/dashboard/lawyer/manage-legal-profile', label: 'Manage Profile' },
    ],
    admin:  [
      { to: '/dashboard/admin/manage-users',      label: 'Manage Users' },
      { to: '/dashboard/admin/all-transactions',  label: 'Transactions' },
      { to: '/dashboard/admin/analytics',         label: 'Analytics' },
    ],
  }

  const links = role ? dashboardLinks[role] || [] : []

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      background: scrolled ? 'rgba(11,29,58,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,146,42,0.2)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 1.5rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 70, gap: '1.5rem' }}>

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexShrink:0 }}>
          <GiScales size={28} style={{ color: 'var(--gold)' }} />
          <span style={{ fontFamily:'var(--font-display)', fontSize:'1.35rem', fontWeight:700, color:'var(--white)' }}>
            Legal<span style={{ color:'var(--gold)' }}>Ease</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ flex:1, maxWidth:360, position:'relative' }}>
          <FiSearch style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.4)', pointerEvents:'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or specialization…"
            style={{
              width:'100%', padding:'0.55rem 0.85rem 0.55rem 2.4rem',
              background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
              borderRadius:6, color:'var(--white)', fontSize:'0.88rem',
              outline:'none', transition:'border-color 0.2s',
              fontFamily:'var(--font-body)',
            }}
          />
        </form>

        {/* Desktop Nav */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.25rem', marginLeft:'auto' }} className="desktop-nav">
          {[{ to:'/', label:'Home' }, { to:'/browse-lawyers', label:'Browse Lawyers' }].map(({ to, label }) => (
            <NavLink key={to} to={to} end
              style={({ isActive }) => ({
                padding:'0.4rem 0.85rem', borderRadius:6, fontSize:'0.9rem', fontWeight:500,
                color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.85)',
                background: isActive ? 'rgba(201,146,42,0.12)' : 'transparent',
                transition:'all 0.2s',
              })}
            >{label}</NavLink>
          ))}

          {/* Dashboard dropdown */}
          {user && (
            <div ref={dropRef} style={{ position:'relative' }}>
              <button onClick={() => setDropOpen(d => !d)} style={{
                display:'flex', alignItems:'center', gap:'0.35rem',
                padding:'0.4rem 0.85rem', borderRadius:6, fontSize:'0.9rem', fontWeight:500,
                color:'rgba(255,255,255,0.85)', background:'transparent', border:'none', cursor:'pointer',
              }}>
                <FiGrid size={15} /> Dashboard <FiChevronDown size={13} style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition:'0.2s' }} />
              </button>
              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                    transition={{ duration:0.15 }}
                    style={{
                      position:'absolute', top:'calc(100% + 0.5rem)', right:0,
                      background:'var(--white)', borderRadius:10, boxShadow:'0 12px 40px rgba(11,29,58,0.18)',
                      border:'1px solid var(--ivory-dark)', minWidth:200, overflow:'hidden', zIndex:100,
                    }}
                  >
                    <div style={{ padding:'0.5rem' }}>
                      <Link to="/dashboard" onClick={() => setDropOpen(false)}
                        style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.6rem 0.75rem', borderRadius:6, color:'var(--navy)', fontSize:'0.88rem', fontWeight:600 }}>
                        <FiUser size={14} /> My Profile
                      </Link>
                      {links.map(l => (
                        <Link key={l.to} to={l.to} onClick={() => setDropOpen(false)}
                          style={{ display:'block', padding:'0.6rem 0.75rem', borderRadius:6, color:'var(--slate)', fontSize:'0.88rem' }}>
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
          <button onClick={toggle} style={{ padding:'0.5rem', background:'rgba(255,255,255,0.08)', border:'none', borderRadius:6, color:'var(--white)', cursor:'pointer', display:'flex' }}>
            {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>

          {user ? (
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <img src={dbUser?.photo || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=C9922A&color=fff`}
                alt="avatar" style={{ width:34, height:34, borderRadius:'50%', border:'2px solid var(--gold)', objectFit:'cover' }} />
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color:'var(--white)', borderColor:'rgba(255,255,255,0.3)' }}>
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(m => !m)} style={{ display:'none', padding:'0.5rem', background:'rgba(255,255,255,0.08)', border:'none', borderRadius:6, color:'var(--white)', cursor:'pointer' }} className="hamburger">
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            style={{ overflow:'hidden', background:'rgba(11,29,58,0.98)', borderTop:'1px solid rgba(201,146,42,0.2)' }}>
            <div style={{ padding:'1rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.25rem' }}>
              {[{ to:'/', label:'Home' }, { to:'/browse-lawyers', label:'Browse Lawyers' }].map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                  style={{ padding:'0.7rem 0', color:'rgba(255,255,255,0.85)', fontWeight:500, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  {label}
                </Link>
              ))}
              {user && links.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  style={{ padding:'0.7rem 0', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>
                  {l.label}
                </Link>
              ))}
              {!user && <Link to="/login" className="btn btn-primary" style={{ marginTop:'0.5rem', justifyContent:'center' }} onClick={() => setMenuOpen(false)}>Login</Link>}
              {user  && <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color:'var(--white)', borderColor:'rgba(255,255,255,0.3)', marginTop:'0.5rem' }}>Logout</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:768px) { .desktop-nav { display:none!important; } .hamburger { display:flex!important; } }
      `}</style>
    </nav>
  )
}
