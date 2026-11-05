(function(){
  var nav=document.getElementById('nav'), btn=document.querySelector('.menu-btn');
  function onScroll(){nav.classList.toggle('scrolled',window.scrollY>40)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  if(btn){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
    nav.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')})});}
  var els=document.querySelectorAll('.rv,.chart,.card');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')})}
  else{var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.08});
    els.forEach(function(e){io.observe(e)});}

  // contact form (AJAX submit, falls back to normal POST without JS)
  var form=document.getElementById('form-contato');
  if(form){
    var status=form.querySelector('.form-status'), submit=form.querySelector('button[type=submit]');
    var p=new URLSearchParams(location.search);
    if(p.get('enviado')==='1'){status.className='form-status ok';status.textContent='Mensagem enviada! A gente responde em breve :)'}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return}
      submit.disabled=true;var t=submit.firstChild.textContent;submit.firstChild.textContent='Enviando… ';
      fetch(form.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)})
        .then(function(r){return r.json().then(function(j){if(!r.ok||j.success==='false'||j.success===false)throw j;return j})})
        .then(function(){form.reset();status.className='form-status ok';status.textContent='Mensagem enviada! A gente responde em breve :)'})
        .catch(function(){status.className='form-status err';status.innerHTML='Não foi possível enviar agora. Tente de novo ou escreva para <a href="mailto:contatovictoriacxavier@gmail.com">contatovictoriacxavier@gmail.com</a>.'})
        .finally(function(){submit.disabled=false;submit.firstChild.textContent=t;status.scrollIntoView({behavior:'smooth',block:'nearest'})});
    });
  }
})();
