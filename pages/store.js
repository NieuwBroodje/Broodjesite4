import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function formatPrice(price, currency = 'EUR') {
  const num = parseFloat(price);
  if (isNaN(num) || num === 0) return 'Gratis';
  try { return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(num); }
  catch { return `€${num.toFixed(2)}`; }
}

// ── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose, basket, packages, onRemove, onCheckout, loading, user, onLogin }) {
  const items = basket?.data?.packages || [];
  const total = basket?.data?.total_price ?? basket?.data?.base_price ?? 0;
  const currency = basket?.data?.currency || 'EUR';
  const checkoutUrl = basket?.data?.links?.checkout;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s',
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '96vw',
        zIndex: 201, background: 'linear-gradient(180deg, #0d1825 0%, #080c14 100%)',
        borderLeft: '1px solid rgba(232,160,32,0.18)',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(232,160,32,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(232,160,32,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🛒</span>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22 }}>Winkelwagen</h2>
            {items.length > 0 && (
              <span style={{
                background: '#e8a020', color: '#080c14', borderRadius: '50%',
                width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 12,
              }}>{items.length}</span>
            )}
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, width: 36, height: 36, color: '#f0e8d8', fontSize: 18,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* CFX login notice */}
        {!user && (
          <div style={{
            margin: '16px 16px 0',
            padding: '14px 16px',
            background: 'rgba(232,160,32,0.07)',
            border: '1px solid rgba(232,160,32,0.2)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>ℹ️</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#e8a020' }}>
                Log in voor checkout
              </p>
              <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 12, lineHeight: 1.5 }}>
                Je moet inloggen met je CFX account zodat je pakket aan je speler wordt gekoppeld.
              </p>
            </div>
            <button onClick={onLogin} style={{
              padding: '7px 12px', background: 'rgba(232,160,32,0.15)',
              border: '1px solid rgba(232,160,32,0.4)', borderRadius: 7,
              color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>Login</button>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{
                width: 34, height: 34, border: '2px solid rgba(232,160,32,0.15)',
                borderTop: '2px solid #e8a020', borderRadius: '50%',
                animation: 'spin 1s linear infinite', margin: '0 auto 12px',
              }} />
              <p style={{ color: 'rgba(138,155,176,0.5)', fontSize: 14 }}>Laden...</p>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '56px 20px' }}>
              <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.25 }}>🛒</div>
              <p style={{ color: 'rgba(138,155,176,0.5)', fontSize: 15 }}>Je winkelwagen is leeg</p>
            </div>
          )}

          {!loading && items.map((item, i) => {
            const pkg = packages.find(p => p.id === item.id) || {};
            const price = item.in_basket?.price ?? item.total_price ?? pkg.total_price ?? 0;
            return (
              <div key={i} style={{
                background: 'rgba(17,25,39,0.9)',
                border: '1px solid rgba(232,160,32,0.08)',
                borderRadius: 10, padding: '14px',
                marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,160,32,0.22)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(232,160,32,0.08)'}>
                <div style={{
                  width: 52, height: 52, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
                  background: pkg.image ? `url(${pkg.image}) center/cover` : 'rgba(232,160,32,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>
                  {!pkg.image && '🎁'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name || pkg.name || 'Package'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ color: '#e8a020', fontWeight: 700, fontSize: 15 }}>
                      {formatPrice(price, item.currency || currency)}
                    </p>
                    {item.qty > 1 && <span style={{ color: 'rgba(138,155,176,0.5)', fontSize: 12 }}>× {item.qty}</span>}
                  </div>
                </div>
                <button onClick={() => onRemove(item.rows_id || item.id)} style={{
                  background: 'rgba(232,64,64,0.12)', border: '1px solid rgba(232,64,64,0.25)',
                  borderRadius: 7, padding: '5px 10px', color: '#e84040',
                  cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif',
                  transition: 'all 0.2s', flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,64,64,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(232,64,64,0.12)'}>
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 24px', borderTop: '1px solid rgba(232,160,32,0.1)',
          background: 'rgba(8,12,20,0.9)',
        }}>
          {items.length > 0 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
            }}>
              <span style={{ color: 'rgba(138,155,176,0.7)', fontSize: 14 }}>Subtotaal</span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 24, color: '#e8a020' }}>
                {formatPrice(total, currency)}
              </span>
            </div>
          )}

          {checkoutUrl && user ? (
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', textAlign: 'center', padding: '14px',
              background: 'linear-gradient(135deg, #e8a020, #c48518)',
              color: '#080c14', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 17,
              letterSpacing: 1, borderRadius: 10, textDecoration: 'none',
              boxShadow: '0 0 28px rgba(232,160,32,0.45)',
            }}>
              💳 Afrekenen →
            </a>
          ) : checkoutUrl && !user ? (
            <button onClick={onLogin} style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #e8a020, #c48518)',
              color: '#080c14', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 16,
              letterSpacing: 1, borderRadius: 10, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 28px rgba(232,160,32,0.45)',
            }}>
              🎮 Inloggen & Afrekenen
            </button>
          ) : (
            <button disabled style={{
              width: '100%', padding: '14px',
              background: 'rgba(232,160,32,0.15)', color: 'rgba(232,160,32,0.4)',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16,
              borderRadius: 10, border: '1px solid rgba(232,160,32,0.15)', cursor: 'not-allowed',
            }}>
              {items.length === 0 ? 'Winkelwagen is leeg' : 'Bezig...'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg, onAddToCart, adding }) {
  const price = parseFloat(pkg.total_price ?? pkg.base_price ?? 0);
  const currency = pkg.currency || 'EUR';
  const isFree = price === 0;

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(17,25,39,0.98) 0%, rgba(13,19,30,0.98) 100%)',
      border: '1px solid rgba(232,160,32,0.1)',
      borderRadius: 14, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'all 0.3s', cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(232,160,32,0.38)';
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(232,160,32,0.12)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(232,160,32,0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>

      <div style={{
        height: 195, position: 'relative',
        background: pkg.image ? `url(${pkg.image}) center/cover` : 'linear-gradient(135deg, rgba(232,160,32,0.1) 0%, rgba(196,133,24,0.03) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {!pkg.image && <span style={{ fontSize: 56, opacity: 0.2 }}>🎁</span>}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, rgba(13,19,30,0.9))' }} />

        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: isFree ? 'linear-gradient(135deg, #40c080, #2a8055)' : 'linear-gradient(135deg, #e8a020, #c48518)',
          color: '#080c14', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 16,
          padding: '5px 14px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.5)', letterSpacing: 0.5,
        }}>
          {isFree ? 'GRATIS' : formatPrice(price, currency)}
        </div>

        {pkg.category?.name && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(8,12,20,0.85)', border: '1px solid rgba(232,160,32,0.18)',
            color: 'rgba(232,160,32,0.85)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
            fontSize: 11, padding: '3px 10px', borderRadius: 6, letterSpacing: 1, textTransform: 'uppercase',
          }}>
            {pkg.category.name}
          </div>
        )}
      </div>

      <div style={{ padding: '18px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 19, color: '#f0e8d8', lineHeight: 1.2 }}>
          {pkg.name}
        </h3>

        {pkg.description && (
          <p style={{
            color: 'rgba(138,155,176,0.72)', fontSize: 13, lineHeight: 1.7, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }} dangerouslySetInnerHTML={{ __html: pkg.description.replace(/<[^>]+>/g, '').trim() }} />
        )}

        <button onClick={() => onAddToCart(pkg)} disabled={adding === pkg.id} style={{
          width: '100%', padding: '11px',
          background: adding === pkg.id ? 'rgba(232,160,32,0.15)' : 'rgba(232,160,32,0.1)',
          border: '1px solid rgba(232,160,32,0.3)',
          borderRadius: 9, color: adding === pkg.id ? 'rgba(232,160,32,0.4)' : '#e8a020',
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
          cursor: adding === pkg.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: 'auto',
        }}
        onMouseEnter={e => { if (adding !== pkg.id) { e.currentTarget.style.background = 'linear-gradient(135deg, #e8a020, #c48518)'; e.currentTarget.style.color = '#080c14'; e.currentTarget.style.borderColor = 'transparent'; } }}
        onMouseLeave={e => { if (adding !== pkg.id) { e.currentTarget.style.background = 'rgba(232,160,32,0.1)'; e.currentTarget.style.color = '#e8a020'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.3)'; } }}>
          {adding === pkg.id ? '⏳ Toevoegen...' : '🛒 In winkelwagen'}
        </button>
      </div>
    </div>
  );
}

// ── Store Page ───────────────────────────────────────────────────────────────
export default function Store() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [basket, setBasket] = useState(null);
  const [basketIdent, setBasketIdent] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [user, setUser] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  // Check status query param
  useEffect(() => {
    if (router.query.status === 'complete') {
      setStatusMsg({ type: 'success', text: '🎉 Betaling geslaagd! Je pakket wordt verwerkt.' });
      sessionStorage.removeItem('tebex_basket');
      setBasket(null); setBasketIdent(null);
      router.replace('/store', undefined, { shallow: true });
    } else if (router.query.status === 'cancelled') {
      setStatusMsg({ type: 'warning', text: '⚠️ Betaling geannuleerd.' });
      router.replace('/store', undefined, { shallow: true });
    }
  }, [router.query.status]);

  // Load user from session
  useEffect(() => {
    const savedUser = typeof window !== 'undefined' ? sessionStorage.getItem('tebex_user') : null;
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    const savedIdent = typeof window !== 'undefined' ? sessionStorage.getItem('tebex_basket') : null;
    if (savedIdent) {
      setBasketIdent(savedIdent);
      refreshBasket(savedIdent);
    }
  }, []);

  async function refreshBasket(ident) {
    if (!ident) return;
    setCartLoading(true);
    try {
      const r = await fetch(`/api/tebex/basket/get?ident=${ident}`);
      if (r.ok) { setBasket(await r.json()); }
      else { sessionStorage.removeItem('tebex_basket'); setBasketIdent(null); setBasket(null); }
    } catch {}
    setCartLoading(false);
  }

  async function getOrCreateBasket() {
    if (basketIdent) return basketIdent;
    setCartLoading(true);
    try {
      const r = await fetch('/api/tebex/basket/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user?.username }),
      });
      const data = await r.json();
      const ident = data?.data?.ident;
      if (ident) {
        sessionStorage.setItem('tebex_basket', ident);
        setBasketIdent(ident);
        setBasket(data);
        return ident;
      }
    } catch {}
    setCartLoading(false);
    return null;
  }

  async function handleLogin() {
    // Get or create basket first, then redirect to CFX auth
    const ident = await getOrCreateBasket();
    if (!ident) { alert('Kon winkelwagen niet aanmaken.'); return; }
    const returnUrl = window.location.origin + '/store?auth=return';
    try {
      const r = await fetch(`/api/tebex/basket/auth?ident=${ident}&returnUrl=${encodeURIComponent(returnUrl)}`);
      const data = await r.json();
      // data is array of auth methods e.g. [{name:"FiveM", url:"..."}]
      const authMethods = Array.isArray(data) ? data : (data?.data || []);
      const cfxAuth = authMethods.find(m => m.name === 'FiveM' || m.name === 'CFX') || authMethods[0];
      if (cfxAuth?.url) {
        window.location.href = cfxAuth.url;
      } else {
        alert('Geen CFX login gevonden. Controleer je Tebex instellingen.');
      }
    } catch (err) {
      alert('Login fout: ' + err.message);
    }
  }

  // Check if returned from CFX auth
  useEffect(() => {
    if (router.query.auth === 'return' && basketIdent) {
      refreshBasket(basketIdent).then(() => {
        // Check if basket now has username
        if (basket?.data?.username) {
          const u = { username: basket.data.username };
          setUser(u);
          sessionStorage.setItem('tebex_user', JSON.stringify(u));
        }
      });
      router.replace('/store', undefined, { shallow: true });
    }
  }, [router.query.auth, basketIdent]);

  function handleLogout() {
    setUser(null);
    sessionStorage.removeItem('tebex_user');
    sessionStorage.removeItem('tebex_basket');
    setBasket(null); setBasketIdent(null);
  }

  async function handleAddToCart(pkg) {
    setAddingId(pkg.id);
    try {
      const ident = await getOrCreateBasket();
      if (!ident) { alert('Kon winkelwagen niet aanmaken.'); setAddingId(null); return; }
      const r = await fetch('/api/tebex/basket/add-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basketIdent: ident, packageId: pkg.id, quantity: 1 }),
      });
      const data = await r.json();
      if (r.ok) { setBasket(data); setCartOpen(true); }
      else alert(`Fout: ${data.detail || data.error || 'Kon product niet toevoegen'}`);
    } catch { alert('Er ging iets mis.'); }
    setAddingId(null); setCartLoading(false);
  }

  async function handleRemove(rowId) {
    if (!basketIdent) return;
    setCartLoading(true);
    try {
      await fetch('/api/tebex/basket/remove-package', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basketIdent, rowId }),
      });
      await refreshBasket(basketIdent);
    } catch {}
    setCartLoading(false);
  }

  // Load store data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const r = await fetch('/api/tebex/categories');
        if (!r.ok) { const e = await r.json(); throw new Error(e.detail || e.error || `API fout ${r.status}`); }
        const catData = await r.json();
        const cats = Array.isArray(catData) ? catData : (catData.data || []);
        setCategories(cats);
        const allPkgs = [];
        cats.forEach(cat => (cat.packages || []).forEach(pkg => {
          if (!allPkgs.find(p => p.id === pkg.id)) allPkgs.push({ ...pkg, categoryName: cat.name });
        }));
        if (allPkgs.length > 0) { setPackages(allPkgs); }
        else {
          const r2 = await fetch('/api/tebex/packages');
          if (r2.ok) { const d = await r2.json(); setPackages(Array.isArray(d) ? d : (d.data || [])); }
        }
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const cartCount = basket?.data?.packages?.length || 0;
  const filteredPackages = packages.filter(pkg => {
    const matchCat = activeCategory === 'all' || pkg.category?.id == activeCategory;
    const matchSearch = !search || pkg.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Head>
        <title>Store – Broodje RP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} basket={basket} packages={packages}
        onRemove={handleRemove} onCheckout={() => {}} loading={cartLoading} user={user} onLogin={handleLogin} />

      <main style={{ paddingTop: 80, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Status banner */}
        {statusMsg && (
          <div style={{
            background: statusMsg.type === 'success' ? 'rgba(64,192,128,0.12)' : 'rgba(232,160,32,0.1)',
            border: `1px solid ${statusMsg.type === 'success' ? 'rgba(64,192,128,0.35)' : 'rgba(232,160,32,0.3)'}`,
            padding: '14px 24px', textAlign: 'center',
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16,
            color: statusMsg.type === 'success' ? '#40c080' : '#e8a020',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            {statusMsg.text}
            <button onClick={() => setStatusMsg(null)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.6, fontSize: 18 }}>✕</button>
          </div>
        )}

        {/* Hero */}
        <div style={{ position: 'relative', padding: '56px 24px 44px', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(232,160,32,0.07) 0%, transparent 100%)', borderBottom: '1px solid rgba(232,160,32,0.09)' }} />
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 250, background: 'radial-gradient(ellipse, rgba(232,160,32,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.28)', borderRadius: 999, marginBottom: 18, fontSize: 12, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 1 }}>
              🛒 DONATIE WINKEL
            </div>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(38px, 7vw, 72px)', letterSpacing: 1, marginBottom: 12 }}>
              KIES JE <span style={{ color: '#e8a020' }}>PAKKET</span>
            </h1>
            <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Support de server en ontvang exclusieve in-game voordelen. Elke donatie helpt!
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
          {/* Filter bar */}
          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 32,
            padding: '14px 18px', background: 'rgba(13,21,32,0.85)', border: '1px solid rgba(232,160,32,0.1)', borderRadius: 12,
          }}>
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(138,155,176,0.4)', fontSize: 14 }}>🔍</span>
              <input type="text" placeholder="Zoek pakket..." value={search} onChange={e => setSearch(e.target.value)} style={{
                width: '100%', padding: '9px 12px 9px 34px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,160,32,0.13)',
                borderRadius: 8, color: '#f0e8d8', fontSize: 14, outline: 'none', fontFamily: 'Exo 2, sans-serif', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(232,160,32,0.45)'}
              onBlur={e => e.target.style.borderColor = 'rgba(232,160,32,0.13)'} />
            </div>

            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {[{ id: 'all', name: 'Alles' }, ...categories].map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  padding: '7px 16px',
                  background: activeCategory === cat.id ? 'linear-gradient(135deg, #e8a020, #c48518)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid', borderColor: activeCategory === cat.id ? 'transparent' : 'rgba(232,160,32,0.13)',
                  borderRadius: 8, color: activeCategory === cat.id ? '#080c14' : 'rgba(240,232,216,0.6)',
                  fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 0.5, cursor: 'pointer', transition: 'all 0.2s',
                }}>{cat.name}</button>
              ))}
            </div>

            <button onClick={() => setCartOpen(true)} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
              background: cartCount > 0 ? 'linear-gradient(135deg, #e8a020, #c48518)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${cartCount > 0 ? 'transparent' : 'rgba(232,160,32,0.18)'}`,
              borderRadius: 8, color: cartCount > 0 ? '#080c14' : 'rgba(240,232,216,0.6)',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
            }}>
              🛒 {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'Winkelwagen'}
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div style={{ width: 52, height: 52, border: '3px solid rgba(232,160,32,0.12)', borderTop: '3px solid #e8a020', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
              <p style={{ color: 'rgba(138,155,176,0.5)', fontSize: 15 }}>Store laden...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ background: 'rgba(232,64,64,0.06)', border: '1px solid rgba(232,64,64,0.22)', borderRadius: 14, padding: '40px', textAlign: 'center', maxWidth: 660, margin: '0 auto' }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 24, marginBottom: 10, color: '#e84040' }}>Fout bij laden</h3>
              <p style={{ color: 'rgba(240,232,216,0.75)', fontSize: 14, marginBottom: 20 }}>{error}</p>
              <a href="/api/tebex/debug" target="_blank" style={{ display: 'inline-block', padding: '9px 20px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 7, color: '#e8a020', fontSize: 13, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                🔍 Debug info
              </a>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredPackages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 60, marginBottom: 20, opacity: 0.25 }}>📦</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 26, marginBottom: 10 }}>Geen producten gevonden</h3>
              <p style={{ color: 'rgba(138,155,176,0.5)' }}>{search ? 'Probeer een andere zoekterm.' : 'Er zijn nog geen producten in de store.'}</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filteredPackages.length > 0 && (
            <>
              <p style={{ color: 'rgba(138,155,176,0.4)', fontSize: 13, marginBottom: 22 }}>
                {filteredPackages.length} pakket{filteredPackages.length !== 1 ? 'ten' : ''} gevonden
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))', gap: 22 }}>
                {filteredPackages.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} onAddToCart={handleAddToCart} adding={addingId} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input::placeholder { color: rgba(138,155,176,0.3); }`}</style>
    </>
  );
}
