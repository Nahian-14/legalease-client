import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GiScales } from 'react-icons/gi'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--ivory)', padding:'2rem' }}>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', maxWidth:520 }}>
        <GiScales size={70} color="var(--gold)" style={{ marginBottom:'1.5rem', opacity:0.7 }} />
        <h1 style={{ fontSize:'6rem', fontFamily:'var(--font-display)', color:'var(--navy)', lineHeight:1, marginBottom:'0.5rem' }}>404</h1>
        <h2 style={{ marginBottom:'1rem', color:'var(--navy)' }}>Page Not Found</h2>
        <p style={{ color:'var(--slate)', marginBottom:'2rem', lineHeight:1.8 }}>
          The page you're looking for doesn't exist or has been moved. Let us help you find your way back.
        </p>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/" className="btn btn-primary"><FiArrowLeft /> Back to Home</Link>
          <Link to="/browse-lawyers" className="btn btn-outline">Browse Lawyers</Link>
        </div>
      </motion.div>
    </div>
  )
}
