import { useEffect, useState } from 'react'
import { FiUsers, FiTrash2, FiChevronDown } from 'react-icons/fi'
import axiosInstance from '../../../utils/axiosInstance'
import { useAuth } from '../../../context/AuthContext'
import toast from 'react-hot-toast'

const ROLES = ['user', 'lawyer', 'admin']
const roleColors = { user:'badge-navy', lawyer:'badge-gold', admin:'badge-red' }

export default function ManageUsers() {
  const { dbUser }         = useAuth()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    axiosInstance.get('/api/admin/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false))
  }, [])

  const changeRole = async (userId, newRole) => {
    try {
      await axiosInstance.patch(`/api/admin/users/${userId}/role`, { role: newRole })
      setUsers(us => us.map(u => u._id === userId ? { ...u, role: newRole } : u))
      toast.success('Role updated')
    } catch { toast.error('Failed to update role') }
  }

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return
    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`)
      setUsers(us => us.filter(u => u._id !== userId))
      toast.success('User deleted')
    } catch { toast.error('Failed to delete user') }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner" /></div>

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ marginBottom:'0.35rem' }}>Manage Users</h2>
        <p style={{ color:'var(--slate)' }}>{users.length} registered users on the platform</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { label:'Total Users',   value: users.filter(u=>u.role==='user').length,   color:'var(--navy)' },
          { label:'Total Lawyers', value: users.filter(u=>u.role==='lawyer').length, color:'var(--gold)' },
          { label:'Admins',        value: users.filter(u=>u.role==='admin').length,  color:'var(--red)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:'var(--white)', borderRadius:12, padding:'1.25rem', border:'1px solid var(--ivory-dark)', textAlign:'center' }}>
            <div style={{ fontSize:'1.8rem', fontWeight:700, color, fontFamily:'var(--font-display)' }}>{value}</div>
            <div style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom:'1.25rem' }}>
        <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…" style={{ maxWidth:360 }} />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <img src={u.photo || `https://ui-avatars.com/api/?name=${u.name}&background=152B54&color=C9922A`}
                      alt="" style={{ width:36, height:36, borderRadius:8, objectFit:'cover' }} />
                    <span style={{ fontWeight:600 }}>{u.name}</span>
                    {u._id === dbUser?._id && <span className="badge badge-gold" style={{ fontSize:'0.7rem' }}>You</span>}
                  </div>
                </td>
                <td style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{u.email}</td>
                <td>
                  <div style={{ position:'relative', display:'inline-block' }}>
                    <select
                      value={u.role}
                      onChange={e => changeRole(u._id, e.target.value)}
                      disabled={u._id === dbUser?._id}
                      style={{
                        appearance:'none', padding:'0.35rem 1.75rem 0.35rem 0.75rem', borderRadius:6, border:'none',
                        fontWeight:600, fontSize:'0.82rem', cursor:'pointer',
                        background: u.role==='admin' ? '#FED7D7' : u.role==='lawyer' ? 'var(--gold-muted)' : 'rgba(21,43,84,0.1)',
                        color: u.role==='admin' ? 'var(--red)' : u.role==='lawyer' ? 'var(--gold)' : 'var(--navy-mid)',
                        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%234A5568' d='M5 7L1 3h8z'/%3E%3C/svg%3E\")",
                        backgroundRepeat:'no-repeat', backgroundPosition:'right 0.5rem center',
                      }}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                    </select>
                  </div>
                </td>
                <td style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u._id !== dbUser?._id && (
                    <button className="btn btn-sm" style={{ background:'#FED7D7', color:'var(--red)', border:'none' }}
                      onClick={() => deleteUser(u._id)}>
                      <FiTrash2 size={13} /> Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'3rem', color:'var(--slate)' }}>No users found.</div>
        )}
      </div>
    </div>
  )
}
