import { NextRequest, NextResponse } from 'next/server'

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  'https://n8n-n8n.d4s5yj.easypanel.host/webhook-test/dc54a98e-e210-4199-bdaa-a23fa92af29c'

const FIELD_MAP: Record<string, string> = {
  leadsCount: 'Número de leads a extraer',
  fileLabel: 'Nombre del archivo / Label',
  jobTitlesInclude: 'Títulos de trabajo a INCLUIR (separados por comas)',
  jobTitlesExclude: 'Títulos de trabajo a EXCLUIR (separados por comas)',
  seniority: 'Nivel de Seniority (selecciona uno o varios)',
  functional: 'Nivel Funcional (selecciona uno o varios)',
  locationInclude: 'Ubicación a INCLUIR (selecciona uno o varios países/regiones)',
  cityInclude: 'Ciudades a INCLUIR (separadas por comas)',
  locationExclude: 'Ubicación a EXCLUIR (selecciona uno o varios países/regiones)',
  cityExclude: 'Ciudades a EXCLUIR (separadas por comas)',
  emailStatus: 'Estado del Email',
  companyDomain: 'Dominios de empresa a INCLUIR (separados por comas)',
  companySize: 'Tamaño de empresa (selecciona uno o varios)',
  industriesInclude: 'Industrias a INCLUIR (selecciona una o varias)',
  industriesExclude: 'Industrias a EXCLUIR (selecciona una o varias)',
  keywordsInclude: 'Keywords de empresa a INCLUIR (separadas por comas)',
  keywordsExclude: 'Keywords de empresa a EXCLUIR (separadas por comas)',
  revenueMin: 'Facturación mínima',
  revenueMax: 'Facturación máxima',
  funding: 'Ronda de financiación (selecciona una o varias)',
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const data = await req.json() as Record<string, unknown>
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(data)) {
      const n8nKey = FIELD_MAP[key] || key
      if (Array.isArray(value) && value.length > 0) {
        params.append(n8nKey, (value as string[]).join(','))
      } else if (value !== null && value !== undefined && value !== '') {
        params.append(n8nKey, String(value))
      }
    }

    const url = `${N8N_WEBHOOK_URL}?${params.toString()}`
    console.log('[submit] -> n8n:', url.substring(0, 120) + '...')

    const controller = new AbortController()
    const tid = setTimeout(() => controller.abort(), 295000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(tid)

    const text = await response.text()
    let result: unknown
    try {
      result = JSON.parse(text)
    } catch {
      result = { message: text }
    }

    return NextResponse.json(result, { status: response.status, headers })
  } catch (err: unknown) {
    const error = err as Error
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Timeout: El workflow tardó demasiado en responder' },
        { status: 504, headers }
      )
    }
    console.error('[submit] error:', error)
    return NextResponse.json(
      { error: 'Error interno del proxy', details: error.message },
      { status: 500, headers }
    )
  }
}
