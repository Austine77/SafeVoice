import CaseReport from '../models/CaseReport.js';
import { generateCaseId, isFileDbEnabled, readDb, writeDb } from '../lib/fileDb.js';

function toCount(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function normalizeContact(payload = {}) {
  const preference = payload.contactPreference || payload.contact?.preference || 'anonymous';
  const directValue = payload.contact?.value || '';
  const email = payload.email || '';
  const phone = payload.phone || '';

  if (preference === 'email') {
    return { preference, value: email || directValue };
  }
  if (preference === 'phone' || preference === 'call' || preference === 'sms') {
    return { preference: preference === 'phone' ? 'call' : preference, value: phone || directValue };
  }
  return { preference: 'anonymous', value: '' };
}

function serializeCase(caseItem) {
  const item = caseItem.toObject ? caseItem.toObject() : caseItem;
  const contactPreference = item.contact?.preference || 'anonymous';
  const contactValue = item.contact?.value || '';
  const email = contactPreference === 'email' ? contactValue : '';
  const phone = ['sms', 'call', 'phone'].includes(contactPreference) ? contactValue : '';

  return {
    ...item,
    locationType: item.location || 'Not shared',
    description: item.incidentDetails || '',
    contactPreference,
    email,
    phone,
    assignedTo: item.assignedOfficer || 'socialworker',
    evidenceFiles: item.evidenceFiles || { photo: '', screenshot: '', audio: '' },
  };
}

function buildMetrics(cases) {
  const totalOpenCases = cases.filter((item) => item.status !== 'Resolved').length;
  const highPriorityAlerts = cases.filter((item) => item.priority === 'High' && item.status !== 'Resolved').length;
  return {
    totalCases: cases.length,
    totalOpenCases,
    highPriorityAlerts,
    activeSupportOfficers: Math.max(1, new Set(cases.map((item) => item.assignedOfficer).filter(Boolean)).size),
  };
}

export async function createCase(req, res) {
  try {
    const {
      incidentType,
      location,
      locationType,
      incidentDetails,
      description,
      evidence,
      evidenceFiles,
      contact,
      contactPreference,
      email,
      phone,
      assignedOfficer,
      assignedTo,
      priority,
    } = req.body;

    if (!incidentType) {
      return res.status(400).json({ message: 'Incident type is required.' });
    }

    const normalizedLocation = location || locationType || 'Not shared';
    const normalizedDescription = incidentDetails || description || '';
    const normalizedContact = normalizeContact({ contact, contactPreference, email, phone });
    const normalizedAssignedOfficer = String(assignedOfficer || assignedTo || 'socialworker').trim() || 'socialworker';
    const normalizedEvidenceFiles = {
      photo: evidenceFiles?.photo || evidence?.photo || '',
      screenshot: evidenceFiles?.screenshot || evidence?.screenshot || '',
      audio: evidenceFiles?.audio || evidence?.audio || '',
    };

    if (isFileDbEnabled()) {
      const db = await readDb();
      const now = new Date().toISOString();
      let caseId = generateCaseId();
      while (db.cases.some((item) => item.caseId === caseId)) caseId = generateCaseId();
      const caseReport = {
        caseId,
        incidentType,
        location: normalizedLocation,
        incidentDetails: normalizedDescription,
        evidence: {
          photos: toCount(evidence?.photos) || (normalizedEvidenceFiles.photo ? 1 : 0),
          screenshots: toCount(evidence?.screenshots) || (normalizedEvidenceFiles.screenshot ? 1 : 0),
          audioNotes: toCount(evidence?.audioNotes) || (normalizedEvidenceFiles.audio ? 1 : 0),
        },
        evidenceFiles: normalizedEvidenceFiles,
        contact: normalizedContact,
        priority: priority || (String(normalizedLocation).toLowerCase().includes('school') ? 'High' : 'Normal'),
        assignedOfficer: normalizedAssignedOfficer,
        status: 'Submitted',
        timeline: [
          { label: 'Created', note: 'Report submitted safely and queued for review.', createdAt: now },
          { label: 'Assigned', note: `Case assigned to ${normalizedAssignedOfficer} for safe follow-up.`, createdAt: now },
        ],
        createdAt: now,
        updatedAt: now,
      };
      db.cases.unshift(caseReport);
      await writeDb(db);
      return res.status(201).json(serializeCase(caseReport));
    }

    const caseReport = await CaseReport.create({
      incidentType,
      location: normalizedLocation,
      incidentDetails: normalizedDescription,
      evidence: {
        photos: toCount(evidence?.photos) || (normalizedEvidenceFiles.photo ? 1 : 0),
        screenshots: toCount(evidence?.screenshots) || (normalizedEvidenceFiles.screenshot ? 1 : 0),
        audioNotes: toCount(evidence?.audioNotes) || (normalizedEvidenceFiles.audio ? 1 : 0),
      },
      evidenceFiles: normalizedEvidenceFiles,
      contact: normalizedContact,
      priority: priority || (String(normalizedLocation).toLowerCase().includes('school') ? 'High' : 'Normal'),
      assignedOfficer: normalizedAssignedOfficer,
      timeline: [
        {
          label: 'Created',
          note: 'Report submitted safely and queued for review.',
          createdAt: new Date(),
        },
        {
          label: 'Assigned',
          note: `Case assigned to ${normalizedAssignedOfficer} for safe follow-up.`,
          createdAt: new Date(),
        },
      ],
    });

    return res.status(201).json(serializeCase(caseReport));
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Generated case ID already exists. Please retry.' });
    }

    return res.status(500).json({ message: 'Unable to create case report.', error: error.message });
  }
}

