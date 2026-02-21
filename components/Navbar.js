import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Navbar({ cartCount = 0, onCartClick, user, onLogin, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64,
        background: scrolled
          ? 'rgba(6,9,15,0.97)'
          : 'linear-gradient(180deg, rgba(6,9,15,0.85) 0%, rgba(6,9,15,0) 100%)',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(232,160,32,0.12)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {scrolled && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.5), transparent)',
          }} />
        )}

        <div style={{
          maxWidth: 1400, margin: '0 auto', padding: '0 28px',
          height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo — no border, mixBlendMode screen removes bg */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, position: 'relative', flexShrink: 0 }}>
              <Image
                src="/logo.gif"
                alt="Logo"
                fill
                style={{ objectFit: 'contain', mixBlendMode: 'screen', filter: 'drop-shadow(0 0 8px rgba(232,160,32,0.5))' }}
                unoptimized
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 17, letterSpacing: 2, color: '#eee8d8' }}>BROODJE</span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 4, color: '#e8a020' }}>ROLEPLAY</span>
            </div>
          </Link>

          {/* Center nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="center-nav">
            {navLinks.map(item => (
              <Link key={item.href} href={item.href} style={{
                position: 'relative',
                padding: '8px 14px',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 13,
                letterSpacing: 1.5, textTransform: 'uppercase',
                color: isActive(item.href) ? '#e8a020' : 'rgba(238,232,216,0.55)',
                borderRadius: 6, transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!isActive(item.href)) e.currentTarget.style.color = 'rgba(238,232,216,0.95)'; }}
              onMouseLeave={e => { if (!isActive(item.href)) e.currentTarget.style.color = 'rgba(238,232,216,0.55)'; }}>
                {item.label}
                {isActive(item.href) && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 20, height: 2,
                    background: 'linear-gradient(90deg, transparent, #e8a020, transparent)',
                    borderRadius: 2,
                  }} />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="right-nav">
            {/* Cart — always visible with item count */}
            {onCartClick && (
              <button onClick={onCartClick} style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 13px',
                background: cartCount > 0
                  ? 'linear-gradient(135deg, rgba(232,160,32,0.22), rgba(196,133,24,0.12))'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${cartCount > 0 ? 'rgba(232,160,32,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 10, color: cartCount > 0 ? '#e8a020' : 'rgba(238,232,216,0.5)',
                fontSize: 14, cursor: 'pointer', transition: 'all 0.25s',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                boxShadow: cartCount > 0 ? '0 0 16px rgba(232,160,32,0.15)' : 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232,160,32,0.25), rgba(196,133,24,0.15))'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.6)'; e.currentTarget.style.color = '#e8a020'; }}
              onMouseLeave={e => {
                e.currentTarget.style.background = cartCount > 0 ? 'linear-gradient(135deg, rgba(232,160,32,0.22), rgba(196,133,24,0.12))' : 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = cartCount > 0 ? 'rgba(232,160,32,0.5)' : 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = cartCount > 0 ? '#e8a020' : 'rgba(238,232,216,0.5)';
              }}>
                🛒
                <span style={{ fontSize: 12, letterSpacing: 0.5 }}>
                  {cartCount > 0 ? `${cartCount} item${cartCount !== 1 ? 's' : ''}` : 'Wagen'}
                </span>
                {cartCount > 0 && (
                  <div style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e8a020, #c48518)',
                    color: '#06090f', fontSize: 10, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #06090f',
                    boxShadow: '0 0 8px rgba(232,160,32,0.6)',
                  }}>{cartCount}</div>
                )}
              </button>
            )}

            {/* User / Login */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px 6px 8px',
                  background: 'rgba(61,214,140,0.08)',
                  border: '1px solid rgba(61,214,140,0.2)',
                  borderRadius: 10,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(61,214,140,0.2)',
                    border: '1.5px solid rgba(61,214,140,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, overflow: 'hidden',
                  }}>
                    {user.avatar
                      ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '🎮'}
                  </div>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: '#3dd68c', letterSpacing: 0.5 }}>
                    {user.username}
                  </span>
                </div>
                <button onClick={onLogout} style={{
                  width: 32, height: 32,
                  background: 'rgba(240,80,96,0.08)', border: '1px solid rgba(240,80,96,0.2)',
                  borderRadius: 8, color: 'rgba(240,80,96,0.6)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,80,96,0.18)'; e.currentTarget.style.color = '#f05060'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,80,96,0.08)'; e.currentTarget.style.color = 'rgba(240,80,96,0.6)'; }}
                title="Uitloggen">✕</button>
              </div>
            ) : (
              <button onClick={onLogin} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 14px',
                background: 'rgba(232,160,32,0.08)',
                border: '1px solid rgba(232,160,32,0.22)',
                borderRadius: 10, color: 'rgba(232,160,32,0.8)',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12,
                letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,160,32,0.18)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.5)'; e.currentTarget.style.color = '#e8a020'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,160,32,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.22)'; e.currentTarget.style.color = 'rgba(232,160,32,0.8)'; }}>
                <span style={{ fontSize: 14 }}>🎮</span> CFX Login
              </button>
            )}

            {/* Discord */}
            <a href="https://discord.gg/broodjerp" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px',
              background: 'linear-gradient(135deg, #e8a020, #c48518)',
              color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
              fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
              borderRadius: 10, transition: 'all 0.25s',
              boxShadow: '0 4px 16px rgba(232,160,32,0.3)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 28px rgba(232,160,32,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,160,32,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Discord
            </a>
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{
            display: 'none', background: 'transparent', border: 'none', color: '#e8a020', fontSize: 22, cursor: 'pointer',
          }}>{menuOpen ? '✕' : '☰'}</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999,
          background: 'rgba(6,9,15,0.98)', backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(232,160,32,0.12)',
          padding: '16px 24px 24px',
        }}>
          {navLinks.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{
              display: 'block', padding: '13px 0',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 17, letterSpacing: 1,
              color: isActive(item.href) ? '#e8a020' : 'rgba(238,232,216,0.75)',
              borderBottom: '1px solid rgba(232,160,32,0.06)',
              textDecoration: 'none',
            }}>{item.label}</Link>
          ))}
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            {!user && onLogin && (
              <button onClick={() => { onLogin(); setMenuOpen(false); }} style={{
                flex: 1, padding: '11px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.3)',
                borderRadius: 9, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>🎮 CFX Login</button>
            )}
            {user && (
              <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{
                padding: '11px 16px', background: 'rgba(240,80,96,0.1)', border: '1px solid rgba(240,80,96,0.3)',
                borderRadius: 9, color: '#f05060', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>Uitloggen</button>
            )}
            {onCartClick && (
              <button onClick={() => { onCartClick(); setMenuOpen(false); }} style={{
                flex: 1, padding: '11px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.3)',
                borderRadius: 9, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>🛒 Wagen {cartCount > 0 ? `(${cartCount})` : ''}</button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .center-nav { display: none !important; }
          .right-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
