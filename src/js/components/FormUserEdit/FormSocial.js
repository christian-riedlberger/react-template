// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'redux-form';
import { renderTextFieldVisibility } from 'constants/FormFields';
import CollapsableLine from 'components/CollapsableLine';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const FormSocial = ({ intl }: Props) => {
    const classes = useStyles();

    return (
        <CollapsableLine
            classes={classes}
            title={intl.formatMessage(messages.socialLabel)}
            isOpen
        >
            <Grid container spacing={4}>
                <Grid item xl={12} md={12} sm={12} xs={12}>
                    <Field
                        name="facebook"
                        autoComplete="new-password"
                        component={renderTextFieldVisibility}
                        label={intl.formatMessage(messages.facebook)}
                        className={classes.textField}
                        fullWidth
                    />
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12}>
                    <Field
                        name="twitter"
                        autoComplete="new-password"
                        component={renderTextFieldVisibility}
                        label={intl.formatMessage(messages.twitter)}
                        className={classes.textField}
                        fullWidth
                    />
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12}>
                    <Field
                        name="linkedin"
                        autoComplete="new-password"
                        component={renderTextFieldVisibility}
                        label={intl.formatMessage(messages.linkedin)}
                        className={classes.textField}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </CollapsableLine>
    );
};

export default injectIntl(FormSocial);
