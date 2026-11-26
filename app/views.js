// VietStats views — hash router and page renderers.
// Every page is a function of (year, state) returning HTML. All controls are
// wired with addEventListener after render; nothing is a dead link.

import {
  YEARS, LATEST_YEAR, SERIES, SECTORS, AGE_GROUPS, PROVINCES, REGIONS,
  EDUCATION, HEALTH, ENVIRONMENT, SOURCE_GSO, SOURCE_GSO_PRESS, SOURCE_WB,
  SOURCE_MOIT, SOURCE_MOLISA, SOURCE_MOH, SOURCE_MOET, SOURCE_MONRE,
  changePct, formatNumber
} from './data.js';
import { yearChart, donutChart, rankBars, PALETTE } from './charts.js';

export const NAV = [
  ['#/', 'Overview'],
  ['#/population', 'Population'],
  ['#/economy', 'Economy'],
  ['#/labour', 'Labour & Income'],
  ['#/health', 'Health'],
  ['#/education', 'Education'],
  ['#/environment', 'Environment & Energy'],
  ['#/regions', 'Regions'],
  ['#/explorer', 'Data Explorer'],
  ['#/methodology', 'Methodology']
];

// Shared page state: selected year, chart style, table sort, filters.
export const state = {
  year: LATEST_YEAR,
  chartType: 'bar',
  regionFilter: 'All regions',
  explorerQuery: '',
  explorerSort: { key: 'name', dir: 1 },
  regionsSort: { key: 'pop', dir: -1 }
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sourceLine(text) {
  return '<p class="source-note">Source: ' + esc(text) + '</p>';
}

function kpiCard(label, value, unit, delta, deltaLabel, source) {
  const deltaHtml = delta === null ? '' : '<div class="kpi-delta ' + (delta >= 0 ? 'up' : 'down') + '">'
    + (delta >= 0 ? '▲ ' : '▼ ') + Math.abs(delta).toFixed(1) + '% ' + esc(deltaLabel) + '</div>';
  return '<div class="kpi"><div class="kpi-label">' + esc(label) + '</div>'
    + '<div class="kpi-value">' + esc(value) + '</div>'
    + '<div class="kpi-unit">' + esc(unit) + '</div>' + deltaHtml
    + '<div class="kpi-source">' + esc(source) + '</div></div>';
}

function seriesChart(key, chartType) {
  const s = SERIES[key];
  const labels = YEARS.map(String);
  const values = YEARS.map((y) => s.values[y]);
  return yearChart(labels, values, { type: chartType, color: PALETTE[0] });
}

function toggleHtml(group, current) {
  return '<span class="toggle-group" data-toggle="' + group + '">'
    + '<button type="button" data-value="bar" class="' + (current === 'bar' ? 'active' : '') + '">Bars</button>'
    + '<button type="button" data-value="line" class="' + (current === 'line' ? 'active' : '') + '">Line</button></span>';
}

// ---- Pages ----

function pageOverview() {
  const y = state.year;
  const prev = y - 1;
  const gdpDelta = changePct('gdp', y);
  const popDelta = changePct('population', y);
  const cpiDelta = SERIES.cpi.values[y] - SERIES.cpi.values[prev];
  const expDelta = changePct('exports', y);
  const cards = kpiCard('Population', formatNumber(SERIES.population.values[y], 1), 'million people', popDelta, 'vs ' + prev, 'GSO, Statistical Yearbook 2024')
    + kpiCard('GDP', '$' + formatNumber(SERIES.gdp.values[y], 0), 'billion, nominal', gdpDelta, 'vs ' + prev, 'GSO, Statistical Yearbook 2024')
    + kpiCard('GDP per capita', '$' + formatNumber(SERIES.gdpPerCapita.values[y], 0), 'per person', changePct('gdpPerCapita', y), 'vs ' + prev, 'GSO, Statistical Yearbook 2024')
    + kpiCard('Inflation (CPI)', SERIES.cpi.values[y].toFixed(1) + '%', 'annual average', cpiDelta === null ? null : -cpiDelta, 'change vs ' + prev, 'GSO press release');
  return '<p class="eyebrow">Viet Nam · National statistics</p>'
    + '<h1>Vietnam in Numbers</h1>'
    + '<p class="lede">The headline figures for Viet Nam — population, economy, trade, work, health, schooling and the environment — drawn from the country\u2019s official statistics and kept in one place. Pick a year above; every figure on the page follows it.</p>'
    + '<div class="kpi-grid">' + cards + '</div>'
    + '<div class="two-col">'
    + '<section class="card"><div class="chart-head"><h3>Real GDP growth, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('growth', state.chartType) + '</div>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => SERIES.gdpGrowth.values[yy]), { type: state.chartType, color: PALETTE[2] })
    + sourceLine(SOURCE_GSO_PRESS + '. 2022 marks the post-COVID rebound; 2024 growth was 7.1%.') + '</section>'
    + '<section class="card"><div class="chart-head"><h3>Exports of goods, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('exports', state.chartType) + '</div>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => SERIES.exports.values[yy]), { type: state.chartType, color: PALETTE[1] })
    + sourceLine(SOURCE_MOIT + '. Exports reached $405.5 billion in 2024, a record year.') + '</section>'
    + '</div>'
    + '<section class="card"><h2>What changed in ' + y + '</h2>'
    + '<ul class="stat-list">'
    + '<li><span>Exports grew ' + (expDelta === null ? '—' : expDelta.toFixed(1) + '%') + ' to $' + formatNumber(SERIES.exports.values[y], 1) + ' billion</span><span class="v">' + y + '</span></li>'
    + '<li><span>Trade surplus: $' + formatNumber(SERIES.exports.values[y] - SERIES.imports.values[y], 1) + ' billion (exports minus imports)</span><span class="v">' + y + '</span></li>'
    + '<li><span>Unemployment stayed low at ' + SERIES.unemployment.values[y].toFixed(1) + '% of the labour force</span><span class="v">' + y + '</span></li>'
    + '<li><span>Life expectancy reached ' + SERIES.lifeExpectancy.values[y].toFixed(1) + ' years</span><span class="v">' + y + '</span></li>'
    + '</ul>' + sourceLine(SOURCE_GSO + '; ' + SOURCE_MOIT + '; ' + SOURCE_MOLISA + '.') + '</section>'
    + '<div class="callout"><p><strong>Start exploring:</strong> <a href="#/population">who lives here</a>, <a href="#/economy">how the economy is doing</a>, <a href="#/regions">how each province compares</a>, or open the <a href="#/explorer">Data Explorer</a> to sort and filter every series yourself.</p></div>';
}

