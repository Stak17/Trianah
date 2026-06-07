import {
  TrianahMessage,
  TaskItem,
  TimelineEvent,
  RelationshipContact,
  CareerOpportunity,
  VaultDoc,
  MeetingRecording,
  UgandaSmartService,
  BizMetric,
  SecurityLog,
  MarketplaceExtension,
  DigitalTwinSetting
} from './types';

export const initialMessages: TrianahMessage[] = [
  {
    id: 'm1',
    sender: 'Lillian Atoke (Makerere Alumni)',
    subject: 'RE: BioTech Collaborative Research Proposal',
    body: 'Greetings! I reviewed your notes on agricultural tech enhancements in Gulu. Can we sync up tomorrow regarding the funding application? Let me know if 10:00 AM Kampala time works.',
    timestamp: '2026-06-07T06:30:00Z',
    channel: 'email',
    category: 'urgent',
    read: false,
    replied: false
  },
  {
    id: 'm2',
    sender: '+256 772 104592',
    subject: 'MTN Mobile Money Notification',
    body: 'Y’ello! You have received UGX 450,000 from KCB Bank Uganda. Reference: TXID9082348. Your new balance is UGX 2,340,500. Dialogue responsibly.',
    timestamp: '2026-06-07T05:12:00Z',
    channel: 'sms',
    category: 'important',
    read: true,
    replied: false
  },
  {
    id: 'm3',
    sender: 'MTN-Promo-Ug',
    subject: 'Yello Winner Alert!',
    body: 'YELLO! You have won UGX 5,000,000 in our MoMo Nyabo promo. Click our portal http://yello-momo-ug-awards.net to enter your MoMo PIN and claim now.',
    timestamp: '2026-06-06T18:45:00Z',
    channel: 'sms',
    category: 'ignore', // Detected spam
    read: false,
    replied: false
  },
  {
    id: 'm4',
    sender: 'Dr. Arthur Ssewankambo',
    subject: 'NWSC Grid Upgrade Action Map Needed',
    body: 'The board at NWSC requested an updated customer impact metric for Kampala Central. Please compile the Excel forecast by tonight.',
    timestamp: '2026-06-06T14:30:00Z',
    channel: 'email',
    category: 'urgent',
    read: true,
    replied: true,
    draftReply: 'Dear Dr. Arthur, I have completed the customer impact matrix and appended it to the NWSC hub. Let me know if you need any adjustments.'
  },
  {
    id: 'm5',
    sender: 'SafeBoda Support',
    subject: 'Your SafeBoda Wallet Refund',
    body: 'Thank you for contacting SafeBoda. UGX 12,000 is refunded back to your wallet based on the faulty ride GPS routing in Nakasero.',
    timestamp: '2026-06-05T11:15:00Z',
    channel: 'collaboration',
    category: 'routine',
    read: true,
    replied: false
  }
];

export const initialTasks: TaskItem[] = [
  {
    id: 't1',
    title: 'Finalize BioTech Research Summary',
    description: 'Sync and categorize notes in the AI Knowledge Vault for Makerere proposal.',
    dueDate: '2026-06-08',
    status: 'in_progress',
    priority: 'high',
    moduleRef: 'research'
  },
  {
    id: 't2',
    title: 'NWSC Kampala central performance review',
    description: 'Analyze operational dashboard logs in Uganda Smart Services Layer.',
    dueDate: '2026-06-09',
    status: 'todo',
    priority: 'medium',
    moduleRef: 'nwsc'
  },
  {
    id: 't3',
    title: 'Audit Digital Twin communication style',
    description: 'Verify draft response patterns are set to appropriate Ugandan professional English.',
    dueDate: '2026-06-11',
    status: 'review',
    priority: 'low',
    moduleRef: 'twin'
  },
  {
    id: 't4',
    title: 'Approve Mobile Money MoMo Tax Remittal',
    description: 'Check automated alerts from Uganda Revenue Authority module.',
    dueDate: '2026-06-07',
    status: 'todo',
    priority: 'high',
    moduleRef: 'payment'
  }
];

