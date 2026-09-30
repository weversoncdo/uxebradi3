const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
$('#openMenu')?.addEventListener('click',()=>$('#mobileMenu').classList.add('show'));
$('#closeMenu')?.addEventListener('click',()=>$('#mobileMenu').classList.remove('show'));
$('#openSearch')?.addEventListener('click',()=>$('#searchPanel').classList.toggle('show'));

// Submenu desktop interaction
const posGradItem = $('#posGradItem');
const posGradToggle = $('#posGradToggle');
posGradToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  posGradItem?.classList.toggle('open');
  const isOpen = posGradItem?.classList.contains('open');
  posGradToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
document.addEventListener('click', (e) => {
  if (posGradItem && !posGradItem.contains(e.target)) {
    posGradItem.classList.remove('open');
    posGradToggle?.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && posGradItem) {
    posGradItem.classList.remove('open');
    posGradToggle?.setAttribute('aria-expanded', 'false');
  }
});

// Mobile submenu interaction
const mobilePosBtn = $('#mobilePosBtn');
const mobilePosSub = $('#mobilePosSub');
mobilePosBtn?.addEventListener('click', () => {
  mobilePosBtn.classList.toggle('open');
  mobilePosSub?.classList.toggle('open');
  const isOpen = mobilePosBtn.classList.contains('open');
  mobilePosBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Filter groups collapsible in sidebar
$$('.filter-group button').forEach(b=>b.addEventListener('click',()=>{
  const g=b.parentElement;
  g.classList.toggle('open');
  b.querySelector('span').textContent=g.classList.contains('open')?'−':'+';
}));

const cards=$$('.card'), inputs=$$('.options input[type=checkbox]'), search=$('#searchInput');
function filter(){
  const active=inputs.filter(i=>i.checked && i.value).map(i=>i.value);
  const q=(search?.value||'').toLowerCase().trim();
  let visibleCount = 0;
  cards.forEach(c=>{
    const cat=c.dataset.cat,name=c.dataset.name;
    const okCat=!active.length||active.includes(cat);
    const okQ=!q||name.includes(q);
    const show = okCat && okQ;
    c.style.display=show?'':'none';
    if(show) visibleCount++;
  });
  const shownEl = $('#shown');
  if (shownEl) shownEl.textContent = visibleCount;
}
inputs.forEach(i=>i.addEventListener('change',filter));
search?.addEventListener('input',filter);
$('#searchForm')?.addEventListener('submit',e=>{e.preventDefault();filter();$('#searchPanel').classList.remove('show')});

// Menu link filtering helpers
$$('[data-filter]').forEach(link => {
  link.addEventListener('click', (e) => {
    const val = link.dataset.filter;
    $('#mobileMenu')?.classList.remove('show');
    posGradItem?.classList.remove('open');
    if (val) {
      // Find matching checkbox if exists
      const targetBox = inputs.find(i => i.value === val);
      if (targetBox) {
        inputs.forEach(i => i.checked = false);
        targetBox.checked = true;
        filter();
      }
    }
  });
});

$$('.area-chips button').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('active')));
$('#sort')?.addEventListener('change',e=>{
  const arr=[...$('#coursesGrid').children];
  if(e.target.value==='Nome A-Z') arr.sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name,'pt-BR'));
  else arr.sort((a,b)=>0);
  arr.forEach(x=>$('#coursesGrid').appendChild(x));
});
$('#loadMore')?.addEventListener('click',e=>{
  e.target.textContent='Todos os cursos exibidos';
  e.target.disabled=true;
});

