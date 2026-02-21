import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Broodje RP – FiveM Roleplay Server</title>
        <meta name="description" content="De beste FiveM Roleplay server van Nederland. Join nu!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section style={{
          minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '100px 24px 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative background grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(232,160,32,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,160,32,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
          }} />

          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: '20%', left: '50%',
            transform: 'translateX(-50%)',
            width: 600, height: 300,
            background: 'radial-gradient(ellipse, rgba(232,160,32,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', maxWidth: 800 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px',
              background: 'rgba(232,160,32,0.1)',
              border: '1px solid rgba(232,160,32,0.3)',
              borderRadius: 999,
              marginBottom: 32,
              fontSize: 13,
              color: '#e8a020',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              letterSpacing: 1,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#40c080',
                boxShadow: '0 0 8px #40c080',
                animation: 'pulse 2s infinite',
              }} />
              SERVER ONLINE
            </div>

            <h1 style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(42px, 8vw, 88px)',
              lineHeight: 1.05,
              letterSpacing: -1,
              marginBottom: 24,
            }}>
              BROODJE{' '}
              <span style={{
                color: '#e8a020',
                textShadow: '0 0 40px rgba(232,160,32,0.5)',
              }}>ROLEPLAY</span>
            </h1>

            <p style={{
              fontSize: 18,
              color: 'rgba(138,155,176,0.9)',
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 560,
              margin: '0 auto 40px',
            }}>
              Beleef de ultieme FiveM Roleplay ervaring. Unieke jobs, rijke lore en een actieve community wachten op jou.
            </p>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/store" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #e8a020, #c48518)',
                color: '#080c14',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700, fontSize: 16,
                letterSpacing: 1,
                borderRadius: 8,
                boxShadow: '0 0 24px rgba(232,160,32,0.4), 0 4px 20px rgba(0,0,0,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(232,160,32,0.6), 0 4px 20px rgba(0,0,0,0.4)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(232,160,32,0.4), 0 4px 20px rgba(0,0,0,0.4)'}>
                🛒 Donatie Store
              </Link>

              <a href="https://discord.gg/jouw-discord" target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(232,160,32,0.3)',
                  color: '#f0e8d8',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 700, fontSize: 16,
                  letterSpacing: 1,
                  borderRadius: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(232,160,32,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(232,160,32,0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(232,160,32,0.3)';
                }}>
                💬 Join Discord
              </a>
            </div>

            {/* IP Copy */}
            <div style={{ marginTop: 48 }}>
              <p style={{ color: 'rgba(138,155,176,0.6)', fontSize: 13, marginBottom: 8, letterSpacing: 1 }}>
                SERVER IP
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('connect jouw-server-ip');
                  alert('Server IP gekopieerd!');
                }}
                style={{
                  padding: '10px 24px',
                  background: 'rgba(232,160,32,0.08)',
                  border: '1px solid rgba(232,160,32,0.25)',
                  borderRadius: 6,
                  color: '#e8a020',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600, fontSize: 15,
                  letterSpacing: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                jouw-server-ip ✦ Klik om te kopiëren
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: 36,
            textAlign: 'center',
            marginBottom: 48,
            letterSpacing: 1,
          }}>
            WAAROM <span style={{ color: '#e8a020' }}>BROODJE RP</span>?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 20,
          }}>
            {[
              { icon: '🎭', title: 'Diep Roleplay', desc: 'Rijke verhaallijnen en een actieve community die serieuze RP beloont.' },
              { icon: '💼', title: 'Unieke Jobs', desc: 'Tientallen legale en illegale jobs met een volledig economiesysteem.' },
              { icon: '🏎️', title: 'Custom Cars', desc: 'Honderden custom voertuigen met realistisch rijgedrag.' },
              { icon: '🏠', title: 'Huizen & Bezit', desc: 'Koop huizen, panden en bouw jouw imperium op.' },
              { icon: '👮', title: 'Actieve Staff', desc: '24/7 actieve staff die zorgt voor een eerlijke en veilige omgeving.' },
              { icon: '🎮', title: 'Regelmatige Updates', desc: 'Wekelijkse content updates en verbeteringen op basis van community feedback.' },
            ].map((feat, i) => (
              <div key={i} style={{
                background: 'rgba(17,25,39,0.8)',
                border: '1px solid rgba(232,160,32,0.12)',
                borderRadius: 12,
                padding: '28px 24px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(22,32,46,0.9)';
                e.currentTarget.style.borderColor = 'rgba(232,160,32,0.35)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(17,25,39,0.8)';
                e.currentTarget.style.borderColor = 'rgba(232,160,32,0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{feat.icon}</div>
                <h3 style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 700, fontSize: 20,
                  marginBottom: 10, color: '#f0e8d8',
                }}>{feat.title}</h3>
                <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 14, lineHeight: 1.7 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 24px 80px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(232,160,32,0.1) 0%, rgba(196,133,24,0.05) 100%)',
            border: '1px solid rgba(232,160,32,0.25)',
            borderRadius: 16,
            padding: '60px 40px',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700, fontSize: 40,
              marginBottom: 16,
            }}>
              SUPPORT DE <span style={{ color: '#e8a020' }}>SERVER</span>
            </h2>
            <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 16, marginBottom: 32 }}>
              Ontvang exclusieve voordelen en help de server groeien met een donatie.
            </p>
            <Link href="/store" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 36px',
              background: 'linear-gradient(135deg, #e8a020, #c48518)',
              color: '#080c14',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700, fontSize: 17,
              letterSpacing: 1,
              borderRadius: 8,
              boxShadow: '0 0 24px rgba(232,160,32,0.4)',
            }}>
              🛒 Bekijk de Store
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
