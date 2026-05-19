SAFEVOICE FINAL ENV FIX

Folder names were kept unchanged:
- backend
- worldwide

I removed the confusing root .env files and removed duplicate .env.example files.
Only these env files remain:
- backend/.env              local backend values
- backend/.env.sample       safe template for GitHub/Render
- worldwide/.env            local worldwide frontend values
- worldwide/.env.sample     safe template for GitHub/Render

IMPORTANT MONGODB NOTE
Your backend/.env now uses the MongoDB password found in your uploaded env sample.
If this is not your current MongoDB Atlas database-user password, open:
  backend/.env
and replace only the password part in MONGODB_URI.

Current format used:
  mongodb+srv://SafeVoiceWorldwide:YOUR_PASSWORD@cluster0.nzs7yju.mongodb.net/safevoice?retryWrites=true&w=majority&appName=Cluster0

If your password contains special characters like @ # % / ? & or spaces, URL-encode the password first.

START BACKEND
  cd C:\Users\safevoice\backend
  npm install
  npm start

START WORLDWIDE FRONTEND
  cd C:\Users\safevoice\worldwide
  npm install
  npm run dev

OR FROM ROOT
  cd C:\Users\safevoice
  npm run install:all
  npm start

Render Backend env variables must be added in Render dashboard, not committed to GitHub:
- MONGODB_URI
- JWT_SECRET
- AUTH_SECRET
- AZURE_TRANSLATOR_KEY
- AZURE_TRANSLATOR_REGION
- AZURE_TRANSLATOR_ENDPOINT
- CLIENT_URL
- WORLDWIDE_URL
- CORS_ORIGINS
- USE_FILE_DB
- COMMUNITY_RISK_FEATURE
- INDIGENOUS_LANGUAGE_REPORTING

GitHub should receive only .env.sample files, not real .env files.
