import { useEffect, useRef } from 'react';
import { Link } from 'react-router';

const C = {
  black:    '#0A0A0A',
  orange:   '#E8601C',
  offWhite: '#F5F3EF',
  card:     '#FDFCFA',
  border:   '#E2DED9',
  textGray: '#7A7470',
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

  .tm-card {
    background: ${C.card};
    border: 1.5px solid ${C.border};
    transition: border-color 0.25s;
    padding: 28px;
    display: flex;
    flex-direction: row;
    gap: 24px;
    align-items: stretch;
  }
  .tm-card:hover { border-color: ${C.orange}; }

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
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .tm-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
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
      { threshold: 0.15 }
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
    title: 'CEO & Co-Founder',
    photo: '/aiden.png',
    bio: 'Aiden is studying Computer Engineering at Georgia Tech, where he researches bipedal robotics and autonomous navigation. He has won multiple hackathons, building real-time telemetry systems and multi-API integrations. He also brings experience in scaling businesses, marketing, and customer discovery.',
  },
  {
    name: 'Taran Govindu',
    title: 'CTO & Co-Founder',
    photo: '/taran.png',
    bio: 'Taran is studying Aerospace Engineering at Georgia Tech, where he researches AI-accelerated simulation. He has built neural networks for exoplanet detection and medical diagnostics achieving 98%+ accuracy, published peer-reviewed research with over 5,000 reads, and designed rocket propulsion systems and simulations.',
  },
];

function FounderCard({ founder, delay }: { founder: Founder; delay: number }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="tm-reveal tm-card">
      {/* min-height:0 stops the wrapper from inflating the cross-axis with the img's intrinsic size */}
      <div style={{ flexShrink: 0, minHeight: 0, overflow: 'hidden' }}>
        <img
          src={founder.photo}
          alt={founder.name}
          style={{
            height: '100%',
            width: 'auto',
            display: 'block',
            borderRadius: 4,
            border: `2px solid ${C.orange}`,
          }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: C.black }}>
          {founder.name}
        </h3>
        <p style={{
          margin: '0 0 14px',
          fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.1em', color: C.orange,
        }}>
          {founder.title}
        </p>
        <p style={{
          margin: 0,
          fontSize: 13,
          color: C.textGray,
          lineHeight: 1.75,
        }}>
          {founder.bio}
        </p>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const heroRef    = useReveal(0);
  const labelRef   = useReveal(80);
  const taglineRef = useReveal(160);

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', overflowX: 'hidden' }}>
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

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 22, flexShrink: 0 }}>
          <Link to="/waitlist" className="tm-nav-signup">Join the Waitlist</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: C.black,
        padding: '100px 48px 80px',
        textAlign: 'center',
      }}>
        <div ref={labelRef} className="tm-reveal" style={{
          display: 'inline-block',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: C.orange,
          marginBottom: 24,
        }}>
          The People Behind Verus
        </div>

        <div ref={heroRef} className="tm-reveal" style={{ transitionDelay: '80ms' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800, color: '#F0EDE8',
            margin: '0 0 20px',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}>
            The Team
          </h1>
        </div>

        <div ref={taglineRef} className="tm-reveal" style={{ transitionDelay: '160ms' }}>
          <p style={{
            fontSize: 17, color: 'rgba(240,237,232,0.6)',
            maxWidth: 560, margin: '0 auto',
            lineHeight: 1.65, fontStyle: 'italic',
          }}>
            Met at Georgia Tech building an inspection drone. Realized the real problem was the data analysis.
          </p>
        </div>
      </section>

      {/* ── Founders ── */}
      <section style={{
        background: C.offWhite,
        padding: '80px 48px 96px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 24,
          }}>
            {FOUNDERS.map((founder, i) => (
              <FounderCard key={founder.name} founder={founder} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: C.black,
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
