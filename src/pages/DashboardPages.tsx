import { useEffect, useMemo, useState } from 'react';
import { fetchCases, loginAdmin, loginWorker, CasesResponse, CaseRecord, updateCaseStatus } from '../lib/api';
import usePersistentState from '../hooks/usePersistentState';

function usePortalCases(isLoggedIn: boolean) {
  const [data, setData] = useState<CasesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCases = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await fetchCases();
      setData(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load cases.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    loadCases();
    const timer = window.setInterval(loadCases, 5000);
    const handleCaseCreated = () => loadCases();
    window.addEventListener('safevoice:case-created', handleCaseCreated as EventListener);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('safevoice:case-created', handleCaseCreated as EventListener);
    };
  }, [isLoggedIn]);

  return { data, setData, isLoading, error, loadCases };
}

function CaseList({ cases, onSelect, selectedCaseId }: { cases: CaseRecord[]; onSelect: (caseItem: CaseRecord) => void; selectedCaseId?: string }) {
  if (!cases.length) return <p>No submitted cases yet.</p>;

  return (
    <div className="support-grid single-column form-gap">
      {cases.map((caseItem) => (
        <button
          key={caseItem._id}
          type="button"
          className={`support-card option-button text-left ${selectedCaseId === caseItem.caseId ? 'selected' : ''}`}
          onClick={() => onSelect(caseItem)}
        >
          <strong>{caseItem.caseId} · {caseItem.incidentType}</strong>
          <p>{caseItem.location || caseItem.locationType || 'Not shared'} · {caseItem.status} · {caseItem.priority} priority</p>
        </button>
      ))}
    </div>
  );
}

