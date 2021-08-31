import Page from './core/Page';

export default class Dashboard extends Page {
    constructor() {
        super(element(by.xpath('//h1[text()="Live Exams"]')));
    }
}
