SafeVoice Worldwide user-field upgrade (2026)

Added to the worldwide user report flow:
- Full country selector generated from ISO country data.
- Full country phone-code selector. Users select a country code and write their local number separately.
- Global Azure Translator language selector; old Nigeria-only Yoruba/Hausa/Igbo shortcut list was removed from the user form.
- Report payload now sends country, countryCode, phoneCountryDialCode, phoneCountryIso2, phoneCountryName, phoneNationalNumber, reportLanguageCode, translationTargetLanguage, originalIncidentDetails, and translatedIncidentDetails.

Backend updates:
- Case contact schema stores international phone metadata.
- Case controller normalizes international phone contact fields.
- Translation language API returns the global Azure-supported language list used by the worldwide.

Render reminder:
Backend env must include AZURE_TRANSLATOR_KEY, AZURE_TRANSLATOR_REGION, and AZURE_TRANSLATOR_ENDPOINT for live translation.
