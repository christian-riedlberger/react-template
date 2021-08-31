// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from 'components/Card';
import Grid from '@material-ui/core/Grid';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    publicUser: Object
} & DefaultProps;

const useStyles = makeStyles({
    card: {
        width: '100%',
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: '2em'
    },
    title: {
        margin: '0!important',
        fontWeight: '400!important'
    }
});

const Contact = (props: Props) => {
    const { publicUser, intl } = props;
    const {
        telephone,
        mobile,
        email,
        countrycode,
        countrycodeMobile
    } = publicUser;
    const classes = useStyles();

    const showContactSection = telephone || mobile || email;
    if (!showContactSection) return null;

    return (
        <Card className={classes.card}>
            {(telephone || mobile || email) && (
                <Grid item xs={12}>
                    <Typography
                        variant="h5"
                        component="h2"
                        className={classes.title}
                    >
                        {intl.formatMessage(messages.contact)}
                    </Typography>
                    {telephone && (
                        <div style={{ marginBottom: '1em' }}>
                            <Typography variant="body" component="span">
                                {`${intl.formatMessage(messages.phone)}: `}
                            </Typography>
                            <Typography
                                variant="body"
                                component="span"
                                className={classes.contactDetails}
                            >
                                {countrycode || ''}
                                {telephone}
                            </Typography>
                        </div>
                    )}
                    {mobile && (
                        <div style={{ marginBottom: '1em' }}>
                            <Typography variant="body" component="span">
                                {`${intl.formatMessage(
                                    messages.mobileShort
                                )}: `}
                            </Typography>
                            <Typography
                                variant="body"
                                component="span"
                                className={classes.contactDetails}
                            >
                                {countrycodeMobile || ''}
                                {mobile}
                            </Typography>
                        </div>
                    )}
                    {email && (
                        <div>
                            <Typography variant="body" component="span">
                                {`${intl.formatMessage(messages.email)}: `}
                            </Typography>
                            <Typography
                                variant="body"
                                component="span"
                                className={classes.contactDetails}
                            >
                                {email}
                            </Typography>
                        </div>
                    )}
                </Grid>
            )}
        </Card>
    );
};

export default injectIntl(Contact);
