'use client'

import { useState, useRef } from 'react'

// ============================================================
// DATA
// ============================================================
const SENIORITY = ['Founder', 'Owner', 'C-Suite / Executive', 'VP', 'Director', 'Manager', 'Senior', 'Entry Level', 'Intern']

const FUNCTIONAL = ['C-Suite', 'Finanzas', 'Product Management', 'Ingeniería', 'Diseño', 'Educación', 'Recursos Humanos', 'Tecnología', 'Legal', 'Marketing', 'Operaciones', 'Ventas', 'Soporte']

const LOCATION_INCLUDE = ['Spain', 'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Netherlands', 'Portugal', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Chile', 'India', 'Canada', 'Australia', 'Europe/EMEA', 'Latin America']

const LOCATION_EXCLUDE = ['Spain', 'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Netherlands', 'Portugal', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Chile', 'India', 'Canada', 'Australia']

const EMAIL_STATUS = ['Validado', 'No Validado', 'Desconocido']

const COMPANY_SIZE = ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001-2000', '2001-5000', '5001-10000', '10001-20000', '20001-50000', '50000+']

const INDUSTRIES = [
  'Information Technology & Services', 'Construction', 'Marketing & Advertising', 'Real Estate',
  'Health Wellness & Fitness', 'Management Consulting', 'Computer Software', 'Internet',
  'Retail', 'Consumer Services', 'Hospital & Health Care', 'Financial Services', 'Automotive',
  'Restaurants', 'Education Management', 'Food & Beverages', 'Design', 'Hospitality',
  'Events Services', 'Accounting', 'Nonprofit Organization Management', 'Leisure Travel & Tourism',
  'Professional Training & Coaching', 'Telecommunications', 'Insurance', 'Banking',
  'Logistics & Supply Chain', 'Human Resources', 'Staffing & Recruiting', 'Legal Services',
  'Law Practice', 'Media Production', 'Publishing', 'E-learning', 'Higher Education', 'Research',
  'Biotechnology', 'Pharmaceuticals', 'Medical Devices', 'Medical Practice', 'Investment Management',
  'Venture Capital & Private Equity', 'Investment Banking', 'Architecture & Planning',
  'Civil Engineering', 'Mechanical or Industrial Engineering', 'Oil & Energy',
  'Renewables & Environment', 'Consumer Goods', 'Luxury Goods & Jewelry', 'Apparel & Fashion',
  'Cosmetics', 'Wholesale', 'Import & Export', 'Transportation/Trucking/Railroad',
  'Aviation & Aerospace', 'Defense & Space', 'Government Administration',
  'Security & Investigations', 'Computer & Network Security', 'Computer Hardware',
  'Computer Networking', 'Semiconductors', 'Online Media', 'Broadcast Media', 'Entertainment',
  'Music', 'Sports', 'Sporting Goods', 'Computer Games',
]

const FUNDING = ['Seed Round', 'Angel Round', 'Series A', 'Series B', 'Series C', 'Series D', 'Series E', 'Series F', 'Venture Round', 'Debt Financing', 'Convertible Note', 'Private Equity Round', 'Other Round']

const REVENUE_OPTIONS = [
  { value: '', label: 'Sin límite' },
  { value: '100K', label: '100K' },
  { value: '500K', label: '500K' },
  { value: '1M', label: '1M' },
  { value: '5M', label: '5M' },
  { value: '10M', label: '10M' },
  { value: '25M', label: '25M' },
  { value: '50M', label: '50M' },
  { value: '100M', label: '100M' },
  { value: '500M', label: '500M' },
  { value: '1B', label: '1B' },
  { value: '5B', label: '5B' },
  { value: '10B', label: '10B' },
]

// ============================================================
// TYPES
// ============================================================
export interface FormData {
  leadsCount: number
  fileLabel: string
  jobTitlesInclude: string
  jobTitlesExclude: string
  seniority: string[]
  functional: string[]
  locationInclude: string[]
  cityInclude: string
  locationExclude: string[]
  cityExclude: string
  emailStatus: string[]
  companyDomain: string
  companySize: string[]
  industriesInclude: string[]
  industriesExclude: string[]
  keywordsInclude: string
  keywordsExclude: string
  revenueMin: string
  revenueMax: string
  funding: string[]
}

interface SearchFormProps {
  onSubmit: (data: FormData) => void
  errorMessage: string | null
}

// ============================================================
// CHECKBOX GROUP COMPONENT
// ============================================================
function CheckboxGroup({
  name,
  values,
  checked,
  onChange,
  style,
}: {
  name: string
  values: string[]
  checked: string[]
  onChange: (name: string, values: string[]) => void
  style?: React.CSSProperties
}) {
  const toggle = (v: string) => {
    if (checked.includes(v)) {
      onChange(name, checked.filter((x) => x !== v))
    } else {
      onChange(name, [...checked, v])
    }
  }

  return (
    <div className="checkbox-grid" style={style}>
      {values.map((v) => (
        <label key={v} className="checkbox-item">
          <input
            type="checkbox"
            checked={checked.includes(v)}
            onChange={() => toggle(v)}
          />
          {v}
        </label>
      ))}
    </div>
  )
}

// ============================================================
// INDUSTRY CHECKBOX GROUP (filterable)
// ============================================================
function IndustryCheckboxGroup({
  name,
  checked,
  onChange,
}: {
  name: string
  checked: string[]
  onChange: (name: string, values: string[]) => void
}) {
  const [query, setQuery] = useState('')
  const filtered = INDUSTRIES.filter((v) =>
    v.toLowerCase().includes(query.toLowerCase())
  )

  const toggle = (v: string) => {
    if (checked.includes(v)) {
      onChange(name, checked.filter((x) => x !== v))
    } else {
      onChange(name, [...checked, v])
    }
  }

  return (
    <>
      <input
        type="text"
        className="industry-search"
        placeholder="Buscar industria..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="checkbox-grid">
        {filtered.map((v) => (
          <label key={v} className="checkbox-item">
            <input
              type="checkbox"
              checked={checked.includes(v)}
              onChange={() => toggle(v)}
            />
            {v}
          </label>
        ))}
      </div>
    </>
  )
}

// ============================================================
// ACCORDION SECTION
// ============================================================
function AccordionSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ marginBottom: '12px' }}>
      <div className="section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <svg
          className={`chevron${open ? ' open' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#94A3B8"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && <div className="section-content">{children}</div>}
    </div>
  )
}

// ============================================================
// CTRL ROW COMPONENT
// ============================================================
function CtrlRow({
  label,
  onSelectAll,
  onClear,
}: {
  label: string
  onSelectAll: () => void
  onClear: () => void
}) {
  return (
    <div className="ctrl-row">
      <label className="form-label" style={{ margin: 0 }}>{label}</label>
      <div>
        <button type="button" className="ctrl-btn" onClick={onSelectAll}>Seleccionar todo</button>
        <button type="button" className="ctrl-btn" onClick={onClear}>Limpiar</button>
      </div>
    </div>
  )
}

// ============================================================
// MAIN SEARCH FORM
// ============================================================
export default function SearchForm({ onSubmit, errorMessage }: SearchFormProps) {
  const [formData, setFormData] = useState<FormData>({
    leadsCount: 100000,
    fileLabel: 'Prospects',
    jobTitlesInclude: '',
    jobTitlesExclude: '',
    seniority: [],
    functional: [],
    locationInclude: [],
    cityInclude: '',
    locationExclude: [],
    cityExclude: '',
    emailStatus: [],
    companyDomain: '',
    companySize: [],
    industriesInclude: [],
    industriesExclude: [],
    keywordsInclude: '',
    keywordsExclude: '',
    revenueMin: '',
    revenueMax: '',
    funding: [],
  })

  const setTextField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const setCheckboxField = (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>
          Nueva Búsqueda
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Configura los filtros para extraer leads cualificados de Apollo via Apify.
        </p>
      </div>

      {errorMessage && (
        <div className="error-banner">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ========= SECTION 1: Configuración General ========= */}
        <AccordionSection title="⚙️  Configuración General">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Número de leads</label>
              <input
                type="number"
                className="form-input"
                value={formData.leadsCount}
                min={1}
                max={100000}
                onChange={(e) => setTextField('leadsCount', parseInt(e.target.value) || 100000)}
              />
            </div>
            <div>
              <label className="form-label">Nombre del archivo / Label</label>
              <input
                type="text"
                className="form-input"
                value={formData.fileLabel}
                placeholder="Prospects"
                onChange={(e) => setTextField('fileLabel', e.target.value)}
              />
            </div>
          </div>
        </AccordionSection>

        {/* ========= SECTION 2: Cargo y Seniority ========= */}
        <AccordionSection title="👤  Cargo y Seniority">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label className="form-label">Títulos a INCLUIR</label>
              <input
                type="text"
                className="form-input"
                placeholder="CEO, Founder, Director de Marketing"
                value={formData.jobTitlesInclude}
                onChange={(e) => setTextField('jobTitlesInclude', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Títulos a EXCLUIR</label>
              <input
                type="text"
                className="form-input"
                placeholder="Intern, Assistant"
                value={formData.jobTitlesExclude}
                onChange={(e) => setTextField('jobTitlesExclude', e.target.value)}
              />
            </div>
          </div>

          {/* Seniority */}
          <div style={{ marginBottom: '20px' }}>
            <CtrlRow
              label="Nivel de Seniority"
              onSelectAll={() => setCheckboxField('seniority', [...SENIORITY])}
              onClear={() => setCheckboxField('seniority', [])}
            />
            <CheckboxGroup
              name="seniority"
              values={SENIORITY}
              checked={formData.seniority}
              onChange={setCheckboxField}
            />
          </div>

          {/* Functional */}
          <div>
            <CtrlRow
              label="Nivel Funcional"
              onSelectAll={() => setCheckboxField('functional', [...FUNCTIONAL])}
              onClear={() => setCheckboxField('functional', [])}
            />
            <CheckboxGroup
              name="functional"
              values={FUNCTIONAL}
              checked={formData.functional}
              onChange={setCheckboxField}
            />
          </div>
        </AccordionSection>

        {/* ========= SECTION 3: Ubicación ========= */}
        <AccordionSection title="📍  Ubicación">
          {/* Location Include */}
          <div style={{ marginBottom: '20px' }}>
            <CtrlRow
              label="Países a INCLUIR"
              onSelectAll={() => setCheckboxField('locationInclude', [...LOCATION_INCLUDE])}
              onClear={() => setCheckboxField('locationInclude', [])}
            />
            <CheckboxGroup
              name="locationInclude"
              values={LOCATION_INCLUDE}
              checked={formData.locationInclude}
              onChange={setCheckboxField}
            />
          </div>

          {/* City Include */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Ciudades a INCLUIR</label>
            <input
              type="text"
              className="form-input"
              placeholder="Barcelona, Madrid, Valencia"
              value={formData.cityInclude}
              onChange={(e) => setTextField('cityInclude', e.target.value)}
            />
          </div>

          {/* Location Exclude */}
          <div style={{ marginBottom: '20px' }}>
            <CtrlRow
              label="Países a EXCLUIR"
              onSelectAll={() => setCheckboxField('locationExclude', [...LOCATION_EXCLUDE])}
              onClear={() => setCheckboxField('locationExclude', [])}
            />
            <CheckboxGroup
              name="locationExclude"
              values={LOCATION_EXCLUDE}
              checked={formData.locationExclude}
              onChange={setCheckboxField}
            />
          </div>

          {/* City Exclude */}
          <div>
            <label className="form-label">Ciudades a EXCLUIR</label>
            <input
              type="text"
              className="form-input"
              placeholder="Berlin, Munich"
              value={formData.cityExclude}
              onChange={(e) => setTextField('cityExclude', e.target.value)}
            />
          </div>
        </AccordionSection>

        {/* ========= SECTION 4: Estado del Email ========= */}
        <AccordionSection title="📧  Estado del Email">
          <CtrlRow
            label="Estado del Email"
            onSelectAll={() => setCheckboxField('emailStatus', [...EMAIL_STATUS])}
            onClear={() => setCheckboxField('emailStatus', [])}
          />
          <CheckboxGroup
            name="emailStatus"
            values={EMAIL_STATUS}
            checked={formData.emailStatus}
            onChange={setCheckboxField}
            style={{ gridTemplateColumns: 'repeat(3, max-content)', gap: '10px' }}
          />
        </AccordionSection>

        {/* ========= SECTION 5: Empresa ========= */}
        <AccordionSection title="🏢  Empresa">
          {/* Company domain */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Dominios a INCLUIR</label>
            <input
              type="text"
              className="form-input"
              placeholder="google.com, apple.com"
              value={formData.companyDomain}
              onChange={(e) => setTextField('companyDomain', e.target.value)}
            />
          </div>

          {/* Company size */}
          <div style={{ marginBottom: '20px' }}>
            <CtrlRow
              label="Tamaño de empresa"
              onSelectAll={() => setCheckboxField('companySize', [...COMPANY_SIZE])}
              onClear={() => setCheckboxField('companySize', [])}
            />
            <CheckboxGroup
              name="companySize"
              values={COMPANY_SIZE}
              checked={formData.companySize}
              onChange={setCheckboxField}
            />
          </div>

          {/* Industries Include */}
          <div style={{ marginBottom: '20px' }}>
            <CtrlRow
              label="Industrias a INCLUIR"
              onSelectAll={() => setCheckboxField('industriesInclude', [...INDUSTRIES])}
              onClear={() => setCheckboxField('industriesInclude', [])}
            />
            <IndustryCheckboxGroup
              name="industriesInclude"
              checked={formData.industriesInclude}
              onChange={setCheckboxField}
            />
          </div>

          {/* Industries Exclude */}
          <div style={{ marginBottom: '20px' }}>
            <CtrlRow
              label="Industrias a EXCLUIR"
              onSelectAll={() => setCheckboxField('industriesExclude', [...INDUSTRIES])}
              onClear={() => setCheckboxField('industriesExclude', [])}
            />
            <IndustryCheckboxGroup
              name="industriesExclude"
              checked={formData.industriesExclude}
              onChange={setCheckboxField}
            />
          </div>

          {/* Keywords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Keywords a INCLUIR</label>
              <input
                type="text"
                className="form-input"
                placeholder="SaaS, B2B, ecommerce"
                value={formData.keywordsInclude}
                onChange={(e) => setTextField('keywordsInclude', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Keywords a EXCLUIR</label>
              <input
                type="text"
                className="form-input"
                placeholder="freelance, agency"
                value={formData.keywordsExclude}
                onChange={(e) => setTextField('keywordsExclude', e.target.value)}
              />
            </div>
          </div>
        </AccordionSection>

        {/* ========= SECTION 6: Financiación ========= */}
        <AccordionSection title="💰  Financiación">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label className="form-label">Facturación mínima</label>
              <select
                className="form-input"
                value={formData.revenueMin}
                onChange={(e) => setTextField('revenueMin', e.target.value)}
              >
                {REVENUE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Facturación máxima</label>
              <select
                className="form-input"
                value={formData.revenueMax}
                onChange={(e) => setTextField('revenueMax', e.target.value)}
              >
                {REVENUE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <CtrlRow
              label="Ronda de financiación"
              onSelectAll={() => setCheckboxField('funding', [...FUNDING])}
              onClear={() => setCheckboxField('funding', [])}
            />
            <CheckboxGroup
              name="funding"
              values={FUNDING}
              checked={formData.funding}
              onChange={setCheckboxField}
            />
          </div>
        </AccordionSection>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button type="submit" className="btn-submit">
            🚀 Iniciar Búsqueda
          </button>
        </div>
      </form>
    </div>
  )
}
