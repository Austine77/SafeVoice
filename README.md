# SafeVoice Worldwide

SafeVoice Worldwide is a child abuse, violence, and emergency reporting platform with a secure user reporting flow, staff/admin dashboard, voice-note support, MongoDB backend, Azure Translator integration, and a global protection directory.

## Main folders

- `backend/` - Express, MongoDB, Socket.IO, Azure Translator, case/report APIs.
- `worldwide/` - Static/Vite-ready worldwide pages for users and staff.
- `render.yaml` - Render Blueprint for backend + worldwide deployment.

## Key backend APIs

- `GET /api/health`
- `POST /api/cases`
- `GET /api/cases`
- `GET /api/cases/:caseId`
- `PATCH /api/cases/:caseId`
- `GET /api/translation/languages`
- `POST /api/translation/translate`
- `GET /api/global-directory/countries`
- `GET /api/global-directory/contacts?country=NG&category=police`

## Render environment variables

Set these in the backend service:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
CLIENT_URL=https://safevoice-worldwide.onrender.com
WORLDWIDE_URL=https://safevoice-worldwide.onrender.com
CORS_ORIGINS=https://safevoice-worldwide.onrender.com,http://localhost:5173,http://127.0.0.1:5173
JWT_SECRET=your_long_random_secret
AUTH_SECRET=your_long_random_secret
AZURE_TRANSLATOR_KEY=your_azure_translator_key
AZURE_TRANSLATOR_REGION=your_azure_region
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
```

Set this in the worldwide service:

```env
VITE_API_BASE_URL=https://safevoice.onrender.com/api
```

## Local development

Backend:

```bash
cd backend
npm install
npm run dev
```

Worldwide:

```bash
cd worldwide
npm install
npm run dev
```

## Build worldwide

```bash
cd worldwide
npm install
npm run build
```

The worldwide build writes deployable files to `worldwide/dist`.
