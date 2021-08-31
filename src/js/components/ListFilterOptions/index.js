// @flow
import * as React from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type OPTION_TYPE = {
    name: string,
    nodeRef: string,
    subName?: string,
    icon?: React.Node
};

type Props = {
    options: Array<OPTION_TYPE>,
    onPrimaryClick: Function,
    listHeader?: React.Node,
    listFooter?: React.Node,
    className?: string,
    isLoading?: boolean
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        display: 'block'
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
    },
    row: {
        paddingLeft: '12px'
    }
});

const ListFilterOptions = (props: Props) => {
    const {
        options,
        listHeader,
        listFooter,
        onPrimaryClick,
        className,
        intl,
        isLoading
    } = props;
    const classes = useStyles();

    const renderListItem = (row, index) => {
        return (
            <ListItem
                button
                key={row.shortName}
                onClick={() => onPrimaryClick(row, index)}
                className={classes.row}
                data-cy-test={`cy-filter-modifier-${index}`}
                data-cy={row.shortName}
            >
                {!row.chosen && (
                    <ListItemIcon className={classes.icon}>
                        <CheckBoxOutlineBlankIcon />
                    </ListItemIcon>
                )}
                {row.chosen && (
                    <ListItemIcon className={classes.icon}>
                        <CheckBoxIcon />
                    </ListItemIcon>
                )}
                {row.icon && (
                    <ListItemIcon>
                        <ListItemIcon>{row.icon}</ListItemIcon>
                    </ListItemIcon>
                )}
                <ListItemText
                    primary={row.displayName}
                    secondary={row.shortName || null}
                />
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
            <Grid item>{intl.formatMessage(messages.loading)}</Grid>
        </Grid>
    );

    return (
        <div className={clsx(classes.root, className)}>
            {listHeader}
            {isLoading && renderLoading()}{' '}
            {options.length === 0 ? (
                <List className={classes.list}>
                    <ListItem disabled>
                        <ListItemText
                            className={classes.row}
                            primary={intl.formatMessage(
                                messages.noOptionsAvailable
                            )}
                        />
                    </ListItem>
                </List>
            ) : (
                <List className={classes.list}>
                    {_.map(options, renderListItem)}
                </List>
            )}
            {listFooter}
        </div>
    );
};

export default injectIntl(ListFilterOptions);