export function WorkerDashboardPage() {
  const [username, setUsername] = useState('socialworker');
  const [password, setPassword] = useState('SafeVoice2026');
  const [isLoggedIn, setIsLoggedIn] = usePersistentState<boolean>('safevoice-worker-auth', false);
  const [authError, setAuthError] = useState('');
  const { data, setData, isLoading, error, loadCases } = usePortalCases(isLoggedIn);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const workerCases = useMemo(() => {
    const allCases = data?.cases || [];
    return allCases.filter((item) => (item.assignedOfficer || item.assignedTo || 'socialworker').toLowerCase() === 'socialworker');
  }, [data]);

  const featuredCase = useMemo(() => {
    if (!workerCases.length) return null;
    return workerCases.find((item) => item.caseId === selectedCaseId) || workerCases[0];
  }, [workerCases, selectedCaseId]);

  useEffect(() => {
    if (featuredCase && !selectedCaseId) {
      setSelectedCaseId(featuredCase.caseId);
    }
  }, [featuredCase, selectedCaseId]);

  const handleLogin = async () => {
    setAuthError('');
    try {
      await loginWorker(username, password);
      setIsLoggedIn(true);
    } catch (loginError) {
      setAuthError(loginError instanceof Error ? loginError.message : 'Unable to log in.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUpdateMessage('');
  };

  const handleStatusUpdate = async (status: 'Reviewing' | 'Resolved') => {
    if (!featuredCase) return;
    setIsUpdating(true);
    setUpdateMessage('');
    try {
      const updated = await updateCaseStatus(featuredCase.caseId, {
        status,
        assignedOfficer: 'socialworker',
        assignedTo: 'socialworker',
        note: status === 'Resolved' ? 'Case resolved by social worker.' : 'Case moved into active social worker review.',
      });
      setData((prev) => prev ? ({ ...prev, cases: prev.cases.map((item) => item.caseId === updated.caseId ? updated : item) }) : prev);
      setUpdateMessage(`Case ${updated.caseId} updated to ${updated.status}.`);
    } catch (updateError) {
      setUpdateMessage(updateError instanceof Error ? updateError.message : 'Unable to update case.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <section className="card">
        <h3>Social Worker Dashboard Login</h3>
        <p>Use your social worker username and password to open submitted child abuse case reports.</p>
        <div className="form-gap"><input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" /></div>
        <div className="form-gap"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /></div>
        {authError ? <p className="error-text">{authError}</p> : null}
        <div className="button-row"><button className="btn btn-primary" onClick={handleLogin}>Open dashboard</button></div>
      </section>
    );
  }

  return (
    <div className="grid grid-2">
      <section className="card">
        <h3>Social Worker Dashboard</h3>
        <p>Submitted cases now load from MongoDB through the SafeVoice backend.</p>
        <div className="button-row">
          <button className="btn btn-primary" onClick={loadCases}>{isLoading ? 'Refreshing...' : 'Refresh cases'}</button>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        <CaseList cases={workerCases} onSelect={(item) => setSelectedCaseId(item.caseId)} selectedCaseId={selectedCaseId} />
      </section>
      <section className="card">
        <h3>Case details</h3>
        {featuredCase ? (
          <>
            <p>Case ID: <strong>{featuredCase.caseId}</strong></p>
            <table>
              <thead><tr><th>Field</th><th>Value</th></tr></thead>
              <tbody>
                <tr><td>Incident type</td><td>{featuredCase.incidentType}</td></tr>
                <tr><td>Location</td><td>{featuredCase.location || featuredCase.locationType || 'Not shared'}</td></tr>
                <tr><td>Current status</td><td><span className="badge assigned">{featuredCase.status}</span></td></tr>
                <tr><td>Priority</td><td>{featuredCase.priority}</td></tr>
                <tr><td>Contact</td><td>{featuredCase.contact?.preference === 'anonymous' ? 'Anonymous' : featuredCase.contact?.value || featuredCase.contactPreference || 'Anonymous'}</td></tr>
                <tr><td>Evidence</td><td>{featuredCase.evidence.photos} photo(s), {featuredCase.evidence.screenshots} screenshot(s), {featuredCase.evidence.audioNotes} audio note(s)</td></tr>
                <tr><td>Description</td><td>{featuredCase.incidentDetails || featuredCase.description || 'No additional narrative submitted.'}</td></tr>
              </tbody>
            </table>
            <div className="button-row">
              <button className="btn btn-teal" onClick={() => handleStatusUpdate('Reviewing')} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Mark Reviewing'}</button>
              <button className="btn btn-primary" onClick={() => handleStatusUpdate('Resolved')} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Mark Resolved'}</button>
            </div>
            {updateMessage ? <p className="info-text">{updateMessage}</p> : null}
          </>
        ) : <p>No submitted cases yet.</p>}
      </section>
    </div>
  );
}

export function AdminPanelPage() {
  const [username, setUsername] = useState('OyoTectHub');
  const [password, setPassword] = useState('AbuseProject2026');
  const [isLoggedIn, setIsLoggedIn] = usePersistentState<boolean>('safevoice-admin-auth', false);
  const [authError, setAuthError] = useState('');
  const { data, isLoading, error, loadCases } = usePortalCases(isLoggedIn);

  const metrics = data?.metrics;

  const handleLogin = async () => {
    setAuthError('');
    try {
      await loginAdmin(username, password);
      setIsLoggedIn(true);
    } catch (loginError) {
      setAuthError(loginError instanceof Error ? loginError.message : 'Unable to log in.');
    }
  };

  const handleLogout = () => setIsLoggedIn(false);

  if (!isLoggedIn) {
    return (
      <section className="card">
        <h3>Admin Login</h3>
        <p>Use the admin account to view all submitted child abuse cases and summary metrics.</p>
        <div className="form-gap"><input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Admin username" /></div>
        <div className="form-gap"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" /></div>
        {authError ? <p className="error-text">{authError}</p> : null}
        <div className="button-row"><button className="btn btn-primary" onClick={handleLogin}>Open admin panel</button></div>
      </section>
    );
  }

  return (
    <section className="card">
      <h3>Admin Oversight Panel</h3>
      <p>Administrative overview for submitted cases, open alerts, staff coverage, and monitoring.</p>
      <div className="button-row">
        <button className="btn btn-primary" onClick={loadCases}>{isLoading ? 'Refreshing...' : 'Refresh overview'}</button>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <div className="analytics-grid form-gap">
        <div className="analytic"><strong>{metrics?.totalOpenCases ?? 0}</strong><p>Total open cases</p></div>
        <div className="analytic"><strong>{metrics?.highPriorityAlerts ?? 0}</strong><p>High-priority alerts</p></div>
        <div className="analytic"><strong>{metrics?.activeSupportOfficers ?? 0}</strong><p>Active support officers</p></div>
        <div className="analytic"><strong>{metrics?.totalCases ?? 0}</strong><p>Total submitted cases</p></div>
      </div>
      <table>
        <thead><tr><th>Case ID</th><th>Incident</th><th>Location</th><th>Status</th><th>Assigned To</th></tr></thead>
        <tbody>
          {data?.cases?.length ? data.cases.map((caseItem) => (
            <tr key={caseItem._id}><td>{caseItem.caseId}</td><td>{caseItem.incidentType}</td><td>{caseItem.location || caseItem.locationType || 'Not shared'}</td><td>{caseItem.status}</td><td>{caseItem.assignedOfficer || caseItem.assignedTo || 'socialworker'}</td></tr>
          )) : <tr><td colSpan={5}>No submitted cases yet.</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
