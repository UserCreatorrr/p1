'use client'

import { Lead } from '@/lib/types'

// ============================================================
// HELPERS
// ============================================================
function avatarColor(name: string): string {
  const colors = ['#6366F1', '#10B981', '#F43F5E', '#F59E0B', '#8B5CF6', '#0EA5E9']
  let hash = 0
  for (const c of (name || 'X')) hash = c.charCodeAt(0) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function initials(name: string): string {
  if (!name) return '?'
  return (name || '').split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || '?'
}

function parseRevenue(val: string | number | null | undefined): number {
  if (!val) return 0
  const s = String(val).replace(/[$,\s]/g, '').toLowerCase()
  if (s.includes('b')) return parseFloat(s) * 1e9
  if (s.includes('m')) return parseFloat(s) * 1e6
  if (s.includes('k')) return parseFloat(s) * 1e3
  return parseFloat(s) || 0
}

function formatRevenue(val: string | number | null | undefined): string {
  const n = parseRevenue(val)
  if (!n) return String(val || '—')
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K'
  return '$' + n.toFixed(0)
}

// ============================================================
// PROPS
// ============================================================
interface LeadCardProps {
  lead: Lead
  index: number
  onOpen: (index: number) => void
  onCopyEmail: (email: string) => void
}

// ============================================================
// COMPONENT
// ============================================================
export default function LeadCard({ lead, index, onOpen, onCopyEmail }: LeadCardProps) {
  const name =
    String(lead.full_name || '') ||
    [lead.first_name, lead.last_name].filter(Boolean).join(' ') ||
    'Sin nombre'

  const email = String(lead.email || '')
  const title = String(lead.title || lead.job_title || lead.headline || '')
  const company = String(lead.organization_name || lead.company_name || lead.company || '')
  const city = String(lead.city || '')
  const country = String(lead.country || lead.location || '')
  const location = [city, country].filter(Boolean).join(', ')
  const industry = String(lead.industry || lead.organization_industry || '')
  const employees = String(lead.organization_num_employees_ranges || lead.employees || lead.company_size || '')
  const revenue = lead.organization_annual_revenue_printed || lead.company_annual_revenue_clean || lead.annual_revenue
  const founded = String(lead.organization_founded_year || lead.founded_year || '')
  const linkedin = String(lead.linkedin_url || lead.linkedin || '')
  const website = String(lead.organization_website_url || lead.website || lead.company_website || '')
  const emailStatus = String(lead.email_status || lead.contact_email_status || '')

  const color = avatarColor(name)
  const abbr = initials(name)
  const revFmt = formatRevenue(revenue)
  const revNum = parseRevenue(revenue)
  const isHighRevenue = revNum >= 1e6

  return (
    <div
      className="lead-card"
      onClick={() => onOpen(index)}
      title="Ver detalle completo"
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 12px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="avatar" style={{ background: color }}>{abbr}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '14px',
              color: '#F1F5F9',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#94A3B8',
              marginTop: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={title}
          >
            {title || '—'}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#64748B',
              marginTop: '1px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={company}
          >
            {company || '—'}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px' }}>
            <span style={{ fontSize: '14px' }}>📧</span>
            <span
              style={{
                fontSize: '12px',
                color: '#94A3B8',
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={email}
            >
              {email}
            </span>
            {(emailStatus === 'Validado' || emailStatus === 'verified') && (
              <span
                style={{
                  fontSize: '10px',
                  background: 'rgba(16,185,129,0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: '4px',
                  padding: '1px 5px',
                }}
              >
                ✓
              </span>
            )}
            <button
              className="copy-btn"
              onClick={(e) => { e.stopPropagation(); onCopyEmail(email) }}
              title="Copiar email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        )}

        {linkedin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px' }}>
            <span style={{ fontSize: '14px' }}>💼</span>
            <span style={{ fontSize: '12px', color: '#94A3B8', flex: 1 }}>LinkedIn</span>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: '#64748B', transition: 'color 0.15s' }}
              onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#FACC15' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#64748B' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {website && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>🌐</span>
            <span
              style={{
                fontSize: '12px',
                color: '#94A3B8',
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {website.replace(/^https?:\/\//, '')}
            </span>
            <a
              href={website.startsWith('http') ? website : 'https://' + website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: '#64748B', transition: 'color 0.15s' }}
              onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#FACC15' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#64748B' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Meta */}
      <div style={{ padding: '12px 16px' }}>
        {location && (
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '5px' }}>
            📍 {location}
          </div>
        )}
        {(industry || employees) && (
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '5px' }}>
            🏢 {[industry, employees ? employees + ' emp.' : ''].filter(Boolean).join(' · ')}
          </div>
        )}
        <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {revenue && (
            <span>
              💵{' '}
              {isHighRevenue ? (
                <span className="revenue-badge">{revFmt}</span>
              ) : (
                revFmt
              )}
            </span>
          )}
          {founded && <span>· Est. {founded}</span>}
        </div>
      </div>
    </div>
  )
}