function pagePopulation() {
  const y = state.year;
  return '<p class="eyebrow">People</p><h1>Population</h1>'
    + '<p class="lede">Viet Nam passed 100 million people in 2023 and reached about ' + formatNumber(SERIES.population.values[y], 1) + ' million in ' + y + '. Two in three Vietnamese are of working age, and the share aged 65 and over is rising every year.</p>'
    + '<div class="kpi-grid">'
    + kpiCard('Population', formatNumber(SERIES.population.values[y], 1), 'million people', changePct('population', y), 'vs ' + (y - 1), 'GSO, Statistical Yearbook 2024')
    + kpiCard('Aged 0–14', AGE_GROUPS[y][0][1].toFixed(1) + '%', 'of the population', null, '', 'GSO population estimates')
    + kpiCard('Aged 15–64', AGE_GROUPS[y][1][1].toFixed(1) + '%', 'of the population', null, '', 'GSO population estimates')
    + kpiCard('Aged 65+', AGE_GROUPS[y][2][1].toFixed(1) + '%', 'of the population', null, '', 'GSO population estimates')
    + '</div>'
    + '<div class="two-col">'
    + '<section class="card"><div class="chart-head"><h3>Population, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('pop', state.chartType) + '</div>'
    + seriesChart('population', state.chartType) + sourceLine(SERIES.population.source + '. ' + SERIES.population.note) + '</section>'
    + '<section class="card"><h3>Age structure in ' + y + '</h3>' + donutChart(AGE_GROUPS[y])
    + sourceLine('GSO population estimates. The working-age share has held near 69% while the 65+ share climbs.') + '</section>'
    + '</div>'
    + '<section class="card"><h2>Where people live</h2><p>About 38% of Vietnamese live in towns and cities. Ho Chi Minh City is the largest city with about 9.5 million people, followed by Ha Noi with about 8.7 million. See the full ranking on the <a href="#/regions">Regions</a> page.</p>'
    + sourceLine(SOURCE_GSO + '. Urban share is a GSO estimate for 2024.') + '</section>';
}

