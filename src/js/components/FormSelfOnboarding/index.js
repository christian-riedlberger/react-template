// @flow
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { Field, reduxForm, Form } from 'redux-form';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import PasswordVerify from 'components/PasswordVerify';
import PasswordStrength from 'components/PasswordStrength';
import Button from 'components/Button';
import Drawer from 'components/Drawer';

import InvitationsContainer from 'containers/InvitationsContainer';
import type { ContainerProps as InvitationProps } from 'containers/InvitationsContainer';

import {
    renderTextField,
    renderCheckbox,
    renderCheckboxWithoutControl
} from 'constants/FormFields';
import { DEFAULT_PASSWORD_STRENGTH } from 'constants/Config';
import messages from 'constants/Messages';

import { renderFormErrorMessage } from 'utils/form';
import { calculateStrength } from 'utils/people';
import { errorMessages } from 'utils/errorMessages';

type DefaultProps = {
    intl: intlShape,
    formValues: Object,
    syncErrors: Object,
    router: Object
} & InvitationProps;

type Props = {
    tempKey: string,
    userName: string,
    workflowId: string
} & DefaultProps;

const validate = values => {
    const errors = {};

    const nonNameChars = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/;

    if (_.isEmpty(_.trim(values.firstName))) {
        errors.firstName = 'usersFirstNameRequired';
    } else if (nonNameChars.test(values.firstName)) {
        errors.firstName = 'usersFirstNameInvalid';
    }

    if (_.isEmpty(_.trim(values.lastName))) {
        errors.lastName = 'usersLastNameRequired';
    } else if (
        !_.isEmpty(_.trim(values.lastName)) &&
        nonNameChars.test(values.lastName)
    ) {
        errors.lastName = 'usersLastNameInvalid';
    }

    if (!values.newPassword) {
        errors.newPassword = 'usersPasswordRequired';
    } else if (values.newPassword && values.newPassword.length < 3) {
        errors.newPassword = 'usersPasswordValidationText';
    } else if (
        calculateStrength(values.newPassword) < DEFAULT_PASSWORD_STRENGTH ||
        (values.newPassword &&
            values.newPassword.length > 0 &&
            calculateStrength(values.newPassword) < DEFAULT_PASSWORD_STRENGTH)
    ) {
        errors.newPassword = 'usersPasswordStrength';
    } else if (
        values.newPassword &&
        values.newPassword !== values.verifyPassword
    ) {
        errors.newPassword = 'usersPasswordVerificationText';
    }

    if (!values.terms) {
        errors.terms = 'termsOfServiceRequired';
    }

    if (!values.privacy) {
        errors.privacy = 'privacyPolicyRequired';
    }

    return errorMessages(errors);
};

export const formName = 'formUserOnboarding';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'block',
        margin: '0 auto',
        maxWidth: '80vw',
        '& .MuiInputBase-root': {
            background: '#ffffff'
        },
        '& h1.MuiTypography-h1': {
            fontSize: '2.5em!important',
            marginBottom: '1em!important',
            marginTop: '1em!important'
        },
        '& .term-wrapper': {
            paddingTop: '1em'
        },
        '& .term-wrapper .MuiButtonBase-root.MuiIconButton-root': {
            padding: 3
        },
        '& .term-wrapper .MuiTypography-root.MuiTypography-body1': {
            paddingBottom: '.5em'
        },
        '& .term-wrapper a.MuiTypography-root.MuiLink-root': {
            color: '#333',
            position: 'relative',
            top: '2px',
            left: '2px',
            fontWeight: 300
        },
        '& .serverError': {
            padding: '1em',
            marginBottom: '1em',
            borderRadius: '4px',
            '& p': {
                marginTop: 0,
                fontWeight: 600
            },
            '& li': {
                listStyle: 'disc',
                marginLeft: '2em',
                lineHeight: '1.4em'
            }
        },
        '& .MuiPaper-root.MuiPaper-elevation1 ': {
            background: '#F4F5F6'
        }
    },
    header: {
        textAlign: 'center',
        borderBottom: '1px solid #e6e6e6',
        paddingBottom: '2em',
        marginTop: '3em;',
        marginBottom: '5em;'
    },
    title: {
        textAlign: 'center'
    },
    paper: {
        justifyContent: 'center',
        margin: `0 auto`,
        padding: theme.spacing(2),
        backgroundColor: '#f2f2f2'
    },
    spacing: {
        marginTop: '1em'
    },
    button: {
        margin: '2em 1em 0 0'
    }
}));

const FormName = 'SelfOnboardingForm';

