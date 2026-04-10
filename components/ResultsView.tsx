'use client'

import { useState, useCallback } from 'react'
import { Lead, ResultsView as ResultsViewMode } from '@/lib/types'
import LeadCard from './LeadCard'
import LeadTable from './LeadTable'
import LeadDetailModal from './LeadDetailModal'

// ============================================================
// COLUMN LABELS for CSV export
// ============================================================
const COL_LABELS: Record<string, string> = {
  first_name: 'Nombre', last_name: 'Apellido', email: 'Email', mobile_number: 'Móvil',
  personal_email: 'Email Personal', company_name: 'Empresa', company_website: 'Web Empresa',
  linkedin: 'LinkedIn', full_name: 'Nombre Completo', job_title: 'Cargo', industry: 'Industria',
  headline: 'Headline', seniority_level: 'Seniority', company_linkedin: 'LinkedIn Empresa',
  functional_level: 'Nivel Funcional', company_size: 'Empleados', city: 'Ciudad', state: 'Estado',
  country: 'País', company_annual_revenue: 'Revenue', company_annual_revenue_clean: 'Revenue (clean)',
  email_status: 'Email Status', twitter: 'Twitter', github: 'GitHub', facebook: 'Facebook',
  phone_numbers: 'Teléfonos', organization_founded_year: 'Fundada', keywords: 'Keywords',
}

// ============================================================
// TOAST
// ============================================================
let toastTimeout: ReturnType<typeof setTimeout> | null = null

function showToastExternal(msg: string, setMsg: (m: string) => void, setVisible: (v: boolean) => void) {
  if (toastTimeout) clearTimeout(toastTimeout)
  setMsg(msg)
  setVisible(true)
  toastTimeout = setTimeout(() => setVisible(false), 2200)
}

// ============================================================
// PROPS
// ============================================================
interface ResultsViewProps {
  leads: Lead[]
}

// ============================================================
// COMPONENT
// ============================================================
export default function ResultsView({ leads }: ResultsViewProps) {
  const [viewMode, setViewMode] = useState<ResultsViewMode>('cards')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLeadIdx, setSelectedLeadIdx] = useState<number | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  // Filter leads based on search query
  const filteredLeads = searchQuery
    ? leads.filter((l) =>
        (String(l.full_name || '') || [String(l.first_name || ''), String(l.last_name || '')].filter(Boolean).join(' ') || '').toLowerCase().includes(searchQuery) ||
        (String(l.organization_name || l.company_name || l.company || '')).toLowerCase().includes(searchQuery) ||
        (String(l.email || '')).toLowerCase().includes(searchQuery) ||
        (String(l.personal_email || '')).toLowerCase().includes(searchQuery) ||
        (String(l.title || l.job_title || '')).toLowerCase().includes(searchQuery) ||
        (String(l.industry || l.organization_industry || '')).toLowerCase().includes(searchQuery) ||
        (String(l.country || l.location || '')).toLowerCase().includes(searchQuery) ||
        (String(l.headline || '')).toLowerCase().includes(searchQuery)
      )
    : leads

  // Stats
  const companies = new Set(leads.map((l) => l.company_name).filter(Boolean)).size
  const countries = new Set(leads.map((l) => l.country).filter(Boolean)).size
  const emails = leads.filter(
    (l) => l.email && l.email_status !== 'No Validado' && l.email_status !== 'Desconocido'
  ).length

  const showToast = useCallback(
    (msg: string) => showToastExternal(msg, setToastMsg, setToastVisible),
    []
  )

  const handleCopyEmail = useCallback(
    async (email: string) => {
      try {
        await navigator.clipboard.writeText(email)
        showToast('Copiado al portapapeles')
      } catch {
        const ta = document.createElement('textarea')
        ta.value = email
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        showToast('Copiado al portapapeles')
      }
    },
    [showToast]
  )

  const handleExportCSV = useCallback(() => {
    if (!leads.length) { showToast('No hay leads para exportar'); return }

    const keySet = new Set<string>()
    leads.forEach((l) => Object.keys(l).forEach((k) => keySet.add(k)))
    const allKeys = [...keySet]

    const headers = allKeys.map((k) => COL_LABELS[k] || k)
    const rows = leads.map((l) =>
      allKeys.map((k) => {
        const v = l[k]
        return v === null || v === undefined ? '' : String(v)
      })
    )

    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => '"' + v.replace(/"/g, '""') + '"').join(','))
      .join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast(`CSV exportado — ${allKeys.length} columnas`)
  }, [leads, showToast])

  const selectedLead = selectedLeadIdx !== null ? filteredLeads[selectedLeadIdx] ?? null : null

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>
          Resultados
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          {leads.length.toLocaleString()} leads extraídos · {companies.toLocaleString()} empresas · {countries.toLocaleString()} países
        </p>
      </div>

      {/* Stats cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <div className="stat-card">
          <div className="stat-value">{leads.length.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>Total Leads</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{companies.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>Empresas únicas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{countries.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>Países</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{emails.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>Emails verificados</div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre, empresa, email, cargo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* View toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn${viewMode === 'cards' ? ' active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Cards
            </button>
            <button
              className={`view-btn${viewMode === 'table' ? ' active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M6 3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3z" />
              </svg>
              Tabla
            </button>
          </div>

          {/* Export */}
          <button className="btn-export" onClick={handleExportCSV}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Cards view */}
      {viewMode === 'cards' && (
        <>
          {filteredLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                style={{ margin: '0 auto 16px', display: 'block', color: '#334155' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>No se encontraron resultados</div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>Intenta con otra búsqueda</div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              }}
            >
              {filteredLeads.map((lead, idx) => (
                <LeadCard
                  key={idx}
                  lead={lead}
                  index={idx}
                  onOpen={(i) => setSelectedLeadIdx(i)}
                  onCopyEmail={handleCopyEmail}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <>
          {filteredLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>No se encontraron resultados</div>
            </div>
          ) : (
            <LeadTable leads={filteredLeads} onOpenLead={(i) => setSelectedLeadIdx(i)} />
          )}
        </>
      )}

      {/* Modal */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLeadIdx(null)}
      />

      {/* Toast */}
      <div
        className="toast"
        style={{ opacity: toastVisible ? 1 : 0 }}
      >
        {toastMsg}
      </div>
    </div>
  )
}
