'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function HPLM_Interface() {
  const [showAudit, setShowAudit] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('STANDBY');

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    // Hard-coded relative path to ensure lowercase consistency
    api: '/api/chat', 
    onResponse: (response) => {
      if (response.ok) {
        setConnectionStatus('CONNECTED_TO_PYRAMID');
      } else {
        setConnectionStatus(`CONNECTION_ERROR_${response.status}`);
      }
    },
    onFinish: () => console.log("HPLM Forensic Trace Finalized"),
    onError: (err) => {
      setConnectionStatus('FAILED_TO_REACH_API');
      console.error("Pyramid Connection Error:", err);
    }
  });

  // --- OFFICIAL LIABILITY DOWNLOAD ---
  const downloadFullAudit = () => {
    const reportHeader = `
===========================================================
HPLM FORENSIC AUDIT RECORD - OFFICIAL LIABILITY LOG
===========================================================
RECORD GENERATED   : ${new Date().toISOString()}
ARCHIVE ID         : HPLM-ARC-${Date.now()}
SYSTEM ARCHITECTURE: 7-LAYER NEURAL-SYMBOLIC PYRAMID
-----------------------------------------------------------
`;

    const reportBody = messages
      .map(m => {
        const role = m.role === 'user' ? 'SUBJECT_ORIGINAL_INPUT' : 'SYSTEM_REASONING_TRACE';
        return `[${role}]\n${m.content}\n`;
      })
      .join('\n-----------------------------------------------------------\n');

    const blob = new Blob([reportHeader + reportBody], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HPLM-LIABILITY-LOG-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      
      {/* SYSTEM STATUS HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', letterSpacing: '1px' }}>HPLM_CORE_V1.0</h1>
          <div style={{ fontSize: '10px', color: connectionStatus.includes('ERROR') || connectionStatus.includes('FAILED') ? '#f00' : '#666' }}>
            ENGINE_IGNITION: {connectionStatus} | MODE: SKELETON_DEMO
          </div>
        </div>
        <button 
          onClick={downloadFullAudit} 
          disabled={messages.length === 0} 
          style={{ 
            backgroundColor: messages.length === 0 ? '#111' : '#d4af37', 
            color: '#000', 
            border: 'none', 
            padding: '5px 10px', 
            fontSize: '10px', 
            fontWeight: 'bold', 
            cursor: messages.length === 0 ? 'not-allowed' : 'pointer' 
          }}
        >
          GENERATE_FORENSIC_RECORD
        </button>
      </div>

      {/* LAYER 6 & 7 REASONING DISPLAY */}
      {showAudit && (
        <div style={{ border: '1px solid #0070f3', padding: '15px', marginBottom: '80px', backgroundColor: '#000510', minHeight: '200px' }}>
          <h3 style={{ color: '#0070f3', margin: '0 0 10px 0', fontSize: '12px' }}>[LAYER_6_7_AUDIT_STREAM]</h3>
          <div style={{ fontSize: '13px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#004400' }}>
                {isLoading ? '>>> INITIATING PYRAMID PROTOCOL...' : '>>> STANDBY: INGEST SUBJECT DATA TO TRIGGER TRACE...'}
              </span>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '9px', color: '#444', marginBottom: '4px' }}>
                    {m.role === 'user' ? '[DATA_INGESTED]' : '[LOGIC_PATH_TRACE]'}
                  </div>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    color: m.role === 'user' ? '#fff' : '#0f0', 
                    borderLeft: m.role === 'user' ? '2px solid #555' : '2px solid #0070f3', 
                    paddingLeft: '10px', 
                    margin: 0,
                    fontFamily: 'monospace'
                  }}>
                    {m.content}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* DATA INGESTION FORM (IGNITION SWITCH) */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();          // 1. STOP PAGE RELOAD
          if (!input.trim()) return;   // 2. PREVENT EMPTY INGESTION
          setConnectionStatus('ATTEMPTING_INGESTION...');
          handleSubmit(e);             // 3. TRIGGER PYRAMID
        }} 
        style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', display: 'flex' }}
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ingest data for liability audit..."
          style={{ 
            flexGrow: 1, 
            backgroundColor: '#000', 
            border: '1px solid #0f0', 
            color: '#0f0', 
            padding: '15px', 
            outline: 'none',
            fontFamily: 'monospace'
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            backgroundColor: isLoading ? '#222' : '#0f0', 
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
