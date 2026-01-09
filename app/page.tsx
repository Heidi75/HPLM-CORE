'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function HPLM_Interface() {
  const [showAudit, setShowAudit] = useState(true);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      console.log("HPLM Forensic Trace Finalized:", message);
    },
    onError: (err) => console.error("HPLM Critical Connection Error:", err)
  });

  // --- FORENSIC EVIDENCE EXPORT (Layers 1-7) ---
  const downloadFullAudit = () => {
    const reportHeader = `
===========================================================
HPLM FORENSIC AUDIT RECORD - OFFICIAL LIABILITY LOG
===========================================================
RECORD GENERATED   : ${new Date().toISOString()}
ARCHIVE ID         : HPLM-ARC-${Date.now()}
SYSTEM ARCHITECTURE: 7-LAYER NEURAL-SYMBOLIC PYRAMID
ENFORCEMENT STATUS : PROTOCOL_LEVEL_7_ACTIVE
-----------------------------------------------------------
NOTICE: This file contains the complete chain of reasoning
required for liability and regulatory compliance.
-----------------------------------------------------------
`;

    const reportBody = messages
      .map(m => {
        // We use neutral, high-liability labels
        const role = m.role === 'user' ? 'SUBJECT_ORIGINAL_INPUT' : 'SYSTEM_REASONING_TRACE';
        return `[${role}]\n${m.content}\n`;
      })
      .join('\n-----------------------------------------------------------\n');

    const fullReport = reportHeader + reportBody;

    const blob = new Blob([fullReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HPLM-FORENSIC-AUDIT-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      
      {/* --- SYSTEM HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', letterSpacing: '2px' }}>HPLM_CORE_V1.0</h1>
          <div style={{ fontSize: '10px', color: isLoading ? '#f00' : '#666' }}>
            STATUS: {isLoading ? 'EXECUTING_PYRAMID_LOGIC...' : 'STANDBY_LAYER_1'} | LIABILITY_LOGGING: ON
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowAudit(!showAudit)} 
            style={{ backgroundColor: 'transparent', border: '1px solid #333', color: '#aaa', cursor: 'pointer', fontSize: '10px', padding: '5px' }}
          >
            [{showAudit ? 'HIDE_TRACE' : 'VIEW_TRACE'}]
          </button>
          
          <button 
            onClick={downloadFullAudit} 
            disabled={messages.length === 0}
            style={{ 
              backgroundColor: messages.length === 0 ? '#111' : '#d4af37', // Gold color for "Official Record"
              color: '#000', 
              border: 'none', 
              padding: '5px 10px', 
              fontSize: '10px', 
              cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold' 
            }}
          >
            GENERATE_FORENSIC_RECORD
          </button>
        </div>
      </div>

      {/* --- LAYER 6 & 7 REASONING DISPLAY --- */}
      {showAudit && (
        <div style={{ border: '1px solid #0070f3', padding: '15px', marginBottom: '20px', minHeight: '150px', backgroundColor: '#000510' }}>
          <h3 style={{ color: '#0070f3', margin: '0 0 10px 0', fontSize: '12px' }}>[LAYER_6_7_FORENSIC_STREAM]</h3>
          <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#004400' }}>{isLoading ? 'Processing Pyramid Layers...' : 'Listening for ingestion metadata...'}</span>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ color: m.role === 'user' ? '#fff' : '#0f0', marginBottom: '15px' }}>
                  <div style={{ fontSize: '9px', color: '#555', marginBottom: '4px' }}>
                    {m.role === 'user' ? '[DATA_INGESTED]' : '[LOGIC_PATH_TRACE]'}
                  </div>
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'monospace', borderLeft: m.role === 'user' ? '2px solid #fff' : '2px solid #0f0', paddingLeft: '10px' }}>
                    {m.content}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div style={{ color: '#222', fontSize: '10px', marginBottom: '10px' }}>SYSTEM_ID: HPLM-HYBRID-SOLVER-CHASSIS</div>

      {/* --- DATA INGESTION FORM --- */}
      <form onSubmit={handleSubmit} style={{ position: 'fixed', bottom: '30px', left: '20px', right: '20px', display: 'flex' }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ingest data for forensic audit..."
          style={{
            flexGrow: 1,
            backgroundColor: '#000',
            border: '1px solid #0f0',
            color: '#0f0',
            padding: '15px',
            fontFamily: 'monospace',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#444' : '#0f0',
            color: '#000',
            border: 'none',
            padding: '0 25px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isLoading ? '...' : 'EXECUTE'}
        </button>
      </form>
    </div>
  );
}
