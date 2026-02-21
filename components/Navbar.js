import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar({ cartCount = 0, onCartClick, user, onLogin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(8,12,20,0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(232,160,32,0.12)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 44, height: 44, position: 'relative', flexShrink: 0 }}>
            <Image src="/logo.gif" alt="Broodje RP Logo" fill style={{ objectFit: 'contain' }} unoptimized />
          </div>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: 1, color: '#f0e8d8' }}>
            BROODJE <span style={{ color: '#e8a020' }}>RP</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="desktop-nav">
          {[
            { label: 'Home', href: '/' },
            { label: 'Store', href: '/store' },
            { label: 'Leaderboard', href: '/leaderboard' },
            { label: 'Rules', href: '/rules' },
            { label: 'Staff', href: '/staff' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '7px 13px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 14,
              letterSpacing: 0.5, color: 'rgba(240,232,216,0.65)', borderRadius: 7, transition: 'all 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e8a020'; e.currentTarget.style.background = 'rgba(232,160,32,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(240,232,216,0.65)'; e.currentTarget.style.background = 'transparent'; }}>
              {item.label}
            </Link>
          ))}

          {/* Cart */}
          {onCartClick && (
            <button onClick={onCartClick} style={{
              position: 'relative', marginLeft: 6,
              padding: '7px 14px',
              background: cartCount > 0 ? 'linear-gradient(135deg, #e8a020, #c48518)' : 'rgba(232,160,32,0.08)',
              border: `1px solid ${cartCount > 0 ? 'transparent' : 'rgba(232,160,32,0.22)'}`,
              borderRadius: 8, color: cartCount > 0 ? '#080c14' : '#e8a020',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  background: '#080c14', color: '#e8a020', borderRadius: '50%',
                  width: 18, height: 18, fontSize: 11, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cartCount}</span>
              )}
            </button>
          )}

          {/* CFX Login / User */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px',
                background: 'rgba(64,192,128,0.1)',
                border: '1px solid rgba(64,192,128,0.25)',
                borderRadius: 8,
              }}>
                {user.avatar && <img src={user.avatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />}
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, color: '#40c080' }}>
                  {user.username}
                </span>
              </div>
              <button onClick={onLogout} style={{
                padding: '6px 12px',
                background: 'transparent', border: '1px solid rgba(232,64,64,0.3)',
                borderRadius: 8, color: 'rgba(232,64,64,0.7)',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 12,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,64,64,0.1)'; e.currentTarget.style.color = '#e84040'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(232,64,64,0.7)'; }}>
                Uitloggen
              </button>
            </div>
          ) : (
            <button onClick={onLogin} style={{
              marginLeft: 8, padding: '7px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(232,160,32,0.25)',
              borderRadius: 8, color: '#f0e8d8',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,160,32,0.1)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.25)'; }}>
              <img src="https://cfx.re/favicon.ico" alt="CFX" style={{ width: 16, height: 16 }} onError={e => e.target.style.display='none'} />
              Inloggen met CFX
            </button>
          )}

          <a href="https://discord.gg/jouw-discord" target="_blank" rel="noopener noreferrer"
            style={{
              marginLeft: 6, padding: '7px 16px',
              background: 'linear-gradient(135deg, #e8a020, #c48518)',
              color: '#080c14', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14,
              letterSpacing: 0.5, borderRadius: 8, textDecoration: 'none',
              boxShadow: '0 0 12px rgba(232,160,32,0.3)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 22px rgba(232,160,32,0.55)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(232,160,32,0.3)'}>
            Discord
          </a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{
          display: 'none', background: 'transparent', color: '#e8a020', fontSize: 24, cursor: 'pointer', border: 'none',
        }}>{menuOpen ? '✕' : '☰'}</button>
      </div>

      {menuOpen && (
        <div style={{
          background: 'rgba(8,12,20,0.98)', borderTop: '1px solid rgba(232,160,32,0.1)',
          padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Store', href: '/store' },
            { label: 'Leaderboard', href: '/leaderboard' },
            { label: 'Rules', href: '/rules' },
            { label: 'Staff', href: '/staff' },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
              style={{ padding: '10px 12px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 16, color: 'rgba(240,232,216,0.8)', borderRadius: 7, textDecoration: 'none' }}>
              {item.label}
            </Link>
          ))}
          {onLogin && !user && (
            <button onClick={() => { onLogin(); setMenuOpen(false); }} style={{
              padding: '10px 12px', background: 'transparent', border: 'none',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 16,
              color: '#e8a020', textAlign: 'left', cursor: 'pointer',
            }}>🎮 Inloggen met CFX</button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
