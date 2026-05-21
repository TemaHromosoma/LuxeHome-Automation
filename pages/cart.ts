import { Page, Locator } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { resultTags } from '../test_data/results_data';

export class CartPage {

    readonly baseURL: string;
    readonly page: Page;

    constructor (page: Page) {

        this.page = page;
        this.baseURL = 'https://daristr.github.io/luxehome-qa/#/cart';
    }

    async goto () {

        await this.page.goto(this.baseURL, { waitUntil: 'domcontentloaded' });
    }

    async accessibilityCheck() {

        const results = await new AxeBuilder({ page: this.page }).withTags(resultTags).analyze();
        return results;
    }
}