'use client'

import { useState, useEffect, useCallback } from 'react'
import { Lead, ViewMode } from '@/lib/types'
import Sidebar from '@/components/Sidebar'
import SearchForm, { FormData } from '@/components/SearchForm'
import ResultsView from '@/components/ResultsView'

// ============================================================
// LOADING MESSAGES
// ============================================================
const LOADING_MESSAGES = [
  'Conectando con n8n...',
  'Autenticando en Apify...',
  'Ejecutando Apollo Scraper...',
  'Buscando leads cualificados...',
  'Extrayendo resultados...',
  'Procesando datos...',
]

// ============================================================
// LEAD NORMALIZER
// ============================================================
function normalizeLeads(data: unknown): Lead[] {
  if (Array.isArray(data)) return data as Lead[]
  const d = data as Record<string, unknown>
  if (d && Array.isArray(d.leads)) return d.leads as Lead[]
  if (d && Array.isArray(d.results)) return d.results as Lead[]
  if (d && Array.isArray(d.data)) return d.data as Lead[]
  if (d && (d as Lead).first_name) return [d as Lead]
  return []
}

// ============================================================
// LOADING VIEW
// ============================================================
function LoadingView({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <div
        className="glass-app"
        style={{ padding: '48px 56px', textAlign: 'center', maxWidth: '440px', width: '100%' }}
      >
        <div className="spinner" />
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>
          Procesando búsqueda...
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px', lineHeight: 1.6 }}>
          El scraper de Apollo puede tardar varios minutos.<br />No cierres esta ventana.
        </p>
        <div style={{ marginBottom: '20px' }}>
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <div style={{ fontSize: '13px', color: '#FACC15', fontWeight: 600, minHeight: '20px' }}>
          {message}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN APP PAGE
// ============================================================
export default function AppPage() {
  const [view, setView] = useState<ViewMode>('form')
  const [leads, setLeads] = useState<Lead[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0])

  // Load leads from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('g4c_leads')
      if (saved) {
        const parsed: Lead[] = JSON.parse(saved)
        if (parsed.length > 0) {
          setLeads(parsed)
          // Stay on form view but show badge
        }
      }
    } catch {
      // ignore corrupt data
    }
  }, [])

  // Rotating loading messages
  useEffect(() => {
    if (view !== 'loading') return
    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[idx])
    }, 3000)
    return () => clearInterval(interval)
  }, [view])

  const handleNavigate = useCallback((target: ViewMode) => {
    // Only allow results navigation if we have leads
    if (target === 'results' && leads.length === 0) return
    setView(target)
  }, [leads.length])

  const handleFormSubmit = useCallback(async (data: FormData) => {
    setErrorMessage(null)
    setLoadingMsg(LOADING_MESSAGES[0])
    setView('loading')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) throw new Error((json as { error?: string }).error || 'Error del servidor')

      const newLeads = normalizeLeads(json)

      if (newLeads.length === 0) {
        throw new Error('No se encontraron leads con los filtros seleccionados')
      }

      // Persist to localStorage
      localStorage.setItem('g4c_leads', JSON.stringify(newLeads))
      localStorage.setItem('g4c_search_ts', new Date().toISOString())

      setLeads(newLeads)
      setView('results')
    } catch (err: unknown) {
      const error = err as Error
      setView('form')
      setErrorMessage(error.message)
    }
  }, [])

  return (
    <div style={{ display: 'flex', background: '#0F172A', minHeight: '100vh' }}>
      <Sidebar
        view={view}
        onNavigate={handleNavigate}
        leadsCount={leads.length}
      />

      <main className="main-content">
        {view === 'form' && (
          <SearchForm
            onSubmit={handleFormSubmit}
            errorMessage={errorMessage}
          />
        )}

        {view === 'loading' && (
          <LoadingView message={loadingMsg} />
        )}

        {view === 'results' && (
          <ResultsView leads={leads} />
        )}
      </main>
    </div>
  )
}
