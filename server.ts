import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-get or lazy-init Gemini client to guarantee startup success with descriptive errors
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    throw new Error('MISSING_KEY');
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Core Q&A / Trianah Brain Assistant API
app.post('/api/trianah/ask', async (req, res) => {
  try {
    const { prompt, systemState } = req.body;
    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      if (err.message === 'MISSING_KEY') {
        return res.status(200).json({
          status: 'error',
          response: '### 🔑 Setup Required\n\nTo power the Trianah Intelligence engine, please configure your **GEMINI_API_KEY** in the Secrets panel.\n\nHere is a simulated response based on your current settings:\n\n* **Today’s Focus:** Compile Makerere proposal bio-summary & resolve NWSC central forecast.\n* **Key Contact:** Reconnect with Pamela Natukunda (URA Liaison) & reply to Lillian Atoke\'s bio-proposal.\n* **Opportunities:** Job for Agriscience Tech Lead Gulu (95% relevance) is missing a draft submission.\n* **Security Alerts:** SMS Scam from "MTN-Promo-Ug" attempts to capture your MoMo PIN; suspicious Moscow authentication blocked.'
        });
      }
      throw err;
    }

    const stateSummary = systemState ? `
CURRENT DIGITAL LIFE STATE FOR USER:
Messages/Inboxes: ${JSON.stringify(systemState.messages)}
Outstanding Tasks: ${JSON.stringify(systemState.tasks)}
Contacts/Relationships: ${JSON.stringify(systemState.contacts)}
Career/Grant Opportunities: ${JSON.stringify(systemState.opportunities)}
Knowledge Vault Papers: ${JSON.stringify(systemState.vaultDocs)}
Uganda Smart Services (Mobile Money balance, electricity, billing): ${JSON.stringify(systemState.ugandaServices)}
Security Log Events: ${JSON.stringify(systemState.securityLogs)}
Marketplace Extensions: ${JSON.stringify(systemState.marketplace)}
Twin Persona Configuration: ${JSON.stringify(systemState.twinSettings)}
` : 'No state attached.';

    const systemInstruction = `You are Trianah, the next-generation AI Digital Life Operating System.
You sit as an intelligent layer above the user's communications, relationships, goals, security, and local Ugandan smart services (covering MTN Mobile Money, NWSC water, UMEME water grids, and URA taxes).
Analyze given contexts with extreme analytical precision, high-quality structure, and absolute relevance.
Always keep responses highly scannable, design-focused, and direct. Use bullet points and bold key terms.
If the mock current time is relevant, it is June 2026.
Respond to the user's prompt using the appropriate, verified state facts. Be realistic, and do not invent unrelated contacts or services. Keep communication tone respectful and elegant.`;

    const promptText = `
User Query: "${prompt}"

Current Operating System context data:
${stateSummary}

Please process this request now:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      status: 'success',
      response: response.text || 'No response formulated.'
    });

  } catch (error: any) {
    console.error('Trianah ask error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Error occurred querying Trianah AI.' });
  }
});

// 2. Scam and Fraud Detector API
app.post('/api/trianah/scan-scam', async (req, res) => {
  try {
    const { text, senderName, attachmentName, channel } = req.body;
    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      if (err.message === 'MISSING_KEY') {
        // Fallback simulate logic if key is omitted
        const containsPin = text.toLowerCase().includes('pin') || text.toLowerCase().includes('password');
        const containsWinner = text.toLowerCase().includes('winner') || text.toLowerCase().includes('won') || text.toLowerCase().includes('promo');
        const containsLink = text.toLowerCase().includes('http') || text.toLowerCase().includes('.net');
        
        let riskScore = 15;
        let verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS' = 'SAFE';
        let threatType = 'None Identified';
        let indicators: string[] = ['Sender seems standard'];
        
        if (containsPin && containsWinner) {
          riskScore = 95;
          verdict = 'DANGEROUS';
          threatType = 'PIN Phishing Scam';
          indicators = ['Requests confidential Mobile Money PIN', 'Uses urgency metrics like claim now', 'Contains non-official award portal link'];
        } else if (containsWinner || containsLink) {
          riskScore = 65;
          verdict = 'SUSPICIOUS';
          threatType = 'Suspicious Marketing/Lead Hook';
          indicators = ['Promotional winner claims', 'External unverified URL referenced'];
        }

        return res.json({
          status: 'simulated',
          riskScore,
          verdict,
          threatType,
          indicators,
          analysis: `[🔑 Gemini API Key not set - Simulated Audit] This message suggests standard phishing patterns. Messages asking to open external websites to input security codes/PINs are highly dangerous.`
        });
      }
      throw err;
    }

    const systemInstruction = `You are a highly capable Scam, Phishing, and Social Engineering Audit Engine.
Audit the given message, sender details, or attachment. Calculate a strict risk score (0 to 100), assign a clear verdict (SAFE, SUSPICIOUS, or DANGEROUS), identify specific indicators of fraud, and write a human-readable analysis outlining the threat vectors.
`;

    const promptText = `
Audit target:
Sender: ${senderName || 'Unknown'}
Channel: ${channel || 'Unknown'}
Attachment: ${attachmentName || 'None'}
Message text: "${text}"

Provide a detailed evaluation in JSON structure.`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: 'Risk rating from 0 to 100.' },
            verdict: { type: Type.STRING, description: 'Verdicts: SAFE, SUSPICIOUS, or DANGEROUS.' },
            threatType: { type: Type.STRING, description: 'Direct fraud name, e.g. Phishing, Scam, Impersonation, Safe.' },
            indicators: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List precise red flags.'
            },
            analysis: { type: Type.STRING, description: 'Clear narrative explaining why it is risky or safe.' }
          },
          required: ['riskScore', 'verdict', 'threatType', 'indicators', 'analysis']
        }
      }
    });

    let resultJson = {};
    if (geminiRes.text) {
      resultJson = JSON.parse(geminiRes.text);
    }

    res.json({
      status: 'success',
      ...resultJson
    });

  } catch (error: any) {
    console.error('Scan scam error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Audit fail.' });
  }
});

// 3. Digital Twin Response Drafting API
app.post('/api/trianah/draft-twin-reply', async (req, res) => {
  try {
    const { originalMessage, sender, writingTone } = req.body;
    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      if (err.message === 'MISSING_KEY') {
        const fallbackDraft = writingTone === 'ugandan_formal' 
          ? `Dear ${sender},\n\nThank you for reaching out. I have taken note of your communication. Let us program a brief call to align on these research tasks.\n\nBest regards.`
          : `Hey ${sender}, thanks for the message. Let's sync up soon to talk through these points! Cheers.`;
        return res.json({
          status: 'simulated',
          draft: fallbackDraft
        });
      }
      throw err;
    }

    const systemInstruction = `You are a Digital Twin Behavioral AI modeling agent.
Your goal is to write a draft reply to the received communication representing the user's requested communication preferences.
Available Tone configurations:
- 'direct': Extremely concise, straight to action, very short.
- 'thoughtful': Empathetic, highlights key technical details, structural.
- 'ugandan_formal': Uses polite professional phrasing common in Ugandan corporate spaces (e.g. "Greetings!", "I have taken note", "Please find attached", "Let us program a meeting").
- 'casual': Friendly, energetic, uses informal greetings like "Hey", "Cheers".`;

    const promptText = `
SENDER: ${sender}
ORIGINAL MESSAGE: "${originalMessage}"
TARGET WRITING TONE: ${writingTone || 'ugandan_formal'}

Format a realistic, high-quality response suitable for immediate copy-pasting once approved.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.6,
      }
    });

    res.json({
      status: 'success',
      draft: response.text ? response.text.trim() : ''
    });

  } catch (error: any) {
    console.error('Draft twin reply error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Draft formulate fail.' });
  }
});

// 4. Meeting Summary & Action Extraction API
app.post('/api/trianah/summarize-meeting', async (req, res) => {
  try {
    const { transcript } = req.body;
    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      if (err.message === 'MISSING_KEY') {
        return res.json({
          status: 'simulated',
          summary: 'Review of agro-tech sensors scope and Gulu collaboration with Makerere research staff.',
          actionItems: [
            'Confirm 15 telemetry probe specifications.',
            'Connect sandbox Open APIs and query tax records.'
          ],
          deadlines: [
            'Grant draft: 2026-06-15'
          ]
        });
      }
      throw err;
    }

    const systemInstruction = `You are Trianah AI Meeting Memory assistant.
