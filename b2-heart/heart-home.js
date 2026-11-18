import { mountHeart } from './b2-heart.js';

const stage = document.querySelector('[data-b2-heart]');
const touch = document.querySelector('[data-heart-touch]');

if (stage && touch) {
  let scene;
  let replayRequested = false;
  let fallbackTimer;
  const showFallbackTear = () => {
    stage.classList.remove('heart-fallback--tear');
    requestAnimationFrame(() => {
      stage.classList.add('heart-fallback--tear');
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(() => stage.classList.remove('heart-fallback--tear'), 1250);
    });
  };
  const interact = () => {
    if (scene && stage.hasAttribute('data-heart-ready')) {
      scene.triggerTear();
    } else {
      replayRequested = true;
      showFallbackTear();
    }
  };

  touch.addEventListener('click', interact);
  stage.addEventListener('click', (event) => {
    if (!stage.hasAttribute('data-heart-ready') && event.target.closest('.heart-silhouette')) interact();
  });

  const ready = new MutationObserver(() => {
    if (!stage.hasAttribute('data-heart-ready')) return;
    ready.disconnect();
    if (replayRequested) scene?.triggerTear();
  });
  ready.observe(stage, { attributes: true, attributeFilter: ['data-heart-ready'] });
  mountHeart(stage).then(mounted => {
    scene = mounted;
  }).catch(() => {
    ready.disconnect();
    stage.querySelector('canvas')?.remove();
  });
}
