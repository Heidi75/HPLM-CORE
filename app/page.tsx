'use client';
import { useChat } from 'ai/react';
import { useState } from 'react';

export default function HPLM_Core_Interface() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [showAudit, setShowAudit] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, data } = useChat();

  // --- NEW: DOWNLOAD AUDIT FUNCTION ---
  const downloadAuditLog = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HPLM_Audit_Trace_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    const base64Files = files ? await Promise.all(
      Array.from(files).map(async (f) => ({
        base64: await convertToBase64(f),
        type: f.type,
      }))
    ) : [];

    handleSubmit(e, {
      data: { files: base64Files }
    });
    setFiles(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '150px', color: '#00ff41', fontFamily: 'monospace' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #333' }}>
        <h1 style={{ fontSize: '1rem', margin: 0 }}>HPLM_CORE_v1.0</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowAudit(!showAudit)}
            style={{ background: 'transparent', color: '#888', border: '1px solid #444', cursor: 'pointer', fontSize: '0.7rem' }}
          >
            {showAudit ? '[ HIDE_AUDIT ]' : '[ VIEW_AUDIT ]'}
          </button>
          
          {/* --- NEW: THE DOWNLOAD BUTTON --- */}
          {data && (
            <button 
              onClick={downloadAuditLog}
              style={{ background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.7rem', padding: '0 5px' }}
            >
              [ DOWNLOAD_TRACE ]
            </button>
          )}
        </div>
      </header>

      {/* LAYER 6: TRACEBACK PANEL */}
      {showAudit && (
        <section style={{ background: '#050505', border: '1px solid #0070f3', padding: '10px', marginTop: '10px', fontSize: '0.75rem' }}>
          <h2 style={{ color: '#0070f3', margin: '0 0 10px 0' }}>[LAYER_6_FORENSIC_TRACE]</h2>
          <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
            {data ? JSON.stringify(data, null, 2) : "Listening for logic-path metadata..."}
          </pre>
        </section>
      )}

      {/* LAYER 1: INGESTION LOG */}
      <section style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '0.8rem', color: '#888' }}>[LAYER_1_INGESTION_LOG]</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map(m => (
            <div key={m.id} style={{ 
              padding: '10px', 
              background: m.role === 'user' ? '#111' : '#001a00',
              borderLeft: `3px solid ${m.role === 'user' ? '#0070f3' : '#00ff41'}`,
              borderColor: m.content.includes('VETO') ? '#ff0000' : (m.role === 'user' ? '#0070f3' : '#00ff41')
            }}>
              <small style={{ color: '#666', display: 'block' }}>{m.role.toUpperCase()}</small>
              {m.content}
            </div>
          ))}
        </div>
      </section>

      {/* INPUT INTERFACE */}
      <form onSubmit={onExecute} style={{ 
        position: 'fixed', bottom: '40px', width: '90%', maxWidth: '800px',
        display: 'flex', flexDirection: 'column', gap: '10px', background: '#0a0a0a', padding: '10px'
      }}>
        <input 
          type="file" 
          multiple 
          onChange={(e) => setFiles(e.target.files)} 
          style={{ fontSize: '0.7rem', color: '#888' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ingest claim for audit..."
            style={{ flex: 1, padding: '12px', background: '#000', color: '#00ff41', border: '1px solid #00ff41' }}
          />
          <button type="submit" style={{ background: '#00ff41', color: '#000', padding: '0 20px', fontWeight: 'bold' }}>
            EXECUTE
          </button>
        </div>
      </form>
    </div>
  );
    }
