import { test, expect } from '@playwright/test';
import { goToRandomProduct } from '../helpers/navigation';
import { cartUrl } from '../test_data/constants';

test('Total & subtotal prices should change according to updated quantity', async ({ page }) => {

    await goToRandomProduct(page);
    await page.getByTestId('btn-add-to-cart').click();
    const stockElement = page.getByTestId('stock-info');
    await stockElement.waitFor({ state: 'visible', timeout: 5000 });
    const stockValue = parseInt((await stockElement.innerText()).replace(/\D/g, ''), 10);

    const randomNumber = Math.floor(Math.random() * stockValue) + 1;
    console.log(`Max in stock: ${stockValue}, the chosen number: ${randomNumber}`);

    await page.goto(cartUrl);

    const qtyInput = page.getByTestId('input-cart-quantity');
    const itemPrice = page.getByTestId('cart-item-price').first();
    const totalPrice = page.getByTestId('cart-total').last();

    await expect(itemPrice).toBeVisible();
    const initialPriceClean = parseFloat((await itemPrice.innerText()).replace(/[^0-9.]/g, ''));

    await qtyInput.click();
    await qtyInput.fill(randomNumber.toString());
    await qtyInput.press('Enter');
    await expect(qtyInput).toHaveValue(randomNumber.toString());

    const expectedTotal = initialPriceClean * randomNumber;
    const finalPriceClean = parseFloat((await totalPrice.innerText()).replace(/[^0-9.]/g, ''));
    expect(finalPriceClean).toBe(expectedTotal);
});
