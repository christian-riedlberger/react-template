// @flow
import React from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { AVATAR } from 'constants/ServiceURI';
import Typography from '@material-ui/core/Typography';
import Card from 'components/Card';

const AVATAR_SIZE = '7em';

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
    },
    address: {
        margin: '0!important',
        fontSize: '15px!important'
    },
    banner: {
        height: '5em',
        margin: '-19px -16px 12px -19px',
        backgroundColor: '#cecece',
        backgroundImage: 'url(/css/img/icons/green-pattern.png)',
        backgroundSize: '120%',
        backgroundPosition: '-6.5em'
    },
    avatar: {
        height: '5em',
        width: '5em',
        marginTop: '-4em',
        marginBottom: '1em',
        '& .MuiAvatar-root': {
            width: 100,
            height: 100
        }
    },
    contactWrapper: {
        display: 'flex',
        justifyContent: 'space-between'
    }
});

const Banner = (props: Props) => {
    const { publicUser, intl } = props;
    const {
        userName,
        firstName,
        lastName,
        state,
        jobtitle,
        country,
        groups
    } = publicUser;
    const classes = useStyles();

    return (
        <div className="banner-section">
            <Card className={classes.card}>
                <div className={classes.banner} />

                <Avatar
                    src={AVATAR(userName)}
                    alt="Avatar"
                    className={classes.avatar}
                    style={{
                        height: AVATAR_SIZE,
                        width: AVATAR_SIZE
                    }}
                />

                <Typography
                    variant="h5"
                    component="h2"
                    className={classes.title}
                >
                    {_.capitalize(firstName)} {_.capitalize(lastName)}
                </Typography>

                <div className={classes.contactWrapper}>
                    <div>
                        <Typography
                            variant="h5"
                            component="h2"
                            className={classes.address}
                        >
                            {`${
                                jobtitle
                                    ? intl.formatMessage(messages.jobTitleAt, {
                                        jobTitle: _.startCase(jobtitle)
                                    })
                                    : intl.formatMessage(messages.jobTitleAt, {
                                        jobTitle: 'Works'
                                    })
                            } ${_.join(groups, ', ')}`}
                        </Typography>
                    </div>
                    <div>
                        {(country || state) && (
                            <Typography
                                variant="body"
                                component="p"
                                style={{ textAlign: 'right' }}
                            >
                                {_.join(_.compact([state, country]), ', ')}
                            </Typography>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default injectIntl(Banner);
