import { SITE, HEADLINES, FACTS, SERIES, PROVINCES, ISLANDS, AGE, RELIGION, SOURCES } from './data.js';
import { t, pick, unit, numLocale } from './i18n.js';
import * as charts from './charts.js';

function getHeadlineAttr(h) {
  const cleanVal = h.value.replace(/,/g, '');
  const num = parseFloat(cleanVal);
  const parts = cleanVal.split('.');
  const decimals = parts.length > 1 ? parts[1].length : 0;
  const hasComma = h.value.includes(',');
  let attrs = `data-count="${num}" data-decimals="${decimals}"`;
  if (hasComma) {
    attrs += ` data-format="en"`;
  }
  return attrs;
}

function miniSparkline(points) {
  if (!points || points.length === 0) return '';
  const vals = points.map(p => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const width = 120;
  const height = 28;
  const padding = 3;
  const innerHeight = height - padding * 2;
  const ptsStr = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - padding - ((p.value - min) / range) * innerHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" style="display: block; margin-top: 0.75rem;"><polyline fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${ptsStr}"/></svg>`;
}

function getDeltaInfo(id, h) {
  let deltaVal, prevYear, isPct = false, isPerCapita = false;
  let isGood = true;
  let seriesObj = null;

  if (id === 'population') {
    seriesObj = SERIES.population;
    const pts = seriesObj.points;
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    deltaVal = ((last.value - prev.value) / prev.value) * 100;
    prevYear = prev.year;
    isPct = true;
    isGood = deltaVal >= 0;
  } else if (id === 'gdp') {
    seriesObj = SERIES['gdp-per-capita'];
    const pts = seriesObj.points;
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    deltaVal = ((last.value - prev.value) / prev.value) * 100;
    prevYear = prev.year;
    isPct = true;
    isPerCapita = true;
    isGood = deltaVal >= 0;
  } else if (id === 'gdp-growth') {
    seriesObj = SERIES['gdp-growth'];
    const pts = seriesObj.points;
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    deltaVal = last.value - prev.value;
    prevYear = prev.year;
    isGood = deltaVal >= 0;
  } else if (id === 'poverty') {
    seriesObj = SERIES.poverty;
    const pts = seriesObj.points;
    const lastPt = pts[pts.length - 1];
    const headlineVal = parseFloat(h.value);
    deltaVal = headlineVal - lastPt.value;
    prevYear = lastPt.year;
    isGood = deltaVal <= 0;
  } else if (id === 'unemployment') {
    seriesObj = SERIES.unemployment;
    const pts = seriesObj.points;
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    deltaVal = last.value - prev.value;
    prevYear = prev.year;
    isGood = deltaVal <= 0;
  } else if (id === 'inflation') {
    seriesObj = SERIES.inflation;
    const pts = seriesObj.points;
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    deltaVal = last.value - prev.value;
    prevYear = prev.year;
    isGood = deltaVal <= 0;
  }

  const sign = deltaVal > 0 ? '+' : '';
  const formattedVal = isPct ? `${sign}${deltaVal.toFixed(1)}%` : `${sign}${deltaVal.toFixed(2)} pts`;
  const arrow = deltaVal >= 0 ? '↑' : '↓';
  const text = isPerCapita
    ? `${arrow} Per capita ${formattedVal} vs ${prevYear}`
    : `${arrow} ${formattedVal} vs ${prevYear}`;

  const colorStyle = isGood ? '' : 'color: var(--primary);';
  const sparkline = seriesObj ? miniSparkline(seriesObj.points) : '';

  return { text, colorStyle, sparkline };
}

export function viewOverview() {
  return `
    <div class="hero-band">
      <div class="hero-text">
        <p class="hero-eyebrow">${t('hero_eyebrow')}</p>
        <h2>${t('tagline')}</h2>
        <p>${t('hero_sub')}</p>
      </div>
      <div class="hero-map" aria-hidden="true">
        ${["Sumatra", "Kalimantan", "Sulawesi", "Java", "Bali and Nusa Tenggara", "Maluku and Papua"].map(name => {
          const isl = ISLANDS.items.find(item => item.name === name);
          if (!isl) return '';
          const nDots = Math.round(isl.population / 3);
          return `
            <div class="dot-cluster mini${isl.name === "Maluku and Papua" ? ' dot-ink' : ''}">
              <div class="dots">
                ${Array.from({ length: nDots }, () => '<span class="dot"></span>').join('')}
              </div>
              <div class="cluster-label">${pick(isl, 'name')}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="tile" style="display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;">
      <div>
        <div class="stat-label">${t('pop_clock')}</div>
        <div style="font-size: 0.85rem; color: var(--muted);">${t('pop_clock_note')}</div>
      </div>
      <div style="text-align: right;">
        <div id="pop-clock" class="stat-figure" style="margin-bottom: 0;">284,400,000</div>
        <div style="font-size: 0.85rem; color: var(--accent, #D9232E);">${t('pop_clock_live')}</div>
      </div>
    </div>

    <section class="view-section">
      <div class="kpi-grid">
        ${HEADLINES.map(h => {
          const delta = getDeltaInfo(h.id, h);
          return `
            <div class="tile tile-stat" data-id="${h.id}">
              <div>
                <div class="stat-label">${pick(h, 'label')}</div>
                <div class="stat-figure" ${getHeadlineAttr(h)}>${pick(h, 'value')} <span class="stat-unit">${unit(h.unit)}</span></div>
                <div class="stat-note">${pick(h, 'note')}</div>
                <div style="font-size: 0.85rem; margin-top: 0.35rem; ${delta.colorStyle}">${delta.text}</div>
                ${delta.sparkline}
              </div>
              <div class="stat-source">${t('source')}: ${h.source}, ${h.year}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="bento-grid">
        <div class="tile tile-chart">
          <div class="chart-meta">
            <h3 id="overview-chart-title">${pick(SERIES.population, 'title')}</h3>
            <span>${t('source')}: ${SERIES.population.source}, <span id="overview-chart-range">${SERIES.population.points[0].year}–${SERIES.population.points[SERIES.population.points.length - 1].year}</span></span>
          </div>
          <div class="seg-control" style="margin-bottom: 0.5rem;">
            <button data-series="population" aria-pressed="true">${pick(SERIES.population, 'title')}</button>
            <button data-series="gdp-growth" aria-pressed="false">${pick(SERIES['gdp-growth'], 'title')}</button>
            <button data-series="inflation" aria-pressed="false">${pick(SERIES.inflation, 'title')}</button>
          </div>
          <div class="chart-container" id="overview-chart">
            ${charts.lineChart(SERIES.population.points, { title: pick(SERIES.population, 'title'), unit: unit(SERIES.population.unit), decimals: 1, height: 235 })}
          </div>
          <p class="footnote">${pick(SERIES.population, 'note') || ''}</p>
          <div style="border-top: 1px solid var(--hairline); margin-top: 1rem; padding-top: 1rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
              <div class="stat-label" style="margin-bottom: 0;">${t('year_focus')}</div>
              <select id="year-focus" style="font: inherit; font-size: 0.9rem; padding: 0.3rem 0.6rem; border: 1px solid var(--hairline); border-radius: 8px; background: var(--surface); color: var(--ink);">
                <option value="2025">2025</option>
                <option value="2024" selected>2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
              </select>
            </div>
            <div id="year-focus-readout" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem 1rem; margin-top: 0.85rem;"></div>
          </div>
        </div>

        <div class="tile tile-chart">
          <div class="chart-meta">
            <h3>${pick(SERIES.visitors, 'title')}</h3>
            <span>${t('source')}: ${SERIES.visitors.source}, ${SERIES.visitors.points[0].year}–${SERIES.visitors.points[SERIES.visitors.points.length - 1].year}</span>
          </div>
          <div class="chart-container">
            ${charts.barChart(SERIES.visitors.points.map(p => ({ label: String(p.year), value: p.value })), { title: pick(SERIES.visitors, 'title'), unit: unit(SERIES.visitors.unit), decimals: 2, height: 235 })}
          </div>
          <div style="border-top: 1px solid var(--hairline); margin-top: 1rem; padding-top: 1rem;">
            ${(() => { const pts = SERIES.visitors.points; const peak = pts.reduce((a, b) => b.value > a.value ? b : a); const low = pts.reduce((a, b) => b.value < a.value ? b : a); const last = pts[pts.length - 1]; const rec = Math.round(last.value / peak.value * 100); const item = (l, v) => '<div><div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted);">' + l + '</div><div style="font-weight: 700; font-size: 1.05rem;">' + v + '</div></div>'; return '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem 1rem;">' + item('Peak ' + peak.year, peak.value.toFixed(2) + ' ' + unit(SERIES.visitors.unit)) + item('Low ' + low.year, low.value.toFixed(2) + ' ' + unit(SERIES.visitors.unit)) + item('Latest ' + last.year, last.value.toFixed(2) + ' ' + unit(SERIES.visitors.unit)) + '</div><p style="font-size: 0.85rem; color: var(--muted); margin: 0.75rem 0 0;">' + last.year + ' arrivals reached ' + rec + '% of the ' + peak.year + ' peak.</p>'; })()}
          </div>
        </div>
      </div>

      <div class="bento-grid">
        <div class="tile tile-chart">
          <div class="chart-meta">
            <h3>${t('religious_comp')}</h3>
            <span>${t('source')}: ${RELIGION.source}</span>
          </div>
          <div class="chart-container">
            ${charts.donutChart(RELIGION.items.map(r => ({ label: pick(r, 'name'), value: r.percent })), { title: t('religion_shares'), unit: "%", decimals: 2, height: 235 })}
          </div>
        </div>

        <div class="tile tile-chart">
          <div class="chart-meta">
            <h3>${t('releases_h')}</h3>
            <span>${t('releases_sub')}</span>
          </div>
          <div>
            ${HEADLINES.map((h, idx, arr) => `
              <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding: 0.55rem 0; ${idx < arr.length - 1 ? 'border-bottom: 1px solid var(--hairline);' : ''}">
                <span style="font-weight: 600;">${pick(h, 'label')}</span>
                <span style="font-size: 0.825rem; color: var(--muted);">${h.year}, ${h.source}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="tile tile-wide">
        <div class="chart-meta">
          <h3>${t('pop_by_island')}</h3>
          <span>${t('source')}: ${ISLANDS.source}</span>
        </div>
        <p style="color: var(--muted); font-size: 0.95rem; margin-bottom: 1.25rem;">${t('one_dot')}</p>
        <div class="dotmap">
          ${["Sumatra", "Java", "Kalimantan", "Sulawesi", "Bali and Nusa Tenggara", "Maluku and Papua"].map(name => {
            const i = ISLANDS.items.find(item => item.name === name);
            if (!i) return '';
            const nDots = Math.round(i.population / 3);
            const isInk = i.name === "Maluku and Papua";
            return `
              <div class="dot-cluster${isInk ? ' dot-ink' : ''}">
                <div class="dots">
                  ${Array.from({ length: nDots }, () => '<span class="dot"></span>').join('')}
                </div>
                <div class="cluster-label">
                  ${pick(i, 'name')}
                  <span class="figure">${i.population.toFixed(1)}${t('million_suffix')}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="card-grid">
        <div class="tile tile-wide table-card">
          <h3>${t('country_facts')}</h3>
          <div class="table-responsive">
            <dl class="facts-list">
              ${FACTS.map(f => `
                <div>
                  <dt>${pick(f, 'label')}</dt>
                  <dd>${pick(f, 'value')} <span class="fact-src">(${pick(f, 'source')}, ${f.year})</span></dd>
                </div>
              `).join('')}
            </dl>
          </div>
        </div>
      </div>

      <div class="card-grid">
        <a href="#/economy" class="stat-card" style="text-decoration: none;">
          <div>
            <div class="stat-label">${t('explore_economy')}</div>
            <div class="stat-figure" style="font-size: 1.5rem;">${t('eco_card_title')}</div>
            <div class="stat-note">${t('eco_card_note')}</div>
          </div>
          <div class="stat-source">${t('view_economy')}</div>
        </a>
        <a href="#/people" class="stat-card" style="text-decoration: none;">
          <div>
            <div class="stat-label">${t('explore_people')}</div>
            <div class="stat-figure" style="font-size: 1.5rem;">${t('people_card_title')}</div>
            <div class="stat-note">${t('people_card_note')}</div>
          </div>
          <div class="stat-source">${t('view_people')}</div>
        </a>
        <a href="#/provinces" class="stat-card" style="text-decoration: none;">
          <div>
            <div class="stat-label">${t('explore_provinces')}</div>
            <div class="stat-figure" style="font-size: 1.5rem;">${t('prov_card_title')}</div>
            <div class="stat-note">${t('prov_card_note')}</div>
          </div>
          <div class="stat-source">${t('view_provinces')}</div>
        </a>
      </div>
    </section>
  `.trim();
}

export function viewEconomy() {
  const gdpHeadlines = HEADLINES.filter(h => h.id === 'gdp' || h.id === 'gdp-growth' || h.id === 'inflation');
  const latestTradeYear = SERIES.trade.subSeries.exports[SERIES.trade.subSeries.exports.length - 1].year;
  const latestExp = SERIES.trade.subSeries.exports[SERIES.trade.subSeries.exports.length - 1].value;
  const latestImp = SERIES.trade.subSeries.imports[SERIES.trade.subSeries.imports.length - 1].value;
  const tradeBalance = +(latestExp - latestImp).toFixed(1);

  return `
    <div class="section-header">
      <h2>${t('economy_h')}</h2>
      <p>${t('economy_sub')}</p>
    </div>

    <section class="view-section">
      <div class="card-grid">
        ${gdpHeadlines.map(h => `
          <div class="stat-card" data-id="${h.id}">
            <div>
              <div class="stat-label">${pick(h, 'label')}</div>
              <div class="stat-figure" ${getHeadlineAttr(h)}>${pick(h, 'value')} <span class="stat-unit">${unit(h.unit)}</span></div>
              <div class="stat-note">${pick(h, 'note')}</div>
            </div>
            <div class="stat-source">${t('source')}: ${h.source}, ${h.year}</div>
          </div>
        `).join('')}
      </div>

      <div class="chart-card">
        <h3>${t('explorer_h')}</h3>
        <p class="chart-meta">${t('explorer_sub')}</p>
        <div class="controls-bar">
          <div>
            <label for="series-select" style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">${t('indicator')}</label>
            <select id="series-select"></select>
          </div>
          <div>
            <label for="series-from" style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">${t('from_year')}</label>
            <select id="series-from"></select>
          </div>
          <div style="margin-top: 1.25rem;">
            <button id="series-csv">${t('download_csv')}</button>
          </div>
        </div>
        <div class="chart-container" id="series-chart"></div>
        <div class="table-responsive" id="series-table"></div>
      </div>

      <div class="chart-card">
        <h3>${pick(SERIES.trade, 'title')}</h3>
        <div class="chart-meta">
          <span>${t('source')}: ${SERIES.trade.source}, 2019–2024</span>
          <span>${t('unit_word')}: ${unit(SERIES.trade.unit)}</span>
        </div>
        <div class="chart-container">
          ${charts.tradeChart(SERIES.trade.subSeries, { title: pick(SERIES.trade, 'title'), unit: unit(SERIES.trade.unit) })}
        </div>
        <div class="table-responsive">
          <h4 style="font-size: 1rem; margin-top: 1rem; margin-bottom: 0.5rem;">${t('trade_summary').replace('{y}', latestTradeYear)}</h4>
          <table>
            <thead>
              <tr>
                <th>${t('th_indicator')}</th>
                <th class="num">${t('th_value')} (${unit(SERIES.trade.unit)})</th>
                <th>${t('th_source_year')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${t('exports')}</td>
                <td class="num">${latestExp.toFixed(1)}</td>
                <td>BPS, ${latestTradeYear}</td>
              </tr>
              <tr>
                <td>${t('imports')}</td>
                <td class="num">${latestImp.toFixed(1)}</td>
                <td>BPS, ${latestTradeYear}</td>
              </tr>
              <tr>
                <td><strong>${t('trade_balance')}</strong></td>
                <td class="num"><strong>${tradeBalance >= 0 ? '+' : ''}${tradeBalance}</strong></td>
                <td>${t('computed_from')}, ${latestTradeYear}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `.trim();
}

export function viewPeople() {
  const peopleHeadlines = HEADLINES.filter(h => h.id === 'population' || h.id === 'poverty' || h.id === 'unemployment');

  return `
    <div class="section-header">
      <h2>${t('people_h')}</h2>
      <p>${t('people_sub')}</p>
    </div>

    <section class="view-section">
      <div class="card-grid">
        ${peopleHeadlines.map(h => `
          <div class="stat-card" data-id="${h.id}">
            <div>
              <div class="stat-label">${pick(h, 'label')}</div>
              <div class="stat-figure" ${getHeadlineAttr(h)}>${pick(h, 'value')} <span class="stat-unit">${unit(h.unit)}</span></div>
              <div class="stat-note">${pick(h, 'note')}</div>
            </div>
            <div class="stat-source">${t('source')}: ${h.source}, ${h.year}</div>
          </div>
        `).join('')}
      </div>

      <div class="card-grid split-grid">
        <div class="chart-card" style="margin-bottom: 0;">
          <div class="chart-meta">
            <h3>${pick(SERIES.poverty, 'title')}</h3>
            <span>${t('source')}: ${SERIES.poverty.source}</span>
          </div>
          <div class="chart-container">
            ${charts.lineChart(SERIES.poverty.points, { title: pick(SERIES.poverty, 'title'), unit: unit(SERIES.poverty.unit), decimals: 2, color: "#D9232E" })}
          </div>
        </div>

        <div class="chart-card" style="margin-bottom: 0;">
          <div class="chart-meta">
            <h3>${pick(SERIES.unemployment, 'title')}</h3>
            <span>${t('source')}: ${SERIES.unemployment.source}</span>
          </div>
          <div class="chart-container">
            ${charts.lineChart(SERIES.unemployment.points, { title: pick(SERIES.unemployment, 'title'), unit: unit(SERIES.unemployment.unit), decimals: 2, color: charts.themeColor('--ink', '#0A0F1E') })}
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-meta">
          <h3>${pick(SERIES.visitors, 'title')}</h3>
          <span>${t('source')}: ${SERIES.visitors.source}, 2019–2024</span>
        </div>
        <div class="chart-container">
          ${charts.barChart(SERIES.visitors.points.map(p => ({ label: String(p.year), value: p.value })), { title: pick(SERIES.visitors, 'title'), unit: unit(SERIES.visitors.unit), decimals: 2 })}
        </div>
      </div>

      <div class="card-grid split-grid">
        <div class="chart-card" style="margin-bottom: 0;">
          <div class="chart-meta">
            <h3>${t('hdi_h')}</h3>
            <span>${t('source')}: ${SERIES.hdi.source}</span>
          </div>
          <div class="chart-container">
            ${charts.lineChart(SERIES.hdi.points, { title: t('hdi_h'), unit: unit(SERIES.hdi.unit), decimals: 2, color: "#D9232E" })}
          </div>
        </div>
        <div class="stat-card">
          <div>
            <div class="stat-label">${t('hdi_h')}</div>
            <div class="stat-figure">${SERIES.hdi.points[SERIES.hdi.points.length - 1].value.toFixed(2)} <span class="stat-unit">/ 100</span></div>
            <div class="stat-note">${t('hdi_note')}</div>
          </div>
          <div class="stat-source">${t('hdi_category')} · ${t('source')}: BPS, 2025</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-meta">
          <h3>${t('age_shares_h')}</h3>
          <span>${t('source')}: ${AGE.source}</span>
        </div>
        <div class="chart-container">
          ${charts.barChart(AGE.items.map(a => ({ label: pick(a, 'name'), value: a.percent })), { title: t('age_chart_title'), unit: "%", decimals: 1 })}
        </div>
        <p class="footnote" style="margin-top: 1rem;">${pick(AGE, 'note')}</p>
        <p class="footnote">${t('source')}: ${AGE.source}</p>
      </div>

      <div class="table-card">
        <h3>${t('poverty_line_h')}</h3>
        <p style="margin-top: 0.75rem; color: var(--ink);">
          ${t('poverty_line_p')}
        </p>
        <p class="footnote" style="margin-top: 0.5rem;">${t('poverty_line_src')}</p>
      </div>
    </section>
  `.trim();
}

export function viewRegions() {
  return `
    <div class="section-header">
      <h2>${t('regions_h')}</h2>
      <p>${t('regions_sub')}</p>
    </div>

    <section class="view-section">
      <div class="chart-card">
        <div class="chart-meta">
          <h3>${t('pop_by_island')}</h3>
          <span>${t('source')}: ${ISLANDS.source}</span>
        </div>
        <div class="chart-container">
          ${charts.hbarChart(ISLANDS.items.map(i => ({ label: pick(i, 'name'), value: i.population })), { title: t('pop_by_island'), unit: unit('million'), decimals: 1 })}
        </div>
      </div>

      <div class="table-card">
        <h3>${t('island_breakdown_h')}</h3>
        <p class="chart-meta">${t('source')}: ${ISLANDS.source}.</p>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>${t('th_island')}</th>
                <th class="num">${t('th_pop_million')}</th>
                <th class="num">${t('th_share')}</th>
              </tr>
            </thead>
            <tbody>
              ${ISLANDS.items.map(i => `
                <tr>
                  <td><strong>${pick(i, 'name')}</strong></td>
                  <td class="num">${i.population.toFixed(1)}</td>
                  <td class="num">${i.share.toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="footnote" style="margin-top: 1rem;">${pick(ISLANDS, 'note')}</p>
        <p class="footnote">${t('source')}: ${ISLANDS.source}</p>
      </div>

      <div class="table-card">
        <p style="color: var(--ink);">${t('java_note')}</p>
      </div>
    </section>
  `.trim();
}

export function viewProvinces() {
  return `
    <div class="section-header">
      <h2>${t('provinces_h')}</h2>
      <p>${t('provinces_sub')}</p>
    </div>

    <section class="view-section">
      <div class="chart-card">
        <div class="chart-meta">
          <h3>${t('prov_ranking_h')}</h3>
          <span>${t('source')}: ${PROVINCES.source}</span>
        </div>
        <div class="chart-container">
          ${charts.hbarChart(PROVINCES.items.map((p, i) => ({ rank: i + 1, label: pick(p, 'name'), value: +(p.population / 1e6).toFixed(2) })), { title: t('prov_chart_title'), unit: unit('million'), decimals: 2, height: 1000 })}
        </div>
      </div>

      <div class="table-card">
        <h3>${t('prov_breakdown_h')}</h3>
        <p class="chart-meta">${t('prov_sort_hint')} ${t('source')}: ${PROVINCES.source}.</p>
        <div class="table-responsive">
          <input type="text" id="province-filter" class="filter-input" placeholder="${t('filter_ph')}">
          <table id="province-table">
            <thead>
              <tr>
                <th>${t('th_province')}</th>
                <th class="num" data-sort="population" style="cursor: pointer;" title="${t('sort_pop')}">${t('th_population')} &#8597;</th>
                <th class="num" data-sort="share" style="cursor: pointer;" title="${t('sort_share')}">${t('th_share')} &#8597;</th>
                <th class="num" data-sort="hdi" style="cursor: pointer;">${t('th_hdi')} &#8597;</th>
                <th class="num" data-sort="poverty" style="cursor: pointer;">${t('th_poverty')} &#8597;</th>
                <th class="num" data-sort="grdpPc" style="cursor: pointer;">${t('th_grdp_pc')} &#8597;</th>
              </tr>
            </thead>
            <tbody>
              ${PROVINCES.items.map(p => `
                <tr>
                  <td><strong>${pick(p, 'name')}</strong></td>
                  <td class="num" data-value="${p.population}">${p.population.toLocaleString(numLocale())}</td>
                  <td class="num" data-value="${p.share}">${p.share.toFixed(1)}%</td>
                  <td class="num" data-value="${p.hdi}">${p.hdi.toFixed(2)}</td>
                  <td class="num" data-value="${p.poverty}">${p.poverty.toFixed(2)}%</td>
                  <td class="num" data-value="${p.grdpPc}">${p.grdpPc.toFixed(1)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="footnote" style="margin-top: 1rem;">${pick(PROVINCES, 'note')}</p>
        <p class="footnote">${t('source')}: ${PROVINCES.source}</p>
      </div>
    </section>
  `.trim();
}

export function viewCompare() {
  return `
    <div class="section-header">
      <h2>${t('compare_h')}</h2>
      <p>${t('compare_sub')}</p>
    </div>

    <section class="view-section">
      <div class="chart-card" id="compare">
        <h3>${t('compare_h')}</h3>
        <p class="chart-meta">${t('compare_sub')}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; margin-bottom: 1rem;">
          <div style="flex: 1 1 200px;">
            <label for="compare-a" style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">${t('compare_a')}</label>
            <select id="compare-a" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--hairline); background: var(--surface); color: var(--ink);">
              <option value="">${t('compare_pick')}</option>
              ${PROVINCES.items.map((p, idx) => `<option value="${idx}"${idx === 0 ? ' selected' : ''}>${pick(p, 'name')}</option>`).join('')}
            </select>
          </div>
          <div style="flex: 1 1 200px;">
            <label for="compare-b" style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">${t('compare_b')}</label>
            <select id="compare-b" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--hairline); background: var(--surface); color: var(--ink);">
              <option value="">${t('compare_pick')}</option>
              ${PROVINCES.items.map((p, idx) => `<option value="${idx}"${idx === 1 ? ' selected' : ''}>${pick(p, 'name')}</option>`).join('')}
            </select>
          </div>
        </div>
        <div id="compare-result"></div>
      </div>

      <div class="table-card">
        <h3>${t('largest_provinces')}</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>${t('th_province')}</th>
                <th class="num">${t('th_population')}</th>
                <th class="num">${t('th_share')}</th>
                <th class="num">${t('th_hdi')}</th>
              </tr>
            </thead>
            <tbody>
              ${[...PROVINCES.items].sort((a, b) => b.population - a.population).slice(0, 8).map(p => `
                <tr>
                  <td><strong>${pick(p, 'name')}</strong></td>
                  <td class="num">${p.population.toLocaleString('en-US')}</td>
                  <td class="num">${p.share.toFixed(1)}%</td>
                  <td class="num">${p.hdi.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="footnote" style="margin-top: 1rem;">${t('source')}: ${PROVINCES.source}</p>
      </div>
    </section>
  `.trim();
}

export function viewSources() {
  return `
    <div class="section-header">
      <h2>${t('sources_h')}</h2>
      <p>${t('sources_sub')}</p>
    </div>

    <section class="view-section">
      <div class="source-list">
        <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; color: var(--ink);">${t('pub_sources_h')}</h3>
        <ol style="list-style: none; padding: 0;">
          ${SOURCES.map(s => `
            <li class="source-item">
              <span class="source-number">[${s.id}]</span>
              <div class="source-details">
                <h4>${s.publisher}</h4>
                <p>${pick(s, 'covers')}</p>
              </div>
            </li>
          `).join('')}
        </ol>
      </div>

      <div class="table-card">
        <h3>${t('method_h')}</h3>
        <ul style="margin-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--muted); font-size: 0.95rem; margin-top: 0.75rem;">
          <li>${t('method_1')}</li>
          <li>${t('method_2')}</li>
          <li>${t('method_3')}</li>
        </ul>
      </div>
    </section>
  `.trim();
}
