// @flow
import React from 'react';
import _ from 'lodash';
import messages from 'constants/Messages';
import { FormattedMessage } from 'react-intl';

/**
 * Render error messages to form validation
 * by using intl
 * @param {*} errors
 * @param {*} intl
 */
export const errorMessages = (errors: Object) => {
    const intErrors = { ...errors };

    // if no localized found, use what was passed
    _.forEach(errors, (err, key) => {
        if (_.isString(err) && messages[err]) {
            intErrors[key] = <FormattedMessage {...messages[err]} />;
        } else {
            intErrors[key] = err;
        }
    });
    return intErrors;
};

/**
 * Set required fields as required
 * by using intl
 * @param {*} errors
 * @param {*} intl
 */
export const getRequiredMessages = (
    requiredNames: Array<string>,
    values: Object
) => {
    const errors = {};

    requiredNames.forEach(field => {
        if (!values[field]) {
            errors[field] = 'required';
        }
    });

    return errors;
};

/**
 * Map field array for required
 * @param {*} requiredFields
 * @param {*} props
 * @param {*} values
 */
type Fields = {
    prop: string,
    value: string
};
export const mapFieldArrayRequired = (
    requiredFields: Array<Fields>,
    props: Object,
    values: Object
) => {
    const errors = {};

    _.forEach(requiredFields, field => {
        const value = values[field.value]
            ? values[field.value].toString()
            : null;

        if (_.get(props, field.prop) && (_.isEmpty(values) || _.isEmpty(value)))
            errors[field.value] = 'required';
    });

    return errors;
};
