// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';
import messages from 'constants/Messages';
import FieldRow from 'components/FieldRow';
import { renderTextField } from 'constants/FormFields';
import FieldCountrySelector from 'components/FieldCountrySelector';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    change: Function
} & DefaultProps;

const useStyles = makeStyles({
    field: {}
});

const DetailForm = (props: Props) => {
    const { intl, change } = props;
    const classes = useStyles();

    return (
        <div>
            <FieldRow>
                <Field
                    type="text"
                    name="address"
                    fullWidth
                    required
                    helperText=""
                    autoComplete="new-password"
                    component={renderTextField}
                    label={intl.formatMessage(messages.address)}
                    className={classes.field}
                />
            </FieldRow>
            <FieldRow>
                <Field
                    type="text"
                    name="city"
                    fullWidth
                    required
                    helperText=""
                    autoComplete="new-password"
                    component={renderTextField}
                    label={intl.formatMessage(messages.city)}
                    className={classes.field}
                />
            </FieldRow>

            <FieldRow>
                <Field
                    type="text"
                    name="country"
                    required
                    helperText=""
                    autoComplete="new-password"
                    component={FieldCountrySelector}
                    change={change}
                    label={intl.formatMessage(messages.country)}
                    className={classes.field}
                />
            </FieldRow>
            <FieldRow>
                <Field
                    type="text"
                    name="postalcode"
                    required
                    helperText=""
                    autoComplete="new-password"
                    component={renderTextField}
                    label={intl.formatMessage(messages.postalcode)}
                    className={classes.field}
                />
            </FieldRow>
            <FieldRow>
                <Field
                    type="text"
                    name="phone"
                    fullWidth
                    required
                    helperText=""
                    autoComplete="new-password"
                    component={renderTextField}
                    label={intl.formatMessage(messages.phone)}
                    className={classes.field}
                />
            </FieldRow>
            <FieldRow>
                <Field
                    type="text"
                    name="website"
                    fullWidth
                    autoComplete="new-password"
                    component={renderTextField}
                    label={intl.formatMessage(messages.website)}
                    className={classes.field}
                />
            </FieldRow>
        </div>
    );
};

export default injectIntl(DetailForm);
