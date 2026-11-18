const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];

// Hero footage runs slightly faster while respecting reduced-motion preferences.
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo=qs('[data-hero-video]');
function setHeroMotion(){if(!heroVideo)return;if(reduceMotion.matches){heroVideo.pause()}else{heroVideo.playbackRate=1.25;heroVideo.play().catch(()=>{})}}
heroVideo?.addEventListener('loadedmetadata',setHeroMotion,{once:true});
reduceMotion.addEventListener?.('change',setHeroMotion);
setHeroMotion();

// Header and mobile navigation
const header=qs('[data-header]'); let previousY=0;
addEventListener('scroll',()=>{const y=scrollY;header.classList.toggle('is-hidden',y>previousY&&y>160);previousY=y},{passive:true});
const menuButton=qs('.menu-button'),mobileMenu=qs('.mobile-menu');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open menu':'Close menu');mobileMenu.hidden=open});
qsa('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu')}));
addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');menuButton.focus()}});

// Progressive section reveals
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});
qsa('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%5,4)*55}ms`;observer.observe(el)});

// Uiverse-inspired card depth: a restrained pointer spotlight and subtle tilt.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  qsa('.clarity-node').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const bounds=card.getBoundingClientRect();
      const x=event.clientX-bounds.left,y=event.clientY-bounds.top;
      const rotateX=((y/bounds.height)-.5)*-3.5;
      const rotateY=((x/bounds.width)-.5)*4.5;
      card.style.setProperty('--mx',`${x}px`);
      card.style.setProperty('--my',`${y}px`);
      card.style.setProperty('--rx',`${rotateX}deg`);
      card.style.setProperty('--ry',`${rotateY}deg`);
    });
    card.addEventListener('pointerleave',()=>{
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
    });
  });
  qsa('.quote').forEach(card=>card.addEventListener('pointermove',event=>{const bounds=card.getBoundingClientRect();card.style.setProperty('--qx',`${event.clientX-bounds.left}px`);card.style.setProperty('--qy',`${event.clientY-bounds.top}px`)}));
}

