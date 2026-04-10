'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ background: '#0F172A', color: '#E2E8F0', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Grid overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(250, 204, 21, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(250, 204, 21, 0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Orbs */}
      <div className="orb orb-yellow" />
      <div className="orb orb-grey" />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 32px',
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.png"
              alt="Growth4Clients"
              style={{ height: '36px', width: '36px', objectFit: 'contain', borderRadius: '8px' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.3px' }}>
              Growth<span style={{ color: '#FACC15' }}>4</span>Clients
            </span>
          </div>

          <Link
            href="/app"
            className="fade-up delay-2"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#CBD5E1',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'color 0.15s',
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#FACC15' }}
            onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#CBD5E1' }}
          >
            Iniciar sesión
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </header>

        {/* Hero */}
        <section
          style={{
            textAlign: 'center',
            padding: '80px 24px 64px',
            maxWidth: '896px',
            margin: '0 auto',
          }}
        >
          {/* Badge */}
          <div
            className="fade-up delay-2 glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '9999px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#CBD5E1',
              marginBottom: '32px',
            }}
          >
            <span className="pulse-dot" style={{ color: '#FACC15', fontSize: '10px' }}>●</span>
            Apollo Lead Scraper — Powered by n8n + Apify
          </div>

          {/* H1 */}
          <h1
            className="fade-up delay-3"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: '0 0 24px',
            }}
          >
            Prospección B2B<br />
            <span className="text-gradient">sin fricción.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="fade-up delay-4"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#94A3B8',
              maxWidth: '640px',
              margin: '0 auto 40px',
              lineHeight: 1.65,
            }}
          >
            Extrae miles de leads cualificados de Apollo con filtros avanzados. Automatiza tu prospección B2B y obtén datos enriquecidos en minutos.
          </p>

          {/* CTA */}
          <div className="fade-up delay-5">
            <Link href="/app" className="btn-primary">
              Acceder a la App
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Stats row */}
        <section style={{ padding: '0 24px', maxWidth: '896px', margin: '0 auto 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="glass fade-up delay-6" style={{ borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <div className="stat-number">100K+</div>
              <div style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>Leads por búsqueda</div>
            </div>
            <div className="glass fade-up delay-7" style={{ borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <div className="stat-number">30+</div>
              <div style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>Campos de datos</div>
            </div>
            <div className="glass fade-up delay-8" style={{ borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <div className="stat-number">70+</div>
              <div style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>Industrias disponibles</div>
            </div>
          </div>
        </section>

        {/* Features row */}
        <section style={{ padding: '0 24px', maxWidth: '1280px', margin: '0 auto 96px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Feature 1 */}
            <div className="glass fade-up delay-6" style={{ borderRadius: '16px', padding: '24px' }}>
              <div className="icon-wrap" style={{ marginBottom: '16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#FACC15" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: '0 0 8px' }}>Filtrado Avanzado</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Segmenta por cargo, seniority, industria, tamaño de empresa, revenue, ubicación y más de 30 parámetros.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass fade-up delay-7" style={{ borderRadius: '16px', padding: '24px' }}>
              <div className="icon-wrap" style={{ marginBottom: '16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#FACC15" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: '0 0 8px' }}>Automatización Total</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Pipeline completo: Apollo Scraper via Apify orquestado por n8n. Sin intervención manual, resultados en minutos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass fade-up delay-8" style={{ borderRadius: '16px', padding: '24px' }}>
              <div className="icon-wrap" style={{ marginBottom: '16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#FACC15" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: '0 0 8px' }}>Dashboard Inteligente</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Visualiza, filtra y exporta leads enriquecidos con email verificado, LinkedIn, datos de empresa y revenue.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingBottom: '40px', color: '#334155', fontSize: '14px' }}>
          &copy; 2024 Growth4Clients. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  )
}