export async function getCases(req, res) {
  try {
    if (isFileDbEnabled()) {
      const db = await readDb();
      const cases = db.cases.map(serializeCase);
      return res.json({ metrics: buildMetrics(cases), cases });
    }
    const caseItems = await CaseReport.find().sort({ createdAt: -1 }).lean();
    const cases = caseItems.map(serializeCase);
    return res.json({ metrics: buildMetrics(cases), cases });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch cases.', error: error.message });
  }
}

export async function getCaseByCaseId(req, res) {
  try {
    if (isFileDbEnabled()) {
      const db = await readDb();
      const caseReport = db.cases.find((item) => item.caseId === req.params.caseId);
      if (!caseReport) return res.status(404).json({ message: 'Case not found.' });
      return res.json(serializeCase(caseReport));
    }
    const caseReport = await CaseReport.findOne({ caseId: req.params.caseId }).lean();
    if (!caseReport) {
      return res.status(404).json({ message: 'Case not found.' });
    }
    return res.json(serializeCase(caseReport));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch case.', error: error.message });
  }
}

export async function updateCaseStatus(req, res) {
  try {
    const { status, assignedOfficer, assignedTo, note } = req.body;

    if (isFileDbEnabled()) {
      const db = await readDb();
      const idx = db.cases.findIndex((item) => item.caseId === req.params.caseId);
      if (idx === -1) return res.status(404).json({ message: 'Case not found.' });
      const caseReport = db.cases[idx];
      if (status) caseReport.status = status;
      if (assignedOfficer || assignedTo) caseReport.assignedOfficer = assignedOfficer || assignedTo;
      if (note) {
        caseReport.timeline.push({ label: status || 'Updated', note, createdAt: new Date().toISOString() });
      }
      caseReport.updatedAt = new Date().toISOString();
      db.cases[idx] = caseReport;
      await writeDb(db);
      return res.json(serializeCase(caseReport));
    }

    const caseReport = await CaseReport.findOne({ caseId: req.params.caseId });
    if (!caseReport) {
      return res.status(404).json({ message: 'Case not found.' });
    }

    if (status) caseReport.status = status;
    if (assignedOfficer || assignedTo) caseReport.assignedOfficer = assignedOfficer || assignedTo;
    if (note) {
      caseReport.timeline.push({ label: status || 'Updated', note, createdAt: new Date() });
    }

    await caseReport.save();
    return res.json(serializeCase(caseReport));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update case.', error: error.message });
  }
}
