# Nexus Master Admin Terminal

🛡️ Zabezpečený administrátorský terminál pro správu Nexus Game Companion.

## 🚀 Funkce

- **Generator**: Vytváření a editace herních událostí (Master Catalog)
- **Character Management**: Správa herních postav a jejich atributů
- **Google OAuth 2.0**: Bezpečné přihlášení s nativní 2FA

## 🔒 Zabezpečení

- Přístup pouze pro autorizovaný admin účet
- Google OAuth 2.0 autentizace
- Email whitelist na backendu
- HTTPS deployment

## 🛠️ Technologie

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Auth**: Google OAuth 2.0
- **Backend**: Sdílený s Player App (`https://nexus-backend-m492.onrender.com`)
- **Database**: MongoDB Atlas

## 📦 Lokální vývoj

```bash
# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev

# Build pro produkci
npm run build
```

## 🌐 Deployment

Aplikace je automaticky deployována na GitHub Pages při push do `main` větve.

**Live URL**: `https://[username].github.io/nexus-admin-terminal/`

## ⚙️ Konfigurace

Vytvořte `.env` soubor:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

> **Poznámka**: Pro GitHub Actions deployment je nutné přidat `VITE_GOOGLE_CLIENT_ID` jako secret v repository settings.

## 📝 Licence

Private - pouze pro autorizované použití.
