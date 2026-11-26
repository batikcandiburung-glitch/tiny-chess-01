import { SITE, HEADLINES, FACTS, SERIES, PROVINCES, ISLANDS, AGE, RELIGION, SOURCES } from './data.js';
import * as charts from './charts.js';

export function viewOverview() {
  return `
    <div class="hero-band">
      <h2>${SITE.tagline}</h2>
      <p>The essential statistics of the world's fourth most populous country, from official sources.</p>
    </div>

    <section class="view-section">
      <div class="card-grid">
        ${HEADLINES.map(h => `
          <div class="stat-card" data-id="${h.id}">
            <div>
              <div class="stat-label">${h.label}</div>
              <div class="stat-figure">${h.value} <span class="stat-unit">${h.unit}</span></div>
              <div class="stat-note">${h.note}</div>
            </div>
            <div class="stat-source">Source: ${h.source}, ${h.year}</div>
          </div>
        `).join('')}
      </div>

      <div class="chart-card">
        <div class="chart-meta">
          <h3>${SERIES.population.title}</h3>
          <span>Source: ${SERIES.population.source}</span>
        </div>
        <div class="chart-container">
          ${charts.lineChart(SERIES.population.points, { title: SERIES.population.title, unit: SERIES.population.unit, decimals: 1 })}
        </div>
        <p class="footnote">${SERIES.population.note || ''}</p>
      </div>

      <div class="card-grid" style="grid-template-columns: 1fr 1fr; align-items: start;">
        <div class="table-card">
          <h3>Country Facts</h3>
          <div class="table-responsive">
            <dl style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; padding: 0.5rem 0;">
              ${FACTS.map(f => `
                <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">
                  <dt style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">${f.label}</dt>
                  <dd style="font-size: 1rem; color: var(--text); font-family: var(--font-serif); font-weight: bold; margin-top: 0.15rem;">${f.value} <span style="font-size: 0.75rem; font-family: var(--font-sans); font-weight: normal; color: var(--text-muted);">(${f.source}, ${f.year})</span></dd>
                </div>
              `).join('')}
            </dl>
          </div>
        </div>

        <div class="chart-card" style="margin-bottom: 0;">
          <h3>Religious Composition</h3>
          <div class="chart-meta">
            <span>Source: ${RELIGION.source}</span>
          </div>
          <div class="chart-container">
            ${charts.hbarChart(RELIGION.items.map(r => ({ label: r.name, value: r.percent })), { title: "Religion shares", unit: "%", decimals: 2, height: 320 })}
          </div>
        </div>
      </div>

      <div class="card-grid">
        <a href="#/economy" class="stat-card" style="text-decoration: none;">
          <div>
            <div class="stat-label">Explore Economy</div>
            <div class="stat-figure" style="font-size: 1.5rem;">Macroeconomics & Trade</div>
            <div class="stat-note">GDP growth, inflation, exports, imports, and time-series explorer.</div>
          </div>
          <div class="stat-source">&rarr; View Economy page</div>
        </a>
        <a href="#/people" class="stat-card" style="text-decoration: none;">
          <div>
            <div class="stat-label">Explore People</div>
            <div class="stat-figure" style="font-size: 1.5rem;">Society & Welfare</div>
            <div class="stat-note">Poverty rates, unemployment, population growth, and visitor arrivals.</div>
          </div>
          <div class="stat-source">&rarr; View People page</div>
        </a>
        <a href="#/provinces" class="stat-card" style="text-decoration: none;">
          <div>
            <div class="stat-label">Explore Provinces</div>
            <div class="stat-figure" style="font-size: 1.5rem;">Regional Statistics</div>
            <div class="stat-note">Population distribution across Indonesia's 38 provinces with sortable data.</div>
          </div>
          <div class="stat-source">&rarr; View Provinces page</div>
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
      <h2>Economy</h2>
      <p>Indonesia's macroeconomic performance, national accounts, growth, inflation, and external trade.</p>
    </div>

    <section class="view-section">
      <div class="card-grid">
        ${gdpHeadlines.map(h => `
          <div class="stat-card" data-id="${h.id}">
            <div>
              <div class="stat-label">${h.label}</div>
              <div class="stat-figure">${h.value} <span class="stat-unit">${h.unit}</span></div>
              <div class="stat-note">${h.note}</div>
            </div>
            <div class="stat-source">Source: ${h.source}, ${h.year}</div>
          </div>
        `).join('')}
      </div>

      <div class="chart-card">
        <h3>Time-Series Indicator Explorer</h3>
        <p class="chart-meta">Select an economic indicator, filter by start year, view the interactive chart and table, and download CSV data.</p>
        <div class="controls-bar">
          <div>
            <label for="series-select" style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Indicator:</label>
            <select id="series-select"></select>
          </div>
          <div>
            <label for="series-from" style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">From Year:</label>
            <select id="series-from"></select>
          </div>
          <div style="margin-top: 1.25rem;">
            <button id="series-csv">Download CSV</button>
          </div>
        </div>
        <div class="chart-container" id="series-chart"></div>
        <div class="table-responsive" id="series-table"></div>
      </div>

      <div class="chart-card">
        <h3>${SERIES.trade.title}</h3>
        <div class="chart-meta">
          <span>Source: ${SERIES.trade.source}, 2019–2024</span>
          <span>Unit: ${SERIES.trade.unit}</span>
        </div>
        <div class="chart-container">
          ${charts.tradeChart(SERIES.trade.subSeries, { title: SERIES.trade.title, unit: SERIES.trade.unit })}
        </div>
        <div class="table-responsive">
          <h4 style="font-size: 1rem; margin-top: 1rem; margin-bottom: 0.5rem; font-family: var(--font-serif);">Latest Year (${latestTradeYear}) Trade Summary</h4>
          <table>
            <thead>
              <tr>
                <th>Indicator</th>
                <th class="num">Value (${SERIES.trade.unit})</th>
                <th>Source & Year</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Exports</td>
                <td class="num">${latestExp.toFixed(1)}</td>
                <td>BPS, ${latestTradeYear}</td>
              </tr>
              <tr>
                <td>Imports</td>
                <td class="num">${latestImp.toFixed(1)}</td>
                <td>BPS, ${latestTradeYear}</td>
              </tr>
              <tr>
                <td><strong>Trade Balance (Exports &minus; Imports)</strong></td>
                <td class="num"><strong>${tradeBalance >= 0 ? '+' : ''}${tradeBalance}</strong></td>
                <td>Computed from BPS, ${latestTradeYear}</td>
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
      <h2>People & Society</h2>
      <p>Demographics, workforce, living standards, poverty, and human development in Indonesia.</p>
    </div>

    <section class="view-section">
      <div class="card-grid">
        ${peopleHeadlines.map(h => `
          <div class="stat-card" data-id="${h.id}">
            <div>
              <div class="stat-label">${h.label}</div>
              <div class="stat-figure">${h.value} <span class="stat-unit">${h.unit}</span></div>
              <div class="stat-note">${h.note}</div>
            </div>
            <div class="stat-source">Source: ${h.source}, ${h.year}</div>
          </div>
        `).join('')}
      </div>

      <div class="card-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="chart-card" style="margin-bottom: 0;">
          <div class="chart-meta">
            <h3>${SERIES.poverty.title}</h3>
            <span>Source: ${SERIES.poverty.source}</span>
          </div>
          <div class="chart-container">
            ${charts.lineChart(SERIES.poverty.points, { title: SERIES.poverty.title, unit: SERIES.poverty.unit, decimals: 2, color: "#841324" })}
          </div>
        </div>

        <div class="chart-card" style="margin-bottom: 0;">
          <div class="chart-meta">
            <h3>${SERIES.unemployment.title}</h3>
            <span>Source: ${SERIES.unemployment.source}</span>
          </div>
          <div class="chart-container">
            ${charts.lineChart(SERIES.unemployment.points, { title: SERIES.unemployment.title, unit: SERIES.unemployment.unit, decimals: 2, color: "#C89B3C" })}
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-meta">
          <h3>${SERIES.visitors.title}</h3>
          <span>Source: ${SERIES.visitors.source}, 2019–2024</span>
        </div>
        <div class="chart-container">
          ${charts.barChart(SERIES.visitors.points.map(p => ({ label: String(p.year), value: p.value })), { title: SERIES.visitors.title, unit: SERIES.visitors.unit, decimals: 2 })}
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-meta">
          <h3>Population Shares by Age Group</h3>
          <span>Source: ${AGE.source}</span>
        </div>
        <div class="chart-container">
          ${charts.barChart(AGE.items.map(a => ({ label: a.name, value: a.percent })), { title: "Population shares by age group", unit: "%", decimals: 1 })}
        </div>
        <p class="footnote" style="margin-top: 1rem;">${AGE.note}</p>
        <p class="footnote">Source: ${AGE.source}</p>
      </div>

      <div class="table-card">
        <h3>About the Poverty Line</h3>
        <p style="margin-top: 0.75rem; color: var(--text);">
          A person is counted poor when monthly spending per capita falls below the BPS poverty line, about Rp 595,000 in March 2025.
        </p>
        <p class="footnote" style="margin-top: 0.5rem;">Source: BPS, March 2025</p>
      </div>
    </section>
  `.trim();
}

