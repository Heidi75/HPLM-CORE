'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function HPLM_Interface() {
  // This hook connects the UI to your route.ts
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0f0', margin: 0 }}>HPLM_CORE_V1.0</h1>
        <div style={{ fontSize: '10px', color: '#666' }}>STATUS: {isLoading ? 'PROCESSING...' : 'LAYER_1_ACTIVE'} | SYSTEM: NOMINAL</div>
      </header>

      {/* LAYER 6: FORENSIC TRACE AREA */}
      <div style={{ border: '1px solid #0070f3', padding: '15px', marginBottom: '20px' }}>
        <h3 style={{ color: '#0070f3', margin: '0 0 10px 0' }}>[LAYER_6_FORENSIC_TRACE]</h3>
        <div style={{ fontSize: '12px' }}>
          {messages.length === 0 ? (
            <span style={{ color: '#666' }}>Listening for logic-path metadata...</span>
          ) : (
            messages.map((m, i) => (
              <div key={i} style={{ marginBottom: '10px', color: m.role === 'user' ? '#fff' : '#0f0' }}>
                [{m.role.toUpperCase()}]: {m.content}
              </div>
            ))
          )}
        </div>
      </div>

      {/* INPUT AREA */}
      <div style={{ position: 'fixed', bottom: '40px', left: '20px', right: '20px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ingest claim for audit..."
            style={{
              flexGrow: 1,
              backgroundColor: '#000',
              border: '1px solid #0f0',
              color: '#0f0',
              padding: '10px',
              fontFamily: 'monospace'
            }}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              backgroundColor: '#0f0',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isLoading ? '...' : 'EXECUTE'}
          </button>
        </form>
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#444', marginTop: '20px' }}>
          ENGINE: NEURAL-SYMBOLIC HYBRID | ARCH: 7-LAYER PYRAMID
        </div>
      </div>
    </div>
  );
}
