import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { resultTags } from '../test_data/results_data';
import { cartUrl } from '../test_data/constants';
import { goToRandomProduct } from '../helpers/navigation';

async function checkAccessibility(page: Page, testInfo: TestInfo) {
    const results = await new AxeBuilder({ page }).withTags(resultTags).analyze();

    if (results.violations.length > 0) {
        await testInfo.attach('AccessibilityViolations', {
            body: JSON.stringify(results.violations, null, 2),
            contentType: 'application/json'
        });
        await testInfo.attach('AccessibilityViolationsImage', {
            body: await page.screenshot({ fullPage: true }),
            contentType: 'image/png'
        });
    }

    expect(results.violations.length, `All accessibility violations are written in the JSON file ${"AccessibilityViolations"}`).toBe(0);
}

test.describe('Accessibility Scan - WCAG 2.1 A & AA', () => {

    test('Cart page', async ({ page }, testInfo) => {
        await page.goto(cartUrl, { waitUntil: 'domcontentloaded' });
        await checkAccessibility(page, testInfo);
    });

    test('Product page', async ({ page }, testInfo) => {
        await goToRandomProduct(page);
        await checkAccessibility(page, testInfo);
    });

});
