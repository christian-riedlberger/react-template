import Page from './core/Page';
import configuration from '../configuration';

const usernameSelector = by.id('username');
const messageSelector = by.css('.alert');
const passwordSelector = by.id('password');
const signInSelector = by.buttonText('Sign in');

/* eslint class-methods-use-this:"off" */

export default class Login extends Page {

    constructor() {
        super(element(by.id('signin')));
    }

    getPage() {
        browser.manage().window().maximize();

        browser.baseUrl = configuration.baseUrl;
        browser.get('/');
        this.waitUntilDisplayed();
    }

    waitForErrorMessage() {
        return browser.wait(
            () => ExpectedConditions.visibilityOf(this.errorMessage)(),
            5000,
            'No error message appear');
    }

    get errorMessage() {
        return element(messageSelector);
    }

    get username() {
        return element(usernameSelector);
    }

    get password() {
        return element(passwordSelector);
    }

    get signIn() {
        return element(signInSelector);
    }
}
