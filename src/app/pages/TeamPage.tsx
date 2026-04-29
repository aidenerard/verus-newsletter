import { useEffect, useRef } from 'react';
import { Link } from 'react-router';

const C = {
  black:    '#0A0A0A',
  orange:   '#E8601C',
  offWhite: '#F5F3EF',
  borderDk: 'rgba(255,255,255,0.09)',
};

const PAGE_CSS = `
  .tm-nav-link {
    position: relative;
    color: rgba(240,237,232,0.7);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.03em;
    padding-bottom: 2px;
    transition: color 0.2s;
  }
  .tm-nav-link::after {
    content: '';
    position: absolute;
    left: 0; bottom: 0;
    height: 1.5px;
    width: 0;
    background: ${C.orange};
    transition: width 0.25s ease;
  }
  .tm-nav-link:hover { color: #F0EDE8; }
  .tm-nav-link:hover::after { width: 100%; }

  .tm-nav-signup {
    display: inline-block;
    padding: 8px 20px;
    background: ${C.orange};
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    transition: transform 0.18s, background 0.18s;
  }
  .tm-nav-signup:hover { background: #D4521A; transform: translateY(-2px); }

  .tm-footer-link {
    color: rgba(240,237,232,0.5);
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s;
  }
  .tm-footer-link:hover { color: ${C.orange}; }

  .tm-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .tm-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 700px) {
    .tm-founder-row { flex-direction: column !important; }
    .tm-founder-photo { width: 100% !important; max-width: 280px !important; margin: 0 auto 32px !important; }
  }
`;

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('revealed'), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

interface Founder {
  name: string;
  title: string;
  photo: string;
  bio: string;
}

const FOUNDERS: Founder[] = [
  {
    name: 'Aiden Erard',
    title: 'CEO',
    photo: '/aiden.png',
    bio: 'Aiden is studying Computer Engineering at Georgia Tech, where he researches autonomy and robotics. He built GridGuard, an IoT energy resilience system with real-time telemetry, and developed an AI music app integrating five APIs in just 36 hours. He also scaled a lawn care business to five figures in three months before co-founding Verus.',
  },
  {
    name: 'Taran Govindu',
    title: 'CTO',
    photo: '/taran.png',
    bio: 'Taran is studying Aerospace Engineering at Georgia Tech, where he researches AI-accelerated simulation. He has built neural networks for exoplanet detection and medical diagnostics achieving 98%+ accuracy, published peer-reviewed research with over 5,000 reads, and designed rocket propulsion systems and simulations before co-founding Verus.',
  },
];

function FounderPanel({ founder, delay }: { founder: Founder; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="tm-reveal" style={{
      borderBottom: `1px solid ${C.borderDk}`,
      padding: '80px 48px',
    }}>
      <div className="tm-founder-row" style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 64,
        maxWidth: 1000,
        margin: '0 auto',
      }}>
        {/* Photo */}
        <div className="tm-founder-photo" style={{ flexShrink: 0, width: 220 }}>
          <img
            src={founder.photo}
            alt={founder.name}
            style={{
              width: '100%',
              aspectRatio: '3/4',
              objectFit: 'cover',
              objectPosition: 'top',
              display: 'block',
            }}
          />
        </div>

        {/* Text */}
        <div style={{ flex: 1, paddingTop: 8 }}>
          <h2 style={{
            margin: '0 0 10px',
            fontSize: 'clamp(40px, 5vw, 60px)',
            fontWeight: 800,
            color: '#F0EDE8',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
          }}>
            {founder.name}
          </h2>
          <p style={{
            margin: '0 0 32px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.orange,
          }}>
            {founder.title}
          </p>
          <p style={{
            margin: 0,
            fontSize: 17,
            color: 'rgba(240,237,232,0.65)',
            lineHeight: 1.75,
            maxWidth: 580,
          }}>
            {founder.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const heroRef = useReveal(0);
  const subRef  = useReveal(100);

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', overflowX: 'hidden', background: C.black, minHeight: '100vh' }}>
      <style>{PAGE_CSS}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: C.black,
        borderBottom: `1px solid ${C.borderDk}`,
        padding: '0 48px',
        height: 58,
        display: 'flex', alignItems: 'center',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <img src="/verus-logo.png" alt="Verus"
            style={{ width: 30, height: 30, objectFit: 'contain', display: 'block' }} />
          <span style={{ color: '#F0EDE8', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em' }}>
            VERUS
          </span>
        </Link>

        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex', alignItems: 'center', gap: 32,
        }}>
          <Link to="/" className="tm-nav-link">Home</Link>
          <Link to="/team" className="tm-nav-link" style={{ color: '#F0EDE8' }}>Team</Link>
        </div>

        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <Link to="/waitlist" className="tm-nav-signup">Join the Waitlist</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: '100px 48px 72px', borderBottom: `1px solid ${C.borderDk}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div ref={heroRef} className="tm-reveal">
            <p style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange }}>
              The People Behind Verus
            </p>
            <h1 style={{
              margin: '0 0 24px',
              fontSize: 'clamp(48px, 8vw, 88px)',
              fontWeight: 800,
              color: '#F0EDE8',
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
            }}>
              The Team
            </h1>
          </div>
          <div ref={subRef} className="tm-reveal">
            <p style={{
              margin: 0,
              fontSize: 18,
              color: 'rgba(240,237,232,0.5)',
              lineHeight: 1.65,
              fontStyle: 'italic',
              maxWidth: 560,
            }}>
              Met at Georgia Tech building an inspection drone. Realized the real problem was the data analysis.
            </p>
          </div>
        </div>
      </section>

      {/* ── Founders ── */}
      <section>
        {FOUNDERS.map((founder, i) => (
          <FounderPanel key={founder.name} founder={founder} delay={i * 100} />
        ))}
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: `1px solid ${C.borderDk}`,
        padding: '52px 48px',
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/verus-logo.png" alt="Verus"
              style={{ width: 28, height: 28, objectFit: 'contain', opacity: 0.8 }} />
            <span style={{ color: 'rgba(240,237,232,0.4)', fontSize: 12 }}>
              © {new Date().getFullYear()} Verus
            </span>
          </div>

          <div style={{ display: 'flex', gap: 28 }}>
            <Link to="/" className="tm-footer-link">Home</Link>
            <Link to="/team" className="tm-footer-link">Team</Link>
            <Link to="/waitlist" className="tm-footer-link">Join the Waitlist</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
