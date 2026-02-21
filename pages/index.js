import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
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
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(232,160,32,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.04) 1px, transparent 1px)`, backgroundSize: '50px 50px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)' }} />
          <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 350, background: 'radial-gradient(ellipse, rgba(232,160,32,0.1) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', maxWidth: 820 }}>
            {/* Big Logo */}
            <div style={{ width: 140, height: 140, position: 'relative', margin: '0 auto 28px' }}>
              <Image src="/logo.gif" alt="Broodje RP" fill style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(232,160,32,0.4))' }} unoptimized />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 999, marginBottom: 28, fontSize: 13, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 1 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#40c080', boxShadow: '0 0 8px #40c080', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              SERVER ONLINE
            </div>

            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(44px, 9vw, 96px)', lineHeight: 1.0, letterSpacing: -1, marginBottom: 22 }}>
              BROODJE{' '}<span style={{ color: '#e8a020', textShadow: '0 0 50px rgba(232,160,32,0.45)' }}>ROLEPLAY</span>
            </h1>

            <p style={{ fontSize: 18, color: 'rgba(138,155,176,0.9)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
              Beleef de ultieme FiveM Roleplay ervaring. Unieke jobs, rijke lore en een actieve community wachten op jou.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
              <Link href="/store" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px',
                background: 'linear-gradient(135deg, #e8a020, #c48518)', color: '#080c14',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: 1,
                borderRadius: 9, boxShadow: '0 0 28px rgba(232,160,32,0.45), 0 4px 20px rgba(0,0,0,0.4)',
                textDecoration: 'none', transition: 'all 0.2s',
              }}>🛒 Donatie Store</Link>

              <Link href="/leaderboard" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px',
                background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.3)',
                color: '#FFD700', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16,
                letterSpacing: 1, borderRadius: 9, textDecoration: 'none', transition: 'all 0.2s',
              }}>👑 Leaderboard</Link>

              <a href="https://discord.gg/jouw-discord" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(232,160,32,0.28)',
                color: '#f0e8d8', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16,
                letterSpacing: 1, borderRadius: 9, textDecoration: 'none', transition: 'all 0.2s',
              }}>💬 Discord</a>
            </div>

            {/* Server IP */}
            <div>
              <p style={{ color: 'rgba(138,155,176,0.5)', fontSize: 12, marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}>Server IP</p>
              <button onClick={() => { navigator.clipboard.writeText('connect jouw-server-ip'); alert('Server IP gekopieerd!'); }} style={{
                padding: '10px 26px', background: 'rgba(232,160,32,0.07)', border: '1px solid rgba(232,160,32,0.22)',
                borderRadius: 8, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15,
                letterSpacing: 2, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                jouw-server-ip ✦ Klik om te kopiëren
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 38, textAlign: 'center', marginBottom: 48, letterSpacing: 1 }}>
            WAAROM <span style={{ color: '#e8a020' }}>BROODJE RP</span>?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {[
              { icon: '🎭', title: 'Diep Roleplay', desc: 'Rijke verhaallijnen en een actieve community die serieuze RP beloont.' },
              { icon: '💼', title: 'Unieke Jobs', desc: 'Tientallen legale en illegale jobs met een volledig economiesysteem.' },
              { icon: '🏎️', title: 'Custom Cars', desc: 'Honderden custom voertuigen met realistisch rijgedrag en mods.' },
              { icon: '🏠', title: 'Huizen & Bezit', desc: 'Koop huizen, panden en bouw jouw imperium op.' },
              { icon: '👮', title: 'Actieve Staff', desc: '24/7 actieve staff die zorgt voor een eerlijke en veilige omgeving.' },
              { icon: '🎮', title: 'Regelmatige Updates', desc: 'Wekelijkse content updates op basis van community feedback.' },
            ].map((feat, i) => (
              <div key={i} style={{ background: 'rgba(17,25,39,0.85)', border: '1px solid rgba(232,160,32,0.1)', borderRadius: 13, padding: '28px 22px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(22,32,46,0.95)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.32)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(17,25,39,0.85)'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 38, marginBottom: 16 }}>{feat.icon}</div>
                <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 10, color: '#f0e8d8' }}>{feat.title}</h3>
                <p style={{ color: 'rgba(138,155,176,0.75)', fontSize: 14, lineHeight: 1.7 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </>
  );
}
