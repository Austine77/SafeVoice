export type ContactPreference = 'anonymous' | 'email' | 'sms' | 'call' | 'phone';

export interface DraftReportPayload {
  incidentType: string;
  location: string;
  incidentDetails: string;
  evidence: {
    photos: number;
    screenshots: number;
    audioNotes: number;
    photo?: string;
    screenshot?: string;
    audio?: string;
  };
  contact: {
    preference: ContactPreference;
    value: string;
  };
}

export interface CaseTimelineItem {
  label: string;
  note: string;
  createdAt: string;
}

export interface CaseRecord extends DraftReportPayload {
  _id: string;
  caseId: string;
  status: 'Submitted' | 'Assigned' | 'Reviewing' | 'Resolved';
  priority: 'Normal' | 'High';
  assignedOfficer: string;
  assignedTo?: string;
  timeline: CaseTimelineItem[];
  createdAt: string;
  updatedAt: string;
  locationType?: string;
  description?: string;
  contactPreference?: ContactPreference;
  email?: string;
  phone?: string;
  evidenceFiles?: {
    photo: string;
    screenshot: string;
    audio: string;
  };
}

export interface CasesResponse {
  metrics: {
    totalCases: number;
    totalOpenCases: number;
    highPriorityAlerts: number;
    activeSupportOfficers: number;
  };
  cases: CaseRecord[];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.');
  }

  return data as T;
}

export function createCase(payload: DraftReportPayload) {
  return request<CaseRecord>('/cases', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchCases() {
  return request<CasesResponse>('/cases');
}

export function fetchCaseById(caseId: string) {
  return request<CaseRecord>(`/cases/${encodeURIComponent(caseId)}`);
}

export function loginAdmin(username: string, password: string) {
  return request<{ role: 'admin'; message: string }>('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function loginWorker(username: string, password: string) {
  return request<{ role: 'worker'; message: string }>('/auth/worker/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function updateCaseStatus(caseId: string, payload: Partial<Pick<CaseRecord, 'status' | 'assignedOfficer'>> & { note?: string; assignedTo?: string }) {
  return request<CaseRecord>(`/cases/${encodeURIComponent(caseId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