function pageEconomy() {
  const y = state.year;
  const surplus = SERIES.exports.values[y] - SERIES.imports.values[y];
  return '<p class="eyebrow">Money &amp; trade</p><h1>Economy</h1>'
    + '<p class="lede">Viet Nam\u2019s economy grew ' + SERIES.gdpGrowth.values[y].toFixed(1) + '% in real terms in ' + y + ', with nominal GDP of $' + formatNumber(SERIES.gdp.values[y], 0) + ' billion. Services now produce the largest share of GDP, and exports remain the engine of growth.</p>'
    + '<div class="kpi-grid">'
    + kpiCard('GDP', '$' + formatNumber(SERIES.gdp.values[y], 0), 'billion, nominal', changePct('gdp', y), 'vs ' + (y - 1), 'GSO, Statistical Yearbook 2024')
    + kpiCard('Real GDP growth', SERIES.gdpGrowth.values[y].toFixed(1) + '%', 'year on year', null, '', 'GSO press release')
    + kpiCard('Exports', '$' + formatNumber(SERIES.exports.values[y], 1), 'billion', changePct('exports', y), 'vs ' + (y - 1), 'Ministry of Industry and Trade')
    + kpiCard('Trade balance', (surplus >= 0 ? '+' : '−') + '$' + formatNumber(Math.abs(surplus), 1), 'billion', null, '', 'Ministry of Industry and Trade')
    + '</div>'
    + '<div class="two-col">'
    + '<section class="card"><div class="chart-head"><h3>Nominal GDP, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('gdp', state.chartType) + '</div>'
    + seriesChart('gdp', state.chartType) + sourceLine(SERIES.gdp.source + '. ' + SERIES.gdp.note) + '</section>'
    + '<section class="card"><h3>GDP by sector in ' + y + '</h3>' + donutChart(SECTORS[y])
    + sourceLine(SOURCE_GSO + '. Shares are of GDP at current prices.') + '</section>'
    + '</div>'
    + '<section class="card"><div class="chart-head"><h3>Consumer price inflation, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('cpi', state.chartType) + '</div>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => SERIES.cpi.values[yy]), { type: state.chartType, color: PALETTE[3] })
    + sourceLine(SERIES.cpi.source + '. Inflation stayed inside the National Assembly\u2019s 4–4.5% target band every year shown.') + '</section>'
    + '<section class="card"><h2>Trade in ' + y + '</h2>'
    + '<table class="data-table"><thead><tr><th>Flow</th><th class="num">Billion USD</th><th class="num">Change vs ' + (y - 1) + '</th></tr></thead><tbody>'
    + '<tr><td>Exports of goods</td><td class="num">' + formatNumber(SERIES.exports.values[y], 1) + '</td><td class="num">' + (changePct('exports', y) === null ? '—' : changePct('exports', y).toFixed(1) + '%') + '</td></tr>'
    + '<tr><td>Imports of goods</td><td class="num">' + formatNumber(SERIES.imports.values[y], 1) + '</td><td class="num">' + (changePct('imports', y) === null ? '—' : changePct('imports', y).toFixed(1) + '%') + '</td></tr>'
    + '<tr><td><strong>Trade balance</strong></td><td class="num"><strong>' + formatNumber(surplus, 1) + '</strong></td><td class="num">—</td></tr>'
    + '</tbody></table>' + sourceLine(SOURCE_MOIT + '.') + '</section>';
}

function pageLabour() {
  const y = state.year;
  return '<p class="eyebrow">Work &amp; pay</p><h1>Labour &amp; Income</h1>'
    + '<p class="lede">About ' + formatNumber(SERIES.labourForce.values[y], 1) + ' million Vietnamese aged 15 and over were in the labour force in ' + y + '. Unemployment was ' + SERIES.unemployment.values[y].toFixed(1) + '% — low by world standards — while average monthly income kept rising with GDP per capita.</p>'
    + '<div class="kpi-grid">'
    + kpiCard('Labour force', formatNumber(SERIES.labourForce.values[y], 1), 'million people, ages 15+', changePct('labourForce', y), 'vs ' + (y - 1), 'Ministry of Labour, Invalids and Social Affairs')
    + kpiCard('Unemployment', SERIES.unemployment.values[y].toFixed(1) + '%', 'of the labour force', null, '', 'Labour force survey')
    + kpiCard('GDP per capita', '$' + formatNumber(SERIES.gdpPerCapita.values[y], 0), 'per person', changePct('gdpPerCapita', y), 'vs ' + (y - 1), 'GSO, Statistical Yearbook 2024')
    + kpiCard('Informal workers', '≈ 65%', 'of employed workers (estimate)', null, '', 'ILO / GSO labour survey, estimate')
    + '</div>'
    + '<div class="two-col">'
    + '<section class="card"><div class="chart-head"><h3>Unemployment, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('unemp', state.chartType) + '</div>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => SERIES.unemployment.values[yy]), { type: state.chartType, color: PALETTE[4] })
    + sourceLine(SERIES.unemployment.source + '. ' + SERIES.unemployment.note + ' The 2021 spike reflects COVID-19 lockdowns.') + '</section>'
    + '<section class="card"><div class="chart-head"><h3>GDP per capita, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('gdppc', state.chartType) + '</div>'
    + seriesChart('gdpPerCapita', state.chartType) + sourceLine(SERIES.gdpPerCapita.source + '. ' + SERIES.gdpPerCapita.note) + '</section>'
    + '</div>'
    + '<section class="card"><h2>How people work</h2><p>Around a third of workers are still in agriculture, forestry and fishing, down from about 40% a decade ago. Manufacturing, construction and services now employ most of the rest. The statutory regional minimum wage is revised each July; in 2024 it ranged from about 3.45 to 4.96 million VND a month depending on the region.</p>'
    + sourceLine(SOURCE_MOLISA + '; ' + SOURCE_GSO + '. Minimum-wage figures are the 2024 statutory rates.') + '</section>';
}

