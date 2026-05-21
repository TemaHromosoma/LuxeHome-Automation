import { test, expect } from '../fixtures/test_fixtures';

test.describe('Accessibility Scan - WCAG 2.1 A & AA', () => {

    test('Accessibility violations', async ({ cartPage, page }, testInfo) => {

        const results = await cartPage.accessibilityCheck();

        if (results.violations.length > 0) {

            await testInfo.attach('AccessibilityViolations', {

                body: JSON.stringify(results.violations, null, 2),

                contentType: 'application/json'
            });

            const screenshot = await page.screenshot({ fullPage: true });

            await testInfo.attach('AccessibilityViolationsImage', {

                body: screenshot,

                contentType: 'image/png'
            });
        }
        
        expect(results.violations.length, `All accessibility violations are written in the JSON file ${"AccessibilityViolations"}`).toBe(0);
    });

});