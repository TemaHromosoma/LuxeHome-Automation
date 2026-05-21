import { test as base } from '@playwright/test';
import { CartPage } from '../pages/cart';

type MyFixtures = {

    cartPage: CartPage;
};

export const test = base.extend<MyFixtures>({

    cartPage: async ({ page }, use) => {

        const cartPage = new CartPage(page);
        await cartPage.goto();
        await use(cartPage);
    }
});

export { expect } from '@playwright/test';