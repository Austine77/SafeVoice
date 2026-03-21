import crypto from 'crypto';
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  preference: {
    type: String,
    enum: ['anonymous', 'email', 'sms', 'call'],
    default: 'anonymous',
  },
  value: {
    type: String,
    trim: true,
    default: '',
  },
}, { _id: false });

const caseReportSchema = new mongoose.Schema({
  caseId: {
    type: String,
    unique: true,
    index: true,
  },
  incidentType: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    default: 'Not shared',
  },
  incidentDetails: {
    type: String,
    trim: true,
    default: '',
  },
  evidence: {
    photos: { type: Number, default: 0 },
    screenshots: { type: Number, default: 0 },
    audioNotes: { type: Number, default: 0 },
  },
  evidenceFiles: {
    photo: { type: String, trim: true, default: '' },
    screenshot: { type: String, trim: true, default: '' },
    audio: { type: String, trim: true, default: '' },
  },
  contact: {
    type: contactSchema,
    default: () => ({ preference: 'anonymous', value: '' }),
  },
  status: {
    type: String,
    enum: ['Submitted', 'Assigned', 'Reviewing', 'Resolved'],
    default: 'Submitted',
  },
  priority: {
    type: String,
    enum: ['Normal', 'High'],
    default: 'Normal',
  },
  assignedOfficer: {
    type: String,
    trim: true,
    default: 'socialworker',
  },
  timeline: {
    type: [
      new mongoose.Schema({
        label: { type: String, required: true },
        note: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }, { _id: false }),
    ],
    default: [],
  },
}, { timestamps: true });

caseReportSchema.pre('validate', function setCaseId(next) {
  if (!this.caseId) {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.caseId = `SV-${y}${m}${d}-${random}`;
  }

  if (!this.timeline?.length) {
    this.timeline = [
      {
        label: 'Created',
        note: 'Report submitted safely and queued for review.',
        createdAt: new Date(),
      },
    ];
  }

  next();
});

export default mongoose.model('CaseReport', caseReportSchema);
