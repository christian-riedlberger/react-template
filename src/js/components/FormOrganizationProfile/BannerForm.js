// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import CollapsableLine from 'components/CollapsableLine';
import messages from 'constants/Messages';
import TitleForm from 'components/FormOrganization/TitleForm';
import Field from 'components/Field';
import { renderTextField } from 'constants/FormFields';
import FieldCountrySelector from 'components/FieldCountrySelector';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    change: Function
} & DefaultProps;

const useStyles = makeStyles({
    card: {
        width: '100%',
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: '2em'
    },
    header: {
        fontWeight: '400!important',
        fontSize: '15px!important'
    },
    title: {
        '& .org-avatar': {
            padding: '2em'
        }
    }
});

const BannerForm = ({ change, intl }: Props) => {
    const classes = useStyles();

    return (
        <CollapsableLine
            title={intl.formatMessage(messages.organization)}
            classes={classes}
            isOpen
        >
            <Grid container item direction="row" spacing={2}>
                <Grid item xs={10}>
                    <TitleForm change={change} className={classes.title} />

                    <Field
                        fullWidth
                        name="address"
                        label={intl.formatMessage(messages.address)}
                        component={renderTextField}
                    />
                    <Field
                        fullWidth
                        name="city"
                        label={intl.formatMessage(messages.city)}
                        component={renderTextField}
                    />
                    <Field
                        fullWidth
                        name="postalcode"
                        label={intl.formatMessage(messages.postalcode)}
                        component={renderTextField}
                    />
                    <Field
                        name="country"
                        label={intl.formatMessage(messages.country)}
                        component={FieldCountrySelector}
                    />
                </Grid>
            </Grid>
        </CollapsableLine>
    );
};

export default injectIntl(BannerForm);
