// @flow
import _ from 'lodash';
import React from 'react';
import { withRouter } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import MuiLink from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

export type Link = {
    link: string,
    title: string
};

type DefaultProps = {
    router: Object
};

type Props = {
    path: Array<Link>,
    separator?: HTMLElement,
    disableLast: boolean
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {
        float: 'left',
        paddingTop: '0.5em',
        '& > * + *': {
            marginTop: theme.spacing(2)
        },

        '& .MuiTypography-root': {
            fontSize: '1em'
        },

        '& .MuiBreadcrumbs-li': {
            color: '#34363a',
            textTransform: 'capitalize'
        }
    },
    separator: {
        color: '#959ea7'
    },
    active: {
        color: '#9ea6ae'
    }
}));

const BreadCrumbHeader = (props: Props) => {
    const { path, separator, disableLast, router } = props;
    const classes = useStyles();

    const handleClick = (i: number, link: Link) => {
        router.push(link.link);
    };

    return (
        <div className={classes.root}>
            <Breadcrumbs
                separator={
                    separator || <span className={classes.separator}>⬩</span>
                }
                maxItems={4}
                aria-label="breadcrumb"
            >
                {_.map(path, (link, index) => {
                    if (index === path.length - 1 && disableLast) {
                        return (
                            <Typography
                                key={link.title}
                                className={classes.active}
                            >
                                {link.title}
                            </Typography>
                        );
                    }

                    return (
                        <MuiLink
                            color="inherit"
                            href={link.href}
                            key={link.title}
                            onClick={() => handleClick(index, link)}
                        >
                            {link.title}
                        </MuiLink>
                    );
                })}
            </Breadcrumbs>
        </div>
    );
};

export default withRouter(BreadCrumbHeader);
