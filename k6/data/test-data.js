export const BASE_URL   = __ENV.BASE_URL   || 'https://daristr.github.io/luxehome-qa';
export const THINK_TIME = Number(__ENV.THINK_TIME) || 1;

export const PRODUCTS = [
  { id: 1, name: 'Nordic Comfort Sofa',     price: 1299.00, stock: 5,  isSale: false },
  { id: 2, name: 'Velvet Accent Armchair',  price: 449.00,  stock: 8,  isSale: false },
  { id: 4, name: 'King Platform Bed',       price: 649.00,  stock: 3,  isSale: true  },
  { id: 6, name: 'Ceramic Vase Collection', price: 69.00,   stock: 20, isSale: true  },
];

export const PAGE = '/';
