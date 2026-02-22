import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.6 - 0.1,
        opacity: Math.random() * 0.55 + 0.1,
        hue: Math.random() > 0.85 ? 200 : 38,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 200
          ? `rgba(80,160,255,${p.opacity * 0.6})`
          : `rgba(232,160,32,${p.opacity})`;
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

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const num = parseInt(target.replace(/\D/g, '')) || 0;
        const step = Math.ceil(num / 60);
        const timer = setInterval(() => {
          start = Math.min(start + step, num);
          setCount(start);
          if (start >= num) clearInterval(timer);
        }, 24);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText('cfx.re/join/6axpqj');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.16) saturate(0.5)',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,9,15,0.4) 0%, rgba(6,9,15,0.0) 35%, rgba(6,9,15,0.0) 55%, rgba(6,9,15,1) 100%)' }} />
          {/* Color glow orbs */}
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '30%', right: '15%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(80,140,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 300, background: 'radial-gradient(ellipse, rgba(232,160,32,0.06) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px)',
            zIndex: 2,
          }} />
          <ParticleCanvas />

          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            backgroundImage: 'linear-gradient(rgba(232,160,32,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
          }} />

          <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '120px 24px 80px', maxWidth: 960, animation: 'fadeUp 0.9s ease both' }}>
            {/* Logo */}
            <div style={{ width: 130, height: 130, position: 'relative', margin: '0 auto 32px', animation: 'float 4s ease-in-out infinite' }}>
              <Image
                src="/logo.gif"
                alt="Broodje RP"
                fill
                style={{ objectFit: 'contain', mixBlendMode: 'screen', filter: 'drop-shadow(0 0 36px rgba(232,160,32,0.7)) drop-shadow(0 0 80px rgba(232,160,32,0.3))' }}
                unoptimized
              />
            </div>

            {/* Live badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, padding: '7px 20px', background: 'rgba(61,214,140,0.08)', border: '1px solid rgba(61,214,140,0.25)', borderRadius: 999 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3dd68c', boxShadow: '0 0 10px #3dd68c', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: 3, color: '#3dd68c' }}>SERVER ONLINE</span>
            </div>

            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(52px, 10vw, 112px)', lineHeight: 0.92, letterSpacing: -2, marginBottom: 28, textTransform: 'uppercase' }}>
              <span style={{ display: 'block', color: '#eee8d8' }}>BROODJE</span>
              <span style={{
                display: 'block',
                background: 'linear-gradient(90deg, #c48518, #f0c050, #ffdc6e, #e8a020, #c48518)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                animation: 'shimmer 4s linear infinite',
                filter: 'drop-shadow(0 0 40px rgba(232,160,32,0.5))',
              }}>ROLEPLAY</span>
            </h1>

            <p style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: 18, color: 'rgba(238,232,216,0.7)', letterSpacing: 0.5, maxWidth: 560, margin: '0 auto 44px', lineHeight: 1.75 }}>
              Beleef de ultieme FiveM ervaring. Unieke jobs, custom cars, spannende verhaallijnen en een community die leeft.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
              <Link href="/store" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 30px',
                background: 'linear-gradient(135deg, #e8a020, #c48518)',
                color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase',
                borderRadius: 11, textDecoration: 'none',
                boxShadow: '0 0 32px rgba(232,160,32,0.5), 0 8px 32px rgba(0,0,0,0.4)',
                transition: 'all 0.3s', animation: 'glow-pulse 3s infinite',
              }}>🛒 Donatie Store</Link>

              <a href="https://cfx.re/join/6axpqj" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 28px',
                background: 'rgba(61,214,140,0.08)', border: '1px solid rgba(61,214,140,0.3)',
                color: '#3dd68c', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase',
                borderRadius: 11, textDecoration: 'none', transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(61,214,140,0.14)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(61,214,140,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(61,214,140,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}>
                🎮 Nu Spelen
              </a>

              <a href="https://discord.gg/broodjerp" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 28px',
                background: 'rgba(88,101,242,0.12)', border: '1px solid rgba(88,101,242,0.32)',
                color: 'rgba(160,170,255,0.9)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase',
                borderRadius: 11, textDecoration: 'none', transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(88,101,242,0.2)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(88,101,242,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(88,101,242,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}>
                💬 Discord
              </a>
            </div>

            {/* Server link */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,160,32,0.18)', borderRadius: 11, overflow: 'hidden' }}>
              <span style={{ padding: '10px 15px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: 2, color: 'rgba(232,160,32,0.65)', borderRight: '1px solid rgba(232,160,32,0.12)' }}>SERVER</span>
              <button onClick={handleCopy} style={{
                padding: '10px 18px', background: 'transparent', border: 'none',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: copied ? '#3dd68c' : '#e8a020', letterSpacing: 1, cursor: 'pointer', transition: 'color 0.3s',
              }}>
                {copied ? '✓ Gekopieerd!' : 'cfx.re/join/6axpqj'}
              </button>
              <span style={{ padding: '10px 13px', fontSize: 13, color: 'rgba(138,155,176,0.5)', borderLeft: '1px solid rgba(232,160,32,0.08)' }}>📋</span>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(transparent, #06090f)', zIndex: 2 }} />
        </section>

        {/* ── STATS BAR ── */}
        <section style={{ position: 'relative', zIndex: 4, background: 'rgba(8,12,22,0.95)', borderTop: '1px solid rgba(232,160,32,0.1)', borderBottom: '1px solid rgba(232,160,32,0.1)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 0 }}>
            {[
              { num: '3500', suffix: '+', label: 'Community Leden', color: '#e8a020' },
              { num: '80', suffix: '+', label: 'Staff Leden', color: '#a78bfa' },
              { num: '24', suffix: '/', label: 'Staff Online', color: '#3dd68c' },
              { num: '100', suffix: '+', label: 'Custom Voertuigen', color: '#60a5fa' },
              { num: '5', suffix: '★', label: 'Community Rating', color: '#fbbf24' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '26px 20px', borderRight: i < 4 ? '1px solid rgba(232,160,32,0.07)' : 'none', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`, opacity: 0.5 }} />
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 30, color: stat.color, marginBottom: 5, letterSpacing: -0.5 }}>
                  <CountUp target={stat.num + stat.suffix} suffix={stat.suffix} />
                </div>
                <div style={{ fontFamily: 'Barlow, sans-serif', fontSize: 11, color: 'rgba(160,175,190,0.65)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '5px 16px', background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: 999 }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: 3, color: '#e8a020', textTransform: 'uppercase' }}>Wat maakt ons uniek</span>
            </div>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(32px, 5vw, 54px)', letterSpacing: 0.5 }}>
              WAAROM <span style={{ color: '#e8a020' }}>BROODJE RP</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {[
              { icon: '🎭', title: 'Immersive Roleplay', desc: 'Rijke verhaallijnen en karakters die de wereld tot leven brengen.', color: '#e8a020' },
              { icon: '💼', title: 'Tientallen Jobs', desc: 'Legale en illegale banen in een volledig uitgewerkt economiesysteem.', color: '#a78bfa' },
              { icon: '🏎️', title: 'Custom Voertuigen', desc: 'Honderden exclusieve auto\'s met realistisch rijgedrag en tuning.', color: '#60a5fa' },
              { icon: '🏠', title: 'Vastgoed', desc: 'Koop panden, bouw je imperium en vestig je naam in de stad.', color: '#34d399' },
              { icon: '👮', title: '24/7 Staff', desc: 'Actief staff team dat zorgt voor een eerlijke en veilige speelomgeving.', color: '#f87171' },
              { icon: '🔄', title: 'Wekelijkse Updates', desc: 'Verse content en balancing updates gebaseerd op community feedback.', color: '#fbbf24' },
            ].map((feat, i) => (
              <div key={i} style={{
                background: 'rgba(12,18,32,0.8)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 16, padding: '30px 26px', transition: 'all 0.35s', position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(18,26,46,0.98)';
                e.currentTarget.style.borderColor = `${feat.color}30`;
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${feat.color}10`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(12,18,32,0.8)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at 100% 0%, ${feat.color}12, transparent 70%)` }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${feat.color}40, transparent)`, opacity: 0, transition: 'opacity 0.3s' }} className="feat-line" />
                <div style={{ fontSize: 38, marginBottom: 18, filter: `drop-shadow(0 0 12px ${feat.color}50)` }}>{feat.icon}</div>
                <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 21, marginBottom: 10, color: '#eee8d8' }}>{feat.title}</h3>
                <p style={{ color: 'rgba(160,175,190,0.75)', fontSize: 14, lineHeight: 1.8 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto 100px', padding: '0 24px' }}>
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', padding: '80px 48px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(12,18,32,0.98), rgba(18,26,46,0.98))', border: '1px solid rgba(232,160,32,0.18)' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=60)', backgroundSize: 'cover', backgroundPosition: 'center bottom', opacity: 0.05 }} />
            <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%,-50%)', width: 400, height: 200, background: 'radial-gradient(ellipse, rgba(232,160,32,0.15), transparent)', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', top: '50%', right: '20%', transform: 'translate(50%,-50%)', width: 350, height: 200, background: 'radial-gradient(ellipse, rgba(88,101,242,0.12), transparent)', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative' }}>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(30px, 5vw, 52px)', marginBottom: 16 }}>
                SUPPORT DE <span style={{ color: '#e8a020' }}>SERVER</span>
              </h2>
              <p style={{ color: 'rgba(160,175,190,0.8)', fontSize: 16, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
                Elke donatie helpt de server beter te maken. Ontvang exclusieve in-game voordelen als dank!
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/store" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px',
                  background: 'linear-gradient(135deg, #e8a020, #c48518)',
                  color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: 2, textTransform: 'uppercase',
                  borderRadius: 11, textDecoration: 'none', boxShadow: '0 0 32px rgba(232,160,32,0.4)', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 48px rgba(232,160,32,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(232,160,32,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  🛒 Bekijk de Store
                </Link>
                <a href="https://discord.gg/broodjerp" target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px',
                  background: 'rgba(88,101,242,0.12)', border: '1px solid rgba(88,101,242,0.35)',
                  color: 'rgba(160,170,255,0.9)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase',
                  borderRadius: 11, textDecoration: 'none', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(88,101,242,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(88,101,242,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  💬 Join Discord
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }
        @keyframes shimmer { to { background-position: 200% center; } }
        @keyframes pulse { 0%,100% { opacity: 1; box-shadow: 0 0 10px #3dd68c; } 50% { opacity: 0.5; box-shadow: 0 0 20px #3dd68c; } }
        @keyframes glow-pulse { 0%,100% { box-shadow: 0 0 32px rgba(232,160,32,0.5), 0 8px 32px rgba(0,0,0,0.4); } 50% { box-shadow: 0 0 50px rgba(232,160,32,0.75), 0 8px 40px rgba(0,0,0,0.5); } }
      `}</style>
    </>
  );
}
