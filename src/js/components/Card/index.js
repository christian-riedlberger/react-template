// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import clsx from 'clsx';
import _ from 'lodash';

type Props = {
    children: React.Node,
    className?: string
};

const useStyles = makeStyles({
    card: {
        width: '100%',
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: '2em'
    }
});

const Card = (props: Props) => {
    const { children, className } = props;
    const classes = useStyles();

    return (
        <MuiCard
            {..._.omit(props, ['children', 'className'])}
            className={clsx(classes.card, className)}
        >
            <CardContent>{children}</CardContent>
        </MuiCard>
    );
};

Card.defaultProps = {
    className: ''
};

export default Card;
