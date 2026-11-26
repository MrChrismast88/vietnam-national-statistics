// VietStats data — Vietnam in Numbers.
// Figures are compiled from the General Statistics Office of Viet Nam,
// Statistical Yearbook 2024 and its published press releases. Where a figure
// is an estimate or a rounded restatement it is marked as such in the text
// that displays it. All values are for the calendar year shown.

export const YEARS = [2020, 2021, 2022, 2023, 2024];
export const LATEST_YEAR = 2024;

export const SOURCE_GSO = 'General Statistics Office of Viet Nam, Statistical Yearbook 2024';
export const SOURCE_GSO_PRESS = 'General Statistics Office of Viet Nam, press release on socio-economic statistics';
export const SOURCE_WB = 'World Bank, World Development Indicators (2024 edition)';
export const SOURCE_MOIT = 'Ministry of Industry and Trade, Viet Nam, export-import report';
export const SOURCE_MOLISA = 'Ministry of Labour, Invalids and Social Affairs, labour survey';
export const SOURCE_MOH = 'Ministry of Health, Viet Nam, health statistics';
export const SOURCE_MOET = 'Ministry of Education and Training, Viet Nam, education statistics';
export const SOURCE_MONRE = 'Ministry of Natural Resources and Environment, Viet Nam';

// Series: value per year, 2020-2024. Units are given next to each series.
export const SERIES = {
  population: {
    label: 'Population', unit: 'million people', source: SOURCE_GSO,
    values: { 2020: 97.58, 2021: 98.51, 2022: 99.46, 2023: 99.90, 2024: 100.30 },
    note: 'Mid-year population. 2024 is the GSO preliminary estimate.'
  },
  gdp: {
    label: 'Gross domestic product (nominal)', unit: 'billion USD', source: SOURCE_GSO,
    values: { 2020: 346.3, 2021: 366.1, 2022: 408.8, 2023: 429.7, 2024: 476.3 },
    note: 'Nominal GDP converted at the average annual exchange rate.'
  },
  gdpGrowth: {
    label: 'Real GDP growth', unit: '% per year', source: SOURCE_GSO_PRESS,
    values: { 2020: 2.9, 2021: 2.6, 2022: 8.0, 2023: 5.1, 2024: 7.1 },
    note: 'Real growth at constant 2010 prices.'
  },
  gdpPerCapita: {
    label: 'GDP per capita', unit: 'USD', source: SOURCE_GSO,
    values: { 2020: 3550, 2021: 3718, 2022: 4109, 2023: 4300, 2024: 4749 },
    note: 'Nominal GDP divided by mid-year population.'
  },
  cpi: {
    label: 'Consumer price inflation (CPI, annual average)', unit: '% per year', source: SOURCE_GSO_PRESS,
    values: { 2020: 3.2, 2021: 1.8, 2022: 3.2, 2023: 3.3, 2024: 3.6 },
    note: 'Average CPI change over the year.'
  },
  exports: {
    label: 'Exports of goods', unit: 'billion USD', source: SOURCE_MOIT,
    values: { 2020: 282.7, 2021: 336.3, 2022: 371.9, 2023: 354.7, 2024: 405.5 },
    note: 'Merchandise exports, free-on-board value.'
  },
  imports: {
    label: 'Imports of goods', unit: 'billion USD', source: SOURCE_MOIT,
    values: { 2020: 262.7, 2021: 332.2, 2022: 360.7, 2023: 326.4, 2024: 381.6 },
    note: 'Merchandise imports, cost-insurance-freight value.'
  },
  unemployment: {
    label: 'Unemployment rate (ages 15+)', unit: '%', source: SOURCE_MOLISA,
    values: { 2020: 2.5, 2021: 3.2, 2022: 2.3, 2023: 2.3, 2024: 2.2 },
    note: 'Share of the labour force without work and available for work.'
  },
  labourForce: {
    label: 'Labour force (ages 15+)', unit: 'million people', source: SOURCE_MOLISA,
    values: { 2020: 54.6, 2021: 50.6, 2022: 51.7, 2023: 52.4, 2024: 52.9 },
    note: '2021 dip reflects COVID-19 lockdowns in the third quarter.'
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth', unit: 'years', source: SOURCE_MOH,
    values: { 2020: 73.7, 2021: 73.6, 2022: 73.6, 2023: 74.5, 2024: 74.7 },
    note: 'Average for both sexes.'
  },
  forestCover: {
    label: 'Forest cover', unit: '% of land area', source: SOURCE_MONRE,
    values: { 2020: 42.0, 2021: 42.0, 2022: 42.0, 2023: 42.0, 2024: 42.0 },
    note: 'Share of land area under forest, stable across the period.'
  },
  renewableShare: {
    label: 'Renewables in installed power capacity', unit: '%', source: SOURCE_MONRE,
    values: { 2020: 42.0, 2021: 43.0, 2022: 43.0, 2023: 43.0, 2024: 43.5 },
    note: 'Hydro, wind and solar share of total installed capacity. 2024 is an estimate.'
  }
};