// Interactive product workflow: SkyStation → Drone Mission Ops → Spectra → Your team + Skylark.
const workflowStages=[
  {kicker:'01 · Capture at site',title:'SkyStation',description:'Automated, repeatable drone capture keeps current site evidence flowing from the field.',output:'Consistent site capture',image:'assets/product/skystation-platform.png',alt:'SkyStation product view showing the stationed-system dashboard on a laptop alongside a drone field controller'},
  {kicker:'02 · Plan & operate',title:'Drone Mission Ops',description:'Plan missions, verify readiness and monitor flight execution from one operational workspace.',output:'Controlled mission execution',image:'assets/product/dmo-live-stream.png',alt:'Drone Mission Ops live-stream interface showing flight status, camera controls and the Share to Web dialog'},
  {kicker:'03 · Understand data',title:'Spectra',description:'Organize spatial data, inspect site evidence and turn captured information into actionable insight.',output:'Decision-ready intelligence',image:'assets/product/spectra-design-overlays.png',alt:'Spectra Design Overlays interface showing survey layers and mapped development boundaries'},
  {kicker:'04 · Decide & coordinate',title:'Your team + Skylark',description:'Work from a shared live operational view to coordinate inspection, verify conditions and move priorities forward.',output:'Coordinated site action',image:'assets/product/team-skylark-live-view.png',alt:'Shared Drone Mission Ops live view showing an aerial city feed, camera controls, flight telemetry and team coordination tools'}
];
const workflowExplorer=qs('[data-workflow-explorer]'),workflowButtons=qsa('[data-workflow-stage]'),workflowArrows=qsa('[data-workflow-arrow]'),workflowViewer=qs('.workflow-stage-viewer',workflowExplorer);
let workflowSwap,workflowTimer,workflowIndex=0,workflowVisible=false,workflowHovering=false,workflowFocused=false;
function startWorkflowMotion(){
  clearInterval(workflowTimer);
  if(workflowVisible&&!reduceMotion.matches&&!workflowHovering&&!workflowFocused)workflowTimer=setInterval(()=>selectWorkflowStage((workflowIndex+1)%workflowStages.length),1800);
}
function selectWorkflowStage(index,userInitiated=false){
  workflowIndex=index;
  workflowButtons.forEach((button,i)=>{button.classList.toggle('is-active',i===index);button.classList.toggle('is-complete',i<index);button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1});
  workflowArrows.forEach((arrow,i)=>{arrow.classList.toggle('is-flowing',i===index);arrow.classList.toggle('is-complete',i<index)});
  workflowViewer.setAttribute('aria-labelledby',workflowButtons[index].id);
  workflowViewer.classList.add('is-switching');
  clearTimeout(workflowSwap);
  workflowSwap=setTimeout(()=>{const stage=workflowStages[index],image=qs('[data-workflow-image]',workflowExplorer);image.src=stage.image;image.alt=stage.alt;qs('[data-workflow-kicker]',workflowExplorer).textContent=stage.kicker;qs('[data-workflow-title]',workflowExplorer).textContent=stage.title;qs('[data-workflow-description]',workflowExplorer).textContent=stage.description;qs('[data-workflow-output]',workflowExplorer).textContent=stage.output;qs('[data-workflow-current]',workflowExplorer).textContent=String(index+1).padStart(2,'0');workflowViewer.classList.remove('is-switching')},120);
  if(userInitiated)startWorkflowMotion();
}
workflowButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>selectWorkflowStage(index,true));
  button.addEventListener('keydown',event=>{if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;event.preventDefault();const next=(index+(event.key==='ArrowRight'?1:-1)+workflowButtons.length)%workflowButtons.length;workflowButtons[next].focus();selectWorkflowStage(next,true)});
});
workflowExplorer.addEventListener('pointerenter',()=>{workflowHovering=true;startWorkflowMotion()});
workflowExplorer.addEventListener('pointerleave',()=>{workflowHovering=false;startWorkflowMotion()});
workflowExplorer.addEventListener('focusin',()=>{workflowFocused=true;startWorkflowMotion()});
workflowExplorer.addEventListener('focusout',event=>{if(!workflowExplorer.contains(event.relatedTarget)){workflowFocused=false;startWorkflowMotion()}});
new IntersectionObserver(([entry])=>{workflowVisible=entry.isIntersecting;startWorkflowMotion()},{threshold:.25}).observe(workflowExplorer);
reduceMotion.addEventListener?.('change',startWorkflowMotion);

