export type ClinicalTab = 
  | 'dashboard'
  | 'patients'
  | 'handoffs'
  | 'pending-actions'
  | 'timeline'
  | 'settings'
  | 'help'
  | 'codex-zip';

export type AcuityLevel = 'STABLE' | 'MEDIUM' | 'HIGH';
export type IllnessSeverity = 'stable' | 'watcher' | 'unstable';

export type HandoffStatus = 
  | 'Pending Acknowledgment' 
  | 'Ready for Review' 
  | 'Sign-out Draft' 
  | 'Draft in Progress'
  | 'Completed' 
  | 'Update Required'
  | 'Needs Sign-out';

export interface Vitals {
  bp: string;
  map: number;
  hr: number;
  hrRhythm?: string;
  spo2: number;
  o2Delivery: string;
  respRate: number;
  respQuality?: string;
  temp: number;
  tempRoute?: string;
  uop?: number;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  bed: string;
  service: string;
  team: string;
  primaryDiagnosis: string;
  comorbidities: string;
  news2Score: number;
  clinicalStatusText: string;
  clinicalStatusSubtitle: string;
  acuity: AcuityLevel;
  codeStatus: 'FULL CODE' | 'DNR / DNI' | 'DNR / OK Intubate';
  isolation?: 'Contact Iso (MRSA)' | 'C. diff Enteric Iso' | 'None';
  allergies?: string;
  admitDate?: string;
  hospitalDay?: number;
  attending: string;
  primaryRN: string;
  pendingActionsSummary: string;
  urgentActionHighlight?: string;
  lastHandoffTime: string;
  lastHandoffBy: string;
  handoffStatus: HandoffStatus;
  vitals: Vitals;
  netFluidBalance?: number;
  cumulativeWeight?: number;
  avatarInitials: string;
  photoUrl?: string;
}

export interface IPassHandoff {
  patientId: string;
  illnessSeverity: IllnessSeverity;
  patientSummary: string;
  vitals: Vitals;
  systemsAssessment: {
    system: string;
    statusBadge: string;
    details: string;
    metric?: string;
  }[];
  recentShiftEvents: {
    time: string;
    description: string;
    category?: string;
  }[];
  actionList: {
    id: string;
    title: string;
    priorityLabel: string;
    priorityColor: 'error' | 'amber' | 'neutral';
    completed: boolean;
    dueDate?: string;
    notes?: string;
  }[];
  contingencies: {
    condition: string;
    action: string;
    isHighRisk?: boolean;
  }[];
  nightFloatNotes: string;
  completenessScore: number;
  offGoingClinician: {
    name: string;
    role: string;
    photoUrl?: string;
  };
  receivingClinician: {
    name: string;
    role: string;
  };
  signedOutAt?: string;
  acknowledgedAt?: string;
  isAcknowledged: boolean;
}

export interface ClinicalActionItem {
  id: string;
  orderId: string;
  title: string;
  category: 'labs' | 'meds' | 'consults' | 'procedures';
  priority: 'urgent' | 'high' | 'routine';
  patientId: string;
  patientName: string;
  patientDemographics: string;
  bed: string;
  diagnosisShort: string;
  dueTimeText: string;
  dueTimestamp: string;
  isOverdue: boolean;
  overdueDuration?: string;
  assignedClinician: string;
  assignedDepartment: string;
  contingencyNote: string;
  completed: boolean;
}
