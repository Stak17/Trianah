export interface TrianahMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  timestamp: string;
  channel: 'email' | 'sms' | 'voice' | 'social' | 'collaboration';
  category: 'urgent' | 'important' | 'routine' | 'ignore';
  read: boolean;
  replied: boolean;
  draftReply?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  moduleRef?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'message' | 'meeting' | 'document' | 'note' | 'task' | 'achievement';
  personRef?: string;
}

export interface RelationshipContact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  importance: number; // 1-10
  frequency: string; // e.g., 'weekly', 'monthly'
  lastInteracted: string;
  relationshipScore: number; // 1-100
  responsePattern: 'prompt' | 'delayed' | 'inactive';
  status: 'active' | 'drifting' | 'high_value' | 'reconnect';
}

export interface CareerOpportunity {
  id: string;
  title: string;
  organization: string;
  type: 'job' | 'freelance' | 'scholarship' | 'grant' | 'internship';
  location: string;
  relevance: number; // percentage
  description: string;
  deadline: string;
  matchReason: string;
}

export interface VaultDoc {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  dateCreated: string;
}

export interface ScamScanRequest {
  text: string;
  senderName?: string;
  attachmentName?: string;
  channel?: string;
}

export interface ScamScanResult {
  riskScore: number; // 0-100
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  threatType: string;
  indicators: string[];
  analysis: string;
}

export interface MeetingRecording {
  id: string;
  title: string;
  dateTime: string;
  transcriptSample: string;
  summary?: string;
  actionItems?: string[];
  deadlines?: string[];
}

export interface UgandaSmartService {
  id: string;
  serviceName: 'Mobile Money' | 'UMEME Electricity' | 'NWSC Water' | 'SafeBoda Transport' | 'URA Taxes';
  provider: 'MTN' | 'Airtel' | 'UMEME' | 'NWSC' | 'SafeBoda' | 'URA';
  accountNo: string;
  balanceOrStatus: string;
  lastBilledAmount: number; // UGX
  dueDate: string;
  alerts: string[];
}

export interface BizMetric {
  title: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  color: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  device: string;
  location: string;
  status: 'success' | 'blocked' | 'warning';
}

export interface MarketplaceExtension {
  id: string;
  name: string;
  description: string;
  developer: string;
  category: 'Healthcare' | 'Education' | 'Banking' | 'Agriculture' | 'Logistics';
  installed: boolean;
}

export interface DigitalTwinSetting {
  writingTone: 'direct' | 'thoughtful' | 'ugandan_formal' | 'casual';
  workHoursStart: string;
  workHoursEnd: string;
  autoDraft: boolean;
  approvalRequired: boolean;
}