function pageHealth() {
  const y = state.year;
  return '<p class="eyebrow">Wellbeing</p><h1>Health</h1>'
    + '<p class="lede">Vietnamese live longer than ever: life expectancy reached ' + SERIES.lifeExpectancy.values[y].toFixed(1) + ' years in ' + y + '. Health insurance now covers ' + HEALTH.healthInsurance[y].toFixed(1) + '% of the population, and infant mortality keeps falling.</p>'
    + '<div class="kpi-grid">'
    + kpiCard('Life expectancy', SERIES.lifeExpectancy.values[y].toFixed(1), 'years at birth', null, '', 'Ministry of Health')
    + kpiCard('Health insurance', HEALTH.healthInsurance[y].toFixed(1) + '%', 'of population covered', null, '', 'Viet Nam Social Security')
    + kpiCard('Hospital beds', HEALTH.hospitalBeds[y].toFixed(1), 'per 10,000 people', null, '', 'Ministry of Health')
    + kpiCard('Doctors', HEALTH.doctorsPer10k[y].toFixed(1), 'per 10,000 people', null, '', 'Ministry of Health')
    + '</div>'
    + '<div class="two-col">'
    + '<section class="card"><div class="chart-head"><h3>Life expectancy, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('life', state.chartType) + '</div>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => SERIES.lifeExpectancy.values[yy]), { type: state.chartType, color: PALETTE[4] })
    + sourceLine(SERIES.lifeExpectancy.source + '. ' + SERIES.lifeExpectancy.note) + '</section>'
    + '<section class="card"><div class="chart-head"><h3>Infant mortality, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('infant', state.chartType) + '</div>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => HEALTH.infantMortality[yy]), { type: state.chartType, color: PALETTE[3] })
    + sourceLine(SOURCE_MOH + '. Deaths per 1,000 live births.') + '</section>'
    + '</div>'
    + '<section class="card"><h2>Health system at a glance</h2>'
    + '<ul class="stat-list">'
    + '<li><span>Health insurance coverage</span><span class="v">' + HEALTH.healthInsurance[y].toFixed(1) + '%</span></li>'
    + '<li><span>Hospital beds per 10,000 people</span><span class="v">' + HEALTH.hospitalBeds[y].toFixed(1) + '</span></li>'
    + '<li><span>Doctors per 10,000 people</span><span class="v">' + HEALTH.doctorsPer10k[y].toFixed(1) + '</span></li>'
    + '<li><span>Infant mortality (per 1,000 live births)</span><span class="v">' + HEALTH.infantMortality[y].toFixed(1) + '</span></li>'
    + '</ul>' + sourceLine(SOURCE_MOH + '; Viet Nam Social Security. Figures for ' + y + '.') + '</section>';
}

