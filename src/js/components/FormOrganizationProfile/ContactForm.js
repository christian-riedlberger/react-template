// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import CollapsableLine from 'components/CollapsableLine';
import messages from 'constants/Messages';
import Field from 'components/Field';
import { renderTextFieldVisibility } from 'constants/FormFields';

type DefaultProps = {
    intl: intlShape
};

type Props = {} & DefaultProps;

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

const ContactForm = ({ intl }: Props) => {
    const classes = useStyles();

    return (
        <CollapsableLine
            classes={classes}
            title={intl.formatMessage(messages.contact)}
            isOpen
        >
            <Grid container item direction="row" spacing={2}>
                <Grid item xs={10}>
                    <Grid item container direction="row" spacing={2}>
                        <Grid item xs={6}>
                            <Field
                                name="phone"
                                label={intl.formatMessage(messages.phone)}
                                component={renderTextFieldVisibility}
                            />
                            <Field
                                fullWidth
                                name="email"
                                label={intl.formatMessage(messages.email)}
                                component={renderTextFieldVisibility}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Field
                                fullWidth
                                name="twitter"
                                label={intl.formatMessage(messages.twitter)}
                                component={renderTextFieldVisibility}
                            />
                            <Field
                                fullWidth
                                name="facebook"
                                label={intl.formatMessage(messages.facebook)}
                                component={renderTextFieldVisibility}
                            />
                            <Field
                                fullWidth
                                name="linkedin"
                                label={intl.formatMessage(messages.linkedin)}
                                component={renderTextFieldVisibility}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </CollapsableLine>
    );
};

export default injectIntl(ContactForm);
