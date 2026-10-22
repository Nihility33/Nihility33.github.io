/* ===== 作品集交互脚本 ===== */
(function(){
  'use strict';
  var doc = document;

  /* 1. 滚动渐入（IntersectionObserver） */
  var revealEls = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
    /* 兜底：IO 未触发（iframe/缩放等环境）时 1.2s 后强制全部显示，避免页面白屏 */
    setTimeout(function(){
      doc.querySelectorAll('.reveal:not(.in)').forEach(function(el){ el.classList.add('in'); });
    }, 1200);
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* 2. 数字滚动（count-up） */
  var nums = doc.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && nums.length) {
    var nio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute('data-count'));
        var decimals = (el.getAttribute('data-dec') || '0').length;
        var dur = 1100, start = null;
        function step(ts){
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          var v = target * ease;
          el.textContent = decimals ? v.toFixed(decimals) : Math.round(v).toString();
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        nio.unobserve(el);
      });
    }, { threshold: 0.4 });
    nums.forEach(function(el){ nio.observe(el); });
    /* 兜底：IO 未触发时 2s 后直接显示最终数值 */
    setTimeout(function(){
      doc.querySelectorAll('[data-count]').forEach(function(el){
        var target = parseFloat(el.getAttribute('data-count'));
        var decimals = (el.getAttribute('data-dec') || '0').length;
        el.textContent = decimals ? target.toFixed(decimals) : Math.round(target).toString();
      });
    }, 2000);
  }

  /* 3. 移动端菜单 */
  var toggle = doc.querySelector('.menu-toggle');
  var links = doc.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function(){
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '关闭' : '菜单';
    });
  }

  /* 4. 返回顶部 */
  var topBtn = doc.getElementById('topBtn');
  if (topBtn) {
    window.addEventListener('scroll', function(){
      if (window.scrollY > 420) topBtn.classList.add('show');
      else topBtn.classList.remove('show');
    }, { passive: true });
    topBtn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 5. 年份 */
  var y = doc.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
