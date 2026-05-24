import http                  from 'k6/http';
import { sleep }             from 'k6';
import { THRESHOLDS_STRESS } from './config/thresholds.js';
import { PAGE, THINK_TIME }  from './data/test-data.js';
import { url, checkResponse, cartJourney } from './helpers/utils.js';

export const options = {
  scenarios: {
    stress_to_100: {
      executor:  'ramping-vus',
      startVUs:  0,
      stages: [
        { duration: '20s', target: 20  },
        { duration: '20s', target: 50  },
        { duration: '20s', target: 100 },
        { duration: '20s', target: 100 },
        { duration: '20s', target: 0   },
      ],
    },
  },
  thresholds: THRESHOLDS_STRESS,
};

export default function () {
  checkResponse(http.get(url(PAGE)), 200, 'Page');
  sleep(THINK_TIME);

  cartJourney();
  sleep(THINK_TIME);
}