function pageEducation() {
  const y = state.year;
  return '<p class="eyebrow">Learning</p><h1>Education</h1>'
    + '<p class="lede">Nearly every child finishes primary school — net enrolment was ' + EDUCATION.primaryEnrolment[y].toFixed(1) + '% in ' + y + ' — and adult literacy stands at ' + EDUCATION.literacy[y].toFixed(1) + '%. About ' + EDUCATION.students[y].toFixed(2) + ' million students are enrolled in higher education.</p>'
    + '<div class="kpi-grid">'
    + kpiCard('Adult literacy', EDUCATION.literacy[y].toFixed(1) + '%', 'ages 15 and over', null, '', 'Ministry of Education and Training')
    + kpiCard('Primary enrolment', EDUCATION.primaryEnrolment[y].toFixed(1) + '%', 'net enrolment rate', null, '', 'Ministry of Education and Training')
    + kpiCard('Upper secondary', EDUCATION.upperSecondaryEnrolment[y].toFixed(1) + '%', 'net enrolment rate', null, '', 'Ministry of Education and Training')
    + kpiCard('Universities', String(EDUCATION.universities[y]), 'higher-education institutions', null, '', 'Ministry of Education and Training')
    + '</div>'
    + '<div class="two-col">'
    + '<section class="card"><div class="chart-head"><h3>Enrolment by level, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('enrol', state.chartType) + '</div>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => EDUCATION.upperSecondaryEnrolment[yy]), { type: state.chartType, color: PALETTE[5] })
    + sourceLine(SOURCE_MOET + '. Chart shows upper-secondary net enrolment; it rose from 72.4% in 2020 to ' + EDUCATION.upperSecondaryEnrolment[y].toFixed(1) + '% in ' + y + '.') + '</section>'
    + '<section class="card"><h3>Higher-education students, 2020–' + LATEST_YEAR + '</h3>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => EDUCATION.students[yy]), { type: 'bar', color: PALETTE[2] })
    + sourceLine(SOURCE_MOET + '. Millions of students enrolled in universities and colleges.') + '</section>'
    + '</div>'
    + '<section class="card"><h2>Enrolment in ' + y + '</h2>'
    + '<table class="data-table"><thead><tr><th>Level</th><th class="num">Net enrolment</th></tr></thead><tbody>'
    + '<tr><td>Primary</td><td class="num">' + EDUCATION.primaryEnrolment[y].toFixed(1) + '%</td></tr>'
    + '<tr><td>Lower secondary</td><td class="num">' + EDUCATION.lowerSecondaryEnrolment[y].toFixed(1) + '%</td></tr>'
    + '<tr><td>Upper secondary</td><td class="num">' + EDUCATION.upperSecondaryEnrolment[y].toFixed(1) + '%</td></tr>'
    + '</tbody></table>' + sourceLine(SOURCE_MOET + '.') + '</section>';
}

function pageEnvironment() {
  const y = state.year;
  return '<p class="eyebrow">Planet</p><h1>Environment &amp; Energy</h1>'
    + '<p class="lede">Forest covers about 42% of Viet Nam\u2019s land, and renewables — mostly hydro, plus fast-growing solar and wind — supplied about ' + SERIES.renewableShare.values[y].toFixed(1) + '% of installed power capacity in ' + y + '. CO₂ per person was about ' + ENVIRONMENT.co2PerCapita[y].toFixed(1) + ' tonnes.</p>'
    + '<div class="kpi-grid">'
    + kpiCard('Forest cover', SERIES.forestCover.values[y].toFixed(1) + '%', 'of land area', null, '', 'Ministry of Natural Resources and Environment')
    + kpiCard('Renewables share', SERIES.renewableShare.values[y].toFixed(1) + '%', 'of installed power capacity', null, '', 'Ministry of Natural Resources and Environment')
    + kpiCard('CO₂ per capita', ENVIRONMENT.co2PerCapita[y].toFixed(1), 'tonnes per person', null, '', 'World Bank, World Development Indicators')
    + kpiCard('Rural clean water', ENVIRONMENT.cleanWaterRural[y].toFixed(1) + '%', 'of rural households', null, '', 'Ministry of Natural Resources and Environment')
    + '</div>'
    + '<div class="two-col">'
    + '<section class="card"><div class="chart-head"><h3>Renewables in power capacity, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('renew', state.chartType) + '</div>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => SERIES.renewableShare.values[yy]), { type: state.chartType, color: PALETTE[4] })
    + sourceLine(SERIES.renewableShare.source + '. ' + SERIES.renewableShare.note) + '</section>'
    + '<section class="card"><div class="chart-head"><h3>CO₂ per capita, 2020–' + LATEST_YEAR + '</h3>' + toggleHtml('co2', state.chartType) + '</div>'
    + yearChart(YEARS.map(String), YEARS.map((yy) => ENVIRONMENT.co2PerCapita[yy]), { type: state.chartType, color: PALETTE[1] })
    + sourceLine(SOURCE_WB + '. Tonnes of CO₂ per person.') + '</section>'
    + '</div>'
    + '<section class="card"><h2>Targets to watch</h2><p>Viet Nam has pledged net-zero greenhouse-gas emissions by 2050. The power plan to 2030 (PDP8) prioritises offshore wind, solar and gas over new coal. Urban waste collection reached ' + ENVIRONMENT.wasteCollected[y].toFixed(1) + '% in ' + y + ', and ' + ENVIRONMENT.cleanWaterRural[y].toFixed(1) + '% of rural households had access to clean water.</p>'
    + sourceLine(SOURCE_MONRE + '; ' + SOURCE_WB + '.') + '</section>';
}

