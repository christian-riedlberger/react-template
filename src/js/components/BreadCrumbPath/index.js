// @flow
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import type { Node } from 'react';

type DefaultProps = {};

type Props = {
    buttonsRight?: Node,
    path: string,
    separator?: HTMLElement
} & DefaultProps;

type Crumb = string | { name: string, link: string };

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        '& .MuiTypography-root': {
            fontSize: '1em'
        },
        '& .MuiBreadcrumbs-li': {
            color: '#34363a'
        }
    },
    separator: {
        color: '#959ea7'
    },
    link: {
        color: '#9ea6ae',
        cursor: 'pointer',
        textTransform: 'capitalize',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    forwardIcon: {
        fontSize: '.8em',
        position: 'relative',
        top: '1px',
        color: '#d7d7d7'
    },
    buttonsRight: {
        marginLeft: '.75em'
    }
}));

const BreadCrumbPath = (props: Props) => {
    const { separator, path, buttonsRight } = props;
    const classes = useStyles();

    if (!path) return null;

    let crumbs = [];
    if (_.isArray(path)) {
        crumbs = path;
    } else {
        crumbs = path.split('/');
    }

    // Is personal folder
    const isPersonal = crumbs[0] === 'personal';

    let accumPath = '/';
    return (
        <div className={classes.root}>
            <Breadcrumbs
                separator={
                    separator || (
                        <span className={classes.separator}>
                            <ArrowForwardIosIcon
                                className={classes.forwardIcon}
                            />
                        </span>
                    )
                }
                maxItems={4}
                aria-label="BreadCrumbPath"
            >
                {!crumbs ||
                    (crumbs.length === 0 && (
                        <div
                            style={{ color: '##c4c3c3', paddingLeft: '.25em' }}
                        >
                            /
                        </div>
                    ))}

                {_.map(crumbs, (crumb: Crumb, index: number) => {
                    if (typeof crumb === 'string') {
                        accumPath = `${accumPath}${crumb}/`;
                        if (isPersonal && index === 0) return;

                        return (
                            <Link
                                to={`/documents/#${accumPath.slice(0, -1)}`}
                                color="inherit"
                                key={`crumb-${index}`}
                                className={classes.link}
                            >
                                {crumb}
                            </Link>
                        );
                    }

                    return (
                        <Link
                            to={`/documents/#/${crumb.link}`}
                            color="inherit"
                            key={`crumb-${index}`}
                            className={classes.link}
                        >
                            {crumb.name}
                        </Link>
                    );
                })}
            </Breadcrumbs>

            <div className={classes.buttonsRight}>{buttonsRight}</div>
        </div>
    );
};

export default BreadCrumbPath;
