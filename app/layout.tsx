import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HPLM Core | Skeleton Model",
  description: "7-Layer Hybrid Pyramid Logic Model - Master Key Infrastructure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0,
        fontFamily: 'monospace', // Using monospace to emphasize the "Core System" feel
        backgroundColor: '#0a0a0a', // Dark theme for a "Backend/Core" aesthetic
        color: '#00ff41' // Matrix-style green for the Truth Engine
      }}>
        {/* System Header: Reflecting the 7-Layer Hierarchy */}
        <header style={{ 
          borderBottom: '1px solid #333',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#111'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>HPLM_CORE_V1.0</div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>
            STATUS: LAYER_1_ACTIVE | SYSTEM: NOMINAL
          </div>
        </header>

        {/* The Main Execution Environment */}
        <main style={{ padding: '20px' }}>
          {children}
        </main>

        {/* Global Layer Indicator */}
        <footer style={{ 
          position: 'fixed',
          bottom: 0,
          width: '100%',
          padding: '0.5rem',
          fontSize: '0.6rem',
          textAlign: 'center',
          background: '#111',
          borderTop: '1px solid #333',
          color: '#555'
        }}>
          ENGINE: NEURAL-SYMBOLIC HYBRID | ARCH: 7-LAYER PYRAMID
        </footer>
      </body>
    </html>
  );
}
