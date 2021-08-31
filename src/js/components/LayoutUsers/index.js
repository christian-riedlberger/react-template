import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as theme from 'constants/Theme';
import DataListUsers from 'components/DataListUsers';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        marginTop: '-1.75em'
    },
    line: {
        borderLeft: `1px solid ${theme.hue4}`,
        height: '20px'
    }
});

export default function LayoutUsers() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <DataListUsers />
        </div>
    );
}
