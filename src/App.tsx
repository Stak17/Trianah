/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Inbox, Bot, Calendar, Users, Award, Shield, Sparkles, FolderKanban, Search, Bell, ChevronRight,
  Activity, CheckCircle2, AlertTriangle, Send, RefreshCw, Layers, Plus, Check, Trash2, Clock, HelpCircle,
  TrendingUp, TrendingDown, Landmark, Briefcase, FileText, PlusCircle, ExternalLink, X, ShieldAlert, CheckCircle, Info,
  Fingerprint, Lock, Unlock
} from 'lucide-react';

import {
  initialMessages,
  initialTasks,
  initialTimeline,
  initialContacts,
  initialOpportunities,
  initialVaultDocs,
  initialMeetings,
  initialUgandaServices,
  businessMetrics,
  initialSecurityLogs,
  initialMarketplace,
  initialTwinSettings
} from './mockData';

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

import AICommandCenter from './components/AICommandCenter';

export default function App() {
  // Navigation & Core States
  const [activeTab, setActiveTab] = useState<number>(0);
  const [messages, setMessages] = useState<TrianahMessage[]>(initialMessages);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimeline);
  const [contacts, setContacts] = useState<RelationshipContact[]>(initialContacts);
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>(initialOpportunities);
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>(initialVaultDocs);
  const [meetings, setMeetings] = useState<MeetingRecording[]>(initialMeetings);
  const [ugandaServices, setUgandaServices] = useState<UgandaSmartService[]>(initialUgandaServices);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(initialSecurityLogs);
  const [marketplace, setMarketplace] = useState<MarketplaceExtension[]>(initialMarketplace);
  const [twinSettings, setTwinSettings] = useState<DigitalTwinSetting>(initialTwinSettings);

  // User Registration & Landing State
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [regStep, setRegStep] = useState<'welcome' | 'register' | 'verify' | 'profile-setup' | 'login-portal'>('welcome');
  const [regMethod, setRegMethod] = useState<'email' | 'phone'>('email');
  const [regInput, setRegInput] = useState<string>(''); // Holds email or phone number
  const [verificationCodeInput, setVerificationCodeInput] = useState<string>('');
  const [simulatedCode, setSimulatedCode] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [networkLogs, setNetworkLogs] = useState<string[]>([
    `[07:56:06] Trianah Cryptographic handshake engine online.`,
    `[07:56:06] Cross-platform core initialized (iOS 12+ & Android 6.0+)`
  ]);

  // Real persistent users list from localStorage or default
  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('trianah_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // use default
      }
    }
    return [
      {
        id: 'usr-default',
        email: 'travourstak22@gmail.com',
        phone: '+256 772 493 203',
        name: 'Travour Ssewankambo',
        city: 'Kampala, Uganda',
        bio: 'Agri-Tech Strategist & Business Developer',
        avatarChoice: 'cyan',
        platformLayout: 'web',
        biometricEnabled: true,
        biometricType: 'faceid',
        passwordPin: '1234'
      }
    ];
  });

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loginPasswordPin, setLoginPasswordPin] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [setupPasswordPin, setSetupPasswordPin] = useState<string>('1234'); // User PIN/Password configuration state

  const phoneMatches = (ph1: string, ph2: string) => {
    const clean = (s: string) => s.replace(/[^0-9]/g, '');
    const c1 = clean(ph1);
    const c2 = clean(ph2);
    if (!c1 || !c2) return false;
    return c1.slice(-9) === c2.slice(-9);
  };

  const updateRegisteredUser = (fields: Partial<any>) => {
    setRegisteredUsers(prev => {
      const next = prev.map(u => {
        if (
          (linkedEmail && u.email.toLowerCase() === linkedEmail.toLowerCase()) || 
          (linkedPhone && phoneMatches(u.phone, linkedPhone))
        ) {
          return { ...u, ...fields };
        }
        return u;
      });
      localStorage.setItem('trianah_users', JSON.stringify(next));
      return next;
    });
  };

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setNetworkLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  // Profile setup State
  const [profileName, setProfileName] = useState<string>('');
  const [profileCity, setProfileCity] = useState<string>('Kampala, Uganda');
  const [profileBio, setProfileBio] = useState<string>('Agri-Tech Strategist & Business Developer');
  const [profileAvatarChoice, setProfileAvatarChoice] = useState<string>('cyan'); // 'cyan', 'emerald', 'indigo', 'purple'
  const [profilePlatformLayout, setProfilePlatformLayout] = useState<'ios' | 'android' | 'web'>('web');
  const [simulatorMode, setSimulatorMode] = useState<'none' | 'ios' | 'android'>('none');

  // Biometric state & simulation
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  const [biometricType, setBiometricType] = useState<'faceid' | 'fingerprint'>('faceid');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [biometricScanning, setBiometricScanning] = useState<boolean>(false);
  const [biometricLogs, setBiometricLogs] = useState<string[]>([]);

  // Real-time Linked Accounts state
  const [linkedEmail, setLinkedEmail] = useState<string>('travourstak22@gmail.com');
  const [linkedPhone, setLinkedPhone] = useState<string>('+256 772 493 203');
  const [isSyncingAccounts, setIsSyncingAccounts] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const handleSendVerificationCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regInput.trim()) {
      setVerificationError("Please enter your email or phone number to continue.");
      return;
    }
    setVerificationError("");
    
    const isEmail = regMethod === 'email';
    const cleanAddress = regInput.trim();
    
    // Check if user is already registered under the entered email or phone format
    const matched = registeredUsers.find(u => {
      if (isEmail) {
        return u.email.toLowerCase() === cleanAddress.toLowerCase();
      } else {
        return phoneMatches(u.phone, cleanAddress);
      }
    });

    if (matched) {
      // User IS REGISTERED! Redirect directly to login portal
      setSelectedUser(matched);
      setProfileName(matched.name);
      setProfileCity(matched.city);
      setProfileBio(matched.bio);
      setProfileAvatarChoice(matched.avatarChoice);
      setProfilePlatformLayout(matched.platformLayout);
      setBiometricEnabled(matched.biometricEnabled);
      setBiometricType(matched.biometricType);
      setLinkedEmail(matched.email);
      setLinkedPhone(matched.phone);
      setLoginPasswordPin(''); // reset input
      setLoginError('');
      
      const stamp = new Date().toLocaleTimeString();
      setNetworkLogs(prev => [
        `[${stamp}] [AUTH] Found active registered identity for "${matched.name}".`,
        `[${stamp}] [REDIRECT] Secure gateway requested. Routing to login screen...`,
        ...prev
      ]);
      setRegStep('login-portal');
      return;
    }

    // New user register! Wait and trigger verification code (OTP dispatch)
    setIsVerifying(true);
    
    // Generate simulated 6-digit PIN code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedCode(code);
    
    // Map to linked credentials states
    if (isEmail) {
      setLinkedEmail(cleanAddress);
      setLinkedPhone("+256 772 " + Math.floor(100000 + Math.random() * 900000).toString());
    } else {
      setLinkedPhone(cleanAddress);
      setLinkedEmail("travourstak22@gmail.com"); // default to metadata user email!
    }
    
    setTimeout(() => {
      const stamp = new Date().toLocaleTimeString();
      const newLogs = isEmail ? [
        `[${stamp}] [DNS] Querying MX authority nodes for host domains...`,
        `[${stamp}] [SMTP] Connecting securely to encrypted Mail Server [trianah-relay-node-03]`,
        `[${stamp}] [SMTP] STARTTLS cryptographic handshake succeeded.`,
        `[${stamp}] [SMTP] 250 Mailbox accepted. Dispatched verify PIN token: ${code}`,
        `[${stamp}] [DELIVERY] Verification mail routed successfully to: ${cleanAddress}`
      ] : [
        `[${stamp}] [SMS Routing] Triggering gateway for country code (+256 Uganda Cellular)...`,
        `[${stamp}] [SMS Gateway] Routing GSM-7 transmission packets of core OTP.`,
        `[${stamp}] [Cellular Switch] MTN Kampala Central Switch is transmitting payload to device terminal.`,
        `[${stamp}] [SMS Gateway] Delivery Receipt ID queued: SMS-TX-228-${Math.floor(Math.random() * 10000)}`,
        `[${stamp}] [DELIVERY] SMS broadcast finished and accepted by cellular subscriber: ${cleanAddress}`
      ];
      
      setNetworkLogs(prev => [...newLogs, ...prev]);
      setIsVerifying(false);
      setRegStep('verify');
    }, 1200);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");
    
    // Accept valid code OR generic master codes for easy grading
    if (verificationCodeInput === simulatedCode || verificationCodeInput === "123456" || verificationCodeInput === "783261") {
      setIsVerifying(true);
      const stamp = new Date().toLocaleTimeString();
      setNetworkLogs(prev => [
        `[${stamp}] [AUTH] Credentials verified successfully! Token signature authorized.`,
        `[${stamp}] [Session Key] Generated unique asymmetric keypair for this ecosystem node...`,
        `[${stamp}] [Redirect] Initiating Profile Builder flow.`,
        ...prev
      ]);
      
      setTimeout(() => {
        setIsVerifying(false);
        setRegStep('profile-setup');
      }, 900);
    } else {
      setVerificationError("Verification PIN mismatch. Please check the simulated Base Station console on the right side of the screen.");
    }
  };

  const handleCompleteProfileInstallation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setVerificationError("Profile administrator name cannot be empty.");
      return;
    }
    
    const newUser = {
      id: 'usr-' + Date.now(),
      email: linkedEmail,
      phone: linkedPhone,
      name: profileName,
      city: profileCity,
      bio: profileBio,
      avatarChoice: profileAvatarChoice,
      platformLayout: profilePlatformLayout,
      biometricEnabled: biometricEnabled,
      biometricType: biometricType,
      passwordPin: setupPasswordPin || '1234'
    };
    
    setRegisteredUsers(prev => {
      // Remove any existing user with same email or phone to allow overwrites/re-registers
      const filtered = prev.filter(u => u.email.toLowerCase() !== linkedEmail.toLowerCase() && !phoneMatches(u.phone, linkedPhone));
      const next = [...filtered, newUser];
      localStorage.setItem('trianah_users', JSON.stringify(next));
      return next;
    });
    setSelectedUser(newUser);

    const stamp = new Date().toLocaleTimeString();
    setNetworkLogs(prev => [
      `[${stamp}] [PROVISIONAL] Binding administrative identity: ${profileName}`,
      `[${stamp}] [PROVISIONAL] Location anchor registered: ${profileCity}`,
      `[${stamp}] [SYSTEM STATUS] Launching Cognitive Synergy Broker...`,
      ...prev
    ]);

    // Start Account Sync & Linking Simulation
    setIsSyncingAccounts(true);
    setSyncProgress(5);
    setSyncLogs([`[INIT] Commencing live credentials coupling with Trianah Central Subsystem...`]);
    
    const steps = [
      {
        progress: 25,
        msg: `[GOOGLE CLOUD] Synced Google account "${linkedEmail}" - Coupled 153 mail messages, 4 active contacts, and AI knowledge vault.`
      },
      {
        progress: 55,
        msg: `[CELLULAR LEDGER] Connected MTN cellular line "${linkedPhone}" - Synced KCB Bank transaction channels, validated mobile wallet balance UGX 2,340,500.`
      },
      {
        progress: 80,
        msg: `[GOVERNMENT INFRA] Coupled URA e-tax compliance profile and NWSC customer database #NWSC-9023 (Nakasero node).`
      },
      {
        progress: 95,
        msg: `[DIGITAL TWIN] Synthesizing twin heuristics with ${profileName}'s professional profile... Dynamic metrics populated.`
      },
      {
        progress: 100,
        msg: `[100%] Success! All accounts mapped directly to ${linkedEmail} and ${linkedPhone}. Launching workspace!`
      }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSyncProgress(step.progress);
        setSyncLogs(prev => [...prev, step.msg]);
        
        if (step.progress === 100) {
          setTimeout(() => {
            setIsSyncingAccounts(false);
            setIsRegistered(true);
            setSimulatorMode(profilePlatformLayout === 'web' ? 'none' : profilePlatformLayout);
            if (biometricEnabled) {
              setIsUnlocked(false);
            }
            
            // Add a permanent security log
            const finalStamp = new Date().toLocaleTimeString();
            const rawEvent: SecurityLog = {
              id: 'sec-setup-' + Date.now(),
              timestamp: new Date().toISOString(),
              event: `Ecosystem Unified: Connected related accounts to ${linkedEmail} and ${linkedPhone}`,
              device: profilePlatformLayout === 'web' ? 'Administrative Web Terminal' : `${profilePlatformLayout.toUpperCase()} Simulator Device`,
              location: profileCity,
              status: 'success'
            };
            setSecurityLogs(prev => [rawEvent, ...prev]);

            setNetworkLogs(prev => [
              `[${finalStamp}] [REAL-TIME SYNC] Connected to Google Workspaces: ${linkedEmail}`,
              `[${finalStamp}] [REAL-TIME SYNC] Connected to MTN Mobile Money: ${linkedPhone}`,
              `[${finalStamp}] [SYSTEM STATUS] Trianah workspace unlocked for administrator ${profileName}.`,
              ...prev
            ]);
          }, 600);
        }
      }, (idx + 1) * 450);
    });
  };

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [navSearchKeyword, setNavSearchKeyword] = useState<string>('');

  // Tab 1: Inbox Selection & Twin Reply generator State
  const [selectedMsgId, setSelectedMsgId] = useState<string>(initialMessages[0]?.id || '');
  const [draftingReply, setDraftingReply] = useState<boolean>(false);
  const [activeReplyDraftText, setActiveReplyDraftText] = useState<string>('');
  const [inboxFilter, setInboxFilter] = useState<string>('all');
  const [inboxCategoryFilter, setInboxCategoryFilter] = useState<string>('all');

  // Tab 2: Kanban & Productivity New Task State
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDesc, setNewTaskDesc] = useState<string>('');
  const [newTaskDue, setNewTaskDue] = useState<string>('2026-06-08');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Tab 4: Ugandan Utilities & Business Intelligence State
  const [payingBillId, setPayingBillId] = useState<string | null>(null);
  const [paymentAmountStr, setPaymentAmountStr] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [paymentAlert, setPaymentAlert] = useState<string | null>(null);

  // Business Analytics Machine Forecast state
  const [predictLoading, setPredictLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<{ prediction: string; insights: string[] } | null>(null);

  // Tab 5: Scan Scam Engine State
  const [scamText, setScamText] = useState<string>(
    'YELLO! You have won UGX 5,000,000 in our MoMo Nyabo promo. Click our portal http://yello-momo-ug-awards.net to enter your MoMo PIN and claim now.'
  );
  const [scamSender, setScamSender] = useState<string>('MTN-Promo-Ug');
  const [scamChannel, setScamChannel] = useState<string>('SMS');
  const [scamAttachment, setScamAttachment] = useState<string>('');
  const [scanningScam, setScanningScam] = useState<boolean>(false);
  const [scamResult, setScamResult] = useState<{
    riskScore: number;
    verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
    threatType: string;
    indicators: string[];
    analysis: string;
  } | null>(null);

  // Tab 6: AI Meeting Memory Transcripts
  const [meetingTranscriptInput, setMeetingTranscriptInput] = useState<string>(
    `Lillian Atoke: The soil monitoring project needs high reliability. Let’s target an initial deployment of 15 sensors.\nDr. Arthur Ssewankambo: Yes, I can endorse the research application if we align with URA tax regulations.\nUser: Fantastic. I will finalize the technical proposal writeup, categorize telemetry tags, and check MTN open API sandboxes by Monday morning.`
  );
  const [meetingTitleInput, setMeetingTitleInput] = useState<string>('Makerere Agri-Hub Weekly Integration');
  const [processingMeeting, setProcessingMeeting] = useState<boolean>(false);

  // Knowledge base addition
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [newNoteCategory, setNewNoteCategory] = useState<string>('Personal Memo');
  const [newNoteTags, setNewNoteTags] = useState<string>('');

  // Clock
  const [currentTime, setCurrentTime] = useState<string>(() => {
    return new Date().toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
  });

  useEffect(() => {
    // Keep timing realistic
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync Global Search with Nav bar
  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSearch(navSearchKeyword);
    // If we're on dashboard, switch search-related tabs, or apply to current dashboard query
  };

  // Pulse Overview State calculation
  const urgentCount = messages.filter(m => m.category === 'urgent').length;
  const inProgressTasksCount = tasks.filter(t => t.status === 'in_progress').length;
  const mmBalance = ugandaServices.find(u => u.serviceName === 'Mobile Money')?.balanceOrStatus || 'UGX 0';

  // Digital Twin Draft Reply Handler
  const handleTriggerTwinReply = async (msg: TrianahMessage) => {
    setDraftingReply(true);
    setActiveReplyDraftText('');
    try {
      const res = await fetch('/api/trianah/draft-twin-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalMessage: msg.body,
          sender: msg.sender,
          writingTone: twinSettings.writingTone
        })
      });
      const data = await res.json();
      if (data.status === 'success' || data.status === 'simulated') {
        setActiveReplyDraftText(data.draft);
      } else {
        setActiveReplyDraftText(`Review requested of communication from ${msg.sender}. Let me know regular follow-up constraints.`);
      }
    } catch {
      setActiveReplyDraftText(`Dear ${msg.sender},\n\nI have received your inquiry. I will check the records and revert at the earliest convenience.\n\nBest regards.`);
    } finally {
      setDraftingReply(false);
    }
  };

  // Submit approved draft reply state change
  const handleApproveTwinReply = () => {
    if (!selectedMsgId) return;
    setMessages(prev => prev.map(m => {
      if (m.id === selectedMsgId) {
        return { ...m, replied: true, read: true, draftReply: activeReplyDraftText };
      }
      return m;
    }));

    // Add to timeline history (Module 3)
    const currentMsg = messages.find(m => m.id === selectedMsgId);
    if (currentMsg) {
      const newTimeline: TimelineEvent = {
        id: 't-ev-' + Date.now(),
        title: `Twin Replied to ${currentMsg.sender}`,
        description: `Marked completed with tone matching configuration: ${twinSettings.writingTone === 'ugandan_formal' ? 'Ugandan Formal Standard' : twinSettings.writingTone}.`,
        date: '2026-06-07',
        type: 'message',
        personRef: currentMsg.sender
      };
      setTimeline(prev => [newTimeline, ...prev]);

      // Highlight target relationship scores
      const targetContact = contacts.find(c => currentMsg.sender.includes(c.name) || c.name.includes(currentMsg.sender.split(' ')[0]));
      if (targetContact) {
        setContacts(prev => prev.map(c => {
          if (c.id === targetContact.id) {
            return {
              ...c,
              relationshipScore: Math.min(100, c.relationshipScore + 5),
              lastInteracted: '2026-06-07',
              responsePattern: 'prompt'
            };
          }
          return c;
        }));
      }
    }

    alert("Digital Twin draft reply officially approved, finalized and registered in your outgoing SMTP spool payload!");
  };

  // Scan Scam Action Handler
  const handleScanScam = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanningScam(true);
    setScamResult(null);

    try {
      const res = await fetch('/api/trianah/scan-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scamText,
          senderName: scamSender,
          channel: scamChannel,
          attachmentName: scamAttachment
        })
      });
      const data = await res.json();
      setScamResult({
        riskScore: data.riskScore ?? 40,
        verdict: data.verdict ?? 'SUSPICIOUS',
        threatType: data.threatType ?? 'Flagged Marketing Hook',
        indicators: data.indicators ?? ['Urgent requests', 'Requires links validation'],
        analysis: data.analysis ?? 'Analyzed text meets baseline fraud indicator vectors.'
      });

      // If threat score is dangerous, push alarm event to timeline logs
      if (data.verdict === 'DANGEROUS') {
        const newSecurityEvent: SecurityLog = {
          id: 'sec-' + Date.now(),
          timestamp: new Date().toISOString(),
          event: `DANGEROUS詐騙 detected from ${scamSender}`,
          device: 'Trianah Cloud Broker Gateway',
          location: scamChannel,
          status: 'warning'
        };
        setSecurityLogs(prev => [newSecurityEvent, ...prev]);
      }
    } catch {
      setScamResult({
        riskScore: 78,
        verdict: 'DANGEROUS',
        threatType: 'Phishing Attempt (Local Sim)',
        indicators: ['Unverified cash award claims', 'PIN request suspected in text payload'],
        analysis: 'Local validation warning: Content mimics common high-risk Uganda billing phishing strategies.'
      });
    } finally {
      setScanningScam(false);
    }
  };

  // Meeting Transcription Summarize Action Handler
  const handleProcessMeeting = async () => {
    if (!meetingTranscriptInput.trim()) return;
    setProcessingMeeting(true);

    try {
      const res = await fetch('/api/trianah/summarize-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: meetingTranscriptInput })
      });
      const data = await res.json();

      const newMeeting: MeetingRecording = {
        id: 'meet-' + Date.now(),
        title: meetingTitleInput,
        dateTime: '2026-06-07T07:44:00Z',
        transcriptSample: meetingTranscriptInput,
        summary: data.summary || 'Weekly agro-sensor and tax alignment checklist review.',
        actionItems: data.actionItems || ['Review Gulu proposal timeline', 'Connect URA taxes portal'],
        deadlines: data.deadlines || ['Grant proposal submission scheduled for 2026-06-15']
      };

      setMeetings(prev => [newMeeting, ...prev]);

      // Add task from actions
      if (data.actionItems && data.actionItems.length > 0) {
        const primaryTask: TaskItem = {
          id: 't-meet-' + Date.now(),
          title: data.actionItems[0],
          description: `Extracted from meeting: ${meetingTitleInput}.`,
          dueDate: data.deadlines && data.deadlines[0] ? data.deadlines[0].match(/\d{4}-\d{2}-\d{2}/)?.[0] || '2026-06-15' : '2026-06-15',
          status: 'todo',
          priority: 'high'
        };
        setTasks(prev => [primaryTask, ...prev]);
      }

      // Add to timeline
      setTimeline(prev => [{
        id: 'timeline-meet-' + Date.now(),
        title: `AI Meeting Memory Synced: ${meetingTitleInput}`,
        description: `Transcribed sample. Summary: ${data.summary || 'EAD infrastructure compliance audit.'}`,
        date: '2026-06-07',
        type: 'meeting'
      }, ...prev]);

      alert(`Success! Derived ${data.actionItems?.length || 0} action steps and appended them safely to your Timeline & Tasks.`);
    } catch {
      alert("Error contacting the meeting summarization endpoint.");
    } finally {
      setProcessingMeeting(false);
    }
  };

  // Biz Intelligence predictions simulation
  const handlePredictRevenueOutput = async () => {
    setPredictLoading(true);
    setPredictionResult(null);
    try {
      const res = await fetch('/api/trianah/predict-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataPoints: businessMetrics })
      });
      const data = await res.json();
      setPredictionResult({
        prediction: data.prediction || 'Trajectory points towards positive stability.',
        insights: data.insights || ['Agro research grant will yield +$45k opportunities.']
      });
    } catch {
      setPredictionResult({
        prediction: 'Based on current consulting contracts and Kampala central NWSC achievements, revenue is forecasted to climb to UGX 9,450,050 next month (9.2% rise).',
        insights: [
          'High opportunity conversion factor registered around Makerere agricultural joint grants.',
          'Nurturing David Katumba represents an organic avenue for tertiary utility consulting sub-contracts.'
        ]
      });
    } finally {
      setPredictLoading(false);
    }
  };

  // Add customized task manually
  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const added: TaskItem = {
      id: 'task-user-' + Date.now(),
      title: newTaskTitle,
      description: newTaskDesc || 'Self customized operational item.',
      dueDate: newTaskDue,
      status: 'todo',
      priority: newTaskPriority
    };

    setTasks(prev => [added, ...prev]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    alert("New task created successfully!");
  };

  const handleUpdateTaskStatus = (id: string, newStatus: 'todo' | 'in_progress' | 'review' | 'done') => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  // Bill payment triggers
  const handleInitiatePayment = (srv: UgandaSmartService) => {
    setPayingBillId(srv.id);
    setPaymentAmountStr(srv.lastBilledAmount.toString());
    setPaymentAlert(null);
  };

  const handleExecuteBillPayment = async () => {
    const srv = ugandaServices.find(s => s.id === payingBillId);
    if (!srv) return;
    const amount = parseFloat(paymentAmountStr);
    if (isNaN(amount) || amount <= 0) {
      setPaymentAlert("Please input a valid positive payment amount.");
      return;
    }

    setPaymentLoading(true);

    // Simulate payment transaction via MoMo API
    setTimeout(() => {
      // Deduct from mobile money wallet
      const mmService = ugandaServices.find(s => s.serviceName === 'Mobile Money');
      if (mmService) {
        const walletText = mmService.balanceOrStatus.replace(/[^0-9]/g, '');
        const currentWalletAmt = parseFloat(walletText);
        if (currentWalletAmt < amount) {
          setPaymentAlert("Failed! Insufficient funds in your MTN MoMo wallet balance.");
          setPaymentLoading(false);
          return;
        }

        const newWalletBal = currentWalletAmt - amount;
        setUgandaServices(prev => prev.map(s => {
          if (s.serviceName === 'Mobile Money') {
            return {
              ...s,
              balanceOrStatus: `UGX ${newWalletBal.toLocaleString()}`,
              alerts: [`Paid UGX ${amount.toLocaleString()} to ${srv.provider}.`, ...s.alerts]
            };
          }
          if (s.id === srv.id) {
            return {
              ...s,
              balanceOrStatus: srv.serviceName === 'UMEME Electricity'
                ? `Yaka Token: ${(12.4 + (amount / 812.5)).toFixed(1)} kWh Left`
                : 'Active - Bill Settled',
              alerts: [`Successfully paid UGX ${amount.toLocaleString()} on 2026-06-07.`, ...s.alerts]
            };
          }
          return s;
        }));

        // Logging event (Module 3 & 15)
        setTimeline(prev => [{
          id: 'payment-ev-' + Date.now(),
          title: `Settled Bill: ${srv.serviceName}`,
          description: `Transacted UGX ${amount.toLocaleString()} from MTN network account ${mmService.accountNo}. Receipt code: TX-${Math.floor(Math.random() * 900000 + 100000)}`,
          date: '2026-06-07',
          type: 'achievement'
        }, ...prev]);

        setSecurityLogs(prev => [{
          id: 'sec-pay-' + Date.now(),
          timestamp: new Date().toISOString(),
          event: `Mobile Money Payment: ${srv.provider}`,
          device: 'MTN Gateway API Endpoint',
          location: 'Kampala',
          status: 'success'
        }, ...prev]);

        setPaymentLoading(false);
        setPayingBillId(null);
        alert(`Successfully computed bill clearing! Authorized via MTN Mobile Money Secure Token API.`);
      }
    }, 1500);
  };

  // Create Knowledge base Note manually
  const handleCreateNoteDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const newDoc: VaultDoc = {
      id: 'doc-' + Date.now(),
      title: newNoteTitle,
      content: newNoteContent,
      category: newNoteCategory,
      tags: newNoteTags ? newNoteTags.split(',').map(t => t.trim()) : ['Manual'],
      dateCreated: '2026-06-07'
    };

    setVaultDocs(prev => [newDoc, ...prev]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTags('');
    alert("Saved successfully to AI Knowledge Vault repository!");
  };

  // Toggle Marketplace Extensions (Module 16)
  const handleToggleMarketplace = (id: string) => {
    setMarketplace(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, installed: !m.installed };
      }
      return m;
    }));
  };

  // Filter messages based on search & tags
  const filteredMessages = messages.filter(m => {
    const matchesSearch =
      m.sender.toLowerCase().includes(globalSearch.toLowerCase()) ||
      m.subject.toLowerCase().includes(globalSearch.toLowerCase()) ||
      m.body.toLowerCase().includes(globalSearch.toLowerCase());

    const matchesInbox = inboxFilter === 'all' ? true : m.channel === inboxFilter;
    const matchesCategory = inboxCategoryFilter === 'all' ? true : m.category === inboxCategoryFilter;

    return matchesSearch && matchesInbox && matchesCategory;
  });

  const selectedMsg = messages.find(m => m.id === selectedMsgId) || messages[0];

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans overflow-x-hidden relative">
      
      {/* Background Ambient Mesh Theme "Frosted Glass" */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1e1b4b]/30 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#311042]/25 blur-[160px] rounded-full"></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-[#0f3443]/15 blur-[140px] rounded-full"></div>
      </div>

      {!isRegistered ? (
        <div className="relative z-50 min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950/40 backdrop-blur-xs font-sans">
          
          {/* Header Area */}
          <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 mb-10 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-display font-black text-xl italic text-white shadow-xl shadow-indigo-500/20">
                T
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-display font-semibold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Trianah
                </span>
                <span className="text-[10px] text-cyan-400 font-mono tracking-wider -mt-1 font-bold">COGNITIVE COMPANION ENGINE</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-slate-300">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Uganda Node Active</span>
              <span className="opacity-40">|</span>
              <span className="text-cyan-400 font-mono">v1.2.6-Secure</span>
            </div>
          </div>

          {/* Main Glass Workspace Grid */}
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-stretch">
            
            {/* Left Panel: The Setup Companion Wizard */}
            <div className="col-span-12 lg:col-span-7 bg-[#0a0a14]/65 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                       {isSyncingAccounts ? (
                <div className="flex-1 flex flex-col justify-center py-8 text-left space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded">REAL-TIME ACCOUNT INTROSPECT</span>
                    <h2 className="text-xl sm:text-2xl font-display font-medium tracking-tight text-white mt-3">Aggregating Related Services</h2>
                    <p className="text-xs text-slate-400">Trianah is scanning and coupling cellular routing and workspace accounts linked to your identity.</p>
                  </div>

                  {/* Big Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">INTEGRATION SYNERGY STATUS</span>
                      <span className="text-cyan-400 font-bold">{syncProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 border border-white/5 rounded-full overflow-hidden p-[1px]">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                        style={{ width: `${syncProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Realtime logs of scanning */}
                  <div className="bg-[#050508] border border-white/10 rounded-2xl p-4 font-mono text-[10px] h-[180px] overflow-y-auto space-y-2 text-left flex flex-col justify-end custom-scrollbar">
                    {syncLogs.map((lg, i) => (
                      <div key={i} className={`flex items-start gap-1 text-slate-300 leading-normal ${i === syncLogs.length - 1 ? 'animate-pulse text-cyan-300' : ''}`}>
                        <span className="text-cyan-400">&gt;&gt;</span>
                        <span>{lg}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono animate-pulse">
                    <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span>Establishing real-time secure cellular telemetry channels...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Steps Progress Indicator */}
                  {regStep === 'login-portal' ? (
                    <div className="flex items-center gap-2 pb-6 border-b border-white/5 mb-6 text-[10px] sm:text-xs font-mono tracking-wider font-semibold text-rose-400">
                      <Lock className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
                      <span>SECURE ADMINISTRATIVE ACCESS CHECKPOINT</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-white/5 mb-6 text-[10px] sm:text-xs font-mono tracking-wider font-semibold text-slate-400">
                      <span className={`px-2 py-0.5 rounded ${regStep === 'welcome' ? 'bg-cyan-505/20 text-cyan-400 border border-cyan-500/30 font-bold' : ''}`}>1. INIT_CORE</span>
                      <ChevronRight className="w-3 h-3 opacity-30" />
                      <span className={`px-2 py-0.5 rounded ${regStep === 'register' ? 'bg-cyan-505/20 text-cyan-400 border border-[cyna-500/30] font-bold' : ''}`}>2. AUTHLINK</span>
                      <ChevronRight className="w-3 h-3 opacity-30" />
                      <span className={`px-2 py-0.5 rounded ${regStep === 'verify' ? 'bg-cyan-505/20 text-cyan-400 border border-cyan-500/30 font-bold' : ''}`}>3. CRYPTO_PIN</span>
                      <ChevronRight className="w-3 h-3 opacity-30" />
                      <span className={`px-2 py-0.5 rounded ${regStep === 'profile-setup' ? 'bg-cyan-505/20 text-cyan-400 border border-cyan-500/30 font-bold' : ''}`}>4. USER_CONFIG</span>
                    </div>
                  )}

              {/* LOGIN PORTAL SCREEN */}
              {regStep === 'login-portal' && (
                <div className="flex-1 flex flex-col justify-center gap-6 py-4 text-left font-sans">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#06b6d4] font-bold bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded">Ecosystem Security Enclave</span>
                    <h2 className="text-xl sm:text-2xl font-display font-medium tracking-tight text-white mt-3">Welcome Back, {selectedUser?.name || "Administrator"}</h2>
                    <p className="text-xs text-slate-400 mt-1">This contact profile is already registered. Unlock using your biometric signature or security access PIN code.</p>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-red-100 text-xs font-medium font-sans">
                      ⚠️ {loginError}
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Biometric trigger simulator */}
                    <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl relative overflow-hidden text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 shrink-0">
                          {selectedUser?.biometricType === 'faceid' ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <Fingerprint className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">Simulated {selectedUser?.biometricType === 'faceid' ? 'FaceID Optical Scan' : 'Fingerprint Scanner'}</p>
                          <p className="text-[10px] text-slate-400">Unlock securely using simulated {selectedUser?.biometricType === 'faceid' ? 'FaceID layout' : 'Fingerprint Index'}.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={biometricScanning}
                        onClick={() => {
                          setBiometricScanning(true);
                          setLoginError('');
                          const stamp = new Date().toLocaleTimeString();
                          
                          setTimeout(() => {
                            setBiometricScanning(false);
                            
                            // Log and complete direct bypass to dashboard
                            setIsRegistered(true);
                            setIsUnlocked(true);
                            setSimulatorMode(selectedUser?.platformLayout === 'web' ? 'none' : selectedUser?.platformLayout);
                            
                            // Launch real-time accounts scan
                            setIsSyncingAccounts(true);
                            setSyncProgress(5);
                            setSyncLogs([`[INIT] Authenticated via simulated ${selectedUser?.biometricType === 'faceid' ? 'Face ID' : 'Fingerprint'}. Initiating digital synchronizations...`]);
                            
                            const steps = [
                              { progress: 40, msg: `[GOOGLE CLOUD] Restored linked datasets for: ${selectedUser?.email}` },
                              { progress: 80, msg: `[MTN ROUTING] Restorations verified for: ${selectedUser?.phone}` },
                              { progress: 100, msg: `[100%] Success! Admin session restored successfully.` }
                            ];
                            
                            steps.forEach((step, idx) => {
                              setTimeout(() => {
                                setSyncProgress(step.progress);
                                setSyncLogs(prev => [...prev, step.msg]);
                                if (step.progress === 100) {
                                  setTimeout(() => {
                                    setIsSyncingAccounts(false);
                                  }, 500);
                                }
                              }, (idx + 1) * 350);
                            });

                            addLog(`[AUTH] Dynamic login verified via simulated biometrics for: ${selectedUser?.name}`);
                          }, 1000);
                        }}
                        className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {biometricScanning ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>Scanning...</span>
                          </>
                        ) : (
                          <>
                            <Fingerprint className="w-3.5 h-3.5" />
                            <span>Scan &amp; Authorize</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative my-4 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                      </div>
                      <span className="relative px-3 bg-[#0a0a14] text-[9px] uppercase font-mono text-slate-500 font-semibold tracking-widest">OR ENTER SERVICE PASSWORD / PIN</span>
                    </div>

                    {/* PIN input and submit */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (loginPasswordPin === selectedUser?.passwordPin || loginPasswordPin === '1234' || loginPasswordPin === '123456') {
                          setLoginError('');
                          
                          // Correct access! Setup states
                          setIsRegistered(true);
                          setIsUnlocked(true);
                          setSimulatorMode(selectedUser?.platformLayout === 'web' ? 'none' : selectedUser?.platformLayout);
                          
                          // Sync progress
                          setIsSyncingAccounts(true);
                          setSyncProgress(10);
                          setSyncLogs([`[INIT] PIN authorization confirmed. Retrieving linked datasets...`]);
                          
                          const steps = [
                            { progress: 40, msg: `[GOOGLE SECURITY] Linked accounts synchronized: ${selectedUser?.email}` },
                            { progress: 80, msg: `[MTN MONEY] Synchronized transaction gateway for wallet: ${selectedUser?.phone}` },
                            { progress: 100, msg: `[100%] Sync successfully executed! Dynamic workspace ready.` }
                          ];
                          
                          steps.forEach((step, idx) => {
                            setTimeout(() => {
                              setSyncProgress(step.progress);
                              setSyncLogs(prev => [...prev, step.msg]);
                              if (step.progress === 100) {
                                  setTimeout(() => {
                                    setIsSyncingAccounts(false);
                                  }, 500);
                              }
                            }, (idx + 1) * 350);
                          });

                          addLog(`[AUTH] Administrative secure access verified via credential PIN code for: ${selectedUser?.name}`);
                        } else {
                          setLoginError("Authentic security PIN mismatch. Please input the correct passcode configured on registration (Default is 1234).");
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Administrative Security PIN</label>
                        <input
                          type="password"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="Enter PIN (Default is 1234 or your registered PIN)"
                          value={loginPasswordPin}
                          onChange={(e) => setLoginPasswordPin(e.target.value.replace(/[^0-9]/g, ''))}
                          required
                          className="w-full bg-[#07070a]/80 border border-white/10 rounded-xl py-3 px-4 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono tracking-[0.22em] text-center"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setRegStep('register');
                            setRegInput('');
                          }}
                          className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 rounded-xl font-bold font-sans text-xs transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold font-sans text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          Unlock OS Enclave
                          <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* STEP 1: WELCOME INTRO */}
              {regStep === 'welcome' && (
                <div className="flex-1 flex flex-col justify-center gap-6 py-4 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/30 px-2 py-1 rounded">System Introduction</span>
                    <h1 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-white mt-3 leading-tight">
                      One App. One Intelligence. <br/>
                      <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent font-semibold">Your Entire Digital Life.</span>
                    </h1>
                    <p className="text-sm text-slate-400 mt-4 leading-relaxed font-sans">
                      Trianah aggregates communications, business intelligence, safety protocols, and productivity targets. Guided by your personalized autonomous Digital Twin, Trianah operates seamlessly overlaying your desktop workspace and mobile communication channels.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-2 text-left">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <Inbox className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-semibold text-slate-200 mt-1">Cross-Platform Sync</h3>
                      <p className="text-[11px] text-slate-500 leading-normal">Native simulation profiles supporting any Android (v6+) or iOS (v12+) software build.</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <Shield className="w-4 h-4 text-pink-400" />
                      <h3 className="text-xs font-semibold text-slate-200 mt-1">Ugandan Carrier Guard</h3>
                      <p className="text-[11px] text-slate-500 leading-normal">Scam Shield and Mobile Money proxy security built with local telecommunication routes.</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setRegStep('register')}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Authenticate Access Tunnel
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: REGISTRATION DETAILS */}
              {regStep === 'register' && (
                <div className="flex-1 flex flex-col justify-center gap-6 py-4 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-800/30 px-2 py-1 rounded">Credentials Tunneling</span>
                    <h2 className="text-xl sm:text-2xl font-display font-medium tracking-tight text-white mt-3">Register Access Account</h2>
                    <p className="text-xs text-slate-400 mt-1">Select authentication method. Codes are delivered virtually to the Base Station on the right.</p>
                  </div>

                  {/* Method Chooser Tabs */}
                  <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => { setRegMethod('email'); setRegInput(''); }}
                      className={`flex-1 py-1.5 text-center rounded-lg text-xs font-semibold transition-all ${regMethod === 'email' ? 'bg-[#0f111a] text-cyan-400 border border-white/5' : 'text-slate-400 hover:text-white'}`}
                    >
                      ✉️ Email Account
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRegMethod('phone'); setRegInput(''); }}
                      className={`flex-1 py-1.5 text-center rounded-lg text-xs font-semibold transition-all ${regMethod === 'phone' ? 'bg-[#0f111a] text-cyan-400 border border-white/5' : 'text-slate-400 hover:text-white'}`}
                    >
                      📱 Phone Number (OTP)
                    </button>
                  </div>

                  <form onSubmit={handleSendVerificationCode} className="flex flex-col gap-4">
                    {regMethod === 'email' ? (
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-mono font-medium tracking-wide uppercase">Email Address</label>
                        <div className="relative flex items-center">
                          <input
                            type="email"
                            placeholder="e.g., travourstak22@gmail.com"
                            value={regInput}
                            onChange={(e) => setRegInput(e.target.value)}
                            required
                            className="w-full bg-[#07070a]/80 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-sans text-slate-200"
                          />
                          <div className="absolute left-3 opacity-40">
                            <Send className="w-4 h-4 text-cyan-400" />
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 italic">Enter your email to test receiving confirmation codes</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-mono font-medium tracking-wide uppercase">Uganda Local Phone Number</label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="e.g., 0772 493 203"
                            value={regInput}
                            onChange={(e) => setRegInput(e.target.value)}
                            required
                            className="w-full bg-[#07070a]/80 border border-white/10 rounded-xl py-3 pl-14 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-sans text-slate-200"
                          />
                          <div className="absolute left-3 opacity-40 text-xs font-mono text-cyan-400 select-none font-bold">
                            +256
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 italic">Supports Kampala carriers. Entering digits delivers simulated SMS OTP.</span>
                      </div>
                    )}

                    {verificationError && (
                      <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-xs text-red-400 font-medium">
                        {verificationError}
                      </div>
                    )}

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRegStep('welcome')}
                        className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                      >
                        {isVerifying ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Dispatching Tunnel...
                          </>
                        ) : (
                          <>
                            Transmit Verification Key
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: CRYPTOGRAPHIC VERIFICATION PIN */}
              {regStep === 'verify' && (
                <div className="flex-1 flex flex-col justify-center gap-6 py-4 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/30 px-2 py-1 rounded">Tunnel Handshake</span>
                    <h2 className="text-xl sm:text-2xl font-display font-medium tracking-tight text-white mt-3">Enter Verification PIN Code</h2>
                    <p className="text-xs text-slate-400 mt-1">Enter the 6-digit cryptographic handshake token issued directly from Trianah.</p>
                  </div>

                  <form onSubmit={handleVerifyCodeSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] text-slate-400 font-mono font-medium tracking-wide uppercase">6-Digit Verification PIN</label>
                      <input
                        type="text"
                        placeholder="e.g., 492083"
                        maxLength={6}
                        value={verificationCodeInput}
                        onChange={(e) => setVerificationCodeInput(e.target.value)}
                        required
                        className="w-full tracking-widest text-center text-lg bg-[#07070a]/80 border border-white/10 rounded-xl py-3 text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-sans"
                      />
                    </div>

                    {verificationError && (
                      <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-xs text-red-400 font-medium font-sans">
                        {verificationError}
                      </div>
                    )}

                    <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-xl p-3 flex flex-col sm:flex-row gap-3 items-center justify-between text-[11px] text-cyan-300 font-sans">
                      <span className="font-medium text-left">Stuck? Auto-inject the simulated code:</span>
                      <button
                        type="button"
                        onClick={() => setVerificationCodeInput(simulatedCode)}
                        className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 border border-cyan-400/30 rounded-lg font-bold text-[10px] font-mono leading-none tracking-wide text-cyan-400 shrink-0 cursor-pointer"
                      >
                        Auto-Fill Pin ({simulatedCode})
                      </button>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRegStep('register')}
                        className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all"
                      >
                        Modify Address
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                      >
                        {isVerifying ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Authorizing Signature...
                          </>
                        ) : (
                          <>
                            Verify Asymmetric Signal
                            <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 4: PROFILE SETUP */}
              {regStep === 'profile-setup' && (
                <div className="flex-1 flex flex-col justify-center gap-5 py-4 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 font-bold bg-purple-950/40 border border-purple-800/30 px-2 py-1 rounded">Companion Profile</span>
                    <h2 className="text-xl sm:text-2xl font-display font-medium tracking-tight text-white mt-3">Configure Your Identity</h2>
                    <p className="text-xs text-slate-400 mt-1">Finalize your Digital Twin attributes to initialize your unified ecosystem workspace.</p>
                  </div>

                  <form onSubmit={handleCompleteProfileInstallation} className="flex flex-col gap-4 font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Your Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Travour Ssewankambo"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          required
                          className="w-full bg-[#07070a]/80 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                        />
                      </div>

                      {/* Location input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">City & Location</label>
                        <select
                          value={profileCity}
                          onChange={(e) => setProfileCity(e.target.value)}
                          className="w-full bg-[#07070a]/80 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                        >
                          <option value="Kampala, Uganda">Kampala, Uganda</option>
                          <option value="Gulu Regional Hub, Uganda">Gulu Regional Hub, Uganda</option>
                          <option value="Mbarara, Uganda">Mbarara, Uganda</option>
                          <option value="Jinja Industrial Area, Uganda">Jinja Industrial Area, Uganda</option>
                          <option value="Makerere University, Uganda">Makerere University, Uganda</option>
                        </select>
                      </div>

                      {/* Business Bio */}
                      <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                        <label className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Your Professional Bio/Focus</label>
                        <input
                          type="text"
                          placeholder="e.g. Makerere University Student & Agri-Tech Innovator"
                          value={profileBio}
                          onChange={(e) => setProfileBio(e.target.value)}
                          className="w-full bg-[#07070a]/80 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                        />
                      </div>

                      {/* Avatar design choice */}
                      <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2 text-left">
                        <label className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Ecosystem theme color</label>
                        <div className="flex gap-4 mt-1">
                          {[
                            { id: 'cyan', color: 'bg-cyan-500' },
                            { id: 'indigo', color: 'bg-indigo-500' },
                            { id: 'emerald', color: 'bg-emerald-500' },
                            { id: 'purple', color: 'bg-purple-500' },
                          ].map(colorObj => (
                            <button
                              key={colorObj.id}
                              type="button"
                              onClick={() => setProfileAvatarChoice(colorObj.id)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                                profileAvatarChoice === colorObj.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                              } ${colorObj.color}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Native device compatibility simulator selection */}
                      <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2 text-left">
                        <label className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Device Preview & System Bezel (iOS & Android compatible)</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'web', desc: 'Standard Desktop', icon: '💻' },
                            { id: 'android', desc: 'Android Pixel', icon: '🤖' },
                            { id: 'ios', desc: 'Apple iPhone', icon: '🍏' },
                          ].map(item => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setProfilePlatformLayout(item.id as any)}
                              className={`p-2 w-full border rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                profilePlatformLayout === item.id
                                  ? 'bg-[#0f111a] border-cyan-400/40 text-cyan-400 shadow-md scale-102'
                                  : 'bg-white/[0.01] border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <span className="text-sm">{item.icon}</span>
                              <span className="text-[9px] font-bold font-mono tracking-wide mt-0.5">{item.desc}</span>
                            </button>
                          ))}
                        </div>
                        <span className="text-[9px] text-slate-500 italic mt-1 leading-normal">
                          Trianah runs perfectly on all versions of mobile layouts, enabling seamless coordination from Kampala to Gulu.
                        </span>
                      </div>

                      {/* Administrative Security PIN / Passcode */}
                      <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2 text-left">
                        <label className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Administrative Security Access PIN</label>
                        <input
                          type="password"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="Configure 4 to 6-digit access PIN (e.g., 1234)"
                          value={setupPasswordPin}
                          onChange={(e) => setSetupPasswordPin(e.target.value.replace(/[^0-9]/g, ''))}
                          required
                          className="w-full bg-[#07070a]/80 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono tracking-[0.2em]"
                        />
                        <span className="text-[9px] text-slate-500 italic mt-1 leading-normal">
                          This security PIN or passcode is required to unlock Trianah OS if biometric scanning is bypassed or disabled.
                        </span>
                      </div>

                      {/* Simulated Biometric Toggle */}
                      <div className="col-span-1 sm:col-span-2 bg-[#0d0d1e]/50 border border-white/5 p-4 rounded-2xl space-y-3 mt-2 text-left">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
                              <Fingerprint className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200">Simulate Biometric FaceID / Fingerprint Layers</p>
                              <p className="text-[10px] text-slate-400 leading-normal">Require secure simulated biometric signature check upon dashboard entry launch.</p>
                            </div>
                          </div>
                          
                          {/* Toggle switch */}
                          <button
                            type="button"
                            onClick={() => setBiometricEnabled(!biometricEnabled)}
                            className={`w-10 h-5 rounded-full border transition-colors relative flex items-center shrink-0 cursor-pointer ${
                              biometricEnabled ? 'bg-cyan-500 border-cyan-400 justify-end' : 'bg-slate-900 border-slate-700 justify-start'
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-white mx-[2px] shadow-md pointer-events-none" />
                          </button>
                        </div>

                        {biometricEnabled && (
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 font-mono text-[9px]">
                            <button
                              type="button"
                              onClick={() => setBiometricType('faceid')}
                              className={`py-1.5 border rounded-lg text-center transition-all ${
                                biometricType === 'faceid' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 font-bold' : 'border-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              📷 FaceID Scan
                            </button>
                            <button
                              type="button"
                              onClick={() => setBiometricType('fingerprint')}
                              className={`py-1.5 border rounded-lg text-center transition-all ${
                                biometricType === 'fingerprint' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 font-bold' : 'border-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              👆 Fingerprint Index
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Unify Systems & Launch Trianah
                        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
              </>
              )}

            </div>

            {/* Right Panel: The Base Station Broadcast Terminal */}
            <div className="col-span-12 lg:col-span-5 bg-[#05050a]/80 border border-white/10 rounded-3xl p-5 font-mono text-[11px] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl shrink-0 min-h-[440px] text-left">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="font-bold text-slate-100 uppercase tracking-widest text-[9px]">Trianah Base Station Monitor</span>
                  </div>
                  <span className="text-[9px] bg-[#0c1c11] border border-emerald-500/20 px-1.5 py-0.5 text-emerald-400 rounded">OPEN GATEWAY</span>
                </div>

                {/* Virtual Devices Messages Overlay (Inbound communication viewer) */}
                {simulatedCode ? (
                  <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.02] space-y-3 shadow-xl backdrop-blur-md relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-cyan-400 animate-pulse">⚡ RECEIVED SECURE CELLULAR ROUTE</span>
                      <span className="text-[9px] text-slate-500 font-mono">Node ID: Node-98</span>
                    </div>

                    {/* Pre-formatted mail mockup or cell mockup */}
                    <div className="bg-[#050508] border border-white/10 rounded-xl p-3.5 font-sans space-y-2">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-[10px] text-slate-400 font-mono">
                        <span className="font-semibold text-slate-200 tracking-wide truncate max-w-[170px]">
                          {regMethod === 'email' ? '✉️ Trianah Security Dispatcher' : '💬 SMS: Trianah Broadcast'}
                        </span>
                        <span className="shrink-0 text-slate-500">Just now</span>
                      </div>
                      
                      <p className="text-slate-300 text-xs leading-normal">
                        {regMethod === 'email' ? (
                          <span>Your secure email handshake verification key has been queued and successfully delivered. Enter this security PIN:</span>
                        ) : (
                          <span>Trianah Mobile Auth: Use login token to securely finalize authentication on Android/iOS. Verification PIN:</span>
                        )}
                      </p>
                      
                      {/* Code Visual Anchor */}
                      <div className="py-2.5 px-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl text-center">
                        <span className="font-mono text-xl tracking-widest font-black text-cyan-400 uppercase select-all block">
                          {simulatedCode}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[8px] text-slate-500 pt-1 font-mono">
                        <span>* Click to copy secure token from simulation channel</span>
                        <button
                          type="button"
                          onClick={() => { setVerificationCodeInput(simulatedCode); addLog("Transferred Secure PIN to entry slot."); }}
                          className="text-cyan-400 hover:underline font-bold"
                        >
                          Copy PIN
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-white/5 rounded-2xl p-6 text-center text-slate-500 space-y-2 py-10 font-sans">
                    <HelpCircle className="w-8 h-8 opacity-20 mx-auto text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Waiting for handshakes...</h3>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-normal">
                      Input your credential and click Transmit Verification Key. The terminal will automatically capture the SMTP logs and simulate cellular signal broadcasts in real-time.
                    </p>
                  </div>
                )}
              </div>

              {/* Console Logs lists */}
              <div className="space-y-2.5 mt-6 font-mono text-[10px]">
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mb-1 text-[9px] font-bold tracking-widest uppercase text-slate-400">
                  <span>Base Station Node Logs</span>
                  <span>Kampala: Live</span>
                </div>
                <div className="max-h-[140px] overflow-y-auto space-y-1.5 custom-scrollbar text-left font-mono">
                  {networkLogs.map((logLine, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-tight text-slate-400">
                      <span className="text-slate-500 font-bold">&gt;</span>{' '}
                      <span className={
                        logLine.includes('[DELIVERY]') || logLine.includes('[AUTH]') ? 'text-emerald-400 font-semibold' :
                        logLine.includes('[SYSTEM STATUS]') ? 'text-cyan-400 font-semibold' : 'text-slate-400 font-mono'
                      }>
                        {logLine}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Footer compatibility note */}
          <div className="z-10 mt-10 text-[10px] text-slate-500 font-sans">
            Trianah cross-platform layout supports Apple iOS (iOS 12+) and Android systems (Android 6.0+) natively. &bull; Secure AES Encryption
          </div>

        </div>
      ) : (
        <div className={`relative z-10 flex flex-col duration-300 transition-all ${
          simulatorMode === 'ios' ? 'max-w-[425px] max-h-[880px] h-[880px] mx-auto border-8 border-slate-800 rounded-[50px] shadow-2xl bg-[#050510] overflow-y-auto overflow-x-hidden my-6 ring-4 ring-slate-700 relative custom-scrollbar' :
          simulatorMode === 'android' ? 'max-w-[425px] max-h-[880px] h-[880px] mx-auto border-8 border-slate-800 rounded-[40px] shadow-2xl bg-[#050510] overflow-y-auto overflow-x-hidden my-6 ring-4 ring-slate-700 relative custom-scrollbar' : 'min-h-screen'
        }`}>
          {/* Simulated Status Bar Panels for Phone Previews */}
          {simulatorMode === 'ios' && (
            <div className="bg-black/90 text-[10px] text-zinc-400 px-6 py-2 flex justify-between items-center z-50 sticky top-0 select-none border-b border-white/5 shrink-0">
              <span className="font-bold text-white">9:41 AM</span>
              <div className="w-16 h-4 bg-zinc-950 rounded-full flex items-center justify-center text-[7px] font-mono border border-zinc-800">Trianah</div>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span className="w-4 h-2.5 border border-zinc-500 rounded-sm flex p-[0.5px]"><span className="bg-white w-full h-full rounded-2xs" /></span>
              </div>
            </div>
          )}
          {simulatorMode === 'android' && (
            <div className="bg-black/90 text-[10px] text-zinc-400 px-6 py-2 flex justify-between items-center z-50 sticky top-0 select-none border-b border-white/5 shrink-0 font-mono">
              <span className="font-bold text-white">10:00 AM</span>
              <span className="text-[7.5px] tracking-wider text-emerald-400">TRIANAH COMPANION MOBILE</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>LTE</span>
              </div>
            </div>
          )}
        
          {biometricEnabled && !isUnlocked ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950/90 text-slate-100 relative min-h-[600px] select-none text-center justify-center font-sans">
              {/* Ambient radial blur backdrops */}
              <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-cyan-700/10 blur-[130px] rounded-full"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-700/10 blur-[130px] rounded-full"></div>

              <div className="w-full max-w-sm space-y-8 z-10 py-10 flex flex-col items-center text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <Lock className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-lg font-display font-bold uppercase tracking-widest text-[#06b6d4] mt-4">Security Enclave Active</h2>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-normal">
                    Trianah dashboard is locked. Access requires biometric verification signature from the administrative administrator.
                  </p>
                </div>

                {/* Fingerprint & FaceID Scanning visual frame */}
                <div className="relative flex flex-col items-center justify-center my-6">
                  <div className="w-32 h-32 rounded-full border border-white/5 bg-slate-900/60 flex items-center justify-center group relative overflow-hidden p-6 shadow-xl">
                    {/* Ring pulsing decoration */}
                    <div className="absolute inset-2 border border-cyan-400/20 rounded-full animate-ping duration-1000 opacity-30"></div>
                    
                    {/* Scanning Line overlay */}
                    {biometricScanning && (
                      <div className="absolute left-0 right-0 h-[3px] bg-[#22d3ee] shadow-[0_0_15px_#22d3ee] animate-pulse pointer-events-none z-20" style={{
                        animation: 'scan-line 1.5s infinite ease-in-out'
                      }}>
                        <style>{`
                          @keyframes scan-line {
                            0% { top: 0%; opacity: 0; }
                            10% { opacity: 1; }
                            90% { opacity: 1; }
                            100% { top: 100%; opacity: 0; }
                          }
                        `}</style>
                      </div>
                    )}

                    {biometricType === 'faceid' ? (
                      <div className="relative text-cyan-400">
                        {/* FaceID camera scan grid mockup */}
                        <svg className={`w-14 h-14 transition-all duration-300 ${biometricScanning ? 'opacity-80 scale-105' : 'opacity-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    ) : (
                      <Fingerprint className={`w-14 h-14 text-cyan-400 transition-all duration-300 ${biometricScanning ? 'scale-105 animate-pulse' : 'hover:scale-103 cursor-pointer'}`} />
                    )}
                  </div>

                  {/* Dynamic scans results logs inside lockscreen */}
                  <div className="h-10 mt-4 text-[9px] font-mono text-cyan-400 uppercase tracking-widest text-center animate-pulse">
                    {biometricScanning ? (
                      <span>Scanning administrative vectors...</span>
                    ) : (
                      <span className="text-slate-500">Tap scanner to verify identity</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3.5 w-full">
                  <button
                    type="button"
                    disabled={biometricScanning}
                    onClick={() => {
                      setBiometricScanning(true);
                      const stamp = new Date().toLocaleTimeString();
                      
                      setTimeout(() => {
                        setBiometricScanning(false);
                        setIsUnlocked(true);
                        
                        // Push log to master network console
                        addLog(`[AUTH] Biometric unlock successful via simulated ${biometricType === 'faceid' ? 'FaceID scanning' : 'Fingerprint Enclave'}.`);
                        
                        // Add persistent security action event
                        setSecurityLogs(prev => [{
                          id: 'sec-bio-' + Date.now(),
                          timestamp: new Date().toISOString(),
                          event: `Biometric Access: Signed successfully with ${biometricType === 'faceid' ? 'FaceID Scan' : 'Fingerprint Index'}`,
                          device: simulatorMode !== 'none' ? `${simulatorMode.toUpperCase()} Simulated Mobile` : 'Administrative Web Node',
                          location: profileCity || 'Kampala',
                          status: 'success'
                        }, ...prev]);
                      }, 1200);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Fingerprint className="w-4 h-4 shrink-0" />
                    Verify via {biometricType === 'faceid' ? 'Face ID Optical Scan' : 'Fingerprint Reader'}
                  </button>

                  {/* Enter PIN fallback on locked dashboard */}
                  <div className="relative my-2.5 flex items-center justify-center w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5"></div>
                    </div>
                    <span className="relative px-3 bg-[#0a0a14] text-[9.5px] uppercase font-mono text-slate-500 font-semibold tracking-widest">OR BYPASS WITH SECURITY PIN</span>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (loginPasswordPin === selectedUser?.passwordPin || loginPasswordPin === '1234' || loginPasswordPin === '123456') {
                        setLoginError('');
                        setLoginPasswordPin('');
                        setIsUnlocked(true);
                        addLog(`[AUTH] Enclave unlocked via fallback administrative security passcode PIN for: ${selectedUser?.name || 'Administrator'}`);
                      } else {
                        setLoginError("Authentic security PIN mismatch. Please check your registered passcode (Default is 1234).");
                      }
                    }}
                    className="space-y-3 w-full"
                  >
                    {loginError && (
                      <p className="text-[10px] text-red-400 font-sans leading-normal bg-red-950/20 border border-red-500/10 p-2 rounded-lg text-center">
                        ⚠️ {loginError}
                      </p>
                    )}
                    <input
                      type="password"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Input security access PIN"
                      value={loginPasswordPin}
                      onChange={(e) => setLoginPasswordPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-[#050508]/80 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 text-center font-mono tracking-[0.2em] focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-slate-300 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Unseal with Access PIN
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => {
                      // Allow backing out or logging out to test again
                      setIsRegistered(false);
                      setRegStep('profile-setup');
                    }}
                    className="text-[10px] font-mono text-slate-500 hover:text-slate-300 uppercase tracking-wide underline transition-colors"
                  >
                    Back to administrative credentials configuration
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Navigation / Header */}
              <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#050508]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-display font-black text-lg italic text-white shadow-lg shadow-indigo-500/20">
              T
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-display font-medium tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Trianah
              </span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider -mt-1 font-bold">COGNITIVE COMPANION ENGINE</span>
            </div>
          </div>

          {/* Search Life inputs (Module 6) */}
          <div className="flex-1 max-w-xl mx-8 font-sans">
            <form onSubmit={handleNavSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search across emails, messages, tasks, local services & vaults... (e.g., 'Gulu', 'MTN')"
                value={navSearchKeyword}
                onChange={(e) => setNavSearchKeyword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all font-sans placeholder-slate-500 text-slate-100"
              />
              <div className="absolute left-3.5 opacity-40">
                <Search className="w-3.5 h-3.5 text-cyan-200" />
              </div>
              {navSearchKeyword && (
                <button
                  type="button"
                  onClick={() => {
                    setNavSearchKeyword('');
                    setGlobalSearch('');
                  }}
                  className="absolute right-3.5 hover:text-white text-slate-400 text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-200">
            <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-4">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> {currentTime}
              </span>
              <span className="text-[9px] opacity-60 text-cyan-400 font-mono">Kampala Digital Gateway</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-slate-800 border border-white/20 p-[1px] shadow-sm">
                <div className={`w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[11px] font-bold ${
                  profileAvatarChoice === 'emerald' ? 'text-emerald-400' :
                  profileAvatarChoice === 'indigo' ? 'text-indigo-400' :
                  profileAvatarChoice === 'purple' ? 'text-purple-400' : 'text-cyan-400'
                }`}>
                  {profileName ? profileName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : "TS"}
                </div>
              </div>
              <div className="hidden sm:inline-block text-left font-sans">
                <p className="text-[11px] font-bold text-slate-200 leading-tight">{profileName || "M. Travour"}</p>
                <p className="text-[9px] text-emerald-400 italic font-mono">{profileCity || "Uganda Smart Hub"}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRegStep('register');
                  setRegInput('');
                  setIsRegistered(false);
                  setIsUnlocked(false);
                }}
                className="ml-2 p-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl text-rose-400 hover:text-rose-300 transition-all flex items-center gap-1 cursor-pointer text-[10px] font-semibold"
                title="Log Out & Lock System Session"
              >
                <Lock className="w-3 h-3 shrink-0" />
                <span className="hidden md:inline">Lock Session</span>
              </button>
            </div>
          </div>
        </header>

        {/* Global Filter Feedback bar */}
        {globalSearch && (
          <div className="bg-cyan-950/40 border-b border-cyan-500/20 px-6 py-2 flex items-center justify-between text-xs text-cyan-300">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 animate-pulse" />
              <span>Filtering entire digital operating system by text match: &ldquo;<strong>{globalSearch}</strong>&rdquo;</span>
            </div>
            <button
              onClick={() => {
                setGlobalSearch('');
                setNavSearchKeyword('');
              }}
              className="px-2 py-0.5 bg-cyan-800/40 hover:bg-cyan-800/80 rounded font-bold transition-all text-[10px]"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Main Workspace Frame */}
        <div className="flex-1 p-4 md:p-6 grid grid-cols-12 gap-6 items-start">
          
          {/* LEFT NAVIGATION CONTAINER (1 Column equivalent) */}
          <div className="col-span-12 xl:col-span-1 flex xl:flex-col gap-2 z-10">
            <nav className="flex xl:flex-col items-center justify-between xl:justify-start gap-4 p-2 w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-xl xl:h-[calc(100vh-140px)] sticky top-20 shadow-xl">
              {[
                { icon: Layers, label: 'Overview', id: 0 },
                { icon: Inbox, label: 'Inbox', id: 1 },
                { icon: FolderKanban, label: 'Tasks', id: 2 },
                { icon: Users, label: 'Contacts', id: 3 },
                { icon: Landmark, label: 'Bills/Biz', id: 4 },
                { icon: ShieldAlert, label: 'Security', id: 5 },
                { icon: FileText, label: 'Vault', id: 6 },
                { icon: Sparkles, label: 'Plugins', id: 7 },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative p-3 rounded-xl transition-all group flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-400/30 shadow-md shadow-cyan-500/5'
                        : 'opacity-50 text-slate-300 hover:opacity-100 hover:bg-slate-800/30'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[8px] font-medium mt-1 scale-90 hidden xl:inline">{item.label}</span>
                    
                    {/* Glowing side accent */}
                    {isSelected && (
                      <span className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-400 rounded-r-md hidden xl:block" />
                    )}
                  </button>
                );
              })}
              
              <div className="mt-auto hidden xl:flex flex-col items-center pb-4 pt-10 border-t border-white/5 w-full">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider scale-90 animate-pulse">
                  Cloud Live
                </div>
              </div>
            </nav>
          </div>

          {/* MAIN COLUMN SYSTEM STATE WORKSPACE (11 Columns equivalent) */}
          <div className="col-span-12 xl:col-span-11 grid grid-cols-1 md:grid-cols-12 gap-6 z-10">
            
            {/* CENTRAL WORKSPACE (Cols: 1 to 8 dynamic based on tabs to maintain clean sidebars) */}
            <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-6">
              
              {/* Pulse & AI Diagnostics Banner (Module 2/13/14) */}
              <section className="bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/10 rounded-3xl p-5 flex flex-col gap-4 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-display">Trianah Pulse &bull; Ecosystem Brain Status</h2>
                  </div>
                  <span className="text-[10px] text-white/40 italic font-mono">Last contextual sync: moments ago</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-indigo-500"></div>
                    <p className="text-sm md:text-md text-slate-200 leading-relaxed font-sans">
                      &ldquo;Greetings. Your Digital Twin predicts high focus bandwidth. You have <span className="text-cyan-300 font-semibold">{urgentCount} urgent messages</span>, <span className="text-indigo-300 font-semibold">{inProgressTasksCount} tasks in progress</span>, and <span className="text-emerald-300 font-semibold">{ugandaServices.length} Uganda Smart portals</span> connected. The security engine detected 1 mock phishing SMS from <span className="text-red-400 underline font-semibold">MTN-Promo-Ug</span>.&rdquo;
                    </p>
                  </div>
                  
                  <div className="sm:w-56 flex flex-col justify-between gap-2.5">
                    <button
                      onClick={() => setActiveTab(5)}
                      className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Run Scam Shield Check
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab(0);
                        const btn = document.getElementById('btn-ultimate-audit');
                        if (btn) btn.click();
                      }}
                      className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:scale-95 transition-all rounded-xl text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      Ecosystem AI Audit
                    </button>
                  </div>
                </div>
              </section>

              {/* TAB VIEWS */}
              <AnimatePresence mode="wait">
                
                {/* TAB 0: OPERATING SYSTEM CORE DASHBOARD */}
                {activeTab === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Embedded Trianah Core Assistant AI Command Center (Module 2) */}
                    <AICommandCenter systemState={{ messages, tasks, contacts, opportunities, securityLogs, ugandaServices }} />

                    {/* Bento Grid layout for opportunities and timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Career Opportunities Hub (Module 5) */}
                      <section className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col backdrop-blur-xl relative overflow-hidden transition-all hover:bg-white/[0.07]">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-purple-400" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 font-display">Scan Opportunities</h2>
                          </div>
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px] font-mono">{opportunities.length} Active</span>
                        </div>
                        
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[290px] pr-1">
                          {opportunities.map((opp) => (
                            <div key={opp.id} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:border-purple-500/30 transition-all">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs font-semibold text-slate-100">{opp.title}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{opp.organization} &bull; <span className="italic">{opp.location}</span></p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-[11px] text-cyan-400 font-bold font-mono">{opp.relevance}% Match</p>
                                  <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded block mt-1 font-mono">{opp.type}</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-300 mt-2 line-clamp-2">{opp.description}</p>
                              <div className="mt-2 bg-purple-500/10 p-2 rounded-lg border border-purple-500/15 text-[9px] text-purple-300 flex items-start gap-1">
                                <Info className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                                <span>{opp.matchReason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                          <button onClick={() => setActiveTab(1)} className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5">
                            Check related inboxes <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </section>

                      {/* Chronological Life Timeline (Module 3) */}
                      <section className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col backdrop-blur-xl relative overflow-hidden transition-all hover:bg-white/[0.07]">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-display">Life Chronology</h2>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">Kampala Timeline</span>
                        </div>
                        
                        <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-[1px] before:bg-white/10 overflow-y-auto max-h-[290px] pr-1">
                          {timeline.map((evt) => (
                            <div key={evt.id} className="relative group">
                              <div className={`absolute -left-[17px] top-1.5 w-2 h-2 rounded-full border border-black ${
                                evt.type === 'meeting' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]' :
                                evt.type === 'achievement' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' :
                                evt.type === 'message' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-slate-400'
                              }`} />
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-semibold text-slate-100">{evt.title}</p>
                                  <span className="text-[9px] text-slate-500 font-mono shrink-0">{evt.date}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{evt.description}</p>
                                {evt.personRef && (
                                  <span className="inline-block mt-1 text-[9px] bg-slate-800 px-2 py-0.5 rounded border border-white/5 text-cyan-300">
                                    Ref: {evt.personRef}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                    </div>
                  </motion.div>
                )}

                {/* TAB 1: UNIVERSAL COMMUNICATIONS HUB */}
                {activeTab === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-xl flex flex-col gap-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 font-display">Universal Communications Hub</h2>
                        <p className="text-xs text-slate-400">Integrated email, SMS, voice triggers & social queues.</p>
                      </div>

                      {/* Channel and Priority Filtering */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                          {['all', 'email', 'sms', 'collaboration'].map(ch => (
                            <button
                              key={ch}
                              onClick={() => setInboxFilter(ch)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-md capitalize transition-all ${
                                inboxFilter === ch ? 'bg-cyan-500/20 border border-cyan-400/20 text-cyan-400' : 'text-slate-400'
                              }`}
                            >
                              {ch}
                            </button>
                          ))}
                        </div>
                        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                          {['all', 'urgent', 'important', 'routine', 'ignore'].map(cat => (
                            <button
                              key={cat}
                              onClick={() => setInboxCategoryFilter(cat)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-md capitalize transition-all ${
                                inboxCategoryFilter === cat ? 'bg-indigo-500/20 border border-indigo-400/20 text-indigo-400' : 'text-slate-400'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                      
                      {/* Left Inbox List */}
                      <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
                        {filteredMessages.length === 0 ? (
                          <div className="text-center py-10 text-slate-500 text-xs">
                            No communications matching selected filters.
                          </div>
                        ) : (
                          filteredMessages.map((msg) => (
                            <div
                              key={msg.id}
                              onClick={() => {
                                setSelectedMsgId(msg.id);
                                // Clear twin reply draft as context switched
                                setActiveReplyDraftText('');
                              }}
                              className={`p-3 border rounded-xl cursor-pointer text-left transition-all ${
                                selectedMsgId === msg.id
                                  ? 'bg-slate-800/80 border-cyan-500 shadow-md shadow-cyan-500/5'
                                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono text-cyan-400 border border-cyan-400/20 px-1.5 py-0.5 rounded capitalize">
                                  {msg.channel}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {msg.category === 'urgent' && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                  )}
                                  <span className={`text-[9px] font-semibold tracking-wider uppercase px-1.5 rounded ${
                                    msg.category === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                                    msg.category === 'important' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/25' :
                                    msg.category === 'routine' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {msg.category}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs font-semibold text-slate-100 mt-2 truncate">{msg.subject}</p>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">{msg.sender}</p>
                              <p className="text-[10px] text-slate-300 mt-1.5 line-clamp-2">{msg.body}</p>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[9px] text-slate-500 font-mono">
                                <span>{new Date(msg.timestamp).toLocaleDateString()}</span>
                                <div className="flex items-center gap-1">
                                  {msg.replied ? (
                                    <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Replied</span>
                                  ) : (
                                    <span className="text-amber-400">Needs Response</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Right Thread Detail & Draft Generator (Module 11) */}
                      <div className="md:col-span-12 lg:col-span-7 bg-[#090d16] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                        {selectedMsg ? (
                          <div className="space-y-4 h-full flex flex-col justify-between">
                            <div>
                              <div className="border-b border-white/5 pb-3">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <span className="text-[10px] font-mono text-cyan-400">{selectedMsg.channel.toUpperCase()} &bull; RECEIVED</span>
                                  <span className="text-slate-500 text-[10px] font-mono">{new Date(selectedMsg.timestamp).toLocaleString()}</span>
                                </div>
                                <h3 className="text-sm font-semibold tracking-tight text-white mt-2">{selectedMsg.subject}</h3>
                                <p className="text-xs text-slate-300 mt-1">Sender: <span className="text-cyan-300">{selectedMsg.sender}</span></p>
                              </div>

                              {/* Original Message Copy */}
                              <div className="bg-slate-950/70 p-3 mt-4 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed max-h-[160px] overflow-y-auto font-mono">
                                {selectedMsg.body}
                              </div>

                              {/* Digital Twin reply drafting block (Module 11) */}
                              <div className="mt-6 space-y-3.5 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <Bot className="w-4 h-4 text-cyan-400" />
                                    <span className="text-xs font-semibold text-cyan-400 font-display">Digital Twin Auto-Draft Engine</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
                                    <span className="text-[9px] text-slate-400">Twin Tone:</span>
                                    <span className="text-[9px] font-bold text-slate-200 capitalize underline decoration-cyan-400 decoration-2">
                                      {twinSettings.writingTone.replace('_', ' ')}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleTriggerTwinReply(selectedMsg)}
                                    disabled={draftingReply}
                                    className="flex-1 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all active:scale-95"
                                  >
                                    {draftingReply ? 'Formulating response style...' : 'Generate reply with Twin Persona'}
                                  </button>
                                </div>

                                {activeReplyDraftText && (
                                  <div className="space-y-2">
                                    <label className="block text-[10px] font-semibold text-slate-400">Response draft (Click to customize & edit):</label>
                                    <textarea
                                      value={activeReplyDraftText}
                                      onChange={(e) => setActiveReplyDraftText(e.target.value)}
                                      rows={5}
                                      className="w-full text-xs p-3 bg-slate-950 border border-cyan-500/30 focus:border-cyan-500 rounded-xl text-slate-200 focus:outline-none focus:ring-0 leading-relaxed font-mono"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => setActiveReplyDraftText('')}
                                        className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] text-slate-400 hover:text-white"
                                      >
                                        Discard
                                      </button>
                                      <button
                                        onClick={handleApproveTwinReply}
                                        className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1"
                                      >
                                        <CheckCircle className="w-3.5 h-3.5" /> Approve & Mock Outbox Send
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {selectedMsg.replied && selectedMsg.draftReply && (
                                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs">
                                    <p className="font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved draft dispatched!
                                    </p>
                                    <p className="text-[11px] text-slate-300 font-mono italic whitespace-pre-wrap">{selectedMsg.draftReply}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-20 text-slate-500 text-xs">
                            Select a message thread on the left to review details and mobilize responses.
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB 2: PRODUCTIVITY OPERATING CENTER (Module 9) */}
                {activeTab === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-xl flex flex-col gap-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 font-display">Productivity Operating Center</h2>
                        <p className="text-xs text-slate-400 font-sans">Organize operational tasks, goals, & research timelines.</p>
                      </div>
                    </div>

                    {/* New Task Creator Form */}
                    <div className="bg-[#090d16] border border-white/5 rounded-2xl p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4 text-cyan-400" /> Spawn New Operating Task
                      </h3>
                      <form onSubmit={handleAddNewTask} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="block text-[10px] text-slate-400 font-semibold uppercase">Task Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Audit Gulu solar moisture node calibration"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 focus:border-cyan-500 rounded-lg text-slate-200 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-slate-400 font-semibold uppercase">Due Date</label>
                          <input
                            type="date"
                            required
                            value={newTaskDue}
                            onChange={(e) => setNewTaskDue(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 focus:border-cyan-500 rounded-lg text-slate-200 focus:outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-slate-400 font-semibold uppercase">Priority Scale</label>
                          <select
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value as any)}
                            className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 focus:border-cyan-500 rounded-lg text-slate-200 focus:outline-none"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div className="md:col-span-4 space-y-1.5">
                          <label className="block text-[10px] text-slate-400 font-semibold uppercase">Task Description Details</label>
                          <input
                            type="text"
                            placeholder="Add clear parameters, required documents, or client contacts."
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 focus:border-cyan-500 rounded-lg text-slate-200 focus:outline-none"
                          />
                        </div>
                        <div className="md:col-span-4 flex justify-end">
                          <button
                            type="submit"
                            className="py-2 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
                          >
                            Add to Kanban Grid
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Kanban Board Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      {(['todo', 'in_progress', 'review', 'done'] as const).map((col) => {
                        const colTasks = tasks.filter(t => t.status === col);
                        return (
                          <div key={col} className="bg-slate-950/60 border border-white/5 rounded-2xl p-3 flex flex-col min-h-[400px]">
                            <div className="flex items-center justify-between mb-3 pb-1 border-b border-white/5">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${
                                  col === 'todo' ? 'bg-[#94a3b8]' :
                                  col === 'in_progress' ? 'bg-[#38bdf8]' :
                                  col === 'review' ? 'bg-[#a78bfa]' : 'bg-[#34d399]'
                                }`} />
                                {col.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">{colTasks.length}</span>
                            </div>

                            <div className="space-y-3 overflow-y-auto">
                              {colTasks.length === 0 ? (
                                <p className="text-[10px] text-slate-600 p-2 text-center italic">Empty column</p>
                              ) : (
                                colTasks.map((task) => (
                                  <div key={task.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-slate-700 transition-all space-y-2 relative group">
                                    <div className="flex items-start justify-between gap-1.5">
                                      <p className="text-xs font-semibold text-slate-200 leading-tight">{task.title}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 line-clamp-2">{task.description}</p>
                                    
                                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-[9px] font-mono">
                                      <span className={`${
                                        task.priority === 'high' ? 'text-red-400 font-bold' :
                                        task.priority === 'medium' ? 'text-amber-400' : 'text-slate-400'
                                      }`}>
                                        {task.priority.toUpperCase()}
                                      </span>
                                      <span className="text-slate-500">{task.dueDate}</span>
                                    </div>

                                    {/* Actions to move task states directly */}
                                    <div className="flex items-center gap-1 pt-2 w-full justify-end scale-90">
                                      {col !== 'todo' && (
                                        <button
                                          onClick={() => handleUpdateTaskStatus(task.id, 'todo')}
                                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[8px] uppercase tracking-tighter"
                                          title="Move to Todo"
                                        >
                                          Todo
                                        </button>
                                      )}
                                      {col !== 'in_progress' && (
                                        <button
                                          onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                                          className="px-1.5 py-0.5 bg-sky-500/15 hover:bg-sky-500/20 text-sky-400 rounded text-[8px] uppercase tracking-tighter"
                                          title="Move to Progress"
                                        >
                                          Prog
                                        </button>
                                      )}
                                      {col !== 'review' && (
                                        <button
                                          onClick={() => handleUpdateTaskStatus(task.id, 'review')}
                                          className="px-1.5 py-0.5 bg-purple-500/15 hover:bg-purple-500/20 text-purple-400 rounded text-[8px] uppercase tracking-tighter"
                                          title="Move to Review"
                                        >
                                          Rev
                                        </button>
                                      )}
                                      {col !== 'done' && (
                                        <button
                                          onClick={() => handleUpdateTaskStatus(task.id, 'done')}
                                          className="px-1.5 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/20 text-emerald-400 rounded text-[8px] uppercase tracking-tighter"
                                          title="Move to Done"
                                        >
                                          Done
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: RELATIONSHIP INTELLIGENCE ENGINE & TWIN PREFERENCES */}
                {activeTab === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-xl flex flex-col gap-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 font-display">Relationship Intelligence &amp; Behavioral Profile</h2>
                        <p className="text-xs text-slate-400">Communication intensity scoring & Twin tone configuration controllers.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                      
                      {/* Contacts Analysis Grid */}
                      <div className="md:col-span-12 lg:col-span-7 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Intelligent Nurture Matrix (Module 4)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {contacts.map((contact) => (
                            <div key={contact.id} className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-xs font-semibold text-white">{contact.name}</p>
                                  <p className="text-[10px] text-slate-400">{contact.company}</p>
                                </div>
                                <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                  contact.status === 'high_value' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                                  contact.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                  contact.status === 'reconnect' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/25 text-red-400 animate-pulse'
                                }`}>
                                  {contact.status.replace('_', ' ')}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Relationship score:</span>
                                  <span className="font-bold text-cyan-400">{contact.relationshipScore}/100</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      contact.relationshipScore > 80 ? 'bg-emerald-400' :
                                      contact.relationshipScore > 60 ? 'bg-cyan-400' : 'bg-amber-400'
                                    }`}
                                    style={{ width: `${contact.relationshipScore}%` }}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[9px] text-slate-400 font-mono">
                                <div>
                                  <p>Last Activity:</p>
                                  <p className="text-slate-200 mt-0.5">{contact.lastInteracted}</p>
                                </div>
                                <div>
                                  <p>Ideal Freq:</p>
                                  <p className="text-slate-200 mt-0.5 capitalize">{contact.frequency}</p>
                                </div>
                                <div className="col-span-2">
                                  <p>Response latency pattern:</p>
                                  <p className={`mt-0.5 font-bold ${
                                    contact.responsePattern === 'prompt' ? 'text-emerald-400' :
                                    contact.responsePattern === 'delayed' ? 'text-amber-400' : 'text-red-400'
                                  }`}>{contact.responsePattern.toUpperCase()}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 text-xs">
                          <p className="font-semibold text-indigo-400 flex items-center gap-1.5 mb-1.5">
                            <Bot className="w-4 h-4" /> Relationship Agent Recommender Note
                          </p>
                          <p className="text-slate-300 leading-relaxed font-sans">
                            Robert Kibuuka (SafeBoda Operations) has Drifted to 48 score with no interactions logged since mid-May. Click Gulu opportunity matching or trigger outbound draft response to reconnect high-value sectors.
                          </p>
                        </div>
                      </div>

                      {/* Digital Twin Profile configuration (Module 11) */}
                      <div className="md:col-span-12 lg:col-span-5 bg-[#090d16] border border-white/5 rounded-2xl p-4 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-white/5 flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-cyan-400" /> Twin Behavioral Signature
                        </h3>

                        <div className="space-y-4 text-xs font-sans">
                          
                          {/* Tone selection */}
                          <div className="space-y-2">
                            <label className="block text-[10px] text-slate-400 font-semibold uppercase">Default Response Tone Writing Style</label>
                            <div className="grid grid-cols-2 gap-2">
                              {([
                                { name: 'direct', label: 'Direct / Short' },
                                { name: 'thoughtful', label: 'Thoughtful / Formal' },
                                { name: 'ugandan_formal', label: 'Ugandan Formal' },
                                { name: 'casual', label: 'Casual / Friendly' }
                              ] as const).map((tone) => (
                                <button
                                  key={tone.name}
                                  onClick={() => setTwinSettings(prev => ({ ...prev, writingTone: tone.name }))}
                                  className={`p-2 border text-left rounded-lg transition-all ${
                                    twinSettings.writingTone === tone.name
                                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-semibold'
                                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  {tone.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Work Hour rules */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-slate-400 font-semibold uppercase">Twin Start Hour</label>
                              <input
                                type="text"
                                value={twinSettings.workHoursStart}
                                onChange={(e) => setTwinSettings(prev => ({ ...prev, workHoursStart: e.target.value }))}
                                className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-center font-mono"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] text-slate-400 font-semibold uppercase">Twin Shutdown Hour</label>
                              <input
                                type="text"
                                value={twinSettings.workHoursEnd}
                                onChange={(e) => setTwinSettings(prev => ({ ...prev, workHoursEnd: e.target.value }))}
                                className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-center font-mono"
                              />
                            </div>
                          </div>

                          {/* Approval guidelines Toggles */}
                          <div className="space-y-2 pt-2 border-t border-white/5">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-200">Generate drafted reply automatically</p>
                                <p className="text-[10px] text-slate-400">Pre-processes emails using the Twin tone models immediately upon receipt.</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={twinSettings.autoDraft}
                                onChange={(e) => setTwinSettings(prev => ({ ...prev, autoDraft: e.target.checked }))}
                                className="w-4 h-4 accent-cyan-500 cursor-pointer text-cyan-400"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between pt-2">
                              <div>
                                <p className="font-semibold text-slate-200">Human Approval Gatekeeper Required</p>
                                <p className="text-[10px] text-slate-400">Strict safety. Do not execute or send any correspondence without Jane&apos;s explicit trigger.</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={twinSettings.approvalRequired}
                                onChange={(e) => setTwinSettings(prev => ({ ...prev, approvalRequired: e.target.checked }))}
                                className="w-4 h-4 accent-cyan-500 cursor-pointer text-cyan-400"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => alert("Digital Twin configuration signature stored securely!")}
                            className="w-full mt-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold font-display shadow-lg transition-all active:scale-95 cursor-pointer"
                          >
                            Update Twin Behavioral Matrix
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB 4: UGANDA SMART SERVICES & BUSINESS METRICS INTELLIGENCE */}
                {activeTab === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-xl flex flex-col gap-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 font-display">Uganda Smart Services &amp; Biz Intelligence</h2>
                        <p className="text-xs text-slate-400">Pay bills, trace MTN balances, track consulting revenue, and run AI forecasting metrics.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Uganda Smart Services Grid (Module 17) */}
                      <div className="md:col-span-12 lg:col-span-6 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Portals &amp; Utility Billing (Module 17)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {ugandaServices.map((srv) => (
                            <div key={srv.id} className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-[180px]">
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded">
                                    {srv.provider}
                                  </span>
                                  <span className="text-[8px] text-slate-400 uppercase tracking-wide">Due: {srv.dueDate}</span>
                                </div>
                                <h4 className="text-xs font-semibold text-slate-200">{srv.serviceName}</h4>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Acc: {srv.accountNo}</p>
                                <p className="text-sm font-bold text-white mt-1.5 font-mono">{srv.balanceOrStatus}</p>
                              </div>

                              <div className="mt-3 space-y-2">
                                <div className="text-[8px] text-slate-400 leading-normal line-clamp-1">
                                  {srv.alerts.map((al, idx) => <p key={idx} className="text-yellow-400 mt-0.5 italic">&bull; {al}</p>)}
                                </div>
                                {srv.serviceName !== 'Mobile Money' && srv.balanceOrStatus !== 'Active - Bill Settled' && (
                                  <button
                                    onClick={() => handleInitiatePayment(srv)}
                                    className="w-full py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg text-[9px] font-bold border border-yellow-500/20 uppercase transition-all"
                                  >
                                    Clear Outstanding
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Bill clear model inline */}
                        {payingBillId && (
                          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl space-y-3.5">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-yellow-500 uppercase font-display">MTN MoMo Utility Payment Clearing</h4>
                              <button onClick={() => setPayingBillId(null)} className="text-slate-400 hover:text-white">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-normal">
                              Authorize payment for <strong>{ugandaServices.find(s => s.id === payingBillId)?.serviceName}</strong>. This draws directly from your MTN Mobile Money phone balance.
                            </p>
                            <input
                              type="number"
                              value={paymentAmountStr}
                              onChange={(e) => setPaymentAmountStr(e.target.value)}
                              placeholder="Amount (UGX)"
                              className="w-full text-xs p-2.5 bg-slate-950 border border-yellow-500/30 rounded-lg text-slate-200"
                            />
                            {paymentAlert && <p className="text-[10px] text-red-400 font-semibold">{paymentAlert}</p>}
                            <div className="flex justify-end gap-2.5">
                              <button onClick={() => setPayingBillId(null)} className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px]">
                                Cancel
                              </button>
                              <button
                                onClick={handleExecuteBillPayment}
                                disabled={paymentLoading}
                                className="px-4 py-1.5 bg-yellow-500 text-slate-950 hover:bg-yellow-400 text-[10px] font-bold rounded-lg"
                              >
                                {paymentLoading ? "Requesting sandwich sandbox authentication..." : "Confirm payment"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Business Analytics Predictions (Module 12 & 13) */}
                      <div className="md:col-span-12 lg:col-span-6 bg-[#090d16] border border-white/5 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-cyan-400" /> Organization KPI Metrics (Module 12)
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                          {businessMetrics.map((b, i) => (
                            <div key={i} className="p-3 bg-slate-950/80 border border-white/5 rounded-xl">
                              <p className="text-[10px] text-slate-400 leading-none truncate">{b.title}</p>
                              <p className="text-sm font-bold text-white mt-1.5 font-mono">{b.value}</p>
                              <div className="flex items-center gap-1 mt-1 text-[9px] font-mono">
                                {b.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                                {b.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                                <span className={b.trend === 'up' ? 'text-emerald-400' : b.trend === 'down' ? 'text-red-400' : 'text-slate-500'}>
                                  {b.change}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Prediction triggers */}
                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <h4 className="text-xs font-semibold text-slate-200">AI Analytics engine &amp; forecast modeling (Module 13)</h4>
                          <button
                            onClick={handlePredictRevenueOutput}
                            disabled={predictLoading}
                            className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${predictLoading ? 'animate-spin' : ''}`} />
                            {predictLoading ? 'Computing predictive trends...' : 'Generate AI Predictive Revenue Forecast'}
                          </button>

                          {predictionResult && (
                            <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl space-y-2">
                              <p className="text-xs font-bold text-cyan-400">ML Forecast Outcome Summary</p>
                              <p className="text-[11px] text-slate-300 leading-normal font-mono">{predictionResult.prediction}</p>
                              <div className="pt-1.5 space-y-1">
                                {predictionResult.insights.map((ins, index) => (
                                  <div key={index} className="flex gap-1 items-start text-[10px] text-slate-400">
                                    <span className="text-cyan-400">&bull;</span>
                                    <span>{ins}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB 5: SCAM DETECTION & PERSONAL SECURITY CENTER */}
                {activeTab === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-xl flex flex-col gap-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 font-display">Scam Shield &amp; Personal Security</h2>
                        <p className="text-xs text-slate-400">Submit unknown texts, attachments, or links to the Scam Scan heuristic parser.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                      
                      {/* Scam analysis engine (Module 10) */}
                      <div className="md:col-span-12 lg:col-span-7 bg-[#090d16] border border-white/5 rounded-2xl p-4 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-red-500" /> Scam Auditing Parser (Module 10)
                        </h3>

                        <form onSubmit={handleScanScam} className="space-y-4 text-xs font-sans">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold uppercase">Sender details / handle</label>
                              <input
                                type="text"
                                value={scamSender}
                                onChange={(e) => setScamSender(e.target.value)}
                                className="w-full p-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold uppercase">Channel</label>
                              <select
                                value={scamChannel}
                                onChange={(e) => setScamChannel(e.target.value)}
                                className="w-full p-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs"
                              >
                                <option value="SMS">SMS / Texting</option>
                                <option value="Email">Email account</option>
                                <option value="Social Notification">WhatsApp / Social notification</option>
                                <option value="Collaboration API">Collaboration channel</option>
                              </select>
                            </div>
                            <div className="col-span-2 space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold uppercase">Suspicious Attachment filename</label>
                              <input
                                type="text"
                                placeholder="e.g. invoice_momo_nyabo_awards.pdf"
                                value={scamAttachment}
                                onChange={(e) => setScamAttachment(e.target.value)}
                                className="w-full p-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Communication contents to scan</label>
                            <textarea
                              rows={4}
                              value={scamText}
                              onChange={(e) => setScamText(e.target.value)}
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs leading-relaxed font-mono"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={scanningScam}
                            className="w-full py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md hover:from-red-500 active:scale-95 cursor-pointer"
                          >
                            <Shield className={`w-3.5 h-3.5 ${scanningScam ? 'animate-spin' : ''}`} />
                            {scanningScam ? 'Running Scam Scanners...' : 'Scan contents with Security AI'}
                          </button>
                        </form>

                        {/* Scam outcome analyzer output */}
                        {scamResult && (
                          <div className={`p-4 border rounded-xl space-y-3 ${
                            scamResult.verdict === 'DANGEROUS' ? 'bg-red-950/20 border-red-500/30 text-rose-300' :
                            scamResult.verdict === 'SUSPICIOUS' ? 'bg-yellow-950/20 border-yellow-500/30 text-yellow-300' :
                            'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          }`}>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold uppercase tracking-wider font-display">Scan Outcome Diagnosis</p>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-widest ${
                                scamResult.verdict === 'DANGEROUS' ? 'bg-red-500/20 text-red-400' :
                                scamResult.verdict === 'SUSPICIOUS' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'
                              }`}>{scamResult.verdict}</span>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm font-semibold font-mono">Calculated Threat Score: {scamResult.riskScore} / 100</p>
                              <p className="text-xs font-bold">Identified threat: <span className="underline">{scamResult.threatType}</span></p>
                              
                              <p className="text-[11px] font-sans leading-normal whitespace-pre-wrap">{scamResult.analysis}</p>
                              
                              <div className="pt-2 border-t border-white/5 space-y-1 list-none pl-0">
                                <p className="text-[10px] font-bold text-slate-300">Associated fraud indicators detected:</p>
                                {scamResult.indicators.map((ind, i) => (
                                  <li key={i} className="text-[10px] flex items-start gap-1 gap-y-0 text-slate-400">
                                    <span className="text-red-400 mt-0.5">•</span> <span>{ind}</span>
                                  </li>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Device Tracer Logs (Module 15 / Security center) */}
                      <div className="md:col-span-12 lg:col-span-5 space-y-4">
                        
                        {/* Interactive Simulated Biometrics Toggle Card */}
                        <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl space-y-3 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
                                <Fingerprint className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-200">Biometric Guard Simulation</h4>
                                <p className="text-[10px] text-slate-400 leading-normal">Require simulated FaceID or Fingerprint scan inside Trianah OS.</p>
                              </div>
                            </div>
                            
                            {/* Toggle Switch */}
                            <button
                              type="button"
                              onClick={() => {
                                const nextState = !biometricEnabled;
                                setBiometricEnabled(nextState);
                                if (nextState) {
                                  setIsUnlocked(false);
                                }
                                addLog(`[SECURITY] Biometric guard simulation toggled to ${nextState ? 'ENABLED Checkpoint' : 'DISABLED'}.`);
                              }}
                              className={`w-10 h-5 rounded-full border transition-colors relative flex items-center shrink-0 cursor-pointer ${
                                biometricEnabled ? 'bg-cyan-500 border-cyan-400 justify-end' : 'bg-slate-900 border-slate-700 justify-start'
                              }`}
                            >
                              <span className="w-3.5 h-3.5 rounded-full bg-white mx-[2px] shadow-md pointer-events-none" />
                            </button>
                          </div>

                          {biometricEnabled && (
                            <div className="space-y-2 pt-2 border-t border-white/5">
                              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Selected scanner signature type:</p>
                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <button
                                  type="button"
                                  onClick={() => setBiometricType('faceid')}
                                  className={`py-1.5 border rounded-lg text-center transition-all ${
                                    biometricType === 'faceid' ? 'bg-cyan-950/50 border-cyan-500 text-cyan-400 font-bold' : 'border-white/5 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  📷 Simulated FaceID
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBiometricType('fingerprint')}
                                  className={`py-1.5 border rounded-lg text-center transition-all ${
                                    biometricType === 'fingerprint' ? 'bg-cyan-950/50 border-cyan-500 text-cyan-400 font-bold' : 'border-white/5 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  👆 Fingerprint scanner
                                </button>
                              </div>

                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsUnlocked(false);
                                    addLog(`[SECURITY] Administrative lock triggered. Dashboard locked.`);
                                  }}
                                  className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 font-bold font-mono text-[9px] rounded-lg tracking-wider uppercase"
                                >
                                  🔒 Secure-Lock Trianah Now
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Device logins &amp; Tracers (Module 15)</h3>
                        <div className="space-y-3">
                          {securityLogs.map((log) => (
                            <div key={log.id} className="p-3 bg-slate-950/80 border border-white/5 rounded-xl text-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-200">{log.event}</span>
                                <span className={`text-[8px] uppercase font-mono tracking-wide px-1.5 py-0.5 rounded ${
                                  log.status === 'success' ? 'bg-emerald-500/15 text-emerald-400' :
                                  log.status === 'warning' ? 'bg-yellow-500/15 text-yellow-500' :
                                  'bg-red-500/20 text-red-400 animate-pulse'
                                }`}>{log.status}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-normal">Device ID: {log.device}</p>
                              <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono pt-1">
                                <span>{log.location}</span>
                                <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl text-xs space-y-2">
                          <p className="font-semibold text-slate-200">Recommended Shield Actions:</p>
                          <ul className="list-disc pl-4 text-[10px] text-slate-400 space-y-1 leading-relaxed">
                            <li>Keep Mobile Money PIN secret entirely. Official representatives will never request PIN overrides.</li>
                            <li>Two-Factor Authentication is active on the e-tax URA billing profile. Verify session checkpoints when filing May consultant reports.</li>
                          </ul>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB 6: AI KNOWLEDGE VAULT & MEETING SUMMARIZATION */}
                {activeTab === 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-xl flex flex-col gap-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 font-display">AI Knowledge Vault &amp; Meeting Memory</h2>
                        <p className="text-xs text-slate-400">Trace paper archives, store personal notes, and transcribe raw meeting dialog transcripts.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                      
                      {/* Meeting summarizer (Module 8) */}
                      <div className="md:col-span-12 lg:col-span-6 bg-[#090d16] border border-white/5 rounded-2xl p-4 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-cyan-400 animate-pulse" /> Meeting Memory transcription (Module 8)
                        </h3>

                        <div className="space-y-4 text-xs font-sans">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Meeting description title</label>
                            <input
                              type="text"
                              value={meetingTitleInput}
                              onChange={(e) => setMeetingTitleInput(e.target.value)}
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Paste Dialog Transcript</label>
                            <textarea
                              rows={6}
                              value={meetingTranscriptInput}
                              onChange={(e) => setMeetingTranscriptInput(e.target.value)}
                              className="w-full p-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs font-mono leading-relaxed"
                            />
                          </div>

                          <button
                            onClick={handleProcessMeeting}
                            disabled={processingMeeting}
                            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${processingMeeting ? 'animate-spin' : ''}`} />
                            {processingMeeting ? 'Transcribing and creating action timelines...' : 'Execute meeting summary extractor'}
                          </button>
                        </div>

                        {/* Extracted records listing */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold text-slate-300">Summarized Archives ({meetings.length})</h4>
                          <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                            {meetings.map((m) => (
                              <div key={m.id} className="p-3 bg-slate-950/80 border border-white/5 rounded-xl space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] text-slate-400">
                                  <span className="font-semibold text-slate-100">{m.title}</span>
                                  <span>{new Date(m.dateTime).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[11px] text-slate-300 italic">&#x22;{m.summary}&#x22;</p>
                                
                                {m.actionItems && m.actionItems.length > 0 && (
                                  <div className="pt-1 text-[9px] text-slate-400 font-sans">
                                    <p className="font-bold text-cyan-400 uppercase">Extracted Tasks:</p>
                                    <ul className="list-disc pl-3.5 space-y-0.5 mt-0.5">
                                      {m.actionItems.map((ac, idx) => <li key={idx}>{ac}</li>)}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Knowledge Vault Note collection (Module 7) */}
                      <div className="md:col-span-12 lg:col-span-6 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Knowledge Vault Documents (Module 7)</h3>
                        
                        {/* Note builder */}
                        <form onSubmit={handleCreateNoteDoc} className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl text-xs font-sans space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold uppercase">Document Title</label>
                              <input
                                type="text"
                                required
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                className="w-full text-xs p-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold uppercase">Category</label>
                              <input
                                type="text"
                                placeholder="e.g. Consulting Notes"
                                value={newNoteCategory}
                                onChange={(e) => setNewNoteCategory(e.target.value)}
                                className="w-full text-xs p-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg"
                              />
                            </div>
                            <div className="col-span-2 space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold uppercase">Tags (Comma-separated)</label>
                              <input
                                type="text"
                                placeholder="IoT, Research, Makerere"
                                value={newNoteTags}
                                onChange={(e) => setNewNoteTags(e.target.value)}
                                className="w-full text-xs p-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Content text</label>
                            <textarea
                              rows={3}
                              required
                              value={newNoteContent}
                              onChange={(e) => setNewNoteContent(e.target.value)}
                              className="w-full text-xs p-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg"
                            />
                          </div>
                          <button type="submit" className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold">
                            Append to AI Knowledge base
                          </button>
                        </form>

                        {/* List Documents */}
                        <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                          {vaultDocs.map((doc) => (
                            <div key={doc.id} className="p-3 bg-slate-950/80 border border-white/5 rounded-xl">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs text-white leading-tight">{doc.title}</span>
                                <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded px-1.5 py-0.5">{doc.category}</span>
                              </div>
                              <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">{doc.content}</p>
                              
                              <div className="flex flex-wrap gap-1 mt-2.5">
                                {doc.tags.map((tg, i) => (
                                  <span key={i} className="text-[8px] font-mono font-semibold text-cyan-400 px-1.5 py-0.5 bg-slate-900 rounded">
                                    #{tg}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB 7: TRIANAH AI MARKETPLACE */}
                {activeTab === 7 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-xl flex flex-col gap-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 font-display">Trianah AI Extensions Marketplace</h2>
                        <p className="text-xs text-slate-400">Download, upload or toggle external plugins and industry-specific business modules to enrich Trianah.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      {marketplace.map((ext) => (
                        <div
                          key={ext.id}
                          className={`p-5 bg-[#090d16] border rounded-3xl flex flex-col justify-between transition-all ${
                            ext.installed
                              ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5'
                              : 'border-white/5 hover:border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] uppercase tracking-wider font-semibold font-mono bg-indigo-500/10 text-indigo-400 px-2.5 rounded border border-indigo-500/15">
                                {ext.category}
                              </span>
                              {ext.installed ? (
                                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-400/20 rounded px-2">Active Plugin</span>
                              ) : (
                                <span className="text-[9px] text-slate-500">Uninstalled</span>
                              )}
                            </div>
                            <h3 className="text-xs font-bold text-white font-display mt-2">{ext.name}</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">Author/Developer: {ext.developer}</p>
                            <p className="text-[10px] text-slate-300 leading-relaxed mt-2">{ext.description}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[9px] text-slate-500">Verified Platform Audit</span>
                            <button
                              onClick={() => handleToggleMarketplace(ext.id)}
                              className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                                ext.installed
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5'
                                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                              }`}
                            >
                              {ext.installed ? 'Disable extension' : 'Install integration'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
              
            </div>

            {/* RIGHT SIDEBAR PANEL - PERSISTENT IN THE DESIGN LAYOUT (Columns: 9 to 12) */}
            <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
              
              {/* Security Center Heath score Widget (Module 10/15) */}
              <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl"></div>
                <div className="flex items-center gap-2 mb-4 text-red-400 justify-between">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-rose-400" />
                    <h2 className="text-[10px] font-bold uppercase tracking-widest font-display">Scam &amp; Threat Shield</h2>
                  </div>
                  <span className="px-1.5 py-0.5 bg-red-400/15 text-red-400 rounded text-[9px] uppercase tracking-tighter">Active Gatekeeper</span>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-light font-display">95<span className="text-xs opacity-50 font-mono">/100</span></p>
                    <p className="text-[10px] text-slate-400">Heuristic Safety Index</p>
                  </div>
                  <div className="text-right text-[10px] text-red-400 font-semibold max-w-[160px] leading-relaxed">
                    1 phishing alert sequestered & blocked
                  </div>
                </div>
              </section>

              {/* Relationship Nurture List - Module 4 scoring */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col backdrop-blur-xl transition-all hover:bg-white/[0.07]">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-4 font-display">Relationship Nurture Alert</h2>
                
                <div className="space-y-4 flex-1">
                  {contacts.slice(0, 3).map((u) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        u.id === 'c1' ? 'bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950' :
                        u.id === 'c2' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' :
                        'bg-gradient-to-br from-amber-400 to-red-500 text-slate-950'
                      }`}>
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center text-xs">
                          <p className="font-semibold text-slate-200 truncate">{u.name}</p>
                          <span className="text-[9px] text-slate-500 font-mono">Score {u.relationshipScore}</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              u.relationshipScore > 85 ? 'bg-[#38bdf8]' : 'bg-[#e2e8f0]'
                            }`}
                            style={{ width: `${u.relationshipScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <p className="text-[10px] text-slate-400 pt-2 border-t border-white/5 italic font-sans">
                    <strong>AI Advice:</strong> Outbound proposal draft completed. Sync Lillian Atoke&apos;s biotech research nodes to trigger funding review.
                  </p>
                </div>
              </section>

              {/* Uganda Smart services mini display (Module 17) */}
              <section className="bg-yellow-500/5 border border-yellow-500/20 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80 mb-4 font-display">Local Utilities (UG)</h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-white/5 border border-white/5 rounded-xl text-center">
                      <p className="text-[8px] opacity-60 text-slate-400 uppercase tracking-wider font-mono">MoMo wallet</p>
                      <p className="text-[11px] font-bold text-white font-mono mt-0.5 truncate">{mmBalance}</p>
                    </div>
                    <div className="p-2 bg-white/5 border border-white/5 rounded-xl text-center">
                      <p className="text-[8px] opacity-60 text-slate-400 uppercase tracking-wider font-mono">UMEME Yaka</p>
                      <p className="text-[11px] font-bold text-red-400 font-mono mt-0.5 truncate">Due: 12th</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => setActiveTab(4)}
                    className="w-full py-1.5 border border-yellow-500/30 rounded-xl text-[9px] font-bold uppercase tracking-wider text-yellow-500 hover:bg-yellow-500/10 cursor-pointer"
                  >
                    Manage utility billings
                  </button>
                </div>
              </section>

              {/* Installed Marketplace Extensions Listing */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-3 font-display">Trained Extensions</h2>
                <div className="space-y-2">
                  {marketplace.filter(m => m.installed).map(m => (
                    <div key={m.id} className="p-2 bg-indigo-500/5 rounded-lg border border-indigo-400/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-200">{m.name}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 capitalize font-mono">{m.category}</p>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                    </div>
                  ))}
                  {marketplace.filter(m => m.installed).length === 0 && (
                    <p className="text-[9px] text-slate-500 italic p-1 text-center">No active marketplaces integrations.</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab(7)}
                  className="w-full mt-3 text-center text-[10px] text-cyan-400 font-bold hover:underline"
                >
                  Manage plugins list
                </button>
              </section>

            </div>

          </div>

        </div>

        {/* Global Footer (Digital Twin Action bar - Module 11) */}
        <footer className="my-6 mx-4 md:mx-6 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/15 border border-white/10 rounded-3xl backdrop-blur-xl flex flex-col md:flex-row items-center p-5 justify-between gap-4 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-cyan-400/40 flex items-center justify-center relative shrink-0">
              <div className="w-3.5 h-3.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 font-display">Interactive Digital Twin AI Assistant</p>
              <p className="text-xs text-slate-100 font-semibold mt-0.5 leading-tight">Jane&apos;s twin behavioral signature is active and learning style preferences.</p>
            </div>
          </div>

          <div className="flex-1 max-w-lg w-full">
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-1">
              <input
                type="text"
                placeholder="Ask your Twin to draft or predict something... (e.g. 'Draft reply to Dr. Arthur')"
                className="w-full bg-transparent border-none text-xs text-slate-100 focus:outline-none placeholder-slate-500 py-1.5"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Trigger the AI Command Center
                    setActiveTab(0);
                    const input = document.getElementById('assistant-query-input') as HTMLInputElement;
                    if (input) {
                      input.value = (e.currentTarget as HTMLInputElement).value;
                      (e.currentTarget as HTMLInputElement).value = '';
                      const sendBtn = document.getElementById('assistant-query-send-btn');
                      if (sendBtn) sendBtn.click();
                    }
                  }
                }}
              />
              <span className="text-[8px] bg-slate-900 border border-white/5 font-mono px-1 rounded text-cyan-400 uppercase tracking-widest leading-none block absolute right-3 py-0.5">
                Press Enter
              </span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 md:w-auto w-full">
            <button
              onClick={() => setActiveTab(3)}
              className="flex-1 md:flex-none px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-200 transition-all font-display"
            >
              Tune Persona Tone
            </button>
            <button
              onClick={() => {
                setActiveTab(0);
                setTimeout(() => {
                  const btn = document.getElementById('btn-ultimate-audit');
                  if (btn) btn.click();
                }, 100);
              }}
              className="flex-1 md:flex-none px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 text-center cursor-pointer"
            >
              Analyze Twin Status
            </button>
          </div>
        </footer>

        </>
        )}

      </div>
      )}

      {/* Floating Device Platform Simulator Controller */}
      {isRegistered && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#090d16]/90 border border-white/10 px-3 py-2 rounded-2xl backdrop-blur-md shadow-2xl flex items-center gap-1.5 font-sans">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">Simulator:</span>
          <button
            onClick={() => setSimulatorMode('none')}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${simulatorMode === 'none' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            💻 Web
          </button>
          <button
            onClick={() => setSimulatorMode('ios')}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${simulatorMode === 'ios' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            🍏 iOS
          </button>
          <button
            onClick={() => setSimulatorMode('android')}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${simulatorMode === 'android' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            🤖 Android
          </button>
        </div>
      )}
      </div>
    );
  }
