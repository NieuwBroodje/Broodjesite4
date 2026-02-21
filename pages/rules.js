import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const rules = [
  {
    category: '📋 Algemene Regels',
    items: [
      'Respect iedereen op de server, zowel spelers als staff.',
      'Geen discriminatie, racisme of haatzaaien in welke vorm dan ook.',
      'Gebruik geen cheats, hacks of exploits. Dit resulteert in een permanente ban.',
      'Luister altijd naar de aanwijzingen van staffleden.',
      'Meta-gaming (informatie uit buiten het spel gebruiken) is verboden.',
      'Power-gaming (onrealistische acties forceren op andere spelers) is niet toegestaan.',
    ],
  },
  {
    category: '🎭 Roleplay Regels',
    items: [
      'Speel altijd In-Character (IC). Verlaat de roleplay situatie niet zomaar (RDM/VDM).',
      'New Life Rule (NLR): Na je dood ben je je vorige levensgebeurtenissen vergeten.',
      'Random Deathmatch (RDM): Aanvallen zonder geldige RP reden is verboden.',
      'Vehicle Deathmatch (VDM): Mensen aanrijden zonder RP reden is verboden.',
      'Combat-logging (de server verlaten tijdens een actieve situatie) is verboden.',
      'Safezones zijn veilige zones. Hier mag niet worden gevochten of gestolen.',
    ],
  },
  {
    category: '💬 Communicatie',
    items: [
      'Gebruik de juiste kanalen (IC chat voor in-game communicatie).',
      'Out-of-Character (OOC) chat alleen gebruiken voor dringende berichten.',
      'Geen spam, caps-lock misbruik of onnodige berichten in de chat.',
      'Discord en in-game gedrag vallen beide onder de serverregels.',
    ],
  },
  {
    category: '🚓 Politie & Criminelen',
    items: [
      'Houd een realistische 2:1 ratio aan (maximaal 2 criminelen per politieagent bij overvallen).',
      'Bij overvallen minimaal 2 politieagenten online hebben.',
      'Gijzelaars mogen niet zonder reden worden geëxecuteerd.',
      'Onderhandelingen te goeder trouw voeren.',
    ],
  },
];

export default function Rules() {
  return (
    <>
      <Head>
        <title>Regels – Broodje RP</title>
      </Head>
      <Navbar />
      <main style={{ paddingTop: 80, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(232,160,32,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(232,160,32,0.12)',
          padding: '60px 24px 40px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700, fontSize: 'clamp(36px, 6vw, 64px)',
            letterSpacing: 1, marginBottom: 12,
          }}>
            SERVER <span style={{ color: '#e8a020' }}>REGELS</span>
          </h1>
          <p style={{ color: 'rgba(138,155,176,0.8)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Lees de regels zorgvuldig. Onwetendheid is geen excuus.
          </p>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
          {rules.map((section, i) => (
            <div key={i} style={{
              background: 'rgba(17,25,39,0.8)',
              border: '1px solid rgba(232,160,32,0.12)',
              borderRadius: 12,
              marginBottom: 20,
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '18px 24px',
                borderBottom: '1px solid rgba(232,160,32,0.12)',
                background: 'rgba(232,160,32,0.05)',
              }}>
                <h2 style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 700, fontSize: 22,
                  color: '#e8a020',
                }}>{section.category}</h2>
              </div>
              <div style={{ padding: '20px 24px' }}>
                {section.items.map((rule, j) => (
                  <div key={j} style={{
                    display: 'flex', gap: 12,
                    padding: '10px 0',
                    borderBottom: j < section.items.length - 1 ? '1px solid rgba(232,160,32,0.06)' : 'none',
                  }}>
                    <span style={{
                      minWidth: 24, height: 24,
                      background: 'rgba(232,160,32,0.15)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, color: '#e8a020', fontWeight: 700,
                      marginTop: 2,
                    }}>{j + 1}</span>
                    <p style={{ color: 'rgba(240,232,216,0.85)', fontSize: 14, lineHeight: 1.7 }}>{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
