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