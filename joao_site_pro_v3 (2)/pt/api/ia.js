// api/ia.js  — Vercel Serverless Function (Node.js, CommonJS)
// Este endpoint recebe a pergunta do chat e responde usando a OpenAI.
// NUNCA exponha sua OPENAI_API_KEY no front-end.

module.exports = async function (req, res) {
  // (Opcional) Se precisar chamar de outro domínio, habilite CORS:
  // res.setHeader('Access-Control-Allow-Origin', 'https://seu-dominio.com');
  // res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST em /api/ia' });
  }

  // Lê o corpo (stream) com segurança em função serverless pura
  const body = await new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
  });

  let payload = {};
  try { payload = body ? JSON.parse(body) : {}; } catch {}

  const { message = '', history = [] } = payload;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY não configurada' });
  }
  if (!message.trim()) {
    return res.status(400).json({ error: 'Envie { message: "sua pergunta" }' });
  }

  const system = {
    role: 'system',
    content:
      'Você é "Sharui Trading & Co.", assistente da ShaRui Trading Company. Responda com precisão e objetividade sobre importação (LCL/FCL), inspeção, ficha técnica PT‑ZH, visita à fábrica, timeline, documentos e custos no Brasil. Se faltar dado, peça o essencial. Não invente.'
  };

  const messages = [system, ...history, { role: 'user', content: message }];

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.4
      })
    });

    const text = await r.text();
    if (!r.ok) {
      return res.status(500).json({ error: 'Falha na IA', details: text });
    }

    const data = JSON.parse(text);
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      'Desculpe, não consegui formular uma resposta agora.';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Erro inesperado', details: String(err) });
  }
};
