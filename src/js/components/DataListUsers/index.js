/* eslint-disable react/sort-comp */
// @flow
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@material-ui/core';
import AvatarOrgPopover from 'components/AvatarOrgPopover';
import AvatarUserPopover from 'components/AvatarUserPopover';
import UsersActionMenu from 'components/MenuUsersActions';
import Dialog from 'components/Dialog';
import HeaderUsers from 'components/HeaderUsers';
import Table from 'components/Table';
import UserContainer from 'containers/UserContainer';
import messages from 'constants/Messages';
import { NAMESPACE } from 'constants/Config';
import DrawerFilterUsers from 'components/DrawerFilterUsers';
import { FormName } from 'components/FormFilterUsers';
import configTable from './config/configTable';

const NAMESPACE_PEOPLE_USER = `${NAMESPACE}.people.users`;

// Set default enum
const DEFAULT_USER_COLUMNS = _.map(configTable.columns, col => ({
    ...col,
    label: messages[col.label] ? (
        <FormattedMessage {...messages[col.label]} />
    ) : (
        `intl:${col.label}`
    )
}));

type DefaultProps = {
    intl: intlShape,
    users: Array<Object>,
    isLoading: boolean,
    classes: Object,
    deleteUser: Function,
    fetchUsers: Function,
    needsReset: boolean,
    pagination: Object,
    router: any,
    activeOrg: Object,
    formValues: Object
};

type Props = {} & DefaultProps;

type State = {
    renderUsers: Array<Object>,
    columns: Array<Object>,
    paging: {
        maxItems: number,
        skipCount: number,
        page: number
    },
    sort: {
        name: string,
        direction: string
    },
    deleteUserNames: Array<string>,
    contextMenu: Object,
    filter: Object,
    filterOpen: boolean,
    showHideColumns: boolean
};

