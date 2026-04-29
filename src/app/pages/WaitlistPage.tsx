import { useState } from 'react';
import { Link } from 'react-router';
import VerusLogo from '../components/VerusLogo';
import { supabase } from '../../lib/supabase';

const C = {
  black:    '#0A0A0A',
  orange:   '#E8601C',
  orangeDk: '#D4521A',
  offWhite: '#F5F3EF',
  border:   '#E2DED9',
  textGray: '#7A7470',
  borderDk: 'rgba(255,255,255,0.09)',
};

const PAGE_CSS = `
  .wl-nav-inner {
    display: flex; align-items: center;
    width: 100%; height: 58px;
    padding: 0 48px;
  }
  .wl-nav-link {
    position: relative;
    color: rgba(240,237,232,0.7);
    text-decoration: none;
    font-size: 13px; font-weight: 500;
    letter-spacing: 0.03em; padding-bottom: 2px;
    transition: color 0.2s;
  }
  .wl-nav-link::after {
    content: '';
    position: absolute; left: 0; bottom: 0;
    height: 1.5px; width: 0;
    background: ${C.orange};
    transition: width 0.25s ease;
  }
  .wl-nav-link:hover { color: #F0EDE8; }
  .wl-nav-link:hover::after { width: 100%; }

  .wl-nav-signup {
    display: inline-block;
    padding: 8px 20px;
    background: ${C.orange};
    color: #fff;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.07em; text-transform: uppercase;
    text-decoration: none; border: none;
    transition: transform 0.18s, background 0.18s;
  }
  .wl-nav-signup:hover { background: ${C.orangeDk}; transform: translateY(-2px); }

  .wl-nav-desktop-links {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    display: flex; align-items: center; gap: 32px;
  }
  .wl-nav-desktop-cta {
    margin-left: auto;
    display: flex; align-items: center; gap: 22px; flex-shrink: 0;
  }
  .wl-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    background: none; border: none;
    padding: 6px; margin-left: auto; flex-shrink: 0;
  }
  .wl-hamburger span {
    display: block;
    width: 20px; height: 2px;
    background: rgba(240,237,232,0.85);
    border-radius: 1px;
    transition: transform 0.22s, opacity 0.22s;
  }
  .wl-mobile-menu {
    display: none;
    position: fixed;
    top: 58px; left: 0; right: 0;
    background: #0A0A0A;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 4px 24px 20px;
    flex-direction: column;
    z-index: 99;
  }
  .wl-mobile-menu.open { display: flex; }
  .wl-mobile-menu-link {
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    color: rgba(240,237,232,0.75);
    font-size: 15px; font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;
  }
  .wl-mobile-menu-link:hover { color: #F0EDE8; }

  .wl-footer-link {
    color: rgba(240,237,232,0.5);
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s;
  }
  .wl-footer-link:hover { color: ${C.orange}; }

  .wl-input {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid ${C.border};
    background: #fff;
    font-size: 14px;
    color: ${C.black};
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .wl-input:focus { border-color: ${C.orange}; }
  .wl-input::placeholder { color: #B0ABA6; }
  .wl-input.error { border-color: #E53E3E; }

  .wl-btn {
    width: 100%;
    padding: 14px;
    background: ${C.orange};
    color: #fff;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.09em; text-transform: uppercase;
    border: 2px solid ${C.orange};
    cursor: pointer;
    transition: background 0.18s, transform 0.18s;
    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .wl-btn:hover:not(:disabled) { background: ${C.orangeDk}; border-color: ${C.orangeDk}; transform: translateY(-1px); }
  .wl-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Layout classes */
  .wl-main-pad { padding: 80px 24px; }
  .wl-footer-section { padding: 24px 48px; }
  .wl-footer-inner {
    display: flex; align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; gap: 24px;
  }
  .wl-footer-links {
    display: flex; gap: 24px;
    align-items: center; flex-wrap: wrap;
  }

  /* ── Tablet ≤ 768px ─── */
  @media (max-width: 768px) {
    .wl-nav-inner         { padding: 0 20px; }
    .wl-hamburger         { display: flex; }
    .wl-nav-desktop-links { display: none; }
    .wl-nav-desktop-cta   { display: none; }

    .wl-footer-section { padding: 24px 20px; }
  }

  /* ── Mobile ≤ 640px ─── */
  @media (max-width: 640px) {
    .wl-main-pad { padding: 48px 16px; }
    .wl-footer-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
    .wl-footer-links { gap: 16px; }
  }
`;