export const initialTimeline: TimelineEvent[] = [
  {
    id: 'e1',
    title: 'Agricultural Research Collaboration Session',
    description: 'Met with Dr. Arthur Ssewankambo to organize the remote soil monitoring outline.',
    date: '2026-06-05',
    type: 'meeting',
    personRef: 'Dr. Arthur Ssewankambo'
  },
  {
    id: 'e2',
    title: 'MoMo Pay Gateway Connected',
    description: 'Successfully registered Trianah Secure Agent Core with MTN MoMo Open API Sandboxes and URA Tax portal.',
    date: '2026-06-04',
    type: 'achievement'
  },
  {
    id: 'e3',
    title: 'Agri-Sensor Technical Draft Uploaded',
    description: 'Saved technical notes on low-cost telemetry probes in Kampala suburbs into AI Knowledge Vault.',
    date: '2026-06-03',
    type: 'document'
  },
  {
    id: 'e4',
    title: 'Completed NWSC Consulting Deliverable',
    description: 'Approved Nakawa District Clean Water Network feasibility checklist.',
    date: '2026-06-02',
    type: 'achievement'
  }
];

export const initialContacts: RelationshipContact[] = [
  {
    id: 'c1',
    name: 'Dr. Arthur Ssewankambo',
    company: 'Makerere University / NWSC Board',
    email: 'assewankambo@mak.ac.ug',
    phone: '+256 701 556633',
    importance: 9,
    frequency: 'daily',
    lastInteracted: '2026-06-06',
    relationshipScore: 92,
    responsePattern: 'prompt',
    status: 'high_value'
  },
  {
    id: 'c2',
    name: 'Lillian Atoke',
    company: 'Gulu Organic Agro-Engineers',
    email: 'l.atoke@guluagro.org',
    phone: '+256 782 443322',
    importance: 8,
    frequency: 'weekly',
    lastInteracted: '2026-06-07',
    relationshipScore: 84,
    responsePattern: 'prompt',
    status: 'active'
  },
  {
    id: 'c3',
    name: 'Robert Kibuuka',
    company: 'SafeBoda Operations',
    email: 'kibuuka.robert@safeboda.com',
    phone: '+256 752 901122',
    importance: 7,
    frequency: 'monthly',
    lastInteracted: '2026-05-12',
    relationshipScore: 48,
    responsePattern: 'inactive',
    status: 'drifting'
  },
  {
    id: 'c4',
    name: 'Pamela Natukunda',
    company: 'Uganda Revenue Authority Liaison',
    email: 'pnatukunda@ura.go.ug',
    phone: '+256 772 887766',
    importance: 8,
    frequency: 'weekly',
    lastInteracted: '2026-05-28',
    relationshipScore: 71,
    responsePattern: 'delayed',
    status: 'reconnect'
  }
];

export const initialOpportunities: CareerOpportunity[] = [
  {
    id: 'o1',
    title: 'Agriscience Tech Lead Researcher',
    organization: 'Gulu Agro-Ecosystems Init',
    type: 'freelance',
    location: 'Gulu, Uganda (Flexible Remote)',
    relevance: 95,
    description: 'Design and manage soil hydration telemetry systems based on Raspberry-Pi nodes and MTN MoMo payment models.',
    deadline: '2026-06-25',
    matchReason: 'Aligns 100% with your research notes on Low-Cost Telemetry Probes and ongoing chats with Lillian Atoke.'
  },
  {
    id: 'o2',
    title: 'Senior Utility Optimization Advisor',
    organization: 'UN-Habitat / Kampala Capital City Authority',
    type: 'job',
    location: 'Kampala, Uganda',
    relevance: 88,
    description: 'Serve as secondary consultant mapping NWSC fresh water networks utilizing responsive analytical maps and smart notifications.',
    deadline: '2026-07-02',
    matchReason: 'Leverages your extensive consultancies with Dr. Arthur Ssewankambo and Nakawa district achievements.'
  },
  {
    id: 'o3',
    title: 'East Africa Sustainable Infrastructure Grant',
    organization: 'African Development Bank Group',
    type: 'grant',
    location: 'Nairobi / Kampala (Pan-African)',
    relevance: 82,
    description: 'Up to $45,000 funding for low-power communications protocols in municipal utility grids across Nile basin sectors.',
    deadline: '2026-06-15',
    matchReason: 'Matches research credentials in Kampala agricultural telemetry and NWSC KampalaCentral impact briefs.'
  }
];

