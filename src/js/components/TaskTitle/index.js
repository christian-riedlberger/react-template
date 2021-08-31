// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import WorkflowStatusTitle from 'components/WorkflowStatusTitle';

type DefaultProps = {};

type Props = {
    title: string
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        '& .MuiTypography-root.MuiTypography-h4': {
            marginBottom: '1.5em!important'
        }
    }
});

const TaskTitle = ({ title }: Props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <WorkflowStatusTitle />
            <Typography variant="h4">{title}</Typography>
        </div>
    );
};

export default TaskTitle;
