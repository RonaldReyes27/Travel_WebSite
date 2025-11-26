/* ====== Datos de vehículos (modifica lo que necesites) ====== */
const VEHICLES = [
  {
    id: 'Minivan',
    name: 'Hyundai Starex',
    class: 'Minivan',
    img: '/medias/van.jpg',
    thumb: '/medias/van.jpg',
    passengers: 6,
    bags: 6,
    features: [
      'Free InCar hotspot internet WiFi',
      'Mobile device chargers',
      'Water',
      'Leather seating upholstery',
      'Dark rear windows',
      'Two-zone automatic climate',
      'Comfort seats',
      'Silent cabin',
      'Climate control',
    ]
  },
  {
    id: 'Van',
    name: 'Toyoya Hiace',
    class: 'Van',
    img: '/medias/vann.jpg',
    thumb: '/medias/vann.jpg',
    passengers: 10,
    bags: 10,
    features: [
      'Free InCar hotspot internet WiFi',
      'Mobile device chargers',
      'Water',
      'Leather seating upholstery',
      'Dark rear windows',
      'Two-zone automatic climate',
      'Comfort seats',
      'Silent cabin',
      'Climate control',
    ]
  },
  {
    id: 'Bus',
    name: 'Bus',
    class: 'Bus',
    img: '/medias/bus.jpg',
    thumb: '/medias/bus.jpg',
    passengers: 49,
    bags: 49,
    features: [
      'Free InCar hotspot internet WiFi',
      'Mobile device chargers',
      'Water',
      'Leather seating upholstery',
      'Dark rear windows',
      'Two-zone automatic climate',
      'Comfort seats',
      'Silent cabin',
      'Climate control',
    ]
  },
  {
    id: 'Luxury Suburban',
    name: 'Chevrolet Suburban',
    class: 'Luxury Suburban',
    img: '/medias/suburban.jpg',
    thumb: '/medias/suburban.jpg',
    passengers: 5,
    bags: 5,
    features: [
      'Free InCar hotspot internet WiFi',
      'Mobile device chargers',
      'Water',
      'Leather seating upholstery',
      'Dark rear windows',
      'Two-zone automatic climate',
      'Comfort seats',
      'Silent cabin',
      'Climate control',
      'Luxury Car',
    ]
  },
  {
    id: 'Luxury Cadillac',
    name: 'Cadillac Escalade',
    class: 'Luxury Cadillac',
    img: '/medias/cadillac.jpg',
    thumb: '/medias/cadillac.jpg',
    passengers: 4,
    bags: 4,
    features: [
      'Free InCar hotspot internet WiFi',
      'Mobile device chargers',
      'Water',
      'Leather seating upholstery',
      'Dark rear windows',
      'Two-zone automatic climate',
      'Comfort seats',
      'Silent cabin',
      'Climate control',
      'Luxury Car',
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


/* ====== Helper ====== */
function vehicleById(id){ 
  return VEHICLES.find(x => x.id === id); 
}


/* ====== SCROLL SUAVE SIN BUG DE CHROME ====== */
function smoothScrollStrip(delta) {
  const duration = 250;
  const start = strip.scrollLeft;
  const end = start + delta;
  const startTime = performance.now();

  function animate(t) {
    const progress = Math.min((t - startTime) / duration, 1);
    strip.scrollLeft = start + (end - start) * progress;
    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


/* ====== Centrar chip ====== */
function ensureChipInView(id){
  const chip = strip.querySelector(`.car-chip[data-id="${id}"]`);
  if (!chip) return;

  const chipRect = chip.getBoundingClientRect();
  const wrapRect = strip.getBoundingClientRect();

  const delta = (chipRect.left + chipRect.width / 2) - 
                (wrapRect.left + wrapRect.width / 2);

  smoothScrollStrip(delta);
}


/* ====== Marcar activo ====== */
function markActive(id){
  document.querySelectorAll('.car-chip').forEach(ch => ch.classList.remove('active'));
  const active = document.querySelector(`.car-chip[data-id="${id}"]`);
  if (active) active.classList.add('active');
}


/* ====== URL ====== */
function updateURL(id){
  const url = new URL(window.location.href);
  url.searchParams.set('car', id);
  history.replaceState({}, '', url);
}


/* ====== Render detalle ====== */
function renderDetail(v){
  detailImg.src = v.img;
  detailImg.alt = v.name;
  detailTitle.textContent = v.name;
  detailClass.textContent = v.class;
  detailPassengers.textContent = v.passengers;
  detailBags.textContent = v.bags;
  detailFeatures.innerHTML = v.features.map(f => `<li>${f}</li>`).join('');

  markActive(v.id);
  ensureChipInView(v.id);
  updateURL(v.id);
}


/* ====== Eventos ====== */
function attachEvents(){

  /* Click chips */
  strip.addEventListener('click', e => {
    const chip = e.target.closest('.car-chip');
    if (!chip) return;
    const v = vehicleById(chip.dataset.id);
    if (v) renderDetail(v);
  });

  /* Enter para chips */
  strip.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const chip = e.target.closest('.car-chip');
      if (!chip) return;
      const v = vehicleById(chip.dataset.id);
      if (v) renderDetail(v);
    }
  });

  /* Botones prev / next SIN smooth nativo */
  const step = () => strip.clientWidth * 0.8;

  prevBtn.addEventListener('click', () => 
    smoothScrollStrip(-step())
  );

  nextBtn.addEventListener('click', () => 
    smoothScrollStrip(step())
  );

  /* Scroll horizontal con SHIFT + rueda */
  strip.addEventListener('wheel', (e) => {
    if (e.shiftKey) {
      e.preventDefault();
      smoothScrollStrip(e.deltaY);
    }
  }, { passive: false });
}


/* ====== Deep link ====== */
function bootFromQueryOrDefault(){
  const params = new URLSearchParams(location.search);
  const id = params.get('car');
  const found = id && vehicleById(id);
  renderDetail(found || VEHICLES[0]);
}


/* ====== Init ====== */
renderStrip();
attachEvents();
bootFromQueryOrDefault();
