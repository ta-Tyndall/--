(function () {
  'use strict';

/**
 * 宣传视频控制器
 * 封面按钮触发播放；播放、结束与加载失败时同步界面状态。
 * 保留原生 controls，键盘、字幕与全屏能力均由浏览器提供。
 */
function initVideo() {
  const video = document.querySelector('[data-video-player]');
  const frame = document.querySelector('[data-video-frame]');
  const trigger = document.querySelector('[data-video-trigger]');

  if (!video || !frame || !trigger) return;

  const revealPoster = () => {
    frame.classList.remove('is-playing');
  };

  const playVideo = async () => {
    try {
      frame.classList.add('is-playing');
      video.controls = true;
      await video.play();
    } catch (error) {
      revealPoster();
      console.warn('宣传视频未能播放：', error);
    }
  };

  trigger.addEventListener('click', playVideo);
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    revealPoster();
  });

  // 若浏览器从系统菜单直接播放视频，也要让封面及时退场。
  video.addEventListener('play', () => frame.classList.add('is-playing'));
}

// 将初始化函数挂载到统一命名空间，供经典脚本环境按顺序调用。
window.Shuyun = window.Shuyun || {};
window.Shuyun.initVideo = initVideo;

})();
