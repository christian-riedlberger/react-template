// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AvatarOrgPopover from 'components/AvatarOrgPopover';
import Typography from '@material-ui/core/Typography';
import Card from 'components/Card';
import type { Organization } from 'types/groupTypes';

type DefaultProps = {};

type Props = {
    organization: Organization
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
    orgIcon: {
        marginTop: '-5em',
        '& .MuiAvatar-root': {
            width: 100,
            height: 100
        },
        paddingBottom: '1em'
    }
});

const Banner = (props: Props) => {
    const { organization } = props;
    const { displayName, address, city, country, postalcode } = organization;
    const classes = useStyles();

    return (
        <div className="banner-section">
            <Card className={classes.card}>
                <div className={classes.banner} />

                <AvatarOrgPopover
                    className={classes.orgIcon}
                    shortName={organization.shortName}
                    disablePopover
                />
                <Typography
                    variant="h5"
                    component="h2"
                    className={classes.title}
                >
                    {displayName}
                </Typography>
                <Typography
                    variant="h5"
                    component="h2"
                    className={classes.address}
                >
                    {`${address} ${city}, ${postalcode}, ${country}`}
                </Typography>
            </Card>
        </div>
    );
};

export default Banner;
