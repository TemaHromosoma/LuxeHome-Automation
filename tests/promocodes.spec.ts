import { test, expect } from '@playwright/test';
import { goToRandomProduct } from '../helpers/navigation';

test.describe('Checking the promo codes', () => {

    test.beforeEach(async ({ page }) => {
        await goToRandomProduct(page);
        await page.getByTestId('btn-add-to-cart').click();
        await page.goto('https://daristr.github.io/luxehome-qa/#/cart');
    });

    test('Checking with valid promo code', async ({ page }) => {
        
        const promoInput = page.getByTestId('input-promo-code');
        const applyButton = page.getByTestId('btn-apply-promo');
        const totalPriceElement = page.getByTestId('cart-total');

        const initialPriceText = await totalPriceElement.innerText();
        const initialPrice = parseFloat(initialPriceText.replace(/[^0-9.]/g, ''));

        await promoInput.fill('SAVE10');
        await applyButton.click();
        await page.waitForTimeout(500);

        const updatedPriceText = await totalPriceElement.innerText();
        const updatedPrice = parseFloat(updatedPriceText.replace(/[^0-9.]/g, ''));

        await expect(updatedPrice).toBeCloseTo(initialPrice * 0.9, 2);
        //await expect(updatedPrice).toBe(initialPrice);
        await expect(page.getByText('Promo code applied! 10%')).toBeVisible();
    });

    test('Checking with invalid promo code', async ({ page }) => {

        const promoInput = page.getByTestId('input-promo-code');
        const applyButton = page.getByTestId('btn-apply-promo');
        const totalPriceElement = page.getByTestId('cart-total');

        const initialPriceText = await totalPriceElement.innerText();

        await promoInput.fill('1');
        await applyButton.click();

        const errorMessage = page.locator('#promo-message');
        await expect(errorMessage).toBeVisible();

        const priceAfterUpdateText = await totalPriceElement.innerText();
        await expect(priceAfterUpdateText).toBe(initialPriceText);
    });
});