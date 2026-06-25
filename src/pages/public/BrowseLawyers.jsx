import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import axiosInstance from '../../utils/axiosInstance'
import LawyerCard from '../../components/shared/LawyerCard'

const SPECIALIZATIONS = ['All','Criminal Law','Corporate Law','Family Law','Real Estate','Immigration','Intellectual Property','Employment','Tax Law','Civil Litigation']

export default function BrowseLawyers() {
  const [params, setParams] = useSearchParams()

  const [lawyers, setLawyers]   = useState([])
  const [total,   setTotal]     = useState(0)
  const [loading, setLoading]   = useState(true)
  const [page,    setPage]      = useState(1)
  const limit = 9

  const [search,   setSearch]   = useState(params.get('search') || '')
  const [category, setCategory] = useState(params.get('category') || 'All')
  const [minFee,   setMinFee]   = useState('')
  const [maxFee,   setMaxFee]   = useState('')
  const [avail,    setAvail]    = useState('')
  const [sort,     setSort]     = useState('latest')

  const fetchLawyers = () => {
    setLoading(true)
    const q = new URLSearchParams({
      page, limit,
      ...(search && { search }),
      ...(category && category !== 'All' && { specialization: category }),
      ...(minFee && { minFee }),
      ...(maxFee && { maxFee }),
      ...(avail && { isAvailable: avail }),
      sort,
    })
    axiosInstance.get(`/api/lawyers?${q}`)
      .then(({ data }) => { setLawyers(data.lawyers || []); setTotal(data.total || 0) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLawyers() }, [page, sort, category, avail])
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchLawyers() }

  const clearFilters = () => {
    setSearch(''); setCategory('All'); setMinFee(''); setMaxFee(''); setAvail(''); setPage(1)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Page Header */}
      <div style={{ background:'linear-gradient(135deg, #0B1D3A, #152B54)', padding:'3rem 0 2rem' }}>
        <div className="container">
          <h1 style={{ color:'var(--white)', marginBottom:'0.5rem' }}>Browse Lawyers</h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'1.05rem' }}>
            {total} verified legal professionals ready to help
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:'2rem', alignItems:'start' }}>

          {/* ── Filters Sidebar ── */}
          <aside style={{ background:'var(--white)', borderRadius:12, padding:'1.5rem', border:'1px solid var(--ivory-dark)', position:'sticky', top:90 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h3 style={{ fontSize:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}><FiFilter /> Filters</h3>
              <button onClick={clearFilters} style={{ background:'none', border:'none', color:'var(--slate)', cursor:'pointer', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:'0.25rem' }}>
                <FiX size={13} /> Clear
              </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ marginBottom:'1.5rem' }}>
              <label className="form-label">Search</label>
              <div style={{ position:'relative' }}>
                <FiSearch style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
                <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Name or specialization" style={{ paddingLeft:'2.5rem' }} />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ width:'100%', marginTop:'0.5rem', justifyContent:'center' }}>Search</button>
            </form>

            {/* Category */}
            <div style={{ marginBottom:'1.5rem' }}>
              <label className="form-label">Specialization</label>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
                {SPECIALIZATIONS.map(s => (
                  <button key={s} onClick={() => { setCategory(s); setPage(1) }} style={{
                    padding:'0.5rem 0.75rem', borderRadius:6, border:'none', textAlign:'left', cursor:'pointer', fontSize:'0.88rem', transition:'all 0.15s',
                    background: category === s ? 'var(--gold-muted)' : 'transparent',
                    color: category === s ? 'var(--gold)' : 'var(--slate)',
                    fontWeight: category === s ? 600 : 400,
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee range */}
            <div style={{ marginBottom:'1.5rem' }}>
              <label className="form-label">Fee Range ($/hr)</label>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                <input className="form-input" type="number" placeholder="Min" value={minFee} onChange={e => setMinFee(e.target.value)} />
                <input className="form-input" type="number" placeholder="Max" value={maxFee} onChange={e => setMaxFee(e.target.value)} />
              </div>
              <button className="btn btn-ghost btn-sm" style={{ width:'100%', marginTop:'0.5rem', justifyContent:'center' }}
                onClick={() => { setPage(1); fetchLawyers() }}>Apply</button>
            </div>

            {/* Availability */}
            <div>
              <label className="form-label">Availability</label>
              <select className="form-input form-select" value={avail} onChange={e => { setAvail(e.target.value); setPage(1) }}>
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Busy</option>
              </select>
            </div>
          </aside>

          {/* ── Results Grid ── */}
          <div>
            {/* Sort bar */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
              <p style={{ color:'var(--slate)', fontSize:'0.92rem' }}>
                Showing <strong style={{ color:'var(--navy)' }}>{lawyers.length}</strong> of <strong style={{ color:'var(--navy)' }}>{total}</strong> lawyers
              </p>
              <select className="form-input form-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
                style={{ width:'auto', padding:'0.5rem 2.5rem 0.5rem 0.9rem' }}>
                <option value="latest">Newest First</option>
                <option value="hires">Most Hired</option>
                <option value="fee_asc">Fee: Low to High</option>
                <option value="fee_desc">Fee: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
                {[...Array(6)].map((_,i) => (
                  <div key={i} className="card" style={{ padding:'1.5rem' }}>
                    <div className="skeleton" style={{ width:72, height:72, borderRadius:10, marginBottom:'1rem' }} />
                    <div className="skeleton" style={{ height:18, marginBottom:'0.5rem' }} />
                    <div className="skeleton" style={{ height:14, width:'60%', marginBottom:'1rem' }} />
                    <div className="skeleton" style={{ height:50 }} />
                  </div>
                ))}
              </div>
            ) : lawyers.length === 0 ? (
              <div style={{ textAlign:'center', padding:'5rem 2rem', background:'var(--white)', borderRadius:16, border:'1px solid var(--ivory-dark)' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>⚖️</div>
                <h3 style={{ marginBottom:'0.5rem' }}>No lawyers found</h3>
                <p style={{ color:'var(--slate)', marginBottom:'1.5rem' }}>Try adjusting your search or filter criteria.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
                {lawyers.map(lawyer => <LawyerCard key={lawyer._id} lawyer={lawyer} />)}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', marginTop:'2rem' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page === 1}>
                  <FiChevronLeft />
                </button>
                {[...Array(totalPages)].map((_,i) => (
                  <button key={i} onClick={() => setPage(i+1)} className={`btn btn-sm ${page===i+1 ? 'btn-primary' : 'btn-ghost'}`}>
                    {i+1}
                  </button>
                ))}
                <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){ .container > div { grid-template-columns:1fr!important; } aside { position:static!important; } }`}</style>
    </div>
  )
}
