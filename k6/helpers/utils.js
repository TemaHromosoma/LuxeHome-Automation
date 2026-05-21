import http        from 'k6/http';
import { check }   from 'k6';
import { BASE_URL, PRODUCTS } from '../data/test-data.js';

export const url = (path) => `${BASE_URL}${path}`;
export const JSON_HEADERS = { 'Content-Type': 'application/json' };
export const randomProduct = () =>
  PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];

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
  const product = randomProduct();

  const pdpRes = http.get(url(`/product/${product.id}`));
  checkResponse(pdpRes, 200, 'PDP');

  const addRes = http.post(
    url('/api/cart'),
    JSON.stringify({ productId: product.id, qty: 1 }),
    { headers: JSON_HEADERS }
  );
  checkResponse(addRes, 201, 'Add to cart');

  const cartRes = http.get(url('/cart'));
  checkResponse(cartRes, 200, 'Cart page');

  const qtyRes = http.patch(
    url(`/api/cart/items/${product.id}`),
    JSON.stringify({ qty: 2 }),
    { headers: JSON_HEADERS }
  );
  checkResponse(qtyRes, 200, 'Qty update');

  const promoRes = http.post(
    url('/api/cart/promo'),
    JSON.stringify({ code: __ENV.PROMO_CODE || 'LUXE10' }),
    { headers: JSON_HEADERS }
  );
  checkResponse(promoRes, 200, 'Promo code');

  return { product, responses: [pdpRes, addRes, cartRes, qtyRes, promoRes] };
}
