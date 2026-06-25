import { Link } from 'react-router-dom'
import { FiStar, FiDollarSign } from 'react-icons/fi'
import { GiScales } from 'react-icons/gi'

export default function LawyerCard({ lawyer }) {
  return (
    <Link to={`/lawyers/${lawyer._id}`} style={{ display:'block', textDecoration:'none' }}>
      <div className="card" style={{ padding:0, overflow:'hidden', cursor:'pointer' }}>
        {/* Top banner */}
        <div style={{ height:5, background:'linear-gradient(90deg, var(--gold), var(--navy-mid))' }} />

        <div style={{ padding:'1.5rem' }}>
          <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1rem' }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <img
                src={lawyer.photo || `https://ui-avatars.com/api/?name=${lawyer.name}&background=152B54&color=C9922A&size=128`}
                alt={lawyer.name}
                style={{ width:72, height:72, borderRadius:10, objectFit:'cover', border:'2px solid var(--ivory-dark)' }}
              />
              {!lawyer.isAvailable && (
                <div style={{
                  position:'absolute', bottom:-6, left:'50%', transform:'translateX(-50%)',
                  background:'var(--red)', color:'white', fontSize:'0.65rem', fontWeight:700,
                  padding:'0.1rem 0.45rem', borderRadius:50, whiteSpace:'nowrap',
                }}>BUSY</div>
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <h3 style={{ fontSize:'1rem', marginBottom:'0.2rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lawyer.name}</h3>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.5rem' }}>
                <GiScales size={12} color="var(--gold)" />
                <span style={{ fontSize:'0.83rem', color:'var(--slate)' }}>{lawyer.specialization}</span>
              </div>
              <span className={`badge ${lawyer.isAvailable ? 'badge-green' : 'badge-red'}`}>
                {lawyer.isAvailable ? 'Available' : 'Busy'}
              </span>
            </div>
          </div>

          <p style={{ fontSize:'0.85rem', color:'var(--slate)', lineHeight:1.6, marginBottom:'1rem',
            overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
            {lawyer.bio || 'Experienced legal professional dedicated to providing exceptional counsel.'}
          </p>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'0.75rem', borderTop:'1px solid var(--ivory-dark)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
              <FiDollarSign size={14} color="var(--gold)" />
              <span style={{ fontWeight:700, color:'var(--navy)', fontSize:'1.05rem' }}>${lawyer.fee}</span>
              <span style={{ fontSize:'0.78rem', color:'var(--slate)' }}>/hr</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
              <FiStar size={12} color="var(--gold)" fill="var(--gold)" />
              <span style={{ fontSize:'0.85rem', color:'var(--slate)' }}>{lawyer.totalHires || 0} hires</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
