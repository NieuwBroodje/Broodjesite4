import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function fmt(amount, currency = 'EUR') {
  try { return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(parseFloat(amount)); }
  catch { return `€${parseFloat(amount).toFixed(2)}`; }
}

function getFavs() { try { return JSON.parse(localStorage.getItem('brp_favs') || '[]'); } catch { return []; } }

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [favs, setFavs] = useState([]);
  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [stats, setStats] = useState({ total: 0, count: 0 });

  useEffect(() => {
    const savedUser = sessionStorage.getItem('tebex_user');
    if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch {} }
    setFavs(getFavs());
  }, []);

  // Load packages for fav names
  useEffect(() => {
    fetch('/api/tebex/categories').then(r => r.json()).then(d => {
      const cats = Array.isArray(d) ? d : (d.data || []);
      const pkgs = [];
      cats.forEach(c => (c.packages || []).forEach(p => { if (!pkgs.find(x => x.id === p.id)) pkgs.push(p); }));
      setPackages(pkgs);
    }).catch(() => {});
  }, []);

  // Load orders when user is known
  useEffect(() => {
    if (!user?.username) return;
    setLoadingOrders(true);
    fetch('/api/tebex/payments').then(r => r.json()).then(data => {
      const raw = Array.isArray(data) ? data : (data.data || data.payments || []);
      const userOrders = raw.filter(p => {
        const name = p.player?.username || p.player?.name || p.username || '';
        return name.toLowerCase() === user.username.toLowerCase();
      }).sort((a, b) => new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0));
      setOrders(userOrders);
      const total = userOrders.filter(p => ['complete','completed'].includes(String(p.status).toLowerCase()))
        .reduce((sum, p) => sum + parseFloat(p.amount || p.price || 0), 0);
      setStats({ total, count: userOrders.length });
    }).catch(() => {}).finally(() => setLoadingOrders(false));
  }, [user]);

  function handleLogout() {
    sessionStorage.removeItem('tebex_user'); sessionStorage.removeItem('tebex_basket');
    setUser(null); router.push('/store');
  }

  const statusStyle = (s) => {
    const st = String(s).toLowerCase();
    if (st === 'complete' || st === 'completed') return { color: '#3dd68c', bg: 'rgba(61,214,140,0.1)', border: 'rgba(61,214,140,0.25)', label: '✓ Voltooid' };
    if (st === 'pending') return { color: '#e8a020', bg: 'rgba(232,160,32,0.1)', border: 'rgba(232,160,32,0.25)', label: '⏳ In behandeling' };
    if (st === 'refunded') return { color: '#f05060', bg: 'rgba(240,80,96,0.1)', border: 'rgba(240,80,96,0.25)', label: '↩ Terugbetaald' };
    return { color: 'rgba(160,175,190,0.6)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', label: s };
  };

  return (
    <>
      <Head><title>Profiel – Broodje RP</title><link rel="icon" href="/favicon.ico" /></Head>
      <Navbar user={user} onLogout={handleLogout} />

      <main style={{ paddingTop: 92, minHeight: '100vh', position: 'relative' }}>
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'linear-gradient(135deg, #06090f 0%, #0a0e1a 100%)' }} />
        <div style={{ position: 'fixed', top: '15%', left: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(61,214,140,0.04) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none' }} />

        {/* Not logged in */}
        {!user && (
          <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🔒</div>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 32, marginBottom: 12 }}>Niet ingelogd</h2>
            <p style={{ color: 'rgba(160,175,190,0.65)', marginBottom: 28 }}>Log in via de store om je profiel te bekijken.</p>
            <Link href="/store" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg,#e8a020,#c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 15, borderRadius: 10, textDecoration: 'none' }}>🎮 Naar de Store</Link>
          </div>
        )}

        {user && (
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>
            {/* Profile header */}
            <div style={{ background: 'rgba(12,18,32,0.95)', border: '1px solid rgba(61,214,140,0.15)', borderRadius: 18, padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(61,214,140,0.2), rgba(61,214,140,0.05))',
                  border: '2px solid rgba(61,214,140,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
                  boxShadow: '0 0 24px rgba(61,214,140,0.15)',
                }}>🎮</div>
                <div>
                  <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 28, color: '#eee8d8', marginBottom: 4 }}>{user.username}</h1>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', background: 'rgba(61,214,140,0.08)', border: '1px solid rgba(61,214,140,0.2)', borderRadius: 999 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3dd68c', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: 1.5, color: '#3dd68c' }}>CFX VERBONDEN</span>
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} style={{ padding: '9px 18px', background: 'rgba(240,80,96,0.08)', border: '1px solid rgba(240,80,96,0.22)', borderRadius: 9, color: '#f05060', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,80,96,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(240,80,96,0.08)'}>
                Uitloggen
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { icon: '💳', label: 'Totaal gedoneerd', value: fmt(stats.total), color: '#e8a020' },
                { icon: '📦', label: 'Bestellingen', value: stats.count, color: '#3dd68c' },
                { icon: '❤️', label: 'Favorieten', value: favs.length, color: '#f05078' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(12,18,32,0.9)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 24, color: s.color, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(160,175,190,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {[['orders', '📦 Bestellingen'], ['favs', '❤️ Favorieten']].map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)} style={{ padding: '9px 20px', background: activeTab === id ? 'linear-gradient(135deg,#e8a020,#c48518)' : 'rgba(255,255,255,0.04)', border: `1px solid ${activeTab === id ? 'transparent' : 'rgba(255,255,255,0.08)'}`, borderRadius: 9, color: activeTab === id ? '#06090f' : 'rgba(238,232,216,0.6)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>{label}</button>
              ))}
            </div>

            {/* Orders tab */}
            {activeTab === 'orders' && (
              <div>
                {loadingOrders && (
                  <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <div style={{ width: 40, height: 40, border: '2px solid rgba(232,160,32,0.1)', borderTop: '2px solid #e8a020', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 14px' }} />
                    <p style={{ color: 'rgba(160,175,190,0.5)', fontSize: 14 }}>Bestellingen laden...</p>
                  </div>
                )}
                {!loadingOrders && orders.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(12,18,32,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14 }}>
                    <div style={{ fontSize: 48, marginBottom: 14, opacity: 0.25 }}>📦</div>
                    <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 8, color: 'rgba(160,175,190,0.6)' }}>Nog geen bestellingen</h3>
                    <p style={{ color: 'rgba(138,155,176,0.4)', fontSize: 14, marginBottom: 24 }}>Bestellingen verschijnen hier nadat je iets gekocht hebt.</p>
                    <Link href="/store" style={{ display: 'inline-block', padding: '11px 24px', background: 'linear-gradient(135deg,#e8a020,#c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 14, borderRadius: 9, textDecoration: 'none' }}>🛒 Naar de Store</Link>
                  </div>
                )}
                {!loadingOrders && orders.map((order, i) => {
                  const s = statusStyle(order.status);
                  const date = order.date || order.created_at;
                  const amount = parseFloat(order.amount || order.price || 0);
                  const currency = order.currency || order.currency_iso || 'EUR';
                  const pkgList = order.packages || order.products || [];
                  return (
                    <div key={i} style={{ background: 'rgba(12,18,32,0.9)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '18px 22px', marginBottom: 10, transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,160,32,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                            <span style={{ padding: '3px 10px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 6, fontSize: 11, color: s.color, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 0.5 }}>{s.label}</span>
                            {date && <span style={{ fontSize: 12, color: 'rgba(138,155,176,0.45)' }}>{new Date(date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                            {order.transaction_id && <span style={{ fontSize: 11, color: 'rgba(138,155,176,0.3)', fontFamily: 'monospace' }}>#{order.transaction_id}</span>}
                          </div>
                          {pkgList.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {pkgList.map((p, j) => (
                                <span key={j} style={{ padding: '3px 10px', background: 'rgba(232,160,32,0.07)', border: '1px solid rgba(232,160,32,0.14)', borderRadius: 6, fontSize: 12, color: 'rgba(232,160,32,0.8)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                                  {p.name || p.title || `Pakket #${p.id}`}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 22, color: '#e8a020', marginBottom: 8 }}>{fmt(amount, currency)}</p>
                          {s.label === '✓ Voltooid' && (
                            <Link href="/store" style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.25)', borderRadius: 7, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>
                              🔄 Opnieuw bestellen
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Favs tab */}
            {activeTab === 'favs' && (
              <div>
                {favs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(12,18,32,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14 }}>
                    <div style={{ fontSize: 48, marginBottom: 14, opacity: 0.25 }}>🤍</div>
                    <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 8, color: 'rgba(160,175,190,0.6)' }}>Geen favorieten</h3>
                    <p style={{ color: 'rgba(138,155,176,0.4)', fontSize: 14, marginBottom: 24 }}>Klik op ❤️ bij een pakket om het hier op te slaan.</p>
                    <Link href="/store" style={{ display: 'inline-block', padding: '11px 24px', background: 'linear-gradient(135deg,#e8a020,#c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 14, borderRadius: 9, textDecoration: 'none' }}>🛒 Browse de Store</Link>
                  </div>
                )}
                {favs.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                    {favs.map(id => {
                      const pkg = packages.find(p => p.id === id);
                      const price = parseFloat(pkg?.total_price ?? pkg?.base_price ?? 0);
                      return (
                        <div key={id} style={{ background: 'rgba(12,18,32,0.9)', border: '1px solid rgba(240,80,120,0.12)', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,80,120,0.35)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(240,80,120,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                          <div style={{ width: '100%', aspectRatio: '2/1', background: pkg?.image ? `url(${pkg.image}) center/cover` : 'linear-gradient(135deg,rgba(240,80,120,0.08),transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, opacity: pkg?.image ? 1 : 0.3 }}>
                            {!pkg?.image && '🎁'}
                          </div>
                          <div style={{ padding: '13px' }}>
                            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, color: '#eee8d8', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pkg?.name || `Pakket #${id}`}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                              <span style={{ color: '#e8a020', fontWeight: 700, fontSize: 14 }}>{price === 0 ? 'Gratis' : fmt(price, pkg?.currency || 'EUR')}</span>
                              <Link href="/store" style={{ padding: '5px 12px', background: 'linear-gradient(135deg,#e8a020,#c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, borderRadius: 7, textDecoration: 'none' }}>Kopen</Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