function provinceRows(list) {
  return list.map((p) => {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return '<tr><td><a href="#/regions/' + slug + '">' + esc(p.name) + '</a></td><td>' + esc(p.region) + '</td>'
      + '<td class="num">' + p.pop.toFixed(2) + '</td><td class="num">$' + formatNumber(p.grdpPc, 0) + '</td>'
      + '<td class="num">' + p.urban.toFixed(1) + '%</td></tr>';
  }).join('');
}

function pageRegions() {
  const filtered = state.regionFilter === 'All regions'
    ? PROVINCES.slice()
    : PROVINCES.filter((p) => p.region === state.regionFilter);
  const sorted = filtered.slice().sort((a, b) => {
    const k = state.regionsSort.key;
    const d = state.regionsSort.dir;
    if (k === 'name' || k === 'region') return a[k].localeCompare(b[k]) * d;
    return (a[k] - b[k]) * d;
  });
  const top = PROVINCES.slice().sort((a, b) => b.pop - a.pop).slice(0, 8);
  const options = REGIONS.map((r) => '<option value="' + esc(r) + '"' + (r === state.regionFilter ? ' selected' : '') + '>' + esc(r) + '</option>').join('');
  const sortBtn = (key, label) => '<button type="button" data-sort="' + key + '">' + label
    + (state.regionsSort.key === key ? (state.regionsSort.dir === 1 ? ' ▲' : ' ▼') : '') + '</button>';
  return '<p class="eyebrow">Places</p><h1>Regions &amp; Provinces</h1>'
    + '<p class="lede">Viet Nam has 63 provinces and centrally-run cities, grouped into 8 regions. The South East — Ho Chi Minh City, Binh Duong and Dong Nai — is the richest region per person; the Red River Delta around Ha Noi is the most densely settled.</p>'
    + '<section class="card"><h3>Largest provinces by population</h3>'
    + rankBars(top.map((p) => [p.name, p.pop, p.pop.toFixed(2) + 'm']))
    + sourceLine('GSO population estimates, 2024.') + '</section>'
    + '<section class="card"><h2>All provinces in this list</h2>'
    + '<div class="table-tools"><label>Region <select id="region-filter">' + options + '</select></label>'
    + '<span>' + sorted.length + ' of ' + PROVINCES.length + ' provinces shown</span></div>'
    + '<div class="table-wrap"><table class="data-table"><thead><tr>'
    + '<th>' + sortBtn('name', 'Province') + '</th><th>' + sortBtn('region', 'Region') + '</th>'
    + '<th class="num">' + sortBtn('pop', 'Population (m)') + '</th>'
    + '<th class="num">' + sortBtn('grdpPc', 'GRDP per capita') + '</th>'
    + '<th class="num">' + sortBtn('urban', 'Urban share') + '</th></tr></thead>'
    + '<tbody>' + provinceRows(sorted) + '</tbody></table></div>'
    + sourceLine('GSO, Statistical Yearbook 2024; GRDP per capita for smaller provinces is an estimate from provincial statistical offices. Click a province name for its detail page.') + '</section>';
}

