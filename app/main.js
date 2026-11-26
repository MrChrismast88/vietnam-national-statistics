// VietStats bootstrap — wires the year selector and the hash router.
// No network requests: every page, figure and chart lives in app/.

import { YEARS, LATEST_YEAR } from './data.js';
import { renderRoute, state } from './views.js';

const yearSelect = document.getElementById('year-select');

yearSelect.addEventListener('change', () => {
  const picked = Number(yearSelect.value);
  state.year = YEARS.includes(picked) ? picked : LATEST_YEAR;
  renderRoute();
});

window.addEventListener('hashchange', renderRoute);

renderRoute();
