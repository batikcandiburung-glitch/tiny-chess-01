import * as views from './views.js';
import { SERIES, PROVINCES } from './data.js';
import * as charts from './charts.js';
import { getSettings, setSetting, applySettings } from './settings.js';
import { t, pick, unit, numLocale } from './i18n.js';
import { animate, stagger, onScroll, createDrawable } from '../vendor/anime.esm.min.js';

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
      if (routePath === '/') {
        initOverviewChartSwitch();
      } else if (routePath === '/economy') {
        initEconomyExplorer();
      } else if (routePath === '/provinces') {
        initProvinceSorting();
        initProvinceCompare();
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
            autoplay: onScroll({ play: true })
          });
          if (anim) {
            activeAnimations.push(anim);
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
              autoplay: onScroll({ play: true })
            });
            if (anim) activeAnimations.push(anim);
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
          autoplay: onScroll({ play: true })
        });
        if (anim) activeAnimations.push(anim);
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
          autoplay: onScroll({ play: true })
        });
        if (anim) activeAnimations.push(anim);
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
        autoplay: onScroll({ play: true })
      });
      if (anim) activeAnimations.push(anim);
    }
    if (vertBars.length > 0) {
      const anim = animate(vertBars, {
        scaleY: [0, 1],
        transformOrigin: '50% 100%',
        duration: 700,
        delay: stagger(40),
        autoplay: onScroll({ play: true })
      });
      if (anim) activeAnimations.push(anim);
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
          autoplay: onScroll({ play: true }),
          onUpdate: () => {
            try {
              el.textContent = formatVal(o.v);
            } catch (err) {}
          }
        });
        if (anim) {
          activeAnimations.push(anim);
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
        autoplay: onScroll({ play: true })
      });
      if (anim) {
        activeAnimations.push(anim);
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

function initOverviewChartSwitch() {
  try {
    const chartEl = document.getElementById('overview-chart');
    if (!chartEl) return;
    const tile = chartEl.closest('.tile');
    if (!tile) return;
    const buttons = tile.querySelectorAll('[data-series]');
    if (!buttons || buttons.length === 0) return;

    const titleEl = document.getElementById('overview-chart-title');
    const rangeEl = document.getElementById('overview-chart-range');

    buttons.forEach(btn => {
      btn.onclick = () => {
        try {
          const seriesId = btn.getAttribute('data-series');
          if (!seriesId || !SERIES[seriesId]) return;
          const seriesData = SERIES[seriesId];

          buttons.forEach(b => {
            b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
          });

          const decimals = seriesId === 'population' ? 1 : 2;

          chartEl.innerHTML = charts.lineChart(seriesData.points, {
            title: pick(seriesData, 'title'),
            unit: unit(seriesData.unit),
            decimals: decimals
          });

          if (titleEl) {
            titleEl.textContent = pick(seriesData, 'title');
          }

          if (rangeEl && seriesData.points && seriesData.points.length > 0) {
            const firstYear = seriesData.points[0].year;
            const lastYear = seriesData.points[seriesData.points.length - 1].year;
            rangeEl.textContent = `${firstYear}–${lastYear}`;
          }
        } catch (e) {
          // silent null-guarded catch
        }
      };
    });
  } catch (e) {
    // silent null-guarded catch
  }
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

function initProvinceCompare() {
  try {
    const selectA = document.getElementById('compare-a');
    const selectB = document.getElementById('compare-b');
    const resultEl = document.getElementById('compare-result');
    if (!selectA || !selectB || !resultEl) return;

    const update = () => {
      try {
        const valA = selectA.value;
        const valB = selectB.value;
        if (valA === '' || valB === '') {
          resultEl.innerHTML = '';
          return;
        }
        const idxA = parseInt(valA, 10);
        const idxB = parseInt(valB, 10);
        const pA = PROVINCES.items[idxA];
        const pB = PROVINCES.items[idxB];
        if (!pA || !pB) {
          resultEl.innerHTML = '';
          return;
        }

        const maxPop = Math.max(pA.population, pB.population);
        const widthA = maxPop > 0 ? (pA.population / maxPop) * 100 : 0;
        const widthB = maxPop > 0 ? (pB.population / maxPop) * 100 : 0;

        let largerName, smallerName, ratio;
        if (pA.population > pB.population) {
          largerName = pick(pA, 'name');
          smallerName = pick(pB, 'name');
          ratio = pB.population > 0 ? (pA.population / pB.population).toFixed(2) : '1.00';
        } else if (pB.population > pA.population) {
          largerName = pick(pB, 'name');
          smallerName = pick(pA, 'name');
          ratio = pA.population > 0 ? (pB.population / pA.population).toFixed(2) : '1.00';
        } else {
          largerName = pick(pA, 'name');
          smallerName = pick(pB, 'name');
          ratio = '1.00';
        }

        const timesStr = t('compare_times').replace('{n}', ratio);
        const summarySentence = `${largerName} ${timesStr} ${smallerName}.`;
        const diff = Math.abs(pA.population - pB.population);
        const diffText = diff.toLocaleString(numLocale());

        resultEl.innerHTML = `
          <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div style="background: var(--surface-2); padding: 1rem; border-radius: 8px;">
                <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem;">${pick(pA, 'name')}</div>
                <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 0.5rem;">${t('rank_word')} ${idxA + 1}</div>
                <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem;">${pA.population.toLocaleString(numLocale())}</div>
                <div style="font-size: 0.85rem; color: var(--muted);">${pA.share.toFixed(1)}%</div>
                <div style="margin-top: 0.75rem; background: var(--surface); height: 8px; border-radius: 4px; overflow: hidden;">
                  <div style="width: ${widthA}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
                </div>
              </div>
              <div style="background: var(--surface-2); padding: 1rem; border-radius: 8px;">
                <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem;">${pick(pB, 'name')}</div>
                <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 0.5rem;">${t('rank_word')} ${idxB + 1}</div>
                <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem;">${pB.population.toLocaleString(numLocale())}</div>
                <div style="font-size: 0.85rem; color: var(--muted);">${pB.share.toFixed(1)}%</div>
                <div style="margin-top: 0.75rem; background: var(--surface); height: 8px; border-radius: 4px; overflow: hidden;">
                  <div style="width: ${widthB}%; height: 100%; background: var(--ink-55); border-radius: 4px;"></div>
                </div>
              </div>
            </div>
            <div style="background: var(--surface-2); padding: 1rem; border-radius: 8px; font-size: 0.95rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <div>${summarySentence}</div>
              <div><strong>${t('compare_diff')}:</strong> ${diffText}</div>
            </div>
          </div>
        `.trim();
      } catch (err) {
        // never break page
      }
    };

    selectA.onchange = update;
    selectB.onchange = update;
    update();
  } catch (e) {
    // guard against null / errors
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

  const closePanel = () => {
    try {
      panel.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
    } catch (e) {}
  };

  const positionPanel = () => {
    try {
      if (panel.hidden) return;
      const rect = openBtn.getBoundingClientRect();
      const panelWidth = panel.offsetWidth || 320;
      const panelHeight = panel.offsetHeight || 200;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (vw - rect.right >= 344) {
        let left = rect.right + 12;
        let top = rect.top;
        if (top + panelHeight > vh - 8) {
          top = Math.max(8, vh - panelHeight - 8);
        }
        if (top < 8) top = 8;
        panel.style.left = left + 'px';
        panel.style.top = top + 'px';
      } else {
        let left = rect.left;
        if (left + panelWidth > vw - 8) {
          left = Math.max(8, vw - panelWidth - 8);
        }
        if (left < 8) left = 8;

        let top = rect.bottom + 8;
        if (top + panelHeight > vh - 8) {
          const aboveTop = rect.top - panelHeight - 8;
          if (aboveTop >= 8) {
            top = aboveTop;
          } else {
            top = Math.max(8, Math.min(top, vh - panelHeight - 8));
          }
        }
        panel.style.left = left + 'px';
        panel.style.top = top + 'px';
      }
    } catch (e) {}
  };

  openBtn.addEventListener('click', () => {
    try {
      const willOpen = panel.hidden;
      if (willOpen) {
        panel.hidden = false;
        openBtn.setAttribute('aria-expanded', 'true');
        syncSettingsUI();
        positionPanel();
      } else {
        closePanel();
      }
    } catch (e) {}
  });

  document.addEventListener('pointerdown', (e) => {
    try {
      if (!panel.hidden) {
        if (!panel.contains(e.target) && !openBtn.contains(e.target)) {
          closePanel();
        }
      }
    } catch (e) {}
  });

  document.addEventListener('keydown', (e) => {
    try {
      if (e.key === 'Escape' && !panel.hidden) {
        closePanel();
      }
    } catch (e) {}
  });

  window.addEventListener('resize', () => {
    try {
      if (!panel.hidden) {
        positionPanel();
      }
    } catch (e) {}
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
