import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const staffMembers = [
  { name: 'iiStormz', role: 'Eigenaar', emoji: '👑', color: '#e8a020' },
  { name: 'iiSaid', role: 'Beheerder', emoji: '⭐', color: '#c48518' },
  { name: 'LuaRX', role: 'Beheerder', emoji: '🛡️', color: '#4080e8' },
  { name: 'ilyas', role: 'Chief Executive', emoji: '⚔️', color: '#4080e8' },
  { name: 'ᴹᵃˡ⁄𝑓(𝑥)', role: 'Chief Executive', emoji: '🔰', color: '#40c080' },
  { name: 'JUICEBOX.NL', role: 'Chief Executive', emoji: '🔰', color: '#40c080' },
  { name: 'Karel', role: 'Development', emoji: '🔧', color: '#8a9bb0' },
  { name: 'Karel', role: 'Website Onderhouder', emoji: '🔧', color: '#8a9bb0' },
];

export default function Staff() {
  return (
    <>
      <Head>
        <title>Staff – Broodje RP</title>
      </Head>
      <Navbar />
      <main style={{ paddingTop: 80, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(232,160,32,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(232,160,32,0.12)',
          padding: '60px 24px 40px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: 'clamp(36px, 6vw, 64px)',
            letterSpacing: 1, marginBottom: 12,
          }}>
            OUR <span style={{ color: '#e8a020' }}>TEAM</span>
          </h1>
          <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Ons staffteam werkt dag en nacht om de server te verbeteren.
          </p>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20,
          }}>
            {staffMembers.map((member, i) => (
              <div key={i} style={{
                background: 'rgba(17,25,39,0.8)',
                border: `1px solid rgba(232,160,32,0.12)`,
                borderRadius: 12,
                padding: '28px 20px',
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${member.color}50`;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(232,160,32,0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  width: 72, height: 72,
                  background: `${member.color}20`,
                  border: `2px solid ${member.color}50`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32,
                  margin: '0 auto 16px',
                }}>
                  {member.emoji}
                </div>
                <h3 style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 700, fontSize: 18,
                  marginBottom: 6,
                }}>{member.name}</h3>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 12px',
                  background: `${member.color}20`,
                  border: `1px solid ${member.color}40`,
                  borderRadius: 999,
                  fontSize: 12,
                  color: member.color,
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 60,
            background: 'rgba(17,25,39,0.8)',
            border: '1px solid rgba(232,160,32,0.15)',
            borderRadius: 12,
            padding: '32px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 28, marginBottom: 12 }}>
              WIL JE <span style={{ color: '#e8a020' }}>STAFF</span> WORDEN?
            </h2>
            <p style={{ color: 'rgba(138,155,176,0.8)', marginBottom: 24, fontSize: 15 }}>
              Wij zijn altijd op zoek naar gemotiveerde staffleden. Solliciteer via onze Discord!
            </p>
            <a href="https://discord.gg/jouw-discord" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #e8a020, #c48518)',
                color: '#080c14',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700, fontSize: 15,
                letterSpacing: 1,
                borderRadius: 8,
                boxShadow: '0 0 20px rgba(232,160,32,0.3)',
              }}>
              💬 Solliciteer op Discord
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
