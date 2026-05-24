import { sleep }             from 'k6';
import { THRESHOLDS_STRICT } from './config/thresholds.js';
import { THINK_TIME }        from './data/test-data.js';
import { cartJourney }       from './helpers/utils.js';

export const options = {
  scenarios: {
    ramp_to_10_users: {
      executor:  'ramping-vus',
      startVUs:  0,
      stages: [
        { duration: '20s', target: 5  },
        { duration: '40s', target: 10 },
        { duration: '20s', target: 0  },
      ],
    },
  },
  thresholds: THRESHOLDS_STRICT,
};

export default function () {
  cartJourney();
  sleep(THINK_TIME);
}
