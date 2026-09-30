const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
$('#openMenu')?.addEventListener('click',()=>$('#mobileMenu').classList.add('show'));
$('#closeMenu')?.addEventListener('click',()=>$('#mobileMenu').classList.remove('show'));
$('#openSearch')?.addEventListener('click',()=>$('#searchPanel').classList.toggle('show'));

// Submenu desktop interaction
const posGradItem = $('#posGradItem');
const posGradToggle = $('#posGradToggle');

function openPosGrad() {
  posGradItem?.classList.add('open');
  posGradToggle?.setAttribute('aria-expanded', 'true');
}

function closePosGrad() {
  posGradItem?.classList.remove('open');
  posGradToggle?.setAttribute('aria-expanded', 'false');
}

posGradToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  if (posGradItem?.classList.contains('open')) {
    closePosGrad();
  } else {
    openPosGrad();
  }
});

posGradItem?.addEventListener('mouseenter', openPosGrad);
posGradItem?.addEventListener('mouseleave', closePosGrad);

document.addEventListener('click', (e) => {
  if (posGradItem && !posGradItem.contains(e.target)) {
    closePosGrad();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePosGrad();
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

// Course pill buttons filter logic (both sidebar and header pills)
const cards = $$('.card');
const search = $('#searchInput');

function filterCourses(categoryVal, query) {
  const q = (query || search?.value || '').toLowerCase().trim();
  let count = 0;
  cards.forEach(card => {
    const cat = card.dataset.cat || '';
    const name = (card.dataset.name || '').toLowerCase();
    let matchCat = true;
    if (categoryVal && categoryVal !== 'all') {
      matchCat = cat.includes(categoryVal) || name.includes(categoryVal) || (categoryVal === 'pos' && (cat === 'praxis' || cat === 'pos'));
    }
    const matchQ = !q || name.includes(q);
    const visible = matchCat && matchQ;
    card.style.display = visible ? '' : 'none';
    if (visible) count++;
  });
  const shownEl = $('#shown');
  if (shownEl) shownEl.textContent = count;
}

$$('.course-pill-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const val = btn.dataset.filter;
    // Set active style within the button group
    btn.parentElement.querySelectorAll('.course-pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterCourses(val);
  });
});

search?.addEventListener('input', () => filterCourses());
$('#searchForm')?.addEventListener('submit', e => {
  e.preventDefault();
  filterCourses();
  $('#searchPanel').classList.remove('show');
});

// Menu link filtering helpers
$$('[data-filter]').forEach(link => {
  if (link.classList.contains('course-pill-btn')) return;
  link.addEventListener('click', () => {
    const val = link.dataset.filter;
    $('#mobileMenu')?.classList.remove('show');
    closePosGrad();
    if (val) {
      filterCourses(val);
      // Synchronize with active state in sidebar if matching button exists
      const targetPill = $$('.sidebar-nossos-cursos .course-pill-btn').find(b => b.dataset.filter === val);
      if (targetPill) {
        $$('.sidebar-nossos-cursos .course-pill-btn').forEach(b => b.classList.remove('active'));
        targetPill.classList.add('active');
      }
    }
  });
});
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

// Mobile collapse for Nossos Cursos card in sidebar
const sidebarNossosCursos = $('#sidebarNossosCursos');
const sidebarCollapseToggle = $('#sidebarCollapseToggle');
const sidebarToggleHint = $('.sidebar-toggle-hint');

sidebarCollapseToggle?.addEventListener('click', () => {
  if (window.innerWidth <= 980) {
    const isOpen = sidebarNossosCursos?.classList.toggle('is-open');
    sidebarCollapseToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (sidebarToggleHint) {
      sidebarToggleHint.textContent = isOpen ? 'Toque para recolher' : 'Toque para expandir';
    }
  }
});

