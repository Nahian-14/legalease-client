import { Link } from 'react-router-dom'
import { GiScales } from 'react-icons/gi'
import { FiTwitter, FiLinkedin, FiFacebook, FiInstagram, FiMail } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer style={{ background:'var(--navy-mid)', color:'rgba(248,245,239,0.8)', paddingTop:'4rem' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1.5fr', gap:'3rem', paddingBottom:'3rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1rem' }}>
              <GiScales size={26} style={{ color:'var(--gold)' }} />
              <span style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'var(--white)' }}>
                Legal<span style={{ color:'var(--gold)' }}>Ease</span>
              </span>
            </div>
            <p style={{ fontSize:'0.92rem', lineHeight:1.8, maxWidth:280, color:'rgba(248,245,239,0.6)' }}>
              Connecting people with the legal expertise they need. Find trusted lawyers, get counsel, and resolve your legal matters with confidence.
            </p>
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem' }}>
              {[FiTwitter, FiLinkedin, FiFacebook, FiInstagram].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width:38, height:38, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
                  background:'rgba(255,255,255,0.08)', color:'rgba(248,245,239,0.7)',
                  transition:'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--gold)'; e.currentTarget.style.color='white' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(248,245,239,0.7)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color:'var(--white)', marginBottom:'1.25rem', fontSize:'0.85rem', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'var(--font-mono)' }}>Quick Links</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {[['/', 'Home'], ['/browse-lawyers', 'Browse Lawyers'], ['/login', 'Login'], ['/register', 'Register']].map(([to, label]) => (
                <Link key={to} to={to} style={{ color:'rgba(248,245,239,0.6)', fontSize:'0.9rem', transition:'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color='rgba(248,245,239,0.6)'}
                >{label}</Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color:'var(--white)', marginBottom:'1.25rem', fontSize:'0.85rem', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'var(--font-mono)' }}>Company</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service', 'FAQ'].map(item => (
                <a key={item} href="#" style={{ color:'rgba(248,245,239,0.6)', fontSize:'0.9rem', transition:'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color='rgba(248,245,239,0.6)'}
                >{item}</a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color:'var(--white)', marginBottom:'1.25rem', fontSize:'0.85rem', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'var(--font-mono)' }}>Stay Updated</h4>
            <p style={{ fontSize:'0.88rem', color:'rgba(248,245,239,0.6)', marginBottom:'1rem', lineHeight:1.7 }}>
              Get legal tips and platform updates delivered to your inbox.
            </p>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <input placeholder="Your email address" style={{
                flex:1, padding:'0.6rem 0.85rem', background:'rgba(255,255,255,0.08)',
                border:'1px solid rgba(255,255,255,0.15)', borderRadius:6, color:'var(--white)',
                fontSize:'0.88rem', outline:'none', fontFamily:'var(--font-body)',
              }} />
              <button className="btn btn-primary btn-sm" style={{ flexShrink:0 }}>
                <FiMail size={14} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', padding:'1.5rem 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <p style={{ fontSize:'0.85rem', color:'rgba(248,245,239,0.5)' }}>
            © {new Date().getFullYear()} LegalEase. All rights reserved.
          </p>
          <p style={{ fontSize:'0.85rem', color:'rgba(248,245,239,0.5)' }}>
            Crafted with care for justice ⚖️
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:768px) {
          footer > div > div:first-child { grid-template-columns: 1fr!important; }
        }
        @media(min-width:769px) and (max-width:1024px) {
          footer > div > div:first-child { grid-template-columns: 1fr 1fr!important; }
        }
      `}</style>
    </footer>
  )
}
