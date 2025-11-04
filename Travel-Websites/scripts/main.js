// Sticky header shrink
const header = document.getElementById('header');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('shrink', y > 30);
  lastY = y;
});

// Mobile menu (simple)
const burger = document.getElementById('burger');
const menu = document.querySelector('.menu');
if (burger) {
  burger.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  });
}

// Tabs Booking
const tabs = document.querySelectorAll('.tab');
const formOne = document.getElementById('form-oneway');
const formHour = document.getElementById('form-hourly');
tabs.forEach(t => t.addEventListener('click', e=>{
  tabs.forEach(x=>x.classList.remove('active'));
  e.currentTarget.classList.add('active');
  const name = e.currentTarget.dataset.tab;
  formOne.classList.toggle('hidden', name !== 'oneway');
  formHour.classList.toggle('hidden', name !== 'hourly');
}));

// Local time hint
function pad(n){return String(n).padStart(2,'0')}
function setTZHint(el){
  const now = new Date();
  el.textContent = `Local time: ${pad(now.getHours())}:${pad(now.getMinutes())} — Date: ${now.toLocaleDateString()}`;
}
setTZHint(document.getElementById('tzHint'));
setTZHint(document.getElementById('tzHint2'));

// Prevent default submit (demo)
document.querySelectorAll('.booking-form').forEach(f=>{
  f.addEventListener('submit', e=>{
    e.preventDefault();
    alert('This is a demo. Replace with your booking logic.');
  });
});

