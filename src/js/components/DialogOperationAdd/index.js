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
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import TextField from '@material-ui/core/TextField';
import { DEBOUNCE_DELAY } from 'constants/Config';

import { fetchOperationsBrowse } from 'actions/ActionOperations';

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
    search: {}
});

const DialogOperationAdd = (props: Props) => {
    const { intl, passRef, group, onAdd } = props;

    const classes = useStyles();

    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (term.length > 0) {
            _.debounce(
                () =>
                    fetchOperationsBrowse({
                        term,
                        isOperation: true,
                        type: 'group'
                    }).payload.then(resp => {
                        return setResults(resp.data.data);
                    }),
                DEBOUNCE_DELAY
            )();
        } else {
            setResults([]);
        }
    }, [term]);

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
                intl.formatMessage(messages.addOperation, {
                    name: group.displayName || group.shortName
                })
            }
            className={classes.searchDialog}
        >
            {renderBrowseSearch()}

            <ListButtonOptions
                options={_.map(results, g => ({
                    ...g,
                    icon:
                        g.authorityType === 'USER' ? (
                            <PersonIcon fontSize="small" />
                        ) : (
                            <GroupIcon fontSize="small" />
                        ),
                    name: g.displayName,
                    secondary: g.shortName
                }))}
                onPrimaryClick={handleAdd}
            />
        </Dialog>
    );
};

export default injectIntl(DialogOperationAdd);
