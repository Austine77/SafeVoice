import { useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { screens, ScreenId } from './data';
import EntryPage from './pages/EntryPage';
import HomePage from './pages/HomePage';
import { ReportStep1, ReportStep2, ReportStep3, ReportStep4, ReportStep5 } from './pages/ReportPages';
import { CaseCreated, TrackingPage } from './pages/CasePages';
import { ChatPage, EmergencyPage, ResourcesPage, SupportMapPage } from './pages/SupportPages';
import { CaseRecord } from './lib/api';
import usePersistentState from './hooks/usePersistentState';

export interface ReportDraft {
  incidentType: string;
  location: string;
  incidentDetails: string;
  evidence: {
    photos: number;
    screenshots: number;
    audioNotes: number;
  };
  contact: {
    preference: 'anonymous' | 'email' | 'sms' | 'call';
    value: string;
  };
}

const initialReportDraft: ReportDraft = {
  incidentType: 'Sexual harassment',
  location: 'School',
  incidentDetails: '',
  evidence: {
    photos: 0,
    screenshots: 0,
    audioNotes: 0,
  },
  contact: {
    preference: 'anonymous',
    value: '',
  },
};

export default function App() {
  const [activeScreen, setActiveScreen] = usePersistentState<ScreenId>('safevoice-active-screen', 'entry');
  const [reportDraft, setReportDraft] = usePersistentState<ReportDraft>('safevoice-report-draft', initialReportDraft);
  const [submittedCase, setSubmittedCase] = usePersistentState<CaseRecord | null>('safevoice-submitted-case', null);
  const [trackingCaseId, setTrackingCaseId] = usePersistentState('safevoice-tracking-case-id', '');

  const activeMeta = useMemo(() => screens.find((screen) => screen.id === activeScreen) ?? screens[0], [activeScreen]);

  const goTo = (screen: ScreenId) => setActiveScreen(screen);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ScreenId;
      if (screens.some((screen) => screen.id === hash)) {
        setActiveScreen(hash);
      }
    };

    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [setActiveScreen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.location.hash = activeScreen;
  }, [activeScreen]);

  const resetToEntry = () => {
    setActiveScreen('entry');
    setTrackingCaseId('');
  };

  const renderPage = () => {
    switch (activeScreen) {
      case 'entry':
        return <EntryPage goTo={goTo} />;
      case 'home':
        return <HomePage goTo={goTo} />;
      case 'report1':
        return <ReportStep1 goTo={goTo} reportDraft={reportDraft} setReportDraft={setReportDraft} />;
      case 'report2':
        return <ReportStep2 goTo={goTo} reportDraft={reportDraft} setReportDraft={setReportDraft} />;
      case 'report3':
        return <ReportStep3 goTo={goTo} reportDraft={reportDraft} setReportDraft={setReportDraft} />;
      case 'report4':
        return <ReportStep4 goTo={goTo} reportDraft={reportDraft} setReportDraft={setReportDraft} />;
      case 'report5':
        return (
          <ReportStep5
            goTo={goTo}
            reportDraft={reportDraft}
            setReportDraft={setReportDraft}
            onSubmittedCase={setSubmittedCase}
            onTrackCaseId={setTrackingCaseId}
          />
        );
      case 'case':
        return <CaseCreated goTo={goTo} submittedCase={submittedCase} />;
      case 'tracking':
        return <TrackingPage goTo={goTo} trackingCaseId={trackingCaseId} onTrackCaseId={setTrackingCaseId} submittedCase={submittedCase} />;
      case 'chat':
        return <ChatPage />;
      case 'emergency':
        return <EmergencyPage goTo={goTo} />;
      case 'support':
        return <SupportMapPage />;
      case 'resources':
        return <ResourcesPage />;
      default:
        return <HomePage goTo={goTo} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar activeScreen={activeScreen} onChange={goTo} />
      <main className="content">
        <Topbar title={activeMeta.title} description={activeMeta.description} onQuickExit={resetToEntry} />
        {renderPage()}
      </main>
    </div>
  );
}
