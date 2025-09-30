// /api/ping.js
export default function handler(req, res) {
  // CORS básico (opcional, ajuda em testes)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  res.status(200).json({ ok: true, now: Date.now() });
}

