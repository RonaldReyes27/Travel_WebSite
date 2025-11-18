// REVEAL ON SCROLL
const reveals = document.querySelectorAll('.reveal');

function handleReveal() {
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect().top;
    if (rect < window.innerHeight - 120) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", handleReveal);
handleReveal();


// YEAR ON FOOTER
document.getElementById("year").textContent = new Date().getFullYear();
