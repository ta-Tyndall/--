# 蜀韵 · 成都

一套以黑白水墨、宣纸留白和古乐器线描为核心视觉语言的成都文化旅游五页网站。页面不依赖第三方前端框架、在线字体或图库，所有视觉资源均可离线加载。

## 文件结构

```text
github-web/
├─ index.html                 首页：横向页头、全屏轮播、宣传视频、百字介绍
├─ food.html                  美食页：通栏导航、编辑式菜品阵列、折叠页尾
├─ sights.html                景点页：左侧固定导航、右侧景点长卷、极简页尾
├─ culture.html               文化页：居中对称导航、四艺拼贴、五器围合页尾
├─ travel.html                攻略页：极简页头、路线卡片、底部导航、展开式页尾
├─ 需求.txt                   原始需求
└─ assets/
   ├─ css/
   │  ├─ main.css             设计变量、基础排版、公共导航与滚动显影
   │  ├─ home.css             首页专属版式与轮播样式
   │  ├─ food.css             美食页专属版式
   │  ├─ sights.css           景点页专属版式
   │  ├─ culture.css          文化页专属版式
   │  └─ travel.css           攻略页专属版式
   ├─ js/
   │  ├─ main.js              defer 经典脚本入口，按 DOM 存在性初始化各模块
   │  └─ modules/
   │     ├─ navigation.js     移动菜单与滚动页头
   │     ├─ reveal.js         IntersectionObserver 滚动显影
   │     ├─ carousel.js       自动轮播、指示器、键盘与触摸控制
   │     ├─ video.js          宣传片封面与播放状态
   │     └─ ink-canvas.js     首页 Canvas 水墨粒子
   ├─ images/
   │  ├─ banner-*.svg         三帧成都主题轮播长卷
   │  ├─ food-*.svg           火锅、麻婆豆腐、担担面、盖碗茶
   │  ├─ instrument-*.svg     古琴、箫、笛、琵琶、埙
   │  ├─ culture-opera.svg    川剧脸谱
   │  ├─ sight-qingcheng.svg  青城山
   │  ├─ travel-map.svg       成都旅行路线图
   │  ├─ video-poster.svg     宣传片封面
   │  ├─ logo-qin.svg         古琴品牌徽记
   │  └─ paper-grain.svg      宣纸颗粒纹理
   └─ video/
      ├─ promo.mp4            19 秒本地宣传短片
      └─ promo.vtt            中文场景说明字幕
```

## 打开方式

可直接双击 `index.html` 用浏览器打开，无需本地服务器。交互脚本采用按顺序加载的经典 `defer` 脚本，可兼容 `file://` 环境，轮播、移动菜单、视频播放、滚动显影与 Canvas 水墨粒子均可正常运行。

如需使用本地 HTTP 服务调试，也可执行：

```powershell
cd D:\phpstudy_pro\github-web
python -m http.server 8000
```

浏览器打开 `http://localhost:8000/`。

## 设计与交互说明

- **色彩**：焦墨至淡墨九级灰阶为主，淡赭石、旧青与印章朱仅作低饱和点缀。
- **乐器**：装饰元素仅使用古琴、箫、笛、琵琶、埙五种 SVG 线描。
- **轮播**：7 秒自动切换，支持指示器、前后按钮、方向键、Home/End 与触摸滑动；悬停或聚焦时暂停。
- **视频**：默认显示本地 SVG 封面，点击后播放 19 秒 H.264 短片，保留原生进度、音量与全屏控件。
- **响应式**：主要断点为 1120px、980px、900px、760px、700px、640px、520px，针对各页面独立调整页头页尾。
- **无障碍**：提供跳转链接、可见焦点、语义化地标、轮播状态播报、视频字幕，并响应 `prefers-reduced-motion`。
- **渐进增强**：未加载 JavaScript 时，导航与正文仍可阅读，滚动显影内容默认可见。