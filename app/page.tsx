'use client';
import { useChat } from 'ai/react';
import { useState } from 'react';

export default function HPLM_Core_Interface() {
  // State for files must be inside the component
  const [files, setFiles] = useState<FileList | null>(null);

  // useChat handles the connection to your Layer 1 Backend (NIL)
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // Helper to convert files to Base64 so the Neural Layer can "see" them
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Custom execution handler to package the "Messy Reality" data
  const onExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const base64Files = files ? await Promise.all(
      Array.from(files).map(async (f) => ({
        base64: await convertToBase64(f),
        type: f.type,
      }))
    ) : [];

    // Sends text + images/PDFs to Layer 1 (NIL)
    handleSubmit(e, {
      data: { files: base64Files }
    });
    
    setFiles(null); // Clear stage after execution
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px', color: '#00ff41' }}>
      
      {/* 1. LAYER 1 LOG DISPLAY (Ingestion Log) */}
      <section style={{ marginBottom: '20px', border: '1px solid #333', padding: '10px' }}>
        <h2 style={{ fontSize: '0.8rem', color: '#888' }}>[LAYER_1_INGESTION_LOG]</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map(m => (
            <div key={m.id} style={{ 
              padding: '10px', 
              background: m.role === 'user' ? '#111' : '#001a00',
              borderLeft: `3px solid ${m.role === 'user' ? '#0070f3' : '#00ff41'}`
            }}>
              <small style={{ color: '#666', display: 'block' }}>{m.role.toUpperCase()}</small>
              {m.content}
            </div>
          ))}
        </div>
      </section>

      {/* 2. THE LINGUISTIC INTERFACE (The Form) */}
      <form onSubmit={onExecute} style={{ 
        position: 'fixed', bottom: '40px', width: '90%', maxWidth: '800px',
        display: 'flex', flexDirection: 'column', gap: '10px', background: '#0a0a0a'
      }}>
        
        {/* File Input for "Messy Reality" (ENEG Papers, Charts, Photos) */}
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
            placeholder="Enter claim or data for audit..."
            style={{ 
              flex: 1, padding: '12px', background: '#000', color: '#00ff41', 
              border: '1px solid #00ff41', fontFamily: 'monospace' 
            }}
          />
          <button type="submit" style={{ 
            background: '#00ff41', color: '#000', padding: '0 20px', fontWeight: 'bold' 
          }}>EXECUTE</button>
        </div>
      </form>
    </div>
  );
}
