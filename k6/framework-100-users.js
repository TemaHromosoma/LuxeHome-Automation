import http                  from 'k6/http';
import { sleep }             from 'k6';
import { THRESHOLDS_STRESS } from './config/thresholds.js';
import { PAGES, THINK_TIME } from './data/test-data.js';
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
  checkResponse(http.get(url(PAGES.home)),   200, 'Home');
  sleep(THINK_TIME);

  checkResponse(http.get(url(PAGES.cart)),   200, 'Cart');
  sleep(THINK_TIME);

  cartJourney();
  sleep(THINK_TIME);
}