// Industry explorer. Copy is preserved from the source site.
const industries={
 solar:{name:'Solar',kicker:'Construction progress',title:'Track the build. Locate the faults.',description:'Assess terrain, verify construction progress, track loose inventory and locate module-level anomalies for maintenance.',image:'assets/aerial/solar.webp',alt:'Diagonal rows of solar panels in a desert solar park from the air',href:'https://skylarkdrones.com/solar',groups:[['EPC','AC and DC construction monitoring','Loose inventory tracking','Worksite safety monitoring'],['O&M','O&M inspection','Shadow analysis','Site patrolling and security monitoring'],['Hydrology','Land feasibility analysis']]},
 wind:{name:'Wind',kicker:'Construction readiness',title:'Plan access. Verify readiness.',description:'Evaluate access routes and substation locations, monitor construction and document feeder-line and commissioning readiness.',image:'assets/aerial/wind.webp',alt:'Wind turbines and a turbine under construction in dry scrubland, seen from the air',href:'https://skylarkdrones.com/',groups:[['Planning & readiness','Access routes and blade-swing clearance','Pooling substation location planning','Turbine-location readiness'],['Construction monitoring','Construction progress tracking','Crane utilisation','33 kV feeder-line inspection']]},
 mining:{name:'Mining',kicker:'Measure & reconcile',title:'Measure production from pit to stockpile.',description:'Track volumes and inventory, compare site changes and inspect operating conditions.',image:'assets/aerial/mining-live.webp',alt:'Haul trucks on an open-cast mine’s roads, seen from a drone',href:'https://skylarkdrones.com/mining',groups:[['Measure & reconcile','Stockpile and pit volume reconciliation','Mine plan vs actual excavation','Post-blast volume analysis'],['Monitor operations','Haul-road and bench condition monitoring','Haulage and crusher queue monitoring','Production and compliance reporting']]},
 rail:{name:'Railways & infrastructure',kicker:'Corridor progress',title:'Keep progress grounded in site evidence.',description:'Map corridors, verify earthworks, compare construction against plan and inspect infrastructure conditions.',image:'assets/aerial/rail.webp',alt:'An electrified freight railway beside a highway under construction, seen from above',href:'https://skylarkdrones.com/roads-railways',groups:[['Plan & build','Corridor mapping','Earthwork verification','Progress against plan'],['Operate & maintain','Infrastructure condition inspection']]},
 power:{name:'Power T&D',kicker:'Inspection corridor',title:'Make network condition easier to inspect.',description:'Identify component defects, thermal hotspots and vegetation encroachments to prioritise field inspection and maintenance.',image:'assets/aerial/power.webp',alt:'High-voltage lines and their shadows across fields',href:'https://skylarkdrones.com/industries-powerline-pipeline',groups:[['Plan & build','Corridor surveys'],['Operate & maintain','Component defect detection','Thermal hotspot detection','Vegetation encroachment']]},
 oil:{name:'Oil & gas',kicker:'Corridor inspection',title:'Bring remote corridors into view.',description:'Map pipeline corridors and surface potential defects, leaks and encroachments for investigation.',image:'assets/aerial/oil-gas.webp',alt:'A pipeline corridor with a fresh trench and a valve station across farmland, seen from the air',href:'https://skylarkdrones.com/industries-powerline-pipeline',groups:[['Plan & build','Pipeline corridor mapping'],['Operate & maintain','Potential defect and leak surfacing','Encroachment monitoring']]}
};
const industryPanel=qs('[data-industry-panel]');
qsa('[data-industry]').forEach(button=>button.addEventListener('click',()=>{const d=industries[button.dataset.industry];qsa('[data-industry]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));industryPanel.classList.add('is-switching');setTimeout(()=>{const image=qs('[data-industry-image]');image.src=d.image;image.alt=d.alt;qs('[data-industry-kicker]').textContent=d.kicker;qs('[data-industry-name]').textContent=d.name;qs('[data-industry-title]').textContent=d.title;qs('[data-industry-description]').textContent=d.description;const link=qs('[data-industry-link]');link.href=d.href;link.innerHTML=`Explore ${d.name.toLowerCase()} solutions <span>↗</span>`;qs('[data-industry-cases]').innerHTML=d.groups.map(g=>`<div><strong>${g[0]}</strong><ul>${g.slice(1).map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('');industryPanel.classList.remove('is-switching')},180)}));

// Accessible demo dialog with local-only validation and transparent simulated feedback.
const dialog=qs('.demo-dialog'),form=qs('#demo-form');
qsa('[data-open-dialog]').forEach(b=>b.addEventListener('click',()=>{dialog.showModal();requestAnimationFrame(()=>form.elements.name.focus())}));
qs('[data-close-dialog]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{qsa('.error',form).forEach(error=>error.textContent='');qs('.form-status',form).textContent=''});
form.addEventListener('input',e=>{const error=e.target.parentElement?.querySelector('.error');if(error)error.textContent='';qs('.form-status',form).textContent=''});
form.addEventListener('submit',e=>{e.preventDefault();let valid=true;qsa('[required]',form).forEach(field=>{const error=field.parentElement.querySelector('.error');if(!field.value.trim()){error.textContent='This field is required.';valid=false}else if(field.type==='email'&&!/^\S+@\S+\.\S+$/.test(field.value)){error.textContent='Enter a valid work email.';valid=false}else error.textContent=''});const status=qs('.form-status',form);if(valid){status.textContent='Demo request prepared. This preview does not send submissions.';form.querySelector('button').disabled=true;setTimeout(()=>{form.reset();form.querySelector('button').disabled=false},1800)}else status.textContent='Please review the highlighted fields.'});
