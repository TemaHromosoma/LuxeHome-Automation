import { test, expect } from '@playwright/test';
import { goToRandomProduct } from '../helpers/navigation';
import { cartUrl } from '../test_data/constants';

test.describe('Checking the promo codes', () => {

    test.beforeEach(async ({ page }) => {
        await goToRandomProduct(page);
        await page.getByTestId('btn-add-to-cart').click();
        await page.goto(cartUrl);
    });

    test('Checking with valid promo code', async ({ page }) => {

        const promoInput = page.getByTestId('input-promo-code');
        const applyButton = page.getByTestId('btn-apply-promo');
        const totalPriceElement = page.getByTestId('cart-total');

        const initialPrice = parseFloat((await totalPriceElement.innerText()).replace(/[^0-9.]/g, ''));

        await promoInput.fill('SAVE10');
        await applyButton.click();
        await expect(page.getByText('Promo code applied! 10%')).toBeVisible();

        const updatedPrice = parseFloat((await totalPriceElement.innerText()).replace(/[^0-9.]/g, ''));
        expect(updatedPrice).toBeCloseTo(initialPrice * 0.9, 2);
    });

    test('Checking with invalid promo code', async ({ page }) => {

        const promoInput = page.getByTestId('input-promo-code');
        const applyButton = page.getByTestId('btn-apply-promo');
        const totalPriceElement = page.getByTestId('cart-total');

        const initialPriceText = await totalPriceElement.innerText();

        await promoInput.fill('1');
        await applyButton.click();
        await expect(page.locator('#promo-message')).toBeVisible();

        expect(await totalPriceElement.innerText()).toBe(initialPriceText);
    });
});
