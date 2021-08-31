// @flow
import React from 'react';
import messages from 'constants/Messages';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router';
import type { Node } from 'react';
import { FormName } from 'redux-form';

/**
 * Gather required field messages
 * @param {*} requiredFields
 * @param {*} values
 */
export const checkRequiredFields = (
    requiredFields: Array<string>,
    values: Object
) => {
    const errors = {};

    _.forEach(requiredFields, field => {
        if (_.isEmpty(values[field])) {
            errors[field] = 'required';
        }
    });

    return errors;
};

/**
 * Render form main message
 * @param {*} errors
 */
export const renderFormErrorMessage = (
    errors: Array<string>,
    style: Object,
    hideParagraph?: boolean
) => {
    if (!errors || errors.length === 0) return null;

    return (
        <div id="error" className="serverError" style={style}>
            {!hideParagraph && (
                <p>
                    <FormattedMessage {...messages.errorFormMessage} />
                </p>
            )}
            <ul>
                {_.map(errors, (e, index) => {
                    return <li key={index}>{e}</li>;
                })}
            </ul>
        </div>
    );
};

export type InitArgs = {
    pick?: Array<string>,
    omit?: Array<string>
};

export const initFromQuery = (args?: InitArgs) => (component: Node) =>
    compose(
        withRouter,
        mapProps(props => {
            let queryProps = _.get(props, 'location.query', {});
            if (args && args.pick) {
                queryProps = _.pick(queryProps, args.pick);
            }

            if (args && args.omit) {
                queryProps = _.pick(queryProps, args.omit);
            }

            return {
                ...props,
                initialValues: {
                    ...props.initialValues,
                    ...queryProps
                }
            };
        })
    )(component);

/**
 * @desc get form values for registered fields
 * @param formData - redux form state tobe parsed
 */
export const getFormValues = (
    formData: Object,
    includeHidden?: boolean
): Object => {
    if (!formData) return {};
    return _.pick(
        formData.values,
        _.reject(_.keys(formData.registeredFields), key => {
            const { ref } = formData.registeredFields[key];
            if (!includeHidden && _.get(ref, 'current.type') === 'hidden')
                return true;

            return false;
        })
    );
};

type Reducer = (Object, Object) => Object;
/**
 * @desc Extends redux form reducer to add refs to registered components on mount
 */
export const extendFormReducer = (reducer: Reducer) => (
    state: Object,
    action: Object
) => {
    const result = reducer(state, action);
    if (action.type === '@@redux-form/REGISTER_FIELD' && action.meta.form) {
        const {
            meta: { form },
            payload: { name }
        } = action;
        return {
            ...result,
            [form]: {
                ...result[form],
                registeredFields: {
                    ...result[form].registeredFields,
                    [name]: {
                        ...result[form].registeredFields[action.payload.name],
                        ref: action.payload.ref || null
                    }
                }
            }
        };
    }
    return result;
};

/**
 * @arg WrappedComponent - react component
 * @desc pass down `formName` from context as prop
 */
export const withFormName = (WrappedComponent: any) => (props: any) => (
    <FormName>
        {({ form }) => <WrappedComponent {...props} formName={form} />}
    </FormName>
);
