// @flow
import React, { useState } from 'react';
import { reduxForm, Form } from 'redux-form';
import { compose, mapProps } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { withRouter } from 'react-router';

import { errorMessages } from 'utils/errorMessages';
import { initFromQuery } from 'utils/form';
import TaskTitle from 'components/TaskTitle';
import WorkflowPackage from 'components/WorkflowPackage';
import ButtonLinear from 'components/ButtonLinear';
import FieldKeyboardDatePicker from 'components/FieldKeyboardDatePicker';
import FieldFileUpload from 'components/FieldFileUpload';
import { renderTextField, renderHiddenField } from 'constants/FormFields';
import Field from 'components/Field';
import FieldRow from 'components/FieldRow';

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape,
    handleSubmit: Function
};
type Props = {
    onSubmit: Function,
    onFinish: Function
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

// @todo THIS COMES FROM WORKFLOW METADATA
const certificateType = 'brcAuditOne'; // Used in the reduxForm `initialvalues` object
const certificateTypeUpload = 'brcUploadAuditOne';

/**
 *  Task Supplier Certification Intake Component
 *  @desc
 *  @author
 */
const TaskSupplierCertificationIntake = ({
    intl,
    handleSubmit,
    onSubmit,
    onFinish
}: Props) => {
    // Component style
    const classes = useStyles();

    /**
     * Change values for privacy option
     */
    const [radioValue, setRadioValue] = useState('private');

    const handleChange = (event: SyntheticEvent<HTMLElement>) => {
        // $FlowFixMe
        setRadioValue(event.target.value);
    };

    /**
     *  Change choice for has certificate
     */
    const [hasCertificate, setHasCertificate] = useState(null);

    const handleChangeChoice = (hasCert: any) => {
        setHasCertificate(hasCert);
    };

    /**
     *  Render certificate upload form
     */
    const renderCertificateForm = () => {
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
                 ${intl.formatMessage(messages[certificateTypeUpload])}`}
                />

                <FieldRow>
                    <Field
                        name="name"
                        data-cy="name"
                        fullWidth
                        component={renderTextField}
                        label={intl.formatMessage(messages.certIntakeName)}
                    />
                </FieldRow>
                <FieldRow>
                    <Field
                        disablePast
                        label={intl.formatMessage(messages.certExpirationDate)}
                        name="certificateExpirationDate"
                        component={FieldKeyboardDatePicker}
                    />
                </FieldRow>

                <Typography variant="subtitle1" style={{ marginBottom: 0 }}>
                    {intl.formatMessage(messages.certIntakePrivacyOptions)}
                </Typography>
                <FormControl
                    component="fieldset"
                    className={classes.formControl}
                >
                    <RadioGroup
                        aria-label="date range picker"
                        name="certPrivacyOptions"
                        value={radioValue}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            value="private"
                            control={<Radio />}
                            label={intl.formatMessage(
                                messages.certIntakePrivacyOptionsPrivate
                            )}
                            className={classes.radioButton}
                        />
                        <FormControlLabel
                            value="public"
                            control={<Radio />}
                            label={intl.formatMessage(
                                messages.certIntakePrivacyOptionsPublic
                            )}
                            className={classes.radioButton}
                        />
                    </RadioGroup>
                </FormControl>

                <Typography variant="subtitle1">
                    {intl.formatMessage(messages.certIntakeUploadReportCert)}
                </Typography>
                <FieldRow>
                    <Field
                        name="documents"
                        label={intl.formatMessage(messages.name)}
                        component={FieldFileUpload}
                        fullWidth
                        documentPicker
                        multiple
                    />
                </FieldRow>

                <ButtonLinear
                    backText="certIntakeBack"
                    onBack={() => handleChangeChoice(null)}
                    nextText="certIntakeComplete"
                    onNext={() => {
                        onFinish();
                    }}
                />
            </Form>
        );
    };

    /**
     *  User does not have a certificate
     */
    const renderRfpForm = () => {
        return <div>Not developed yet. Roadmap item</div>;
    };

    if (hasCertificate) return renderCertificateForm();

    if (hasCertificate === false) return renderRfpForm();

    /**
     *  Render user options to choose
     *  if they have certificate or not
     */
    return (
        <div className={classes.root}>
            <TaskTitle
                title={`${intl.formatMessage(messages.requirement)}${` `}
                ${intl.formatMessage(messages[certificateType])}`}
            />
            <Typography variant="body1" paragraph>
                {intl.formatMessage(messages.certIntakeAuthenticateIntro)}
            </Typography>
            {/* Attached documents */}
            <WorkflowPackage />
            {/* Expiration */}
            <Typography
                variant="subtitle1"
                style={{ color: '#333', margin: '3em 0' }}
            >
                {intl.formatMessage(messages.certIntakeYesNo)}
            </Typography>

            <ButtonLinear
                backText="no"
                onBack={() => handleChangeChoice(false)}
                nextText="yes"
                onNext={() => handleChangeChoice(true)}
            />
        </div>
    );
};

/**
 * Define the form definition
 * Includes:
 * default values
 * dependency injection
 */
export const FormName = 'taskSupplierCertificationIntake';
export default compose(
    initFromQuery(),
    withRouter,
    mapProps(props => ({
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
)(TaskSupplierCertificationIntake);
