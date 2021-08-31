// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import DataListRequestsStatus from 'components/DataListRequestsStatus';

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    }
});

export default function LayoutRequestsReports() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <DataListRequestsStatus />
        </div>
    );
}
