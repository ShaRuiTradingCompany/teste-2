// /assets/diferenciais.js
(function(){
  // Seleciona somente as seções abaixo do herói
  const slices = document.querySelectorAll('.diff-deep .slice');
  if (!slices.length) return;

  // Respeita usuários que preferem menos movimento
  const reduceMotion = window.matchMedia &&
                       window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Se não houver IntersectionObserver ou usuário pedir menos movimento,
  // mostramos tudo de uma vez (sem animação).
  if (!('IntersectionObserver' in window) || reduceMotion) {
    slices.forEach(s => s.classList.add('in-view'));
    return;
  }

  // Observa entrada e saída de cada slice na janela de visualização
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      // Quando 22% do bloco estiver visível, consideramos "em cena"
      if (entry.intersectionRatio > 0.22) {
        entry.target.classList.add('in-view');
      } else {
        // Ao sair do viewport, volta ao estado inicial (para animar novamente)
        entry.target.classList.remove('in-view');
      }
    }
  }, {
    // Vários thresholds dão suavidade na troca
    threshold: [0, 0.12, 0.22, 0.32, 0.5, 0.75, 1],
    rootMargin: '0px 0px -8% 0px' // liga um pouco antes do fim do viewport
  });

  slices.forEach(s => io.observe(s));
})();

