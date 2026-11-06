(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav=document.getElementById('nav'), btn=document.querySelector('.menu-btn');

  // barra de progresso + cabeçalho que esconde ao rolar pra baixo
  var bar=document.createElement('div');bar.className='progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  var lastY=window.scrollY, ticking=false;
  function onScroll(){
    var y=window.scrollY, h=document.documentElement.scrollHeight-window.innerHeight;
    nav.classList.toggle('scrolled',y>40);
    bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
    if(!nav.classList.contains('open')){
      if(y>lastY+6&&y>160)nav.classList.add('hide');
      else if(y<lastY-6||y<160)nav.classList.remove('hide');
    }
    lastY=y;ticking=false;
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
  onScroll();

  // menu do celular
  if(btn){
    btn.addEventListener('click',function(){var o=nav.classList.toggle('open');nav.classList.remove('hide');btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Fechar menu':'Abrir menu')});
    nav.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')})});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.focus()}});
  }

  // cards da mesma grade aparecem em sequência
  document.querySelectorAll('.teasers,.services,.models,.steps,.bignums,.kpi3,.stats,.logos').forEach(function(g){
    var kids=g.classList.contains('logos')||g.classList.contains('bignums')||g.classList.contains('kpi3')||g.classList.contains('stats')?g.children:g.querySelectorAll(':scope>.rv');
    Array.prototype.forEach.call(kids,function(el,i){
      if(!el.classList.contains('rv'))el.classList.add('rv');
      el.style.transitionDelay=Math.min(i,8)*70+'ms';
    });
  });

  // números contando quando aparecem
  function countUp(el){
    var txt=el.textContent, m=txt.match(/^(\D*?)(\d[\d.]*(?:,\d+)?)(.*)$/);
    if(!m||reduce)return;
    var pre=m[1], raw=m[2], suf=m[3], dec=(raw.split(',')[1]||'').length;
    var target=parseFloat(raw.replace(/\./g,'').replace(',','.'));
    if(!isFinite(target)||target===0)return;
    var fmt=function(v){return pre+v.toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec,useGrouping:raw.indexOf('.')>-1})+suf};
    var t0=null, dur=1300;
    el.style.minWidth=el.offsetWidth+'px';
    function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);el.textContent=fmt(target*e);if(p<1)requestAnimationFrame(step);else{el.textContent=txt;el.style.minWidth=''}}
    el.textContent=fmt(0);requestAnimationFrame(step);
  }
  var nums=document.querySelectorAll('.bignums .num,.kpi3 .num,.stat .num,.ba .to,.card .big .num');

  // revelar ao rolar
  var els=document.querySelectorAll('.rv,.chart,.card');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')})}
  else{
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){var t=x.target;t.classList.add('in');io.unobserve(t);if(t.style.transitionDelay)setTimeout(function(){t.style.transitionDelay=''},1000+parseInt(t.style.transitionDelay,10))}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(e){io.observe(e)});
    var io2=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){countUp(x.target);io2.unobserve(x.target)}})},{threshold:.6});
    nums.forEach(function(n){io2.observe(n)});
  }

  // formulário de contato (envio sem recarregar; sem JS, envia normalmente)
  var form=document.getElementById('form-contato');
  if(form){
    var status=form.querySelector('.form-status'), submit=form.querySelector('button[type=submit]');
    var p=new URLSearchParams(location.search);
    if(p.get('enviado')==='1'){status.className='form-status ok';status.textContent='Mensagem enviada! A gente responde em até 2 dias úteis.'}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return}
      submit.disabled=true;var t=submit.firstChild.textContent;submit.firstChild.textContent='Enviando… ';
      fetch(form.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)})
        .then(function(r){return r.json().then(function(j){if(!r.ok||j.success==='false'||j.success===false)throw j;return j})})
        .then(function(){form.reset();status.className='form-status ok';status.textContent='Mensagem enviada! A gente responde em até 2 dias úteis.'})
        .catch(function(){var em=form.getAttribute('data-email');status.className='form-status err';status.innerHTML='Não foi possível enviar agora. Tente de novo ou escreva para <a href="mailto:'+em+'">'+em+'</a>.'})
        .finally(function(){submit.disabled=false;submit.firstChild.textContent=t;status.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'})});
    });
  }
})();
