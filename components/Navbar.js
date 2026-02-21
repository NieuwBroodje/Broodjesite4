import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 100,
      background: 'rgba(8, 12, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(232, 160, 32, 0.15)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #e8a020, #c48518)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: 18,
            color: '#080c14',
            boxShadow: '0 0 16px rgba(232,160,32,0.4)',
          }}>BR</div>
          <span style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: 20,
            letterSpacing: 1,
            color: '#f0e8d8',
          }}>
            BROODJE <span style={{ color: '#e8a020' }}>RP</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="desktop-nav">
          {[
            { label: 'Home', href: '/' },
            { label: 'Store', href: '/store' },
            { label: 'Rules', href: '/rules' },
            { label: 'Staff', href: '/staff' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '8px 16px',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600, fontSize: 15,
              letterSpacing: 0.5,
              color: 'rgba(240,232,216,0.7)',
              borderRadius: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#e8a020';
              e.currentTarget.style.background = 'rgba(232,160,32,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(240,232,216,0.7)';
              e.currentTarget.style.background = 'transparent';
            }}>
              {item.label}
            </Link>
          ))}
          <a href="https://discord.gg/jouw-discord" target="_blank" rel="noopener noreferrer"
            style={{
              marginLeft: 8,
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #e8a020, #c48518)',
              color: '#080c14',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700, fontSize: 15,
              letterSpacing: 0.5,
              borderRadius: 6,
              boxShadow: '0 0 12px rgba(232,160,32,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(232,160,32,0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(232,160,32,0.3)'}
          >
            Discord
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            color: '#e8a020',
            fontSize: 24,
          }}
          className="hamburger"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(8, 12, 20, 0.98)',
          borderTop: '1px solid rgba(232,160,32,0.15)',
          padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Store', href: '/store' },
            { label: 'Rules', href: '/rules' },
            { label: 'Staff', href: '/staff' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '10px 16px',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600, fontSize: 16,
                color: 'rgba(240,232,216,0.8)',
                borderRadius: 6,
              }}>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
