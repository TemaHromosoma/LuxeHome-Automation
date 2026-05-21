export const THRESHOLDS_STRICT = {
  http_req_duration: ['p(95)<500', 'p(99)<1500'],
  http_req_failed:   ['rate<0.01'],
  http_reqs:         ['rate>1'],
};

export const THRESHOLDS_MODERATE = {
  http_req_duration: ['p(95)<1000', 'p(99)<3000'],
  http_req_failed:   ['rate<0.02'],
};

export const THRESHOLDS_STRESS = {
  http_req_duration: ['p(95)<3000'],
  http_req_failed:   ['rate<0.10'],
};
