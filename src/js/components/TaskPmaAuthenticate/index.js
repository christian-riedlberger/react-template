// @flow
import React from 'react';
import { compose, mapProps } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form } from 'redux-form';
import { renderHiddenField } from 'constants/FormFields';
import Typography from '@material-ui/core/Typography';
import FieldRow from 'components/FieldRow';
import messages from 'constants/Messages';
import { errorMessages } from 'utils/errorMessages';
import TaskTitle from 'components/TaskTitle';
import WorkflowPackage from 'components/WorkflowPackage';
import FieldKeyboardDatePicker from 'components/FieldKeyboardDatePicker';
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
const TaskPmaAuthenticate = ({ intl, handleSubmit, onSubmit }: Props) => {
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

            <TaskTitle
                title={`${intl.formatMessage(messages.requirement)}${` `}
                ${intl.formatMessage(messages[certificateType])}`}
            />
            <Typography variant="body1" paragraph>
                {intl.formatMessage(messages.pmaAuthenticateIntro)}
            </Typography>
            {/* Attached documents */}
            <WorkflowPackage />
            {/* Expiration */}
            <Typography variant="subtitle1">
                {intl.formatMessage(messages.pmaAuthenticateExpire)}
            </Typography>
            <FieldRow>
                <Field
                    disablePast
                    label={intl.formatMessage(messages.expires)}
                    name="prop_cert_expirationDate"
                    component={FieldKeyboardDatePicker}
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
export const FormName = 'taskPmaAuthenticate';
export default compose(
    initFromQuery(),
    mapProps((props: Props) => ({
        ...props,
        initialValues: {
            taskId: props.router.params.taskId.split('$')[1],
            prop_transitions: 'Next'
        }
    })),
    reduxForm({
        form: FormName,
        validate,
        enableReinitialize: true
    }),
    injectIntl
)(TaskPmaAuthenticate);
