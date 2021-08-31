// @flow
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

import messages from 'constants/Messages';
import Dialog from 'components/Dialog';
import ListButtonOptions from 'components/ListButtonOptions';
import IconButton from '@material-ui/core/IconButton';
import type { Group as GroupType } from 'types/groupTypes';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import { DEBOUNCE_DELAY } from 'constants/Config';
import { getReservedOrgName } from 'utils/string';
import { GROUP_AVATAR, AVATAR } from 'constants/ServiceURI';
import GroupIcon from '@material-ui/icons/Group';
import { fetchGroupsBrowse } from 'actions/ActionGroups';
import { useDebounce } from 'utils/hooks';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    group: GroupType,
    passRef: Function,
    onAdd: Function
} & DefaultProps;

const useStyles = makeStyles({
    root: {},
    search: {},
    results: {
        height: '400px'
    }
});

const DialogGroupAdd = (props: Props) => {
    const { intl, passRef, group, onAdd } = props;

    const classes = useStyles();

    const [term, setTerm] = useState('');
    const debouncedTerm = useDebounce(term, DEBOUNCE_DELAY);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (debouncedTerm) {
            fetchGroupsBrowse({ term: debouncedTerm })
                .payload.then(resp => {
                    const result = _.remove(resp.data.data, data => {
                        return (
                            (data.isOrganization === false ||
                                data.authorityType === 'USER') &&
                            data.groupRootOrganization !==
                                group.groupRootOrganization
                        );
                    });
                    return setResults(result);
                })
                .catch(e => {
                    throw e;
                });
        } else {
            setResults([]);
        }
    }, [debouncedTerm, group]);

    const handleGroupSearch = e => {
        setTerm(e.target.value);
    };

    const handleAdd = newGroup => {
        onAdd(newGroup);
    };

    const renderBrowseSearch = () => {
        return (
            <div style={{ marginBottom: '1em' }}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    value={term}
                    autoFocus
                    label={intl.formatMessage(messages.search)}
                    onChange={handleGroupSearch}
                    InputProps={{
                        endAdornment:
                            term.length === 0 ? (
                                <div className={classes.icon}>
                                    <clr-icon shape="search" />
                                </div>
                            ) : (
                                <IconButton onClick={() => setTerm('')}>
                                    <clr-icon shape="times" />
                                </IconButton>
                            )
                    }}
                />
            </div>
        );
    };

    return (
        <Dialog
            hideActions
            intl={intl}
            ref={passRef}
            title={
                group &&
                intl.formatMessage(messages.addAuthority, {
                    name:
                        getReservedOrgName(group.displayName, intl) ||
                        group.shortName
                })
            }
            className={classes.searchDialog}
        >
            {renderBrowseSearch()}

            <ListButtonOptions
                options={_.map(results, g => ({
                    ...g,
                    icon:
                        g.authorityType === 'GROUP' ? (
                            <Avatar
                                style={{ marginRight: '17px' }}
                                className={classes.avatar}
                                src={GROUP_AVATAR(g.shortName)}
                                alt={`${g.displayName}`}
                            >
                                <GroupIcon fontSize="small" />
                            </Avatar>
                        ) : (
                            <Avatar
                                style={{ marginRight: '17px' }}
                                className={classes.avatar}
                                src={AVATAR(g.shortName)}
                                alt={g.shortName}
                            />
                        ),
                    name: getReservedOrgName(g.displayName, intl),
                    secondary: g.shortName
                }))}
                onPrimaryClick={handleAdd}
                className={classes.results}
            />
        </Dialog>
    );
};

export default injectIntl(DialogGroupAdd);
