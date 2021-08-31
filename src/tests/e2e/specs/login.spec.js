import Login from '../page-objects/Login';
import Dashboard from '../page-objects/Dashboard';
import configuration from '../configuration';

const login = new Login();
const dashboard = new Dashboard();

describe('login', () => {
    describe('when on login page', () => {
        beforeAll(() => {
            login.getPage();
        });

        it('should display error on empty username and password', async () => {
            expect(login.isDisplayed()).toBe(true);
            const username = await login.username;
            const password = await login.password;
            const signIn = await login.signIn;
            await username.click();
            await username.sendKeys('');
            await password.click();
            await password.sendKeys('');
            await signIn.click();

            await login.waitForErrorMessage();

            const errorMessage = await login.errorMessage;
            const messageText = await errorMessage.getText();
            expect(messageText).toBe('Invalid username or password');
        });

        it('should display dashboard after successful logon', async () => {
            expect(login.isDisplayed()).toBe(true);
            const username = await login.username;
            const password = await login.password;
            const signIn = await login.signIn;
            await username.click();
            await username.sendKeys(configuration.logons.admin.username);
            await password.click();
            await password.sendKeys(configuration.logons.admin.password);
            await signIn.click();
            dashboard.waitUntilDisplayed();
        });
    });
});
