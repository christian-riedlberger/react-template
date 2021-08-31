// @flow
import React from 'react';
import { compose, mapProps } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form } from 'redux-form';
import { renderTextField, renderHiddenField } from 'constants/FormFields';
import Typography from '@material-ui/core/Typography';
import messages from 'constants/Messages';
import { errorMessages } from 'utils/errorMessages';
import TaskTitle from 'components/TaskTitle';
import WorkflowPackage from 'components/WorkflowPackage';
import Information from 'components/Information';
import FieldRow from 'components/FieldRow';
import { initFromQuery } from 'utils/form';

type DefaultProps = {
    intl: intlShape,
    handleSubmit: Function
};

type Props = {
    onSubmit: Function
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {
        '& h6': {
            margin: '1em 0'
        },
        '& .MuiTypography-root.MuiTypography-body1.MuiTypography-paragraph': {
            marginBottom: '25px!important'
        }
    },
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
    },
    label: {
        display: 'flex'
    },
    message: {
        width: '4em',
        height: '2em',
        margin: 'auto',
        paddingTop: 3
    }
}));

/**
 * Form validation
 * @param {*} values
 */
const validate = () => {
    const errors = {};
    return errorMessages(errors);
};

/**
 * Form for request basic details
 * Used in create request wizard and request table actions
 * @param {*} props
 */
const TaskPaymentReview = ({ intl, handleSubmit, onSubmit }: Props) => {
    const classes = useStyles();

    // @todo THIS COMES FROM WORKFLOW METADATA
    const certificateType = 'brcAuditOne';

    return (
        <Form
            className={classes.root}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Field name="taskId" component={renderHiddenField} />
            <Field name="prop_transitions" component={renderHiddenField} />
            <Field
                name="prop_cert_paymentOutcome"
                component={renderHiddenField}
            />

            <TaskTitle
                title={`${intl.formatMessage(messages.requirement)}${` `}
                ${intl.formatMessage(messages[certificateType])}`}
            />

            <Information message="paymentReviewInformation" />

            {/* Attached documents */}
            <WorkflowPackage />
            {/* Expiration */}
            <Typography variant="subtitle1">
                {intl.formatMessage(messages.authenticationFee)}
            </Typography>
            <FieldRow>
                <Field
                    type="text"
                    name="fee"
                    fullWidth
                    disabled
                    component={renderTextField}
                    label={intl.formatMessage(messages.fee)}
                    className={classes.field}
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
export const FormName = 'taskPaymentReview';
export default compose(
    initFromQuery(),
    mapProps((props: Props) => ({
        ...props,
        initialValues: {
            taskId: props.router.params.taskId.split('$')[1],
            prop_transitions: 'Next',
            prop_cert_paymentOutcome: 'paid',
            fee: '$ 100.00'
        }
    })),
    reduxForm({
        form: FormName,
        validate,
        enableReinitialize: true
    }),
    injectIntl
)(TaskPaymentReview);
