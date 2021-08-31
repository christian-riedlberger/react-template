// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'redux-form';
import {
    renderTextField,
    renderTextFieldVisibility
} from 'constants/FormFields';
import CollapsableLine from 'components/CollapsableLine';

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    initialValues: Object
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const FormDetails = ({ intl, initialValues }: Props) => {
    const classes = useStyles();
    const editMode = initialValues && initialValues.isEditMode;

    return (
        <CollapsableLine
            classes={classes}
            title={intl.formatMessage(messages.personalLabel)}
            isOpen
        >
            <Grid container spacing={4}>
                {!editMode && (
                    <Grid item xl={12} md={12} sm={12} xs={12}>
                        <Field
                            name="userName"
                            fullWidth
                            autoFocus
                            autoComplete="new-password"
                            component={renderTextField}
                            label={intl.formatMessage(messages.userName)}
                            className={classes.textField}
                        />
                    </Grid>
                )}

                <Grid item xl={6} md={6} sm={12} xs={12}>
                    <Field
                        name="firstName"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextField}
                        label={intl.formatMessage(messages.firstName)}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xl={6} md={6} sm={12} xs={12}>
                    <Field
                        name="lastName"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextField}
                        label={intl.formatMessage(messages.lastName)}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12}>
                    <Field
                        name="email"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextFieldVisibility}
                        label={intl.formatMessage(messages.email)}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12}>
                    <Field
                        name="jobtitle"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextFieldVisibility}
                        label={intl.formatMessage(messages.jobTitle)}
                        className={classes.textField}
                    />
                </Grid>

                <Grid item xl={4} md={4} sm={12} xs={12}>
                    <Field
                        name="countrycode"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextField}
                        label={intl.formatMessage(messages.countrycode)}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xl={8} md={8} sm={12} xs={12}>
                    <Field
                        name="telephone"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextFieldVisibility}
                        label={intl.formatMessage(messages.phone)}
                        className={classes.textField}
                    />
                </Grid>

                <Grid item xl={4} md={4} sm={12} xs={12}>
                    <Field
                        name="countrycodeMobile"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextField}
                        label={intl.formatMessage(messages.countrycode)}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xl={8} md={8} sm={12} xs={12}>
                    <Field
                        name="mobile"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextFieldVisibility}
                        label={intl.formatMessage(messages.mobile)}
                        className={classes.textField}
                    />
                </Grid>

                <Grid item xl={12} md={12} sm={12} xs={12}>
                    <Field
                        name="about"
                        fullWidth
                        component={renderTextFieldVisibility}
                        placeholder={intl.formatMessage(
                            messages.aboutMePlaceholder
                        )}
                        label={intl.formatMessage(messages.aboutMe)}
                        className={classes.textField}
                        multiline
                    />
                </Grid>
            </Grid>
        </CollapsableLine>
    );
};

export default injectIntl(FormDetails);
