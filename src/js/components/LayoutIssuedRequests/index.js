// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DataListIssuedTasks from 'components/DataListIssuedTasks';

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    }
});

export default function LayoutIssuedRequests() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* $FlowFixMe */}
            <DataListIssuedTasks />
        </div>
    );
}
