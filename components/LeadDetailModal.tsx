'use client'

import { useEffect } from 'react'
import { Lead } from '@/lib/types'

// ============================================================
// COLUMN LABELS (shared subset)
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
// MODAL SECTIONS
// ============================================================
const MODAL_SECTIONS = [
  { title: '👤 Contacto', keys: ['first_name', 'last_name', 'full_name', 'email', 'personal_email', 'mobile_number', 'phone_numbers', 'email_status'] },
  { title: '💼 Cargo', keys: ['job_title', 'headline', 'seniority_level', 'functional_level'] },
  { title: '🔗 Redes', keys: ['linkedin', 'twitter', 'github', 'facebook'] },
  { title: '🏢 Empresa', keys: ['company_name', 'company_website', 'company_linkedin', 'industry', 'company_size', 'company_annual_revenue', 'company_annual_revenue_clean', 'organization_founded_year'] },
  { title: '📍 Ubicación', keys: ['city', 'state', 'country'] },
]

// ============================================================
// PROPS
// ============================================================
interface LeadDetailModalProps {
  lead: Lead | null
  onClose: () => void
}

// ============================================================
// COMPONENT
// ============================================================
export default function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (lead) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lead])

  if (!lead) return null

  const name =
    String(lead.full_name || '') ||
    [lead.first_name, lead.last_name].filter(Boolean).join(' ') ||
    'Sin nombre'

  const subtitle = [lead.job_title, lead.company_name].filter(Boolean).join(' · ') || ''

  // Collect which keys are handled by sections
  const handledKeys = new Set(MODAL_SECTIONS.flatMap((s) => s.keys))
  const otherKeys = Object.keys(lead).filter((k) => !handledKeys.has(k))
  const allSections = [...MODAL_SECTIONS, { title: '📋 Otros campos', keys: otherKeys }]

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-panel">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', color: '#fff', marginBottom: '3px' }}>
              {name}
            </div>
            <div style={{ fontSize: '13px', color: '#64748B' }}>{subtitle}</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ paddingBottom: '32px' }}>
          {allSections.map((section) => {
            const rows = section.keys.filter((k) => {
              const v = lead[k]
              return v !== null && v !== undefined && v !== '' && v !== 'null'
            })

            if (rows.length === 0) return null

            return (
              <div key={section.title}>
                <div className="modal-section-title">{section.title}</div>
                {rows.map((k) => {
                  const v = lead[k]
                  const s = String(v)
                  const label = COL_LABELS[k] || k
                  const isLink = s.startsWith('http')

                  return (
                    <div key={k} className="modal-field-row">
                      <div className="modal-field-key">{label}</div>
                      <div className="modal-field-val">
                        {isLink ? (
                          <a href={s} target="_blank" rel="noopener noreferrer">{s}</a>
                        ) : (
                          s
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
