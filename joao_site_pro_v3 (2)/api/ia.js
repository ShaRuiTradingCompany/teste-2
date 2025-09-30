// /api/ia.js
export default async function handler(req, res) {
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST em /api/ia' });
  }

  try {
    // Vercel faz o parse do JSON quando Content-Type é application/json
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Faltou "message" no body' });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY não configurada' });

    // Chamada direta ao endpoint da OpenAI (sem dependências)
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',         // pode trocar por 'gpt-3.5-turbo-0125' se necessário
        temperature: 0.2,
        max_tokens: 600,
        messages: [
          {
            role: 'system',
            content: 'Você é o assistente da ShaRui Trading & Co. Responda em PT-BR, com foco em importação, prazos, processos e no que fazemos. Se não souber, seja honesto.'
          },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'Sem resposta da IA', raw: data });
    }

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Falha na IA', details: String(err) });
  }
}

