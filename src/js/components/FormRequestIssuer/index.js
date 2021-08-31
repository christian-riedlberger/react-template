// @flow
import React from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form } from 'redux-form';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import messages from 'constants/Messages';
import { errorMessages } from 'utils/errorMessages';
import FieldMyOrganizations from 'components/FieldMyOrganizations';
import FieldRow from 'components/FieldRow';
import { initFromQuery } from 'utils/form';
import { FormName as RecipientsForm } from 'components/FormRequestRecipients';

type DefaultProps = {
    intl: intlShape,
    handleSubmit: Function,
    // eslint-disable-next-line react/no-unused-prop-types
    recipients: Object
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
    const { recipients } = props;
    const issuer = _.get(values, 'issuingEntity', '');
    if (issuer.length === 0) {
        errors.issuingEntity = 'required';
    } else if (
        recipients &&
        _.filter(recipients.recipients, r => {
            return r === issuer.replace('_ORGANIZATION', '');
        }).length > 0
    ) {
        errors.issuingEntity = 'recipientEqualsIssuer';
    }
    return errorMessages(errors);
};

/**
 * Form for request basic details
 * Used in create request wizard and request table actions
 * @param {*} props
 */
const FormRequestIssuer = ({ intl, handleSubmit, onSubmit }: Props) => {
    const classes = useStyles();
    return (
        <Form
            className={classes.root}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Typography variant="h6" color="textSecondary" gutterBottom>
                {intl.formatMessage(messages.requestIssuer)}
            </Typography>

            <FieldRow>
                <Grid container spacing={2} direction="row">
                    <Grid item xs={6}>
                        <Field
                            fullWidth
                            name="issuingEntity"
                            label={`${intl.formatMessage(
                                messages.selectOrganization
                            )}*`}
                            component={FieldMyOrganizations}
                        />
                    </Grid>
                </Grid>
            </FieldRow>
        </Form>
    );
};

const mapStateToProps = state => ({
    recipients: _.get(state.form[RecipientsForm], 'values')
});

/**
 * Define the form definition
 * Includes:
 * default values
 * dependency injection
 */
export const FormName = 'requestIssuer';
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
)(FormRequestIssuer);
