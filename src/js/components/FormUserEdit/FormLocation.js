// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'redux-form';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import {
    renderTextField,
    renderTextFieldVisibility,
    renderButtonToggle
} from 'constants/FormFields';
import FieldTimezone from 'components/FieldTimezone';

import FieldCountrySelector from 'components/FieldCountrySelector';
import CollapsableLine from 'components/CollapsableLine';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape,
    change: Function
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const FormLocation = ({ intl, change }: Props) => {
    const classes = useStyles();

    return (
        <CollapsableLine
            classes={classes}
            title={intl.formatMessage(messages.locationLabel)}
            isOpen
        >
            <Grid container spacing={4}>
                <Grid item xl={6} md={6} sm={12} xs={12}>
                    <Field
                        name="state"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextFieldVisibility}
                        placeholder={intl.formatMessage(messages.state)}
                        label={intl.formatMessage(messages.state)}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xl={5} md={5} sm={11} xs={11}>
                    <Field
                        type="text"
                        name="country"
                        fullWidth
                        autoComplete="new-password"
                        component={FieldCountrySelector}
                        change={change}
                        label={intl.formatMessage(messages.country)}
                    />
                </Grid>
                <Grid item xs={1} style={{ marginLeft: '-2em' }}>
                    <Field
                        name="countryVisible"
                        label={intl.formatMessage(messages.publicVisibility)}
                        component={renderButtonToggle}
                        stateTrue={<Visibility />}
                        stateFalse={<VisibilityOff />}
                    />
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12}>
                    <Field
                        name="address"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextField}
                        placeholder={intl.formatMessage(messages.lineOne)}
                        label={intl.formatMessage(messages.lineOne)}
                        className={classes.textField}
                    />

                    <Field
                        name="companyaddress2"
                        fullWidth
                        autoComplete="new-password"
                        style={{ marginTop: '1em' }}
                        component={renderTextField}
                        placeholder={intl.formatMessage(messages.lineTwo)}
                        label={intl.formatMessage(messages.lineTwo)}
                        className={classes.textField}
                    />
                </Grid>

                <Grid item xl={6} md={6} sm={12} xs={12}>
                    <Field
                        name="city"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextField}
                        label={intl.formatMessage(messages.townCity)}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xl={6} md={6} sm={12} xs={12}>
                    <Field
                        name="postalcode"
                        fullWidth
                        autoComplete="new-password"
                        component={renderTextField}
                        label={intl.formatMessage(messages.postalcode)}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xl={6} md={6} sm={12} xs={12}>
                    <Field
                        name="timezone"
                        fullWidth
                        autoComplete="new-password"
                        change={change}
                        component={FieldTimezone}
                        label={intl.formatMessage(messages.timezone)}
                    />
                </Grid>
            </Grid>
        </CollapsableLine>
    );
};

export default injectIntl(FormLocation);
