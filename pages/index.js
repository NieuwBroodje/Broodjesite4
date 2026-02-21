import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.5 - 0.1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,160,32,${p.opacity})`;
        ctx.fill();
        p.x += p.speedX; p.y += p.speedY;
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Broodje RP – FiveM Roleplay</title>
        <meta name="description" content="De beste FiveM Roleplay server van Nederland." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* City background image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.18) saturate(0.6)',
          }} />
          {/* Gradient overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,9,15,0.3) 0%, rgba(6,9,15,0.0) 30%, rgba(6,9,15,0.0) 60%, rgba(6,9,15,1) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,160,32,0.06) 0%, transparent 70%)' }} />
          {/* Scanline effect */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
            zIndex: 2,
          }} />
          <ParticleCanvas />

          {/* Grid lines */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            backgroundImage: 'linear-gradient(rgba(232,160,32,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '120px 24px 80px', maxWidth: 900, animation: 'fadeUp 0.9s ease both' }}>
            {/* Logo */}
            <div style={{ width: 120, height: 120, position: 'relative', margin: '0 auto 32px', animation: 'float 4s ease-in-out infinite' }}>
              <Image src="/logo.gif" alt="Broodje RP" fill style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 32px rgba(232,160,32,0.6)) drop-shadow(0 0 60px rgba(232,160,32,0.3))' }} unoptimized />
            </div>

            {/* Live badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, padding: '7px 20px', background: 'rgba(61,214,140,0.08)', border: '1px solid rgba(61,214,140,0.25)', borderRadius: 999 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3dd68c', boxShadow: '0 0 10px #3dd68c', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: 3, color: '#3dd68c' }}>SERVER ONLINE</span>
            </div>

            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(52px, 10vw, 108px)', lineHeight: 0.95, letterSpacing: -2, marginBottom: 28, textTransform: 'uppercase' }}>
              <span style={{ display: 'block', color: '#eee8d8' }}>BROODJE</span>
              <span style={{
                display: 'block', color: '#e8a020',
                background: 'linear-gradient(90deg, #c48518, #f0c050, #e8a020, #c48518)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                animation: 'shimmer 4s linear infinite',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 40px rgba(232,160,32,0.5))',
              }}>ROLEPLAY</span>
            </h1>

            <p style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: 18, color: 'rgba(238,232,216,0.65)', letterSpacing: 0.5, marginBottom: 48, maxWidth: 540, margin: '0 auto 48px', lineHeight: 1.7 }}>
              Beleef de ultieme FiveM ervaring. Unieke jobs, custom cars, spannende verhaallijnen en een community die leeft.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
              <Link href="/store" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 32px',
                background: 'linear-gradient(135deg, #e8a020, #c48518)',
                color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase',
                borderRadius: 10, textDecoration: 'none',
                boxShadow: '0 0 30px rgba(232,160,32,0.5), 0 8px 32px rgba(0,0,0,0.4)',
                transition: 'all 0.3s', animation: 'glow-pulse 3s infinite',
              }}>🛒 Donatie Store</Link>

              <Link href="/leaderboard" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 28px',
                background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.28)',
                color: '#FFD700', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase',
                borderRadius: 10, textDecoration: 'none', transition: 'all 0.3s',
              }}>👑 Leaderboard</Link>

              <a href="https://discord.gg/jouw-discord" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 28px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(238,232,216,0.7)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase',
                borderRadius: 10, textDecoration: 'none', transition: 'all 0.3s',
              }}>💬 Discord</a>
            </div>

            {/* Server IP */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,160,32,0.15)', borderRadius: 10, overflow: 'hidden' }}>
              <span style={{ padding: '9px 14px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: 2, color: 'rgba(232,160,32,0.6)', borderRight: '1px solid rgba(232,160,32,0.12)' }}>SERVER IP</span>
              <button onClick={() => { navigator.clipboard.writeText('jouw-server-ip'); }} style={{
                padding: '9px 18px', background: 'transparent', border: 'none',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: '#e8a020', letterSpacing: 1, cursor: 'pointer',
              }}>jouw-server-ip</button>
              <span style={{ padding: '9px 12px', fontSize: 12, color: 'rgba(138,155,176,0.4)', borderLeft: '1px solid rgba(232,160,32,0.08)' }}>📋</span>
            </div>
          </div>

          {/* Bottom fade */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(transparent, #06090f)', zIndex: 2 }} />
        </section>

        {/* ── STATS BAR ── */}
        <section style={{ position: 'relative', zIndex: 4, borderTop: '1px solid rgba(232,160,32,0.08)', borderBottom: '1px solid rgba(232,160,32,0.08)', background: 'rgba(10,15,26,0.8)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 0 }}>
            {[
              { num: '500+', label: 'Actieve Spelers' },
              { num: '50+', label: 'Unieke Jobs' },
              { num: '24/7', label: 'Online' },
              { num: '100+', label: 'Custom Cars' },
              { num: '5★', label: 'Community Rating' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '12px 20px', borderRight: i < 4 ? '1px solid rgba(232,160,32,0.08)' : 'none' }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 28, color: '#e8a020', marginBottom: 4 }}>{stat.num}</div>
                <div style={{ fontFamily: 'Barlow, sans-serif', fontSize: 12, color: 'rgba(138,155,176,0.6)', letterSpacing: 1, textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: 4, color: '#e8a020', marginBottom: 16, textTransform: 'uppercase' }}>Wat maakt ons uniek</p>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: 0.5 }}>
              WAAROM <span style={{ color: '#e8a020' }}>BROODJE RP</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {[
              { icon: '🎭', title: 'Immersive Roleplay', desc: 'Rijke verhaallijnen en karakters die de wereld tot leven brengen.' },
              { icon: '💼', title: 'Tientallen Jobs', desc: 'Legale en illegale banen in een volledig uitgewerkt economiesysteem.' },
              { icon: '🏎️', title: 'Custom Voertuigen', desc: 'Honderden exclusieve auto\'s met realistisch rijgedrag en tuning.' },
              { icon: '🏠', title: 'Vastgoed', desc: 'Koop panden, bouw je imperium en vestig je naam in de stad.' },
              { icon: '👮', title: '24/7 Staff', desc: 'Actief staff team dat zorgt voor een eerlijke en veilige speelomgeving.' },
              { icon: '🔄', title: 'Wekelijkse Updates', desc: 'Verse content en balancing updates gebaseerd op community feedback.' },
            ].map((feat, i) => (
              <div key={i} style={{
                background: 'rgba(15,22,36,0.7)', border: '1px solid rgba(232,160,32,0.08)',
                borderRadius: 14, padding: '28px 24px', transition: 'all 0.35s', position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(20,30,48,0.95)';
                e.currentTarget.style.borderColor = 'rgba(232,160,32,0.3)';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(232,160,32,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(15,22,36,0.7)';
                e.currentTarget.style.borderColor = 'rgba(232,160,32,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {/* Decorative corner */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'linear-gradient(225deg, rgba(232,160,32,0.06), transparent)', borderBottomLeftRadius: 60 }} />
                <div style={{ fontSize: 36, marginBottom: 18 }}>{feat.icon}</div>
                <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 10, color: '#eee8d8' }}>{feat.title}</h3>
                <p style={{ color: 'rgba(138,155,176,0.7)', fontSize: 14, lineHeight: 1.75 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto 100px', padding: '0 24px' }}>
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', padding: '72px 48px', textAlign: 'center', background: 'rgba(15,22,36,0.9)', border: '1px solid rgba(232,160,32,0.15)' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=60)', backgroundSize: 'cover', backgroundPosition: 'center bottom', opacity: 0.06 }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 200, background: 'radial-gradient(ellipse, rgba(232,160,32,0.12), transparent)', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative' }}>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(30px, 5vw, 50px)', marginBottom: 16 }}>
                SUPPORT DE <span style={{ color: '#e8a020' }}>SERVER</span>
              </h2>
              <p style={{ color: 'rgba(138,155,176,0.75)', fontSize: 16, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
                Elke donatie helpt de server beter te maken. Ontvang exclusieve in-game voordelen als dank!
              </p>
              <Link href="/store" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 36px',
                background: 'linear-gradient(135deg, #e8a020, #c48518)',
                color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: 2, textTransform: 'uppercase',
                borderRadius: 10, textDecoration: 'none', boxShadow: '0 0 32px rgba(232,160,32,0.4)',
              }}>🛒 Bekijk de Store</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
