// @flow
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';

import GroupsContainer from 'containers/GroupsContainer';
import type { Group as GroupType } from 'types/groupTypes';
import GroupColumn from 'components/GroupColumn';

type DefaultProps = {
    history: Array<Object>,
    clearFetchGroups: Function,
    clearGroupHistory: Function
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {
        overflow: 'auto',
        'flex-wrap': 'unset',
        padding: '24px 0px'
    }
});

const ListGroup = (props: Props) => {
    const { history, clearFetchGroups, clearGroupHistory } = props;
    const classes = useStyles();

    useEffect(
        () => () => {
            clearGroupHistory();
            clearFetchGroups();
        },
        [clearFetchGroups, clearGroupHistory]
    );

    const getType = (group: GroupType) => {
        const groupType = { isOrganization: false, isOperation: false };
        if (group.shortName.match(/^(?!\s*$)(?:ORGANIZATIONS)+$/gm)) {
            groupType.isOrganization = true;
            return groupType;
        }
        if (group.shortName.match(/^.*_OPERATIONS.*$/)) {
            groupType.isOperation = true;
            return groupType;
        }

        return groupType;
    };

    return (
        <Grid container spacing={2} className={classes.root}>
            {_.map(history, (group, index: number) => (
                <Grid item key={`GroupColumn-${group.nodeRef}`}>
                    <GroupColumn
                        parentGroup={group}
                        index={index}
                        parentType={getType(group)}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default GroupsContainer()(ListGroup);
