// @flow
import _ from 'lodash';
import { connect } from 'react-redux';
import { withProps } from 'recompose';
import { touch } from 'redux-form';

/**
 * @container FieldCheckboxSelector
 * @description Redux adapter to get touched & error states for use in render error labels
 */
export const fieldArrayErrorSelector: Object = connect(
    (state: Object, props: Object): Object => ({
        error: _.get(
            state,
            `form.${props.meta.form}.syncErrors.${props.fields.name}`
        ),
        touched:
            !_.isEmpty(
                _.get(
                    state,
                    `form.${props.meta.form}.fields.${props.fields.name}`
                )
            ) ||
            _.get(
                state,
                `form.${props.meta.form}.fields.${props.fields.name}[NaN]`
            )
    })
);

/**
 * @container FormWizard
 * @description Forces redux form to re-validate values onSubmit. Allows for
 * validation to occur on change of props.
 * @arg form - form name in redux state
 * @arg validate - validation function used in form
 */
export const reduxFormValidation = (form: string, validate: Function) =>
    withProps(parentProps => ({
        ...parentProps,
        onSubmit: vals => {
            const errors = validate(vals, parentProps);

            // eslint-disable-next-line compat/compat
            return new Promise((resolve, reject) => {
                if (_.isEmpty(errors)) {
                    parentProps.onSubmit(vals);
                    resolve(vals);
                } else {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject({ ...errors });
                }
            });
        },
        onSubmitFail: (_1, _2, errors, props) => {
            if (errors) {
                props.dispatch(touch(form, ..._.keys(errors)));
                props.dispatch({
                    type: '@@redux-form/UPDATE_SYNC_ERRORS',
                    meta: { form },
                    payload: { syncErrors: errors }
                });
            }
        }
    }));

/**
 * @container Form
 * @description Connect form to active report object for initialization
 */
export const initReportData: Object = connect((state): Object => ({
    initialValues: {
        ..._.get(state, 'reports.activeReport', {}),
        ..._.get(state, 'reports.activeReport.domains', {})
    }
}));
