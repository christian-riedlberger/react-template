// @flow
import React from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form } from 'redux-form';
import Typography from '@material-ui/core/Typography';
import FieldRow from 'components/FieldRow';

import {
    renderTextField,
    renderMultiLineTextField,
    renderHiddenField
} from 'constants/FormFields';
import messages from 'constants/Messages';
import { errorMessages } from 'utils/errorMessages';
import { initFromQuery } from 'utils/form';
import FieldCustom from 'components/Field';

type DefaultProps = {
    intl: intlShape,
    handleSubmit: Function
};

type Props = {
    onSubmit: Function
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        color: theme.palette.primary.dark
    },
    field: {
        '& label::first-letter': {
            textTransform: 'uppercase'
        },
        width: 200,
        display: 'block'
    },
    dense: {
        marginTop: '2em'
    }
}));

/**
 * Form validation
 * @param {*} values
 */
function validate(values: Object) {
    const errors = {};

    if (_.get(values, 'name', '').length <= 3) {
        errors.name = 'nameLengthInvalid';
    }

    if (_.get(values, 'name', '').length === 0) {
        errors.name = 'required';
    }

    if (_.get(values, 'name', '').length > 50) {
        errors.name = 'nameLengthMaximumExceeded';
    }

    return errorMessages(errors);
}

/**
 * Form for request basic details
 * Used in create request wizard and request table actions
 * @param {*} props
 */
const FormRequestBasicDetails = (props: Props) => {
    // $FlowFixMe
    const { intl, handleSubmit, onSubmit } = props;
    const classes = useStyles();

    return (
        <Form
            className={classes.root}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Typography variant="h6" color="textSecondary" gutterBottom>
                {intl.formatMessage(messages.requestTitle)}
            </Typography>
            <FieldCustom name="workflowId" component={renderHiddenField} />

            <FieldRow style={{ width: '70%' }}>
                <Field
                    fullWidth
                    name="name"
                    autoFocus
                    component={renderTextField}
                    label={`${intl.formatMessage(messages.name)}*`}
                    type="1"
                />
            </FieldRow>
            <FieldRow>
                <Field
                    fullWidth
                    name="description"
                    component={renderMultiLineTextField}
                    rows={10}
                    label={intl.formatMessage(messages.description)}
                />
            </FieldRow>
        </Form>
    );
};

/**
 * Define the form definition
 * Includes:
 * default values
 * dependency injection
 */
export const FormName = 'requestBasicDetails';
export default compose(
    initFromQuery(),
    reduxForm({
        form: FormName,
        validate,
        enableReinitialize: true
    }),
    injectIntl
)(FormRequestBasicDetails);
