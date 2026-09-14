/* ==========================================================
   JUNIOR PELUQUERÍA · main.js
   Maquinilla 3D: baja a la misma velocidad que el scroll
   y su recorrido termina al llegar a la sección de Servicios
   ========================================================== */

// ---------- Navbar: efecto al hacer scroll ----------
const navbar = document.getElementById("navbar");

// ---------- Menú móvil ----------
const burger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  const abierto = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", abierto);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ---------- Animaciones "reveal" al hacer scroll ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ---------- Contadores animados ----------
function animarContador(el) {
  const objetivo = parseFloat(el.dataset.target);
  const decimales = parseInt(el.dataset.decimals || "0", 10);
  const duracion = 1600;
  const inicio = performance.now();

  function paso(ahora) {
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    const suavizado = 1 - Math.pow(1 - progreso, 3);
    const valor = objetivo * suavizado;

    el.textContent = valor.toLocaleString("es-ES", {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    });

    if (progreso < 1) requestAnimationFrame(paso);
  }

  requestAnimationFrame(paso);
}

const observerStats = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-number").forEach(animarContador);
        observerStats.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

const stats = document.querySelector(".stats");
if (stats) observerStats.observe(stats);

// ---------- MAQUINILLA 3D: VELOCIDAD REAL 1:1 HASTA SERVICIOS ----------
const about = document.getElementById("sobre-nosotros");
const clipper = document.getElementById("clipper3d");
const clipperStage = document.querySelector(".clipper-stage");
const clipperShadow = document.getElementById("clipperShadow");
const clipperDeg = document.getElementById("clipperDeg");
const mqEscritorio = window.matchMedia("(min-width: 901px)");

let tick = false;

function actualizarClipper() {
  tick = false;

  if (!mqEscritorio.matches || !about || !clipper || !clipperStage) return;

  const H = window.innerHeight;                 // alto de la pantalla
  const rect = about.getBoundingClientRect();   // posición de la sección
  const R = rect.height - H;                    // recorrido de scroll de la sección

  if (R <= 0) return;

  // Píxeles que el visitante ha bajado dentro de "Sobre nosotros" (0 → R)
  const s = Math.min(Math.max(-rect.top, 0), R);

  const stageH = clipperStage.offsetHeight;

  // ---- DESCENSO A VELOCIDAD REAL (1:1) ----
  // Y0 = posición inicial en pantalla (por encima del borde superior).
  // Al sumarle "s" (lo bajado), baja 1 px por cada 1 px de scroll.
  // Cuando s = R (Servicios entra en pantalla), Y = H + stageH/2 →
  // justo ha terminado de bajar al llegar a Servicios.
  const Y0 = H + stageH * 0.5 - R;
  const Y = Y0 + s;              // centro de la maquinilla en pantalla
  const translateY = Y - H / 2;  // desplazamiento respecto a su sitio fijo

  clipperStage.style.transform = `translateY(${translateY.toFixed(1)}px)`;

  // ---- GIRO 360° repartido en todo el descenso ----
  const progreso = s / R;
  const grados = progreso * 360;
  const rad = (grados * Math.PI) / 180;

  clipper.style.transform =
    `rotateY(${grados.toFixed(2)}deg) rotateX(${(Math.sin(progreso * Math.PI) * 10).toFixed(2)}deg)`;

  // ---- Sombra dinámica ----
  const escala = 0.35 + 0.65 * Math.abs(Math.cos(rad));
  clipperShadow.style.transform = `translateX(-50%) scaleX(${escala.toFixed(3)})`;
  clipperShadow.style.opacity = (0.25 + 0.5 * Math.abs(Math.cos(rad))).toFixed(2);

  if (clipperDeg) clipperDeg.textContent = `${Math.round(grados)}°`;
}

function onScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 40);

  if (!tick) {
    tick = true;
    requestAnimationFrame(actualizarClipper);
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

// ---------- Año del footer ----------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
