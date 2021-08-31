// @flow
import _ from 'lodash';
import messages from 'constants/Messages';

export function translateOptions(options: Array<any>, intl: any) {
    const translatedOptions = [];
    options.forEach(t => {
        if (t.text) {
            const translatedItem = {
                ...t,
                text: intl.formatMessage(messages[t.text])
            };
            translatedOptions.push(translatedItem);
        } else if (t.title) {
            const translatedItem = {
                ...t,
                title: intl.formatMessage(messages[t.title])
            };
            translatedOptions.push(translatedItem);
        }
    }, this);
    return translatedOptions;
}

export const invtRelationshipOptions = [
    { value: 'employee', title: 'intlEmployee' },
    { value: 'supplier', title: 'intlSuppliers' },
    { value: 'operation', title: 'intlOperations' }
];

export const invtRoleOptions = [
    { value: 'GROUP_ORG_ADMINISTRATORS', title: 'intlAdmins' },
    {
        value: 'GROUP_ORG_MASTER_AUTHENTICATORS',
        title: 'intlMasterAuthenticators'
    },
    { value: 'GROUP_ORG_SPECIFICATION_REVIEWERS', title: 'intlReviewers' },
    { value: 'GROUP_ORG_EMPLOYEES', title: 'intlEmployees' }
];
