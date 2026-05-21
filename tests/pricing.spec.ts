import { test, expect } from '@playwright/test';
import { goToRandomProduct } from '../helpers/navigation';

test('Product price should remain unchanged after updating quantity', async ({ page }) => {

    await goToRandomProduct(page);
    await page.getByTestId('btn-add-to-cart').click();
    const stockElement = page.getByTestId('stock-info');
    await stockElement.waitFor({ state: 'visible', timeout: 5000 });
    const rawText = await stockElement.innerText();
    const stockValue = parseInt(rawText.replace(/\D/g, ''), 10);

    const randomNumber = Math.floor(Math.random() * stockValue) + 1;
    console.log(`Max in stock: ${stockValue}, the chosen number: ${randomNumber}`);

    await page.goto('https://daristr.github.io/luxehome-qa/#/cart');

    const qtyInput = page.getByTestId('input-cart-quantity');
    const itemPrice = page.getByTestId('cart-item-price').first(); 
    const totalPrice = page.getByTestId('cart-total').last();

    await expect(itemPrice).toBeVisible();
    const initialPriceText = await itemPrice.innerText();
    const initialPriceClean = parseFloat(initialPriceText.replace(/[^0-9.]/g, '')); 

    await qtyInput.click();
    await qtyInput.fill(randomNumber.toString());
    await qtyInput.press('Enter');
    await expect(qtyInput).toHaveValue(randomNumber.toString());
    await page.waitForTimeout(500); 

    const expectedTotal = initialPriceClean * randomNumber;
    //const priceAfterUpdate = await itemPrice.innerText();
    const finalPriceText = await totalPrice.innerText();
    const finalPriceClean = parseFloat(finalPriceText.replace(/[^0-9.]/g, ''));
    await expect(finalPriceClean).toBe(expectedTotal);

    await expect(totalPrice).not.toHaveText(initialPriceText); 
});