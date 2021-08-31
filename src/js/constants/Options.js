// @flow
import _ from 'lodash';

export function translateOptions(
    options: Array<any>,
    intlProvider: any,
    messages: any
) {
    const translatedOptions = _.cloneDeep(options);
    translatedOptions.forEach(t => {
        const translatedItem = { ...t };
        if (translatedItem.text) {
            translatedItem.text = intlProvider.formatMessage(
                messages[translatedItem.text]
            );
        } else if (translatedItem.title) {
            translatedItem.title = intlProvider.formatMessage(
                messages[translatedItem.title]
            );
        }
    }, this);
    return translatedOptions;
}

export const requestTypeOptions = [
    { value: 'activiti$compliantWorkflow', text: 'optionSpecification' }
];

export const certificateTypeOptions = [
    {
        name: 'brcAuditOne',
        secondary: 'descriptionBrcAuditOne',
        value: 'brcAuditOne'
    }
];
