import * as views from './views.js';
import { SERIES, PROVINCES } from './data.js';
import * as charts from './charts.js';

const routes = {
  '/': views.viewOverview,
  '/economy': views.viewEconomy,
  '/people': views.viewPeople,
  '/provinces': views.viewProvinces,
  '/regions': views.viewRegions,
  '/sources': views.viewSources
};

function renderRoute() {
  const hash = window.location.hash || '#/';
  const routePath = hash.replace('#', '') || '/';
  const renderFunc = routes[routePath] || views.viewOverview;

  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.innerHTML = renderFunc();
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

  // Post-render page-specific wiring
  if (routePath === '/economy') {
    initEconomyExplorer();
  } else if (routePath === '/provinces') {
    initProvinceSorting();
  }
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
      opt.textContent = s.title;
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
      chartContainer.innerHTML = charts.tradeChart(seriesData.subSeries, { title: seriesData.title, unit: seriesData.unit });
      
      const exportsPts = seriesData.subSeries.exports;
      const importsPts = seriesData.subSeries.imports;
      tableContainer.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th class="num">Exports (${seriesData.unit})</th>
              <th class="num">Imports (${seriesData.unit})</th>
              <th class="num">Trade Balance (${seriesData.unit})</th>
              <th>Source</th>
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

    chartContainer.innerHTML = charts.lineChart(filteredPoints, { title: seriesData.title, unit: seriesData.unit });
    tableContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th class="num">Value (${seriesData.unit})</th>
            <th>Source</th>
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
        provinceSortAsc = false; // default to descending for stats/population, or toggle
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
            <td><strong>${p.name}</strong></td>
            <td class="num">${p.population.toLocaleString('en-US')}</td>
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

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderRoute();
}
