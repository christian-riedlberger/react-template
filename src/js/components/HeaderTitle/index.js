// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
    title: string,
    description: string
};

// Custom CSS Classes
const useStyles = makeStyles({
    root: {
        textAlign: 'right',
        padding: '2em 2em 2.5em 2em',
        backgroundColor: '#fff'
    },
    title: {
        color: '#9e9e9e',
        textAlign: 'left',
        float: 'left'
    },
    header: {
        fontFamily: 'Roboto',
        fontSize: '1.7em',
        color: '#28b6f6',
        lineHeight: 1,
        marginBottom: '0.3em'
    }
});

/**
 * Definition of a Pie chart
 * @param {*} param0
 */
const HeaderTitle = ({ title, description }: Props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={2} direction="row">
                <Grid item xs={12} className={classes.title}>
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        className={classes.header}
                    >
                        {title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {description}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default HeaderTitle;
