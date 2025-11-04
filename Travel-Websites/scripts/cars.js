/* ====== Datos de vehículos (modifica lo que necesites) ====== */
const VEHICLES = [
  {
    id: 'eclass',
    name: 'Mercedes E-Class Avantgarde',
    class: 'Business Class',
    img: 'https://limousineservice.pl/media/cars/full/479e41181a8cb4e68a4acf16bcb157da761b6c3b.webp',
    thumb: 'https://limousineservice.pl/media/cars/small/479e41181a8cb4e68a4acf16bcb157da761b6c3b.webp',
    passengers: 4,
    bags: 4,
    features: [
      'Free InCar hotspot internet WiFi',
      'Mobile device chargers',
      'Mineral water & mints',
      'Leather seating upholstery',
      'Dark rear windows',
      'Two-zone automatic climate',
    ]
  },
  {
    id: 'sclass',
    name: 'Mercedes S-Class long',
    class: 'Luxury Class',
    img: 'https://limousineservice.pl/media/cars/full/9f7e5b9d7506860679f7b7c5e66f3b4235f18f95.webp',
    thumb: 'https://limousineservice.pl/media/cars/small/9f7e5b9d7506860679f7b7c5e66f3b4235f18f95.webp',
    passengers: 4,
    bags: 4,
    features: [
      'Executive rear seats',
      'Burmester audio',
      'Ambient lighting',
      'Complimentary water',
      'Two-zone climate control'
    ]
  },
  {
    id: 'bmw7',
    name: 'BMW 7 Series long',
    class: 'Luxury Class',
    img: 'https://limousineservice.pl/media/cars/full/9b39a0f0d1f3d5f4cb8a26b18c57a9ed253b0b3a.webp',
    thumb: 'https://limousineservice.pl/media/cars/small/9b39a0f0d1f3d5f4cb8a26b18c57a9ed253b0b3a.webp',
    passengers: 4,
    bags: 4,
    features: [
      'Panoramic roof',
      'Comfort seats',
      'Silent cabin',
      'Bottled water',
      'USB-C chargers'
    ]
  },
  {
    id: 's560',
    name: 'Mercedes S-Class 560 4Matic AMG long',
    class: 'Luxury Class',
    img: 'https://limousineservice.pl/media/cars/full/6a3a6456b3c51a8ac3c6385b0a0bfa2f7f7a5f59.webp',
    thumb: 'https://limousineservice.pl/media/cars/small/6a3a6456b3c51a8ac3c6385b0a0bfa2f7f7a5f59.webp',
    passengers: 4,
    bags: 4,
    features: [
      'AMG package',
      'Adaptive suspension',
      'Executive lounge',
      'Climate control'
    ]
  },
  {
    id: 'range',
    name: 'Range Rover Autobiography',
    class: 'Luxury SUV Class',
    img: 'https://limousineservice.pl/media/cars/full/6b52e2b6b3f9e4d34e2a1e7fa690cf4a7a0a3a54.webp',
    thumb: 'https://limousineservice.pl/media/cars/small/6b52e2b6b3f9e4d34e2a1e7fa690cf4a7a0a3a54.webp',
    passengers: 4,
    bags: 4,
    features: [
      'All-wheel drive',
      'Command seating',
      'Spacious rear cabin',
      'USB & 12V outlets'
    ]
  }
];

/* ====== Elementos ====== */
const strip = document.getElementById('carsStrip');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const detailImg       = document.getElementById('detailImg');
const detailTitle     = document.getElementById('detailTitle');
const detailClass     = document.getElementById('detailClass');
const detailPassengers= document.getElementById('detailPassengers');
const detailBags      = document.getElementById('detailBags');
const detailFeatures  = document.getElementById('detailFeatures');

/* Botón opcional para bajar desde el hero al carrusel */
const scrollAllBtn    = document.getElementById('scrollAllCars');

/* ====== Render: strip ====== */
function renderStrip(){
  strip.innerHTML = VEHICLES.map(v => `
    <article class="car-chip" data-id="${v.id}" tabindex="0">
      <img src="${v.thumb}" alt="${v.name}">
      <h3>${v.name}</h3>
      <div class="sub">${v.class}</div>
    </article>
  `).join('');
}

