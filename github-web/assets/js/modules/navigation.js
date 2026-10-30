(function () {
  'use strict';

/**
 * 移动端导航与滚动页头
 * - 负责菜单开合、焦点回退、Esc 关闭与断点复位
 * - 页头滚动后增加 is-scrolled，便于不同页面共享行为
 */
function initNavigation() {
  const navRoots = document.querySelectorAll('[data-mobile-nav]');

  navRoots.forEach((root) => {
    const toggle = root.querySelector('[data-nav-toggle]');
    const firstLink = root.querySelector('nav a');

    if (!toggle) return;

    const setOpen = (open) => {
      root.classList.toggle('is-nav-open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');

      if (open) {
        window.setTimeout(() => firstLink?.focus(), 220);
      }
    };

    toggle.addEventListener('click', () => {
      setOpen(!root.classList.contains('is-nav-open'));
    });

    root.querySelectorAll('nav a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && root.classList.contains('is-nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (root.classList.contains('is-nav-open') && !root.contains(event.target)) {
        setOpen(false);
      }
    });

    const desktopQuery = window.matchMedia('(min-width: 901px)');
    desktopQuery.addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });
  });

  const headers = document.querySelectorAll('[data-site-header]');
  if (!headers.length) return;

  let ticking = false;
  const updateHeaders = () => {
    headers.forEach((header) => {
      header.classList.toggle('is-scrolled', window.scrollY > 28);
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeaders);
  };

  updateHeaders();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// 将初始化函数挂载到统一命名空间，供经典脚本环境按顺序调用。
window.Shuyun = window.Shuyun || {};
window.Shuyun.initNavigation = initNavigation;

})();
