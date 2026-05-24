import { expect, type Locator, type Page } from '@playwright/test';
import { cartUrl } from '../test_data/constants';

export class CartPage {
  readonly page: Page;
  readonly baseURL: string;
  readonly cartQuantityInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = cartUrl;
    this.cartQuantityInput = page.getByTestId('input-cart-quantity');
  }

  async goto() {
    await this.page.goto(this.baseURL, { waitUntil: 'domcontentloaded' });
  }

  async expectQuantity(quantity: number) {
    await expect(this.cartQuantityInput).toHaveValue(String(quantity));
  }
}
