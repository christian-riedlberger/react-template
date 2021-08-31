// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import TrustScore from '../TrustScore';
import CalendarSidebar from '../CalendarSidebar';

const useStyles = makeStyles({
    root: {
        marginLeft: '2em'
    },
    tool: {
        marginBottom: '2em'
    }
});

/**
 *  Simple Links for main header
 *  Next to profile
 */
const SidebarRight = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* <div className={classes.tool}>
                <TrustScore />
            </div> */}
            <div className={classes.tool}>
                <CalendarSidebar />
            </div>
        </div>
    );
};

export default SidebarRight;
