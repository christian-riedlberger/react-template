/* eslint-disable promise/always-return */
/* eslint-disable indent */
// @flow
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

import MessageContainer from 'containers/MessageContainer';
import GroupsContainer from 'containers/GroupsContainer';
import type { Group as GroupType } from 'types/groupTypes';
import GroupRow from 'components/GroupRow';
import messages from 'constants/Messages';
import DialogGroupAdd from 'components/DialogGroupAdd';
import DialogGroup from 'components/DialogGroup';
import { GROUP_PAGE_SIZE } from 'constants/Config';

type DefaultProps = {
    intl: intlShape,
    fetchChildren: Function,
    browseResult: Object,
    access: Object,
    clearActiveGroup: Function,
    clearBrowseGroups: Function,
    addExistingItemToGroup: Function,
    history: Array<GroupType>,
    groups: Array<GroupType>,
    parentGroup: GroupType,
    showMessage: Function
};

type Props = {
    parentGroup: GroupType,
    className?: string,
    index: number
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        width: '100%',
        display: 'inline-block',
        '& .cy-group-column .MuiSvgIcon-fontSizeSmall': {
            fontSize: '2rem',
            color: '#adadad',
            marginLeft: '5px'
        }
    },
    list: {
        padding: '1px 0px',
        height: '60vh',
        'overflow-y': 'auto',
        'overflow-x': 'hidden'
    },
    hidden: {
        opacity: 0,
        filter: 'alpha(opacity=0)'
    },
    pagination: {
        borderTop: '1px solid #e0e0e0'
    },
    loading: {
        height: '60vh',
        display: 'flex',
        flexDirection: 'row',
        verticalAlign: 'middle',
        alignItems: 'center',
        '& .MuiCircularProgress-root': {
            margin: '0 auto'
        }
    },
    textTitle: {
        padding: '1em',
        display: 'block',
        textTransform: 'uppercase',
        fontSize: '.9em',
        height: '1.6em',
        lineHeight: '1.6em',
        fontWeight: '500',
        color: '#747474'
    }
});

