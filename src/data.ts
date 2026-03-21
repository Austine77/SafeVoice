export type ScreenId =
  | 'entry'
  | 'home'
  | 'report1'
  | 'report2'
  | 'report3'
  | 'report4'
  | 'report5'
  | 'case'
  | 'tracking'
  | 'chat'
  | 'emergency'
  | 'support'
  | 'resources';

export interface ScreenMeta {
  id: ScreenId;
  label: string;
  title: string;
  description: string;
}

export const screens: ScreenMeta[] = [
  { id: 'entry', label: 'Safety Entry', title: 'Safety Entry', description: 'Disguised calculator-style launch for discreet access.' },
  { id: 'home', label: 'Welcome Home', title: 'Welcome Home', description: 'Calm, supportive entry point for survivors.' },
  { id: 'report1', label: 'Report Step 1', title: 'Report Step 1', description: 'Incident type selection with simple, fast choices.' },
  { id: 'report2', label: 'Report Step 2', title: 'Report Step 2', description: 'Safe location capture with a visible skip path.' },
  { id: 'report3', label: 'Report Step 3', title: 'Report Step 3', description: 'Supportive incident description field.' },
  { id: 'report4', label: 'Report Step 4', title: 'Report Step 4', description: 'Optional encrypted evidence upload concept.' },
  { id: 'report5', label: 'Report Step 5', title: 'Report Step 5', description: 'Anonymous-by-default contact preferences.' },
  { id: 'case', label: 'Case Created', title: 'Case Created', description: 'Confirmation, reassurance, and case ID handoff.' },
  { id: 'tracking', label: 'Track Case', title: 'Track Case', description: 'Status visibility and timeline updates.' },
  { id: 'chat', label: 'Secure Chat', title: 'Secure Chat', description: 'Anonymous support messaging with a social worker.' },
  { id: 'emergency', label: 'Emergency Help', title: 'Emergency Help', description: 'Urgent help actions in a controlled interface.' },
  { id: 'support', label: 'Support Map', title: 'Support Map', description: 'Nearby support services with filterable categories.' },
  { id: 'resources', label: 'Resource Library', title: 'Resource Library', description: 'Simple rights and safety education content.' },
];
