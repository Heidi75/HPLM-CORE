'use client';
import { useChat } from 'ai/react';

export default function HPLM_Core_Interface() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      <section style={{ marginBottom: '20px', border: '1px solid #333', padding: '10px' }}>
        <h2 style={{ fontSize: '0.9rem', color: '#888', margin: '0 0 10px 0' }}>[LAYER_1_INGESTION_LOG]</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map(m => (
            <div key={m.id} style={{ 
              padding: '10px', 
              background: m.role === 'user' ? '#111' : '#001a00',
              borderLeft: `3px solid ${m.role === 'user' ? '#0070f3' : '#00ff41'}`
            }}>
              <small style={{ color: '#666', display: 'block', marginBottom: '5px' }}>
                {m.role === 'user' ? 'INPUT_STREAM' : 'NIL_OUTPUT'}
              </small>
              {m.content}
            </div>
          ))}
        </div>
      </section>

      {/* Persistent Input Terminal */}
      <form onSubmit={handleSubmit} style={{ 
        position: 'fixed', 
        bottom: '40px', 
        width: '100%', 
        maxWidth: '800px',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Enter claim for HPLM audit..."
          style={{ 
            flex: 1, 
            padding: '12px', 
            background: '#000', 
            color: '#00ff41', 
            border: '1px solid #00ff41',
            outline: 'none',
            fontFamily: 'monospace'
          }}
        />
        <button type="submit" style={{ 
          background: '#00ff41', 
          color: '#000', 
          border: 'none', 
          padding: '0 20px', 
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>EXECUTE</button>
      </form>
    </div>
  );
}
