import * as views from './views.js';
import { SERIES, PROVINCES } from './data.js';
import * as charts from './charts.js';
import { t, pick, unit, numLocale } from './i18n.js';

// Module scope setup
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// Scroll progress fill in the sidebar (height on desktop, width on mobile)
function updateScrollProgress() {
  try {
    const fill = document.querySelector('.scroll-progress-fill');
    if (!fill) return;
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    const frac = max > 0 ? Math.min(1, (window.scrollY || el.scrollTop) / max) : 0;
    const pct = (frac * 100).toFixed(2) + '%';
    const horizontal = window.matchMedia('(max-width: 900px)').matches;
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

function scrollPlay(el, fn) {
  if (reducedMotion) return { revert: () => {} };
  if (!el || !('IntersectionObserver' in window)) {
    return fn() || { revert: () => {} };
  }
  let activeSubAnim = null;
  let disconnected = false;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !disconnected) {
        disconnected = true;
        obs.unobserve(entry.target);
        activeSubAnim = fn();
      }
    });
  }, { threshold: 0.15 });
  observer.observe(el);
  return {
    revert: () => {
      if (!disconnected) {
        disconnected = true;
        observer.disconnect();
      }
      if (activeSubAnim && typeof activeSubAnim.revert === 'function') {
        activeSubAnim.revert();
      }
    }
  };
}

function tweenValue(durationMs, easeName, onUpdate) {
  let rafId = null;
  let startTime = null;
  const easeFn = (t) => {
    const clampedT = Math.min(1, Math.max(0, t));
    if (easeName === 'outExpo') {
      if (clampedT === 1) return 1;
      return 1 - Math.pow(2, -10 * clampedT);
    } else if (easeName === 'outQuad') {
      return 1 - (1 - clampedT) * (1 - clampedT);
    }
    return clampedT;
  };

  const handle = {
    revert: () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rawProgress = durationMs > 0 ? elapsed / durationMs : 1;
    const eased = easeFn(rawProgress);

    try {
      onUpdate(eased);
    } catch (e) {}

    if (rawProgress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      try {
        onUpdate(1);
      } catch (e) {}
      rafId = null;
    }
  };

  rafId = requestAnimationFrame(step);
  return handle;
}

