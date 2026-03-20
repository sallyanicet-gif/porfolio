/* ============================================================
   script.js — Portfolio ANICET Neidjah
   Partagé entre index.html, project.html et contact.html.
   Chaque bloc est protégé par une vérification d'existence
   de l'élément : aucune erreur si un ID est absent.
   ============================================================ */

// ── Helper ───────────────────────────────────────────────────
const el = id => document.getElementById(id);

// ── État global ──────────────────────────────────────────────
const state = { dark: false, fontSize: 'normal', contrast: false, noAnim: false };

// ── Dark mode ────────────────────────────────────────────────
function setDark(on) {
    state.dark = on;
    document.documentElement.classList.toggle('dark', on);
    localStorage.setItem('darkMode', on ? '1' : '0');
    const icon   = el('header-icon');
    const toggle = el('dark-toggle');
    if (icon)   icon.textContent = on ? '☀️' : '🌙';
    if (toggle) { toggle.classList.toggle('on', on); toggle.setAttribute('aria-checked', on); }
}

// Restauration au chargement
if (localStorage.getItem('darkMode') === '1') setDark(true);

el('header-dark-btn')?.addEventListener('click', () => setDark(!state.dark));
el('dark-toggle')?.addEventListener('click',      () => setDark(!state.dark));

// ── Taille du texte ──────────────────────────────────────────
function setFontSize(size) {
    state.fontSize = size;
    document.body.classList.remove('text-large', 'text-xlarge');
    if (size === 'large')  document.body.classList.add('text-large');
    if (size === 'xlarge') document.body.classList.add('text-xlarge');
    document.querySelectorAll('.size-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.size === size)
    );
}
el('btn-normal')?.addEventListener('click',  () => setFontSize('normal'));
el('btn-large')?.addEventListener('click',   () => setFontSize('large'));
el('btn-xlarge')?.addEventListener('click',  () => setFontSize('xlarge'));

// ── Contraste élevé ──────────────────────────────────────────
function setContrast(on) {
    state.contrast = on;
    document.documentElement.classList.toggle('high-contrast', on);
    const toggle = el('contrast-toggle');
    if (toggle) { toggle.classList.toggle('on', on); toggle.setAttribute('aria-checked', on); }
}
el('contrast-toggle')?.addEventListener('click', () => setContrast(!state.contrast));

// ── Désactiver animations ────────────────────────────────────
function setAnim(disabled) {
    state.noAnim = disabled;
    document.documentElement.classList.toggle('no-animations', disabled);
    const toggle = el('anim-toggle');
    if (toggle) { toggle.classList.toggle('on', disabled); toggle.setAttribute('aria-checked', disabled); }
}
el('anim-toggle')?.addEventListener('click', () => setAnim(!state.noAnim));

// ── Réinitialiser accessibilité ──────────────────────────────
el('reset-btn')?.addEventListener('click', () => {
    setDark(false); setFontSize('normal'); setContrast(false); setAnim(false);
});

// ── Panel accessibilité ──────────────────────────────────────
const a11yBtn   = el('a11y-btn');
const a11yPanel = el('a11y-panel');
if (a11yBtn && a11yPanel) {
    a11yBtn.addEventListener('click', e => {
        e.stopPropagation();
        a11yPanel.classList.toggle('visible');
    });
    document.addEventListener('click', e => {
        if (!a11yPanel.contains(e.target) && e.target !== a11yBtn)
            a11yPanel.classList.remove('visible');
    });
}

// ── Menu mobile (index — navbar) ─────────────────────────────
const menuToggle = el('menuToggle');
const navLinks   = el('navLinks');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ── Menu mobile (project / contact — header) ─────────────────
const mobileBtn  = el('mobile-btn');
const mobileMenu = el('mobile-menu');
const iconMenu   = el('icon-menu');
const iconClose  = el('icon-close');
if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        if (iconMenu)  iconMenu.style.display  = isOpen ? 'none'  : 'block';
        if (iconClose) iconClose.style.display = isOpen ? 'block' : 'none';
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            if (iconMenu)  iconMenu.style.display  = 'block';
            if (iconClose) iconClose.style.display = 'none';
        });
    });
}

// ── Smooth scroll (index) ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = document.querySelector('.navbar')?.offsetHeight ?? 0;
        window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    });
});

// ── Animate on scroll ────────────────────────────────────────
const scrollObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animated'); }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

// ── Nav link active au scroll (index) ───────────────────────
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
if (sections.length && navLinkEls.length) {
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const id  = section.getAttribute('id');
            if (scrollY > top && scrollY <= top + section.offsetHeight) {
                navLinkEls.forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === '#' + id) l.classList.add('active');
                });
            }
        });
    });
}

// ── Filtrage par tag (project.html) ──────────────────────────
const filterBar   = el('filter-bar');
const searchInput = el('tag-search');
const noResults   = el('no-results');
const cards       = document.querySelectorAll('.project-card[data-tags]');

