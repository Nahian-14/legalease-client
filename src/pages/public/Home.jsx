import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiSearch, FiStar, FiShield, FiClock, FiUsers } from 'react-icons/fi'
import { GiScales, GiGavel } from 'react-icons/gi'
import axiosInstance from '../../utils/axiosInstance'
import LawyerCard from '../../components/shared/LawyerCard'

const categories = [
  { label:'Criminal Law',     emoji:'⚖️', color:'#C53030' },
  { label:'Corporate Law',    emoji:'🏢', color:'#2B6CB0' },
  { label:'Family Law',       emoji:'👨‍👩‍👧', color:'#276749' },
  { label:'Real Estate',      emoji:'🏠', color:'#C9922A' },
  { label:'Immigration',      emoji:'✈️', color:'#553C9A' },
  { label:'Intellectual Property', emoji:'💡', color:'#B7791F' },
  { label:'Employment',       emoji:'💼', color:'#2C7A7B' },
  { label:'Tax Law',          emoji:'📊', color:'#2D3748' },
]

const stats = [
  { value:'2,400+', label:'Verified Lawyers', icon: FiUsers },
  { value:'18,000+', label:'Cases Resolved',  icon: GiGavel },
  { value:'4.9★',    label:'Average Rating',   icon: FiStar },
  { value:'150+',    label:'Specializations',  icon: FiShield },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity:0, y:30 },
  show:   { opacity:1, y:0, transition: { duration:0.5, ease:[0.22,1,0.36,1] } },
}

