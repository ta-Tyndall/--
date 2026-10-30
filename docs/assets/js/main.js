/**
 * 蜀韵·成都｜入口脚本
 * 使用 defer 经典脚本而非 ES Module，确保直接双击 HTML 以 file:// 打开时，
 * 浏览器也能按顺序加载各交互模块，不依赖本地 HTTP 服务。
 */
(function () {
  'use strict';

  var start = function () {
    document.documentElement.classList.remove('no-js');

    var app = window.Shuyun;
    if (!app) return;

    app.initNavigation();
    app.initReveal();
    app.initCarousel();
    app.initVideo();
    app.initInkCanvas();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
