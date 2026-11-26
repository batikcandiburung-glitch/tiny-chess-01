import * as views from './views.js';
import { SERIES, PROVINCES } from './data.js';
import * as charts from './charts.js';
import { getSettings, setSetting, applySettings } from './settings.js';
import { t, pick, unit, numLocale } from './i18n.js';
import { animate, stagger, createDrawable } from '../vendor/anime.esm.min.js';

// Module scope setup
applySettings();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || getSettings().motion === 'reduced';
const Lenis = window.Lenis;

let lenis = null;

// Scroll progress fill in the sidebar (height on desktop, width on mobile)
function updateScrollProgress() {
  try {
    const fill = document.querySelector('.scroll-progress-fill');
    if (!fill) return;
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    const frac = max > 0 ? Math.min(1, (window.scrollY || el.scrollTop) / max) : 0;
    const pct = (frac * 100).toFixed(2) + '%';
    const viewMode = getSettings().view;
    const horizontal = viewMode === 'phone' || (viewMode === 'auto' && window.matchMedia('(max-width: 900px)').matches);
    if (horizontal) {
      fill.style.width = pct;
      fill.style.height = '100%';
    } else {
      fill.style.height = pct;
      fill.style.width = '100%';
    }
  } catch (e) { /* progress is decorative */ }
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

if (Lenis && !reducedMotion) {
  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    updateScrollProgress();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Inject skeleton styles if not present
const skeletonStyleId = 'angka-skeleton-style';
if (!document.getElementById(skeletonStyleId)) {
  const styleEl = document.createElement('style');
  styleEl.id = skeletonStyleId;
  styleEl.textContent = `
    .skeleton { display: flex; flex-direction: column; gap: 2.5rem; width: 100%; }
    .skel-hero { height: 220px; background: linear-gradient(90deg, var(--skeleton-bg) 25%, var(--surface-2) 50%, var(--skeleton-bg) 75%); background-size: 200% 100%; animation: skel-pulse 1.5s infinite; border-radius: 24px; }
    .skel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    .skel-card { height: 160px; background: linear-gradient(90deg, var(--skeleton-bg) 25%, var(--surface-2) 50%, var(--skeleton-bg) 75%); background-size: 200% 100%; animation: skel-pulse 1.5s infinite; border-radius: 18px; }
    @keyframes skel-pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `;
  document.head.appendChild(styleEl);
}

const routes = {
  '/': views.viewOverview,
  '/economy': views.viewEconomy,
  '/people': views.viewPeople,
  '/provinces': views.viewProvinces,
  '/regions': views.viewRegions,
  '/sources': views.viewSources
};

let renderToken = 0;
let activeAnimations = [];

// Scroll animations replay every time their target comes back into view
// while scrolling DOWN; while scrolling UP there is no replay — targets
// snap straight to their finished state. (Anime's onScroll play fires
// only once, so an IntersectionObserver drives this instead.)
let scrollDirection = 'down';
let lastScrollPos = window.scrollY || 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY || 0;
  // The reference position only moves once the threshold is crossed, so
  // small smooth-scroll steps accumulate instead of never registering.
  if (y > lastScrollPos + 4) { scrollDirection = 'down'; lastScrollPos = y; }
  else if (y < lastScrollPos - 4) { scrollDirection = 'up'; lastScrollPos = y; }
}, { passive: true });

const animsByTarget = new Map();
const replayObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const anims = animsByTarget.get(entry.target);
    if (!anims) return;
    if (scrollDirection === 'up') {
      anims.forEach(a => {
        try { a.complete(); } catch (e) { try { a.seek(999999); } catch (e2) {} }
      });
    } else {
      anims.forEach(a => { try { a.restart(); } catch (e) {} });
    }
  });
}, { threshold: 0.1 }) : null;

