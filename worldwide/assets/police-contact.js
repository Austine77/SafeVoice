(function () {
  const AUTH_KEY = "SafeVoice-staff-authenticated";
  if (window.localStorage.getItem(AUTH_KEY) !== "1" && window.sessionStorage.getItem(AUTH_KEY) !== "1") {
    window.location.href = "./staff.html";
    return;
  }

  const countrySelect = document.getElementById("countrySelect");
  const directoryInput = document.getElementById("directoryInput");
  const directoryStatus = document.getElementById("directoryStatus");
  const directoryResults = document.getElementById("directoryResults");
  const searchDirectoryBtn = document.getElementById("searchDirectoryBtn");
  const loadAllBtn = document.getElementById("loadAllBtn");

  const normalize = (value) => String(value || "").trim().replace(/\/+$/, "");
  const API_BASES = [...new Set([
    window.SAFEVOICE_API_BASE_URL,
    document.querySelector('meta[name="safevoice-api-base"]')?.getAttribute("content"),
    window.localStorage.getItem("SafeVoice-working-api-base"),
    window.localStorage.getItem("safevoice-working-api-base"),
    window.localStorage.getItem("safevoice-api-base"),
    "https://safevoice.onrender.com/api",
    `${window.location.origin}/api`,
    ...(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? ["http://localhost:5000/api", "http://127.0.0.1:5000/api"] : []),
  ].map(normalize).filter(Boolean))];

  let workingApiBase = API_BASES[0] || `${window.location.origin}/api`;
  let countries = Array.isArray(window.SAFEVOICE_COUNTRIES) ? window.SAFEVOICE_COUNTRIES : [];

  function escapeHtml(value = "") {
    return String(value || "").replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  }

  function setStatus(message, type = "info") {
    directoryStatus.textContent = message;
    directoryStatus.className = `status ${type}`;
  }

  function rememberApiBase(base) {
    workingApiBase = normalize(base);
    try {
      window.localStorage.setItem("SafeVoice-working-api-base", workingApiBase);
      window.localStorage.setItem("safevoice-working-api-base", workingApiBase);
      window.localStorage.setItem("safevoice-api-base", workingApiBase);
    } catch (error) {}
  }

  async function apiGet(path) {
    let lastError = null;
    for (const base of [workingApiBase, ...API_BASES]) {
      if (!base) continue;
      try {
        const response = await fetch(`${base}${path}`, { headers: { Accept: "application/json" }, cache: "no-store" });
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        if (!response.ok) throw new Error(data.message || `Request failed with ${response.status}`);
        rememberApiBase(base);
        return data;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("Unable to connect to the SafeVoice backend.");
  }

  function renderCountries() {
    const unique = [...new Map(countries.map((item) => [item.code, item])).values()]
      .filter((item) => item.code && item.name)
      .sort((a, b) => a.name.localeCompare(b.name));
    countrySelect.innerHTML = unique.map((item) => `<option value="${escapeHtml(item.code)}">${escapeHtml(item.name)} ${item.dialCode ? `(${escapeHtml(item.dialCode)})` : ""}</option>`).join("");
    if ([...countrySelect.options].some((option) => option.value === "NG")) countrySelect.value = "NG";
  }

  function badgeClass(status = "") {
    return String(status).includes("requires") ? "escalation" : "verified";
  }

  function badgeLabel(status = "") {
    return String(status).includes("requires") ? "Needs local verification" : "Verified source";
  }

  function renderActions(item) {
    const phone = String(item.phone || item.emergencyNumber || "").trim();
    const clean = phone.replace(/[^+0-9]/g, "");
    const call = clean && !/verify/i.test(phone) ? `<a class="secondary-btn" href="tel:${escapeHtml(clean)}">Call</a>` : "";
    const whats = clean && !/verify/i.test(phone) ? `<a class="secondary-btn" href="https://wa.me/${escapeHtml(clean.replace(/^\+/, ""))}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : "";
    const source = item.sourceUrl ? `<a class="ghost-btn" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Open source</a>` : "";
    return `<div class="btn-row" style="margin-top:14px;">${call}${whats}${source}</div>`;
  }

  function renderContacts(items, meta = {}) {
    if (!items.length) {
      directoryResults.innerHTML = '<div class="notice">No police contact matched this country/search. Add a verified record in backend/data/globalDirectory.json.</div>';
      setStatus("No matching police contact found.", "info");
      return;
    }

    directoryResults.innerHTML = items.map((item) => `
      <article class="result-card">
        <div class="result-top">
          <div>
            <h3>${escapeHtml(item.country || item.countryCode)} — ${escapeHtml(item.localName || "Police / law enforcement")}</h3>
            <p>${escapeHtml(item.categoryLabel || "Police / law enforcement")}</p>
          </div>
          <span class="badge ${badgeClass(item.verificationStatus)}">${badgeLabel(item.verificationStatus)}</span>
        </div>
        <div class="result-meta"><strong>Emergency number:</strong> ${escapeHtml(item.emergencyNumber || "Not listed")}</div>
        <div class="result-meta"><strong>Phone:</strong> ${escapeHtml(item.phone || "Not listed publicly")}</div>
        <div class="result-meta"><strong>Contact type:</strong> ${escapeHtml(item.contactType || "police_or_law_enforcement")}</div>
        <div class="result-meta"><strong>Notes:</strong> ${escapeHtml(item.notes || "Verify with an official country source before use.")}</div>
        <div class="result-meta"><strong>Source:</strong> ${escapeHtml(item.sourceName || "Official/local verification required")} · <strong>Last reviewed:</strong> ${escapeHtml(item.lastReviewed || meta.generatedAt || "2026")}</div>
        ${renderActions(item)}
      </article>
    `).join("");

    setStatus(`${items.length} police/law-enforcement contact record${items.length === 1 ? "" : "s"} shown. ${meta.warning || "Verify locally before field use."}`, "success");
  }

  async function loadCountriesFromBackend() {
    try {
      const payload = await apiGet("/global-directory/countries");
      if (Array.isArray(payload.countries) && payload.countries.length) {
        countries = payload.countries.map((item) => {
          const match = (window.SAFEVOICE_COUNTRIES || []).find((country) => country.code === item.code);
          return { ...item, dialCode: match?.dialCode || "" };
        });
      }
    } catch (error) {
      setStatus("Using offline country list. Backend country list could not be reached yet.", "info");
    }
    renderCountries();
  }

  async function searchContacts() {
    const country = countrySelect.value || "NG";
    const query = directoryInput.value.trim();
    setStatus("Loading worldwide police contacts...", "info");
    try {
      const path = `/global-directory/contacts?country=${encodeURIComponent(country)}&category=police${query ? `&q=${encodeURIComponent(query)}` : ""}`;
      const payload = await apiGet(path);
      renderContacts(payload.results || [], payload.meta || {});
    } catch (error) {
      directoryResults.innerHTML = "";
      setStatus(error.message || "Unable to load police contacts.", "error");
    }
  }

  searchDirectoryBtn.addEventListener("click", searchContacts);
  loadAllBtn.addEventListener("click", () => { directoryInput.value = ""; searchContacts(); });
  countrySelect.addEventListener("change", searchContacts);
  directoryInput.addEventListener("keydown", (event) => { if (event.key === "Enter") searchContacts(); });

  loadCountriesFromBackend().then(searchContacts);
})();
