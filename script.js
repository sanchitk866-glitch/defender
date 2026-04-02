const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');
const scrollContainer = document.querySelector('.scroll-container');

// Text Steps
const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4'),
    document.getElementById('step-5')
];

// Navigation
const nav = document.querySelector('.navigation');

// Frame configuration
const frameCount = 240;
const currentFrame = index => (
  `frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
let imagesLoaded = 0;

// Set canvas dimensions
canvas.width = 1920;
canvas.height = 1080;

// Preload images
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Initial draw
images[0].onload = render;

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Maintain aspect ratio or draw image to fill/fit.
    // For cinematic feel, we'll draw centered and contained.
    const img = images[state.frameIndex];
    if(img && img.complete) {
        // Calculate the ratio of the canvas and the image
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio  = Math.min(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width*ratio) / 2;
        const centerShift_y = (canvas.height - img.height*ratio) / 2;  
        
        context.drawImage(img, 0, 0, img.width, img.height,
                          centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);
    }
}

// Map scroll to frame
let state = { frameIndex: 0 };

window.addEventListener('scroll', () => {  
    // Canvas animation logic
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = scrollContainer.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    
    // Clamp fraction between 0 and 1
    const safeFraction = Math.max(0, Math.min(1, scrollFraction));
    
    // Determine frame index
    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(safeFraction * frameCount)
    );
    
    if (state.frameIndex !== frameIndex) {
        state.frameIndex = frameIndex;
        requestAnimationFrame(render);
    }

    // Toggle Nav Visibility
    if (scrollTop > 50) {
        nav.classList.add('visible');
    } else {
        nav.classList.remove('visible');
    }

    // Determine active step based on scroll percentage
    // 0-15%, 15-40%, 40-65%, 65-85%, 85-100%
    const pct = safeFraction * 100;
    
    steps.forEach((step, idx) => step.classList.remove('active'));

    if (pct >= 0 && pct < 15) {
        steps[0].classList.add('active');
    } else if (pct >= 15 && pct < 40) {
        steps[1].classList.add('active');
    } else if (pct >= 40 && pct < 65) {
        steps[2].classList.add('active');
    } else if (pct >= 65 && pct < 85) {
        steps[3].classList.add('active');
    } else if (pct >= 85 && pct <= 100) {
        steps[4].classList.add('active');
    }
});

// Resize handler
window.addEventListener('resize', () => {
    // Optionally resize canvas if we want to support dynamic resolutions.
    // For pure hardware acceleration and performance, keeping it fixed
    // and letting CSS handle object-fit / scale is often smoother during scroll.
});
