const waitUntilDisplayedTimeout = 5000;

export default class Page {
    constructor(selector) {
        this.selector = selector;
    }

    checkSelectorExist() {
        if (this.selector === undefined) {
            throw new TypeError(`Class '${this.constructor.name}' selector is not passed`);
        }
    }

    isDisplayed() {
        this.checkSelectorExist();

        return ExpectedConditions.visibilityOf(this.selector)();
    }

    waitUntilDisplayed() {
        this.checkSelectorExist();

        browser.wait(
            () => this.isDisplayed(),
            waitUntilDisplayedTimeout,
            `Failed while waiting for "${this.selector.locator()}" of page '${this.constructor.name}' to display.`
        );
    }
}
