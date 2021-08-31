// @flow
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import clsx from 'clsx';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
// import FilterListIcon from '@material-ui/icons/FilterList';
// import Badge from '@material-ui/core/Badge';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

import MessageContainer from 'containers/MessageContainer';
import GroupsContainer from 'containers/GroupsContainer';
import type { Organization as OrganizationType } from 'types/groupTypes';
import OrganizationRow from 'components/OrganizationRow';
import messages from 'constants/Messages';
import DialogOrganization from 'components/DialogOrganization';
import { GROUP_PAGE_SIZE } from 'constants/Config';

type DefaultProps = {
    intl: intlShape,
    fetchOrgChildren: Function,
    browseResult: Object,
    groups: Array<Object>,
    clearActiveGroup: Function,
    activeOrg: Object,
    showMessage: Function
};

type Props = {
    parentGroup: OrganizationType,
    className?: string,
    index: number
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        width: '100%',
        display: 'inline-block'
    },
    list: {
        padding: '1px 0px',
        height: '60vh',
        overflow: 'auto'
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
    hidden: {
        opacity: 0,
        filter: 'alpha(opacity=0)'
    }
});

const OrganizationColumn = (props: Props) => {
    const {
        groups,
        className,
        parentGroup,
        index,
        browseResult,
        intl,
        fetchOrgChildren,
        clearActiveGroup,
        activeOrg
    } = props;
    const classes = useStyles();

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

    // 'on mount'
    useEffect(() => {
        getOrganizations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (pageChange) {
            getOrganizations();
            setPageChange(false);
        }

        if (params.totalItems <= params.skipCount && params.totalItems !== 0) {
            handleSetParams(params.page - 1, () => {
                setPageChange(true);
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageChange, params]);

    const getOrganizations = () => {
        setParams({
            ...params,
            isColumnLoading: true
        });

        fetchOrgChildren(parentGroup.shortName, 'combined', params)
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

    const dialogOrganizationNew = useRef(DialogOrganization);

    const handleNewOpen = () => {
        clearActiveGroup();
        dialogOrganizationNew.current.open();
    };

    const handleSave = (group, message) => {
        const { showMessage } = props;
        if (_.get(dialogOrganizationNew, 'current.state.open')) {
            dialogOrganizationNew.current.close();
        }
        showMessage({ message, variant: 'success' });
        getOrganizations();
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

    return (
        <Paper className={`${classes.root} ${className || ''} cy-org`}>
            <Grid container alignItems="center" justify="center">
                <Grid item>
                    <Tooltip
                        title={intl.formatMessage(messages.newOrganization)}
                        placement="top"
                    >
                        <IconButton
                            onClick={handleNewOpen}
                            className={clsx(
                                !activeOrg.userIsAdmin ? classes.hidden : '',
                                'cy-org-add'
                            )}
                            disabled={!activeOrg.userIsAdmin}
                        >
                            <AddBoxRoundedIcon />
                        </IconButton>
                    </Tooltip>

                    {/* <Tooltip
                        title={intl.formatMessage(messages.filterByName)}
                        placement="top"
                    >
                        <IconButton
                            onClick={() => {}}
                            disabled={!activeOrg.userIsAdmin}
                        >
                            <Badge badgeContent={1} color="error">
                                <FilterListIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip> */}
                </Grid>
            </Grid>
            <Divider />

            {params.isColumnLoading && (
                <div className={classes.loading}>
                    <CircularProgress size={40} />
                </div>
            )}

            {!params.isColumnLoading && (
                <List className={classes.list}>
                    {_.map(
                        parentGroup.shortName
                            ? _.filter(groups, {
                                parentName: parentGroup.shortName
                            })
                            : browseResult,
                        group => (
                            <OrganizationRow
                                group={group}
                                key={`OrganizationRow-${group.nodeRef}`}
                                onClick={() => setNodeRef(group.nodeRef)}
                                isSelected={group.nodeRef === selectedNodeRef}
                                columnIndex={index}
                                getOrganizations={getOrganizations}
                            />
                        )
                    )}
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
            <DialogOrganization
                parentName={parentGroup.shortName}
                onSave={handleSave}
                passRef={dialogOrganizationNew}
            />
        </Paper>
    );
};

export default injectIntl(
    GroupsContainer()(MessageContainer()(OrganizationColumn))
);
