// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'redux-form';
import { calculateStrength } from 'utils/people';
import { renderTextField } from 'constants/FormFields';
import PasswordVerify from 'components/PasswordVerify';
import PasswordStrength from 'components/PasswordStrength';
import CollapsableLine from 'components/CollapsableLine';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    formValues: Object,
    userName: string
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const FormCredentials = (props: Props) => {
    const classes = useStyles();
    const { formValues, userName, intl } = props;
    const user = localStorage.getItem('auth:username') || 'null';
    const selfEditing = user === userName;

    const currentPassword = formValues ? formValues.newPassword : '';
    const passwordVerification = formValues ? formValues.verifyPassword : '';

    return (
        <CollapsableLine
            classes={classes}
            title={intl.formatMessage(messages.credentialsLabel)}
            isOpen
        >
            <Grid container spacing={4}>
                {selfEditing && (
                    <Grid item xl={12} md={12} sm={12} xs={12}>
                        <Field
                            name="oldPassword"
                            type="password"
                            component={renderTextField}
                            fullWidth
                            label={intl.formatMessage(messages.oldPassword)}
                            className={classes.textField}
                        />
                    </Grid>
                )}
                <Grid item xl={6} md={6} sm={12} xs={12}>
                    <Field
                        name="newPassword"
                        type="password"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextField}
                        label={intl.formatMessage(messages.newPassword)}
                        className={classes.textField}
                        hideErrors
                        placeholder="*******"
                    />
                    <PasswordStrength
                        strength={calculateStrength(currentPassword)}
                    />
                </Grid>
                <Grid item xl={6} md={6} sm={12} xs={12}>
                    <Field
                        name="verifyPassword"
                        type="password"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextField}
                        label={intl.formatMessage(messages.verifyPassword)}
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
        </CollapsableLine>
    );
};

export default injectIntl(FormCredentials);
