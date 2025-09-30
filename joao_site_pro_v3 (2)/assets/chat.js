const API_URL = '/api/ia';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;

  addBubble('user', q);
  input.value = '';
  try {
    const r = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q }),
    });
    const data = await r.json();
    addBubble('bot', data.reply || 'Sem resposta.');
  } catch (err) {
    addBubble('bot', 'Falha na IA. Tente novamente.');
  }
});
