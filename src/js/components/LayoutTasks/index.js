import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

type Props = {
    panes: Array<any>
};

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    }
});

export default function LayoutTasks({ panes }: Props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    {panes[0]}
                </Grid>
            </Grid>
        </div>
    );
}