Analyze meeting conversation logs/transcripts. Produce a high-quality summary, extract specific actionable items, and extract any explicit deadlines.`;

    const promptText = `
Transcript text:
"${transcript}"

Provide structured JSON response detailing summary, actionItems, and deadlines.`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'One sentence high-level summary' },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            deadlines: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['summary', 'actionItems', 'deadlines']
        }
      }
    });

    let resData = {};
    if (geminiRes.text) {
      resData = JSON.parse(geminiRes.text);
    }

    res.json({
      status: 'success',
      ...resData
    });

  } catch (error: any) {
    console.error('Summarize meeting error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Sync fail.' });
  }
});

// 5. Business intelligence predictions
app.post('/api/trianah/predict-sales', async (req, res) => {
  try {
    const { dataPoints } = req.body;
    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      if (err.message === 'MISSING_KEY') {
        return res.json({
          status: 'simulated',
          prediction: 'Based on current consulting trajectories and Makerere joint grants, sales projection ranges from UGX 8,500,000 to UGX 10,200,000 next month.',
          insights: ['Gulu BioTech funding represents 35% growth prospect.', 'Engagement levels in municipal water consulting remain active.']
        });
      }
      throw err;
    }

    const promptText = `
Current KPIs & revenue logs: ${JSON.stringify(dataPoints)}
Predict next month's sales trajectory and summarize 2-3 strategic operational tips. Ensure response is brief and tailored to East African / Ugandan business context. Return structured JSON.`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING },
            insights: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['prediction', 'insights']
        }
      }
    });

    let resData = {};
    if (geminiRes.text) {
      resData = JSON.parse(geminiRes.text);
    }
    res.json({
      status: 'success',
      ...resData
    });

  } catch (err: any) {
    console.error('Prediction query error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Vite & Static file handler setups
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Trianah Engine] running on http://localhost:${PORT}`);
  });
}

startServer();
