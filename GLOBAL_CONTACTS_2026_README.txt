SAFEVOICE GLOBAL CONTACT DIRECTORY - 2026 UPGRADE

What was upgraded:
1. backend/data/globalDirectory.json now contains 1,001 seeded directory records across 249 ISO countries/territories plus EU regional emergency support.
2. Every country has records for:
   - Emergency services
   - Police / law enforcement
   - Child protection / social welfare
   - Social support / protection agency
3. Staff dashboard can select country + category and see:
   - Local country name
   - Emergency number seed
   - Direct phone when available
   - Verification status
   - Last reviewed date
   - Source URL / source name
   - Notes explaining the local agency naming difference
4. Backend exposes:
   - GET /api/global-directory/meta
   - GET /api/global-directory/countries
   - GET /api/global-directory/contacts?country=NG&category=police
   - GET /api/global-directory/contacts?country=US&category=child_protection

Important truth about “current 2026 complete contact list”:
A global child-safety/police directory cannot be safely treated as permanently complete from one static ZIP because country, state, district, and office contacts change frequently. This upgrade makes the system complete structurally and ready for worldwide use, but any country where verificationStatus is requires_local_verification must be confirmed by your team before operational field use.

How to add exact verified contacts:
Open backend/data/globalDirectory.json and add records using this shape:

{
  "countryCode": "NG",
  "country": "Nigeria",
  "category": "police",
  "localName": "Nigeria Police Force - Lagos Command",
  "emergencyNumber": "112",
  "phone": "+234...",
  "contactType": "state_police_command",
  "sourceName": "Official police website or verified government source",
  "sourceUrl": "https://...",
  "lastReviewed": "2026-05-19",
  "verificationStatus": "verified_2026",
  "notes": "Use for Lagos state case escalation."
}

Accepted categories:
- emergency
- police
- child_protection
- social_support

Country naming examples:
- Nigeria: Police / Social Welfare / Ministry of Women Affairs / Child Protection
- United States: Law Enforcement / Child Protective Services (CPS)
- United Kingdom: Police / Children’s Social Care / Safeguarding Team
- Canada: Police / Child and Family Services
- Australia: Police / Child Protection / State or Territory Department
- Generic worldwide: Police or Law Enforcement / Child Protection / Social Services / Family Services / Safeguarding / Protection Agency

Deployment:
Render backend root directory: backend
Build command: npm install
Start command: node server.js

Render worldwide root directory: worldwide
Build command: npm install && npm run build
Publish directory: worldwide/dist

Backend env variables:
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_secret
AUTH_SECRET=your_long_secret
CLIENT_URL=https://safevoice-worldwide.onrender.com
WORLDWIDE_URL=https://safevoice-worldwide.onrender.com
CORS_ORIGINS=https://safevoice-worldwide.onrender.com,http://localhost:5173,http://127.0.0.1:5173
AZURE_TRANSLATOR_KEY=your_azure_translator_key
AZURE_TRANSLATOR_REGION=your_azure_region
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com

Worldwide env variable:
VITE_API_BASE_URL=https://safevoice.onrender.com/api

Safety note:
Always show emergency disclaimers in production: if someone is in immediate danger, they should contact local emergency services directly. SafeVoice should support reporting and staff triage, not replace emergency services.
