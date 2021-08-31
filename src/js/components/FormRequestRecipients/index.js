// @flow
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form } from 'redux-form';
import Typography from '@material-ui/core/Typography';
import FieldRow from 'components/FieldRow';
import messages from 'constants/Messages';
import { errorMessages } from 'utils/errorMessages';
import FieldCompanySelector from 'components/FieldCompanySelector';
import { initFromQuery } from 'utils/form';

import { FormName as IssuerForm } from 'components/FormRequestIssuer';

type DefaultProps = {
    intl: intlShape,
    handleSubmit: Function,
    // eslint-disable-next-line react/no-unused-prop-types
    issuer: Object
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
const validate = (values: Object, props: Props) => {
    const errors = {};
    const { issuer } = props;
    const recipients = _.get(values, 'recipients', '');
    if (recipients.length === 0) {
        errors.recipients = 'required';
    } else if (
        _.filter(recipients, r => {
            return (
                r ===
                _.get(issuer, 'issuingEntity', '').replace('_ORGANIZATION', '')
            );
        }).length > 0
    ) {
        errors.recipients = 'recipientEqualsIssuer';
    }
    return errorMessages(errors);
};

/**
 * Form for request basic details
 * Used in create request wizard and request table actions
 * @param {*} props
 */
const FormRequestRecipients = ({ intl, handleSubmit, onSubmit }: Props) => {
    const classes = useStyles();
    return (
        <Form
            className={classes.root}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Typography variant="h6" color="textSecondary" gutterBottom>
                {intl.formatMessage(messages.requestRecipients)}
            </Typography>
            <FieldRow>
                <Field
                    multiple
                    fullWidth
                    name="recipients"
                    label={`${intl.formatMessage(messages.selectRecipients)}*`}
                    component={FieldCompanySelector}
                />
            </FieldRow>
        </Form>
    );
};

const mapStateToProps = state => ({
    issuer: _.get(state.form[IssuerForm], 'values')
});

/**
 * Define the form definition
 * Includes:
 * default values
 * dependency injection
 */
export const FormName = 'requestRecipients';
export default compose(
    initFromQuery(),
    // $FlowFixMe
    connect(mapStateToProps),
    reduxForm({
        form: FormName,
        validate,
        enableReinitialize: true
    }),
    injectIntl
)(FormRequestRecipients);
