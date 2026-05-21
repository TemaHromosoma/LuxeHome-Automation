import http               from 'k6/http';
import { sleep }          from 'k6';
import { THRESHOLDS_STRICT } from './config/thresholds.js';
import { PAGES, THINK_TIME } from './data/test-data.js';
import { url, checkResponse, cartJourney } from './helpers/utils.js';

export const options = {
  vus:        1,
  duration:  '30s',
  thresholds: THRESHOLDS_STRICT,
};

export default function () {
  checkResponse(http.get(url(PAGES.home)), 200, 'Home');
  sleep(THINK_TIME);

  checkResponse(http.get(url(PAGES.search)), 200, 'Search');
  sleep(THINK_TIME);

  cartJourney();
  sleep(THINK_TIME);

  checkResponse(http.get(url(PAGES.checkout)), 200, 'Checkout');
  sleep(THINK_TIME);
}