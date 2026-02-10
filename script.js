// script.js — vanilla JS interaksi untuk halaman Valentine
/* script.js - Vanilla JS untuk interaksi Valentine yang lebih kaya
   Features:
   - typing effect, section navigation
   - message cards flip
   - dodge button
   - timeline reveal (IntersectionObserver)
   - gallery tooltips (data-tip)
   - reasons animated list
   - final confetti hearts + optional bgm
   - dark mode, custom cursor, title easter-egg
*/
(function(){
  const heartsLayer = document.querySelector('.hearts');
  const enterBtn = document.getElementById('enterBtn');
  const randomMsgBtn = document.getElementById('randomMsg');
  const reactNo = document.getElementById('reactNo');
  const reactYes = document.getElementById('reactYes');
  const cards = document.querySelectorAll('.card');
  const tlItems = document.querySelectorAll('.tl-item');
  const icons = document.querySelectorAll('.gallery .icon');
  const reasonsList = document.querySelectorAll('.reasons-list li');
  const lastBtn = document.getElementById('lastBtn');
  const musicToggle = document.getElementById('musicToggle');
  const bgm = document.getElementById('bgm');
  const darkToggle = document.getElementById('darkToggle');
  const pageTitle = document.getElementById('pageTitle');

  // --- tiny utilities ---
  function createHeart(opts={}){
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = '❤️';
    const size = opts.size || Math.random()*18 + 18;
    h.style.fontSize = size + 'px';
    const left = (opts.left !== undefined) ? opts.left : Math.random()*100;
    h.style.left = left + 'vw';
    const dur = (opts.duration) || (4 + Math.random()*5);
    h.style.animationDuration = dur + 's, ' + (1.6 + Math.random()*1.2) + 's';
    h.style.opacity = 0.9 - Math.random()*0.3;
    heartsLayer.appendChild(h);
    h.addEventListener('animationend', ()=> h.remove());
    return h;
  }

  // gentle background spawn
  (function spawnGentle(){
    createHeart({left: Math.random()*100, size: 12 + Math.random()*26, duration: 5+Math.random()*6});
    setTimeout(spawnGentle, 700 + Math.random()*1300);
  })();

  // --- Landing typing effect ---
  (function typing(){
    const el = document.getElementById('typing');
    const text = el.textContent.trim();
    el.textContent = '';
    let i=0;
    function step(){
      if(i<=text.length){
        el.textContent = text.slice(0,i) + (i%2? '|' : '');
        i++;
        setTimeout(step, 60);
      } else {
        el.textContent = text;
      }
    }
    step();
  })();

  // --- Enter button: smooth scroll to section 'forYou' ---
  enterBtn.addEventListener('click', ()=>{
    document.getElementById('forYou').scrollIntoView({behavior:'smooth'});
    // small burst
    for(let i=0;i<8;i++) setTimeout(()=> createHeart({left:30+Math.random()*40,size:16+Math.random()*20,duration:3+Math.random()*2}), i*80);
  });

  // Random message generator (bonus)
  const randomMessages = [
    'Kamu itu bikin aku mikir hal-hal manis 💭',
    'Bersamamu rasanya waktu cepet banget ⏳',
    'Kamu mood-booster-ku tiap hari ☀️',
    'Nanti kita ngopi lagi ya? ☕️',
  ];
  randomMsgBtn.addEventListener('click', ()=>{
    const m = randomMessages[Math.floor(Math.random()*randomMessages.length)];
    alert(m);
  });

  // --- Cards flip ---
  cards.forEach(card=>{
    card.addEventListener('click', ()=> card.classList.toggle('flipped'));
  });

  // --- Dodge button behavior ---
  function dodge(btn){
    const parent = btn.parentElement;
    const w = parent.clientWidth;
    const moveX = (Math.random()*0.6 + 0.2) * (Math.random()>0.5? 1:-1) * w;
    btn.style.transform = `translateX(${moveX}px)`;
    setTimeout(()=> btn.style.transform = '', 600);
  }
  reactNo.addEventListener('mouseenter', ()=> dodge(reactNo));
  reactYes.addEventListener('click', ()=>{
    // show secret
    alert('Yey! Makasih ya 💕');
  });

  // --- Timeline reveal with IntersectionObserver ---
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  },{threshold:0.15});
  tlItems.forEach((it,i)=>{
    it.style.transition = `opacity .5s ease ${i*120}ms, transform .5s ease ${i*120}ms`;
    io.observe(it);
  });

  // --- gallery tooltips (data-tip) fallback for mobile: show brief alert on tap ---
  icons.forEach(ic=>{
    ic.addEventListener('click', ()=>{
      const tip = ic.getAttribute('data-tip');
      if(window.matchMedia('(hover: none)').matches){
        // mobile
        const t = document.createElement('div');
        t.className = 'toast'; t.textContent = tip; document.body.appendChild(t);
        setTimeout(()=> t.remove(),1600);
      } else {
        // desktop: nothing, CSS shows tooltip on hover
      }
    });
  });

  // --- Reasons list animation ---
  reasonsList.forEach((li, idx)=>{
    setTimeout(()=>{
      li.style.opacity = 1; li.style.transform = 'translateX(0)';
    }, 400 + idx*220);
  });

  // --- Final surprise: confetti hearts + music control ---
  function confettiHearts(count=40){
    for(let i=0;i<count;i++){
      setTimeout(()=> createHeart({left: 20 + Math.random()*60, size: 12+Math.random()*30, duration: 2+Math.random()*2}), i*30);
    }
  }
  lastBtn.addEventListener('click', ()=>{
    confettiHearts(50);
    alert('Senyum ya 😊');
  });

  // Music toggle: we don't ship audio, but allow toggling if user sets source
  let musicOn = false;
  musicToggle.addEventListener('click', ()=>{
    if(!bgm.src){
      // no source - gentle feedback
      musicToggle.textContent = 'No music file';
      setTimeout(()=> musicToggle.textContent = 'Play music ▶️',1200);
      return;
    }
    musicOn = !musicOn;
    if(musicOn){ bgm.play(); musicToggle.textContent = 'Pause ⏸️'; }
    else { bgm.pause(); musicToggle.textContent = 'Play music ▶️'; }
  });

  // --- Dark mode toggle ---
  darkToggle.addEventListener('click', ()=>{
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    darkToggle.setAttribute('aria-pressed', String(isDark));
  });

  // --- Custom cursor heart ---
  const cursor = document.createElement('div'); cursor.className = 'cursor-heart'; cursor.textContent = '❤'; document.body.appendChild(cursor);
  document.addEventListener('mousemove', (e)=>{
    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
  });

  // --- Title easter egg (click 5x to show random) ---
  let titleClicks = 0; let titleTimer = null;
  pageTitle.addEventListener('click', ()=>{
    titleClicks++;
    if(titleTimer) clearTimeout(titleTimer);
    titleTimer = setTimeout(()=> titleClicks=0, 1200);
    if(titleClicks>=5){
      titleClicks = 0;
      const m = randomMessages[Math.floor(Math.random()*randomMessages.length)];
      alert(m);
    }
  });

})();

