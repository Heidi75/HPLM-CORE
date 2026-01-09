'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function HPLM_Interface() {
  const [showAudit, setShowAudit] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('STANDBY');

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    // Hard-wiring the path to ensure it hits the route that gave you the 405
    api: '/api/chat', 
    onResponse: (response) => {
      if (response.ok) setConnectionStatus('CONNECTED_TO_PYRAMID');
      else setConnectionStatus(`ERROR_${response.status}`);
    },
    onError: (err) => {
      setConnectionStatus('FAILED_TO_REACH_API');
      console.error(err);
    }
  });

  const downloadFullAudit = () => {
    const reportHeader = `
===========================================================
HPLM FORENSIC AUDIT RECORD - OFFICIAL LIABILITY LOG
===========================================================
REPORT GENERATED   : ${new Date().toISOString()}
SYSTEM ARCHITECTURE: 7-LAYER NEURAL-SYMBOLIC PYRAMID
-----------------------------------------------------------
`;
    const reportBody = messages.length > 0 
      ? messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`).join('\n---\n')
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
          <div style={{ fontSize: '10px', color: connectionStatus.includes('ERROR') ? '#f00' : '#666' }}>
            ENGINE_IGNITION: {connectionStatus} | MODE: SKELETON_DEMO
          </div>
        </div>
        
        {/* GOLD DOWNLOAD BUTTON (NOW ALWAYS ACCESSIBLE) */}
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
          GENERATE_FORENSIC_RECORD
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
                  <div style={{ fontSize: '9px', color: '#444' }}>{m.role === 'user' ? '[SUBJECT_DATA]' : '[LOGIC_TRACE]'}</div>
                  <pre style={{ whiteSpace: 'pre-wrap', color: m.role === 'user' ? '#fff' : '#0f0', margin: 0 }}>{m.content}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* FORM SECTION */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          setConnectionStatus('INGESTING...');
          handleSubmit(e);
        }} 
        style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', display: 'flex' }}
      >
        <input
          value={input}
          onChange={handleInputChange}
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