const styles = theme => ({
    root: {
        '& .MuiAvatar-colorDefault': {
            color: '#bfbfbf',
            backgroundColor: '#ffffff'
        },
        '& .MuiTableBody-root': {
            '&:hover': {
                cursor: 'pointer'
            },
            '& .MuiTableRow-root': {
                '&:hover': {
                    backgroundColor: theme.palette.action.hover
                }
            }
        }
    },
    userCell: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    userCellStrong: {
        color: '#242528',
        fontWeight: 400,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    avatar: {
        width: '1.6em',
        height: '1.6em'
    },
    username: {
        paddingLeft: '1.25em'
    },
    avatarIcon: { fontSize: '1.5em' },
    confirm: {
        minWidth: 250
    },
    orgGroups: {
        display: 'flex',
        '& .MuiAvatar-circle': {
            marginRight: -10
        }
    }
});

/**
 *  Data list for users
 *  This datalist handles MUI datatable actions
 */
@withStyles(styles)
@UserContainer()
@injectIntl
@withRouter
@connect(state => ({ formValues: _.get(state.form[FormName], 'values') }))
class DataListUsers extends PureComponent<Props, State> {
    dialogConfirm: Dialog;
    static whyDidYouRender = true;

    constructor(props: Props) {
        super(props);
        this.state = {
            renderUsers: [],
            columns: DEFAULT_USER_COLUMNS,
            paging: {
                totalItems: 0,
                maxItems: configTable.options.rowsPerPage,
                skipCount: 0,
                page: 0
            },
            sort: {
                name: 'cm:userName',
                direction: 'ascending'
            },
            deleteUserNames: [],
            contextMenu: {
                userName: '',
                coords: {
                    mouseX: null,
                    mouseY: null
                }
            },
            filter: {},
            filterOpen: false,
            showHideColumns: true
        };
    }

    exportData = {};

    debouncedSearch = _.debounce(
        () => this.props.fetchUsers(this.getSearchParams()),
        500
    );

    componentDidMount() {
        this.props.fetchUsers(this.getSearchParams());
    }

    componentDidUpdate(prevProps: Props) {
        // test for data changes to update table data
        if (!_.isEqual(prevProps.users, this.props.users)) {
            this.handleDataUpdate();
        }

        if (
            this.props.needsReset ||
            !_.isEqual(prevProps.activeOrg, this.props.activeOrg)
        ) {
            this.debouncedSearch();
        }

        // Check if we removed a filter tag from the table
        if (
            this.props.formValues &&
            !_.isEqual(this.props.formValues, this.state.filter) &&
            !this.state.filterOpen
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(
                {
                    filter: this.props.formValues
                },
                () => this.debouncedSearch()
            );
        }
    }

    /**
     *  Data update
     *  Update the data in state for the table
     */
    handleDataUpdate = () => {
        const renderUsers = this.renderUsers(this.props.users);
        this.updateExportData();
        this.setState(state => {
            return {
                ...state,
                renderUsers
            };
        });
    };

    /**
     * Handle paging and sorting done on the table
     */

    handleTableChange = (paging: Object, sort: Object) => {
        if (
            !_.isEqual(paging.maxItems, this.state.paging.maxItems) ||
            !_.isEqual(paging.page, this.state.paging.page) ||
            !_.isEqual(sort, this.state.sort)
        ) {
            this.setState(
                state => ({
                    ...state,
                    paging: {
                        ...state.paging,
                        maxItems: _.isNumber(paging.maxItems)
                            ? paging.maxItems
                            : state.paging.maxItems,
                        page: _.isNumber(paging.page)
                            ? paging.page
                            : state.paging.page
                    },
                    sort: sort || state.sort
                }),
                () => this.debouncedSearch()
            );
        }
    };

    /**
     *  Delete users
     */
    handleDeleteUsers = () => {
        this.props
            .deleteUser(this.state.deleteUserNames)
            .then(() => this.handleCloseDialog(true))
            .catch(e => {
                throw new Error(e);
            });
    };

    handleCloseDialog = (refresh: boolean) => {
        this.setState(
            state => {
                return {
                    ...state,
                    deleteUserNames: [],
                    contextMenu: {
                        userName: '',
                        coords: {
                            mouseX: null,
                            mouseY: null
                        }
                    }
                };
            },
            () => {
                if (refresh) this.debouncedSearch();
            }
        );
    };

    /**
     * Handlers for displaying the right click actions menu
     */
    handleContextMenuOpen = (
        event: SyntheticMouseEvent<>,
        dataIndex: number,
        userName: Object
    ) => {
        event.preventDefault();
        const { users } = this.props;
        const coords = { mouseX: event.clientX - 2, mouseY: event.clientY - 4 };
        this.setState({
            contextMenu: {
                userName: userName || users[dataIndex].userName,
                coords
            }
        });
    };

    handleContextMenuClose = (refresh: boolean) => {
        this.setState(
            {
                contextMenu: {
                    userName: '',
                    coords: {
                        mouseX: null,
                        mouseY: null
                    }
                }
            },
            () => {
                if (refresh) this.debouncedSearch();
            }
        );
    };

    handleDoubleClick = (row: Array<Object>) => {
        const { router } = this.props;
        const { columns } = this.state;
        router.push(
            `/people/edit/${
                row[_.findIndex(columns, { property: 'userName' })]
            }`
        );
    };

    // get the current table data for exporting / printing. *** Keys in a row object (user) must match the column names for them to display ***
    updateExportData = (columns?: Array<Object>, dataIndex?: Array<Object>) => {
        const { intl, users } = this.props;

        const selectedData = _.map(dataIndex, i => {
            return users[i];
        });

        this.setState({
            showHideColumns: !!_.isEmpty(dataIndex)
        });

        const rows = _.map(
            !_.isEmpty(selectedData) ? selectedData : users,
            user => {
                const obj = {};
                _.map(user, (prop, i) => {
                    switch (i) {
                        case 'firstName':
                            obj[intl.formatMessage(messages.name)] = prop;
                            break;
                        case 'userName':
                            obj[intl.formatMessage(messages.username)] = prop;
                            break;
                        case 'email':
                            obj[intl.formatMessage(messages.email)] = prop;
                            break;
                        case 'organizations':
                            obj[
                                intl.formatMessage(messages.organization)
                            ] = prop;
                            break;
                        case 'jobtitle':
                            obj[intl.formatMessage(messages.jobTitle)] = prop;
                            break;
                        case 'telephone':
                            obj[intl.formatMessage(messages.phone)] = prop;
                            break;
                        default:
                            obj[i] = prop;
                            break;
                    }
                });
                obj[
                    intl.formatMessage(messages.name)
                ] = `${user.firstName} ${user.lastName}`;
                return obj;
            }
        );
        const exportData = {
            rows,
            // get the names of each displayed column excluding actions
            columns: columns
                ? _.map(
                    _.filter(
                        columns,
                        c => c.display === 'true' && c.name !== 'actions'
                    ),
                    column => {
                        switch (column.name) {
                            case 'firstName':
                                return intl.formatMessage(messages.name);
                            case 'userName':
                                return intl.formatMessage(messages.username);
                            case 'email':
                                return intl.formatMessage(messages.email);
                            case 'organization':
                                return intl.formatMessage(
                                    messages.organization
                                );
                            case 'jobtitle':
                                return intl.formatMessage(messages.jobTitle);
                            case 'telephone':
                                return intl.formatMessage(messages.phone);
                            default:
                                return column.name;
                        }
                    }
                )
                : this.exportData.columns
        };
        this.exportData = exportData;
    };

    /**
     * Get the parameters to send via REST
     */
    getSearchParams = () => {
        const { sort, paging, filter } = this.state;
        const searchParams = {
            paging: {
                ...paging,
                skipCount: paging.maxItems * paging.page
            },
            sort: {
                name:
                    sort.name.indexOf('cm:') === -1
                        ? `cm:${sort.name}`
                        : sort.name,
                direction:
                    sort.direction === 'ascending' ? 'ascending' : 'descending'
            },
            searchTerm: filter && filter.term ? { term: filter.term } : null
        };
        return searchParams;
    };

    getExportData() {
        return this.exportData;
    }

    toggleConfirmDialog = (selectedIndexes: Array<Object>) => {
        const { users } = this.props;
        const deleteUserNames = _.map(selectedIndexes, index => {
            return users[index.index].userName;
        });
        this.setState(state => {
            return {
                ...state,
                deleteUserNames
            };
        });
    };

    handleFilterOpen = () => {
        this.setState({ filterOpen: true });
    };

    handleFilterClose = (values: Object) => {
        if (!_.isEqual(values, this.state.filter)) {
            this.setState(
                state => ({
                    filterOpen: false,
                    filter: values || {},
                    paging: {
                        ...state.paging,
                        skipCount: 0,
                        page: 0
                    }
                }),
                () => this.debouncedSearch()
            );
        } else {
            this.setState({ filterOpen: false });
        }
    };

    /**
     *  Render all rows
     */
    renderUsers = (users: Array<Object>) => {
        const { classes } = this.props;
        const { columns } = this.state;

        return _.map(users, u => {
            return _.map(columns, col => {
                switch (col.property) {
                    case 'name':
                        return (
                            <div className={classes.userCellStrong}>
                                <AvatarUserPopover avatarName={u.userName} />
                                <div
                                    className={classes.username}
                                    data-cy={u.userName}
                                >
                                    {u.firstName} {u.lastName}
                                </div>
                            </div>
                        );

                    case 'actions':
                        return (
                            <div className="align-right-stop">
                                <IconButton
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.nativeEvent.stopImmediatePropagation();
                                        this.handleContextMenuOpen(
                                            e,
                                            -1,
                                            u.userName
                                        );
                                    }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </div>
                        );
                    case 'organizations':
                        return (
                            <div className={classes.orgGroups}>
                                {_.map(u.organizations, org => (
                                    <AvatarOrgPopover
                                        key={org}
                                        shortName={org}
                                    />
                                ))}
                            </div>
                        );

                    case 'userName':
                    case 'email':
                    case 'jobtitle':
                    case 'telephone':
                    default:
                        return u[col.property];
                }
            });
        });
    };

    /**
     *  Render data list
     */
    render() {
        const { intl, classes, pagination, isLoading } = this.props;
        const {
            deleteUserNames,
            columns,
            renderUsers,
            contextMenu,
            paging,
            filterOpen,
            filter,
            showHideColumns
        } = this.state;

        const options = {
            ...configTable.options,
            page: paging.page,
            count: pagination.totalItems,
            rowsPerPage: paging.maxItems
        };

        return (
            <div className={classes.root}>
                <HeaderUsers
                    currentData={this.exportData}
                    onFilter={this.handleFilterOpen}
                    getExportData={() => this.getExportData()}
                    formName={FormName}
                    formValues={filter}
                    showHideColumns={showHideColumns}
                />

                <div id="bordered-thead" className="users-thead">
                    <Table
                        isLoading={isLoading}
                        columns={columns}
                        options={options}
                        data={renderUsers}
                        onChange={this.handleTableChange}
                        onRowsDelete={this.toggleConfirmDialog}
                        onDoubleClick={this.handleDoubleClick}
                        onContextMenuOpen={this.handleContextMenuOpen}
                        getExportData={this.updateExportData}
                        namespace={NAMESPACE_PEOPLE_USER}
                    />
                </div>

                {deleteUserNames.length > 0 && (
                    <Dialog
                        intl={intl}
                        title={`${intl.formatMessage(
                            messages.confirmDeleteUsersTitle
                        )}`}
                        open
                        onSave={this.handleDeleteUsers}
                        onClose={() => this.handleCloseDialog(false)}
                        primaryActionMessage="confirm"
                        ref={c => {
                            if (c) this.dialogConfirm = c;
                        }}
                    >
                        <div className={classes.confirm}>
                            {intl.formatMessage(
                                messages.confirmDeleteUsersContent
                            )}
                            <ul>
                                {_.map(deleteUserNames, value => {
                                    return <li key={value}>{value}</li>;
                                })}
                            </ul>
                        </div>
                    </Dialog>
                )}

                <UsersActionMenu
                    open={contextMenu.userName.length > 0}
                    username={contextMenu.userName}
                    coords={contextMenu.coords}
                    onClose={() => this.handleContextMenuClose(false)}
                    deleteUser={userNameArray =>
                        this.setState({
                            deleteUserNames: userNameArray
                        })
                    }
                />
                <DrawerFilterUsers
                    open={filterOpen}
                    onClose={this.handleFilterClose}
                />
            </div>
        );
    }
}

export default DataListUsers;
