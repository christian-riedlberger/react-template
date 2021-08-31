// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { injectIntl, intlShape } from 'react-intl';

import messages from 'constants/Messages';


type DefaultProps= {
    intl: intlShape
};

type Props = {} & DefaultProps;

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
 * Header title container for the User/Group page
 * @param {*} param0
 */
const HeaderTitleStat = (props: Props) => {
    const { intl } = props;
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
                        {intl.formatMessage(messages.peopleManager)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {intl.formatMessage(messages.groupAnModify)}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default injectIntl(HeaderTitleStat);
