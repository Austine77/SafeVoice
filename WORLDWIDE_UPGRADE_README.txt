SAFEVOICE WORLDWIDE UPGRADE - WHAT WAS ADDED

1. Worldwide report support
- User report payload now stores country, countryCode, reportLanguageCode, translationTargetLanguage.
- Staff dashboard shows country, original report, translated report, translation target, and translation status.
- User form now supports country selection and report language selection.

2. Azure Translator backend integration
- New backend service: backend/services/translatorService.js
- New routes:
  GET  /api/translation/languages
  POST /api/translation/translate
- Reports are translated automatically during case creation when text is provided.
- If Azure keys are missing, the original text is saved and translationStatus explains that translator is not configured.

Required Render backend environment variables:
MONGODB_URI=your MongoDB Atlas URI
JWT_SECRET=long random secret
AUTH_SECRET=long random secret
CLIENT_URL=https://safevoice-worldwide.onrender.com
WORLDWIDE_URL=https://safevoice-worldwide.onrender.com
CORS_ORIGINS=https://safevoice-worldwide.onrender.com,http://localhost:5173,http://127.0.0.1:5173
AZURE_TRANSLATOR_KEY=your Azure Translator key
AZURE_TRANSLATOR_REGION=your Azure region, example: global, eastus, westeurope
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com

3. Global staff directory
- New backend service: backend/services/globalDirectoryService.js
- New route group:
  GET /api/global-directory/countries
  GET /api/global-directory/contacts?country=NG&category=police
- Staff page now has a Global Protection Directory section.
- It supports categories for police/law enforcement, child protection/social welfare, social support/protection agency, and emergency services.
- Country naming is flexible because every country uses different terms: CPS, social services, safeguarding, child welfare, protection agency, law enforcement, police, social development, women/family services, etc.

4. Render deployment structure
- Backend rootDir: backend
- Worldwide rootDir: worldwide
- Worldwide build now uses a safe static build script: npm install && npm run build
- The build copies index.html, staff.html, team.html, police-contact.html, social-worker-contact.html, assets, and images into dist.

5. Local commands
Backend:
cd backend
npm install
npm run dev

Worldwide:
cd worldwide
npm install
npm run dev

Production build test:
cd worldwide
npm install
npm run build

Important security note:
Never paste Azure keys or MongoDB URI into worldwide files. Put them only in Render backend Environment Variables.
