import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(232,160,32,0.08)', background: 'rgba(6,9,15,0.95)', marginTop: 0, padding: '52px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, position: 'relative' }}>
                <Image src="/logo.gif" alt="Logo" fill style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 2 }}>BROODJE</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: 4, color: '#e8a020', marginTop: -2 }}>ROLEPLAY</div>
              </div>
            </div>
            <p style={{ color: 'rgba(138,155,176,0.55)', fontSize: 13, lineHeight: 1.8 }}>De beste FiveM Roleplay ervaring van Nederland. Sluit je aan bij onze community!</p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 18, color: '#e8a020', textTransform: 'uppercase' }}>Navigatie</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ label: 'Home', href: '/' }, { label: 'Store', href: '/store' }, { label: 'Leaderboard', href: '/leaderboard' }, { label: 'Rules', href: '/rules' }, { label: 'Staff', href: '/staff' }].map(item => (
                <Link key={item.href} href={item.href} style={{ color: 'rgba(138,155,176,0.5)', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8a020'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(138,155,176,0.5)'}>{item.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 18, color: '#e8a020', textTransform: 'uppercase' }}>Community</h4>
            <a href="https://discord.gg/jouw-discord" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: 9, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 0.5, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,160,32,0.15)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,160,32,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.2)'; }}>
              💬 Discord Server
            </a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(232,160,32,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ color: 'rgba(74,90,106,0.7)', fontSize: 12, letterSpacing: 0.5 }}>© {new Date().getFullYear()} Broodje RP. Alle rechten voorbehouden.</p>
          <p style={{ color: 'rgba(74,90,106,0.5)', fontSize: 11 }}>Powered by Tebex &nbsp;·&nbsp; Website gemaakt door <span style={{ color: '#e8a020' }}>Karel</span></p>
        </div>
      </div>
    </footer>
  );
}