export const initialVaultDocs: VaultDoc[] = [
  {
    id: 'v1',
    title: 'Low-Cost Telemetry Probes - Kampala Suburbs Study',
    content: 'Our tests in Nakawa and Bweyogerere indicate standard 433MHz transceivers struggle in heavy concrete brick density. Recommending switching prototype nodes to narrowband LoRa sub-GHz bands mapped directly to Solar-charged lithium-phosphate cores.',
    category: 'Technical Specifications',
    tags: ['IoT', 'Research', 'Nakawa', 'Hardware'],
    dateCreated: '2026-06-03'
  },
  {
    id: 'v2',
    title: 'MoMo API Sandbox Integration Guidelines',
    content: 'Using the collection/deposit standard interfaces over HTTPS. Production credentials require Uganda-based corporate registration verified by NIRA and certified URA TAX compliance forms.',
    category: 'API Handbooks',
    tags: ['MTN', 'Mobile Money', 'Fintech', 'MoMopay'],
    dateCreated: '2026-05-28'
  },
  {
    id: 'v3',
    title: 'NWSC Grid Smart Audit Results',
    content: 'Average non-revenue water (leaks & bypasses) in Nakasero Zone A stands at 28.5%. Recommended automated flow-rate telemetry comparisons on secondary control junctions to localize pipe pressure variances.',
    category: 'Consulting Reports',
    tags: ['NWSC', 'Water Utility', 'Kampala Central', 'Data Analytics'],
    dateCreated: '2026-05-18'
  }
];

export const initialMeetings: MeetingRecording[] = [
  {
    id: 'meet1',
    title: 'Makerere Agri-Hub Weekly Synchronization',
    dateTime: '2026-06-05T09:00:00Z',
    transcriptSample: `Lillian Atoke: The soil monitoring project needs high reliability. Let’s target an initial deployment of 15 sensors.
Dr. Arthur Ssewankambo: Yes, I can endorse the research application if we align with URA tax regulations.
User: Fantastic. I will finalize the technical proposal writeup, categorize telemetry tags, and check MTN open API sandboxes by Monday morning.`,
    summary: 'Synchronized sensor allocation and grant coordination rules. Focus is on submitting Gulu soil proposal.',
    actionItems: [
      'Finalize BioTech Research Summary and save to AI Knowledge Vault.',
      'Test MTN MoMo sandbox collection webhooks.',
      'Check URA Tax clearance checklist.'
    ],
    deadlines: [
      'Research draft completion: 2026-06-08',
      'Grant application deadline: 2026-06-15'
    ]
  }
];

