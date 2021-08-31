// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { injectIntl, intlShape } from 'react-intl';
import Clock from 'react-live-clock';

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {} & DefaultProps;

// Custom CSS Classes
const useStyles = makeStyles({
    header: {
        textAlign: 'right',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E2E2E2'
    },
    icon: {
        color: 'deepskyblue'
    },
    backButton: {
        float: 'left',
        borderRadius: 0,
        '& strong': {
            fontSize: '0.7em',
            paddingLeft: '.5em'
        }
    },
    menu: {
        margin: 0,
        padding: 0,
        '& li': {
            fontSize: '.9em',
            color: '#393C40',
            display: 'inline-block',
            borderRight: 'none',
            borderLeft: '1px solid #ccc',
            verticalAlign: 'middle',
            '& a': {
                padding: '.7em 1.5em',
                display: 'inline-block'
            }
        },
        '& li:first-child': {
            borderLeft: '0'
        }
    },
    short: {
        borderLeft: '0',
        borderRight: '1px solid #ccc',
        padding: '0 1em!important',
        fontSize: '0.8em',
        lineHeight: '1em'
    }
});

/**
 * Definition of a Pie chart
 * @param {*} param0
 */
const Header = ({ intl }: Props) => {
    const classes = useStyles();

    return (
        <div className={`${classes.header} clearfix`}>
            <IconButton
                className={classes.backButton}
                onClick={() => {
                    window.history.go(-1);
                    return false;
                }}
            >
                <ArrowBack className={classes.icon} />
                <strong>{intl.formatMessage(messages.back)}</strong>
            </IconButton>

            <ul className={classes.menu}>
                <li className={classes.short}>
                    <Clock
                        format="hh:mm"
                        ticking
                        style={{ color: '#333', fontWeight: '600' }}
                    />
                    &nbsp;
                    <Clock
                        format="A"
                        ticking
                        style={{ color: '#aaa', fontWeight: '600' }}
                    />
                </li>
                <li className={classes.short}>
                    <Clock
                        format="DD"
                        ticking
                        style={{ color: '#333', fontWeight: '600' }}
                    />
                    &nbsp;
                    <Clock
                        format="MMM YYYY"
                        ticking
                        style={{ color: '#aaa', fontWeight: '600' }}
                    />
                </li>
                <li>
                    <a>
                        <img
                            src="/css/img/report/icons/profile-icon.svg"
                            alt="profile"
                        />
                    </a>
                </li>
                <li>
                    <a>
                        <img
                            src="/css/img/report/icons/power-icon.svg"
                            alt="sign out"
                        />
                    </a>
                </li>
            </ul>
            <span style={{ clear: 'both' }} />
        </div>
    );
};

export default injectIntl(Header);
