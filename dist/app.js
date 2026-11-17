const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];

// Original aerial hero sequence: calm depth motion, manual selection and reduced-motion support.
const heroScenes=qsa('[data-hero-scene]'),heroSelectors=qsa('[data-hero-select]');
const heroLabels=['Solar infrastructure','Industrial earthworks','Transport corridor'];
let heroIndex=0,heroTimer;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
function selectHeroScene(index,userInitiated=false){
  heroIndex=index;
  heroScenes.forEach((scene,i)=>scene.classList.toggle('is-active',i===index));
  heroSelectors.forEach((button,i)=>{button.classList.toggle('is-active',i===index);button.setAttribute('aria-pressed',String(i===index))});
  const current=qs('[data-hero-current]'),label=qs('[data-hero-label]');
  if(current)current.textContent=String(index+1).padStart(2,'0');
  if(label)label.textContent=heroLabels[index];
  if(userInitiated)startHeroSequence();
}
function startHeroSequence(){
  clearInterval(heroTimer);
  if(!reduceMotion.matches&&heroScenes.length>1)heroTimer=setInterval(()=>selectHeroScene((heroIndex+1)%heroScenes.length),4000);
}
heroSelectors.forEach(button=>button.addEventListener('click',()=>selectHeroScene(Number(button.dataset.heroSelect),true)));
reduceMotion.addEventListener?.('change',startHeroSequence);
startHeroSequence();

// Header and mobile navigation
const header=qs('[data-header]'); let previousY=0;
addEventListener('scroll',()=>{const y=scrollY;header.classList.toggle('is-hidden',y>previousY&&y>160);previousY=y},{passive:true});
const menuButton=qs('.menu-button'),mobileMenu=qs('.mobile-menu');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));mobileMenu.hidden=open});
qsa('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false')}));

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
}

// Product story
const products=[
  {image:'assets/product/drone-ready.webp',alt:'Drone Mission Ops home showing sites and docked drones, with a drone controller beside the laptop',caption:'Sites and docked drones are ready for a repeatable mission workflow.'},
  {image:'assets/product/preflight.webp',alt:'Pre-flight checks on the drone controller: storage, battery thresholds, obstacle sensing and altitude limits',caption:'Pre-flight checks bring critical mission settings into one view.'},
  {image:'assets/product/health.webp',alt:'The drone health screen on the controller, showing battery, vision and satellite status',caption:'Health checks surface the operating state before capture.'},
  {image:'assets/product/live-capture.webp',alt:'Drone footage over a mine bench, with people detected and boxed',caption:'Live capture helps teams maintain an immediate view of the site.'},
  {image:'assets/product/unified-planning.webp',alt:'Live mission tracking, terrain-aware planning, elevation and airspace checks, and data checks',caption:'Planning, live mission tracking and data checks come together in one workflow.'}
];
const productStage=qs('[data-product-stage]');
const productButtons=qsa('[data-product]'),productFigure=qs('.product-visual',productStage);
let productIndex=0,productTimer,productSwap;
function selectProduct(index,userInitiated=false){
  productIndex=index;
  productButtons.forEach((button,i)=>{button.classList.toggle('is-active',i===index);button.setAttribute('aria-selected',String(i===index))});
  productFigure.classList.add('is-switching');
  clearTimeout(productSwap);
  productSwap=setTimeout(()=>{const p=products[index],img=qs('[data-product-image]');img.src=p.image;img.alt=p.alt;qs('[data-product-caption]').textContent=p.caption;qs('[data-current]').textContent=String(index+1).padStart(2,'0');productFigure.classList.remove('is-switching');productFigure.classList.remove('restart-progress');void productFigure.offsetWidth;productFigure.classList.add('restart-progress')},180);
  if(userInitiated)startProductStory();
}
function startProductStory(){clearInterval(productTimer);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)productTimer=setInterval(()=>selectProduct((productIndex+1)%products.length),5200)}
productButtons.forEach(button=>button.addEventListener('click',()=>selectProduct(Number(button.dataset.product),true)));
productStage.addEventListener('pointerenter',()=>clearInterval(productTimer));
productStage.addEventListener('pointerleave',startProductStory);
productStage.addEventListener('focusin',()=>clearInterval(productTimer));
productStage.addEventListener('focusout',event=>{if(!productStage.contains(event.relatedTarget))startProductStory()});
startProductStory();

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
