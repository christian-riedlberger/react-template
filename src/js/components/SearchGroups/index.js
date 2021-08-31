// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchInput from 'components/SearchInput';
import GroupsContainer from 'containers/GroupsContainer';
import type { ContainerProps } from 'containers/GroupsContainer';

import { WILDCARD_GROUP } from 'constants/Config';

type DefaultProps = {
    ...ContainerProps
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    SearchGroups: {
        width: '30em'
    }
});

const SearchGroups = (props: Props) => {
    const {
        fetchGroupsBrowse,
        clearFetchGroups,
        updateSearchTerm,
        updateGroupAtIndex,
        searchTerm
    } = props;
    const classes = useStyles();

    const handleSearch = term => {
        clearFetchGroups();
        updateSearchTerm(term);
        updateGroupAtIndex(WILDCARD_GROUP, 0);
        fetchGroupsBrowse({ term, type: 'group' });
    };

    return (
        <div className={classes.SearchGroups}>
            <SearchInput onSearch={handleSearch} value={searchTerm} bordered />
        </div>
    );
};

export default GroupsContainer()(SearchGroups);
