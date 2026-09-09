const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const sticker = document.querySelector('.portrait-stamp');
let stickerPosition = { x: 0, y: 0 };
let stickerDrag = null;

function moveSticker(x, y) {
  stickerPosition = { x, y };
  sticker.style.setProperty('--drag-x', `${x}px`);
  sticker.style.setProperty('--drag-y', `${y}px`);
}

sticker.addEventListener('pointerdown', (event) => {
  stickerDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: stickerPosition.x,
    originY: stickerPosition.y
  };
  sticker.setPointerCapture(event.pointerId);
  sticker.classList.add('is-dragging');
});

sticker.addEventListener('pointermove', (event) => {
  if (!stickerDrag || event.pointerId !== stickerDrag.pointerId) return;
  moveSticker(
    stickerDrag.originX + event.clientX - stickerDrag.startX,
    stickerDrag.originY + event.clientY - stickerDrag.startY
  );
});

function stopStickerDrag(event) {
  if (!stickerDrag || event.pointerId !== stickerDrag.pointerId) return;
  sticker.classList.remove('is-dragging');
  stickerDrag = null;
}

sticker.addEventListener('pointerup', stopStickerDrag);
sticker.addEventListener('pointercancel', stopStickerDrag);
sticker.addEventListener('keydown', (event) => {
  const step = event.shiftKey ? 20 : 8;
  const directions = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step]
  };

  if (event.key === 'Escape' || event.key === 'Home') {
    event.preventDefault();
    moveSticker(0, 0);
    return;
  }

  if (!directions[event.key]) return;
  event.preventDefault();
  moveSticker(stickerPosition.x + directions[event.key][0], stickerPosition.y + directions[event.key][1]);
});

const floatingCta = document.querySelector('.floating-cta');
const trialSection = document.querySelector('#prueba');
const trialObserver = new IntersectionObserver(([entry]) => {
  floatingCta.classList.toggle('is-hidden', entry.isIntersecting);
}, { threshold: 0.15 });
trialObserver.observe(trialSection);

document.querySelector('#trial-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    'Hola Sergio, quiero reservar una clase de prueba de Karate Kyokushin en SHINFIT.',
    '',
    `Nombre: ${data.get('name')}`,
    `Teléfono: ${data.get('phone')}`,
    `Día preferido: ${data.get('day')}`
  ].join('\n');

  window.open(`https://wa.me/34655249066?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

document.querySelector('#year').textContent = new Date().getFullYear();
