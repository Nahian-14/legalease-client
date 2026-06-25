import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiClock, FiMessageSquare, FiUser, FiSettings, FiMenu, FiX,
  FiUsers, FiDollarSign, FiBarChart2, FiBriefcase, FiLogOut,
} from 'react-icons/fi'
import { GiScales } from 'react-icons/gi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navByRole = {
  user: [
    { to: '/dashboard',                        label: 'Overview',        icon: FiHome,         exact: true },
    { to: '/dashboard/user/hiring-history',    label: 'Hiring History',  icon: FiClock },
    { to: '/dashboard/user/comments',          label: 'My Comments',     icon: FiMessageSquare },
    { to: '/dashboard/user/update-profile',    label: 'Update Profile',  icon: FiUser },
  ],
  lawyer: [
    { to: '/dashboard',                              label: 'Overview',        icon: FiHome, exact: true },
    { to: '/dashboard/lawyer/hiring-history',        label: 'Hiring Requests', icon: FiClock },
    { to: '/dashboard/lawyer/manage-legal-profile',  label: 'My Services',     icon: FiBriefcase },
    { to: '/dashboard/user/update-profile',          label: 'Update Profile',  icon: FiUser },
  ],
  admin: [
    { to: '/dashboard',                        label: 'Overview',        icon: FiHome,         exact: true },
    { to: '/dashboard/admin/manage-users',     label: 'Manage Users',    icon: FiUsers },
    { to: '/dashboard/admin/all-transactions', label: 'Transactions',    icon: FiDollarSign },
    { to: '/dashboard/admin/analytics',        label: 'Analytics',       icon: FiBarChart2 },
  ],
}

export default function DashboardLayout() {
  const { dbUser, logout } = useAuth()
  const navigate           = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const role  = dbUser?.role || 'user'
  const links = navByRole[role] || navByRole.user

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  const Sidebar = ({ mobile = false }) => (
    <aside style={{
      width: collapsed && !mobile ? 72 : 260,
      minHeight: mobile ? 'auto' : '100vh',
      background: 'var(--navy-mid)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding:'1.25rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', overflow:'hidden' }}>
          <GiScales size={22} style={{ color:'var(--gold)', flexShrink:0 }} />
          {(!collapsed || mobile) && <span style={{ fontFamily:'var(--font-display)', color:'var(--white)', fontWeight:700, fontSize:'1.15rem', whiteSpace:'nowrap' }}>LegalEase</span>}
        </div>
        {!mobile && (
          <button onClick={() => setCollapsed(c => !c)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>
            {collapsed ? <FiMenu size={18} /> : <FiX size={18} />}
          </button>
        )}
      </div>

      {/* User info */}
      {(!collapsed || mobile) && (
        <div style={{ padding:'1.25rem', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <img src={dbUser?.photo || `https://ui-avatars.com/api/?name=${dbUser?.name}&background=C9922A&color=fff`}
              alt="avatar" style={{ width:42, height:42, borderRadius:'50%', border:'2px solid var(--gold)', objectFit:'cover', flexShrink:0 }} />
            <div style={{ overflow:'hidden' }}>
              <p style={{ color:'var(--white)', fontWeight:600, fontSize:'0.92rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{dbUser?.name}</p>
              <span className="badge badge-gold" style={{ fontSize:'0.72rem', marginTop:'0.2rem', display:'inline-block' }}>{role.charAt(0).toUpperCase()+role.slice(1)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav style={{ flex:1, padding:'0.75rem 0.75rem', display:'flex', flexDirection:'column', gap:'0.25rem' }}>
        {links.map(({ to, label, icon: Icon, exact }) => (
          <NavLink key={to} to={to} end={exact}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'0.75rem',
              padding: collapsed && !mobile ? '0.75rem' : '0.7rem 0.9rem',
              justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
              borderRadius: 8, textDecoration:'none', transition:'all 0.2s',
              background: isActive ? 'rgba(201,146,42,0.18)' : 'transparent',
              color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.7)',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.9rem',
            })}
            title={collapsed && !mobile ? label : undefined}
          >
            <Icon size={18} style={{ flexShrink:0 }} />
            {(!collapsed || mobile) && <span style={{ whiteSpace:'nowrap' }}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding:'0.75rem', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={handleLogout} style={{
          display:'flex', alignItems:'center', gap:'0.75rem',
          padding: collapsed && !mobile ? '0.75rem' : '0.7rem 0.9rem',
          justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
          width:'100%', borderRadius:8, background:'none', border:'none',
          color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:'0.9rem', transition:'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(197,48,48,0.15)'; e.currentTarget.style.color='#FC8181' }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='rgba(255,255,255,0.6)' }}
        >
          <FiLogOut size={18} />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--ivory)' }}>
      {/* Desktop sidebar */}
      <div className="desktop-sidebar"><Sidebar /></div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ x:-300 }} animate={{ x:0 }} exit={{ x:-300 }} transition={{ type:'spring', stiffness:300, damping:30 }}
            style={{ position:'fixed', top:0, left:0, zIndex:1000, height:'100vh' }}>
            <Sidebar mobile />
          </motion.div>
        )}
      </AnimatePresence>
      {mobileOpen && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:999 }} onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Mobile topbar */}
        <div style={{ display:'none', alignItems:'center', gap:'1rem', padding:'1rem 1.5rem', background:'var(--navy-mid)', borderBottom:'1px solid rgba(255,255,255,0.08)' }} className="mobile-topbar">
          <button onClick={() => setMobileOpen(true)} style={{ background:'none', border:'none', color:'var(--white)', cursor:'pointer' }}>
            <FiMenu size={22} />
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <GiScales size={20} style={{ color:'var(--gold)' }} />
            <span style={{ fontFamily:'var(--font-display)', color:'var(--white)', fontWeight:700 }}>LegalEase</span>
          </div>
        </div>

        <main style={{ flex:1, padding:'2rem', overflowY:'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media(max-width:768px) {
          .desktop-sidebar { display:none!important; }
          .mobile-topbar { display:flex!important; }
        }
      `}</style>
    </div>
  )
}
