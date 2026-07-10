/* ==========================================================================
   Parrilla Don Emi — Navegación responsive (mobile)
   Controla el menú hamburguesa: abrir/cerrar, overlay, accesibilidad y
   cierre automático al hacer clic en un enlace o al pasar a escritorio.
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav__toggle');
    var lista = document.querySelector('.nav__lista');
    var overlay = document.querySelector('.nav__overlay');

    if (!toggle || !lista) {
      return; // La página no tiene navegación esperada.
    }

    function abrirMenu() {
      lista.classList.add('abierto');
      if (overlay) overlay.classList.add('visible');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function cerrarMenu() {
      lista.classList.remove('abierto');
      if (overlay) overlay.classList.remove('visible');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function alternarMenu() {
      if (lista.classList.contains('abierto')) {
        cerrarMenu();
      } else {
        abrirMenu();
      }
    }

    // Clic en el botón hamburguesa
    toggle.addEventListener('click', alternarMenu);

    // Clic en la capa oscura de fondo
    if (overlay) {
      overlay.addEventListener('click', cerrarMenu);
    }

    // Cerrar al hacer clic en cualquier enlace del menú
    lista.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        cerrarMenu();
      }
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lista.classList.contains('abierto')) {
        cerrarMenu();
      }
    });

    // Si se agranda la ventana a escritorio, aseguramos el estado cerrado
    var mq = window.matchMedia('(min-width: 761px)');
    function alCambiarViewport(e) {
      if (e.matches) {
        cerrarMenu();
      }
    }
    if (mq.addEventListener) {
      mq.addEventListener('change', alCambiarViewport);
    } else if (mq.addListener) {
      mq.addListener(alCambiarViewport); // Compatibilidad con navegadores antiguos
    }

    // -------- Scrollspy (one-page): resalta el enlace de la sección visible --------
    var enlaces = Array.prototype.slice.call(
      document.querySelectorAll('.nav__link[href^="#"]')
    );
    var secciones = enlaces
      .map(function (a) {
        return document.querySelector(a.getAttribute('href'));
      })
      .filter(Boolean);

    if (secciones.length && 'IntersectionObserver' in window) {
      var observador = new IntersectionObserver(
        function (entradas) {
          entradas.forEach(function (entrada) {
            if (!entrada.isIntersecting) return;
            var destino = '#' + entrada.target.id;
            enlaces.forEach(function (a) {
              a.classList.toggle(
                'nav__link--activo',
                a.getAttribute('href') === destino
              );
            });
          });
        },
        // La sección se marca activa cuando cruza la franja central del viewport
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      secciones.forEach(function (s) {
        observador.observe(s);
      });
    }
  });
})();

/* ==========================================================================
   Menú tipo libro (flipbook): pasar y retroceder páginas con animación
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var libro = document.getElementById('libro-menu');
    if (!libro) return;

    var paginas = Array.prototype.slice.call(
      libro.querySelectorAll('.libro__pagina')
    );
    var btnAnt = libro.querySelector('.libro__btn--anterior');
    var btnSig = libro.querySelector('.libro__btn--siguiente');
    var indicador = libro.querySelector('.libro__indicador');
    if (paginas.length < 2 || !btnAnt || !btnSig) return;

    var reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var actual = 0;
    var animando = false;

    function refrescar() {
      btnAnt.disabled = actual === 0;
      btnSig.disabled = actual === paginas.length - 1;
      if (indicador) {
        indicador.textContent = actual + 1 + ' / ' + paginas.length;
      }
    }

    function activar(indice) {
      paginas.forEach(function (p, i) {
        p.classList.toggle('libro__pagina--activa', i === indice);
      });
    }

    function ir(destino, dir) {
      if (animando || destino < 0 || destino >= paginas.length || destino === actual) {
        return;
      }
      animando = true;
      var sale = paginas[actual];
      var entra = paginas[destino];
      entra.classList.add('libro__pagina--activa');

      // Sin animación (accesibilidad): cambio directo
      if (reduce) {
        activar(destino);
        entra.scrollTop = 0;
        actual = destino;
        animando = false;
        refrescar();
        return;
      }

      var hoja = dir === 1 ? sale : entra;
      var clase = dir === 1 ? 'girar-sale' : 'girar-entra';
      hoja.classList.add(clase);

      var listo = false;
      function completar() {
        if (listo) return;
        listo = true;
        hoja.removeEventListener('animationend', completar);
        hoja.classList.remove(clase);
        activar(destino);
        entra.scrollTop = 0;
        actual = destino;
        animando = false;
        refrescar();
      }
      hoja.addEventListener('animationend', completar);
      setTimeout(completar, 850); // Red de seguridad por si no dispara animationend
    }

    btnSig.addEventListener('click', function () {
      ir(actual + 1, 1);
    });
    btnAnt.addEventListener('click', function () {
      ir(actual - 1, -1);
    });

    // Flechas del teclado (solo si el libro está a la vista y no se está escribiendo)
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var etiqueta = (document.activeElement && document.activeElement.tagName) || '';
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(etiqueta)) return;
      var r = libro.getBoundingClientRect();
      var visible = r.top < window.innerHeight * 0.85 && r.bottom > window.innerHeight * 0.15;
      if (!visible) return;
      if (e.key === 'ArrowRight') ir(actual + 1, 1);
      else ir(actual - 1, -1);
    });

    refrescar();
  });
})();

/* ==========================================================================
   Video del hero: loop sin cortes por crossfade entre dos videos
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var a = document.querySelector('.hero__video--a');
    var b = document.querySelector('.hero__video--b');
    if (!a || !b) return;

    // Respeta "menos movimiento": pausa el video y deja el póster fijo
    var reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      try { a.removeAttribute('autoplay'); a.pause(); } catch (e) {}
      return;
    }

    var FADE = 0.8; // segundos de fundido antes del final
    a.loop = false;
    b.loop = false;
    var actual = a;
    var siguiente = b;
    var cambiando = false;

    function alTiempo(e) {
      var v = e.target;
      if (v !== actual || cambiando || !v.duration) return;
      if (v.currentTime >= v.duration - FADE) {
        cambiando = true;
        try { siguiente.currentTime = 0; } catch (_) {}
        var pr = siguiente.play();
        if (pr && pr.catch) pr.catch(function () {});
        siguiente.style.opacity = '1';
        actual.style.opacity = '0';
        var previo = actual;
        var nuevo = siguiente;
        setTimeout(function () {
          actual = nuevo;
          siguiente = previo;
          cambiando = false;
        }, FADE * 1000);
      }
    }

    a.addEventListener('timeupdate', alTiempo);
    b.addEventListener('timeupdate', alTiempo);

    // Asegura el arranque (fallback de autoplay)
    var p = a.play();
    if (p && p.catch) p.catch(function () {});
  });
})();
