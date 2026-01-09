'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  auditLog?: any;
};

export default function HPLM_Interface() {
  const [showAudit, setShowAudit] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('STANDBY');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setConnectionStatus('INGESTING...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ 
            role: m.role, 
            content: m.content 
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Store audit log
      if (data.auditLog) {
        setAuditTrail(prev => [...prev, data.auditLog]);
      }

      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.modelResponse || JSON.stringify(data.auditLog, null, 2),
        auditLog: data.auditLog,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setConnectionStatus('CONNECTED_TO_PYRAMID');
      
    } catch (error: any) {
      console.error('Error:', error);
      setConnectionStatus(`FAILED_TO_REACH_API: ${error.message}`);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `ERROR: ${error.message}`,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFullAudit = () => {
    const reportHeader = `
===========================================================
HPLM FORENSIC AUDIT RECORD - OFFICIAL LIABILITY LOG
===========================================================
REPORT GENERATED   : ${new Date().toISOString()}
SYSTEM ARCHITECTURE: 7-LAYER NEURAL-SYMBOLIC PYRAMID
===========================================================

COMPLETE 7-LAYER AUDIT TRAIL (${auditTrail.length} TRANSACTIONS):
-----------------------------------------------------------
${JSON.stringify(auditTrail, null, 2)}

-----------------------------------------------------------
CONVERSATION TRANSCRIPT:
-----------------------------------------------------------
`;
    const reportBody = messages.length > 0 
      ? messages.map(m => `[${m.role.toUpperCase()}] ${new Date().toISOString()}\n${m.content}\n`).join('\n---\n')
      : "NO_TRACE_DATA_FOUND";

    const blob = new Blob([reportHeader + reportBody], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HPLM-FORENSIC-LOG-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px' }}>HPLM_CORE_V1.0</h1>
          <div style={{ fontSize: '10px', color: connectionStatus.includes('ERROR') || connectionStatus.includes('FAILED') ? '#f00' : '#666' }}>
            ENGINE_IGNITION: {connectionStatus} | MODE: SKELETON_DEMO | AUDITS: {auditTrail.length}
          </div>
        </div>
        
        {/* GOLD DOWNLOAD BUTTON */}
        <button 
          onClick={downloadFullAudit} 
          style={{ 
            backgroundColor: '#d4af37', 
            color: '#000', 
            border: 'none', 
            padding: '5px 12px', 
            fontSize: '10px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)'
          }}
        >
          GENERATE_FORENSIC_RECORD ({auditTrail.length})
        </button>
      </div>

      {/* REASONING DISPLAY */}
      {showAudit && (
        <div style={{ border: '1px solid #0070f3', padding: '15px', marginBottom: '80px', backgroundColor: '#000510', minHeight: '200px' }}>
          <h3 style={{ color: '#0070f3', margin: '0 0 10px 0', fontSize: '11px' }}>[LAYER_6_7_AUDIT_STREAM]</h3>
          <div style={{ fontSize: '13px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#004400' }}>{isLoading ? '>>> INITIATING...' : '>>> STANDBY: INGEST SUBJECT DATA...'}</span>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ marginBottom: '15px', borderLeft: m.role === 'user' ? '2px solid #555' : '2px solid #0070f3', paddingLeft: '10px' }}>
                  <div style={{ fontSize: '9px', color: '#444' }}>
                    {m.role === 'user' ? '[SUBJECT_DATA]' : '[LOGIC_TRACE]'}
                    {m.auditLog && ` | TRACE: ${m.auditLog.traceId}`}
                  </div>
                  <pre style={{ whiteSpace: 'pre-wrap', color: m.role === 'user' ? '#fff' : '#0f0', margin: 0 }}>{m.content}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* FORM SECTION */}
      <form 
        onSubmit={handleSubmit}
        style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', display: 'flex' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ingest data for forensic audit..."
          style={{ flexGrow: 1, backgroundColor: '#000', border: '1px solid #0f0', color: '#0f0', padding: '15px', outline: 'none' }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ backgroundColor: isLoading ? '#222' : '#0f0', color: '#000', border: 'none', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {isLoading ? '...' : 'EXECUTE'}
        </button>
      </form>
    </div>
  );
}
