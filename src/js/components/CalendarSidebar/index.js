// @flow
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

import TodayIcon from '@material-ui/icons/Today';

type DefaultProps = {
    classes: Object
};
type Props = {} & DefaultProps;

type State = {};

const styles = {
    root: {
        display: 'block',
        width: 61,
        backgroundColor: '#f2f2f2',
        padding: '.8em',
        paddingBottom: '0.5em',
        borderRadius: '5px',
        textAlign: 'center',
        '& h2': {
            margin: 0,
            color: '#4ed490',
            fontFamily: 'Roboto',
            fontSize: '2em',
            lineHeight: '1em',
            fontWeight: '500'
        },
        '& span': {
            color: '#38393D',
            fontSize: '1.2em',
            fontWeight: '300',
            lineHeight: '1.7em',
            paddingBottom: '.25em',
            display: 'block'
        }
    },
    icon: {
        color: '#bdc6d0',
        fontSize: '2.2em'
    }
};

/**
 *  Component
 *  @desc
 *  @author
 */

class CalendarSidebar extends Component<Props, State> {
    render() {
        const { classes } = this.props;

        return (
            <a className={classes.root}>
                <TodayIcon className={classes.icon} />
                <h2>{moment().format('D')}</h2>
                <span>{moment().format('MMM')}</span>
            </a>
        );
    }
}

export default withStyles(styles)(injectIntl(CalendarSidebar));
