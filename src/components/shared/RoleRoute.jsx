import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RoleRoute({ children, roles }) {
  const { dbUser, loading } = useAuth()

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
      <div className="spinner" />
    </div>
  )

  if (!dbUser || !roles.includes(dbUser.role)) return <Navigate to="/dashboard" replace />
  return children
}
