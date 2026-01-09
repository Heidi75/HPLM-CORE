'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function HPLM_Interface() {
  const [showAudit, setShowAudit] = useState(true);
  
  // Explicitly pointing to our fixed API route
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onFinish: () => console.log("Stream Complete"),
    onError: (err) => console.error("HPLM Connection Error:", err)
  });

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px' }}>HPLM_CORE_V1.0</h1>
          <div style={{ fontSize: '10px', color: isLoading ? '#f00' : '#666' }}>
            STATUS: {isLoading ? 'EXECUTING_LOGIC...' : 'LAYER_1_ACTIVE'}
          </div>
        </div>
        <button 
          onClick={() => setShowAudit(!showAudit)}
          style={{ backgroundColor: 'transparent', border: '1px solid #333', color: '#aaa', cursor: 'pointer', fontSize: '10px' }}
        >
          [{showAudit ? 'HIDE_AUDIT' : 'VIEW_AUDIT'}]
        </button>
      </div>

      {/* LAYER 6 AREA - This is where the Kernel result MUST appear */}
      {showAudit && (
        <div style={{ border: '1px solid #0070f3', padding: '15px', marginBottom: '20px', minHeight: '120px', backgroundColor: '#000510' }}>
          <h3 style={{ color: '#0070f3', margin: '0 0 10px 0', fontSize: '12px' }}>[LAYER_6_FORENSIC_TRACE]</h3>
          <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
            {messages.length === 0 ? (
              <span style={{ color: '#004400' }}>{isLoading ? 'Accessing Kernel...' : 'Listening for logic-path metadata...'}</span>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ color: m.role === 'user' ? '#fff' : '#0f0', marginBottom: '8px' }}>
                  {m.role === 'assistant' && <span>{m.content}</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div style={{ color: '#222', fontSize: '10px', marginBottom: '10px' }}>[LAYER_1_INGESTION_LOG]</div>

      {/* Input Form - The Engine Room */}
      <form onSubmit={handleSubmit} style={{ position: 'fixed', bottom: '30px', left: '20px', right: '20px', display: 'flex' }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ingest claim for audit..."
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
