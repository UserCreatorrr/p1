'use client'

import { ViewMode } from '@/lib/types'

interface SidebarProps {
  view: ViewMode
  onNavigate: (view: ViewMode) => void
  leadsCount: number
}

export default function Sidebar({ view, onNavigate, leadsCount }: SidebarProps) {
  const formActive = view === 'form' || view === 'loading'
  const resultsActive = view === 'results'

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo.png"
            alt="Logo"
            style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff', letterSpacing: '-0.3px' }}>
              Growth<span style={{ color: '#FACC15' }}>4</span>Clients
            </div>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>Apollo Lead Scraper</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#334155',
            padding: '8px 8px 4px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Menú
        </div>

        {/* Nueva Búsqueda */}
        <button
          className={`nav-item${formActive ? ' active' : ''}`}
          onClick={() => onNavigate('form')}
          style={{ width: '100%', background: formActive ? undefined : 'none', textAlign: 'left' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ flexShrink: 0, stroke: formActive ? '#FACC15' : '#94A3B8' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Nueva Búsqueda
        </button>

        {/* Resultados */}
        <button
          className={`nav-item${resultsActive ? ' active' : ''}`}
          onClick={() => onNavigate('results')}
          style={{ width: '100%', background: resultsActive ? undefined : 'none', textAlign: 'left' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ flexShrink: 0, stroke: resultsActive ? '#FACC15' : '#94A3B8' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Resultados
          {leadsCount > 0 && (
            <span className="result-badge">
              {leadsCount > 999 ? Math.floor(leadsCount / 1000) + 'K+' : leadsCount}
            </span>
          )}
        </button>
      </nav>

      {/* Version footer */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>v1.0 · Beta</div>
        <div style={{ fontSize: '11px', color: '#1E3A5F', marginTop: '2px' }}>Powered by n8n + Apify</div>
      </div>
    </aside>
  )
}
