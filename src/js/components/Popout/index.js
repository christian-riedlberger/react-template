// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Header from 'components/Header';

type DefaultProps = {
    classes: Object
};

type Props = {
    popout: any,
    body: any
} & DefaultProps;

const styles = {
    root: {
        marginLeft: '75px',
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        minHeight: '100vh',

        '& .popout': {
            width: '350px',
            backgroundColor: '#ECF0F6',
            borderLeft: '1px solid #e2e2e2',
            padding: '1.5em'
        },
        '& .wrapper': {
            backgroundColor: '#FFFFFF',
            width: '100%',
            '& .body': {
                padding: '1.5em'
            }
        }
    }
};

/**
 * Definition of a pie chart
 * @param {*} param0
 */
const Popout = (props: Props) => {
    const { body, popout, classes } = props;

    return (
        <div className={classes.root}>
            <div className="popout">{popout}</div>
            <div className="wrapper">
                <Header />
                <div className="body">{body}</div>
            </div>
        </div>
    );
};

export default withStyles(styles)(Popout);
