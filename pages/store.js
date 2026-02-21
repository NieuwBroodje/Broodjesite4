import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function fmt(price, currency = 'EUR') {
  const n = parseFloat(price);
  if (isNaN(n) || n === 0) return 'Gratis';
  try { return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(n); }
  catch { return `€${n.toFixed(2)}`; }
}

// ── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose, basket, packages, onRemove, onUpdateQty, loading, user, onLogin }) {
  const items = basket?.data?.packages || [];
  const total = basket?.data?.total_price ?? basket?.data?.base_price ?? 0;
  const currency = basket?.data?.currency || 'EUR';
  const checkoutUrl = basket?.data?.links?.checkout;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '96vw',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg, #0a0f1a 0%, #06090f 100%)',
        borderLeft: '1px solid rgba(232,160,32,0.15)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-24px 0 80px rgba(0,0,0,0.6)',
      }}>
        {/* Top accent line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #e8a020, transparent)' }} />

        {/* Header */}
        <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(232,160,32,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🛒</span>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 21 }}>Winkelwagen</h2>
            {items.length > 0 && <span style={{ background: '#e8a020', color: '#06090f', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>{items.length}</span>}
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(238,232,216,0.6)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Must login notice */}
        {!user && (
          <div style={{ margin: '14px 14px 0', padding: '14px', background: 'rgba(232,160,32,0.06)', border: '1px solid rgba(232,160,32,0.18)', borderRadius: 10 }}>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, color: '#e8a020', marginBottom: 6 }}>⚠️ Login vereist</p>
            <p style={{ color: 'rgba(138,155,176,0.75)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>Log in via CFX zodat je pakket aan jouw speler wordt gekoppeld.</p>
            <button onClick={onLogin} style={{ width: '100%', padding: '9px', background: 'rgba(232,160,32,0.15)', border: '1px solid rgba(232,160,32,0.35)', borderRadius: 8, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>🎮 Inloggen met CFX</button>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
          {loading && <div style={{ textAlign: 'center', padding: '40px 0' }}><div style={{ width: 32, height: 32, border: '2px solid rgba(232,160,32,0.15)', borderTop: '2px solid #e8a020', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} /><p style={{ color: 'rgba(138,155,176,0.5)', fontSize: 13 }}>Laden...</p></div>}
          {!loading && items.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px' }}><div style={{ fontSize: 48, marginBottom: 14, opacity: 0.2 }}>🛒</div><p style={{ color: 'rgba(138,155,176,0.45)', fontSize: 14 }}>Je winkelwagen is leeg</p></div>}
          {!loading && items.map((item, i) => {
            const pkg = packages.find(p => p.id === item.id) || {};
            const price = item.in_basket?.price ?? item.total_price ?? pkg.total_price ?? 0;
            const qty = item.in_basket?.quantity ?? 1;
            return (
              <div key={i} style={{ background: 'rgba(15,22,36,0.8)', border: '1px solid rgba(232,160,32,0.07)', borderRadius: 10, padding: '12px', marginBottom: 8, display: 'flex', gap: 11, alignItems: 'flex-start', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,160,32,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(232,160,32,0.07)'}>
                <div style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0, background: pkg.image ? `url(${pkg.image}) center/cover` : 'rgba(232,160,32,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{!pkg.image && '🎁'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name || pkg.name}</p>
                  <p style={{ color: '#e8a020', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{fmt(price, item.currency || currency)}</p>
                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => onUpdateQty(item.rows_id || item.id, item.id, qty - 1)} style={{ width: 24, height: 24, background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: 5, color: '#e8a020', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => onUpdateQty(item.rows_id || item.id, item.id, qty + 1)} style={{ width: 24, height: 24, background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: 5, color: '#e8a020', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                  </div>
                </div>
                <button onClick={() => onRemove(item.rows_id || item.id)} style={{ background: 'rgba(240,80,96,0.1)', border: '1px solid rgba(240,80,96,0.2)', borderRadius: 6, padding: '4px 9px', color: '#f05060', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,80,96,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(240,80,96,0.1)'}>✕</button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '18px 22px', borderTop: '1px solid rgba(232,160,32,0.08)' }}>
          {items.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ color: 'rgba(138,155,176,0.65)', fontSize: 14 }}>Totaal</span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 24, color: '#e8a020' }}>{fmt(total, currency)}</span>
            </div>
          )}
          {checkoutUrl && user ? (
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', padding: '14px', background: 'linear-gradient(135deg, #e8a020, #c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: 1, borderRadius: 10, boxShadow: '0 0 28px rgba(232,160,32,0.4)', textDecoration: 'none' }}>
              💳 Afrekenen →
            </a>
          ) : (
            <button disabled={items.length === 0 || loading} style={{ width: '100%', padding: '14px', background: 'rgba(232,160,32,0.12)', color: 'rgba(232,160,32,0.4)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16, borderRadius: 10, border: '1px solid rgba(232,160,32,0.15)', cursor: 'not-allowed' }}>
              {items.length === 0 ? 'Winkelwagen is leeg' : 'Verwerken...'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg, onAddToCart, adding, user, onLogin }) {
  const [showInfo, setShowInfo] = useState(false);
  const price = parseFloat(pkg.total_price ?? pkg.base_price ?? 0);
  const currency = pkg.currency || 'EUR';
  const isFree = price === 0;

  const handleClick = () => {
    if (!user) { onLogin(); return; }
    onAddToCart(pkg);
  };

  return (
    <>
      {/* Info Modal */}
      {showInfo && (
        <>
          <div onClick={() => setShowInfo(false)} style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 501, width: 480, maxWidth: '95vw', maxHeight: '85vh', overflowY: 'auto',
            background: 'linear-gradient(180deg, #0d1420 0%, #06090f 100%)',
            border: '1px solid rgba(232,160,32,0.25)',
            borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
          }}>
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #e8a020, transparent)' }} />
            {/* Modal image */}
            <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', background: pkg.image ? `url(${pkg.image}) center/cover` : 'linear-gradient(135deg, rgba(232,160,32,0.09), rgba(196,133,24,0.03))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!pkg.image && <span style={{ fontSize: 72, opacity: 0.2 }}>🎁</span>}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, #0d1420)' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, background: isFree ? 'linear-gradient(135deg,#3dd68c,#2a9060)' : 'linear-gradient(135deg,#e8a020,#c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 17, padding: '6px 15px', borderRadius: 8 }}>
                {isFree ? 'GRATIS' : fmt(price, currency)}
              </div>
              <button onClick={() => setShowInfo(false)} style={{ position: 'absolute', top: 12, left: 12, width: 32, height: 32, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px 28px' }}>
              {pkg.category?.name && <span style={{ display: 'inline-block', marginBottom: 10, padding: '2px 10px', background: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.22)', borderRadius: 6, fontSize: 11, color: 'rgba(232,160,32,0.85)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>{pkg.category.name}</span>}
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 24, color: '#eee8d8', marginBottom: 12 }}>{pkg.name}</h3>
              {pkg.description && (
                <div style={{ color: 'rgba(170,185,200,0.85)', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}
                  dangerouslySetInnerHTML={{ __html: pkg.description.replace(/<[^>]+>/g, '') }} />
              )}
              <button onClick={() => { setShowInfo(false); handleClick(); }} disabled={adding === pkg.id} style={{
                width: '100%', padding: '13px',
                background: adding === pkg.id ? 'rgba(232,160,32,0.12)' : 'linear-gradient(135deg,#e8a020,#c48518)',
                border: 'none', borderRadius: 9,
                color: adding === pkg.id ? 'rgba(232,160,32,0.4)' : '#06090f',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: 0.5,
                cursor: adding === pkg.id ? 'not-allowed' : 'pointer',
                boxShadow: adding !== pkg.id ? '0 4px 20px rgba(232,160,32,0.35)' : 'none',
              }}>
                {adding === pkg.id ? '⏳ Toevoegen...' : !user ? '🎮 Login & Kopen' : '🛒 In winkelwagen'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Card */}
      <div style={{ background: 'rgba(10,15,26,0.95)', border: '1px solid rgba(232,160,32,0.09)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', position: 'relative', cursor: 'pointer' }}
      onClick={() => setShowInfo(true)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.35)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,160,32,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.09)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

        {/* Square image */}
        <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', background: pkg.image ? `url(${pkg.image}) center/cover` : 'linear-gradient(135deg, rgba(232,160,32,0.09), rgba(196,133,24,0.03))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!pkg.image && <span style={{ fontSize: 54, opacity: 0.18 }}>🎁</span>}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, rgba(10,15,26,0.95))' }} />
          <div style={{ position: 'absolute', top: 10, right: 10, background: isFree ? 'linear-gradient(135deg,#3dd68c,#2a9060)' : 'linear-gradient(135deg,#e8a020,#c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 14, padding: '4px 11px', borderRadius: 7, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
            {isFree ? 'GRATIS' : fmt(price, currency)}
          </div>
          {pkg.category?.name && <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(6,9,15,0.85)', border: '1px solid rgba(232,160,32,0.18)', color: 'rgba(232,160,32,0.8)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 10, padding: '3px 10px', borderRadius: 6, letterSpacing: 1.5, textTransform: 'uppercase' }}>{pkg.category.name}</div>}
          {/* Click hint */}
          <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 10, color: 'rgba(232,160,32,0.5)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 1 }}>INFO ›</div>
        </div>

        <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 17, color: '#eee8d8', lineHeight: 1.2 }}>{pkg.name}</h3>
          <button onClick={e => { e.stopPropagation(); handleClick(); }} disabled={adding === pkg.id} style={{
            width: '100%', padding: '10px',
            background: adding === pkg.id ? 'rgba(232,160,32,0.12)' : 'rgba(232,160,32,0.09)',
            border: '1px solid rgba(232,160,32,0.28)', borderRadius: 9,
            color: adding === pkg.id ? 'rgba(232,160,32,0.4)' : '#e8a020',
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 0.5,
            cursor: adding === pkg.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: 'auto',
          }}
          onMouseEnter={e => { e.stopPropagation(); if (adding !== pkg.id) { e.currentTarget.style.background = 'linear-gradient(135deg,#e8a020,#c48518)'; e.currentTarget.style.color = '#06090f'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(232,160,32,0.35)'; } }}
          onMouseLeave={e => { e.stopPropagation(); if (adding !== pkg.id) { e.currentTarget.style.background = 'rgba(232,160,32,0.09)'; e.currentTarget.style.color = '#e8a020'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.28)'; e.currentTarget.style.boxShadow = 'none'; } }}>
            {adding === pkg.id ? '⏳ Toevoegen...' : !user ? '🎮 Login & Kopen' : '🛒 In winkelwagen'}
          </button>
        </div>
      </div>
    </>
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

  // Init: load user + basket from session
  useEffect(() => {
    const savedUser = typeof window !== 'undefined' ? sessionStorage.getItem('tebex_user') : null;
    if (savedUser) try { setUser(JSON.parse(savedUser)); } catch {}
    const savedIdent = typeof window !== 'undefined' ? sessionStorage.getItem('tebex_basket') : null;
    if (savedIdent) { setBasketIdent(savedIdent); refreshBasket(savedIdent); }
  }, []);

  // Handle ?status and ?auth query params
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.status === 'complete') {
      setStatusMsg({ type: 'success', text: '🎉 Betaling geslaagd! Je pakket wordt verwerkt.' });
      sessionStorage.removeItem('tebex_basket');
      setBasket(null); setBasketIdent(null);
      router.replace('/store', undefined, { shallow: true });
    } else if (router.query.status === 'cancelled') {
      setStatusMsg({ type: 'warning', text: '⚠️ Betaling geannuleerd.' });
      router.replace('/store', undefined, { shallow: true });
    } else if (router.query.auth === 'return') {
      // User came back from CFX auth — re-fetch basket to get username
      const ident = sessionStorage.getItem('tebex_basket');
      if (ident) {
        refreshBasket(ident).then((b) => {
          const username = b?.data?.username;
          if (username) {
            const u = { username };
            setUser(u);
            sessionStorage.setItem('tebex_user', JSON.stringify(u));
          }
        });
      }
      router.replace('/store', undefined, { shallow: true });
    }
  }, [router.isReady, router.query]);

  async function refreshBasket(ident) {
    if (!ident) return null;
    setCartLoading(true);
    try {
      const r = await fetch(`/api/tebex/basket/get?ident=${ident}`);
      if (r.ok) { const b = await r.json(); setBasket(b); setCartLoading(false); return b; }
      else { sessionStorage.removeItem('tebex_basket'); setBasketIdent(null); setBasket(null); }
    } catch {}
    setCartLoading(false);
    return null;
  }

  // LOGIN FLOW:
  // 1. Create basket (without username)
  // 2. Get auth URL from Tebex
  // 3. Redirect to CFX login
  // 4. On return, re-fetch basket → basket.username is now set
  // 5. Now user can add packages (basket is linked to their account)
  async function handleLogin() {
    try {
      setCartLoading(true);
      // Create fresh basket (no username yet)
      const host = window.location.origin;
      const r = await fetch('/api/tebex/basket/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}),
      });
      const data = await r.json();
      const ident = data?.data?.ident;
      if (!ident) { alert('Kon basket niet aanmaken: ' + (data.detail || data.error)); setCartLoading(false); return; }

      sessionStorage.setItem('tebex_basket', ident);
      setBasketIdent(ident);
      setBasket(data);

      // Get auth URL
      const returnUrl = `${host}/store?auth=return`;
      const authR = await fetch(`/api/tebex/basket/auth?ident=${ident}&returnUrl=${encodeURIComponent(returnUrl)}`);
      const authData = await authR.json();
      const methods = Array.isArray(authData) ? authData : (authData.data || []);
      const cfx = methods.find(m => m.name === 'FiveM' || m.name === 'CFX') || methods[0];

      if (cfx?.url) {
        window.location.href = cfx.url;
      } else {
        alert('Geen CFX auth methode gevonden.');
        setCartLoading(false);
      }
    } catch (err) {
      alert('Login fout: ' + err.message);
      setCartLoading(false);
    }
  }

  function handleLogout() {
    setUser(null); sessionStorage.removeItem('tebex_user');
    sessionStorage.removeItem('tebex_basket');
    setBasket(null); setBasketIdent(null);
  }

  async function handleAddToCart(pkg) {
    if (!user) { handleLogin(); return; }
    if (!basketIdent) { alert('Geen basket. Log opnieuw in.'); return; }
    setAddingId(pkg.id);
    try {
      const r = await fetch('/api/tebex/basket/add-package', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basketIdent, packageId: pkg.id, quantity: 1 }),
      });
      const data = await r.json();
      if (r.ok) { setBasket(data); setCartOpen(true); }
      else alert(`Fout: ${data.detail || data.error}`);
    } catch { alert('Er ging iets mis. Probeer opnieuw.'); }
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

  async function handleUpdateQty(rowId, pkgId, newQty) {
    if (!basketIdent) return;
    if (newQty <= 0) { await handleRemove(rowId); return; }
    setCartLoading(true);
    try {
      await fetch('/api/tebex/basket/remove-package', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basketIdent, rowId }),
      });
      await fetch('/api/tebex/basket/add-package', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basketIdent, packageId: pkgId, quantity: newQty }),
      });
      await refreshBasket(basketIdent);
    } catch {}
    setCartLoading(false);
  }

  // Load store products
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const r = await fetch('/api/tebex/categories');
        if (!r.ok) { const e = await r.json(); throw new Error(e.detail || e.error || `API fout ${r.status}`); }
        const catData = await r.json();
        const cats = Array.isArray(catData) ? catData : (catData.data || []);
        setCategories(cats);
        const allPkgs = [];
        cats.forEach(cat => (cat.packages || []).forEach(pkg => { if (!allPkgs.find(p => p.id === pkg.id)) allPkgs.push({ ...pkg, categoryName: cat.name }); }));
        if (allPkgs.length > 0) setPackages(allPkgs);
        else {
          const r2 = await fetch('/api/tebex/packages');
          if (r2.ok) { const d = await r2.json(); setPackages(Array.isArray(d) ? d : (d.data || [])); }
        }
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const cartCount = basket?.data?.packages?.length || 0;
  const filtered = packages.filter(pkg => {
    const matchCat = activeCategory === 'all' || pkg.category?.id == activeCategory;
    const matchSearch = !search || pkg.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Head><title>Store – Broodje RP</title><link rel="icon" href="/favicon.ico" /></Head>
      {!cartOpen && <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} user={user} onLogin={handleLogin} onLogout={handleLogout} />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} basket={basket} packages={packages} onRemove={handleRemove} onUpdateQty={handleUpdateQty} loading={cartLoading} user={user} onLogin={handleLogin} />

      <main style={{ paddingTop: cartOpen ? 0 : 80, minHeight: '100vh', position: 'relative' }}>
        {/* Announcement ticker */}
        {!cartOpen && (
          <div style={{ background: 'rgba(6,9,15,0.98)', borderBottom: '1px solid rgba(232,160,32,0.15)', overflow: 'hidden', height: 32, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap', gap: 0 }}>
              {[
                '🌙 RAMADAN 2026 — 50% KORTING OP ALLE PAKKETTEN',
                '🎁 ELKE DONATIE SUPPORT DE SERVER & EVENTS',
                '⚡ LIMITED PERIODE — MIS HET NIET',
                '🔥 EXTRA KANSEN: HOE MEER JE DONEERT, HOE MEER KANS',
                '💎 GOUDEN DEALS — BESTE VALUE VAN HET JAAR',
              ].concat([
                '🌙 RAMADAN 2026 — 50% KORTING OP ALLE PAKKETTEN',
                '🎁 ELKE DONATIE SUPPORT DE SERVER & EVENTS',
                '⚡ LIMITED PERIODE — MIS HET NIET',
                '🔥 EXTRA KANSEN: HOE MEER JE DONEERT, HOE MEER KANS',
                '💎 GOUDEN DEALS — BESTE VALUE VAN HET JAAR',
              ]).map((msg, i) => (
                <span key={i} style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: 2, color: 'rgba(232,160,32,0.85)', padding: '0 40px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 4, height: 4, background: '#e8a020', borderRadius: '50%', display: 'inline-block', opacity: 0.6 }} />
                  {msg}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* BG */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.12) saturate(0.5)' }} />
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'linear-gradient(180deg, rgba(6,9,15,0.6) 0%, rgba(6,9,15,0.85) 100%)' }} />

        {/* Status banner */}
        {statusMsg && (
          <div style={{ background: statusMsg.type === 'success' ? 'rgba(61,214,140,0.1)' : 'rgba(232,160,32,0.1)', border: `1px solid ${statusMsg.type === 'success' ? 'rgba(61,214,140,0.3)' : 'rgba(232,160,32,0.3)'}`, padding: '13px 24px', textAlign: 'center', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, color: statusMsg.type === 'success' ? '#3dd68c' : '#e8a020', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {statusMsg.text}
            <button onClick={() => setStatusMsg(null)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.5, fontSize: 16 }}>✕</button>
          </div>
        )}

        {/* Hero */}
        <div style={{ padding: '52px 24px 40px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 220, background: 'radial-gradient(ellipse, rgba(232,160,32,0.1), transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: 4, color: '#e8a020', marginBottom: 14, textTransform: 'uppercase' }}>🛒 Donatie Winkel</p>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: 0.5, marginBottom: 12 }}>
            KIES JE <span style={{ color: '#e8a020' }}>PAKKET</span>
          </h1>
          <p style={{ color: 'rgba(138,155,176,0.7)', fontSize: 15, maxWidth: 450, margin: '0 auto' }}>
            Support de server en ontvang exclusieve in-game voordelen.
          </p>
          {!user && (
            <button onClick={handleLogin} style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 9, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: 0.5 }}>
              🎮 Eerst inloggen met CFX om te kopen
            </button>
          )}
        </div>

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 24px 80px' }}>
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 28, padding: '12px 16px', background: 'rgba(10,15,26,0.85)', border: '1px solid rgba(232,160,32,0.09)', borderRadius: 12, backdropFilter: 'blur(10px)' }}>
            <div style={{ position: 'relative', flex: '1 1 180px' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(138,155,176,0.35)', fontSize: 13 }}>🔍</span>
              <input type="text" placeholder="Zoek pakket..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 10px 8px 30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,160,32,0.1)', borderRadius: 8, color: '#eee8d8', fontSize: 13, fontFamily: 'Barlow, sans-serif', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'rgba(232,160,32,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(232,160,32,0.1)'} />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[{ id: 'all', name: 'Alles' }, ...categories].map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: '6px 14px', background: activeCategory === cat.id ? 'linear-gradient(135deg,#e8a020,#c48518)' : 'rgba(255,255,255,0.03)', border: '1px solid', borderColor: activeCategory === cat.id ? 'transparent' : 'rgba(232,160,32,0.1)', borderRadius: 7, color: activeCategory === cat.id ? '#06090f' : 'rgba(238,232,216,0.55)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: 0.5, cursor: 'pointer', transition: 'all 0.2s' }}>{cat.name}</button>
              ))}
            </div>
            <button onClick={() => setCartOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: cartCount > 0 ? 'linear-gradient(135deg,#e8a020,#c48518)' : 'rgba(255,255,255,0.03)', border: `1px solid ${cartCount > 0 ? 'transparent' : 'rgba(232,160,32,0.1)'}`, borderRadius: 8, color: cartCount > 0 ? '#06090f' : 'rgba(238,232,216,0.55)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
              🛒 {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'Wagen'}
            </button>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: '90px 0' }}><div style={{ width: 48, height: 48, border: '2px solid rgba(232,160,32,0.1)', borderTop: '2px solid #e8a020', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 18px' }} /><p style={{ color: 'rgba(138,155,176,0.45)', fontSize: 14 }}>Store laden...</p></div>}

          {error && !loading && (
            <div style={{ background: 'rgba(240,80,96,0.06)', border: '1px solid rgba(240,80,96,0.2)', borderRadius: 14, padding: '40px', textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
              <div style={{ fontSize: 42, marginBottom: 14 }}>⚠️</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 10, color: '#f05060' }}>Fout bij laden</h3>
              <p style={{ color: 'rgba(238,232,216,0.7)', fontSize: 14, marginBottom: 18 }}>{error}</p>
              <a href="/api/tebex/debug" target="_blank" style={{ display: 'inline-block', padding: '8px 18px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.28)', borderRadius: 7, color: '#e8a020', fontSize: 13, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>🔍 Debug info</a>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', opacity: 0.5 }}>
              <div style={{ fontSize: 56, marginBottom: 18 }}>📦</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 24, marginBottom: 10 }}>Geen producten gevonden</h3>
              <p style={{ color: 'rgba(138,155,176,0.55)', fontSize: 14 }}>{search ? 'Probeer een andere zoekterm.' : 'Geen producten beschikbaar.'}</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <p style={{ color: 'rgba(138,155,176,0.35)', fontSize: 12, marginBottom: 20, letterSpacing: 1 }}>{filtered.length} PAKKET{filtered.length !== 1 ? 'TEN' : ''}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))', gap: 20 }}>
                {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} onAddToCart={handleAddToCart} adding={addingId} user={user} onLogin={handleLogin} />)}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </>
  );
}
