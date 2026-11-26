/**
 * Dependency-free SVG chart helpers for AngkaBangsa
 */

const DEFAULT_COLOR = "#A6192E";
const SECONDARY_COLOR = "#C89B3C";

export function lineChart(points, options = {}) {
  const {
    title = "",
    unit = "",
    decimals = 2,
    color = DEFAULT_COLOR,
    width = 700,
    height = 320
  } = options;

  if (!points || points.length === 0) return `<svg viewBox="0 0 ${width} ${height}"><text x="20" y="50">No data</text></svg>`;

  const margin = { top: 35, right: 60, bottom: 40, left: 65 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const values = points.map(p => p.value);
  let minVal = Math.min(...values);
  let maxVal = Math.max(...values);
  const minValRaw = minVal;
  const maxValRaw = maxVal;

  if (minValRaw > 0 && minValRaw > maxValRaw / 2) {
    minVal = Math.round(0.9 * minValRaw);
  } else {
    // Ensure zero line is included if values are close to zero or span positive/negative
    if (minVal > 0) minVal = 0;
    if (maxVal < 0) maxVal = 0;
  }
  
  // Add a little padding to max/min
  const range = maxVal - minVal || 1;
  maxVal += range * 0.1;

  const getX = (index) => margin.left + (index / (points.length - 1 || 1)) * chartWidth;
  const getY = (val) => margin.top + chartHeight - ((val - minVal) / (maxVal - minVal || 1)) * chartHeight;

  const coords = points.map((p, i) => ({ x: getX(i), y: getY(p.value), ...p }));
  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');

  // Zero line if applicable
  let zeroLine = '';
  if (minVal <= 0 && maxVal >= 0) {
    const yZero = getY(0);
    zeroLine = `<line x1="${margin.left}" y1="${yZero.toFixed(1)}" x2="${width - margin.right}" y2="${yZero.toFixed(1)}" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1" />`;
  }

  // X-axis labels: first, middle, last
  const firstIdx = 0;
  const lastIdx = points.length - 1;
  const midIdx = Math.floor(lastIdx / 2);
  const xLabels = [firstIdx, midIdx, lastIdx].filter((v, i, arr) => arr.indexOf(v) === i).map(i => {
    const p = points[i];
    const x = getX(i);
    return `<text x="${x.toFixed(1)}" y="${height - 12}" text-anchor="middle" font-size="12" fill="#5A6478">${p.year}</text>`;
  }).join('');

  // Y-axis min/max labels
  const yMaxLabel = `<text x="${margin.left - 10}" y="${margin.top + 5}" text-anchor="end" font-size="12" fill="#5A6478">${maxVal.toFixed(decimals)} ${unit}</text>`;
  const yMinLabel = `<text x="${margin.left - 10}" y="${margin.top + chartHeight + 4}" text-anchor="end" font-size="12" fill="#5A6478">${minVal.toFixed(decimals)} ${unit}</text>`;

  // Dots and last point value callout
  const dots = coords.map((c, i) => {
    const isLast = i === coords.length - 1;
    const r = isLast ? 5 : 3.5;
    return `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${r}" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>`;
  }).join('');

  const lastPoint = coords[coords.length - 1];
  const lastCallout = `<text x="${lastPoint.x + 8}" y="${lastPoint.y + 4}" font-family="Georgia, serif" font-weight="bold" font-size="13" fill="${color}">${lastPoint.value.toFixed(decimals)}</text>`;

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <title>${title}</title>
      <!-- Grid lines -->
      <line x1="${margin.left}" y1="${margin.top}" x2="${width - margin.right}" y2="${margin.top}" stroke="#E2DBD0" stroke-width="1"/>
      <line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${width - margin.right}" y2="${margin.top + chartHeight}" stroke="#E2DBD0" stroke-width="1"/>
      ${zeroLine}
      
      <!-- Axis Labels -->
      ${yMaxLabel}
      ${yMinLabel}
      ${xLabels}

      <!-- Series Path -->
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      
      <!-- Data Dots & Callout -->
      ${dots}
      ${lastCallout}
    </svg>
  `.trim();
}

export function tradeChart(subSeries, options = {}) {
  const {
    title = "Exports and imports",
    unit = "billion US dollars",
    decimals = 1,
    width = 700,
    height = 340
  } = options;

  const exportsPoints = subSeries.exports || [];
  const importsPoints = subSeries.imports || [];
  const points = exportsPoints; // Use for years and count

  if (points.length === 0) return `<svg viewBox="0 0 ${width} ${height}"><text x="20" y="50">No data</text></svg>`;

  const margin = { top: 45, right: 70, bottom: 40, left: 65 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const allVals = [...exportsPoints.map(p => p.value), ...importsPoints.map(p => p.value)];
  let minVal = Math.min(...allVals);
  let maxVal = Math.max(...allVals);
  const minValRaw = minVal;
  const maxValRaw = maxVal;

  if (minValRaw > 0 && minValRaw > maxValRaw / 2) {
    minVal = Math.round(0.9 * minValRaw);
  } else {
    if (minVal > 0) minVal = 0;
    if (maxVal < 0) maxVal = 0;
  }
  
  const range = maxVal - minVal || 1;
  maxVal += range * 0.1;

  const getX = (index) => margin.left + (index / (points.length - 1 || 1)) * chartWidth;
  const getY = (val) => margin.top + chartHeight - ((val - minVal) / (maxVal - minVal || 1)) * chartHeight;

  const expCoords = exportsPoints.map((p, i) => ({ x: getX(i), y: getY(p.value), ...p }));
  const impCoords = importsPoints.map((p, i) => ({ x: getX(i), y: getY(p.value), ...p }));

  const expPathD = expCoords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const impPathD = impCoords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');

  let zeroLine = '';
  if (minVal <= 0 && maxVal >= 0) {
    const yZero = getY(0);
    zeroLine = `<line x1="${margin.left}" y1="${yZero.toFixed(1)}" x2="${width - margin.right}" y2="${yZero.toFixed(1)}" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1" />`;
  }

  const xLabels = points.map((p, i) => {
    if (i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1) {
      const x = getX(i);
      return `<text x="${x.toFixed(1)}" y="${height - 12}" text-anchor="middle" font-size="12" fill="#5A6478">${p.year}</text>`;
    }
    return '';
  }).join('');

  const yMaxLabel = `<text x="${margin.left - 10}" y="${margin.top + 5}" text-anchor="end" font-size="12" fill="#5A6478">${maxVal.toFixed(decimals)} ${unit}</text>`;
  const yMinLabel = `<text x="${margin.left - 10}" y="${margin.top + chartHeight + 4}" text-anchor="end" font-size="12" fill="#5A6478">${minVal.toFixed(decimals)} ${unit}</text>`;

  const expDots = expCoords.map(c => `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="3.5" fill="${DEFAULT_COLOR}" stroke="#FFFFFF" stroke-width="1.5"/>`).join('');
  const impDots = impCoords.map(c => `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="3.5" fill="${SECONDARY_COLOR}" stroke="#FFFFFF" stroke-width="1.5"/>`).join('');

  const lastExp = expCoords[expCoords.length - 1];
  const lastImp = impCoords[impCoords.length - 1];
  const expCallout = `<text x="${lastExp.x + 8}" y="${lastExp.y + 4}" font-family="Georgia, serif" font-weight="bold" font-size="12" fill="${DEFAULT_COLOR}">Exp: ${lastExp.value.toFixed(decimals)}</text>`;
  const impCallout = `<text x="${lastImp.x + 8}" y="${lastImp.y + 18}" font-family="Georgia, serif" font-weight="bold" font-size="12" fill="${SECONDARY_COLOR}">Imp: ${lastImp.value.toFixed(decimals)}</text>`;

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <title>${title}</title>
      <!-- Grid lines -->
      <line x1="${margin.left}" y1="${margin.top}" x2="${width - margin.right}" y2="${margin.top}" stroke="#E2DBD0" stroke-width="1"/>
      <line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${width - margin.right}" y2="${margin.top + chartHeight}" stroke="#E2DBD0" stroke-width="1"/>
      ${zeroLine}
      
      ${yMaxLabel}
      ${yMinLabel}
      ${xLabels}

      <!-- Legend -->
      <g transform="translate(${margin.left}, ${margin.top - 25})">
        <rect x="0" y="0" width="12" height="12" fill="${DEFAULT_COLOR}" rx="2"/>
        <text x="18" y="10" font-size="12" fill="#1E2430">Exports</text>
        <rect x="90" y="0" width="12" height="12" fill="${SECONDARY_COLOR}" rx="2"/>
        <text x="108" y="10" font-size="12" fill="#1E2430">Imports</text>
      </g>

      <!-- Paths -->
      <path d="${expPathD}" fill="none" stroke="${DEFAULT_COLOR}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="${impPathD}" fill="none" stroke="${SECONDARY_COLOR}" stroke-width="2.5" stroke-linejoin="round"/>
      
      ${expDots}
      ${impDots}
      ${expCallout}
      ${impCallout}
    </svg>
  `.trim();
}

export function barChart(items, options = {}) {
  const {
    title = "",
    unit = "",
    decimals = 2,
    color = DEFAULT_COLOR,
    width = 700,
    height = 320
  } = options;

  if (!items || items.length === 0) return `<svg viewBox="0 0 ${width} ${height}"><text x="20" y="50">No data</text></svg>`;

  const margin = { top: 35, right: 30, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const values = items.map(d => d.value);
  const minVal = 0;
  let maxVal = Math.max(...values);
  maxVal += maxVal * 0.15;

  const barWidth = chartWidth / items.length * 0.75;
  const gap = chartWidth / items.length * 0.25;

  const getY = (val) => margin.top + chartHeight - ((val - minVal) / (maxVal - minVal || 1)) * chartHeight;

  const bars = items.map((item, i) => {
    const x = margin.left + i * (barWidth + gap) + gap / 2;
    const y = getY(item.value);
    const h = margin.top + chartHeight - y;
    return `
      <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${Math.max(h, 2).toFixed(1)}" fill="${color}" rx="3"/>
      <text x="${(x + barWidth / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" font-size="10" fill="#1E2430" font-weight="bold">${item.value.toFixed(decimals)}</text>
      <text x="${(x + barWidth / 2).toFixed(1)}" y="${(margin.top + chartHeight + 16).toFixed(1)}" text-anchor="end" font-size="11" fill="#5A6478" transform="rotate(-35, ${(x + barWidth / 2).toFixed(1)}, ${(margin.top + chartHeight + 16).toFixed(1)})">${item.label}</text>
    `;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <title>${title}</title>
      <line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${width - margin.right}" y2="${margin.top + chartHeight}" stroke="#E2DBD0" stroke-width="1"/>
      <text x="${margin.left - 10}" y="${margin.top + 5}" text-anchor="end" font-size="12" fill="#5A6478">${maxVal.toFixed(decimals)} ${unit}</text>
      <text x="${margin.left - 10}" y="${margin.top + chartHeight + 4}" text-anchor="end" font-size="12" fill="#5A6478">0</text>
      ${bars}
    </svg>
  `.trim();
}

