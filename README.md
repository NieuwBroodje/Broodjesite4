# 🍞 Broodje RP – Website

Een professionele FiveM RP server website met Tebex store integratie.

## 🚀 Deployen op Vercel

### Stap 1: Upload naar GitHub
1. Maak een nieuw GitHub repository aan
2. Upload alle bestanden hierin

### Stap 2: Importeer in Vercel
1. Ga naar [vercel.com](https://vercel.com)
2. Klik op "Add New Project"
3. Importeer je GitHub repository
4. Framework preset: **Next.js** (wordt automatisch herkend)

### Stap 3: Environment Variable instellen ⚠️ BELANGRIJK
1. In Vercel, ga naar je project → **Settings** → **Environment Variables**
2. Voeg toe:
   - **Name:** `TEBEX_API_KEY`
   - **Value:** jouw Tebex Plugin Secret Key
   - **Environment:** Production, Preview, Development (vink alle aan)
3. Klik **Save**

### Stap 4: Deploy
Klik op **Deploy** en je website is live!

## 🔑 Tebex API Key vinden
1. Ga naar [creator.tebex.io](https://creator.tebex.io)
2. Selecteer je webstore
3. Ga naar **Settings** → **API**
4. Kopieer je **Plugin Secret Key** (NIET je public API key)

## ✏️ Aanpassen

### Server IP wijzigen
Open `pages/index.js` en zoek naar `jouw-server-ip`

### Discord link wijzigen
Zoek in alle bestanden naar `https://discord.gg/jouw-discord` en vervang met je eigen Discord link

### Staff aanpassen
Open `pages/staff.js` en pas de `staffMembers` array aan

### Regels aanpassen
Open `pages/rules.js` en pas de `rules` array aan

## 📁 Bestandsstructuur

```
broodje-rp/
├── pages/
│   ├── api/
│   │   └── tebex/
│   │       ├── packages.js    ← Tebex API proxy (packages)
│   │       ├── categories.js  ← Tebex API proxy (categories)
│   │       └── info.js        ← Tebex API proxy (store info)
│   ├── _app.js
│   ├── index.js               ← Homepage
│   ├── store.js               ← Donatie Store
│   ├── rules.js               ← Regels
│   └── staff.js               ← Staff pagina
├── components/
│   ├── Navbar.js
│   └── Footer.js
├── styles/
│   └── globals.css
├── .env.example
├── next.config.js
└── package.json
```
