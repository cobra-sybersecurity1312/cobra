/* Cobra intro — Islam Ali
   مدة الانترو الكلية: 6 ثواني (5.4 ثانية عرض + 0.6 ثانية اختفاء تدريجي). */
(function(){
  var KEY='cbIntroSeen';
  var TOTAL=6000, FADE=600, SHOW=TOTAL-FADE;   // غيّر TOTAL لو عايز مدة تانية
  /* وضع التشغيل:
     'always'  = يشتغل مع كل فتح للصفحة الرئيسية
     'session' = مرة واحدة في كل جلسة متصفح (ويشتغل تاني مع تحديث الصفحة)
     'days'    = مرة كل 3 أيام (الوضع القديم) */
  var MODE='session';
  var forced=location.search.indexOf('intro')>=0;
  try{
    if(!forced && MODE!=='always'){
      var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};
      var reloaded=nav.type==='reload';
      if(MODE==='session' && !reloaded && sessionStorage.getItem(KEY)) return;
      if(MODE==='days'){var seen=+localStorage.getItem(KEY)||0; if(seen && Date.now()-seen<3*864e5) return;}
    }
  }catch(e){}
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var lines=[{t:'ISLAM',light:2},{t:'ALI',light:0}];
  var el=document.createElement('div'); el.id='cbIntro';
  if(reduce) el.className='calm';   // نسخة هادية من غير فلاش ولا جلتش لمن يفضّل تقليل الحركة
  el.innerHTML='<div class="cbi-photo"></div><div class="cbi-grid"></div>'+
    '<div class="cbi-tag"><img src="cobra-logo.jpg" alt=""><span>AKA &nbsp;COBRA</span></div>'+
    '<h1 class="cbi-name" aria-label="Islam Ali"></h1>'+
    '<div class="cbi-sub"><b>أنا اللي بدخل الأنظمة… عشان تفضل إنت بره.</b><small>ETHICAL HACKER • CYBER SECURITY • COBRA7</small></div>'+
    '<img class="cbi-logo" src="cobra-logo.jpg" alt="Cobra">'+
    '<button type="button" class="cbi-skip" aria-label="تخطي المقدمة">تخطي ✕</button><div class="cbi-scan"></div><div class="cbi-bar"></div><div class="cbi-wipe"></div><div class="cbi-flash"></div>';
  document.documentElement.appendChild(el);
  var name=el.querySelector('.cbi-name'), chars=[];
  lines.forEach(function(l){
    var row=document.createElement('span'); row.className='cbi-line';
    l.t.split('').forEach(function(c,i){var s=document.createElement('span'); s.className='cbi-ch'; s.textContent=c; s.dataset.c=c; if(l.light&&i>=l.light) s.classList.add('light'); row.appendChild(s); chars.push(s);});
    name.appendChild(row);
  });
  var timers=[], done=false; function T(f,ms){timers.push(setTimeout(f,ms));}
  var pool='ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&01';
  function scramble(span,dur){var t0=Date.now(),orig=span.dataset.c;span.classList.add('glitch');var iv=setInterval(function(){if(Date.now()-t0>dur||done){clearInterval(iv);span.textContent=orig;span.classList.remove('glitch');return;}span.textContent=pool[Math.random()*pool.length|0];},55);}
  function finish(){
    if(done) return; done=true; timers.forEach(clearTimeout);
    el.classList.add('out');
    try{ sessionStorage.setItem(KEY,'1'); localStorage.setItem(KEY,String(Date.now())); }catch(e){}
    setTimeout(function(){el.remove();document.documentElement.style.overflow='';},FADE+60);
  }
  document.documentElement.style.overflow='hidden';
  el.querySelector('.cbi-skip').addEventListener('click',finish);
  document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){finish();document.removeEventListener('keydown',esc)}});
  var bar=el.querySelector('.cbi-bar'); bar.style.transition='width '+(SHOW/1000)+'s linear'; requestAnimationFrame(function(){requestAnimationFrame(function(){bar.style.width='100%'})});

  // 1) الحروف تطير جوه بالتتابع (0.2s → 1.8s)
  chars.forEach(function(c,i){T(function(){c.classList.add('in')},200+i*90);});
  if(!reduce){
    // 2) فلاش أبيض
    T(function(){el.classList.add('flash')},1900);
    // 3) مسحة النيون الأخضر (بتغطي الشاشة عند ~3.4s)
    T(function(){el.classList.add('wipe')},2900);
    // 5) glitch على الحروف عشوائي
    [3800,4100,4400,4700,5000].forEach(function(ms){T(function(){for(var k=0;k<4;k++){scramble(chars[Math.random()*chars.length|0],320);}},ms);});
    T(function(){var a=chars[chars.length-1];a.classList.add('lime');setTimeout(function(){a.classList.remove('lime')},280);},5000);
    T(function(){chars[chars.length-1].classList.add('lime')},5200);
  }
  // 4) الصورة تظهر بصبغة خضرا وبعدين تتحول أبيض واسود
  T(function(){el.classList.add('s3');el.querySelector('.cbi-photo').classList.add('tint')},reduce?2400:3350);
  T(function(){el.querySelector('.cbi-photo').classList.remove('tint')},reduce?3400:4150);
  // 6) الشعار + الجملة
  T(function(){el.classList.add('s4')},reduce?3200:4200);
  // 7) خروج: بعد 5.4 ثانية يبدأ الاختفاء، والاجمالي 6 ثواني
  T(finish,SHOW);
})();
