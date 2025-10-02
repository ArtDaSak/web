// Ajustar dinámicamente la altura del body
document.body.style.height = `${window.innerHeight * 3}px`;
window.addEventListener('resize', () => {
    document.body.style.height = `${window.innerHeight * 3}px`;
});

const rings = document.querySelectorAll('.ring');
const ringsCount = rings.length;
const maxScroll = 400;
const maxScale = 8;
const maxBlur = 30;
const hiddenSection = document.querySelector('.hidden-after-scroll');
const backgroundFinal = document.getElementById('backgroundFinal');
const text = document.getElementById('centerText');

function updateAnimations() {
    const scrollPosition = window.scrollY;
    const zOffset = scrollPosition / 2;
    document.querySelector('.rings').style.transform = `translate(-50%, -50%) translateZ(${zOffset}px)`;

    // Animación del texto central
    let progress = Math.min(scrollPosition / 200, 1);
    let scale = 1 - 0.5 * progress;
    let opacity = 1 - progress;
    text.style.opacity = opacity;
    text.style.transform = `translate(-50%, -50%) scale(${scale})`;

    // Animación de los anillos
    rings.forEach((ring, i) => {
        const baseZ = -100 * (i + 1);
        let ringProgress = Math.min(scrollPosition / (maxScroll - i * 20), 1);
        let blurProgress = 0;
        if (ringProgress > 0.5) {
            blurProgress = ((ringProgress - 0.5) / 0.5) * 0.75;
            blurProgress = Math.min(blurProgress, 1);
        }
        let ringScale = 1.5 + (maxScale - 1.5) * ringProgress;
        let ringOpacity = 1 - ringProgress;
        let ringBlur = maxBlur * blurProgress;
        ring.style.transform = `translate(-50%, -50%) translateZ(${baseZ}px) scale(${ringScale})`;
        ring.style.opacity = ringOpacity;
        ring.style.filter = `blur(${ringBlur}px)`;
    });

    // Mostrar/ocultar sección
    if (scrollPosition > 400) {
        hiddenSection.style.opacity = '1';
        hiddenSection.style.pointerEvents = 'auto';
    } else {
        hiddenSection.style.opacity = '0';
        hiddenSection.style.pointerEvents = 'none';
    }

    // Transición del fondo
    backgroundFinal.style.opacity = scrollPosition > maxScroll ? 1 : 0;
}

// Usar requestAnimationFrame para animaciones fluidas
window.addEventListener('scroll', () => {
    requestAnimationFrame(updateAnimations);
});

// Ejecutar la función una vez al cargar para establecer el estado inicial
updateAnimations();

// Script.js
// Se añade la lógica de la SPA y accesibilidad
// Se respetan nombres de variables en camelCase en inglés

document.addEventListener('DOMContentLoaded', () => {
  // Se capturan nodos clave
  const tabsContainer = document.querySelector('[role="tablist"]');
  const tabButtons = Array.from(tabsContainer.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  // Se definen mapeos de hash a tab id
  const hashMap = {
    'about': 'tab-about',
    'skills': 'tab-skills',
    'web-studio': 'tab-web-studio',
    'showreel': 'tab-showreel'
  };

  // Se obtiene la última pestaña guardada si existe
  const lastSaved = localStorage.getItem('lastTab');

  // Se inicializa estados aria y tabindex
  tabButtons.forEach((tab, index) => {
    tab.setAttribute('tabindex', '-1');
    tab.addEventListener('click', onClickTab);
    tab.addEventListener('keydown', onKeyDownTab);
  });

  // Se asegura que los paneles tengan hidden y aria oculto inicial
  panels.forEach(panel => {
    panel.hidden = true;
  });

  // Se determina pestaña inicial por hash, localStorage o por defecto
  const initialTabId = getInitialTabId();
  activateTab(document.getElementById(initialTabId), {focusPanel: false, replaceHash: true});

  // Se escucha cambios de hash externa
  window.addEventListener('hashchange', () => {
    const newTabId = tabIdFromHash(location.hash);
    if (newTabId) {
      const tabEl = document.getElementById(newTabId);
      if (tabEl) activateTab(tabEl, {focusPanel: true, pushState: false});
    }
  });

  // Función para obtener tab id desde hash o desde almacenamiento o defecto
  function getInitialTabId(){
    const fromHash = tabIdFromHash(location.hash);
    if (fromHash) return fromHash;
    if (lastSaved && document.getElementById(lastSaved)) return lastSaved;
    return 'tab-about';
  }

  // Función para mapear hash a tab id
  function tabIdFromHash(hash){
    if (!hash) return null;
    const key = hash.replace('#','');
    return hashMap[key] || null;
  }

  // Manejador click en tab
  function onClickTab(e){
    const tab = e.currentTarget;
    activateTab(tab, {focusPanel: true});
  }

  // Manejador teclado en tabs
  function onKeyDownTab(e){
    const key = e.key;
    const currentIndex = tabButtons.indexOf(e.currentTarget);
    let nextIndex = null;

    if (key === 'ArrowRight' || key === 'Right') {
      nextIndex = (currentIndex + 1) % tabButtons.length;
      tabButtons[nextIndex].focus();
      e.preventDefault();
    } else if (key === 'ArrowLeft' || key === 'Left') {
      nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      tabButtons[nextIndex].focus();
      e.preventDefault();
    } else if (key === 'Home') {
      tabButtons[0].focus();
      e.preventDefault();
    } else if (key === 'End') {
      tabButtons[tabButtons.length - 1].focus();
      e.preventDefault();
    } else if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      activateTab(e.currentTarget, {focusPanel: true});
      e.preventDefault();
    }
  }

  // Función central para activar pestaña
  function activateTab(tabEl, options = {}){
    const { focusPanel = true, pushState = true, replaceHash = false } = options;

    // Se actualiza estado de todas las tabs
    tabButtons.forEach(t => {
      const selected = t === tabEl;
      t.setAttribute('aria-selected', String(selected));
      t.setAttribute('tabindex', selected ? '0' : '-1');
    });

    // Se muestra panel correspondiente y aplica animación
    const targetId = tabEl.dataset.target;
    panels.forEach(panel => {
      if (panel.id === targetId) {
        panel.hidden = false;
        panel.classList.remove('fade-in');
        // Forzar reflow para reiniciar animación
        void panel.offsetWidth;
        panel.classList.add('fade-in');
        if (focusPanel) panel.focus();
      } else {
        panel.hidden = true;
      }
    });

    // Se actualiza hash para permitir enlaces profundos
    const newHash = `#${targetId}`;
    if (pushState) {
      if (replaceHash) history.replaceState(null, '', newHash);
      else location.hash = targetId;
    }

    // Se guarda la última pestaña en localStorage
    localStorage.setItem('lastTab', tabEl.id);
  }

});