// Função serverless simples para testar a rota
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({
    ok: true,
    url: req.url,
    hasKey: !!process.env.OPENAI_API_KEY
  }));
};
