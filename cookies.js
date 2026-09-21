/* ==========================================================
   YUNIOR BARBERÍA · cookies.js
   Aviso de cookies: guarda la elección del visitante en este
   navegador y no vuelve a mostrarse una vez que ha respondido.
   No modifica ni depende de main.js.
   ========================================================== */

(function () {
  const CLAVE = "yunior_cookie_consent";

  const banner = document.getElementById("cookieBanner");
  if (!banner) return;

  const botonAceptar = document.getElementById("cookieAccept");
  const botonRechazar = document.getElementById("cookieReject");

  function leerEleccionGuardada() {
    try {
      return localStorage.getItem(CLAVE);
    } catch (e) {
      return null;
    }
  }

  function guardarEleccion(valor) {
    try {
      localStorage.setItem(CLAVE, valor);
    } catch (e) {
      /* Si el navegador bloquea localStorage, el aviso podría
         volver a aparecer en la siguiente visita. No es grave. */
    }
    ocultarBanner();
  }

  function ocultarBanner() {
    banner.classList.remove("visible");
  }

  function mostrarBanner() {
    banner.classList.add("visible");
  }

  if (!leerEleccionGuardada()) {
    // Pequeño retraso para que se note la animación de entrada
    window.setTimeout(mostrarBanner, 500);
  }

  if (botonAceptar) {
    botonAceptar.addEventListener("click", () => guardarEleccion("accepted"));
  }

  if (botonRechazar) {
    botonRechazar.addEventListener("click", () => guardarEleccion("rejected"));
  }
})();