export default function WaitlistPage() {
  const [fullName, setFullName]   = useState('');
  const [email, setEmail]         = useState('');
  const [company, setCompany]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [alreadyOnList, setAlreadyOnList] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; email?: string }>({});
  const [menuOpen, setMenuOpen]   = useState(false);

  const validate = () => {
    const errs: { fullName?: string; email?: string } = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (!email.trim()) errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email address.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner('');
    setAlreadyOnList(false);

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('waitlist').insert({
        full_name: fullName.trim(),
        email:     email.trim().toLowerCase(),
        company:   company.trim() || null,
      });

      if (error) {
        if (error.code === '23505') {
          setAlreadyOnList(true);
        } else {
          setErrorBanner('Something went wrong. Please try again.');
        }
      } else {
        setSuccess(true);
      }
    } catch {
      setErrorBanner('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', overflowX: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{PAGE_CSS}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: C.black,
        borderBottom: `1px solid ${C.borderDk}`,
        flexShrink: 0,
      }}>
        <div className="wl-nav-inner">
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <VerusLogo size={30} wordmarkColor="#F0EDE8" />
          </Link>

          <div className="wl-nav-desktop-links">
            <Link to="/" className="wl-nav-link">Home</Link>
            <Link to="/team" className="wl-nav-link">Team</Link>
          </div>

          <div className="wl-nav-desktop-cta">
            <Link to="/waitlist" className="wl-nav-signup" style={{ background: C.black, border: `2px solid ${C.orange}`, color: C.orange }}>
              Join the Waitlist
            </Link>
          </div>

          <button className="wl-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span style={{ transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>

      <div className={`wl-mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/" className="wl-mobile-menu-link" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/team" className="wl-mobile-menu-link" onClick={() => setMenuOpen(false)}>Team</Link>
        <Link to="/waitlist" className="wl-nav-signup" style={{ marginTop: 16, textAlign: 'center' }} onClick={() => setMenuOpen(false)}>
          Join the Waitlist
        </Link>
      </div>

      {/* ── Main content ── */}
      <main className="wl-main-pad" style={{
        flex: 1,
        background: C.offWhite,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '100%', maxWidth: 480,
          background: '#FDFCFA',
          border: `1.5px solid ${C.border}`,
          padding: '48px 40px',
        }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56,
                background: C.orange,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: C.black, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                You're on the list.
              </h2>
              <p style={{ fontSize: 15, color: C.textGray, lineHeight: 1.65, margin: 0 }}>
                We'll be in touch soon.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: C.black, margin: '0 0 12px', letterSpacing: '-0.025em' }}>
                  Join the Waitlist
                </h1>
                <p style={{ fontSize: 14, color: C.textGray, lineHeight: 1.65, margin: 0 }}>
                  Be the first to know when Verus launches. We'll reach out when your access is ready.
                </p>
              </div>

              {alreadyOnList && (
                <div style={{
                  marginBottom: 20, padding: '12px 16px',
                  background: 'rgba(232,96,28,0.08)',
                  border: `1.5px solid ${C.orange}`,
                  fontSize: 13, color: C.black,
                }}>
                  You're already on the list!
                </div>
              )}

              {errorBanner && (
                <div style={{
                  marginBottom: 20, padding: '12px 16px',
                  background: '#FFF5F5',
                  border: '1.5px solid #E53E3E',
                  fontSize: 13, color: '#742A2A',
                }}>
                  {errorBanner}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textGray, marginBottom: 6 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`wl-input${fieldErrors.fullName ? ' error' : ''}`}
                    placeholder=""
                    value={fullName}
                    onChange={e => { setFullName(e.target.value); setFieldErrors(p => ({ ...p, fullName: undefined })); }}
                  />
                  {fieldErrors.fullName && (
                    <p style={{ margin: '5px 0 0', fontSize: 12, color: '#E53E3E' }}>{fieldErrors.fullName}</p>
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textGray, marginBottom: 6 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`wl-input${fieldErrors.email ? ' error' : ''}`}
                    placeholder=""
                    value={email}
                    onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })); }}
                  />
                  {fieldErrors.email && (
                    <p style={{ margin: '5px 0 0', fontSize: 12, color: '#E53E3E' }}>{fieldErrors.email}</p>
                  )}
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textGray, marginBottom: 6 }}>
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    className="wl-input"
                    placeholder=""
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                  />
                </div>

                <button type="submit" className="wl-btn" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Request Access'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="wl-footer-section" style={{
        background: C.black,
        borderTop: `1px solid ${C.borderDk}`,
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div className="wl-footer-inner">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <VerusLogo size={26} wordmarkColor="rgba(240,237,232,0.8)" />
            </Link>

            <div className="wl-footer-links">
              <Link to="/" className="wl-footer-link">Home</Link>
              <Link to="/team" className="wl-footer-link">Team</Link>
              <Link to="/waitlist" className="wl-footer-link">Join the Waitlist</Link>
              <a href="mailto:hello@verus.ai" className="wl-footer-link">hello@verus.ai</a>
            </div>

            <p style={{ fontSize: 11, color: 'rgba(240,237,232,0.55)', margin: 0 }}>
              © {new Date().getFullYear()} Verus Technologies, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
