'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function HPLM_Interface() {
  const [showAudit, setShowAudit] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('OFFLINE');

  // ----- HOOK -----
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      if (response.ok) setConnectionStatus('CONNECTED_TO_PYRAMID');
      else setConnectionStatus('CONNECTION_ERROR_' + response.status);
    },
    onFinish: () => console.log("Trace Finalized"),
    onError: (err) => {
      setConnectionStatus('FAILED_TO_REACH_API');
      console.error(err);
    },
  });

  // ----- DOWNLOAD AUDIT LOG -----
  const downloadFullAudit = () => {
    const reportHeader = `HPLM FORENSIC AUDIT RECORD\nGEN: ${new Date().toISOString()}\n--------------------------\n`;
    const reportBody = messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`).join('\n---\n');
    const blob = new Blob([reportHeader + reportBody], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HPLM-LOG-${Date.now()}.txt`;
    link.click();
  };

  // ----- FORM SUBMISSION WRAPPER -----
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();          // prevent default GET
    if (!input.trim()) return;   // ignore empty input
    handleSubmit(e);             // trigger useChat POST
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>

      {/* SYSTEM STATUS HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px' }}>HPLM_CORE_V1.0</h1>
          <div style={{ fontSize: '10px', color: connectionStatus.includes('ERROR') ? '#f00' : '#666' }}>
            ENGINE_IGNITION: {connectionStatus} | MODE: SKELETON_DEMO
          </div>
        </div>
        <button
          onClick={downloadFullAudit}
          disabled={messages.length === 0}
          style={{ backgroundColor: '#d4af37', color: '#000', border: 'none', padding: '5px 10px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          GENERATE_FORENSIC_RECORD
        </button>
      </div>

      {/* LAYER 6 & 7 TRACE DISPLAY */}
      {showAudit && (
        <div style={{ border: '1px solid #0070f3', padding: '15px', marginBottom: '80px', backgroundColor: '#000510' }}>
          <h3 style={{ color: '#0070f3', margin: '0 0 10px 0', fontSize: '12px' }}>[LAYER_6_7_AUDIT_STREAM]</h3>
          <div style={{ fontSize: '13px' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#004400' }}>{isLoading ? 'Pinging Kernel...' : 'Standby: Ingest subject data to trigger Pyramid...'}</span>
            ) : (
              messages.map((m, i) => (
                <pre
                  key={i}
                  style={{
                    whiteSpace: 'pre-wrap',
                    color: m.role === 'user' ? '#fff' : '#0f0',
                    borderLeft: '2px solid #333',
                    paddingLeft: '10px',
                    marginBottom: '10px'
                  }}
                >
                  {m.content}
                </pre>
              ))
            )}
          </div>
        </div>
      )}

      {/* DATA INGESTION FORM */}
      <form onSubmit={onFormSubmit} style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', display: 'flex' }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ingest data for liability audit..."
          style={{ flexGrow: 1, backgroundColor: '#000', border: '1px solid #0f0', color: '#0f0', padding: '15px', outline: 'none' }}
        />
        <button type="submit" style={{ backgroundColor: '#0f0', color: '#000', border: 'none', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isLoading ? '...' : 'EXECUTE'}
        </button>
      </form>

    </div>
  );
}
