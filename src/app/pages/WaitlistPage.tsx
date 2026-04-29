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
  .wl-nav-link {
    position: relative;
    color: rgba(240,237,232,0.7);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.03em;
    padding-bottom: 2px;
    transition: color 0.2s;
  }
  .wl-nav-link::after {
    content: '';
    position: absolute;
    left: 0; bottom: 0;
    height: 1.5px;
    width: 0;
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
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    transition: transform 0.18s, background 0.18s;
  }
  .wl-nav-signup:hover { background: ${C.orangeDk}; transform: translateY(-2px); }

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
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    border: 2px solid ${C.orange};
    cursor: pointer;
    transition: background 0.18s, transform 0.18s;
    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .wl-btn:hover:not(:disabled) { background: ${C.orangeDk}; border-color: ${C.orangeDk}; transform: translateY(-1px); }
  .wl-btn:disabled { opacity: 0.6; cursor: not-allowed; }
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
        padding: '0 48px',
        height: 58,
        display: 'flex', alignItems: 'center',
        flexShrink: 0,
      }}>
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <VerusLogo size={30} wordmarkColor="#F0EDE8" />
        </Link>

        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex', alignItems: 'center', gap: 32,
        }}>
          <Link to="/" className="wl-nav-link">Home</Link>
          <Link to="/team" className="wl-nav-link">Team</Link>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 22, flexShrink: 0 }}>
          <Link to="/waitlist" className="wl-nav-signup" style={{ background: C.black, border: `2px solid ${C.orange}`, color: C.orange }}>
            Join the Waitlist
          </Link>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        background: C.offWhite,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px',
      }}>
        <div style={{
          width: '100%', maxWidth: 480,
          background: '#FDFCFA',
          border: `1.5px solid ${C.border}`,
          padding: '48px 40px',
        }}>
          {success ? (
            /* ── Success state ── */
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
            /* ── Form ── */
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
                  marginBottom: 20,
                  padding: '12px 16px',
                  background: 'rgba(232,96,28,0.08)',
                  border: `1.5px solid ${C.orange}`,
                  fontSize: 13, color: C.black,
                }}>
                  You're already on the list!
                </div>
              )}

              {errorBanner && (
                <div style={{
                  marginBottom: 20,
                  padding: '12px 16px',
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
                    placeholder="Jane Smith"
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
                    placeholder="jane@company.com"
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
                    placeholder="Acme Infrastructure"
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
      <footer style={{
        background: C.black,
        borderTop: `1px solid ${C.borderDk}`,
        padding: '24px 48px',
        flexShrink: 0,
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <VerusLogo size={26} wordmarkColor="rgba(240,237,232,0.8)" />
          </Link>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link to="/" className="wl-footer-link">Home</Link>
            <Link to="/team" className="wl-footer-link">Team</Link>
            <Link to="/waitlist" className="wl-footer-link">Join the Waitlist</Link>
            <a href="mailto:hello@verus.ai" className="wl-footer-link">hello@verus.ai</a>
          </div>

          <p style={{ fontSize: 11, color: 'rgba(240,237,232,0.55)', margin: 0 }}>
            © {new Date().getFullYear()} Verus Technologies, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
