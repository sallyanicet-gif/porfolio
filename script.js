// script.js - Partie corrigée pour le mode sombre

// Helper : retourne l'élément ou null sans erreur
function el(id) { return document.getElementById(id); }

// ── État global ──────────────────────────────────────────────
const state = { dark: false, fontSize: 'normal', contrast: false, noAnim: false };

// ── Dark mode (commun) ───────────────────────────────────────
function setDark(on) {
    state.dark = on;
    // Changement ici : utiliser 'dark' au lieu de 'theme-dark'
    document.documentElement.classList.toggle('dark', on);
    const icon = el('header-icon');
    if (icon) icon.textContent = on ? '☀️' : '🌙';
    const header = el('main-header');
    if (header) header.style.background = on ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.85)';
    const toggle = el('dark-toggle');
    if (toggle) { toggle.classList.toggle('on', on); toggle.setAttribute('aria-checked', on); }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('dark-mode', on ? '1' : '0');
}

// Initialiser le mode sombre au chargement de la page
function initDarkMode() {
    const savedMode = localStorage.getItem('dark-mode') === '1';
    setDark(savedMode);
}

// Appeler l'initialisation au chargement
initDarkMode();

el('header-dark-btn')?.addEventListener('click', () => setDark(!state.dark));
el('dark-toggle')?.addEventListener('click',      () => setDark(!state.dark));

// ── Taille du texte (index uniquement) ──────────────────────
function setFontSize(size) {
    state.fontSize = size;
    document.body.classList.remove('text-large', 'text-xlarge');
    if (size === 'large')  document.body.classList.add('text-large');
    if (size === 'xlarge') document.body.classList.add('text-xlarge');
    document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === size));
}
el('btn-normal')?.addEventListener('click', () => setFontSize('normal'));
el('btn-large')?.addEventListener('click',  () => setFontSize('large'));
el('btn-xlarge')?.addEventListener('click', () => setFontSize('xlarge'));

// ── Contraste élevé (index uniquement) ──────────────────────
function setContrast(on) {
    state.contrast = on;
    document.documentElement.classList.toggle('high-contrast', on);
    const toggle = el('contrast-toggle');
    if (toggle) { toggle.classList.toggle('on', on); toggle.setAttribute('aria-checked', on); }
}
el('contrast-toggle')?.addEventListener('click', () => setContrast(!state.contrast));

// ── Désactiver animations (index uniquement) ─────────────────
function setAnim(disabled) {
    state.noAnim = disabled;
    document.documentElement.classList.toggle('no-animations', disabled);
    const toggle = el('anim-toggle');
    if (toggle) { toggle.classList.toggle('on', disabled); toggle.setAttribute('aria-checked', disabled); }
}
el('anim-toggle')?.addEventListener('click', () => setAnim(!state.noAnim));

// ── Réinitialiser (index uniquement) ────────────────────────
el('reset-btn')?.addEventListener('click', () => {
    setDark(false); setFontSize('normal'); setContrast(false); setAnim(false);
});

// ── Panel accessibilité (index uniquement) ───────────────────
const a11yBtn   = el('a11y-btn');
const a11yPanel = el('a11y-panel');
if (a11yBtn && a11yPanel) {
    a11yBtn.addEventListener('click', e => { e.stopPropagation(); a11yPanel.classList.toggle('open'); });
    document.addEventListener('click', e => {
        if (!a11yPanel.contains(e.target) && e.target !== a11yBtn) a11yPanel.classList.remove('open');
    });
}

// ── Particules hero (index uniquement) ──────────────────────
const particlesContainer = el('particles-container');
if (particlesContainer) {
    const colors = [
        'rgba(99,102,241,0.7)', 'rgba(139,92,246,0.6)',
        'rgba(37,99,235,0.6)',  'rgba(236,72,153,0.5)',
        'rgba(255,255,255,0.8)'
    ];
    function createParticle() {
        if (document.documentElement.classList.contains('no-animations')) return;
        const p = document.createElement('div');
        const size     = Math.random() * 5 + 2;
        const duration = Math.random() * 12 + 8;
        const delay    = Math.random() * 3;
        const color    = colors[Math.floor(Math.random() * colors.length)];
        p.className = 'particle';
        p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;bottom:-20px;`
            + `background:${color};animation-duration:${duration}s;animation-delay:${delay}s;`
            + `box-shadow:0 0 ${size*3}px ${color};`;
        particlesContainer.appendChild(p);
        setTimeout(() => { if (p.parentNode) p.remove(); }, (duration + delay + 1) * 1000);
    }
    for (let i = 0; i < 25; i++) setTimeout(createParticle, i * 150);
    setInterval(createParticle, 500);
}

// ── Menu mobile (commun) ────────────────────────────────────
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

// ── Formulaire de contact (index uniquement) ─────────────────
const contactForm = el('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name    = el('name').value.trim();
        const email   = el('email').value.trim();
        const message = el('message').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let valid = true;

        const nameErr = el('name-error');
        if (!name)   { nameErr.style.display = 'block'; valid = false; } else nameErr.style.display = 'none';

        const emailErr = el('email-error');
        if (!email || !emailRegex.test(email)) { emailErr.style.display = 'block'; valid = false; } else emailErr.style.display = 'none';

        const msgErr = el('message-error');
        if (!message) { msgErr.style.display = 'block'; valid = false; } else msgErr.style.display = 'none';

        if (!valid) return;
        const success = el('form-success');
        success.style.display = 'block';
        this.reset();
        setTimeout(() => { success.style.display = 'none'; }, 5000);
    });
}

// ── Filtrage par tag (project.html uniquement) ───────────────
const filterBar   = el('filter-bar');
const searchInput = el('tag-search');
const noResults   = el('no-results');
const cards       = document.querySelectorAll('.project-card[data-tags]');

if (filterBar && cards.length > 0) {
    // Générer les boutons de filtre depuis les tags des cartes
    const allTags = new Set();
    cards.forEach(card => card.dataset.tags.split(',').forEach(t => allTags.add(t.trim().toLowerCase())));

    allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className    = 'filter-btn';
        btn.dataset.tag  = tag;
        btn.textContent  = tag.charAt(0).toUpperCase() + tag.slice(1);
        filterBar.appendChild(btn);
    });

    let activeTag = 'all';

    function applyFilters() {
        const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
        let visibleCount = 0;

        cards.forEach(card => {
            const tags        = card.dataset.tags.split(',').map(t => t.trim().toLowerCase());
            const matchTag    = activeTag === 'all' || tags.includes(activeTag);
            const matchSearch = search === '' || tags.some(t => t.includes(search));

            if (matchTag && matchSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Clic sur un bouton de filtre
    filterBar.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTag = btn.dataset.tag;
        if (searchInput && activeTag !== 'all') searchInput.value = '';
        applyFilters();
    });

    // Clic sur un badge tag dans une carte
    document.querySelectorAll('.tag[data-tag]').forEach(tagEl => {
        tagEl.addEventListener('click', () => {
            const tag = tagEl.dataset.tag.toLowerCase();
            activeTag = tag;
            if (searchInput) searchInput.value = '';
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.tag === tag));
            applyFilters();
        });
    });

    // Recherche libre
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            activeTag = 'all';
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.tag === 'all'));
            applyFilters();
        });
    }
}
