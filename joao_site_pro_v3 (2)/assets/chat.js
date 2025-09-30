c// /assets/chat.js
const form = document.querySelector('#aiChatForm');
const input = document.querySelector('#aiChatInput');
const box = document.querySelector('#aiChatBox'); // div que recebe as bolhas

function addBubble(who, text) {
  const li = document.createElement('div');
  li.className = 'bubble ' + (who === 'user' ? 'user' : 'bot');
  li.textContent = text;
  box.appendChild(li);
  box.scrollTop = box.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;

  addBubble('user', q);
  input.value = '';
  try {
    const r = await fetch('/api/ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q })
    });
    const data = await r.json();
    addBubble('bot', data.reply || 'Sem resposta.');
  } catch (err) {
    addBubble('bot', 'Falha na IA. Tente novamente.');
  }
});