export function hbarChart(items, options = {}) {
  const {
    title = "",
    unit = "",
    decimals = 1,
    color = DEFAULT_COLOR,
    width = 700,
    height = 500
  } = options;

  if (!items || items.length === 0) return `<svg viewBox="0 0 ${width} ${height}"><text x="20" y="50">No data</text></svg>`;

  const margin = { top: 25, right: 80, bottom: 25, left: 130 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const values = items.map(d => d.value);
  const maxVal = Math.max(...values) * 1.15;
  const rowHeight = chartHeight / items.length;

  const rows = items.map((item, i) => {
    const y = margin.top + i * rowHeight + 4;
    const barH = rowHeight * 0.65;
    const barW = (item.value / (maxVal || 1)) * chartWidth;

    return `
      <text x="${margin.left - 10}" y="${(y + barH * 0.7).toFixed(1)}" text-anchor="end" font-size="12" fill="#1E2430" font-weight="500">${item.label}</text>
      <rect x="${margin.left}" y="${y.toFixed(1)}" width="${Math.max(barW, 2).toFixed(1)}" height="${barH.toFixed(1)}" fill="${color}" rx="3"/>
      <text x="${(margin.left + barW + 8).toFixed(1)}" y="${(y + barH * 0.7).toFixed(1)}" font-size="12" font-family="Georgia, serif" font-weight="bold" fill="#1E2430">${item.value.toFixed(decimals)}${unit ? ' ' + unit : ''}</text>
    `;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <title>${title}</title>
      ${rows}
    </svg>
  `.trim();
}
