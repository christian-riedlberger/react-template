// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

type DefaultProps = {
    children: React.Node
};

type Props = {
    noMargin?: boolean
} & DefaultProps;

const useStyles = makeStyles({
    fieldRow: {
        margin: '22px 0'
    },
    noMargin: {}
});

const FieldRow = ({ children, noMargin }: Props) => {
    const classes = useStyles();
    const rowStyle = noMargin ? classes.noMargin : classes.fieldRow;

    return <div className={rowStyle}>{children}</div>;
};

export default FieldRow;