// Reveal on scroll
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if (en.isIntersecting){
      en.target.classList.add('in');
      io.unobserve(en.target);
    }
  });
},{rootMargin:'-10% 0px -10% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Parallax effect (subtle)
const hero = document.querySelector('[data-parallax] .hero-media');
addEventListener('scroll', ()=>{
  const y = window.scrollY * 0.25;
  hero.style.transform = `translateY(${y}px)`;
});

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
(function(){
  const track = document.getElementById('carTrack');
  if(!track) return;

  const prev = document.querySelector('.car-prev');
  const next = document.querySelector('.car-next');

  // tamaño del paso = ancho de una card + gap
  function stepSize(){
    const card = track.querySelector('.car-card');
    if(!card) return 500;
    const style = getComputedStyle(track);
    const gap = parseInt(style.columnGap || style.gap || 28);
    return card.getBoundingClientRect().width + gap;
  }

  function updateButtons(){
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= maxScroll;
  }

  prev.addEventListener('click', ()=> track.scrollBy({ left: -stepSize(), behavior:'smooth'}));
  next.addEventListener('click', ()=> track.scrollBy({ left:  stepSize(), behavior:'smooth'}));
  track.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();
})();
 
// spotlight cursor en las imágenes (ya lo tenías)
document.querySelectorAll('[data-follow]').forEach(box => {
  box.addEventListener('mousemove', e => {
    const r = box.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    box.style.setProperty('--mx', `${x}%`);
    box.style.setProperty('--my', `${y}%`);
  });
});
// ===== Cars Page Renderer =====
(function(){
  const strip = document.getElementById('carStrip');
  const detail = document.getElementById('carDetail');
  if(!strip || !detail) return; // no estamos en cars.html

  // Dataset (puedes cambiar URLs por tus imágenes)
  const cars = [
    {
      id:'e-class-avantgarde',
      name:'Mercedes E-Class Avantgarde',
      class:'Business Class',
      passengers:4, bags:4,
      hero:'https://images.unsplash.com/photo-1695653427922-4bfb18427c26?q=80&w=1600&auto=format&fit=crop',
      gallery:[
        'https://images.unsplash.com/photo-1695653427922-4bfb18427c26?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1603383548242-3e03dcca5b2c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767887001-9e64f7e8d140?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596633607400-51e1b1b845a8?q=80&w=1600&auto=format&fit=crop'
      ],
      features:[
        'free InCar hotspot internet WiFi',
        'mobile device chargers',
        'mineral water & mints',
        'leather seating upholstery',
        'dark windows in the rear of the limo',
        'two-zone automatic climate control'
      ],
      card:'assets/e-class-card.pdf'
    },
    {
      id:'s-class-long',
      name:'Mercedes S-Class long',
      class:'Luxury Class',
      passengers:4, bags:4,
      hero:'https://images.unsplash.com/photo-1549921296-3fdc0d0b2a5b?q=80&w=1600&auto=format&fit=crop',
      gallery:[
        'https://images.unsplash.com/photo-1549921296-3fdc0d0b2a5b?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1579489427819-9a83a5ce9a2f?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767887001-9e64f7e8d140?q=80&w=1600&auto=format&fit=crop'
      ],
      features:[
        'executive rear seats (selected cars)',
        'Burmester® surround sound',
        'soft-closing doors',
        'ambient lighting',
        'USB-C charging & bottled water'
      ],
      card:'assets/s-class-card.pdf'
    },
    {
      id:'bmw-7-long',
      name:'BMW 7 Series long',
      class:'Luxury Class',
      passengers:4, bags:4,
      hero:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1600&auto=format&fit=crop',
      gallery:[
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596633607400-51e1b1b845a8?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767887001-9e64f7e8d140?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1579489427819-9a83a5ce9a2f?q=80&w=1600&auto=format&fit=crop'
      ],
      features:[
        'executive lounge package (on request)',
        'panoramic glass roof',
        'four-zone climate control',
        'wireless charging',
        'bottled water & mints'
      ],
      card:'assets/bmw7-card.pdf'
    },
    {
      id:'s560-4matic',
      name:'Mercedes S-Class 560 4Matic AMG long',
      class:'Luxury Class',
      passengers:4, bags:4,
      hero:'https://images.unsplash.com/photo-1541899481282-d53bffe3c36a?q=80&w=1600&auto=format&fit=crop',
      gallery:[
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c36a?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767887001-9e64f7e8d140?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596633607400-51e1b1b845a8?q=80&w=1600&auto=format&fit=crop'
      ],
      features:[
        'AMG exterior styling',
        'air-suspension comfort',
        'seat heating & ventilation',
        'privacy glass',
        'Wi-Fi hotspot (on request)'
      ],
      card:'assets/s560-card.pdf'
    },
    {
      id:'range-rover-auto',
      name:'Range Rover Autobiography',
      class:'Luxury SUV Class',
      passengers:4, bags:5,
      hero:'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1600&auto=format&fit=crop',
      gallery:[
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596633607400-51e1b1b845a8?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1619767887001-9e64f7e8d140?q=80&w=1600&auto=format&fit=crop'
      ],
      features:[
        'executive SUV ride height',
        'all-wheel drive',
        'premium leather upholstery',
        'rear climate comfort',
        'bottled water included'
      ],
      card:'assets/range-card.pdf'
    }
  ];

  // Helpers
  const $ = (s,el=document)=>el.querySelector(s);
  const $$ = (s,el=document)=>Array.from(el.querySelectorAll(s));

  function renderStrip(activeId){
    strip.innerHTML = '';
    cars.forEach(c=>{
      const chip = document.createElement('button');
      chip.className = 'car-chip' + (c.id===activeId?' active':'');

      chip.innerHTML = `
        <img src="${c.hero}" alt="${c.name}">
        <h4>${c.name}</h4>
        <small>${c.class}</small>
      `;
      chip.addEventListener('click', ()=>selectCar(c.id,true));
      strip.appendChild(chip);
    });
    updateStripButtons();
  }

  function renderDetail(car){
    detail.innerHTML = `
      <div class="car-hero">
        <img id="heroImg" src="${car.gallery[0]}" alt="${car.name}">
        <div class="thumbs" id="thumbs">
          ${car.gallery.map((g,i)=>`<img src="${g}" data-i="${i}" class="${i===0?'active':''}" alt="">`).join('')}
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
          ${car.features.map(f=>`<li>• ${f}</li>`).join('')}
        </ul>

        <a class="download-card" href="${car.card}" download>
          <span>⬇</span> Download Vehicle Card
        </a>
      </div>
    `;

    // thumbs
    const hero = $('#heroImg', detail);
    $('#thumbs', detail).addEventListener('click', e=>{
      const img = e.target.closest('img[data-i]');
      if(!img) return;
      const idx = +img.dataset.i;
      hero.src = car.gallery[idx];
      $$('#thumbs img', detail).forEach(t=>t.classList.remove('active'));
      img.classList.add('active');
    });
  }

  function selectCar(id, scrollIntoView){
    const car = cars.find(x=>x.id===id) || cars[0];
    renderDetail(car);
    renderStrip(id);
    if(scrollIntoView){
      const chip = Array.from(strip.children).find(c=>c.classList.contains('active'));
      chip && chip.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
    }
    history.replaceState(null,'',`?car=${encodeURIComponent(id)}`);
  }

  // Flechas del strip
  const prev = document.querySelector('.strip-btn.prev');
  const next = document.querySelector('.strip-btn.next');
  function stepSize(){
    const chip = strip.querySelector('.car-chip'); if(!chip) return 400;
    const styles = getComputedStyle(strip);
    const gap = parseInt(styles.gap||'26');
    return chip.getBoundingClientRect().width + gap;
  }
  function updateStripButtons(){
    const max = strip.scrollWidth - strip.clientWidth - 1;
    prev.disabled = strip.scrollLeft <= 0;
    next.disabled = strip.scrollLeft >= max;
  }
  prev.addEventListener('click', ()=> strip.scrollBy({left:-stepSize(), behavior:'smooth'}));
  next.addEventListener('click', ()=> strip.scrollBy({left:+stepSize(), behavior:'smooth'}));
  strip.addEventListener('scroll', updateStripButtons);
  window.addEventListener('resize', updateStripButtons);

  // Inicialización
  const urlId = new URLSearchParams(location.search).get('car');
  selectCar(urlId || cars[0].id, false);
})();