// GDP by sector, share of GDP (%). Source: GSO Statistical Yearbook 2024.
export const SECTORS = {
  2020: [['Agriculture, forestry & fishing', 14.9], ['Industry & construction', 33.7], ['Services', 41.6], ['Net taxes on products', 9.8]],
  2021: [['Agriculture, forestry & fishing', 12.6], ['Industry & construction', 37.9], ['Services', 40.6], ['Net taxes on products', 8.9]],
  2022: [['Agriculture, forestry & fishing', 11.9], ['Industry & construction', 38.3], ['Services', 41.3], ['Net taxes on products', 8.5]],
  2023: [['Agriculture, forestry & fishing', 11.9], ['Industry & construction', 37.6], ['Services', 42.0], ['Net taxes on products', 8.5]],
  2024: [['Agriculture, forestry & fishing', 11.7], ['Industry & construction', 38.0], ['Services', 42.0], ['Net taxes on products', 8.3]]
};

// Age structure, share of population (%). Source: GSO population estimates.
export const AGE_GROUPS = {
  2020: [['0–14 years', 23.4], ['15–64 years', 68.8], ['65 years and over', 7.8]],
  2021: [['0–14 years', 23.2], ['15–64 years', 68.8], ['65 years and over', 8.0]],
  2022: [['0–14 years', 23.0], ['15–64 years', 68.8], ['65 years and over', 8.2]],
  2023: [['0–14 years', 22.8], ['15–64 years', 68.9], ['65 years and over', 8.3]],
  2024: [['0–14 years', 22.6], ['15–64 years', 69.0], ['65 years and over', 8.4]]
};

// Provinces: population (million), GRDP per capita (USD), region, 2024.
// Population and GRDP per capita are GSO figures, rounded; GRDP per capita
// for smaller provinces is an estimate from provincial statistical offices.
export const PROVINCES = [
  { name: 'Ho Chi Minh City', region: 'South East', pop: 9.52, grdpPc: 6920, urban: 79.2 },
  { name: 'Ha Noi', region: 'Red River Delta', pop: 8.72, grdpPc: 6230, urban: 49.1 },
  { name: 'Thanh Hoa', region: 'North Central', pop: 3.72, grdpPc: 2680, urban: 25.4 },
  { name: 'Nghe An', region: 'North Central', pop: 3.41, grdpPc: 2370, urban: 19.8 },
  { name: 'Dong Nai', region: 'South East', pop: 3.36, grdpPc: 5810, urban: 44.6 },
  { name: 'Binh Duong', region: 'South East', pop: 2.82, grdpPc: 6840, urban: 82.1 },
  { name: 'Hai Phong', region: 'Red River Delta', pop: 2.09, grdpPc: 5980, urban: 46.8 },
  { name: 'An Giang', region: 'Mekong Delta', pop: 1.86, grdpPc: 2190, urban: 34.0 },
  { name: 'Can Tho', region: 'Mekong Delta', pop: 1.25, grdpPc: 3840, urban: 70.1 },
  { name: 'Da Nang', region: 'South Central Coast', pop: 1.22, grdpPc: 5120, urban: 87.4 },
  { name: 'Lam Dong', region: 'Central Highlands', pop: 1.31, grdpPc: 2840, urban: 38.6 },
  { name: 'Quang Ninh', region: 'North East', pop: 1.36, grdpPc: 7240, urban: 66.3 },
  { name: 'Khanh Hoa', region: 'South Central Coast', pop: 1.25, grdpPc: 4210, urban: 45.9 },
  { name: 'Hue', region: 'North Central', pop: 1.15, grdpPc: 2610, urban: 49.0 },
  { name: 'Dak Lak', region: 'Central Highlands', pop: 1.89, grdpPc: 2150, urban: 26.5 },
  { name: 'Bac Ninh', region: 'Red River Delta', pop: 1.48, grdpPc: 7890, urban: 28.3 },
  { name: 'Hai Duong', region: 'Red River Delta', pop: 1.94, grdpPc: 4020, urban: 34.2 },
  { name: 'Quang Ngai', region: 'South Central Coast', pop: 1.24, grdpPc: 3120, urban: 22.9 },
  { name: 'Tien Giang', region: 'Mekong Delta', pop: 1.78, grdpPc: 2680, urban: 17.3 },
  { name: 'Long An', region: 'Mekong Delta', pop: 1.72, grdpPc: 3690, urban: 20.4 },
  { name: 'Vinh Long', region: 'Mekong Delta', pop: 1.02, grdpPc: 2490, urban: 19.6 },
  { name: 'Ha Giang', region: 'North East', pop: 0.89, grdpPc: 1480, urban: 16.2 },
  { name: 'Cao Bang', region: 'North East', pop: 0.54, grdpPc: 1620, urban: 22.1 },
  { name: 'Lai Chau', region: 'North West', pop: 0.48, grdpPc: 1510, urban: 17.9 }
];

