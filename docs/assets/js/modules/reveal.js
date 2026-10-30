(function () {
  'use strict';

/**
 * 滚动显影
 * 使用 IntersectionObserver 逐段揭示内容，避免整页同时出现。
 * 当用户开启“减少动态效果”或浏览器不支持时，直接展示全部内容。
 */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08,
    },
  );

  items.forEach((item) => observer.observe(item));
}

// 将初始化函数挂载到统一命名空间，供经典脚本环境按顺序调用。
window.Shuyun = window.Shuyun || {};
window.Shuyun.initReveal = initReveal;

})();
