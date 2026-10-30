(function () {
  'use strict';

/**
 * 水墨轮播控制器
 * 特性：自动播放、指示器、前后切换、键盘方向键、触摸滑动与页面失焦暂停。
 * 视觉过渡完全交由 CSS 的 opacity / scale 完成，脚本只维护状态。
 */
function initCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('[data-slide]'));
  const indicators = Array.from(root.querySelectorAll('[data-carousel-indicator]'));
  const previousButton = root.querySelector('[data-carousel-prev]');
  const nextButton = root.querySelector('[data-carousel-next]');
  const status = root.querySelector('[data-carousel-status]');
  const delay = Number(root.dataset.autoplay) || 7000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (slides.length < 2) return;

  let currentIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  let timer = 0;
  let paused = false;
  let started = false;
  let pointerStartX = null;

  const slideLabel = (index) => {
    const label = indicators[index]?.getAttribute('aria-label') || `第 ${index + 1} 张`;
    return label.replace(/^显示/, '');
  };

  const clearTimer = () => {
    window.clearTimeout(timer);
    timer = 0;
  };

  const restartProgress = () => {
    root.classList.remove('is-running');
    // 读取布局属性以重置 CSS 动画时间轴。
    void root.offsetWidth;
    root.classList.add('is-running');
  };

  const scheduleNext = () => {
    clearTimer();
    if (reduceMotion || paused || document.hidden) {
      root.classList.remove('is-running');
      return;
    }

    restartProgress();
    timer = window.setTimeout(() => showSlide(currentIndex + 1), delay);
  };

  const showSlide = (index, options = {}) => {
    const nextIndex = (index + slides.length) % slides.length;
    currentIndex = nextIndex;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === nextIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    indicators.forEach((indicator, indicatorIndex) => {
      const active = indicatorIndex === nextIndex;
      indicator.setAttribute('aria-current', String(active));
    });

    if (status) {
      status.textContent = `第 ${nextIndex + 1} 张，共 ${slides.length} 张：${slideLabel(nextIndex)}`;
    }

    if (options.userInitiated) started = true;
    scheduleNext();
  };

  const goPrevious = () => showSlide(currentIndex - 1, { userInitiated: true });
  const goNext = () => showSlide(currentIndex + 1, { userInitiated: true });

  previousButton?.addEventListener('click', goPrevious);
  nextButton?.addEventListener('click', goNext);

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showSlide(index, { userInitiated: true }));
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrevious();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
    if (event.key === 'Home') {
      event.preventDefault();
      showSlide(0, { userInitiated: true });
    }
    if (event.key === 'End') {
      event.preventDefault();
      showSlide(slides.length - 1, { userInitiated: true });
    }
  });

  root.addEventListener('pointerenter', () => {
    paused = true;
    clearTimer();
    root.classList.remove('is-running');
  });

  root.addEventListener('pointerleave', () => {
    paused = false;
    scheduleNext();
  });

  root.addEventListener('focusin', () => {
    paused = true;
    clearTimer();
    root.classList.remove('is-running');
  });

  root.addEventListener('focusout', (event) => {
    if (root.contains(event.relatedTarget)) return;
    paused = false;
    scheduleNext();
  });

  root.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    pointerStartX = event.clientX;
  });

  root.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) < 48) return;
    distance > 0 ? goPrevious() : goNext();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimer();
      root.classList.remove('is-running');
    } else {
      scheduleNext();
    }
  });

  // 首次进入页面时若用户已手动操作，仍保持原定自动节奏。
  if (!reduceMotion) {
    window.setTimeout(() => {
      if (!started && !paused) scheduleNext();
    }, delay);
  }

  showSlide(currentIndex);
}

// 将初始化函数挂载到统一命名空间，供经典脚本环境按顺序调用。
window.Shuyun = window.Shuyun || {};
window.Shuyun.initCarousel = initCarousel;

})();