function registerAnim(anim, targetEl) {
  if (!anim) return;
  activeAnimations.push(anim);
  try { anim.pause(); } catch (e) {}
  if (!replayObserver || !targetEl) return;
  if (!animsByTarget.has(targetEl)) {
    animsByTarget.set(targetEl, []);
    replayObserver.observe(targetEl);
  }
  animsByTarget.get(targetEl).push(anim);
}

function clearAnimRegistry() {
  if (replayObserver) replayObserver.disconnect();
  animsByTarget.clear();
}

// --- Chart tooltip (delegated, one element for the whole app) ---
let chartTipEl = null;
function hideChartTip() {
  if (chartTipEl) chartTipEl.classList.remove('show');
}
function initChartTooltip() {
  const appEl = document.getElementById('app');
  if (!appEl || appEl.dataset.tipWired) return;
  appEl.dataset.tipWired = '1';
  const ensureTip = () => {
    if (!chartTipEl) {
      chartTipEl = document.createElement('div');
      chartTipEl.className = 'chart-tip';
      document.body.appendChild(chartTipEl);
    }
    return chartTipEl;
  };
  const position = (e) => {
    const tip = ensureTip();
    tip.style.left = e.clientX + 'px';
    tip.style.top = e.clientY + 'px';
  };
  appEl.addEventListener('pointerover', (e) => {
    try {
      const t = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
      if (t && appEl.contains(t)) {
        const tip = ensureTip();
        tip.textContent = t.getAttribute('data-tip');
        position(e);
        tip.classList.add('show');
      } else {
        hideChartTip();
      }
    } catch (err) { /* tooltip must never break the page */ }
  });
  appEl.addEventListener('pointermove', (e) => {
    try {
      if (chartTipEl && chartTipEl.classList.contains('show')) position(e);
    } catch (err) { /* ignore */ }
  });
  appEl.addEventListener('pointerout', (e) => {
    const t = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
    if (t) hideChartTip();
  });
  window.addEventListener('scroll', hideChartTip, { passive: true });
}

