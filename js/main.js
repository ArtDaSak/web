// Ajusta body height solo si cambia el tamaño
function setBodyHeight() {
    document.documentElement.style.height = `${window.innerHeight * 1}px`;
    document.body.style.height = `${window.innerHeight * 3}px`;
}
setBodyHeight();
window.addEventListener('resize', setBodyHeight);

const rings = document.querySelectorAll('.ring');
const ringsCount = rings.length;
const maxScroll = 700;
const maxScale = 5;
const maxBlur = 30;
const ringsContainer = document.querySelector('.rings');
const text = document.getElementById('centerText');
const backgroundFinal = document.getElementById('backgroundFinal');

// Oculta los rings al inicio
rings.forEach(ring => {
    ring.style.opacity = 0;
});

let ticking = false;
function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}
window.addEventListener('scroll', onScroll);

function updateOnScroll() {
    const scrollPosition = window.scrollY;
    const zOffset = scrollPosition / 2;
    ringsContainer.style.transform = `translate(-50%, -50%) translateZ(${zOffset}px)`;

    // Texto central
    let progress = Math.min(scrollPosition / 200, 1);
    let scale = 1 - 0.5 * progress;
    let opacity = 1 - progress;
    text.style.opacity = opacity;
    text.style.transform = `translate(-50%, -50%) scale(${scale})`;

    // Rings
    for (let i = 0; i < ringsCount; i++) {
        const ring = rings[i];
        const baseZ = -100 * (i + 1);
        let ringProgress = scrollPosition > 0 ? Math.min(scrollPosition / (maxScroll - i * 20), 1) : 0;
        let blurProgress = ringProgress > 0.5 ? Math.min(((ringProgress - 0.5) / 0.5) * 0.75, 1) : 0;
        let ringScale = 1.5 + (maxScale - 1.5) * ringProgress;
        let ringOpacity = ringProgress;
        let ringBlur = maxBlur * blurProgress;

        ring.style.transform = `translate(-50%, -50%) translateZ(${baseZ}px) scale(${ringScale})`;
        ring.style.opacity = ringOpacity;
        ring.style.filter = `blur(${ringBlur}px)`;
    }

    // Fondo negro
    backgroundFinal.style.opacity = scrollPosition > maxScroll ? 1 : 0;

    ticking = false;
}
