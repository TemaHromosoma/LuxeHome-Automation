import http                    from 'k6/http';
import { sleep }               from 'k6';
import { THRESHOLDS_MODERATE } from './config/thresholds.js';
import { PAGES, THINK_TIME }   from './data/test-data.js';
import { url, checkResponse, cartJourney, randomProduct } from './helpers/utils.js';

export const options = {
  scenarios: {
    browsing_users: {
      executor:         'constant-vus',
      vus:              5,
      duration:         '2m',
      exec:             'browsingScenario',
    },

    cart_users: {
      executor:         'ramping-vus',
      startVUs:         0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m',  target: 10 },
        { duration: '30s', target: 0  },
      ],
      exec:             'cartScenario',
    },

    checkout_users: {
      executor:         'constant-arrival-rate',
      rate:             2,
      timeUnit:         '1s',
      duration:         '2m',
      preAllocatedVUs:  5,
      maxVUs:           20,
      exec:             'checkoutScenario',
    },
  },
  thresholds: THRESHOLDS_MODERATE,
};

export function browsingScenario() {
  const product = randomProduct();

  checkResponse(http.get(url(PAGES.home)),              200, 'Browse:Home');
  sleep(THINK_TIME);

  checkResponse(http.get(url(PAGES.pdp(product.id))),   200, 'Browse:PDP');
  sleep(THINK_TIME);

  checkResponse(http.get(url(PAGES.search)),            200, 'Browse:Search');
  sleep(THINK_TIME);
}

export function cartScenario() {
  cartJourney();
  sleep(THINK_TIME);
}

export function checkoutScenario() {
  checkResponse(http.get(url(PAGES.cart)),              200, 'Checkout:Cart');
  sleep(THINK_TIME);

  checkResponse(http.get(url(PAGES.checkout)),          200, 'Checkout:Page');
  sleep(THINK_TIME);
}

export default function () {}
