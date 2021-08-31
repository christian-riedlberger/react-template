// @flow
import { change, arrayRemove } from 'redux-form';
import store from '../store';
import _ from 'lodash';
import messages from 'constants/Messages';

/**
 *  Collection filters (collection)
 * @type {[*]}
 */
export function translateFilters(
    filters: Array<any>,
    intlProvider: any,
    messages: any
) {
    const translatedFilters = [];

    filters.forEach(filterItem => {
        const translatedItem = {
            ...filterItem,
            label: intlProvider.formatMessage(messages[filterItem.label]),
            value: filterItem.value
        };
        translatedFilters.push(translatedItem);
    }, this);
    return translatedFilters;
}

/**
 * Filters for dates
 * @type {[*]}
 */
export const dateFilters = [
    { label: 'filterAll', value: 'all' },
    { label: 'filterMonth', value: 'month' },
    { label: 'filterYear', value: 'year' },
    { label: 'filterRange', value: 'range' }
];

/**
 * Filters for charts
 * @type {[*]}
 */
export const chartFilters = [
    { label: 'Pie Chart', value: 'PieChart' },
    { label: 'Bar Chart', value: 'BarChart' },
    { label: 'Line Chart', value: 'LineChart' }
];

/**
 * Filters for report form notification periods
 * @type {[*]}
 */
export const periodFilters = [
    {
        name: 'selection1Week',
        value: 0.25
    },
    {
        name: 'selection1Month',
        value: 1
    },
    {
        name: 'selection3Month',
        value: 3
    },
    {
        name: 'selection1Year',
        value: 12
    }
];

/**
 * Filters for report form sensitivity levels
 * @type {[*]}
 */
export const thresholdFilters = [
    {
        name: 'selectionWarnings',
        value: 1
    },
    {
        name: 'selectionInfractions',
        value: 2
    }
];

/**
 * Filters for report form retention timespans
 * @type {[*]}
 */
export const retentionFilters = [
    {
        name: 'selection1Year',
        value: 12
    },
    {
        name: 'selection1Month',
        value: 1
    },
    {
        name: 'selection3Month',
        value: 3
    },
    {
        name: 'selection1Week',
        value: 0.25
    }
];

/**
 * Filters for requests statuses
 */
export const requestStatusFilters = [
    'pending',
    'compliant',
    'notCompliant',
    'na'
];

/**
 * Filters for requests Progress levels
 */
export const requestProgressFilters = [
    'notStarted',
    'inprogress',
    'responded',
    'overdue'
];

export const renderTagValues = (
    FormName: string,
    formValues: Object,
    intl: any
) => {
    const newTags = [];
    const keys = _.keys(formValues);
    _.forEach(keys, key => {
        switch (key) {
            // Value: string
            // Components: renderTextField
            case 'term':
                {
                    if (formValues[key] !== null)
                        newTags.push({
                            text: `${intl.formatMessage(messages[key])}: ${
                                formValues[key]
                            }`,
                            onClick: () => {
                                store.dispatch(change(FormName, key, null));
                            }
                        });
                }
                break;
            // Value: { ..., radioValue: string }
            // Components: DateRangeSelector
            case 'dueDate':
            case 'dateRange':
                {
                    const dateKeys = _.keys(_.get(formValues, key));
                    _.forEach(dateKeys, k => {
                        if (
                            k === 'radioValue' &&
                            _.get(formValues[key], k) !== ''
                        ) {
                            newTags.push({
                                text: `${intl.formatMessage(
                                    messages[key]
                                )}: ${_.get(formValues[key], k)}`,
                                onClick: () => {
                                    store.dispatch(change(FormName, key, null));
                                }
                            });
                        }
                    });
                }
                break;
            // Value: Array<string>
            // Components: FieldStatusList
            case 'status':
            case 'progress':
                _.forEach(formValues[key], (value, index) => {
                    const intlValue =
                        intl.formatMessage(messages[value]) || value;
                    newTags.push({
                        text: `${intl.formatMessage(
                            messages[key]
                        )}: ${intlValue}`,
                        onClick: () => {
                            store.dispatch(arrayRemove(FormName, key, index));
                        }
                    });
                });
                break;

            // Value: { organizations: Array< {shortName: string, displayName: string}: Object >, users: Array< {shortName: string, displayName: string}: Object >}
            // Components: FieldFilterSelector
            case 'assignedBy':
            case 'assignee':
            case 'users':
                if (formValues[key].organizations.length > 0) {
                    _.forEach(formValues[key].organizations, (o, index) => {
                        newTags.push({
                            text: `${intl.formatMessage(
                                messages[key]
                            )}: ${_.get(o, 'displayName')}`,
                            onClick: () => {
                                store.dispatch(
                                    arrayRemove(
                                        FormName,
                                        `${key}.organizations`,
                                        index
                                    )
                                );
                            }
                        });
                    });
                }
                if (formValues[key].users.length > 0) {
                    _.forEach(formValues[key].users, (u, index) => {
                        newTags.push({
                            text: `${intl.formatMessage(
                                messages[key]
                            )}: ${_.get(u, 'displayName')}`,
                            onClick: () => {
                                store.dispatch(
                                    arrayRemove(FormName, `${key}.users`, index)
                                );
                            }
                        });
                    });
                }
                break;
            default:
                break;
        }
    });
    return newTags;
};
