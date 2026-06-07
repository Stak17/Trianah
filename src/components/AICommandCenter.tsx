import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Sparkles, AlertCircle, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { TrianahMessage, TaskItem, RelationshipContact, CareerOpportunity, UgandaSmartService, SecurityLog } from '../types';

interface AICommandCenterProps {
  systemState: {
    messages: TrianahMessage[];
    tasks: TaskItem[];
    contacts: RelationshipContact[];
    opportunities: CareerOpportunity[];
    securityLogs: SecurityLog[];
    ugandaServices: UgandaSmartService[];
  };
}

export default function AICommandCenter({ systemState }: AICommandCenterProps) {
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'trianah'; text: string; isAi: boolean }>>([
    {
      sender: 'trianah',
      text: "### Welcome to Trianah Intelligence\n\nI am your unified Digital Life Assistant. I monitor your notifications, relationship analytics, business metrics, and Ugandan utilities in real time.\n\nTry running the **Full Ecosystem Audit** below to assess your current focal points, contacts, opportunities, and risk profiles.",
      isAi: true
    }
  ]);
  const [loading, setLoading] = useState(false);

  const triggerSearch = async (promptText: string) => {
    if (!promptText.trim()) return;
    setLoading(true);
    setChatLog(prev => [...prev, { sender: 'user', text: promptText, isAi: false }]);
    setQuery('');

    try {
      const res = await fetch('/api/trianah/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemState: systemState
        })
      });
      const data = await res.json();
      if (data.status === 'success' || data.status === 'error') {
        const txt = data.response || `Error: ${data.message}`;
        setChatLog(prev => [...prev, { sender: 'trianah', text: txt, isAi: true }]);
      } else {
        setChatLog(prev => [...prev, { sender: 'trianah', text: data.response || 'Unable to fetch response due to an invalid request format.', isAi: true }]);
      }
    } catch (err) {
      setChatLog(prev => [...prev, { sender: 'trianah', text: '### Connectivity Alert\n\nFailed to establish communication with the Trianah AI server. Please make sure the backend is active.', isAi: true }]);
    } finally {
      setLoading(false);
    }
  };

  const runUltimateQuery = () => {
    triggerSearch("What should I focus on today, who should I contact, what opportunities am I missing, and what risks should I address?");
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="ai-command-center">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/15 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-100 tracking-tight">Trianah Core Intelligence</h2>
            <p className="text-xs text-slate-400">One Intelligence. Unified Life Analyzer.</p>
          </div>
        </div>
        <button
          onClick={runUltimateQuery}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-xs font-semibold rounded-lg text-white shadow-md border border-indigo-400/20"
          id="btn-ultimate-audit"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Full System Audit
        </button>
      </div>

      {/* Quick suggest prompts */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-400 mb-2">Suggested Commands:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => triggerSearch("Summarize today's communications & show what needs response.")}
            className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-md text-xs text-slate-300 transition-colors"
          >
            Summarize Today’s Inboxes
          </button>
          <button
            onClick={() => triggerSearch("What meetings do I have and what are my urgent deadlines?")}
            className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-md text-xs text-slate-300 transition-colors"
          >
            Meetings & Deadlines
          </button>
          <button
            onClick={() => triggerSearch("Run audit on my Gulu Agro Biotech notes and contacts.")}
            className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-md text-xs text-slate-300 transition-colors"
          >
            Gulu Biotech Audit
          </button>
        </div>
      </div>

      {/* Chat scroll box */}
      <div className="h-80 overflow-y-auto mb-4 p-4 bg-[#090d16] border border-[#1e293b]/70 rounded-xl space-y-4">
        {chatLog.map((log, i) => (
          <div
            key={i}
            className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 text-sm leading-relaxed ${
                log.sender === 'user'
                  ? 'bg-indigo-600/95 text-white shadow-lg'
                  : 'bg-slate-900 border border-[#1e293b] text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 opacity-80 text-xs font-mono">
                {log.sender === 'user' ? (
                  <span>User Request</span>
                ) : (
                  <span className="flex items-center gap-1 text-indigo-400 font-semibold font-display">
                    <Sparkles className="w-3 h-3" /> TRIANAH
                  </span>
                )}
              </div>
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                {/* Inline basic markdown renderer inside text */}
                {log.text.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return <h4 key={idx} className="font-display font-bold text-slate-100 text-sm mt-3 mb-1">{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <div key={idx} className="font-bold text-slate-200 mt-2">{line.replaceAll('**', '')}</div>;
                  }
                  if (line.startsWith('* ')) {
                    return (
                      <div key={idx} className="flex gap-1.5 items-start pl-2 text-slate-300 my-0.5">
                        <span className="text-indigo-400 mt-1">•</span>
                        <span>{line.replace('* ', '')}</span>
                      </div>
                    );
                  }
                  return <p key={idx} className="mb-1 text-slate-300">{line}</p>;
                })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-[#1e293b] rounded-xl p-4 text-sm max-w-[85%]">
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-2">
                <Sparkles className="w-3 h-3 animate-spin" /> Querying digital ecosystem...
              </div>
              <div className="space-y-2">
                <div className="h-2 w-48 bg-slate-800 rounded animate-pulse" />
                <div className="h-2 w-64 bg-slate-800 rounded animate-pulse" />
                <div className="h-2 w-32 bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          triggerSearch(query);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Trianah anything ('Show urgent tasks', 'Are there mobile money issues?', etc.)"
          className="flex-1 px-4 py-3 bg-[#090d16] border border-[#1e293b] rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          id="assistant-query-input"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center border border-indigo-400/20 shadow-md"
          id="assistant-query-send-btn"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
