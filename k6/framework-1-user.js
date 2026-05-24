import { sleep }             from 'k6';
import { THRESHOLDS_STRICT } from './config/thresholds.js';
import { THINK_TIME }        from './data/test-data.js';
import { cartJourney }       from './helpers/utils.js';

export const options = {
  vus:        1,
  duration:  '30s',
  thresholds: THRESHOLDS_STRICT,
};

export default function () {
  cartJourney();
  sleep(THINK_TIME);
}
