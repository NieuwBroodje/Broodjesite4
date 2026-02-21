import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function formatPrice(amount, currency = 'EUR') {
  try { return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(amount); }
  catch { return `€${parseFloat(amount).toFixed(2)}`; }
}

function getRankStyle(rank) {
  if (rank === 1) return { color: '#FFD700', icon: '👑', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.35)' };
  if (rank === 2) return { color: '#C0C0C0', icon: '🥈', bg: 'rgba(192,192,192,0.08)', border: 'rgba(192,192,192,0.25)' };
  if (rank === 3) return { color: '#CD7F32', icon: '🥉', bg: 'rgba(205,127,50,0.08)', border: 'rgba(205,127,50,0.25)' };
  return { color: 'rgba(138,155,176,0.7)', icon: null, bg: 'rgba(17,25,39,0.7)', border: 'rgba(232,160,32,0.08)' };
}

export default function Leaderboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const r = await fetch('/api/tebex/payments');
        if (!r.ok) {
          const e = await r.json();
          throw new Error(e.error || `API fout ${r.status}`);
        }
        const data = await r.json();
        const raw = Array.isArray(data) ? data : (data.data || []);

        // Aggregate by player username
        const totals = {};
        raw.forEach(payment => {
          if (payment.status !== 'Complete' && payment.status !== 'complete') return;
          const name = payment.player?.name || payment.username || 'Onbekend';
          const avatar = payment.player?.meta?.avatar || null;
          const amount = parseFloat(payment.amount || payment.price || 0);
          if (!totals[name]) totals[name] = { name, avatar, total: 0, count: 0, currency: payment.currency || 'EUR' };
          totals[name].total += amount;
          totals[name].count += 1;
        });

        const sorted = Object.values(totals).sort((a, b) => b.total - a.total).slice(0, 25);
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

      <main style={{ paddingTop: 80, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <div style={{ position: 'relative', padding: '56px 24px 44px', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(232,160,32,0.07) 0%, transparent 100%)', borderBottom: '1px solid rgba(232,160,32,0.09)' }} />
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 500, height: 200, background: 'radial-gradient(ellipse, rgba(232,160,32,0.15) 0%, transparent 70%)', filter: 'blur(35px)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 999, marginBottom: 18, fontSize: 12, color: '#FFD700', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 1 }}>
              👑 TOPDONATEURS
            </div>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(38px, 7vw, 72px)', letterSpacing: 1, marginBottom: 12 }}>
              DONATIE <span style={{ color: '#e8a020' }}>LEADERBOARD</span>
            </h1>
            <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              De helden die de server draaiende houden. Dankjewel voor jullie support! ❤️
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 48, height: 48, border: '3px solid rgba(232,160,32,0.12)', borderTop: '3px solid #e8a020', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
              <p style={{ color: 'rgba(138,155,176,0.5)', fontSize: 15 }}>Leaderboard laden...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ background: 'rgba(232,64,64,0.06)', border: '1px solid rgba(232,64,64,0.22)', borderRadius: 14, padding: '36px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>⚠️</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#e84040' }}>Kon leaderboard niet laden</h3>
              <p style={{ color: 'rgba(240,232,216,0.7)', fontSize: 14, marginBottom: 16 }}>{error}</p>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '16px 20px', textAlign: 'left', maxWidth: 500, margin: '0 auto' }}>
                <p style={{ color: '#e8a020', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Vereist:</p>
                <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 13, lineHeight: 1.9 }}>
                  Voeg je <strong style={{ color: '#f0e8d8' }}>Private Key</strong> toe in Vercel:<br />
                  Naam: <code style={{ color: '#e8a020' }}>TEBEX_SECRET_KEY</code><br />
                  Waarde: je Private Key van creator.tebex.io → API Keys
                </p>
              </div>
            </div>
          )}

          {/* Top 3 podium */}
          {!loading && !error && payments.length >= 3 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 32 }}>
              {/* 2nd */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: 200 }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 28, color: '#C0C0C0', marginBottom: 8 }}>🥈</div>
                <div style={{
                  background: 'rgba(192,192,192,0.08)', border: '2px solid rgba(192,192,192,0.3)',
                  borderRadius: '12px 12px 0 0', padding: '20px 16px 24px',
                }}>
                  {payments[1].avatar ? (
                    <img src={payments[1].avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', marginBottom: 8, border: '2px solid rgba(192,192,192,0.5)' }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(192,192,192,0.15)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎮</div>
                  )}
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{payments[1].name}</p>
                  <p style={{ color: '#C0C0C0', fontWeight: 700, fontSize: 15 }}>{formatPrice(payments[1].total, payments[1].currency)}</p>
                </div>
              </div>

              {/* 1st */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: 220 }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 36, marginBottom: 8 }}>👑</div>
                <div style={{
                  background: 'rgba(255,215,0,0.1)', border: '2px solid rgba(255,215,0,0.45)',
                  borderRadius: '12px 12px 0 0', padding: '24px 16px 28px',
                  boxShadow: '0 0 40px rgba(255,215,0,0.15)',
                }}>
                  {payments[0].avatar ? (
                    <img src={payments[0].avatar} alt="" style={{ width: 60, height: 60, borderRadius: '50%', marginBottom: 10, border: '3px solid rgba(255,215,0,0.6)' }} />
                  ) : (
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,215,0,0.15)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎮</div>
                  )}
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{payments[0].name}</p>
                  <p style={{ color: '#FFD700', fontWeight: 800, fontSize: 18, textShadow: '0 0 20px rgba(255,215,0,0.4)' }}>{formatPrice(payments[0].total, payments[0].currency)}</p>
                </div>
              </div>

              {/* 3rd */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: 200 }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 28, color: '#CD7F32', marginBottom: 8 }}>🥉</div>
                <div style={{
                  background: 'rgba(205,127,50,0.08)', border: '2px solid rgba(205,127,50,0.3)',
                  borderRadius: '12px 12px 0 0', padding: '20px 16px 20px',
                }}>
                  {payments[2].avatar ? (
                    <img src={payments[2].avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', marginBottom: 8, border: '2px solid rgba(205,127,50,0.5)' }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(205,127,50,0.15)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎮</div>
                  )}
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{payments[2].name}</p>
                  <p style={{ color: '#CD7F32', fontWeight: 700, fontSize: 15 }}>{formatPrice(payments[2].total, payments[2].currency)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Full list */}
          {!loading && !error && (
            <div>
              {payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🏆</div>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Nog geen donateurs</p>
                  <p style={{ color: 'rgba(138,155,176,0.6)', fontSize: 14 }}>Wees de eerste op het leaderboard!</p>
                </div>
              ) : payments.map((player, i) => {
                const rank = i + 1;
                const style = getRankStyle(rank);
                return (
                  <div key={player.name} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', marginBottom: 8,
                    background: style.bg, border: `1px solid ${style.border}`,
                    borderRadius: 12, transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

                    {/* Rank */}
                    <div style={{ width: 44, textAlign: 'center', flexShrink: 0 }}>
                      {style.icon ? (
                        <span style={{ fontSize: 28 }}>{style.icon}</span>
                      ) : (
                        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 20, color: style.color }}>#{rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    {player.avatar ? (
                      <img src={player.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', border: `2px solid ${style.border}`, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${style.color}20`, border: `2px solid ${style.border}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎮</div>
                    )}

                    {/* Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 18, color: style.color, marginBottom: 2 }}>
                        {player.name}
                      </p>
                      <p style={{ color: 'rgba(138,155,176,0.55)', fontSize: 12 }}>{player.count} donatie{player.count !== 1 ? 's' : ''}</p>
                    </div>

                    {/* Total */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 20, color: style.color }}>
                        {formatPrice(player.total, player.currency)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          {!loading && !error && (
            <div style={{ marginTop: 48, textAlign: 'center', padding: '40px', background: 'rgba(17,25,39,0.8)', border: '1px solid rgba(232,160,32,0.15)', borderRadius: 14 }}>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 28, marginBottom: 10 }}>
                Kom op het <span style={{ color: '#e8a020' }}>leaderboard</span>!
              </h3>
              <p style={{ color: 'rgba(138,155,176,0.7)', fontSize: 15, marginBottom: 24 }}>
                Doneer aan de server en ontvang exclusieve voordelen in-game.
              </p>
              <a href="/store" style={{
                display: 'inline-block', padding: '13px 32px',
                background: 'linear-gradient(135deg, #e8a020, #c48518)',
                color: '#080c14', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: 1,
                borderRadius: 9, textDecoration: 'none', boxShadow: '0 0 24px rgba(232,160,32,0.4)',
              }}>🛒 Naar de Store</a>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
