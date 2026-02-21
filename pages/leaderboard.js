import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function fmt(amount, currency = 'EUR') {
  try { return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(amount); }
  catch { return `€${parseFloat(amount).toFixed(2)}`; }
}

function getRankStyle(rank) {
  if (rank === 1) return { color: '#FFD700', icon: '👑', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.3)', glow: 'rgba(255,215,0,0.15)' };
  if (rank === 2) return { color: '#C0C0C0', icon: '🥈', bg: 'rgba(192,192,192,0.06)', border: 'rgba(192,192,192,0.22)', glow: 'none' };
  if (rank === 3) return { color: '#CD7F32', icon: '🥉', bg: 'rgba(205,127,50,0.06)', border: 'rgba(205,127,50,0.22)', glow: 'none' };
  return { color: 'rgba(160,175,190,0.7)', icon: null, bg: 'rgba(12,18,32,0.8)', border: 'rgba(255,255,255,0.05)', glow: 'none' };
}

export default function Leaderboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawDebug, setRawDebug] = useState(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const r = await fetch('/api/tebex/payments');
        const data = await r.json();

        if (!r.ok) {
          setRawDebug(JSON.stringify(data, null, 2));
          throw new Error(data.error || data.detail || `Tebex ${r.status}`);
        }

        const raw = Array.isArray(data) ? data : (data.data || data.payments || []);
        setRawDebug(`${raw.length} betalingen ontvangen`);

        if (raw.length === 0) {
          setPayments([]);
          return;
        }

        const totals = {};
        raw.forEach(payment => {
          const status = String(payment.status || '').toLowerCase();
          if (!['complete', 'completed', '1'].includes(status) && payment.status !== 1) return;

          const name =
            payment.player?.username ||
            payment.player?.name ||
            payment.username ||
            payment.player_name ||
            payment.email?.split('@')[0] ||
            'Onbekend';

          const avatar =
            payment.player?.meta?.avatar ||
            payment.player?.avatar ||
            payment.player?.meta?.img ||
            null;

          const amount = parseFloat(
            payment.amount ?? payment.price ?? payment.total_price ?? payment.gross_revenue ?? 0
          );
          const cur = payment.currency || payment.currency_iso || 'EUR';

          if (!totals[name]) totals[name] = { name, avatar, total: 0, count: 0, currency: cur };
          totals[name].total += amount;
          totals[name].count += 1;
        });

        const sorted = Object.values(totals)
          .filter(p => p.total > 0)
          .sort((a, b) => b.total - a.total)
          .slice(0, 25);

        setPayments(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <>
      <Head>
        <title>Leaderboard – Broodje RP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <main style={{ paddingTop: 92, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* BG */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'linear-gradient(135deg, #06090f 0%, #0a0e1a 50%, #06090f 100%)' }} />
        <div style={{ position: 'fixed', top: '10%', left: '20%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none' }} />

        {/* Hero */}
        <div style={{ position: 'relative', padding: '52px 24px 40px', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,215,0,0.04) 0%, transparent 100%)', borderBottom: '1px solid rgba(232,160,32,0.08)' }} />
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 500, height: 180, background: 'radial-gradient(ellipse, rgba(255,215,0,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 16px', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.22)', borderRadius: 999, marginBottom: 16, fontSize: 11, color: '#FFD700', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 1.5 }}>
              👑 TOPDONATEURS
            </div>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(36px, 7vw, 68px)', letterSpacing: 0.5, marginBottom: 10 }}>
              DONATIE <span style={{ color: '#e8a020' }}>LEADERBOARD</span>
            </h1>
            <p style={{ color: 'rgba(160,175,190,0.75)', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>
              De helden die de server draaiende houden. Dankjewel voor jullie support! ❤️
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 20px 80px' }}>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 44, height: 44, border: '3px solid rgba(255,215,0,0.1)', borderTop: '3px solid #FFD700', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 18px' }} />
              <p style={{ color: 'rgba(160,175,190,0.5)', fontSize: 14 }}>Leaderboard laden...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ background: 'rgba(232,64,64,0.05)', border: '1px solid rgba(232,64,64,0.18)', borderRadius: 14, padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8, color: '#e84040' }}>Kon leaderboard niet laden</h3>
              <p style={{ color: 'rgba(220,200,190,0.7)', fontSize: 14, marginBottom: 18, fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '8px 14px', borderRadius: 8, display: 'inline-block' }}>{error}</p>
              <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '16px 20px', textAlign: 'left', maxWidth: 520, margin: '0 auto 18px' }}>
                <p style={{ color: '#e8a020', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Mogelijke oorzaken:</p>
                <p style={{ color: 'rgba(160,175,190,0.85)', fontSize: 13, lineHeight: 2.1 }}>
                  1. Vercel env var heet <code style={{ color: '#e8a020', background: 'rgba(232,160,32,0.1)', padding: '1px 6px', borderRadius: 4 }}>TEBEX_SECRET_KEY</code> (gebruik dit exacte naam)<br/>
                  2. Na toevoegen: <strong>Redeploy</strong> vereist in Vercel dashboard<br/>
                  3. Key moet zijn: <strong>Plugin Secret</strong> van creator.tebex.io → Settings → API<br/>
                  4. Controleer of je Tebex webstore al betalingen heeft ontvangen
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/api/tebex/payments" target="_blank" style={{ padding: '8px 16px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.25)', borderRadius: 7, color: '#e8a020', fontSize: 12, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, textDecoration: 'none', letterSpacing: 0.5 }}>
                  🔍 Bekijk API response
                </a>
              </div>
            </div>
          )}

          {/* Podium top 3 */}
          {!loading && !error && payments.length >= 3 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 10, marginBottom: 28 }}>
              {[1, 0, 2].map(idx => {
                const player = payments[idx];
                const rank = idx + 1;
                const style = getRankStyle(rank);
                const isFirst = idx === 0;
                return (
                  <div key={idx} style={{ textAlign: 'center', flex: 1, maxWidth: isFirst ? 220 : 190 }}>
                    <div style={{ fontSize: isFirst ? 38 : 28, marginBottom: 8 }}>{style.icon}</div>
                    <div style={{
                      background: style.bg, border: `2px solid ${style.border}`,
                      borderRadius: '12px 12px 0 0',
                      padding: isFirst ? '24px 14px 28px' : '18px 12px 22px',
                      boxShadow: isFirst ? `0 0 40px ${style.glow}` : 'none',
                    }}>
                      {player.avatar
                        ? <img src={player.avatar} alt="" style={{ width: isFirst ? 56 : 44, height: isFirst ? 56 : 44, borderRadius: '50%', marginBottom: 10, border: `2px solid ${style.border}`, display: 'block', margin: '0 auto 10px' }} />
                        : <div style={{ width: isFirst ? 56 : 44, height: isFirst ? 56 : 44, borderRadius: '50%', background: `${style.color}18`, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎮</div>}
                      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: isFirst ? 800 : 700, fontSize: isFirst ? 17 : 15, marginBottom: 5, color: '#eee8d8' }}>{player.name}</p>
                      <p style={{ color: style.color, fontWeight: 800, fontSize: isFirst ? 18 : 15, textShadow: isFirst ? `0 0 20px ${style.color}60` : 'none' }}>{fmt(player.total, player.currency)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full list */}
          {!loading && !error && (
            <div>
              {payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 14, opacity: 0.2 }}>🏆</div>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'rgba(160,175,190,0.6)' }}>Nog geen donateurs</p>
                  <p style={{ color: 'rgba(138,155,176,0.4)', fontSize: 14 }}>Wees de eerste op het leaderboard!</p>
                  {rawDebug && <p style={{ color: 'rgba(232,160,32,0.4)', fontSize: 12, marginTop: 12, fontFamily: 'monospace' }}>{rawDebug}</p>}
                </div>
              ) : payments.map((player, i) => {
                const rank = i + 1;
                const style = getRankStyle(rank);
                return (
                  <div key={player.name} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 18px', marginBottom: 6,
                    background: style.bg, border: `1px solid ${style.border}`,
                    borderRadius: 11, transition: 'all 0.2s', cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = rank <= 3 ? style.border : 'rgba(232,160,32,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = style.border; }}>
                    <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                      {style.icon
                        ? <span style={{ fontSize: 24 }}>{style.icon}</span>
                        : <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 18, color: style.color }}>#{rank}</span>}
                    </div>
                    {player.avatar
                      ? <img src={player.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px solid ${style.border}`, flexShrink: 0, objectFit: 'cover' }} />
                      : <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${style.color}14`, border: `1.5px solid ${style.border}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎮</div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 17, color: style.color, marginBottom: 1 }}>{player.name}</p>
                      <p style={{ color: 'rgba(138,155,176,0.5)', fontSize: 11, letterSpacing: 0.5 }}>{player.count} donatie{player.count !== 1 ? 's' : ''}</p>
                    </div>
                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 19, color: style.color, flexShrink: 0 }}>{fmt(player.total, player.currency)}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          {!loading && !error && (
            <div style={{ marginTop: 44, textAlign: 'center', padding: '36px 32px', background: 'rgba(12,18,32,0.9)', border: '1px solid rgba(232,160,32,0.12)', borderRadius: 14 }}>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 26, marginBottom: 8 }}>
                Kom op het <span style={{ color: '#e8a020' }}>leaderboard</span>!
              </h3>
              <p style={{ color: 'rgba(160,175,190,0.65)', fontSize: 14, marginBottom: 22 }}>Doneer aan de server en ontvang exclusieve voordelen in-game.</p>
              <a href="/store" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg, #e8a020, #c48518)', color: '#080c14', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: 1, borderRadius: 9, textDecoration: 'none', boxShadow: '0 0 22px rgba(232,160,32,0.35)' }}>
                🛒 Naar de Store
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
