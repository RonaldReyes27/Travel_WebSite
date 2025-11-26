// Sticky header shrink
const header = document.getElementById('header');
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('shrink', y > 30);
});

// Mobile menu (simple)
const burger = document.getElementById('burger');
const menu = document.querySelector('.menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  });
}

// ===== Tabs Booking (solo si existen los tabs viejos) =====
const tabs = document.querySelectorAll('.tab');
const formOne = document.getElementById('form-oneway');
const formHour = document.getElementById('form-hourly');

if (tabs.length && formOne && formHour) {
  tabs.forEach(t =>
    t.addEventListener('click', e => {
      tabs.forEach(x => x.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const name = e.currentTarget.dataset.tab;
      formOne.classList.toggle('hidden', name !== 'oneway');
      formHour.classList.toggle('hidden', name !== 'hourly');
    })
  );
}

// Local time hint
function pad(n) { return String(n).padStart(2, '0'); }
function setTZHint(el) {
  if (!el) return;
  const now = new Date();
  el.textContent = `Local time: ${pad(now.getHours())}:${pad(now.getMinutes())} — Date: ${now.toLocaleDateString()}`;
}

// solo existe tzHint ahora
setTZHint(document.getElementById('tzHint'));

// ==== NUEVA LÓGICA DEL FORMULARIO DE RESERVA ====
(function () {
  const form = document.getElementById('formReserva');
  if (!form) return; // por si estás en otra página

  const selOrigen = document.getElementById('origen');
  const selDestino = document.getElementById('destino');
  const selVehiculo = document.getElementById('vehiculo');

  const beer = document.getElementById('beer');
  const water = document.getElementById('water');

  const precioSpan = document.getElementById('precioAuto');
  const preciosDiv = document.getElementById('precios');
  const resultadoDiv = document.getElementById('resultado');

  // EJEMPLO de rutas (luego esto se puede leer de tu BD / Excel)
  const routes = [
    { origen: 'PUJ Airport', destino: 'Bávaro Hotel', base: 40 },
    { origen: 'PUJ Airport', destino: 'Uvero Alto', base: 60 },
    { origen: 'PUJ Airport', destino: 'Cap Cana', base: 55 },
    { origen: 'PUJ Airport', destino: 'La Romana', base: 80 },
    // puedes añadir más aquí
  ];

  // Rellenar origenes
  const origenes = [...new Set(routes.map(r => r.origen))];
  origenes.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o;
    opt.textContent = o;
    selOrigen.appendChild(opt);
  });

  function updateDestinos() {
    const origen = selOrigen.value;
    selDestino.innerHTML = '<option value="">Select destination</option>';
    routes
      .filter(r => r.origen === origen)
      .forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.destino;
        opt.textContent = r.destino;
        selDestino.appendChild(opt);
      });
  }

  selOrigen.addEventListener('change', () => {
    updateDestinos();
    calcularPrecio();
  });

  function calcularPrecio() {
    const origen = selOrigen.value;
    const destino = selDestino.value;
    const veh = selVehiculo.value;

    if (!origen || !destino) {
      precioSpan.textContent = '$0';
      preciosDiv.textContent = '';
      return;
    }

    const ruta = routes.find(r => r.origen === origen && r.destino === destino);
    if (!ruta) {
      precioSpan.textContent = '-';
      preciosDiv.textContent = 'Route not found for this combination.';
      return;
    }

    let total = ruta.base;

    // ajuste por tipo de vehículo (ejemplo)
    if (veh === 'suv') total += 15;
    else if (veh === 'van') total += 25;

    // extras
    let extras = 0;
    if (beer.checked) extras += 15;
    if (water.checked) extras += 5;
    total += extras;

    precioSpan.textContent = `$${total.toFixed(2)}`;
    preciosDiv.textContent =
      `Base: $${ruta.base.toFixed(2)} · Vehicle: ${veh.toUpperCase()} · Extras: $${extras.toFixed(2)}`;
  }

  [selDestino, selVehiculo, beer, water].forEach(el => {
    if (el) el.addEventListener('change', calcularPrecio);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    calcularPrecio();

    const data = {
      origen: selOrigen.value,
      destino: selDestino.value,
      vehiculo: selVehiculo.value,
      fechaIda: document.getElementById('fechaIda').value,
      horaIda: document.getElementById('horaIda').value,
      fechaRegreso: document.getElementById('fechaRegreso').value,
      horaRegreso: document.getElementById('horaRegreso').value,
      vueloIda: document.getElementById('vueloIda').value,
      vueloRegreso: document.getElementById('vueloRegreso').value,
      beer: beer.checked,
      water: water.checked,
      total: precioSpan.textContent
    };

    const extrasTexto =
      !data.beer && !data.water
        ? 'None'
        : [
            data.beer ? '6-Pack Presidente' : null,
            data.water ? 'Water' : null
          ].filter(Boolean).join(', ');

    resultadoDiv.innerHTML = `
      <p><strong>Route:</strong> ${data.origen} → ${data.destino}</p>
      <p><strong>Vehicle:</strong> ${data.vehiculo.toUpperCase()}</p>
      <p><strong>Pick up:</strong> ${data.fechaIda || '-'} ${data.horaIda || ''}</p>
      ${data.fechaRegreso || data.horaRegreso ? `<p><strong>Return:</strong> ${data.fechaRegreso || '-'} ${data.horaRegreso || ''}</p>` : ''}
      <p><strong>Flight (pick up):</strong> ${data.vueloIda || 'N/A'}</p>
      <p><strong>Flight (return):</strong> ${data.vueloRegreso || 'N/A'}</p>
      <p><strong>Extras:</strong> ${extrasTexto}</p>
      <p><strong>Total:</strong> ${data.total}</p>
    `;
  });

  // inicial
  if (origenes.length) {
    selOrigen.value = '';
    selDestino.innerHTML = '<option value="">Select destination</option>';
  }
})();

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      io.unobserve(en.target);
    }
  });
}, { rootMargin: '-10% 0px -10% 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Parallax effect (subtle)
const heroMedia = document.querySelector('[data-parallax] .hero-media');
if (heroMedia) {
  addEventListener('scroll', () => {
    const y = window.scrollY * 0.25;
    heroMedia.style.transform = `translateY(${y}px)`;
  });
}

// Spotlight de hover que sigue el cursor en cada .car-media
document.querySelectorAll('[data-follow]').forEach(box => {
  box.addEventListener('mousemove', e => {
    const r = box.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    box.style.setProperty('--mx', `${x}%`);
    box.style.setProperty('--my', `${y}%`);
  });
});

// ===== Carousel controls =====
(function () {
  const track = document.getElementById('carTrack');
  if (!track) return;

  const prev = document.querySelector('.car-prev');
  const next = document.querySelector('.car-next');

  function stepSize() {
    const card = track.querySelector('.car-card');
    if (!card) return 500;
    const style = getComputedStyle(track);
    const gap = parseInt(style.columnGap || style.gap || 28);
    return card.getBoundingClientRect().width + gap;
  }

  function updateButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    if (prev) prev.disabled = track.scrollLeft <= 0;
    if (next) next.disabled = track.scrollLeft >= maxScroll;
  }

  if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -stepSize(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => track.scrollBy({ left: stepSize(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();
})();

// ===== Cars Page Renderer =====
(function () {
  const strip = document.getElementById('carStrip');
  const detail = document.getElementById('carDetail');
  if (!strip || !detail) return; // no estamos en cars.html

  const cars = [
    {
      id: 'e-class-avantgarde',
      name: 'Mercedes E-Class Avantgarde',
      class: 'Business Class',
      passengers: 4, bags: 4,
      hero: 'https://images.unsplash.com/photo-1695653427922-4bfb18427c26?q=80&w=1600&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1695653427922-4bfb18427c26?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1603383548242-3e03dcca5b2c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767887001-9e64f7e8d140?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596633607400-51e1b1b845a8?q=80&w=1600&auto=format&fit=crop'
      ],
      features: [
        'free InCar hotspot internet WiFi',
        'mobile device chargers',
        'mineral water & mints',
        'leather seating upholstery',
        'dark windows in the rear of the limo',
        'two-zone automatic climate control'
      ],
      card: 'assets/e-class-card.pdf'
    },
    // ... aquí siguen los demás autos exactamente como ya los tenías ...
  ];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  function renderStrip(activeId) {
    strip.innerHTML = '';
    cars.forEach(c => {
      const chip = document.createElement('button');
      chip.className = 'car-chip' + (c.id === activeId ? ' active' : '');
      chip.innerHTML = `
        <img src="${c.hero}" alt="${c.name}">
        <h4>${c.name}</h4>
        <small>${c.class}</small>
      `;
      chip.addEventListener('click', () => selectCar(c.id, true));
      strip.appendChild(chip);
    });
    updateStripButtons();
  }

  function renderDetail(car) {
    detail.innerHTML = `
      <div class="car-hero">
        <img id="heroImg" src="${car.gallery[0]}" alt="${car.name}">
        <div class="thumbs" id="thumbs">
          ${car.gallery.map((g, i) => `<img src="${g}" data-i="${i}" class="${i === 0 ? 'active' : ''}" alt="">`).join('')}
        </div>
      </div>

      <div class="car-info">
        <div class="subtitle">Type of vehicle: ${car.class}</div>
        <h1>${car.name}</h1>

        <div class="badges">
          <div class="badge"><span class="icon">👥</span> <b>Passengers: ${car.passengers}</b></div>
          <div class="badge"><span class="icon">🧳</span> <b>Bags: ${car.bags}</b></div>
        </div>

        <ul class="features">
          ${car.features.map(f => `<li>• ${f}</li>`).join('')}
        </ul>

        <a class="download-card" href="${car.card}" download>
          <span>⬇</span> Download Vehicle Card
        </a>
      </div>
    `;

    const heroImg = $('#heroImg', detail);
    $('#thumbs', detail).addEventListener('click', e => {
      const img = e.target.closest('img[data-i]');
      if (!img) return;
      const idx = +img.dataset.i;
      heroImg.src = car.gallery[idx];
      $$('#thumbs img', detail).forEach(t => t.classList.remove('active'));
      img.classList.add('active');
    });
  }

  const prev = document.querySelector('.strip-btn.prev');
  const next = document.querySelector('.strip-btn.next');

  function stepSizeStrip() {
    const chip = strip.querySelector('.car-chip'); if (!chip) return 400;
    const styles = getComputedStyle(strip);
    const gap = parseInt(styles.gap || '26');
    return chip.getBoundingClientRect().width + gap;
  }

  function updateStripButtons() {
    const max = strip.scrollWidth - strip.clientWidth - 1;
    if (prev) prev.disabled = strip.scrollLeft <= 0;
    if (next) next.disabled = strip.scrollLeft >= max;
  }

  if (prev) prev.addEventListener('click', () => strip.scrollBy({ left: -stepSizeStrip(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => strip.scrollBy({ left: +stepSizeStrip(), behavior: 'smooth' }));
  strip.addEventListener('scroll', updateStripButtons);
  window.addEventListener('resize', updateStripButtons);

  function selectCar(id, scrollIntoView) {
    const car = cars.find(x => x.id === id) || cars[0];
    renderDetail(car);
    renderStrip(id);
    if (scrollIntoView) {
      const chip = Array.from(strip.children).find(c => c.classList.contains('active'));
      chip && chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    history.replaceState(null, '', `?car=${encodeURIComponent(id)}`);
  }

  // Inicial
  const urlId = new URLSearchParams(location.search).get('car');
  selectCar(urlId || cars[0].id, false);
})();