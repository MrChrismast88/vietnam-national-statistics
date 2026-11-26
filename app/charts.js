// VietStats charts — small hand-rolled SVG charts, no library.
// Every chart is built as an SVG string so the page stays fast and the
// first load stays small. Colours come from the site palette in style.css.

export const PALETTE = ['#0f766e', '#d97706', '#1d4ed8', '#be185d', '#15803d', '#7c3aed'];

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceMax(max) {
  const power = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / power;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return step * power;
}

// A line-or-bar chart over the years 2020-2024.
// labels: array of year labels; values: array of numbers; opts: {type, unit, color, height}
export function yearChart(labels, values, opts) {
  const type = (opts && opts.type) || 'bar';
  const color = (opts && opts.color) || PALETTE[0];
  const height = (opts && opts.height) || 240;
  const width = 640;
  const padL = 58, padR = 14, padT = 16, padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const max = niceMax(Math.max.apply(null, values) * 1.08);
  const min = Math.min.apply(null, values) > 0 && Math.min.apply(null, values) / max > 0.7
    ? Math.floor(Math.min.apply(null, values) * 0.92) : 0;
  const y = (v) => padT + plotH - ((v - min) / (max - min)) * plotH;
  const x = (i) => padL + (i / (labels.length - 1)) * plotW;
  const stepX = plotW / labels.length;

  let grid = '';
  for (let g = 0; g <= 4; g += 1) {
    const gv = min + ((max - min) * g) / 4;
    const gy = y(gv);
    grid += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (width - padR) + '" y2="' + gy.toFixed(1) + '" stroke="#e2e8f0" stroke-width="1"/>'
      + '<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#64748b">' + fmtTick(gv) + '</text>';
  }

  let body = '';
  if (type === 'bar') {
    const barW = Math.min(46, stepX * 0.55);
    values.forEach((v, i) => {
      const bx = padL + i * stepX + (stepX - barW) / 2;
      body += '<rect x="' + bx.toFixed(1) + '" y="' + y(v).toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + (padT + plotH - y(v)).toFixed(1) + '" rx="3" fill="' + color + '"/>'
        + '<text x="' + (bx + barW / 2).toFixed(1) + '" y="' + (y(v) - 6).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">' + fmtValue(v) + '</text>';
    });
  } else {
    const points = values.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ');
    body += '<polyline points="' + points + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    values.forEach((v, i) => {
      body += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4.5" fill="#ffffff" stroke="' + color + '" stroke-width="2.5"/>'
        + '<text x="' + x(i).toFixed(1) + '" y="' + (y(v) - 12).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">' + fmtValue(v) + '</text>';
    });
  }

  let axis = '';
  labels.forEach((lab, i) => {
    const cx = type === 'bar' ? padL + i * stepX + stepX / 2 : x(i);
    axis += '<text x="' + cx.toFixed(1) + '" y="' + (height - 10) + '" text-anchor="middle" font-size="12" fill="#475569">' + esc(lab) + '</text>';
  });

  return '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Chart of values by year" style="width:100%;height:auto;display:block">'
    + grid + body + axis + '</svg>';
}

function fmtTick(v) {
  if (v >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'k';
  if (Math.abs(v) >= 100) return String(Math.round(v));
  return String(Math.round(v * 10) / 10);
}

function fmtValue(v) {
  if (Math.abs(v) >= 1000) return v.toLocaleString('en-US');
  if (Number.isInteger(v)) return String(v);
  return String(Math.round(v * 10) / 10);
}

// A donut chart for shares that add to 100.
// parts: [[label, value], ...]; returns an SVG string with a legend.
export function donutChart(parts, opts) {
  const size = (opts && opts.size) || 220;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.62;
  const total = parts.reduce((sum, p) => sum + p[1], 0);
  let start = -Math.PI / 2;
  let slices = '';
  parts.forEach((p, i) => {
    const frac = p[1] / total;
    const end = start + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const ix1 = cx + inner * Math.cos(end), iy1 = cy + inner * Math.sin(end);
    const ix2 = cx + inner * Math.cos(start), iy2 = cy + inner * Math.sin(start);
    slices += '<path d="M ' + x1.toFixed(1) + ' ' + y1.toFixed(1)
      + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1)
      + ' L ' + ix1.toFixed(1) + ' ' + iy1.toFixed(1)
      + ' A ' + inner.toFixed(1) + ' ' + inner.toFixed(1) + ' 0 ' + large + ' 0 ' + ix2.toFixed(1) + ' ' + iy2.toFixed(1)
      + ' Z" fill="' + PALETTE[i % PALETTE.length] + '"/>';
    start = end;
  });
  const legend = parts.map((p, i) => '<li><span class="dot" style="background:' + PALETTE[i % PALETTE.length] + '"></span>'
    + esc(p[0]) + ' <strong>' + fmtValue(p[1]) + '%</strong></li>').join('');
  return '<div class="donut-wrap"><svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Share chart" style="width:' + size + 'px;height:' + size + 'px">'
    + slices + '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-size="26" font-weight="700" fill="#0f172a">' + fmtValue(total) + '%</text>'
    + '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="11" fill="#64748b">of total</text></svg>'
    + '<ul class="legend">' + legend + '</ul></div>';
}

// Horizontal bars for ranked values, e.g. provinces.
// rows: [[label, value, suffix], ...]
export function rankBars(rows, opts) {
  const max = Math.max.apply(null, rows.map((r) => r[1]));
  const color = (opts && opts.color) || PALETTE[0];
  const bars = rows.map((r) => {
    const pct = Math.max(2, (r[1] / max) * 100);
    return '<div class="rank-row"><span class="rank-label">' + esc(r[0]) + '</span>'
      + '<span class="rank-track"><span class="rank-fill" style="width:' + pct.toFixed(1) + '%;background:' + color + '"></span></span>'
      + '<span class="rank-value">' + esc(r[2]) + '</span></div>';
  }).join('');
  return '<div class="rank-bars">' + bars + '</div>';
}
