'use client'

import { Lead } from '@/lib/types'

// ============================================================
// COLUMN DEFINITIONS
// ============================================================
const TABLE_COLS = [
  'first_name', 'last_name', 'email', 'mobile_number', 'personal_email',
  'company_name', 'company_website', 'linkedin', 'full_name', 'job_title',
  'industry', 'headline', 'seniority_level', 'company_linkedin', 'functional_level',
  'company_size', 'city', 'state', 'country',
  'company_annual_revenue', 'company_annual_revenue_clean',
  'email_status', 'twitter', 'github', 'facebook', 'phone_numbers',
  'organization_founded_year', 'keywords',
]

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

const LINK_COLS = new Set(['linkedin', 'company_linkedin', 'company_website'])

// ============================================================
// PROPS
// ============================================================
interface LeadTableProps {
  leads: Lead[]
  onOpenLead: (index: number) => void
}

// ============================================================
// COMPONENT
// ============================================================
export default function LeadTable({ leads, onOpenLead }: LeadTableProps) {
  if (!leads || leads.length === 0) return null

  // Build column list: priority cols first, then extras found in data
  const extraKeys = new Set<string>()
  leads.forEach((l) => Object.keys(l).forEach((k) => {
    if (!TABLE_COLS.includes(k)) extraKeys.add(k)
  }))

  const allCols = [...TABLE_COLS, ...extraKeys].filter((k) =>
    leads.some((l) => l[k] !== null && l[k] !== undefined && l[k] !== '' && l[k] !== 'null')
  )

  return (
    <div className="leads-table-wrapper">
      <table className="leads-table">
        <thead>
          <tr>
            {allCols.map((k) => (
              <th key={k}>{COL_LABELS[k] || k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, idx) => (
            <tr key={idx} onClick={() => onOpenLead(idx)}>
              {allCols.map((k) => {
                const v = lead[k]
                if (v === null || v === undefined || v === '' || v === 'null') {
                  return (
                    <td key={k}>
                      <span className="tbl-null">—</span>
                    </td>
                  )
                }
                const s = String(v)
                if (LINK_COLS.has(k) && s.startsWith('http')) {
                  const display = s.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
                  return (
                    <td key={k}>
                      <a
                        className="tbl-link"
                        href={s}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {display}
                      </a>
                    </td>
                  )
                }
                return (
                  <td key={k} title={s}>{s}</td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Export helpers for use in other components
export { COL_LABELS, TABLE_COLS }
