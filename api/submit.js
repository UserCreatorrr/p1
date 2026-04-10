const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  'https://n8n-n8n.d4s5yj.easypanel.host/webhook-test/dc54a98e-e210-4199-bdaa-a23fa92af29c';

const FIELD_MAP = {
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
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(data)) {
      const n8nKey = FIELD_MAP[key] || key;
      if (Array.isArray(value) && value.length > 0) {
        params.append(n8nKey, value.join(','));
      } else if (value !== null && value !== undefined && value !== '') {
        params.append(n8nKey, String(value));
      }
    }

    const url = `${N8N_WEBHOOK_URL}?${params.toString()}`;
    console.log('[submit] -> n8n:', url.substring(0, 120) + '...');

    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 295000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(tid);

    const text = await response.text();
    let result;
    try { result = JSON.parse(text); } catch { result = { message: text }; }

    return res.status(response.status).json(result);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout: El workflow tardó demasiado en responder' });
    }
    console.error('[submit] error:', err);
    return res.status(500).json({ error: 'Error interno del proxy', details: err.message });
  }
};
