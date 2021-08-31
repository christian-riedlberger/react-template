// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

type DefaultProps = {};

type Props = {
    title: string | React.ComponentType,
    description: string | React.ComponentType
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {
        '& h2::first-letter': {
            textTransform: 'uppercase'
        },
        '& p::first-letter': {
            textTransform: 'uppercase'
        },
        padding: '1em 0em'
    },
    title: {
        color: theme.palette.primary.dark
    },
    description: {
        color: theme.palette.secondary.light
    }
}));

const FormHeader = ({ title, description }: Props) => {
    const classes = useStyles();

    return (
        <div className={`form-header ${classes.root}`}>
            <h2 className={classes.title}>{title}</h2>
            <p className={classes.description}>{description}</p>
        </div>
    );
};

export default FormHeader;
