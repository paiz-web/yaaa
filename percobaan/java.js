const slide = document.querySelector('.slide');
let isDragging = false;
let startX = 0;
let currentAngle = 0;
let rotation = 0;
const itemAngle = 30; // sudut per item
const minDeltaX = 5; // ambang batas minimum untuk drag

document.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  rotation = 0;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - startX;

  // Jika belum melewati ambang batas, jangan lakukan rotasi
  if (Math.abs(deltaX) < minDeltaX) return;

  rotation = deltaX * 0.3;
  slide.style.transform = `perspective(1000px) rotateY(${currentAngle + rotation}deg)`;
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    const deltaX = rotation / 0.3; // kembalikan deltaX dari rotasi

    // Jika deltaX terlalu kecil, jangan ubah currentAngle
    if (Math.abs(deltaX) < minDeltaX) {
      slide.style.transform = `perspective(1000px) rotateY(${currentAngle}deg)`;
    } else {
      const rawAngle = currentAngle + rotation;
      const snappedAngle = Math.round(rawAngle / itemAngle) * itemAngle;
      slide.style.transform = `perspective(1000px) rotateY(${snappedAngle}deg)`;
      currentAngle = snappedAngle;
    }

    isDragging = false;
  }
});