export function viewRegions() {
  return `
    <div class="section-header">
      <h2>Regions</h2>
      <p>Population distribution across Indonesia's major island groups.</p>
    </div>

    <section class="view-section">
      <div class="chart-card">
        <div class="chart-meta">
          <h3>Population by Island Group</h3>
          <span>Source: ${ISLANDS.source}</span>
        </div>
        <div class="chart-container">
          ${charts.hbarChart(ISLANDS.items.map(i => ({ label: i.name, value: i.population })), { title: "Population by island group", unit: "million", decimals: 1 })}
        </div>
      </div>

      <div class="table-card">
        <h3>Island Group Population Breakdown</h3>
        <p class="chart-meta">Source: ${ISLANDS.source}.</p>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Island Group</th>
                <th class="num">Population (million)</th>
                <th class="num">Share (%)</th>
              </tr>
            </thead>
            <tbody>
              ${ISLANDS.items.map(i => `
                <tr>
                  <td><strong>${i.name}</strong></td>
                  <td class="num">${i.population.toFixed(1)}</td>
                  <td class="num">${i.share.toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="footnote" style="margin-top: 1rem;">${ISLANDS.note}</p>
        <p class="footnote">Source: ${ISLANDS.source}</p>
      </div>

      <div class="table-card">
        <p style="color: var(--text);">Java alone holds more people than the other island groups combined (56.1 percent of the national total).</p>
      </div>
    </section>
  `.trim();
}

export function viewProvinces() {
  return `
    <div class="section-header">
      <h2>Provinces</h2>
      <p>Regional distribution of population across Indonesia's 38 provinces.</p>
    </div>

    <section class="view-section">
      <div class="chart-card">
        <div class="chart-meta">
          <h3>Top 15 Provinces by Population</h3>
          <span>Source: ${PROVINCES.source}</span>
        </div>
        <div class="chart-container">
          ${charts.hbarChart(PROVINCES.items.map(p => ({ label: p.name, value: +(p.population / 1e6).toFixed(2) })), { title: "Provinces by population", unit: "million", decimals: 2, height: 500 })}
        </div>
      </div>

      <div class="table-card">
        <h3>Provincial Population Breakdown</h3>
        <p class="chart-meta">Click column headers (Population, Share) to sort table data. Source: ${PROVINCES.source}.</p>
        <div class="table-responsive">
          <input type="text" id="province-filter" class="filter-input" placeholder="Filter provinces by name…">
          <table id="province-table">
            <thead>
              <tr>
                <th>Province</th>
                <th class="num" data-sort="population" style="cursor: pointer;" title="Click to sort by population">Population &↕;</th>
                <th class="num" data-sort="share" style="cursor: pointer;" title="Click to sort by share">Share (%) &↕;</th>
              </tr>
            </thead>
            <tbody>
              ${PROVINCES.items.map(p => `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td class="num" data-value="${p.population}">${p.population.toLocaleString('en-US')}</td>
                  <td class="num" data-value="${p.share}">${p.share.toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="footnote" style="margin-top: 1rem;">${PROVINCES.note}</p>
        <p class="footnote">Source: ${PROVINCES.source}</p>
      </div>
    </section>
  `.trim();
}

export function viewSources() {
  return `
    <div class="section-header">
      <h2>Sources & Methodology</h2>
      <p>Official references and statistical methodology for AngkaBangsa.</p>
    </div>

    <section class="view-section">
      <div class="source-list">
        <h3 style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 1.25rem; color: var(--text);">Official Publication Sources</h3>
        <ol style="list-style: none; padding: 0;">
          ${SOURCES.map(s => `
            <li class="source-item">
              <span class="source-number">[${s.id}]</span>
              <div class="source-details">
                <h4>${s.publisher}</h4>
                <p>${s.covers}</p>
              </div>
            </li>
          `).join('')}
        </ol>
      </div>

      <div class="table-card">
        <h3>Methodological Notes</h3>
        <ul style="margin-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-muted); font-size: 0.95rem; margin-top: 0.75rem;">
          <li>Figures are reproduced as published by the sources.</li>
          <li>Percentages may not sum to 100 because of rounding.</li>
          <li>The site works fully offline and collects no data about its visitors.</li>
        </ul>
      </div>
    </section>
  `.trim();
}
