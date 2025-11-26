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

// Local time display
function updateLocalTime() {
  const now = new Date();
  document.getElementById("localTime").textContent =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

setInterval(updateLocalTime, 1000);
updateLocalTime();

// Tabs
document.querySelectorAll(".transfer-tabs .tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".transfer-tabs .tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

const serviceTabs = document.querySelectorAll(".transfer-tabs .tab");
const serviceForms = document.querySelectorAll("[data-form]");

serviceTabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // Activar tab seleccionado
        serviceTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // Mostrar formulario correcto
        const selected = tab.dataset.tab;

        serviceForms.forEach(form => {
            form.classList.toggle("hidden", form.dataset.form !== selected);
        });
    });
});