import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiMessageSquare, FiEdit, FiBriefcase, FiUsers, FiDollarSign, FiBarChart2 } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const userLinks = [
  { to:'/dashboard/user/hiring-history',  label:'Hiring History',  icon: FiClock,         desc:'Track your lawyer requests' },
  { to:'/dashboard/user/comments',        label:'My Comments',     icon: FiMessageSquare, desc:'Manage your reviews' },
  { to:'/dashboard/user/update-profile',  label:'Update Profile',  icon: FiEdit,          desc:'Edit your information' },
]
const lawyerLinks = [
  { to:'/dashboard/lawyer/hiring-history',       label:'Hiring Requests', icon: FiClock,        desc:'View client requests' },
  { to:'/dashboard/lawyer/manage-legal-profile', label:'My Services',     icon: FiBriefcase,    desc:'Edit your listing' },
  { to:'/dashboard/user/update-profile',         label:'Update Profile',  icon: FiEdit,         desc:'Edit your information' },
]
const adminLinks = [
  { to:'/dashboard/admin/manage-users',      label:'Manage Users',   icon: FiUsers,       desc:'View & manage all users' },
  { to:'/dashboard/admin/all-transactions',  label:'Transactions',   icon: FiDollarSign,  desc:'View all payments' },
  { to:'/dashboard/admin/analytics',         label:'Analytics',      icon: FiBarChart2,   desc:'Platform insights' },
]

export default function DashboardHome() {
  const { user, dbUser } = useAuth()
  const role = dbUser?.role || 'user'
  const links = role === 'admin' ? adminLinks : role === 'lawyer' ? lawyerLinks : userLinks

  return (
    <div>
      {/* Welcome banner */}
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        style={{ background:'linear-gradient(135deg, var(--navy-mid), var(--navy-light))', borderRadius:16, padding:'2rem', marginBottom:'2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, opacity:0.05, pointerEvents:'none' }}>
          <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', flexWrap:'wrap' }}>
          <img
            src={dbUser?.photo || user?.photoURL || `https://ui-avatars.com/api/?name=${dbUser?.name || 'User'}&background=C9922A&color=fff&size=128`}
            alt="avatar" style={{ width:72, height:72, borderRadius:'50%', border:'3px solid var(--gold)', objectFit:'cover', flexShrink:0 }}
          />
          <div>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.88rem', marginBottom:'0.25rem' }}>Welcome back 👋</p>
            <h2 style={{ color:'var(--white)', fontSize:'1.7rem', margin:0 }}>{dbUser?.name || user?.displayName}</h2>
            <span className="badge badge-gold" style={{ marginTop:'0.4rem', display:'inline-block' }}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </div>
          <div style={{ marginLeft:'auto' }}>
            <Link to="/dashboard/user/update-profile" className="btn btn-outline btn-sm" style={{ color:'var(--white)', borderColor:'rgba(255,255,255,0.3)' }}>
              <FiEdit size={14} /> Edit Profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick nav cards */}
      <h3 style={{ marginBottom:'1.25rem', color:'var(--navy)' }}>Quick Actions</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'1rem' }}>
        {links.map(({ to, label, icon:Icon, desc }, i) => (
          <motion.div key={to} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.08 }}>
            <Link to={to} style={{ display:'block', textDecoration:'none' }}>
              <div className="card" style={{ padding:'1.5rem', cursor:'pointer' }}>
                <div style={{ width:44, height:44, borderRadius:10, background:'var(--gold-muted)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
                  <Icon size={20} color="var(--gold)" />
                </div>
                <h4 style={{ marginBottom:'0.3rem', color:'var(--navy)' }}>{label}</h4>
                <p style={{ color:'var(--slate)', fontSize:'0.85rem', margin:0 }}>{desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
