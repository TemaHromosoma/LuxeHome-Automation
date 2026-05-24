import http        from 'k6/http';
import { check }   from 'k6';
import { BASE_URL } from '../data/test-data.js';

export const url = (path) => `${BASE_URL}${path}`;

export function checkResponse(res, expectedStatus = 200, tag = '') {
  const label = tag ? `[${tag}] ` : '';

  return check(res, {
    [`${label}status is ${expectedStatus}`]: r => r.status === expectedStatus,
    [`${label}response < 500ms`]:            r => r.timings.duration < 500,
    [`${label}body is not empty`]:           r => r.body && r.body.length > 0,
    [`${label}no "error" in body`]:          r => !r.body.includes('"error"'),
  });
}

export function cartJourney() {
  const pdpRes = http.get(url('/'));
  checkResponse(pdpRes, 200, 'PDP');

  const cartRes = http.get(url('/'));
  checkResponse(cartRes, 200, 'Cart page');
}
