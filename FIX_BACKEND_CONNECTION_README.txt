UPDATED FIXES

1. worldwide now tries these backend URLs automatically:
   - https://safevoice.onrender.com/api
   - https://safevoice.onrender.com/api
   - https://safevoice.onrender.com/api

2. Added SafeVoice-api-base meta tag to index.html and staff.html.

3. Updated worldwide .env and .env.example to SafeVoice-backend.onrender.com/api.

4. Added render.yaml so Render can deploy backend from backend/ and worldwide from worldwide/.

Deploy backend service from backend/ with:
- Build Command: npm install
- Start Command: node server.js

Deploy worldwide service from worldwide/ as static site or use render.yaml.
