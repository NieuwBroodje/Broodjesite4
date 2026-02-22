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

// ── Favourites helpers (localStorage) ────────────────────────────────────────
function getFavs() {
  try { return JSON.parse(localStorage.getItem('brp_favs') || '[]'); } catch { return []; }
}
function saveFavs(ids) {
  try { localStorage.setItem('brp_favs', JSON.stringify(ids)); } catch {}
}

// ── Heart Button ─────────────────────────────────────────────────────────────
function HeartBtn({ pkgId, favs, onToggle }) {
  const isFav = favs.includes(pkgId);
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(pkgId); }}
      title={isFav ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten'}
      style={{
        width: 32, height: 32, borderRadius: '50%',
        background: isFav ? 'rgba(240,80,120,0.25)' : 'rgba(0,0,0,0.55)',
        border: `1.5px solid ${isFav ? 'rgba(240,80,120,0.6)' : 'rgba(255,255,255,0.12)'}`,
        color: isFav ? '#f05078' : 'rgba(255,255,255,0.4)',
        fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', backdropFilter: 'blur(6px)',
        transform: isFav ? 'scale(1.1)' : 'scale(1)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,80,120,0.3)'; e.currentTarget.style.color = '#f05078'; e.currentTarget.style.borderColor = 'rgba(240,80,120,0.6)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isFav ? 'rgba(240,80,120,0.25)' : 'rgba(0,0,0,0.55)';
        e.currentTarget.style.color = isFav ? '#f05078' : 'rgba(255,255,255,0.4)';
        e.currentTarget.style.borderColor = isFav ? 'rgba(240,80,120,0.6)' : 'rgba(255,255,255,0.12)';
      }}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────
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
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #e8a020, transparent)' }} />
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(232,160,32,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🛒</span>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 20 }}>Winkelwagen</h2>
            {items.length > 0 && <span style={{ background: '#e8a020', color: '#06090f', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>{items.length}</span>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(238,232,216,0.6)', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {!user && (
          <div style={{ margin: '14px 14px 0', padding: '14px', background: 'rgba(232,160,32,0.06)', border: '1px solid rgba(232,160,32,0.18)', borderRadius: 10 }}>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, color: '#e8a020', marginBottom: 6 }}>⚠️ Login vereist</p>
            <p style={{ color: 'rgba(138,155,176,0.75)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>Log in via CFX zodat je pakket aan jouw speler wordt gekoppeld.</p>
            <button onClick={onLogin} style={{ width: '100%', padding: '9px', background: 'rgba(232,160,32,0.15)', border: '1px solid rgba(232,160,32,0.35)', borderRadius: 8, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>🎮 Inloggen met CFX</button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
          {loading && <div style={{ textAlign: 'center', padding: '40px 0' }}><div style={{ width: 32, height: 32, border: '2px solid rgba(232,160,32,0.15)', borderTop: '2px solid #e8a020', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} /></div>}
          {!loading && items.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px' }}><div style={{ fontSize: 48, marginBottom: 14, opacity: 0.2 }}>🛒</div><p style={{ color: 'rgba(138,155,176,0.45)', fontSize: 14 }}>Je winkelwagen is leeg</p></div>}
          {!loading && items.map((item, i) => {
            const pkg = packages.find(p => p.id === item.id) || {};
            const price = item.in_basket?.price ?? item.total_price ?? pkg.total_price ?? 0;
            const qty = item.in_basket?.quantity ?? item.quantity ?? 1;
            const removeId = item.rows_id ?? item.row_id ?? item.in_basket?.rows_id ?? item.in_basket?.id ?? item.id;
            return (
              <div key={i} style={{ background: 'rgba(15,22,36,0.8)', border: '1px solid rgba(232,160,32,0.07)', borderRadius: 10, padding: '12px', marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,160,32,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(232,160,32,0.07)'}>
                <div style={{ width: 46, height: 46, borderRadius: 8, flexShrink: 0, background: pkg.image ? `url(${pkg.image}) center/cover` : 'rgba(232,160,32,0.08)', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{!pkg.image && '🎁'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name || pkg.name}</p>
                  <p style={{ color: '#e8a020', fontWeight: 700, fontSize: 13 }}>{fmt(price, item.currency || currency)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => onUpdateQty(removeId, item.id, qty - 1)} style={{ width: 26, height: 26, background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.18)', borderRadius: 6, color: '#e8a020', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                  <button onClick={() => onUpdateQty(removeId, item.id, qty + 1)} style={{ width: 26, height: 26, background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.18)', borderRadius: 6, color: '#e8a020', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                </div>
                <button onClick={() => onRemove(removeId)} style={{ width: 30, height: 30, background: 'rgba(240,80,96,0.1)', border: '1px solid rgba(240,80,96,0.22)', borderRadius: 7, color: '#f05060', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,80,96,0.25)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,80,96,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}>🗑</button>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(232,160,32,0.08)' }}>
          {items.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ color: 'rgba(138,155,176,0.65)', fontSize: 14 }}>Totaal</span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 24, color: '#e8a020' }}>{fmt(total, currency)}</span>
            </div>
          )}
          {checkoutUrl && user ? (
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', padding: '13px', background: 'linear-gradient(135deg, #e8a020, #c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: 1, borderRadius: 10, boxShadow: '0 0 28px rgba(232,160,32,0.4)', textDecoration: 'none' }}>
              💳 Afrekenen →
            </a>
          ) : (
            <button disabled style={{ width: '100%', padding: '13px', background: 'rgba(232,160,32,0.08)', color: 'rgba(232,160,32,0.35)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, borderRadius: 10, border: '1px solid rgba(232,160,32,0.12)', cursor: 'not-allowed' }}>
              {items.length === 0 ? 'Winkelwagen is leeg' : '⏳ Verwerken...'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Favourites Drawer ─────────────────────────────────────────────────────────
function FavsDrawer({ open, onClose, favs, packages, onAddToCart, onToggleFav, adding, user, onLogin }) {
  const favPkgs = packages.filter(p => favs.includes(p.id));
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '96vw',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg, #0e0a18 0%, #06090f 100%)',
        borderLeft: '1px solid rgba(240,80,120,0.2)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-24px 0 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #f05078, transparent)' }} />
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(240,80,120,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>❤️</span>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 20 }}>Mijn Favorieten</h2>
            {favPkgs.length > 0 && <span style={{ background: '#f05078', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>{favPkgs.length}</span>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(238,232,216,0.6)', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
          {favPkgs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 14, opacity: 0.2 }}>🤍</div>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 18, color: 'rgba(160,175,190,0.5)', marginBottom: 8 }}>Nog geen favorieten</p>
              <p style={{ color: 'rgba(138,155,176,0.35)', fontSize: 13 }}>Klik op het ❤️ bij een pakket om het op te slaan.</p>
            </div>
          )}
          {favPkgs.map(pkg => {
            const price = parseFloat(pkg.total_price ?? pkg.base_price ?? 0);
            const currency = pkg.currency || 'EUR';
            return (
              <div key={pkg.id} style={{ background: 'rgba(15,18,32,0.9)', border: '1px solid rgba(240,80,120,0.1)', borderRadius: 12, padding: '12px', marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(240,80,120,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,80,120,0.1)'}>
                <div style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0, background: pkg.image ? `url(${pkg.image}) center/cover` : 'rgba(240,80,120,0.08)', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '1px solid rgba(240,80,120,0.12)' }}>
                  {!pkg.image && '🎁'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#eee8d8' }}>{pkg.name}</p>
                  <p style={{ color: '#e8a020', fontWeight: 700, fontSize: 13 }}>{price === 0 ? 'Gratis' : fmt(price, currency)}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                  <button onClick={() => { if (!user) { onLogin(); return; } onAddToCart(pkg); onClose(); }} disabled={adding === pkg.id} style={{ padding: '6px 12px', background: 'linear-gradient(135deg, #e8a020, #c48518)', border: 'none', borderRadius: 7, color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {adding === pkg.id ? '⏳' : '🛒 Kopen'}
                  </button>
                  <button onClick={() => onToggleFav(pkg.id)} style={{ padding: '5px 12px', background: 'rgba(240,80,96,0.1)', border: '1px solid rgba(240,80,96,0.2)', borderRadius: 7, color: '#f05060', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>
                    Verwijder
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {favPkgs.length > 0 && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(240,80,120,0.08)', textAlign: 'center' }}>
            <p style={{ color: 'rgba(138,155,176,0.45)', fontSize: 12 }}>{favPkgs.length} opgeslagen pakket{favPkgs.length !== 1 ? 'ten' : ''}</p>
          </div>
        )}
      </div>
    </>
  );
}

// ── Package Card ──────────────────────────────────────────────────────────────
function PackageCard({ pkg, onAddToCart, adding, user, onLogin, favs, onToggleFav }) {
  const [showInfo, setShowInfo] = useState(false);
  const price = parseFloat(pkg.total_price ?? pkg.base_price ?? 0);
  const currency = pkg.currency || 'EUR';
  const isFree = price === 0;
  const isFav = favs.includes(pkg.id);

  const handleClick = () => { if (!user) { onLogin(); return; } onAddToCart(pkg); };

  return (
    <>
      {showInfo && (
        <>
          <div onClick={() => setShowInfo(false)} style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 501, width: 480, maxWidth: '95vw', maxHeight: '85vh', overflowY: 'auto', background: 'linear-gradient(180deg, #0d1420 0%, #06090f 100%)', border: '1px solid rgba(232,160,32,0.25)', borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #e8a020, transparent)' }} />
            <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', background: pkg.image ? `url(${pkg.image}) center/cover` : 'linear-gradient(135deg, rgba(232,160,32,0.09), rgba(196,133,24,0.03))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!pkg.image && <span style={{ fontSize: 72, opacity: 0.2 }}>🎁</span>}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, #0d1420)' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, background: isFree ? 'linear-gradient(135deg,#3dd68c,#2a9060)' : 'linear-gradient(135deg,#e8a020,#c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 17, padding: '6px 15px', borderRadius: 8 }}>{isFree ? 'GRATIS' : fmt(price, currency)}</div>
              <button onClick={() => setShowInfo(false)} style={{ position: 'absolute', top: 12, left: 12, width: 32, height: 32, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              <div style={{ position: 'absolute', top: 52, left: 12 }}>
                <HeartBtn pkgId={pkg.id} favs={favs} onToggle={onToggleFav} />
              </div>
            </div>
            <div style={{ padding: '20px 24px 28px' }}>
              {pkg.category?.name && <span style={{ display: 'inline-block', marginBottom: 10, padding: '2px 10px', background: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.22)', borderRadius: 6, fontSize: 11, color: 'rgba(232,160,32,0.85)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>{pkg.category.name}</span>}
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 24, color: '#eee8d8', marginBottom: 12 }}>{pkg.name}</h3>
              {pkg.description && <div style={{ color: 'rgba(170,185,200,0.85)', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: pkg.description.replace(/<[^>]+>/g, '') }} />}
              <button onClick={() => { setShowInfo(false); handleClick(); }} disabled={adding === pkg.id} style={{ width: '100%', padding: '13px', background: adding === pkg.id ? 'rgba(232,160,32,0.12)' : 'linear-gradient(135deg,#e8a020,#c48518)', border: 'none', borderRadius: 9, color: adding === pkg.id ? 'rgba(232,160,32,0.4)' : '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 15, cursor: adding === pkg.id ? 'not-allowed' : 'pointer', boxShadow: adding !== pkg.id ? '0 4px 20px rgba(232,160,32,0.35)' : 'none' }}>
                {adding === pkg.id ? '⏳ Toevoegen...' : !user ? '🎮 Login & Kopen' : '🛒 In winkelwagen'}
              </button>
            </div>
          </div>
        </>
      )}

      <div style={{ background: 'rgba(10,15,26,0.95)', border: '1px solid rgba(232,160,32,0.09)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', position: 'relative', cursor: 'pointer' }}
      onClick={() => setShowInfo(true)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.35)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,160,32,0.09)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
        <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', background: pkg.image ? `url(${pkg.image}) center/cover` : 'linear-gradient(135deg, rgba(232,160,32,0.09), rgba(196,133,24,0.03))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!pkg.image && <span style={{ fontSize: 54, opacity: 0.18 }}>🎁</span>}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, rgba(10,15,26,0.95))' }} />
          <div style={{ position: 'absolute', top: 10, right: 10, background: isFree ? 'linear-gradient(135deg,#3dd68c,#2a9060)' : 'linear-gradient(135deg,#e8a020,#c48518)', color: '#06090f', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 13, padding: '4px 11px', borderRadius: 7 }}>{isFree ? 'GRATIS' : fmt(price, currency)}</div>
          {pkg.category?.name && <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(6,9,15,0.85)', border: '1px solid rgba(232,160,32,0.18)', color: 'rgba(232,160,32,0.8)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 10, padding: '3px 8px', borderRadius: 6, letterSpacing: 1.2, textTransform: 'uppercase' }}>{pkg.category.name}</div>}
          {/* Heart button */}
          <div style={{ position: 'absolute', bottom: 10, right: 10 }} onClick={e => e.stopPropagation()}>
            <HeartBtn pkgId={pkg.id} favs={favs} onToggle={onToggleFav} />
          </div>
        </div>

        <div style={{ padding: '13px 15px 15px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16, color: '#eee8d8', lineHeight: 1.2 }}>{pkg.name}</h3>
          <button onClick={e => { e.stopPropagation(); handleClick(); }} disabled={adding === pkg.id} style={{ width: '100%', padding: '9px', background: adding === pkg.id ? 'rgba(232,160,32,0.12)' : 'rgba(232,160,32,0.09)', border: '1px solid rgba(232,160,32,0.28)', borderRadius: 9, color: adding === pkg.id ? 'rgba(232,160,32,0.4)' : '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, cursor: adding === pkg.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { if (adding !== pkg.id) { e.currentTarget.style.background = 'linear-gradient(135deg,#e8a020,#c48518)'; e.currentTarget.style.color = '#06090f'; e.currentTarget.style.borderColor = 'transparent'; } }}
          onMouseLeave={e => { if (adding !== pkg.id) { e.currentTarget.style.background = 'rgba(232,160,32,0.09)'; e.currentTarget.style.color = '#e8a020'; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.28)'; } }}>
            {adding === pkg.id ? '⏳ Toevoegen...' : '🛒 In winkelwagen'}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main Store Page ───────────────────────────────────────────────────────────
export default function Store() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeView, setActiveView] = useState('all'); // 'all' | 'favs'
  const [cartOpen, setCartOpen] = useState(false);
  const [favsOpen, setFavsOpen] = useState(false);
  const [basket, setBasket] = useState(null);
  const [basketIdent, setBasketIdent] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [user, setUser] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [favs, setFavs] = useState([]);

  // Load favs from localStorage
  useEffect(() => { setFavs(getFavs()); }, []);

  function toggleFav(pkgId) {
    setFavs(prev => {
      const next = prev.includes(pkgId) ? prev.filter(id => id !== pkgId) : [...prev, pkgId];
      saveFavs(next);
      if (!prev.includes(pkgId)) setStatusMsg({ type: 'success', text: '❤️ Toegevoegd aan favorieten!' });
      return next;
    });
  }

  function showStatus(text, type = 'success') {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  }

  // Restore session
  useEffect(() => {
    const savedUser = sessionStorage.getItem('tebex_user');
    const savedBasket = sessionStorage.getItem('tebex_basket');
    if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch {} }
    if (savedBasket) { setBasketIdent(savedBasket); refreshBasket(savedBasket); }
  }, []);

  // Handle auth return
  useEffect(() => {
    if (!router.isReady) return;
    const { auth, status } = router.query;
    if (auth === 'return') {
      const savedBasket = sessionStorage.getItem('tebex_basket');
      if (savedBasket) {
        refreshBasket(savedBasket).then(b => {
          if (b?.data?.username) {
            const u = { username: b.data.username, avatar: b.data.links?.web_store };
            setUser(u);
            sessionStorage.setItem('tebex_user', JSON.stringify(u));
            showStatus(`✅ Welkom, ${b.data.username}!`);
          }
        });
      }
    }
    if (status === 'complete') showStatus('✅ Bestelling geslaagd! Bedankt voor je steun!');
    if (status === 'cancelled') showStatus('❌ Bestelling geannuleerd.', 'error');
    router.replace('/store', undefined, { shallow: true });
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

  async function handleLogin() {
    try {
      setCartLoading(true);
      const host = window.location.origin;
      const r = await fetch('/api/tebex/basket/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const data = await r.json();
      const ident = data?.data?.ident;
      if (!ident) { alert('Kon basket niet aanmaken: ' + (data.error || data.detail || JSON.stringify(data))); setCartLoading(false); return; }
      sessionStorage.setItem('tebex_basket', ident);
      setBasketIdent(ident); setBasket(data);
      const returnUrl = `${host}/store?auth=return`;
      const authR = await fetch(`/api/tebex/basket/auth?ident=${ident}&returnUrl=${encodeURIComponent(returnUrl)}`);
      const authData = await authR.json();
      const methods = Array.isArray(authData) ? authData : (authData.data || []);
      const cfx = methods.find(m => m.name === 'FiveM' || m.name === 'CFX') || methods[0];
      if (cfx?.url) { window.location.href = cfx.url; }
      else { alert('Geen CFX auth methode gevonden.'); setCartLoading(false); }
    } catch (err) { alert('Login fout: ' + err.message); setCartLoading(false); }
  }

  function handleLogout() {
    setUser(null); sessionStorage.removeItem('tebex_user'); sessionStorage.removeItem('tebex_basket');
    setBasket(null); setBasketIdent(null);
    showStatus('👋 Uitgelogd.', 'info');
  }

  async function handleAddToCart(pkg) {
    if (!user) { handleLogin(); return; }
    if (!basketIdent) { alert('Geen basket. Log opnieuw in.'); return; }
    setAddingId(pkg.id);
    try {
      const r = await fetch('/api/tebex/basket/add-package', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basketIdent, packageId: pkg.id, quantity: 1 }) });
      const data = await r.json();
      if (r.ok) { await refreshBasket(basketIdent); setCartOpen(true); showStatus(`✅ ${pkg.name} toegevoegd!`); }
      else { const msg = data?.message || data?.detail || data?.error || JSON.stringify(data); alert(`Kon item niet toevoegen:\n${msg}`); }
    } catch (e) { alert(`Er ging iets mis: ${e.message}`); }
    setAddingId(null); setCartLoading(false);
  }

  async function handleRemove(rowId) {
    if (!basketIdent || !rowId) return;
    setCartLoading(true);
    try {
      await fetch('/api/tebex/basket/remove-package', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basketIdent, rowId }) });
      await refreshBasket(basketIdent);
    } catch {}
    setCartLoading(false);
  }

  async function handleUpdateQty(rowId, pkgId, newQty) {
    if (!basketIdent) return;
    if (newQty <= 0) { await handleRemove(rowId); return; }
    setCartLoading(true);
    try {
      await fetch('/api/tebex/basket/remove-package', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basketIdent, rowId }) });
      await fetch('/api/tebex/basket/add-package', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basketIdent, packageId: pkgId, quantity: newQty }) });
      await refreshBasket(basketIdent);
    } catch {}
    setCartLoading(false);
  }

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
  const favCount = favs.length;

  const filtered = packages.filter(pkg => {
    if (activeView === 'favs' && !favs.includes(pkg.id)) return false;
    const matchCat = activeCategory === 'all' || pkg.category?.id == activeCategory;
    const matchSearch = !search || pkg.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Head><title>Store – Broodje RP</title><link rel="icon" href="/favicon.ico" /></Head>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} basket={basket} packages={packages} onRemove={handleRemove} onUpdateQty={handleUpdateQty} loading={cartLoading} user={user} onLogin={handleLogin} />
      <FavsDrawer open={favsOpen} onClose={() => setFavsOpen(false)} favs={favs} packages={packages} onAddToCart={handleAddToCart} onToggleFav={toggleFav} adding={addingId} user={user} onLogin={handleLogin} />

      <main style={{ paddingTop: 92, minHeight: '100vh', position: 'relative' }}>
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.12) saturate(0.5)' }} />
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'linear-gradient(180deg, rgba(6,9,15,0.6) 0%, rgba(6,9,15,0.88) 100%)' }} />

        {statusMsg && (
          <div style={{ position: 'fixed', top: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: statusMsg.type === 'success' ? 'rgba(61,214,140,0.15)' : 'rgba(232,160,32,0.12)', border: `1px solid ${statusMsg.type === 'success' ? 'rgba(61,214,140,0.4)' : 'rgba(232,160,32,0.35)'}`, backdropFilter: 'blur(16px)', padding: '12px 24px', borderRadius: 10, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, color: statusMsg.type === 'success' ? '#3dd68c' : '#e8a020', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'fadeUp 0.3s ease', whiteSpace: 'nowrap' }}>
            {statusMsg.text}
          </div>
        )}

        {/* Hero */}
        <div style={{ padding: '48px 24px 36px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 200, background: 'radial-gradient(ellipse, rgba(232,160,32,0.1), transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: 4, color: '#e8a020', marginBottom: 12, textTransform: 'uppercase' }}>🛒 Donatie Winkel</p>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: 0.5, marginBottom: 10 }}>KIES JE <span style={{ color: '#e8a020' }}>PAKKET</span></h1>
          <p style={{ color: 'rgba(138,155,176,0.7)', fontSize: 15, maxWidth: 440, margin: '0 auto 20px' }}>Support de server en ontvang exclusieve in-game voordelen.</p>

          {/* User profile bar */}
          {user ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '10px 20px', background: 'rgba(61,214,140,0.07)', border: '1px solid rgba(61,214,140,0.2)', borderRadius: 12, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(61,214,140,0.2)', border: '2px solid rgba(61,214,140,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎮</div>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, color: '#3dd68c' }}>{user.username}</span>
              </div>
              <div style={{ width: 1, height: 20, background: 'rgba(61,214,140,0.2)' }} />
              <button onClick={() => setFavsOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: favCount > 0 ? '#f05078' : 'rgba(160,175,190,0.5)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                ❤️ {favCount} favoriet{favCount !== 1 ? 'en' : ''}
              </button>
              <div style={{ width: 1, height: 20, background: 'rgba(61,214,140,0.2)' }} />
              <a href="/profile" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 13, color: 'rgba(160,175,190,0.6)', textDecoration: 'none' }}>👤 Profiel</a>
            </div>
          ) : (
            <button onClick={handleLogin} style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 9, color: '#e8a020', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              🎮 Inloggen met CFX om te kopen
            </button>
          )}
        </div>

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 24px 80px' }}>
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24, padding: '12px 16px', background: 'rgba(10,15,26,0.85)', border: '1px solid rgba(232,160,32,0.09)', borderRadius: 12, backdropFilter: 'blur(10px)' }}>
            <div style={{ position: 'relative', flex: '1 1 160px' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(138,155,176,0.35)', fontSize: 13 }}>🔍</span>
              <input type="text" placeholder="Zoek pakket..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 10px 8px 30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,160,32,0.1)', borderRadius: 8, color: '#eee8d8', fontSize: 13, fontFamily: 'Barlow, sans-serif' }}
              onFocus={e => e.target.style.borderColor = 'rgba(232,160,32,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(232,160,32,0.1)'} />
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {/* View tabs */}
              <button onClick={() => setActiveView('all')} style={{ padding: '6px 12px', background: activeView === 'all' ? 'linear-gradient(135deg,#e8a020,#c48518)' : 'rgba(255,255,255,0.03)', border: '1px solid', borderColor: activeView === 'all' ? 'transparent' : 'rgba(232,160,32,0.1)', borderRadius: 7, color: activeView === 'all' ? '#06090f' : 'rgba(238,232,216,0.55)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Alles</button>
              <button onClick={() => setActiveView('favs')} style={{ padding: '6px 12px', background: activeView === 'favs' ? 'rgba(240,80,120,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeView === 'favs' ? 'rgba(240,80,120,0.5)' : 'rgba(232,160,32,0.1)'}`, borderRadius: 7, color: activeView === 'favs' ? '#f05078' : 'rgba(238,232,216,0.55)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                ❤️ Favorieten {favCount > 0 && `(${favCount})`}
              </button>
              <div style={{ width: 1, background: 'rgba(232,160,32,0.1)', margin: '0 3px' }} />
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id === activeCategory ? 'all' : cat.id)} style={{ padding: '6px 12px', background: activeCategory === cat.id ? 'rgba(232,160,32,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeCategory === cat.id ? 'rgba(232,160,32,0.4)' : 'rgba(232,160,32,0.08)'}`, borderRadius: 7, color: activeCategory === cat.id ? '#e8a020' : 'rgba(238,232,216,0.5)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>{cat.name}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 7, marginLeft: 'auto', flexShrink: 0 }}>
              <button onClick={() => setFavsOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', background: favCount > 0 ? 'rgba(240,80,120,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${favCount > 0 ? 'rgba(240,80,120,0.35)' : 'rgba(232,160,32,0.1)'}`, borderRadius: 8, color: favCount > 0 ? '#f05078' : 'rgba(238,232,216,0.45)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                ❤️ {favCount > 0 ? favCount : ''}
              </button>
              <button onClick={() => setCartOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', background: cartCount > 0 ? 'linear-gradient(135deg,#e8a020,#c48518)' : 'rgba(255,255,255,0.03)', border: `1px solid ${cartCount > 0 ? 'transparent' : 'rgba(232,160,32,0.1)'}`, borderRadius: 8, color: cartCount > 0 ? '#06090f' : 'rgba(238,232,216,0.45)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                🛒 {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'Wagen'}
              </button>
            </div>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: '90px 0' }}><div style={{ width: 48, height: 48, border: '2px solid rgba(232,160,32,0.1)', borderTop: '2px solid #e8a020', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 18px' }} /><p style={{ color: 'rgba(138,155,176,0.45)', fontSize: 14 }}>Store laden...</p></div>}

          {error && !loading && (
            <div style={{ background: 'rgba(240,80,96,0.06)', border: '1px solid rgba(240,80,96,0.2)', borderRadius: 14, padding: '40px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>⚠️</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 10, color: '#f05060' }}>Fout bij laden</h3>
              <p style={{ color: 'rgba(238,232,216,0.7)', fontSize: 14 }}>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', opacity: 0.5 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{activeView === 'favs' ? '🤍' : '📦'}</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{activeView === 'favs' ? 'Nog geen favorieten' : 'Geen producten gevonden'}</h3>
              <p style={{ color: 'rgba(138,155,176,0.5)', fontSize: 14 }}>{activeView === 'favs' ? 'Klik op ❤️ bij een pakket om het op te slaan.' : 'Probeer een andere zoekterm.'}</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <p style={{ color: 'rgba(138,155,176,0.35)', fontSize: 11, marginBottom: 18, letterSpacing: 1 }}>{filtered.length} PAKKET{filtered.length !== 1 ? 'TEN' : ''}{activeView === 'favs' ? ' (FAVORIETEN)' : ''}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
                {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} onAddToCart={handleAddToCart} adding={addingId} user={user} onLogin={handleLogin} favs={favs} onToggleFav={toggleFav} />)}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </>
  );
}
