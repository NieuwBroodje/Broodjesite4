import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const stats = [
  { num: '500+', label: 'Community Leden' },
  { num: '50+', label: 'Dagelijks Online' },
  { num: '15+', label: 'Staff Leden' },
  { num: '99.9%', label: 'Uptime' },
];

const values = [
  { icon: '❤️', title: 'Passie', desc: 'We zijn gepassioneerd over roleplay en gaming.' },
  { icon: '🎯', title: 'Kwaliteit', desc: 'We streven naar de beste spelerservaring.' },
  { icon: '🤝', title: 'Community', desc: 'Onze community staat altijd op de eerste plaats.' },
  { icon: '🔄', title: 'Innovatie', desc: 'We blijven vernieuwen en verbeteren.' },
];

const team = [
  { name: 'Naam1', role: 'Eigenaar', emoji: '👑', color: '#e8a020' },
  { name: 'Naam2', role: 'Co-Eigenaar', emoji: '⭐', color: '#c48518' },
  { name: 'Naam3', role: 'Hoofd Admin', emoji: '🛡️', color: '#4080e8' },
  { name: 'Naam4', role: 'Senior Admin', emoji: '⚔️', color: '#4080e8' },
  { name: 'Naam5', role: 'Admin', emoji: '🔰', color: '#40c080' },
  { name: 'Naam6', role: 'Admin', emoji: '🔰', color: '#40c080' },
  { name: 'Naam7', role: 'Moderator', emoji: '🔧', color: '#8a9bb0' },
  { name: 'Naam8', role: 'Moderator', emoji: '🔧', color: '#8a9bb0' },
];

export default function About() {
  return (
    <>
      <Head>
        <title>Over Ons – Broodje RP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <main style={{ paddingTop: 80, minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(232,160,32,0.07) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(232,160,32,0.1)',
          padding: '64px 24px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 240, background: 'radial-gradient(ellipse, rgba(232,160,32,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(40px, 7vw, 72px)', letterSpacing: 1, marginBottom: 14 }}>
              Over <span style={{ color: '#e8a020' }}>Ons</span>
            </h1>
            <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Leer meer over Broodje Roleplay en ons team.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* About card */}
          <div style={{
            background: 'rgba(17,25,39,0.85)',
            border: '1px solid rgba(232,160,32,0.14)',
            borderRadius: 16,
            padding: '40px',
            display: 'flex',
            gap: 40,
            alignItems: 'center',
            marginBottom: 40,
            flexWrap: 'wrap',
          }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: 120, height: 120, position: 'relative' }}>
                <Image
                  src="/logo.gif"
                  alt="Broodje RP"
                  fill
                  style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(232,160,32,0.4))' }}
                  unoptimized
                />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 28, marginBottom: 14, color: '#eee8d8' }}>
                Broodje Roleplay
              </h2>
              <p style={{ color: 'rgba(200,215,230,0.85)', fontSize: 15, lineHeight: 1.85 }}>
                Broodje Roleplay is een Nederlandse FiveM roleplay server die zich richt op een realistische en leuke roleplay ervaring.
                Onze server draait op de nieuwste technologieën en wordt constant geüpdatet met nieuwe features, voertuigen en scenario's.
                Wij geloven dat roleplay voor iedereen toegankelijk moet zijn en bieden daarom een welkome omgeving voor zowel beginners als ervaren roleplayers.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 40,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: 'rgba(17,25,39,0.85)',
                border: '1px solid rgba(232,160,32,0.12)',
                borderRadius: 12,
                padding: '28px 20px',
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 36, color: '#e8a020', marginBottom: 6 }}>{s.num}</div>
                <div style={{ color: 'rgba(138,155,176,0.75)', fontSize: 13, letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 28, marginBottom: 20, color: '#eee8d8' }}>
              Onze <span style={{ color: '#e8a020' }}>Waarden</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {values.map((v, i) => (
                <div key={i} style={{
                  background: 'rgba(17,25,39,0.85)',
                  border: '1px solid rgba(232,160,32,0.1)',
                  borderRadius: 12,
                  padding: '24px',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
                  }}>{v.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 5, color: '#eee8d8' }}>{v.title}</h3>
                    <p style={{ color: 'rgba(138,155,176,0.75)', fontSize: 14, lineHeight: 1.6 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 28, marginBottom: 20, color: '#eee8d8' }}>
              Ons <span style={{ color: '#e8a020' }}>Team</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {team.map((member, i) => (
                <div key={i} style={{
                  background: 'rgba(17,25,39,0.85)',
                  border: '1px solid rgba(232,160,32,0.1)',
                  borderRadius: 12,
                  padding: '24px 16px',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${member.color}50`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{
                    width: 64, height: 64,
                    background: `${member.color}20`, border: `2px solid ${member.color}50`,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, margin: '0 auto 14px',
                  }}>{member.emoji}</div>
                  <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 7 }}>{member.name}</h3>
                  <span style={{
                    display: 'inline-block', padding: '3px 12px',
                    background: `${member.color}20`, border: `1px solid ${member.color}40`,
                    borderRadius: 999, fontSize: 12, color: member.color,
                    fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 0.5,
                  }}>{member.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Join CTA */}
          <div style={{
            background: 'rgba(17,25,39,0.85)',
            border: '1px solid rgba(232,160,32,0.15)',
            borderRadius: 14,
            padding: '40px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 30, marginBottom: 12 }}>
              WIL JE <span style={{ color: '#e8a020' }}>MEEDOEN</span>?
            </h2>
            <p style={{ color: 'rgba(138,155,176,0.8)', marginBottom: 26, fontSize: 15 }}>
              Sluit je aan bij onze groeiende community via Discord!
            </p>
            <a href="https://discord.gg/jouw-discord" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', padding: '13px 32px',
              background: 'linear-gradient(135deg, #e8a020, #c48518)',
              color: '#080c14', fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 800, fontSize: 15, letterSpacing: 1,
              borderRadius: 9, boxShadow: '0 0 24px rgba(232,160,32,0.35)',
              textDecoration: 'none',
            }}>💬 Join Discord</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