function pageRegionDetail(slug) {
  const p = PROVINCES.find((x) => x.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  if (!p) {
    return '<h1>Province not found</h1><p>The province you asked for is not in our list of 24 featured provinces. <a href="#/regions">Back to all regions</a>.</p>';
  }
  const peers = PROVINCES.filter((x) => x.region === p.region).sort((a, b) => b.pop - a.pop);
  const rankPop = PROVINCES.slice().sort((a, b) => b.pop - a.pop).indexOf(p) + 1;
  const rankGrdp = PROVINCES.slice().sort((a, b) => b.grdpPc - a.grdpPc).indexOf(p) + 1;
  return '<p class="eyebrow"><a href="#/regions">Regions</a> · ' + esc(p.region) + '</p><h1>' + esc(p.name) + '</h1>'
    + '<p class="lede">' + esc(p.name) + ' is in the ' + esc(p.region) + ' region of Viet Nam. About ' + p.urban.toFixed(1) + '% of its people live in urban areas, and its GRDP per capita is about $' + formatNumber(p.grdpPc, 0) + '.</p>'
    + '<div class="kpi-grid">'
    + kpiCard('Population', p.pop.toFixed(2), 'million people', null, '', 'GSO, Statistical Yearbook 2024')
    + kpiCard('Population rank', '#' + rankPop, 'of ' + PROVINCES.length + ' provinces listed', null, '', 'GSO population estimates')
    + kpiCard('GRDP per capita', '$' + formatNumber(p.grdpPc, 0), 'per person', null, '', 'Provincial statistical office, estimate')
    + kpiCard('GRDP rank', '#' + rankGrdp, 'of ' + PROVINCES.length + ' provinces listed', null, '', 'Provincial statistical office, estimate')
    + '</div>'
    + '<section class="card"><h2>Other provinces in ' + esc(p.region) + '</h2>'
    + '<div class="table-wrap"><table class="data-table"><thead><tr><th>Province</th><th class="num">Population (m)</th><th class="num">GRDP per capita</th><th class="num">Urban share</th></tr></thead><tbody>'
    + peers.map((x) => '<tr><td><a href="#/regions/' + x.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '">' + esc(x.name) + '</a></td><td class="num">' + x.pop.toFixed(2) + '</td><td class="num">$' + formatNumber(x.grdpPc, 0) + '</td><td class="num">' + x.urban.toFixed(1) + '%</td></tr>').join('')
    + '</tbody></table></div>' + sourceLine('GSO, Statistical Yearbook 2024.') + '</section>'
    + '<p><a href="#/regions">← Back to all regions</a></p>';
}

function pageExplorer() {
  const q = state.explorerQuery.trim().toLowerCase();
  const keys = Object.keys(SERIES);
  let rows = keys.map((k) => {
    const s = SERIES[k];
    return { key: k, label: s.label, unit: s.unit, source: s.source, values: s.values };
  });
  if (q) rows = rows.filter((r) => (r.label + ' ' + r.unit + ' ' + r.source).toLowerCase().includes(q));
  const sortKey = state.explorerSort.key;
  const dir = state.explorerSort.dir;
  rows.sort((a, b) => {
    if (sortKey === 'latest') return (a.values[LATEST_YEAR] - b.values[LATEST_YEAR]) * dir;
    if (sortKey === 'change') return ((changePct(a.key, LATEST_YEAR) || 0) - (changePct(b.key, LATEST_YEAR) || 0)) * dir;
    return a.label.localeCompare(b.label) * dir;
  });
  const sortBtn = (key, label) => '<button type="button" data-exsort="' + key + '">' + label
    + (sortKey === key ? (dir === 1 ? ' ▲' : ' ▼') : '') + '</button>';
  const body = rows.map((r) => {
    const ch = changePct(r.key, LATEST_YEAR);
    return '<tr><td>' + esc(r.label) + '<br><span style="color:var(--muted);font-size:0.82rem">' + esc(r.unit) + '</span></td>'
      + YEARS.map((yy) => '<td class="num">' + formatNumber(r.values[yy], r.values[yy] >= 1000 ? 0 : 1) + '</td>').join('')
      + '<td class="num">' + (ch === null ? '—' : (ch >= 0 ? '+' : '') + ch.toFixed(1) + '%') + '</td></tr>';
  }).join('');
  return '<p class="eyebrow">Tables</p><h1>Data Explorer</h1>'
    + '<p class="lede">Every headline series in one table, 2020–' + LATEST_YEAR + '. Search by name, or sort by the latest value or by the change in the latest year.</p>'
    + '<section class="card"><div class="table-tools">'
    + '<input type="search" id="explorer-search" placeholder="Search series, e.g. exports…" value="' + esc(state.explorerQuery) + '" aria-label="Search series">'
    + '<span>' + rows.length + ' series</span></div>'
    + '<div class="table-wrap"><table class="data-table"><thead><tr><th>' + sortBtn('name', 'Indicator') + '</th>'
    + YEARS.map((yy) => '<th class="num">' + yy + '</th>').join('')
    + '<th class="num">' + sortBtn('change', 'Change ' + LATEST_YEAR) + '</th></tr></thead>'
    + '<tbody>' + (body || '<tr><td colspan="7">No series matches your search. Try another word.</td></tr>') + '</tbody></table></div>'
    + sourceLine('All series: ' + SOURCE_GSO + '; trade figures: ' + SOURCE_MOIT + '; labour: ' + SOURCE_MOLISA + '; health: ' + SOURCE_MOH + '; environment: ' + SOURCE_MONRE + '.') + '</section>';
}

function pageMethodology() {
  return '<p class="eyebrow">About the numbers</p><h1>Methodology &amp; Sources</h1>'
    + '<p class="lede">VietStats is an independent presentation of Viet Nam\u2019s official statistics. It is not affiliated with the General Statistics Office or any government body. Every figure on this site names its source and year.</p>'
    + '<section class="card"><h2>Where the numbers come from</h2><dl class="method-list">'
    + '<dt>General Statistics Office of Viet Nam (GSO)</dt><dd>Population, GDP, GDP per capita, CPI and sector shares, from the Statistical Yearbook 2024 and the GSO\u2019s press releases on socio-economic statistics.</dd>'
    + '<dt>Ministry of Industry and Trade</dt><dd>Exports and imports of goods, from the ministry\u2019s annual export-import report.</dd>'
    + '<dt>Ministry of Labour, Invalids and Social Affairs</dt><dd>Labour force and unemployment, from the quarterly labour force survey.</dd>'
    + '<dt>Ministry of Health</dt><dd>Life expectancy, hospital beds, doctors and infant mortality, from the ministry\u2019s health statistics.</dd>'
    + '<dt>Ministry of Education and Training</dt><dd>Literacy and enrolment rates and higher-education counts, from the ministry\u2019s education statistics.</dd>'
    + '<dt>Ministry of Natural Resources and Environment</dt><dd>Forest cover, renewables in power capacity, clean water and waste collection.</dd>'
    + '<dt>World Bank, World Development Indicators</dt><dd>CO₂ emissions per capita, for cross-checking against national figures.</dd>'
    + '</dl></section>'
    + '<section class="card"><h2>How we present them</h2><dl class="method-list">'
    + '<dt>Years</dt><dd>Figures run from 2020 to 2024, the latest year the Statistical Yearbook covers. The year selector at the top of the page moves every page to that year.</dd>'
    + '<dt>Estimates</dt><dd>Any figure marked \u201cestimate\u201d is a preliminary GSO figure or a provincial-office estimate, not a final audited value.</dd>'
    + '<dt>Rounding</dt><dd>Figures are rounded for readability; percentages may not add to exactly 100. Growth rates are computed from unrounded values where available.</dd>'
    + '<dt>Currency</dt><dd>Dollar figures use the average annual exchange rate published by the State Bank of Viet Nam for the year shown.</dd>'
    + '<dt>Provinces</dt><dd>The Regions page lists 24 featured provinces and cities; Viet Nam has 63 in total. Population figures are GSO estimates; GRDP per capita for smaller provinces is an estimate.</dd>'
    + '</dl></section>'
    + '<section class="card"><h2>Reuse</h2><p>Figures may be quoted with attribution to the source named beside them. This site\u2019s text, design and charts are original work, released under the MIT licence in the project repository.</p></section>';
}

// ---- Router ----

export function renderRoute() {
  const hash = window.location.hash || '#/';
  const parts = hash.slice(2).split('/').filter(Boolean);
  const main = document.getElementById('view');
  let html;
  if (parts.length === 0) html = pageOverview();
  else if (parts[0] === 'population') html = pagePopulation();
  else if (parts[0] === 'economy') html = pageEconomy();
  else if (parts[0] === 'labour') html = pageLabour();
  else if (parts[0] === 'health') html = pageHealth();
  else if (parts[0] === 'education') html = pageEducation();
  else if (parts[0] === 'environment') html = pageEnvironment();
  else if (parts[0] === 'regions' && parts.length === 2) html = pageRegionDetail(parts[1]);
  else if (parts[0] === 'regions') html = pageRegions();
  else if (parts[0] === 'explorer') html = pageExplorer();
  else if (parts[0] === 'methodology') html = pageMethodology();
  else html = '<h1>Page not found</h1><p>That page does not exist. <a href="#/">Back to the overview</a>.</p>';
  main.innerHTML = html;
  wireControls();
  document.querySelectorAll('.main-nav a').forEach((a) => {
    const href = a.getAttribute('href');
    const active = parts.length === 0
      ? href === '#/'
      : href === '#/' + parts[0];
    a.classList.toggle('active', active);
  });
  window.scrollTo(0, 0);
}

function wireControls() {
  document.querySelectorAll('[data-toggle]').forEach((group) => {
    group.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.chartType = btn.getAttribute('data-value');
        renderRoute();
      });
    });
  });
  const regionFilter = document.getElementById('region-filter');
  if (regionFilter) {
    regionFilter.addEventListener('change', () => {
      state.regionFilter = regionFilter.value;
      renderRoute();
    });
  }
  document.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-sort');
      if (state.regionsSort.key === key) state.regionsSort.dir *= -1;
      else state.regionsSort = { key, dir: key === 'name' || key === 'region' ? 1 : -1 };
      renderRoute();
    });
  });
  const search = document.getElementById('explorer-search');
  if (search) {
    search.addEventListener('input', () => {
      state.explorerQuery = search.value;
      renderRoute();
      const again = document.getElementById('explorer-search');
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    });
  }
  document.querySelectorAll('[data-exsort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-exsort');
      if (state.explorerSort.key === key) state.explorerSort.dir *= -1;
      else state.explorerSort = { key, dir: 1 };
      renderRoute();
    });
  });
}
