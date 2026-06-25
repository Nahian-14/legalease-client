import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import { FiUsers, FiBriefcase, FiDollarSign, FiFileText } from 'react-icons/fi'
import axiosInstance from '../../../utils/axiosInstance'

const COLORS = ['#C9922A', '#0B1D3A', '#276749', '#553C9A']

export default function Analytics() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get('/api/admin/analytics').then(({ data }) => setStats(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner" /></div>

  const cards = [
    { label:'Total Users',   value: stats?.totalUsers   || 0, icon: FiUsers,     color:'var(--navy-mid)', bg:'rgba(21,43,84,0.08)' },
    { label:'Total Lawyers', value: stats?.totalLawyers || 0, icon: FiBriefcase,  color:'var(--gold)',    bg:'var(--gold-muted)' },
    { label:'Total Hires',   value: stats?.totalHires   || 0, icon: FiFileText,   color:'var(--green)',   bg:'var(--green-light)' },
    { label:'Total Revenue', value:`$${(stats?.totalRevenue||0).toFixed(2)}`, icon: FiDollarSign, color:'#7B2D8B', bg:'#FAF5FF' },
  ]

  const pieData = [
    { name:'Users',   value: stats?.totalUsers   || 0 },
    { name:'Lawyers', value: stats?.totalLawyers || 0 },
  ]

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ marginBottom:'0.35rem' }}>Analytics Overview</h2>
        <p style={{ color:'var(--slate)' }}>Platform performance at a glance</p>
      </div>

      {/* KPI cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.25rem', marginBottom:'2.5rem' }}>
        {cards.map(({ label, value, icon:Icon, color, bg }) => (
          <div key={label} style={{ background:'var(--white)', borderRadius:14, padding:'1.5rem', border:'1px solid var(--ivory-dark)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:color }} />
            <div style={{ width:46, height:46, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
              <Icon size={22} color={color} />
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:700, color:'var(--navy)', marginBottom:'0.25rem' }}>{value}</div>
            <div style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', marginBottom:'1.5rem' }}>
        {/* Monthly hires bar chart */}
        <div style={{ background:'var(--white)', borderRadius:14, padding:'1.75rem', border:'1px solid var(--ivory-dark)' }}>
          <h4 style={{ marginBottom:'1.5rem' }}>Monthly Hires</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.monthlyHires || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ivory-dark)" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--slate)' }} />
              <YAxis tick={{ fontSize:12, fill:'var(--slate)' }} />
              <Tooltip contentStyle={{ borderRadius:8, border:'1px solid var(--ivory-dark)', fontFamily:'var(--font-body)' }} />
              <Bar dataKey="count" fill="var(--gold)" radius={[4,4,0,0]} name="Hires" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User distribution pie */}
        <div style={{ background:'var(--white)', borderRadius:14, padding:'1.75rem', border:'1px solid var(--ivory-dark)' }}>
          <h4 style={{ marginBottom:'1.5rem' }}>User Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius:8, border:'1px solid var(--ivory-dark)' }} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue line chart */}
      <div style={{ background:'var(--white)', borderRadius:14, padding:'1.75rem', border:'1px solid var(--ivory-dark)' }}>
        <h4 style={{ marginBottom:'1.5rem' }}>Monthly Revenue ($)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={stats?.monthlyRevenue || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ivory-dark)" />
            <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--slate)' }} />
            <YAxis tick={{ fontSize:12, fill:'var(--slate)' }} />
            <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} contentStyle={{ borderRadius:8, border:'1px solid var(--ivory-dark)', fontFamily:'var(--font-body)' }} />
            <Line type="monotone" dataKey="total" stroke="var(--gold)" strokeWidth={2.5} dot={{ fill:'var(--gold)', r:4 }} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <style>{`@media(max-width:900px){ 
        div[style*="repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr)!important; }
        div[style*="2fr 1fr"] { grid-template-columns: 1fr!important; }
      }`}</style>
    </div>
  )
}
