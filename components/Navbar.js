import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const TICKER_MSGS = [
  '🌙 RAMADAN 2026 — 50% KORTING OP ALLE PAKKETTEN',
  '🎁 ELKE DONATIE SUPPORT DE SERVER & EVENTS',
  '⚡ LIMITED PERIODE — MIS HET NIET',
  '🔥 EXTRA KANSEN: HOE MEER JE DONEERT, HOE MEER KANS',
  '💎 GOUDEN DEALS — BESTE VALUE VAN HET JAAR',
];

export default function Navbar({ cartCount = 0, onCartClick, user, onLogin, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => router.pathname === href;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Store', href: '/store' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Regels', href: '/rules' },
    { label: 'Over Ons', href: '/about' },
  ];

  const doubled = [...TICKER_MSGS, ...TICKER_MSGS];

  return (
    <>
      {/* ── Ticker Bar — always on top ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
        height: 32, background: '#080c16',
        borderBottom: '1px solid rgba(232,160,32,0.15)',
        overflow: 'hidden', display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', whiteSpace: 'nowrap',
          animation: 'ticker 36s linear infinite',
          willChange: 'transform',
        }}>
          {doubled.map((msg, i) => (
            <span key={i} style={{
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
              fontSize: 11, letterSpacing: 1.8,
              color: 'rgba(232,160,32,0.8)',
              padding: '0 44px',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#e8a020', display: 'inline-block', opacity: 0.6, flexShrink: 0 }} />
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main nav (offset by ticker height 32px) ── */}
      <nav style={{
        position: 'fixed', top: 32, left: 0, right: 0, zIndex: 1000,
        height: 60,
        background: scrolled ? 'rgba(6,9,15,0.97)' : 'rgba(6,9,15,0.75)',
        backdropFilter: 'blur(24px) saturate(160%)',
        borderBottom: scrolled ? '1px solid rgba(232,160,32,0.1)' : '1px solid rgba(232,160,32,0.04)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      }}>
        {scrolled && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.4), transparent)' }} />
        )}

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, position: 'relative', flexShrink: 0 }}>
              <Image
                src="/logo.gif" alt="Logo" fill
                style={{ objectFit: 'contain', mixBlendMode: 'screen', filter: 'drop-shadow(0 0 10px rgba(232,160,32,0.6))' }}
                unoptimized
              />
            </div>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: 2.5, color: '#eee8d8' }}>BROODJE</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: 4, color: '#e8a020', marginTop: 1 }}>ROLEPLAY</div>
            </div>
          </Link>

          {/* Center links */}
          <div className="center-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navLinks.map(item => (
              <Link key={item.href} href={item.href} style={{
                position: 'relative', padding: '6px 13px',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 12,
                letterSpacing: 1.8, textTransform: 'uppercase',
                color: isActive(item.href) ? '#e8a020' : 'rgba(238,232,216,0.5)',
                borderRadius: 6, transition: 'color 0.2s', textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!isActive(item.href)) e.currentTarget.style.color = '#eee8d8'; }}
              onMouseLeave={e => { if (!isActive(item.href)) e.currentTarget.style.color = 'rgba(238,232,216,0.5)'; }}>
                {item.label}
                {isActive(item.href) && (
                  <div style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', width: 18, height: 2, background: 'linear-gradient(90deg, transparent, #e8a020, transparent)', borderRadius: 2 }} />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="right-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Cart button — always visible */}
            {onCartClick && (
              <button onClick={onCartClick} style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 14px', height: 36,
                background: cartCount > 0 ? 'rgba(232,160,32,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${cartCount > 0 ? 'rgba(232,160,32,0.45)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 9, color: cartCount > 0 ? '#e8a020' : 'rgba(238,232,216,0.45)',
                cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: 0.5,
                boxShadow: cartCount > 0 ? '0 0 14px rgba(232,160,32,0.18)' : 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,160,32,0.2)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.55)'; e.currentTarget.style.color = '#e8a020'; }}
              onMouseLeave={e => {
                e.currentTarget.style.background = cartCount > 0 ? 'rgba(232,160,32,0.15)' : 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = cartCount > 0 ? 'rgba(232,160,32,0.45)' : 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = cartCount > 0 ? '#e8a020' : 'rgba(238,232,216,0.45)';
              }}>
                <span style={{ fontSize: 15 }}>🛒</span>
                <span>{cartCount > 0 ? `${cartCount} item${cartCount !== 1 ? 's' : ''}` : 'Wagen'}</span>
                {cartCount > 0 && (
                  <div style={{
                    position: 'absolute', top: -7, right: -7,
                    minWidth: 18, height: 18, borderRadius: 9, padding: '0 4px',
                    background: 'linear-gradient(135deg, #e8a020, #c48518)',
                    color: '#06090f', fontSize: 10, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #06090f', boxShadow: '0 0 8px rgba(232,160,32,0.5)',
                  }}>{cartCount}</div>
                )}
              </button>
            )}

            {/* User */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 11px 5px 7px', background: 'rgba(61,214,140,0.07)', border: '1px solid rgba(61,214,140,0.18)', borderRadius: 9 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(61,214,140,0.2)', border: '1.5px solid rgba(61,214,140,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, overflow: 'hidden' }}>
                    {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🎮'}
                  </div>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, color: '#3dd68c', letterSpacing: 0.5 }}>{user.username}</span>
                </div>
                <button onClick={onLogout} style={{ width: 30, height: 30, background: 'rgba(240,80,96,0.07)', border: '1px solid rgba(240,80,96,0.18)', borderRadius: 7, color: 'rgba(240,80,96,0.55)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,80,96,0.16)'; e.currentTarget.style.color = '#f05060'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,80,96,0.07)'; e.currentTarget.style.color = 'rgba(240,80,96,0.55)'; }}
                title="Uitloggen">✕</button>
              </div>
            ) : onLogin ? (
              <button onClick={onLogin} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 13px', height: 36, background: 'rgba(232,160,32,0.07)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: 9, color: 'rgba(232,160,32,0.75)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,160,32,0.15)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.4)'; e.currentTarget.style.color = '#e8a020'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,160,32,0.07)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.2)'; e.currentTarget.style.color = 'rgba(232,160,32,0.75)'; }}>
                🎮 CFX
              </button>
            ) : null}

            {/* Discord */}
            <a href="https://discord.gg/broodjerp" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', height: 36,
              background: 'linear-gradient(135deg, #e8a020 0%, #c48518 100%)',
              color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800,
              fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase',
              borderRadius: 9, textDecoration: 'none', transition: 'all 0.25s',
              boxShadow: '0 2px 14px rgba(232,160,32,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(232,160,32,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 14px rgba(232,160,32,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Discord
            </a>
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{ display: 'none', background: 'none', border: 'none', color: '#e8a020', fontSize: 22, cursor: 'pointer' }}>{menuOpen ? '✕' : '☰'}</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 92, left: 0, right: 0, zIndex: 999, background: 'rgba(6,9,15,0.99)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(232,160,32,0.1)', padding: '12px 20px 20px' }}>
          {navLinks.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '11px 0', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 16, letterSpacing: 1, color: isActive(item.href) ? '#e8a020' : 'rgba(238,232,216,0.75)', borderBottom: '1px solid rgba(232,160,32,0.05)', textDecoration: 'none' }}>{item.label}</Link>
          ))}
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            {!user && onLogin && <button onClick={() => { onLogin(); setMenuOpen(false); }} style={{ flex: 1, padding: '10px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.25)', borderRadius: 8, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>🎮 CFX Login</button>}
            {onCartClick && <button onClick={() => { onCartClick(); setMenuOpen(false); }} style={{ flex: 1, padding: '10px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.25)', borderRadius: 8, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>🛒 Wagen{cartCount > 0 ? ` (${cartCount})` : ''}</button>}
          </div>
        </div>
      )}

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (max-width: 900px) { .center-nav { display: none !important; } .right-nav { display: none !important; } .hamburger { display: flex !important; } }
      `}</style>
    </>
  );
}