function renderRoute() {
  const currentToken = ++renderToken;
  const hash = window.location.hash || '#/';
  const routePath = hash.replace('#', '') || '/';
  const renderFunc = routes[routePath] || views.viewOverview;

  const appEl = document.getElementById('app');
  if (!appEl) return;

  hideChartTip();

  // Revert previous animations at the start of next route render
  activeAnimations.forEach(anim => {
    if (anim && typeof anim.revert === 'function') {
      anim.revert();
    }
  });
  activeAnimations = [];
  clearAnimRegistry();

  const executeRender = () => {
    if (currentToken !== renderToken) return;

    appEl.innerHTML = renderFunc();

    // Page transition: re-trigger the pageIn animation on each render
    if (!reducedMotion) {
      appEl.classList.remove('page-enter');
      void appEl.offsetWidth;
      appEl.classList.add('page-enter');
      setTimeout(() => appEl.classList.remove('page-enter'), 450);
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === routePath || (route === '/' && routePath === '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    try {
      // Post-render page-specific wiring
      if (routePath === '/economy') {
        initEconomyExplorer();
      } else if (routePath === '/provinces') {
        initProvinceSorting();
      }

      // Entrance and scroll animations
      if (!reducedMotion) {
        const elements = appEl.querySelectorAll('.hero-band, .tile, .stat-card, .chart-card, .table-card, .section-header');
        elements.forEach(el => {
          const parent = el.parentNode;
          const siblings = parent ? Array.from(parent.children) : [];
          const index = siblings.indexOf(el);
          const delay = Math.min(index * 50, 300);

          const anim = animate(el, {
            opacity: [0, 1],
            translateY: [16, 0],
            duration: 550,
            ease: 'outQuad',
            delay: delay,
            autoplay: false
          });
          if (anim) {
            registerAnim(anim, el);
          }
        });

        initAnimeWiring();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (reducedMotion) {
    executeRender();
  } else {
    appEl.innerHTML = `
      <div class="skeleton">
        <div class="skel-hero"></div>
        <div class="skel-grid">
          <div class="skel-card"></div>
          <div class="skel-card"></div>
          <div class="skel-card"></div>
          <div class="skel-card"></div>
          <div class="skel-card"></div>
          <div class="skel-card"></div>
        </div>
      </div>
    `;

    setTimeout(() => {
      if (currentToken === renderToken) {
        executeRender();
      }
    }, 450);
  }
}

function initAnimeWiring() {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  // 1. Line drawing
  try {
    appEl.querySelectorAll('.draw-line').forEach(el => {
      try {
        const drawables = createDrawable(el);
        if (drawables) {
          drawables.forEach(proxy => {
            const anim = animate(proxy, {
              draw: ['0 0', '0 1'],
              duration: 900,
              ease: 'outExpo',
              autoplay: false
            });
            if (anim) registerAnim(anim, el);
          });
        }
      } catch (err) {}
    });
  } catch (e) {}

  // 2. Area fills
  try {
    appEl.querySelectorAll('.fade-area').forEach(el => {
      try {
        const anim = animate(el, {
          opacity: [0, 1],
          duration: 600,
          autoplay: false
        });
        if (anim) registerAnim(anim, el);
      } catch (err) {}
    });
  } catch (e) {}

  // 3. End dots
  try {
    appEl.querySelectorAll('.pop-dot').forEach(el => {
      try {
        const anim = animate(el, {
          scale: [0, 1],
          transformOrigin: '50% 50%',
          duration: 500,
          ease: 'outBack',
          delay: 500,
          autoplay: false
        });
        if (anim) registerAnim(anim, el);
      } catch (err) {}
    });
  } catch (e) {}

  // 4. Bars
  try {
    const barEls = Array.from(appEl.querySelectorAll('.grow-bar'));
    const horizBars = [];
    const vertBars = [];
    barEls.forEach(el => {
      // Orientation comes from the chart builder (data-orient), never from
      // the rect's aspect ratio: a short vertical bar is wider than tall
      // and was misclassified as horizontal (grew left-to-right).
      if (el.getAttribute('data-orient') === 'h') {
        horizBars.push(el);
      } else {
        vertBars.push(el);
      }
    });

    if (horizBars.length > 0) {
      const anim = animate(horizBars, {
        scaleX: [0, 1],
        transformOrigin: '0% 50%',
        duration: 700,
        delay: stagger(40),
        autoplay: false
      });
      if (anim) registerAnim(anim, horizBars[0].closest('.chart-card') || horizBars[0]);
    }
    if (vertBars.length > 0) {
      const anim = animate(vertBars, {
        scaleY: [0, 1],
        transformOrigin: '50% 100%',
        duration: 700,
        delay: stagger(40),
        autoplay: false
      });
      if (anim) registerAnim(anim, vertBars[0].closest('.chart-card') || vertBars[0]);
    }
  } catch (e) {}

  // 5. Count-ups
  try {
    appEl.querySelectorAll('[data-count]').forEach(el => {
      let finalFormatted = '';
      try {
        const target = parseFloat(el.getAttribute('data-count'));
        if (isNaN(target)) return;
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const isEn = el.getAttribute('data-format') === 'en';

        const formatVal = (v) => {
          if (isEn) {
            return v.toLocaleString(numLocale(), {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            });
          }
          return v.toFixed(decimals);
        };

        finalFormatted = formatVal(target);

        const o = { v: 0 };
        const anim = animate(o, {
          v: target,
          duration: 900,
          ease: 'outExpo',
          autoplay: false,
          onUpdate: () => {
            try {
              el.textContent = formatVal(o.v);
            } catch (err) {}
          }
        });
        if (anim) {
          registerAnim(anim, el);
        }
      } catch (err) {
        if (finalFormatted) {
          try { el.textContent = finalFormatted; } catch (e2) {}
        }
      }
    });
  } catch (e) {}

  // 6. Pictogram dots
  try {
    const dotEls = appEl.querySelectorAll('.dot');
    if (dotEls.length > 0) {
      const anim = animate(dotEls, {
        scale: [0, 1],
        transformOrigin: '50% 50%',
        duration: 500,
        ease: 'outBack',
        delay: stagger(12),
        autoplay: false
      });
      if (anim) {
        registerAnim(anim, dotEls[0].closest('.tile') || dotEls[0]);
      }
    }
  } catch (e) {}
}

function initEconomyExplorer() {
  const seriesSelect = document.getElementById('series-select');
  const fromSelect = document.getElementById('series-from');
  const chartContainer = document.getElementById('series-chart');
  const tableContainer = document.getElementById('series-table');
  const csvButton = document.getElementById('series-csv');

  if (!seriesSelect || !fromSelect || !chartContainer || !tableContainer || !csvButton) return;

  // Populate series select if empty
  if (seriesSelect.options.length === 0) {
    Object.values(SERIES).forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = pick(s, 'title');
      seriesSelect.appendChild(opt);
    });
  }

  function updateExplorer() {
    const seriesId = seriesSelect.value || 'gdp-growth';
    const seriesData = SERIES[seriesId];
    if (!seriesData) return;

    if (seriesId === 'trade') {
      fromSelect.disabled = true;
      fromSelect.innerHTML = '<option value="">N/A</option>';
      chartContainer.innerHTML = charts.tradeChart(seriesData.subSeries, { title: pick(seriesData, 'title'), unit: unit(seriesData.unit) });
      
      const exportsPts = seriesData.subSeries.exports;
      const importsPts = seriesData.subSeries.imports;
      tableContainer.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>${t('year')}</th>
              <th class="num">${t('exports')} (${unit(seriesData.unit)})</th>
              <th class="num">${t('imports')} (${unit(seriesData.unit)})</th>
              <th class="num">${t('balance')} (${unit(seriesData.unit)})</th>
              <th>${t('source')}</th>
            </tr>
          </thead>
          <tbody>
            ${exportsPts.map((exp, i) => {
              const imp = importsPts[i] ? importsPts[i].value : 0;
              const bal = +(exp.value - imp).toFixed(1);
              return `
                <tr>
                  <td><strong>${exp.year}</strong></td>
                  <td class="num">${exp.value.toFixed(1)}</td>
                  <td class="num">${imp.toFixed(1)}</td>
                  <td class="num">${bal >= 0 ? '+' : ''}${bal}</td>
                  <td>${seriesData.source}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;

      csvButton.onclick = () => {
        let csv = 'Year,Exports,Imports,TradeBalance,Source\n';
        exportsPts.forEach((exp, i) => {
          const imp = importsPts[i] ? importsPts[i].value : 0;
          const bal = +(exp.value - imp).toFixed(1);
          csv += `${exp.year},${exp.value},${imp},${bal},"${seriesData.source}"\n`;
        });
        downloadCsv('trade.csv', csv);
      };
      return;
    }

    fromSelect.disabled = false;
    const points = seriesData.points || [];
    const years = points.map(p => p.year);
    const minYear = Math.min(...years);
    const currentFrom = parseInt(fromSelect.value, 10) || minYear;

    // Populate from select
    fromSelect.innerHTML = '';
    years.forEach(y => {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      if (y === currentFrom || (!fromSelect.value && y === minYear)) {
        opt.selected = true;
      }
      fromSelect.appendChild(opt);
    });

    const activeFrom = parseInt(fromSelect.value, 10) || minYear;
    const filteredPoints = points.filter(p => p.year >= activeFrom);

    chartContainer.innerHTML = charts.lineChart(filteredPoints, { title: pick(seriesData, 'title'), unit: unit(seriesData.unit) });
    tableContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>${t('year')}</th>
            <th class="num">${t('th_value')} (${unit(seriesData.unit)})</th>
            <th>${t('source')}</th>
          </tr>
        </thead>
        <tbody>
          ${filteredPoints.map(p => `
            <tr>
              <td><strong>${p.year}</strong></td>
              <td class="num">${p.value}</td>
              <td>${seriesData.source}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    csvButton.onclick = () => {
      let csv = `Year,Value,Source\n`;
      filteredPoints.forEach(p => {
        csv += `${p.year},${p.value},"${seriesData.source}"\n`;
      });
      downloadCsv(`${seriesId}.csv`, csv);
    };
  }

  seriesSelect.onchange = () => {
    fromSelect.value = '';
    updateExplorer();
  };
  fromSelect.onchange = updateExplorer;

  updateExplorer();
}

function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

let provinceSortCol = null;
let provinceSortAsc = true;

function initProvinceSorting() {
  const table = document.getElementById('province-table');
  const filterInput = document.getElementById('province-filter');
  if (!table) return;

  const headers = table.querySelectorAll('th[data-sort]');
  headers.forEach(th => {
    th.onclick = () => {
      const col = th.getAttribute('data-sort');
      if (provinceSortCol === col) {
        provinceSortAsc = !provinceSortAsc;
      } else {
        provinceSortCol = col;
        provinceSortAsc = false;
      }

      headers.forEach(h => {
        h.textContent = h.textContent.replace(/[▲▼]/g, '').trim() + ' ↕';
      });
      th.textContent = th.textContent.replace('↕', provinceSortAsc ? '▲' : '▼');

      const items = [...PROVINCES.items];
      items.sort((a, b) => {
        let valA = a[col];
        let valB = b[col];
        if (valA < valB) return provinceSortAsc ? -1 : 1;
        if (valA > valB) return provinceSortAsc ? 1 : -1;
        return 0;
      });

      const tbody = table.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = items.map(p => `
          <tr>
            <td><strong>${pick(p, 'name')}</strong></td>
            <td class="num">${p.population.toLocaleString(numLocale())}</td>
            <td class="num">${p.share.toFixed(1)}%</td>
          </tr>
        `).join('');
      }

      if (filterInput && filterInput.value) {
        filterInput.dispatchEvent(new Event('input'));
      }
    };
  });

  if (filterInput) {
    filterInput.oninput = () => {
      const query = filterInput.value.toLowerCase().trim();
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const nameCell = row.querySelector('td strong') || row.cells[0];
        const name = nameCell ? nameCell.textContent.toLowerCase() : '';
        if (!query || name.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    };
  }
}

// --- Settings panel + chrome localization ---
function localizeChrome() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
}

function syncSettingsUI() {
  const s = getSettings();
  document.querySelectorAll('.seg-control').forEach(group => {
    const key = group.getAttribute('data-setting');
    group.querySelectorAll('button').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-value') === s[key] ? 'true' : 'false');
    });
  });
}

let settingsInitDone = false;

function initSettings() {
  if (settingsInitDone) return;
  const panel = document.getElementById('settings-panel');
  const openBtn = document.getElementById('settings-open');
  if (!panel || !openBtn) return;
  settingsInitDone = true;

  openBtn.addEventListener('click', () => {
    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    openBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (willOpen) syncSettingsUI();
  });

  panel.querySelectorAll('.seg-control').forEach(group => {
    const key = group.getAttribute('data-setting');
    group.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        if (getSettings()[key] === value) return;
        setSetting(key, value);
        syncSettingsUI();
        if (key === 'motion') {
          window.location.reload();
        } else if (key === 'lang') {
          localizeChrome();
          renderRoute();
        } else if (key === 'theme') {
          renderRoute();
        } else if (key === 'view') {
          updateScrollProgress();
        }
      });
    });
  });
  syncSettingsUI();
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', () => { localizeChrome(); initSettings(); initChartTooltip(); renderRoute(); });
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  localizeChrome();
  initSettings();
  initChartTooltip();
  renderRoute();
}
