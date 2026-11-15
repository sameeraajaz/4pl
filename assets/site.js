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
  $$('.quote-form').forEach(form=>{
    let oldURL=null;
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const data=new FormData(form);
      if(oldURL)URL.revokeObjectURL(oldURL);
      const labels={name:'Contact name',company:'Company',email:'Email',origin:'Origin',destination:'Destination',service:'Solution',weight:'Approximate cargo weight (kg)',ready:'Cargo ready date',details:'Cargo and handling details'};
      const content=['4PL — SHIPMENT PLANNING BRIEF','',...Object.entries(labels).map(([key,label])=>label+': '+(key==='service'?serviceNames[data.get(key)]||'Not specified':String(data.get(key)||'Not specified').trim())), '', 'This brief was prepared locally. No request has been submitted to 4PL.','A quotation requires confirmed cargo, route, service scope and commercial terms.'].join('\n');
      oldURL=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
      const result=$('[data-quote-result]',form);result.replaceChildren();result.hidden=false;
      const strong=document.createElement('strong');strong.textContent='Your shipment brief is ready.';
      const note=document.createElement('p');note.textContent='Download it to share with your logistics contact. No request has been sent.';
      const link=document.createElement('a');link.href=oldURL;link.download='4pl-shipment-brief.txt';link.textContent='Download shipment brief →';
      result.append(strong,note,link);link.focus();
    });
    form.addEventListener('input',()=>{const result=$('[data-quote-result]',form);if(!result.hidden){result.hidden=true;result.replaceChildren();if(oldURL){URL.revokeObjectURL(oldURL);oldURL=null;}}});
    window.addEventListener('pagehide',()=>{if(oldURL)URL.revokeObjectURL(oldURL);});
  });
  const tracking=$('#track-form');
  if(tracking){
    const result=$('#tracking-result'),input=$('#tracking-ref');
    function track(){const reference=input.value.trim().toUpperCase();result.replaceChildren();result.hidden=false;
      if(reference!=='4PL-DEMO-001'){result.textContent='Live tracking is not connected in this preview. Use 4PL-DEMO-001 to view an illustrative shipment.';return;}
      const strong=document.createElement('strong');strong.textContent='DEMO SHIPMENT · In transit';
      const route=document.createElement('div');route.textContent='Singapore → Rotterdam · Ocean freight';
      const timeline=document.createElement('div');timeline.className='timeline';
      ['Booked','Collected','In transit','Delivered'].forEach((label,i)=>{const step=document.createElement('span');step.textContent=label;if(i<3)step.className='done';timeline.append(step);});
      const note=document.createElement('p');note.className='result-note';note.textContent='Illustrative data only. These locations do not confirm service coverage.';
      result.append(strong,route,timeline,note);
    }
    tracking.addEventListener('submit',e=>{e.preventDefault();track();});
    $('#demo-track').addEventListener('click',()=>{input.value='4PL-DEMO-001';track();});
    input.addEventListener('input',()=>{result.hidden=true;result.replaceChildren();});
  }
  const tabs=$$('[data-industry]');
  function activate(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activate(tabs[next]);tabs[next].focus();}});});
  if($('#year'))$('#year').textContent=new Date().getFullYear();
  // Keep local-only forms inert until their submit handlers have been attached.
  $$('[data-enable-submit]').forEach(button=>{button.disabled=false;});
})();