export const REGIONS = ['All regions', 'Red River Delta', 'North East', 'North West', 'North Central', 'South Central Coast', 'Central Highlands', 'South East', 'Mekong Delta'];

// Education indicators. Source: MOET education statistics.
export const EDUCATION = {
  literacy: { 2020: 95.8, 2021: 95.9, 2022: 96.0, 2023: 96.1, 2024: 96.2 },
  primaryEnrolment: { 2020: 98.9, 2021: 99.0, 2022: 99.1, 2023: 99.1, 2024: 99.2 },
  lowerSecondaryEnrolment: { 2020: 94.8, 2021: 95.2, 2022: 95.6, 2023: 95.9, 2024: 96.1 },
  upperSecondaryEnrolment: { 2020: 72.4, 2021: 73.1, 2022: 74.2, 2023: 74.8, 2024: 75.3 },
  universities: { 2020: 237, 2021: 238, 2022: 240, 2023: 242, 2024: 244 },
  students: { 2020: 1.71, 2021: 1.74, 2022: 1.82, 2023: 1.89, 2024: 1.96 }
};

// Health indicators. Source: MOH health statistics.
export const HEALTH = {
  hospitalBeds: { 2020: 28.5, 2021: 29.0, 2022: 29.5, 2023: 30.1, 2024: 30.6 },
  doctorsPer10k: { 2020: 9.4, 2021: 9.6, 2022: 9.8, 2023: 10.0, 2024: 10.3 },
  healthInsurance: { 2020: 90.9, 2021: 91.1, 2022: 92.0, 2023: 93.3, 2024: 94.3 },
  infantMortality: { 2020: 14.2, 2021: 14.0, 2022: 13.8, 2023: 13.5, 2024: 13.2 }
};

// Environment indicators. Source: MONRE.
export const ENVIRONMENT = {
  co2PerCapita: { 2020: 2.5, 2021: 2.4, 2022: 2.6, 2023: 2.7, 2024: 2.8 },
  cleanWaterRural: { 2020: 88.5, 2021: 89.8, 2022: 91.2, 2023: 92.4, 2024: 93.5 },
  wasteCollected: { 2020: 82.0, 2021: 83.5, 2022: 85.0, 2023: 86.5, 2024: 88.0 }
};

export function changePct(seriesKey, year) {
  const values = SERIES[seriesKey].values;
  const prev = values[year - 1];
  if (prev === undefined || values[year] === undefined) return null;
  return ((values[year] - prev) / prev) * 100;
}

export function formatNumber(value, decimals) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals === undefined ? 1 : decimals,
    maximumFractionDigits: decimals === undefined ? 1 : decimals
  });
}
