import { type Locator, type Page } from '@playwright/test';
import { baseUrl } from '../test_data/constants';

export class ProductPage {
  readonly page: Page;
  readonly productCategory: Locator;
  readonly stockInfo: Locator;
  readonly quantityInput: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly increaseQuantityButton: Locator;
  readonly addToCartButton: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCategory = page.getByTestId('product-category');
    this.stockInfo = page.getByTestId('stock-info');
    this.quantityInput = page.getByTestId('input-quantity');
    this.decreaseQuantityButton = page.getByTestId('btn-qty-decrease');
    this.increaseQuantityButton = page.getByTestId('btn-qty-increase');
    this.addToCartButton = page.getByTestId('btn-add-to-cart');
    this.cartButton = page.getByTestId('btn-nav-cart');
  }

  async gotoProduct(productId: number) {
    await this.page.goto(`${baseUrl}/#/product/${productId}`);
  }

  async increaseQuantity(clicks: number) {
    for (let i = 0; i < clicks; i++) {
      await this.increaseQuantityButton.click();
    }
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async openCart() {
    await this.cartButton.click();
  }
}