if (filterBar && cards.length > 0) {
    // Générer les boutons de filtre depuis les data-tags des cartes
    const allTags = new Set();
    cards.forEach(card =>
        card.dataset.tags.split(',').forEach(t => allTags.add(t.trim().toLowerCase()))
    );
    allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className   = 'filter-btn';
        btn.dataset.tag = tag;
        btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
        filterBar.appendChild(btn);
    });

    let activeTag = 'all';

    function applyFilters() {
        const search = searchInput?.value.trim().toLowerCase() ?? '';
        let count = 0;
        cards.forEach(card => {
            const tags        = card.dataset.tags.split(',').map(t => t.trim().toLowerCase());
            const matchTag    = activeTag === 'all' || tags.includes(activeTag);
            const matchSearch = search === '' || tags.some(t => t.includes(search));
            card.classList.toggle('hidden', !(matchTag && matchSearch));
            if (matchTag && matchSearch) count++;
        });
        if (noResults) noResults.style.display = count === 0 ? 'block' : 'none';
    }

    filterBar.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTag = btn.dataset.tag;
        if (searchInput && activeTag !== 'all') searchInput.value = '';
        applyFilters();
    });

    document.querySelectorAll('.tag[data-tag]').forEach(tagEl => {
        tagEl.addEventListener('click', () => {
            const tag = tagEl.dataset.tag.toLowerCase();
            activeTag = tag;
            if (searchInput) searchInput.value = '';
            document.querySelectorAll('.filter-btn').forEach(b =>
                b.classList.toggle('active', b.dataset.tag === tag)
            );
            applyFilters();
        });
    });

    searchInput?.addEventListener('input', () => {
        activeTag = 'all';
        document.querySelectorAll('.filter-btn').forEach(b =>
            b.classList.toggle('active', b.dataset.tag === 'all')
        );
        applyFilters();
    });
}
    // ── Filtrage par tag ──────────────────────────────────────
    (function() {
      const filterBar   = document.getElementById('filter-bar');
      const searchInput = document.getElementById('tag-search');
      const noResults   = document.getElementById('no-results');
      const cards       = document.querySelectorAll('.project-card[data-tags]');
      if (!filterBar || !cards.length) return;

      // Collecter tous les data-tag uniques depuis les spans .tag dans les cartes
      const allTags = new Set();
      cards.forEach(card => {
        card.querySelectorAll('.tag[data-tag]').forEach(t => allTags.add(t.dataset.tag.toLowerCase()));
      });

      // Générer les boutons de filtre
      allTags.forEach(tag => {
        // Trouver le label affiché depuis le span correspondant
        const label = document.querySelector(`.tag[data-tag="${tag}"]`)?.textContent.trim() ?? (tag.charAt(0).toUpperCase() + tag.slice(1));
        const btn = document.createElement('button');
        btn.className   = 'filter-btn';
        btn.dataset.tag = tag;
        btn.textContent = label;
        filterBar.appendChild(btn);
      });

      let activeTag = 'all';

      function applyFilters() {
        const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
        let count = 0;
        cards.forEach(card => {
          // Récupérer tous les data-tag des spans dans cette carte
          const tags = Array.from(card.querySelectorAll('.tag[data-tag]'))
                            .map(t => t.dataset.tag.toLowerCase());
          // Aussi chercher dans le texte des tags (pour la barre de recherche)
          const tagTexts = Array.from(card.querySelectorAll('.tag[data-tag]'))
                               .map(t => t.textContent.trim().toLowerCase());

          const matchTag    = activeTag === 'all' || tags.includes(activeTag);
          const matchSearch = search === '' ||
                              tags.some(t => t.includes(search)) ||
                              tagTexts.some(t => t.includes(search));

          const visible = matchTag && matchSearch;
          card.classList.toggle('hidden', !visible);
          if (visible) count++;
        });
        if (noResults) noResults.style.display = count === 0 ? 'block' : 'none';
      }

      // Clic bouton filtre
      filterBar.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTag = btn.dataset.tag;
        if (searchInput && activeTag !== 'all') searchInput.value = '';
        applyFilters();
      });

      // Clic sur un tag dans une carte
      cards.forEach(card => {
        card.querySelectorAll('.tag[data-tag]').forEach(tagEl => {
          tagEl.addEventListener('click', () => {
            const tag = tagEl.dataset.tag.toLowerCase();
            activeTag = tag;
            if (searchInput) searchInput.value = '';
            document.querySelectorAll('.filter-btn').forEach(b =>
              b.classList.toggle('active', b.dataset.tag === tag)
            );
            applyFilters();
          });
        });
      });

      // Recherche libre
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          activeTag = 'all';
          document.querySelectorAll('.filter-btn').forEach(b =>
            b.classList.toggle('active', b.dataset.tag === 'all')
          );
          applyFilters();
        });
      }
    })();
