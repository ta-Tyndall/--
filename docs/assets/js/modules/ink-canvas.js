(function () {
  'use strict';

/**
 * 首页水墨流云粒子
 * 使用 Canvas 绘制极淡的墨点与游丝，在轮播画面上缓慢漂移。
 * 这是纯装饰层：不接收鼠标事件，也不承载信息。
 */
function initInkCanvas() {
  const canvas = document.querySelector('[data-ink-canvas]');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!context || reduceMotion) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = 0;
  let lastTime = 0;

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 18 + Math.random() * 84,
    alpha: 0.012 + Math.random() * 0.035,
    speedX: 0.05 + Math.random() * 0.16,
    speedY: -0.03 + Math.random() * 0.07,
    phase: Math.random() * Math.PI * 2,
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: 24 }, createParticle);
  };

  const draw = (time) => {
    animationId = window.requestAnimationFrame(draw);
    if (document.hidden) return;
    if (time - lastTime < 32) return;
    lastTime = time;

    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'multiply';

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.phase += 0.0025;

      if (particle.x - particle.radius > width) particle.x = -particle.radius;
      if (particle.y + particle.radius < 0) particle.y = height + particle.radius;
      if (particle.y - particle.radius > height) particle.y = -particle.radius;

      const drift = Math.sin(particle.phase) * 6;
      const gradient = context.createRadialGradient(
        particle.x + drift,
        particle.y,
        0,
        particle.x + drift,
        particle.y,
        particle.radius,
      );
      gradient.addColorStop(0, `rgba(44, 49, 44, ${particle.alpha})`);
      gradient.addColorStop(0.45, `rgba(44, 49, 44, ${particle.alpha * 0.5})`);
      gradient.addColorStop(1, 'rgba(44, 49, 44, 0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(
        particle.x + drift,
        particle.y,
        particle.radius,
        particle.radius * 0.42,
        -0.18,
        0,
        Math.PI * 2,
      );
      context.fill();
    });
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  animationId = window.requestAnimationFrame(draw);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationId);
    } else {
      animationId = window.requestAnimationFrame(draw);
    }
  });
}

// 将初始化函数挂载到统一命名空间，供经典脚本环境按顺序调用。
window.Shuyun = window.Shuyun || {};
window.Shuyun.initInkCanvas = initInkCanvas;

})();
