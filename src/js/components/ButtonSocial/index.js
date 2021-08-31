// @flow
import React from 'react';
import { isURL } from 'validator';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    button: {
        background: '#BBBBBB',
        '&:hover': {
            backgroundColor: '#BBBBBB'
        },
        '& .MuiSvgIcon-root': {
            color: '#F5F5F5'
        },
        margin: '0.3em'
    }
});

const SocialButton = ({
    href,
    type
}: {
    href: string,
    type: 'twitter' | 'facebook' | 'linkedin'
}) => {
    const classes = useStyles();

    return (
        <IconButton
            className={classes.button}
            onClick={() => {
                if (isURL(href, { require_protocol: true })) {
                    window.open(href, '_blank');
                } else if (
                    isURL(`https://${href}`, { require_protocol: true })
                ) {
                    window.open(`https://${href}`, '_blank');
                }
            }}
        >
            {type === 'twitter' && <TwitterIcon />}
            {type === 'facebook' && <FacebookIcon />}
            {type === 'linkedin' && <LinkedInIcon />}
        </IconButton>
    );
};

export default SocialButton;