/* ====== Helpers extra (no rompen tu lógica) ====== */
function vehicleById(id){ return VEHICLES.find(x => x.id === id); }

function ensureChipInView(id){
  const chip = strip.querySelector(`.car-chip[data-id="${id}"]`);
  if (!chip) return;
  const chipRect = chip.getBoundingClientRect();
  const wrapRect = strip.getBoundingClientRect();
  const delta = (chipRect.left + chipRect.width/2) - (wrapRect.left + wrapRect.width/2);
  strip.scrollBy({ left: delta, behavior: 'smooth' });
}

function markActive(id){
  document.querySelectorAll('.car-chip').forEach(ch => ch.classList.remove('active'));
  const active = document.querySelector(`.car-chip[data-id="${id}"]`);
  if (active) active.classList.add('active');
}

/* Actualiza la URL para deep-linking (?car=ID) sin recargar */
function updateURL(id){
  const url = new URL(window.location.href);
  url.searchParams.set('car', id);
  history.replaceState({}, '', url);
}

/* ====== Render: detalle ====== */
function renderDetail(v){
  detailImg.src = v.img;
  detailImg.alt = v.name;
  detailTitle.textContent = v.name;
  detailClass.textContent = v.class;
  detailPassengers.textContent = v.passengers;
  detailBags.textContent = v.bags;
  detailFeatures.innerHTML = v.features.map(f => `<li>${f}</li>`).join('');

  // marcar activo en el strip
  markActive(v.id);

  // centrar chip visible + actualizar URL
  ensureChipInView(v.id);
  updateURL(v.id);

  // pequeña animación reveal (si tienes CSS .reveal-up / .is-visible)
  const container = detailTitle.closest('.car-detail-card') || detailTitle.closest('.car-detail');
  if (container) {
    container.classList.remove('is-visible');
    // fuerza reflow para reiniciar
    void container.offsetWidth;
    container.classList.add('is-visible');
  }
}

/* ====== Listeners ====== */
function attachEvents(){
  strip.addEventListener('click', e => {
    const chip = e.target.closest('.car-chip');
    if (!chip) return;
    const id = chip.dataset.id;
    const v = vehicleById(id);
    if (v) renderDetail(v);
  });

  strip.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const chip = e.target.closest('.car-chip');
      if (!chip) return;
      const id = chip.dataset.id;
      const v = vehicleById(id);
      if (v) renderDetail(v);
    }
  });

  const step = () => strip.clientWidth * 0.8;
  prevBtn.addEventListener('click', () => strip.scrollBy({left:-step(), behavior:'smooth'}));
  nextBtn.addEventListener('click', () => strip.scrollBy({left: step(), behavior:'smooth'}));

  /* --- Mejoras: scroll horizontal con rueda / Shift+wheel --- */
  strip.addEventListener('wheel', (e) => {
    const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (horizontalIntent || e.shiftKey) {
      e.preventDefault();
      const dx = horizontalIntent ? e.deltaX : e.deltaY;
      strip.scrollBy({ left: dx, behavior: 'auto' });
    }
  }, { passive: false });

  /* --- Navegación con flechas --- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') strip.scrollBy({ left: step()/1.5, behavior: 'smooth' });
    if (e.key === 'ArrowLeft')  strip.scrollBy({ left:-step()/1.5, behavior: 'smooth' });
  });

  /* --- Botón "Scroll all cars" (opcional) --- */
  if (scrollAllBtn) {
    scrollAllBtn.addEventListener('click', () => {
      const wrap = strip.parentElement || strip;
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

/* ====== Reveal genérico (para .reveal-up) ====== */
(function setupReveal(){
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ====== Deep-link: ?car=ID al cargar ====== */
function bootFromQueryOrDefault(){
  const params = new URLSearchParams(location.search);
  const id = params.get('car');
  const found = id && vehicleById(id);
  renderDetail(found || VEHICLES[0]);
}

/* ====== Init ====== */
renderStrip();
attachEvents();
bootFromQueryOrDefault(); // antes llamabas renderDetail(VEHICLES[0])