export default function Home() {
  const navigate = useNavigate()
  const [search,   setSearch]   = useState('')
  const [featured, setFeatured] = useState([])
  const [topHired, setTopHired] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/api/lawyers?limit=6&sort=latest'),
      axiosInstance.get('/api/lawyers?limit=3&sort=hires'),
    ]).then(([f, t]) => {
      setFeatured(f.data.lawyers || [])
      setTopHired(t.data.lawyers || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/browse-lawyers?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, #0B1D3A 0%, #152B54 50%, #1a2f5e 100%)`,
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
        paddingTop: 80,
      }}>
        {/* Decorative elements */}
        <div style={{ position:'absolute', top:'15%', right:'5%', opacity:0.04, pointerEvents:'none' }}>
          <GiScales size={400} color="white" />
        </div>
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:120,
          background:'linear-gradient(to top, var(--ivory), transparent)',
        }} />
        {/* Gold accent orb */}
        <div style={{
          position:'absolute', top:'30%', right:'20%', width:300, height:300,
          background:'radial-gradient(circle, rgba(201,146,42,0.15) 0%, transparent 70%)',
          borderRadius:'50%', pointerEvents:'none',
        }} />

        <div className="container" style={{ position:'relative', zIndex:1, padding:'4rem 1.5rem' }}>
          <div style={{ maxWidth:720 }}>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(201,146,42,0.15)', border:'1px solid rgba(201,146,42,0.3)', borderRadius:50, padding:'0.4rem 1rem', marginBottom:'1.5rem' }}>
                <GiScales size={14} color="var(--gold)" />
                <span style={{ color:'var(--gold)', fontSize:'0.82rem', fontWeight:500, letterSpacing:'0.05em', fontFamily:'var(--font-mono)' }}>Trusted Legal Marketplace</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              style={{ color:'var(--white)', marginBottom:'1.5rem', lineHeight:1.1 }}
            >
              Find & Hire{' '}
              <span style={{ color:'var(--gold)', display:'block' }}>Expert Legal Counsel</span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              style={{ fontSize:'1.15rem', color:'rgba(248,245,239,0.75)', marginBottom:'2.5rem', maxWidth:560, lineHeight:1.8 }}
            >
              Connect with verified lawyers across 150+ specializations. Get expert legal advice and representation — transparently priced, available now.
            </motion.p>

            {/* Search bar */}
            <motion.form onSubmit={handleSearch}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              style={{ display:'flex', gap:'0.75rem', marginBottom:'2rem', flexWrap:'wrap' }}
            >
              <div style={{ flex:1, minWidth:280, position:'relative' }}>
                <FiSearch style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.4)' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by specialization or lawyer name…"
                  style={{
                    width:'100%', padding:'1rem 1rem 1rem 2.75rem',
                    background:'rgba(255,255,255,0.1)', border:'2px solid rgba(255,255,255,0.2)',
                    borderRadius:10, color:'var(--white)', fontSize:'1rem',
                    outline:'none', fontFamily:'var(--font-body)',
                    transition:'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor='var(--gold)'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.2)'}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ flexShrink:0 }}>
                Search <FiArrowRight />
              </button>
            </motion.form>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {['Criminal', 'Corporate', 'Family', 'Immigration'].map(cat => (
                <button key={cat} onClick={() => navigate(`/browse-lawyers?category=${cat}`)}
                  style={{ padding:'0.35rem 0.9rem', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:50, color:'rgba(255,255,255,0.75)', fontSize:'0.85rem', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--gold)'; e.currentTarget.style.color='white'; e.currentTarget.style.borderColor='var(--gold)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)' }}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────── */}
      <section style={{ background:'var(--white)', padding:'2.5rem 0', borderBottom:'1px solid var(--ivory-dark)' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem' }}>
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:44, height:44, borderRadius:10, background:'var(--gold-muted)', marginBottom:'0.5rem' }}>
                  <Icon size={20} color="var(--gold)" />
                </div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:700, color:'var(--navy)' }}>{value}</div>
                <div style={{ fontSize:'0.88rem', color:'var(--slate)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.container > div { grid-template-columns: repeat(2,1fr)!important; }}`}</style>
      </section>

      {/* ── Featured Lawyers ─────────────────────────── */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="text-center" style={{ marginBottom:'3rem' }}>
            <p className="section-eyebrow">Handpicked Professionals</p>
            <h2 className="section-title">Featured Lawyers</h2>
            <div className="accent-line" style={{ margin:'1rem auto' }} />
            <p className="section-subtitle" style={{ margin:'0 auto', color:'var(--slate)' }}>
              Browse our latest additions — each lawyer is independently verified before listing.
            </p>
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card" style={{ padding:'1.5rem' }}>
                  <div className="skeleton" style={{ width:80, height:80, borderRadius:'50%', marginBottom:'1rem' }} />
                  <div className="skeleton" style={{ height:20, marginBottom:'0.5rem' }} />
                  <div className="skeleton" style={{ height:16, width:'60%' }} />
                </div>
              ))}
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}
              style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.5rem' }}>
              {featured.map(lawyer => (
                <motion.div key={lawyer._id} variants={fadeUp}>
                  <LawyerCard lawyer={lawyer} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
            <Link to="/browse-lawyers" className="btn btn-outline btn-lg">
              View All Lawyers <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Top Legal Experts ────────────────────────── */}
      {topHired.length > 0 && (
        <section className="section" style={{ background:'var(--navy-mid)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom:'3rem' }}>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.78rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.5rem' }}>Most Trusted</p>
              <h2 style={{ color:'var(--white)' }}>Top Legal Experts</h2>
              <div className="accent-line" style={{ margin:'1rem auto' }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem' }}>
              {topHired.map((lawyer, i) => (
                <motion.div key={lawyer._id} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} transition={{ delay:i*0.15 }} viewport={{ once:true }}>
                  <Link to={`/lawyers/${lawyer._id}`} style={{ display:'block' }}>
                    <div style={{
                      background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                      borderRadius:16, padding:'2rem', textAlign:'center', transition:'all 0.3s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(201,146,42,0.12)'; e.currentTarget.style.borderColor='rgba(201,146,42,0.4)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)' }}
                    >
                      <div style={{ position:'relative', display:'inline-block', marginBottom:'1rem' }}>
                        <img src={lawyer.photo} alt={lawyer.name} style={{ width:90, height:90, borderRadius:'50%', objectFit:'cover', border:'3px solid var(--gold)' }} />
                        <div style={{ position:'absolute', bottom:-4, right:-4, background:'var(--gold)', color:'white', borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem' }}>#{i+1}</div>
                      </div>
                      <h3 style={{ color:'var(--white)', marginBottom:'0.25rem', fontSize:'1.1rem' }}>{lawyer.name}</h3>
                      <p style={{ color:'var(--gold)', fontSize:'0.88rem', marginBottom:'0.5rem' }}>{lawyer.specialization}</p>
                      <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.82rem' }}>{lawyer.totalHires || 0} clients served</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Legal Categories ────────────────────────── */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="text-center" style={{ marginBottom:'3rem' }}>
            <p className="section-eyebrow">Practice Areas</p>
            <h2 className="section-title">Legal Categories</h2>
            <div className="accent-line" style={{ margin:'1rem auto' }} />
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}
            style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
            {categories.map(({ label, emoji, color }) => (
              <motion.div key={label} variants={fadeUp}>
                <Link to={`/browse-lawyers?category=${encodeURIComponent(label)}`}
                  style={{ display:'block', background:'var(--white)', borderRadius:12, padding:'1.75rem 1.25rem', textAlign:'center', border:'1px solid var(--ivory-dark)', transition:'all 0.25s', textDecoration:'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 32px ${color}22` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--ivory-dark)'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}
                >
                  <div style={{ fontSize:'2.2rem', marginBottom:'0.75rem' }}>{emoji}</div>
                  <div style={{ fontWeight:600, color:'var(--navy)', fontSize:'0.92rem' }}>{label}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <style>{`@media(max-width:768px){.container > div { grid-template-columns: repeat(2,1fr)!important; }}`}</style>
      </section>

      {/* ── CTA Banner ─────────────────────────────── */}
      <section style={{ background:'linear-gradient(135deg, var(--gold) 0%, #B8821F 100%)', padding:'5rem 0' }}>
        <div className="container text-center">
          <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}>
            <h2 style={{ color:'var(--white)', marginBottom:'1rem' }}>Ready to Find Your Lawyer?</h2>
            <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'1.1rem', marginBottom:'2rem', maxWidth:500, margin:'0 auto 2rem' }}>
              Join thousands of clients who have resolved their legal matters through LegalEase.
            </p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/browse-lawyers" className="btn" style={{ background:'var(--white)', color:'var(--gold)', border:'none', fontWeight:700 }}>
                Browse Lawyers <FiArrowRight />
              </Link>
              <Link to="/register" className="btn" style={{ background:'transparent', color:'var(--white)', border:'2px solid rgba(255,255,255,0.6)' }}>
                Join as Lawyer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
