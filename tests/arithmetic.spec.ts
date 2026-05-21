import { test, expect } from '@playwright/test';
import { goToRandomProduct } from '../helpers/navigation';

test.describe('Different values in item quantity input field', () => {
    const cases = [
        { input: '1', description: 'valid standard value' },
        { input: '0', description: 'zero value' },
        { input: '-1', description: 'negative value' },
        { input: 'abc', description: 'non-numeric, letter string' },
        { input: '%^#', description: 'non-numeric, special characters string' },
        { input: '1.5', description: 'decimal float value' },
        { input: '9999999', description: 'extreme large number' },
        { input: 'stockValue', description: 'max available value' },
        { input: 'stockValuePlus1', description: 'max available value + 1' },
        { input: ' ', description: 'empty space string' }
    ];

    for (const data of cases) {
        test(`Checking quantity input with ${data.description} ("${data.input}")`, async ({ page }) => {

            await goToRandomProduct(page);
            await page.getByTestId('btn-add-to-cart').click();

            let finalValue = data.input;
            if (data.input === 'stockValue' || data.input === 'stockValuePlus1') {
                const stockElement = page.getByTestId('stock-info');
                await stockElement.waitFor({ state: 'visible', timeout: 5000 });
                const rawText = await stockElement.innerText();
                const stockValue = parseInt(rawText.replace(/\D/g, ''), 10);

                if (data.input === 'stockValue') 
                    finalValue = stockValue.toString(); 
                else 
                    if (data.input === 'stockValuePlus1') 
                        finalValue = (stockValue + 1).toString(); 
            }

            await page.goto('https://daristr.github.io/luxehome-qa/#/cart');

            const qtyInput = page.getByTestId('input-cart-quantity');
            await qtyInput.click();
            await qtyInput.fill(finalValue);
            await qtyInput.press('Enter');
            if (finalValue < '1' || isNaN(Number(finalValue)) || finalValue > '5') 
                await expect(qtyInput).toHaveValue('1');
            else 
                await expect(qtyInput).toHaveValue(finalValue);
        });
    }
});