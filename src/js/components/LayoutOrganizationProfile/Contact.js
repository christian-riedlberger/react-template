// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import messages from 'constants/Messages';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonSocial from 'components/ButtonSocial';
import Card from 'components/Card';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    showMeSection: boolean,
    phoneVisible: boolean,
    phone: string,
    emailVisible: boolean,
    email: string,
    linkedin: string,
    linkedinVisible: boolean,
    twitter: string,
    twitterVisible: boolean,
    facebook: string,
    facebookVisible: boolean,
    show: Function
} & DefaultProps;

const useStyles = makeStyles({
    header: {
        fontWeight: '400!important',
        fontSize: '15px!important'
    }
});

const Contact = ({
    showMeSection,
    phoneVisible,
    phone,
    emailVisible,
    email,
    linkedinVisible,
    linkedin,
    twitter,
    twitterVisible,
    facebook,
    facebookVisible,
    show,
    intl
}: Props) => {
    const classes = useStyles();

    return (
        showMeSection && (
            <div className="showMe-section">
                <Card>
                    <Grid item container direction="row">
                        {(phone || email) && (
                            <Grid item xs={6}>
                                {show(phoneVisible, [phone]) && (
                                    <React.Fragment>
                                        <Typography
                                            variant="h5"
                                            component="h2"
                                            className={classes.header}
                                        >
                                            {intl.formatMessage(
                                                messages.contact
                                            )}
                                        </Typography>
                                        <div style={{ marginTop: '1em' }}>
                                            <Grid container>
                                                <Grid item xs={3}>
                                                    <Typography
                                                        variant="body"
                                                        component="p"
                                                    >
                                                        {intl.formatMessage(
                                                            messages.phone
                                                        )}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Typography
                                                        variant="body"
                                                        component="p"
                                                    >
                                                        {phone}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </React.Fragment>
                                )}
                                {show(emailVisible, [email]) && (
                                    <React.Fragment>
                                        <div style={{ marginTop: '.5em' }}>
                                            <Grid container>
                                                <Grid item xs={3}>
                                                    <Typography
                                                        variant="body"
                                                        component="p"
                                                    >
                                                        {intl.formatMessage(
                                                            messages.email
                                                        )}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Typography
                                                        variant="body"
                                                        component="p"
                                                    >
                                                        {email}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </React.Fragment>
                                )}
                            </Grid>
                        )}
                        {(twitter || facebook || linkedin) && (
                            <Grid item xs={6}>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    className={classes.header}
                                >
                                    {intl.formatMessage(messages.social)}
                                </Typography>
                                {show(twitterVisible, [twitter]) && twitter && (
                                    <ButtonSocial
                                        type="twitter"
                                        href={twitter}
                                    />
                                )}
                                {show(linkedinVisible, [linkedin]) &&
                                    linkedin && (
                                    <ButtonSocial
                                        type="linkedin"
                                        href={linkedin}
                                    />
                                )}
                                {show(facebookVisible, [facebook]) &&
                                    facebook && (
                                    <ButtonSocial
                                        type="facebook"
                                        href={facebook}
                                    />
                                )}
                            </Grid>
                        )}
                    </Grid>
                </Card>
            </div>
        )
    );
};

export default injectIntl(Contact);