function waapi(el, keyframes, options) {
  if (!el || typeof el.animate !== 'function') return { revert: () => {} };
  try {
    const animation = el.animate(keyframes, options);
    return {
      revert: () => {
        try { animation.cancel(); } catch (e) {}
      }
    };
  } catch (e) {
    return { revert: () => {} };
  }
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

    window.scrollTo(0, 0);

    try {
      // Post-render page-specific wiring
      if (routePath === '/') {
        initOverviewChartSwitch();
        initYearFocus();
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

          const handle = scrollPlay(el, () => waapi(el, [
            { opacity: 0, transform: 'translateY(16px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], {
            duration: 550,
            delay: delay,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'backwards'
          }));
          if (handle) {
            activeAnimations.push(handle);
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
        if (typeof el.getTotalLength !== 'function') return;
        const length = el.getTotalLength();
        if (!length || isNaN(length)) return;
        el.style.strokeDasharray = length;
        el.style.strokeDashoffset = length;

        const handle = scrollPlay(el, () => tweenValue(900, 'outExpo', (f) => {
          try {
            el.style.strokeDashoffset = length * (1 - f);
          } catch (err) {}
        }));
        if (handle) activeAnimations.push(handle);
      } catch (err) {}
    });
  } catch (e) {}

  // 2. Area fills
  try {
    appEl.querySelectorAll('.fade-area').forEach(el => {
      try {
        const targetOpacity = parseFloat(window.getComputedStyle(el).opacity) || 1;
        const handle = scrollPlay(el, () => waapi(el, [
          { opacity: 0 },
          { opacity: targetOpacity }
        ], {
          duration: 600,
          fill: 'backwards'
        }));
        if (handle) activeAnimations.push(handle);
      } catch (err) {}
    });
  } catch (e) {}

  // 3. End dots
  try {
    appEl.querySelectorAll('.pop-dot').forEach(el => {
      try {
        el.style.transformOrigin = '50% 50%';
        const handle = scrollPlay(el, () => waapi(el, [
          { opacity: 0, transform: 'scale(0)' },
          { opacity: 1, transform: 'scale(1)' }
        ], {
          duration: 500,
          delay: 500,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          fill: 'backwards'
        }));
        if (handle) activeAnimations.push(handle);
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
      horizBars.forEach((el, i) => {
        try {
          el.style.transformOrigin = '0% 50%';
          const handle = scrollPlay(el, () => waapi(el, [
            { transform: 'scaleX(0)' },
            { transform: 'scaleX(1)' }
          ], {
            duration: 700,
            delay: i * 40,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'backwards'
          }));
          if (handle) activeAnimations.push(handle);
        } catch (err) {}
      });
    }
    if (vertBars.length > 0) {
      vertBars.forEach((el, i) => {
        try {
          el.style.transformOrigin = '50% 100%';
          const handle = scrollPlay(el, () => waapi(el, [
            { transform: 'scaleY(0)' },
            { transform: 'scaleY(1)' }
          ], {
            duration: 700,
            delay: i * 40,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'backwards'
          }));
          if (handle) activeAnimations.push(handle);
        } catch (err) {}
      });
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

        const handle = scrollPlay(el, () => tweenValue(900, 'outExpo', (f) => {
          try {
            el.textContent = formatVal(target * f);
          } catch (err) {}
        }));
        if (handle) {
          activeAnimations.push(handle);
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
    const dotEls = Array.from(appEl.querySelectorAll('.dot'));
    if (dotEls.length > 0) {
      dotEls.forEach((el, i) => {
        try {
          el.style.transformOrigin = '50% 50%';
          const handle = scrollPlay(el, () => waapi(el, [
            { opacity: 0, transform: 'scale(0)' },
            { opacity: 1, transform: 'scale(1)' }
          ], {
            duration: 500,
            delay: i * 12,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            fill: 'backwards'
          }));
          if (handle) {
            activeAnimations.push(handle);
          }
        } catch (err) {}
      });
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
            decimals: decimals,
            height: 235
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

function initYearFocus() {
  try {
    const selectEl = document.getElementById('year-focus');
    const readoutEl = document.getElementById('year-focus-readout');
    if (!selectEl || !readoutEl) return;

    const seriesKeys = ['population', 'gdp-growth', 'inflation', 'poverty', 'unemployment', 'visitors'];
    const decimalsMap = {
      'population': 1,
      'gdp-growth': 2,
      'inflation': 2,
      'poverty': 2,
      'unemployment': 2,
      'visitors': 2
    };

    const render = (year) => {
      const yr = parseInt(year, 10);
      readoutEl.innerHTML = seriesKeys.map(sKey => {
        const sData = SERIES[sKey];
        if (!sData) return '';
        const title = pick(sData, 'title');
        const decimals = decimalsMap[sKey] ?? 2;
        const pt = (sData.points || []).find(p => p.year === yr);
        const valText = pt ? `${pt.value.toFixed(decimals)} ${unit(sData.unit)}` : '—';
        return `<div><div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted);">${title}</div><div style="font-weight: 700; font-size: 1.05rem;">${valText}</div></div>`;
      }).join('');
    };

    render(selectEl.value);
    selectEl.onchange = () => {
      render(selectEl.value);
    };
  } catch (e) {
    // silent
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

// --- Chrome localization & population clock ---
function localizeChrome() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
}

let popClockStarted = false;
function initPopClock() {
  if (popClockStarted) return;
  popClockStarted = true;
  setInterval(() => {
    try {
      const el = document.getElementById('pop-clock');
      if (!el) return;
      const basePop = 284400000;
      const epoch = Date.UTC(2025, 6, 1);
      const now = Date.now();
      const elapsedMs = now - epoch;
      const yearsElapsed = elapsedMs / 31557600000;
      const pop = basePop * Math.pow(1.01, yearsElapsed);
      el.textContent = Math.round(pop).toLocaleString('en-US');
    } catch (e) {}
  }, 1000);
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', () => { localizeChrome(); initPopClock(); initChartTooltip(); renderRoute(); });
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  localizeChrome();
  initPopClock();
  initChartTooltip();
  renderRoute();
}