const FormSelfOnboarding = (props: Props) => {
    const {
        tempKey,
        userName,
        workflowId,
        intl,
        formValues,
        syncErrors,
        updateOnboardingUser,
        OnboardingDone,
        fetchUserProfile,
        router
    } = props;
    const classes = useStyles();
    const [submitErrors, toggleSubmitErrors] = useState(false);
    const [toggleDrawer, setToggleDrawer] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const currentPassword = formValues ? formValues.newPassword : '';
    const passwordVerification = formValues ? formValues.verifyPassword : '';

    const handleSubmit = () => {
        if (!syncErrors) {
            const config = {
                ...formValues,
                oldPassword: tempKey,
                userName,
                workflowId
            };
            updateOnboardingUser(config).then(resp => {
                if (resp.value.status === 200) {
                    OnboardingDone().then(() => router.push(''));
                }
            });
        } else {
            toggleSubmitErrors(true);
        }
    };

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <img
                    src="/css/img/brand/logo-greenfence.svg"
                    alt="Greenfence"
                    width="200"
                />
            </div>
            <Typography className={classes.title} variant="h1">
                {intl.formatMessage(messages.onboardingTitle)}
            </Typography>
            {submitErrors && renderFormErrorMessage(syncErrors)}
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Paper className={classes.paper}>
                    <Grid container spacing={4}>
                        <Grid item xs>
                            <Field
                                required
                                fullWidth
                                name="firstName"
                                component={renderTextField}
                                label={`${intl.formatMessage(
                                    messages.firstName
                                )}`}
                                className={classes.textField}
                            />
                        </Grid>
                        <Grid item xs>
                            <Field
                                required
                                fullWidth
                                name="lastName"
                                component={renderTextField}
                                label={`${intl.formatMessage(
                                    messages.lastName
                                )}`}
                                className={classes.textField}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={4}>
                        <Grid item xs>
                            <Field
                                fullWidth
                                name="newPassword"
                                type="password"
                                component={renderTextField}
                                label={`${intl.formatMessage(
                                    messages.newPassword
                                )}`}
                                className={classes.textField}
                                hideErrors
                                placeholder="*******"
                            />
                            <PasswordStrength
                                strength={calculateStrength(currentPassword)}
                            />
                        </Grid>
                        <Grid item xs>
                            <Field
                                fullWidth
                                name="verifyPassword"
                                type="password"
                                component={renderTextField}
                                label={`${intl.formatMessage(
                                    messages.verifyPassword
                                )}`}
                                className={classes.textField}
                                hideErrors
                                placeholder="*******"
                            />
                            <PasswordVerify
                                password={currentPassword}
                                verificationPassword={passwordVerification}
                            />
                        </Grid>
                    </Grid>

                    <div className="term-wrapper">
                        <Grid container className={classes.spacing}>
                            <Typography>
                                {intl.formatMessage(
                                    messages.onboardingAgreement
                                )}
                            </Typography>
                            <Grid item xs={12}>
                                <Field
                                    required
                                    name="terms"
                                    fullWidth
                                    component={renderCheckboxWithoutControl}
                                    label={
                                        <Link
                                            className={classes.link}
                                            color="secondary"
                                            onClick={() =>
                                                setToggleDrawer(
                                                    'termsOfService'
                                                )
                                            }
                                        >
                                            {intl.formatMessage(
                                                messages.termsOfService
                                            )}
                                        </Link>
                                    }
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    required
                                    name="privacy"
                                    fullWidth
                                    component={renderCheckboxWithoutControl}
                                    label={
                                        <Link
                                            className={classes.link}
                                            color="secondary"
                                            onClick={() =>
                                                setToggleDrawer('privacyPolicy')
                                            }
                                        >
                                            {intl.formatMessage(
                                                messages.privacyPolicy
                                            )}
                                        </Link>
                                    }
                                    className={classes.textField}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Paper>
                <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                >
                    <div className={classes.button}>
                        <Button
                            onClick={handleSubmit}
                            text="onboardingSubmit"
                        />
                    </div>
                </Grid>
            </Form>
            <Drawer
                title={
                    toggleDrawer.length > 0
                        ? intl.formatMessage(messages[`${toggleDrawer}`])
                        : ''
                }
                noButton
                open={toggleDrawer.length > 0}
                onClose={() => setToggleDrawer('')}
                width={400}
            />
        </div>
    );
};

export default compose(
    InvitationsContainer(),
    withRouter,
    reduxForm({
        form: FormName,
        validate
    }),
    injectIntl,
    // $FlowFixMe
    connect((state: Object) => {
        return {
            formValues: state.form[FormName].values,
            syncErrors: state.form[FormName].syncErrors
        };
    })
)(FormSelfOnboarding);
