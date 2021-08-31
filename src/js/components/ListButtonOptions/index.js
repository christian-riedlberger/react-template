// @flow
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

type DefaultProps = {};

export type Option = {
    name: string,
    nodeRef: string,
    secondary?: string,
    icon?: Node,
    secondaryIcon?: Node,
    tooltip?: string | Node,
    disabled?: boolean
};

type Props = {
    options: Array<Option>,
    onPrimaryClick: Function,
    onSecondaryClick?: Function,
    initalSelected?: number,
    listFooter?: Node,
    showSelected?: boolean,
    className?: string,
    isLoading?: boolean
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        display: 'block',
        border: '1px solid #c4c4c4',
        borderRadius: '4px',

        '& .MuiListItem-button:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.03)'
        },
        '& .MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
        }
    },
    list: {
        padding: '3px 0px',
        maxHeight: '26em',
        overflow: 'auto'
    },
    icon: {
        'min-width': 30
    },
    loading: {
        height: '75%'
    },
    divider: {
        margin: '1.5em 0 0 0'
    }
});

const ListButtonOptions = (props: Props) => {
    const {
        initalSelected,
        showSelected,
        options,
        listFooter,
        onPrimaryClick,
        onSecondaryClick,
        className,
        isLoading
    } = props;
    const classes = useStyles();
    const [selectedNodeRef, setNodeRef] = useState(initalSelected || null);

    useEffect(() => {
        setNodeRef(initalSelected);
    }, [initalSelected]);

    const handlePrimaryClick = (row: Option, index: number) => {
        if (row.disabled) return null;
        if (showSelected) setNodeRef(row.nodeRef);

        return onPrimaryClick(row, index);
    };

    const handleSecondaryClick = (row: Option, index: number) => {
        if (onSecondaryClick && row.disabled) {
            return onSecondaryClick(row, index);
        }
    };

    const renderListItem = (row, index) => {
        if (row.tooltip) {
            return (
                <Tooltip
                    arrow
                    placement="top-start"
                    title={row.tooltip}
                    key={row.nodeRef}
                >
                    <ListItem
                        button
                        divider={index !== options.length - 1}
                        onClick={() => handlePrimaryClick(row, index)}
                        selected={row.nodeRef === selectedNodeRef}
                        disabled={Boolean(row.disabled)}
                        data-cy={row.name}
                    >
                        {row.icon && (
                            <ListItemIcon className={classes.icon}>
                                {row.icon}
                            </ListItemIcon>
                        )}
                        <ListItemText
                            primary={row.name}
                            secondary={row.secondary || null}
                        />
                        {onSecondaryClick && row.secondaryIcon && (
                            <ListItemSecondaryAction
                                onClick={() => handleSecondaryClick(row, index)}
                            >
                                <IconButton edge="end">
                                    {row.secondaryIcon}
                                </IconButton>
                            </ListItemSecondaryAction>
                        )}
                        {row.secondaryIcon && !onSecondaryClick && (
                            <ListItemIcon className={classes.icon}>
                                {row.secondaryIcon}
                            </ListItemIcon>
                        )}
                    </ListItem>
                </Tooltip>
            );
        }

        return (
            <ListItem
                button
                key={row.nodeRef}
                divider={index !== options.length - 1}
                onClick={() => handlePrimaryClick(row, index)}
                selected={row.nodeRef === selectedNodeRef}
                disabled={Boolean(row.disabled)}
                data-cy={row.name}
            >
                {row.icon && (
                    <ListItemIcon className={classes.icon}>
                        {row.icon}
                    </ListItemIcon>
                )}
                <ListItemText
                    primary={row.name}
                    secondary={row.secondary || null}
                />
                {onSecondaryClick && row.secondaryIcon && (
                    <ListItemSecondaryAction>
                        <IconButton
                            onClick={() => handleSecondaryClick(row, index)}
                            edge="end"
                        >
                            {row.secondaryIcon}
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
                {row.secondaryIcon && !onSecondaryClick && (
                    <ListItemIcon className={classes.icon}>
                        {row.secondaryIcon}
                    </ListItemIcon>
                )}
            </ListItem>
        );
    };

    const renderLoading = () => (
        <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.loading}
        >
            <Grid item>
                <CircularProgress />
            </Grid>
        </Grid>
    );

    const emptyClass = !options || options.length === 0 ? 'empty' : '';

    return (
        <div className={emptyClass}>
            <div className={clsx(classes.root, className)}>
                {isLoading ? (
                    renderLoading()
                ) : (
                    <List className={classes.list}>
                        {_.map(options, renderListItem)}
                    </List>
                )}
                {listFooter}
            </div>
        </div>
    );
};

export default ListButtonOptions;