export const initialUgandaServices: UgandaSmartService[] = [
  {
    id: 'us1',
    serviceName: 'Mobile Money',
    provider: 'MTN',
    accountNo: '0772104592',
    balanceOrStatus: 'UGX 2,340,500',
    lastBilledAmount: 450000,
    dueDate: 'N/A',
    alerts: ['Received UGX 450,000 from KCB Bank Uganda. TXID9082348.']
  },
  {
    id: 'us2',
    serviceName: 'UMEME Electricity',
    provider: 'UMEME',
    accountNo: '304958112-01',
    balanceOrStatus: 'Yaka Token: 12.4 kWh Left',
    lastBilledAmount: 85000, // UGX
    dueDate: '2026-06-12',
    alerts: ['Low balance! Consider topping up soon. Current rate: UGX 812.5/kWh']
  },
  {
    id: 'us3',
    serviceName: 'NWSC Water',
    provider: 'NWSC',
    accountNo: '0491823-38291',
    balanceOrStatus: 'Active - Bill Settled',
    lastBilledAmount: 43000, // UGX
    dueDate: '2026-06-20',
    alerts: ['Next meter reading scheduled for Nakasero Central on 2026-06-14.']
  },
  {
    id: 'us4',
    serviceName: 'URA Taxes',
    provider: 'URA',
    accountNo: 'TIN-893048591',
    balanceOrStatus: 'E-Tax Portal Active',
    lastBilledAmount: 180000,
    dueDate: '2026-06-15',
    alerts: ['Withholding Tax declaration for May consultancies is due in 8 days.']
  }
];

export const businessMetrics: BizMetric[] = [
  {
    title: 'Consulting Monthly Revenue',
    value: 'UGX 7,850,000',
    trend: 'up',
    change: '+14% from May',
    color: 'emerald'
  },
  {
    title: 'Operational Expenses',
    value: 'UGX 2,120,000',
    trend: 'down',
    change: '-5% from May',
    color: 'blue'
  },
  {
    title: 'Active Tech Projects',
    value: 3,
    trend: 'stable',
    change: 'Continuous monitoring',
    color: 'indigo'
  },
  {
    title: 'Client Net Satisfaction Score',
    value: '94%',
    trend: 'up',
    change: '+2% post-audit',
    color: 'purple'
  }
];

export const initialSecurityLogs: SecurityLog[] = [
  {
    id: 's1',
    timestamp: '2026-06-07T07:15:00Z',
    event: 'Dashboard Session Created',
    device: 'MacBook Pro @ Kampala Central',
    location: '197.239.4.52 (Kampala Broadband)',
    status: 'success'
  },
  {
    id: 's2',
    timestamp: '2026-06-06T22:11:00Z',
    event: 'Automated Login Check',
    device: 'Google Pixel 8 @ Gulu Central',
    location: '197.239.12.10 (Airtel Uganda)',
    status: 'success'
  },
  {
    id: 's3',
    timestamp: '2026-06-05T14:40:00Z',
    event: 'Suspicious REST Authentication',
    device: 'Unknown HTTP Client @ Moscow',
    location: '91.240.118.42',
    status: 'blocked'
  }
];

export const initialMarketplace: MarketplaceExtension[] = [
  {
    id: 'ext1',
    name: 'Ugandan Tele-Clinic Connector',
    description: 'Integrates patient follow-up communication queues and MoMo payments for clinical agents in Nakasero.',
    developer: 'HealEast Ltd',
    category: 'Healthcare',
    installed: false
  },
  {
    id: 'ext2',
    name: 'Makerere Student Register Integrator',
    description: 'Automatically imports syllabus, course lists, assignment due dates, and grading rubrics from Mak-Portal.',
    developer: 'Makerere Dept of Computing',
    category: 'Education',
    installed: true
  },
  {
    id: 'ext3',
    name: 'MoMo-Changer Ledger Protocol',
    description: 'Bridges multi-currency accounts across East African Community (EAC); auto-declares local taxes directly to URA.',
    developer: 'Kampala Fintech Labs',
    category: 'Banking',
    installed: false
  },
  {
    id: 'ext4',
    name: 'Nile Irrigation IoT Automation Suite',
    description: 'Triggers irrigation smart gates using soil moisture readings & local telemetry logs directly inside Trianah.',
    developer: 'EAC Agricultural tech Alliance',
    category: 'Agriculture',
    installed: true
  }
];

export const initialTwinSettings: DigitalTwinSetting = {
  writingTone: 'ugandan_formal',
  workHoursStart: '08:00',
  workHoursEnd: '17:30',
  autoDraft: true,
  approvalRequired: true
};
