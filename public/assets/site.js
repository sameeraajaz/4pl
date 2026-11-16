'use strict';
(()=>{
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const menu=$('.menu'),nav=$('#navlinks');
  function closeMenu(){if(!menu||!nav)return;nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');menu.textContent='☰';}
  if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');menu.textContent=open?'×':'☰';});
  $$('#navlinks a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu();});
  function openModal(id){closeMenu();const dialog=document.getElementById(id);if(dialog&&!dialog.open)dialog.showModal();}
  $$('[data-open]').forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.quoteService){const form=$('#quote-form');if(form)form.elements.service.value=b.dataset.quoteService;}
    openModal(b.dataset.open);
  }));
  $$('.close-modal').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  $$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}));
  const planner=$('#shipment-planner');
  if(planner)planner.addEventListener('submit',e=>{e.preventDefault();const quote=$('#quote-form');['origin','destination','service'].forEach(key=>{quote.elements[key].value=planner.elements[key].value.trim();});openModal('quote');});
  const serviceNames={ocean:'Ocean freight',air:'Air freight',road:'Road transport',supply:'4PL & supply chain management',unsure:'Help me choose'};
  const heroModes=$$('[data-hero-mode]');
  heroModes.forEach(button=>button.addEventListener('click',()=>{
    const supply=button.dataset.heroMode==='supply';
    heroModes.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    $('[data-hero-first]').textContent=supply?'Bring it all.':'Make your';
    $('[data-hero-second]').textContent=supply?'Together.':'next move.';
    $('#hero-description').textContent=supply?
      'Bring logistics partners, shipments and decisions together with a fourth-party logistics approach. One plan for the bigger picture.':
      'Ocean, air and road freight, planned around your cargo and your next destination. Clear details. Connected journeys.';
    $('#hero-quote').dataset.quoteService=supply?'supply':'unsure';
    if(planner)planner.elements.service.value=supply?'supply':'unsure';
  }));
  let emailEnabled=false;
  const forms=$$('.quote-form');
  const labels={name:'Contact name',company:'Company',email:'Email',origin:'Origin',destination:'Destination',service:'Solution',weight:'Approximate cargo weight (kg)',ready:'Cargo ready date',details:'Cargo and handling details'};
  forms.forEach(form=>{
    let oldURL=null;
    const submit=$('button[type="submit"]',form),result=$('[data-quote-result]',form);
    const trap=document.createElement('label');trap.className='form-honeypot';trap.setAttribute('aria-hidden','true');trap.textContent='Leave this field empty';
    const trapInput=document.createElement('input');trapInput.name='_website';trapInput.tabIndex=-1;trapInput.autocomplete='off';trap.append(trapInput);form.append(trap);
    const download=document.createElement('button');download.type='button';download.className='brief-download-action';download.textContent='Download a brief instead';download.hidden=true;form.append(download);
    function clearResult(){result.hidden=true;result.replaceChildren();result.classList.remove('is-error');result.setAttribute('role','status');if(oldURL){URL.revokeObjectURL(oldURL);oldURL=null;}if(form.getAttribute('aria-busy')!=='true')submit.disabled=false;}
    function createBrief(){
      const data=new FormData(form);clearResult();
      const content=['4PL — SHIPMENT PLANNING BRIEF','',...Object.entries(labels).map(([key,label])=>label+': '+(key==='service'?serviceNames[data.get(key)]||'Not specified':String(data.get(key)||'Not specified').trim())), '', 'This brief was prepared locally. Downloading does not submit an enquiry.','A quotation requires confirmed cargo, route, service scope and commercial terms.'].join('\n');
      oldURL=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
      const strong=document.createElement('strong');strong.textContent='Your shipment brief is ready.';
      const note=document.createElement('p');note.textContent='Download it to share with your logistics contact. No request has been sent by this download action.';
      const link=document.createElement('a');link.href=oldURL;link.download='4pl-shipment-brief.txt';link.textContent='Download shipment brief →';
      result.append(strong,note,link);result.hidden=false;link.focus();
    }
    download.addEventListener('click',()=>{if(form.reportValidity())createBrief();});
    form.addEventListener('submit',async e=>{
      e.preventDefault();if(!emailEnabled){createBrief();return;}if(form.getAttribute('aria-busy')==='true')return;
      const data=new FormData(form),payload={};Object.keys(labels).forEach(key=>{payload[key]=String(data.get(key)||'');});payload._website=String(data.get('_website')||'');
      clearResult();const controls=$$('input,select,textarea,button',form);const states=controls.map(control=>control.disabled);controls.forEach(control=>{control.disabled=true;});form.setAttribute('aria-busy','true');submit.textContent='Sending enquiry…';
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);let accepted=false;
      try{
        const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(payload),signal:controller.signal});
        const body=await response.json().catch(()=>null);
        if(!response.ok||body?.ok!==true)throw new Error(body?.error||'We could not confirm email acceptance. Your details are still available.');
        const strong=document.createElement('strong');strong.textContent='Your enquiry has been accepted for email delivery.';
        const note=document.createElement('p');note.textContent='This is not a confirmed quotation or booking. The team can reply using the email address you provided.';result.append(strong,note);result.hidden=false;accepted=true;
      }catch(error){
        result.classList.add('is-error');result.setAttribute('role','alert');result.textContent=error?.name==='AbortError'?'We could not confirm email acceptance in time. Your details are still here. Check before resubmitting to avoid a duplicate, or download your brief.':error instanceof TypeError?'We could not confirm email acceptance. Check your connection before resubmitting, or download your brief.':error.message;result.hidden=false;
      }finally{
        clearTimeout(timer);controls.forEach((control,i)=>{control.disabled=states[i];});form.removeAttribute('aria-busy');submit.innerHTML='Send enquiry <span class="arrow" aria-hidden="true">↗</span>';if(accepted)submit.disabled=true;
      }
    });
    form.addEventListener('input',()=>{if(form.getAttribute('aria-busy')!=='true')clearResult();});
    window.addEventListener('pagehide',()=>{if(oldURL)URL.revokeObjectURL(oldURL);});
  });
  if(forms.length&&typeof fetch==='function'){
    fetch('/api/enquiries',{cache:'no-store',credentials:'same-origin'}).then(response=>response.ok?response.json():null).then(config=>{
      if(config?.enabled!==true)return;emailEnabled=true;
      forms.forEach(form=>{
        $('button[type="submit"]',form).innerHTML='Send enquiry <span class="arrow" aria-hidden="true">↗</span>';
        $('.brief-download-action',form).hidden=false;
        $('.formnote',form).textContent='Send your requirements to the 4PL enquiry inbox. Sending an enquiry does not confirm a price or booking.';
        $('.form-privacy',form).innerHTML='Your submitted details will be processed by the configured email service and business inbox. Read the <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms-and-conditions">website terms</a> before sending.';
        const steps=$$('.brief-flow span',form);if(steps[1])steps[1].innerHTML='<b>2</b> Send your enquiry';if(steps[2])steps[2].innerHTML='<b>3</b> Await a reply';
      });
      const plannerNote=$('.planner-footnote');if(plannerNote)plannerNote.innerHTML='Start with your route, then review and send your enquiry. <a href="/privacy-policy">How your details are handled ↗</a>';
    }).catch(()=>{/* Download mode remains available when email readiness cannot be checked. */});
  }
  const tabs=$$('[data-industry]');
  function activate(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activate(tabs[next]);tabs[next].focus();}});});
  if($('#year'))$('#year').textContent=new Date().getFullYear();
  // Keep local-only forms inert until their submit handlers have been attached.
  $$('[data-enable-submit]').forEach(button=>{button.disabled=false;});
})();

// Content is visible by default; reveal only below-fold content when motion is welcome.
(()=>{if(!('IntersectionObserver' in window)||!window.matchMedia||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.dataset.inView='true';observer.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll('.people-grid,.journey-grid,.local-story-grid,.service-card').forEach(el=>{if(el.getBoundingClientRect().top>window.innerHeight+40){el.classList.add('reveal-ready');el.dataset.inView='false';observer.observe(el);}});
})();
