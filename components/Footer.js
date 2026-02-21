import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(232,160,32,0.15)',
      background: 'rgba(8,12,20,0.8)',
      marginTop: 80,
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          <div>
            <div style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700, fontSize: 22,
              marginBottom: 12,
            }}>
              BROODJE <span style={{ color: '#e8a020' }}>RP</span>
            </div>
            <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 14, lineHeight: 1.7 }}>
              De beste FiveM Roleplay ervaring van Nederland. Sluit je aan bij onze community!
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 16, color: '#e8a020' }}>
              NAVIGATIE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Home', href: '/' },
                { label: 'Store', href: '/store' },
                { label: 'Rules', href: '/rules' },
                { label: 'Staff', href: '/staff' },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{
                  color: 'rgba(138,155,176,0.8)', fontSize: 14,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8a020'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(138,155,176,0.8)'}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 16, color: '#e8a020' }}>
              COMMUNITY
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://discord.gg/jouw-discord" target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(138,155,176,0.8)', fontSize: 14 }}>Discord</a>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(232,160,32,0.1)',
          paddingTop: 24,
          textAlign: 'center',
          color: 'rgba(74,90,112,0.8)',
          fontSize: 13,
        }}>
          © {new Date().getFullYear()} Broodje RP. Alle rechten voorbehouden. | Powered by Tebex
        </div>
      </div>
    </footer>
  );
}
