import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PackageCard({ pkg }) {
  const price = pkg.price ? `€${parseFloat(pkg.price).toFixed(2)}` : 'Gratis';
  const image = pkg.image || null;
  const buyUrl = `https://checkout.tebex.io/checkout/packages/add/${pkg.id}/single`;

  return (
    <div style={{
      background: 'rgba(17,25,39,0.9)',
      border: '1px solid rgba(232,160,32,0.12)',
      borderRadius: 12,
      overflow: 'hidden',
      transition: 'all 0.3s',
      display: 'flex', flexDirection: 'column',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(232,160,32,0.4)';
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(232,160,32,0.12)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      {/* Image */}
      <div style={{
        height: 180,
        background: image
          ? `url(${image}) center/cover`
          : 'linear-gradient(135deg, rgba(232,160,32,0.15), rgba(196,133,24,0.05))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {!image && (
          <span style={{ fontSize: 48, opacity: 0.4 }}>🎁</span>
        )}
        {/* Price badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: parseFloat(pkg.price) > 0
            ? 'linear-gradient(135deg, #e8a020, #c48518)'
            : 'linear-gradient(135deg, #40c080, #2a8055)',
          color: '#080c14',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 700, fontSize: 15,
          padding: '4px 12px',
          borderRadius: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          {price}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 700, fontSize: 18,
          marginBottom: 8,
          color: '#f0e8d8',
        }}>{pkg.name}</h3>

        {pkg.description && (
          <p style={{
            color: 'rgba(138,155,176,0.8)',
            fontSize: 13,
            lineHeight: 1.6,
            marginBottom: 16,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: pkg.description.replace(/<[^>]+>/g, '') }}
          />
        )}

        <a href={buyUrl} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #e8a020, #c48518)',
            color: '#080c14',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: 15,
            letterSpacing: 0.5,
            borderRadius: 7,
            boxShadow: '0 4px 16px rgba(232,160,32,0.25)',
            transition: 'all 0.2s',
            marginTop: 'auto',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(232,160,32,0.5)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,160,32,0.25)'}
        >
          Kopen →
        </a>
      </div>
    </div>
  );
}

export default function Store() {
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Try fetching categories with packages included
        const catRes = await fetch('/api/tebex/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          const cats = Array.isArray(catData) ? catData : (catData.data || []);
          setCategories(cats);

          // Extract all packages from categories
          const allPkgs = [];
          cats.forEach(cat => {
            if (cat.packages && Array.isArray(cat.packages)) {
              cat.packages.forEach(pkg => {
                if (!allPkgs.find(p => p.id === pkg.id)) {
                  allPkgs.push({ ...pkg, categoryName: cat.name });
                }
              });
            }
          });

          if (allPkgs.length > 0) {
            setPackages(allPkgs);
          } else {
            // Fallback: fetch packages separately
            const pkgRes = await fetch('/api/tebex/packages');
            if (pkgRes.ok) {
              const pkgData = await pkgRes.json();
              const pkgs = Array.isArray(pkgData) ? pkgData : (pkgData.data || []);
              setPackages(pkgs);
            }
          }
        } else {
          // Fallback: fetch packages directly
          const pkgRes = await fetch('/api/tebex/packages');
          if (!pkgRes.ok) throw new Error('Kon producten niet laden. Controleer je API key.');
          const pkgData = await pkgRes.json();
          const pkgs = Array.isArray(pkgData) ? pkgData : (pkgData.data || []);
          setPackages(pkgs);
        }
      } catch (err) {
        setError(err.message || 'Er is een fout opgetreden.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = activeCategory === 'all' || pkg.category?.id === activeCategory || pkg.categoryName === activeCategory;
    const matchesSearch = !search || pkg.name?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Store – Broodje RP</title>
        <meta name="description" content="Doneer aan Broodje RP en ontvang exclusieve in-game voordelen." />
      </Head>

      <Navbar />

      <main style={{ paddingTop: 80, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(232,160,32,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(232,160,32,0.12)',
          padding: '60px 24px 40px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: 'clamp(36px, 6vw, 64px)',
            letterSpacing: 1,
            marginBottom: 12,
          }}>
            DONATIE <span style={{ color: '#e8a020' }}>STORE</span>
          </h1>
          <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Support de server en ontvang exclusieve in-game voordelen. Elke donatie helpt!
          </p>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
          {/* Search & Filter */}
          <div style={{
            display: 'flex', gap: 16, flexWrap: 'wrap',
            marginBottom: 40, alignItems: 'center',
          }}>
            <input
              type="text"
              placeholder="Zoek producten..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: '1 1 200px',
                padding: '10px 16px',
                background: 'rgba(17,25,39,0.8)',
                border: '1px solid rgba(232,160,32,0.2)',
                borderRadius: 8,
                color: '#f0e8d8',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'Exo 2, sans-serif',
              }}
            />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveCategory('all')}
                style={{
                  padding: '8px 16px',
                  background: activeCategory === 'all' ? 'rgba(232,160,32,0.2)' : 'rgba(17,25,39,0.8)',
                  border: `1px solid ${activeCategory === 'all' ? 'rgba(232,160,32,0.6)' : 'rgba(232,160,32,0.15)'}`,
                  borderRadius: 6,
                  color: activeCategory === 'all' ? '#e8a020' : 'rgba(138,155,176,0.8)',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600, fontSize: 14,
                  letterSpacing: 0.5,
                  transition: 'all 0.2s',
                }}>
                Alles
              </button>
              {categories.map(cat => (
                <button key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '8px 16px',
                    background: activeCategory === cat.id ? 'rgba(232,160,32,0.2)' : 'rgba(17,25,39,0.8)',
                    border: `1px solid ${activeCategory === cat.id ? 'rgba(232,160,32,0.6)' : 'rgba(232,160,32,0.15)'}`,
                    borderRadius: 6,
                    color: activeCategory === cat.id ? '#e8a020' : 'rgba(138,155,176,0.8)',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 600, fontSize: 14,
                    letterSpacing: 0.5,
                    transition: 'all 0.2s',
                  }}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{
                width: 48, height: 48,
                border: '3px solid rgba(232,160,32,0.2)',
                borderTop: '3px solid #e8a020',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }} />
              <p style={{ color: 'rgba(138,155,176,0.7)', fontSize: 16 }}>Producten laden...</p>
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(232,64,64,0.08)',
              border: '1px solid rgba(232,64,64,0.3)',
              borderRadius: 12,
              padding: '32px',
              textAlign: 'center',
              maxWidth: 700, margin: '0 auto',
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#e84040' }}>
                Fout bij laden
              </h3>
              <p style={{ color: 'rgba(240,232,216,0.8)', fontSize: 14, marginBottom: 16 }}>{error}</p>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8, padding: '16px',
                textAlign: 'left', marginBottom: 16,
              }}>
                <p style={{ color: '#e8a020', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                  Controleer het volgende:
                </p>
                <p style={{ color: 'rgba(138,155,176,0.9)', fontSize: 13, lineHeight: 1.8 }}>
                  1. Gebruik de <strong style={{ color: '#f0e8d8' }}>Plugin Secret Key</strong> (niet de public key)<br/>
                  2. Te vinden op: <strong style={{ color: '#f0e8d8' }}>creator.tebex.io → je store → Settings → API</strong><br/>
                  3. Na toevoegen in Vercel: <strong style={{ color: '#f0e8d8' }}>herdeployen!</strong> (Vercel → Deployments → Redeploy)
                </p>
              </div>

              <a href="/api/tebex/debug" target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  background: 'rgba(232,160,32,0.15)',
                  border: '1px solid rgba(232,160,32,0.4)',
                  borderRadius: 6,
                  color: '#e8a020',
                  fontSize: 13,
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                }}>
                🔍 Open debug info
              </a>
            </div>
          )}

          {!loading && !error && filteredPackages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>🛒</div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 24, marginBottom: 8 }}>
                Geen producten gevonden
              </h3>
              <p style={{ color: 'rgba(138,155,176,0.7)' }}>
                {search ? 'Probeer een andere zoekterm.' : 'Er zijn nog geen producten in de store.'}
              </p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && filteredPackages.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}>
              {filteredPackages.map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: rgba(138,155,176,0.4); }
        input:focus { border-color: rgba(232,160,32,0.5) !important; }
      `}</style>
    </>
  );
}
