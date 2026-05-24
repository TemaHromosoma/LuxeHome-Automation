import http                    from 'k6/http';
import { sleep }               from 'k6';
import { THRESHOLDS_MODERATE } from './config/thresholds.js';
import { PAGE, THINK_TIME }    from './data/test-data.js';
import { url, checkResponse, cartJourney } from './helpers/utils.js';

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

    pdp_users: {
      executor:         'constant-arrival-rate',
      rate:             2,
      timeUnit:         '1s',
      duration:         '2m',
      preAllocatedVUs:  5,
      maxVUs:           20,
      exec:             'pdpScenario',
    },
  },
  thresholds: THRESHOLDS_MODERATE,
};

export function browsingScenario() {
  checkResponse(http.get(url(PAGE)), 200, 'Browse');
  sleep(THINK_TIME);
}

export function cartScenario() {
  cartJourney();
  sleep(THINK_TIME);
}

export function pdpScenario() {
  checkResponse(http.get(url(PAGE)), 200, 'PDP');
  sleep(THINK_TIME);
}

export default function () {}