const GroupColumn = (props: Props) => {
    const {
        groups,
        className,
        access,
        parentGroup,
        index,
        browseResult,
        intl,
        fetchChildren,
        history,
        clearActiveGroup,
        clearBrowseGroups,
        addExistingItemToGroup
    } = props;
    const classes = useStyles();

    const dialogGroupAdd = useRef(DialogGroupAdd);
    const dialogGroupNew = useRef(DialogGroup);

    const [selectedNodeRef, setNodeRef]: [string | null, Function] = useState(
        null
    );
    const [pageChange, setPageChange] = useState(false);

    const [params, setParams] = useState({
        page: 0,
        totalItems: 0,
        skipCount: 0,
        isColumnLoading: false
    });

    const isDisabled =
        parentGroup.isOrganization || parentGroup.shortName.length < 1;

    // 'on mount'
    useEffect(() => {
        getGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (pageChange) {
            getGroups();
            setPageChange(false);
        }

        if (params.totalItems <= params.skipCount && params.totalItems !== 0) {
            handleSetParams(params.page - 1, () => {
                setPageChange(true);
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageChange, params]);

    const filterGroups = parentGroup.shortName
        ? _.filter(groups, group => {
              return (
                  group.parentName === parentGroup.shortName &&
                  group.shortName !== 'OPERATIONS'
              );
          })
        : browseResult;

    const getGroups = () => {
        setParams({
            ...params,
            isColumnLoading: true
        });

        fetchChildren(parentGroup.shortName, 'combined', params)
            .then(resp => {
                const temp = _.get(resp, 'action.payload.data.paging');
                setParams({
                    ...params,
                    totalItems: temp.totalItems,
                    skipCount: temp.skipCount,
                    isColumnLoading: false
                });
                return resp;
            })
            .catch(e => {
                throw e;
            });
    };

    const handleAddOpen = () => {
        clearBrowseGroups();
        dialogGroupAdd.current.open();
    };

    const handleAddAuthority = (authority: GroupType) => {
        const { showMessage } = props;
        const organizationID =
            history && history.length > 1 ? history[1].shortName : null;
        showMessage({ message: 'addItemToGroupPending', variant: 'pending' });

        addExistingItemToGroup(
            authority,
            parentGroup.shortName,
            organizationID,
            authority.authorityType === 'USER'
        )
            .then(resp => {
                if (resp.value.data && resp.value.data.status !== 200) {
                    showMessage({
                        message: 'addItemToGroupFail',
                        variant: 'info'
                    });
                    return null;
                }
                showMessage({
                    message: 'addItemToGroupSuccess',
                    variant: 'success'
                });
                return null;
            })
            .catch(e => {
                throw e;
            });

        if (_.get(dialogGroupAdd, 'current.state.open'))
            dialogGroupAdd.current.close();
    };

    const handleNewOpen = () => {
        clearActiveGroup();
        dialogGroupNew.current.open();
    };

    const handleSave = (group, message) => {
        const { showMessage } = props;
        if (_.get(dialogGroupNew, 'current.state.open')) {
            dialogGroupNew.current.close();
            showMessage({ message, variant: 'success' });

            setParams({
                ...params,
                totalItems: params.totalItems + 1,
                isColumnLoading: false
            });
        }
    };

    const handlePageChange = (event, newPage) => {
        handleSetParams(newPage, () => {
            setPageChange(true);
        });
    };

    const handleSetParams = (page, callback) => {
        setParams({
            ...params,
            page,
            skipCount: page * GROUP_PAGE_SIZE
        });
        return callback && callback();
    };

    // Administrator buttons
    const userIsAdmin = localStorage.getItem('auth:userIsAdmin') === 'true';
    const isActiveOrg =
        history && history.length > 1
            ? localStorage.getItem('org:active') === history[1].shortName
            : false;
    const hasAdminRights = access.sysAdmin || (userIsAdmin && isActiveOrg);

    return (
        <Fragment>
            <Paper
                component="span"
                className={`${classes.root} ${className || ''}`}
            >
                {index === 1 && (
                    <Grid container alignItems="center" justify="center">
                        <Grid item>
                            <span className={classes.textTitle}>
                                {intl.formatMessage(messages.roles)}
                            </span>
                        </Grid>
                    </Grid>
                )}

                {!hasAdminRights && index !== 1 && (
                    <Grid container alignItems="center" justify="center">
                        <Grid item>
                            <span className={classes.textTitle} />
                        </Grid>
                    </Grid>
                )}

                {hasAdminRights && index !== 1 && (
                    <Grid container alignItems="center" justify="center">
                        <Grid item>
                            <Tooltip
                                title={intl.formatMessage(messages.newGroup)}
                                placement="top"
                            >
                                <IconButton
                                    onClick={handleNewOpen}
                                    className={
                                        isDisabled ? classes.hidden : null
                                    }
                                    disabled={isDisabled}
                                >
                                    <AddBoxRoundedIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Tooltip
                                title={intl.formatMessage(messages.addExisting)}
                                placement="top"
                            >
                                <IconButton
                                    onClick={handleAddOpen}
                                    className={
                                        isDisabled ? classes.hidden : null
                                    }
                                    disabled={isDisabled}
                                >
                                    <GroupRoundedIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                )}

                <Divider />

                {params.isColumnLoading && (
                    <div className={classes.loading}>
                        <CircularProgress size={40} />
                    </div>
                )}

                {!params.isColumnLoading && (
                    <List className={classes.list}>
                        <div className="cy-group-column">
                            {_.map(filterGroups, group => (
                                <GroupRow
                                    group={group}
                                    key={`GroupRow-${group.nodeRef}`}
                                    onClick={() => setNodeRef(group.nodeRef)}
                                    isSelected={
                                        group.nodeRef === selectedNodeRef
                                    }
                                    columnIndex={index}
                                    getGroups={getGroups}
                                />
                            ))}
                        </div>
                    </List>
                )}
                <Table>
                    <TableBody>
                        <TableRow>
                            <TablePagination
                                colSpan={6}
                                className={classes.pagination}
                                rowsPerPageOptions={[]}
                                count={params.totalItems}
                                rowsPerPage={GROUP_PAGE_SIZE}
                                page={params.page}
                                onChangePage={(event, val) =>
                                    handlePageChange(event, val)
                                }
                            />
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
            <DialogGroupAdd
                group={parentGroup}
                passRef={dialogGroupAdd}
                onAdd={handleAddAuthority}
            />
            <DialogGroup
                parentName={parentGroup.shortName}
                groupRootOrganization={parentGroup.groupRootOrganization}
                onSave={handleSave}
                passRef={dialogGroupNew}
            />
        </Fragment>
    );
};

export default compose(
    injectIntl,
    connect(
        store => ({
            access: store.access
        }),
        {}
    ),
    GroupsContainer(),
    MessageContainer()
)(GroupColumn);
