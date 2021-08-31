// @flow
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
    height: number | string
};

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

/**
 *  Loading
 *  @desc
 *  @author
 */
const Loading = (props: Props) => {
    const classes = useStyles();

    const height = props.height || 'auto';

    return (
        <div className={classes.root}>
            <CircularProgress
                disableShrink
                variant="indeterminate"
                size={height}
                thickness={4}
            />
        </div>
    );
};

export default Loading;
