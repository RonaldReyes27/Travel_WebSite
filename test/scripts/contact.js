document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you for contacting us! We will respond soon.');
    form.reset();
  });
});
