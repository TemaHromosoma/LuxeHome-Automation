import { Page } from '@playwright/test';
import { homeUrl } from '../test_data/constants';

export async function goToRandomProduct(page: Page): Promise<void> {
    await page.goto(homeUrl, { waitUntil: 'networkidle' });
    await page.getByTestId('btn-shop-now').click();

    const grid = page.getByTestId('search-results-grid');
    await grid.waitFor({ state: 'visible', timeout: 5000 });

    const products = grid.locator('> *');
    const count = await products.count();
    const randomIndex = Math.floor(Math.random() * count);
    await products.nth(randomIndex).click();

    await page.getByTestId('btn-add-to-cart').waitFor({ state: 'visible' });
}
