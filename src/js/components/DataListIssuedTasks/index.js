// @flow
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
    NAMESPACE,
    TASK_STATUS_OPTS,
    TASK_PROGRESS_OPTS
} from 'constants/Config';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Table from 'components/Table';
import AvatarOrgPopover from 'components/AvatarOrgPopover';
import AvatarUserPopover from 'components/AvatarUserPopover';
import DrawerFilterIssuedTasks from 'components/DrawerFilterIssuedTasks';
import HeaderTasks from 'components/HeaderTasks';
import MenuTaskActions from 'components/MenuTaskActions';
import { FormName } from 'components/FormTasksIssuedFilter';
import ErrorMessage from 'components/ErrorMessage';

import TasksContainer from 'containers/TasksContainer';

import { loadingTable } from 'constants/styles/LoadingStyles';
import messages from 'constants/Messages';
import configTable from './config/configTable';

const NAMESPACE_REQUEST_ISSUED = `${NAMESPACE}.request.issued`;

// Set default enum
const DEFAULT_TASK_COLUMNS = _.map(configTable.columns, col => ({
    ...col,
    label: messages[col.label] ? (
        <FormattedMessage {...messages[col.label]} />
    ) : (
        `intl:${col.label}`
    )
}));

type DefaultProps = {
    intl: intlShape,
    classes: Object,
    needsReset: boolean,
    activeOrg: Object,
    router: any,
    issuedTotalTasks: number,
    fetchIssuedTasks: Object => Promise<Object>,
    issuedTasks: Array<Object>,
    issuedTasksIsLoading: boolean,
    formValues: Object,
    serverMessage: Array<string>
};

type Props = {} & DefaultProps;

type State = {
    renderTasks: Array<Object>,
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
    searchTerm: string,
    filterOpen: boolean,
    filter: Object,
    currentTask: Object
};

const styles = theme => ({
    root: {
        marginTop: '-1.75em',
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
    avatar: {
        width: '1.6em',
        height: '1.6em',
        color: '#fff',
        display: 'flex',
        justifyContent: 'left'
    },
    circularProgress: {
        ...loadingTable
    },
    userCellStrong: {
        color: '#242528',
        fontWeight: 400
    }
});

const alertStyle = {
    color: 'red',
    position: 'relative',
    top: '-2px',
    marginRight: '.25em'
};

/**
 *  Data list for workflow tasks
 *  This datalist handles MUI datatable actions
 */
@withRouter
@withStyles(styles)
@TasksContainer({ callingComponent: 'DataListIssuedTasks' })
@injectIntl
@connect(state => ({ formValues: _.get(state.form[FormName], 'values') }))
class DataListIssuedTasks extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            renderTasks: [],
            columns: DEFAULT_TASK_COLUMNS,
            paging: {
                totalItems: 0,
                maxItems: configTable.options.rowsPerPage,
                skipCount: 0,
                page: 0
            },
            sort: {
                name: '',
                direction: 'ascending'
            },
            filter: {},
            searchTerm: '',
            filterOpen: false,
            currentTask: {
                task: null,
                coords: {
                    mouseX: null,
                    mouseY: null
                }
            }
        };
    }

    componentDidMount() {
        this.debouncedSearch();
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        // test for data changes to update table data
        if (!_.isEqual(prevProps.issuedTasks, this.props.issuedTasks)) {
            this.handleDataUpdate();
        }

        if (
            this.props.needsReset ||
            !_.isEqual(prevProps.activeOrg, this.props.activeOrg) ||
            !_.isEqual(prevState.sort, this.state.sort) ||
            !_.isEqual(prevState.paging.page, this.state.paging.page) ||
            !_.isEqual(prevState.paging.maxItems, this.state.paging.maxItems) ||
            !_.isEqual(prevState.searchTerm, this.state.searchTerm)
        ) {
            this.debouncedSearch();
        }

        if (
            this.props.formValues &&
            !_.isEqual(this.props.formValues, prevProps.formValues) &&
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

    exportData = {};

    debouncedSearch = _.debounce(
        () => this.props.fetchIssuedTasks(this.getSearchParams()),
        500
    );

    /**
     *  Data update
     *  Update the data in state for the table
     */
    handleDataUpdate = () => {
        const renderTasks = this.renderTasks(this.props.issuedTasks);
        this.updateExportData();
        this.setState(state => {
            return {
                ...state,
                renderTasks
            };
        });
    };

    /**
     * Get the parameters to send via REST
     */
    getSearchParams = () => {
        const searchParams = {
            sort: this.state.sort,
            paging: {
                ...this.state.paging,
                skipCount: this.state.paging.maxItems * this.state.paging.page
            },
            searchTerm: _.get(this.props.formValues, 'term'),
            activeOrg: _.get(this.props.activeOrg, 'shortName'),
            issuedTasks: true,
            filter: {
                assignedBy: {
                    users: _.map(
                        _.get(this.props.formValues, 'assignedBy.users', []),
                        'shortName'
                    ),
                    groups: _.map(
                        _.get(
                            this.props.formValues,
                            'assignedBy.organizations',
                            []
                        ),
                        'shortName'
                    )
                },
                assignee: {
                    users: _.map(
                        _.get(this.props.formValues, 'assignee.users', []),
                        'shortName'
                    ),
                    groups: _.map(
                        _.get(
                            this.props.formValues,
                            'assignee.organizations',
                            []
                        ),
                        'shortName'
                    )
                },
                status: _.get(this.props.formValues, 'status', []),
                progress: _.get(this.props.formValues, 'progress', []),
                dueDate: {
                    begin: _.get(
                        this.props.formValues,
                        'dueDate.begin',
                        undefined
                    ),
                    end: _.get(this.props.formValues, 'dueDate.end', undefined)
                }
            }
        };
        return searchParams;
    };

    /**
     * Update search term
     */
    handleSearch = (search: { term: string }) => {
        if (!_.isEqual(this.state.searchTerm, search.term)) {
            this.setState(
                {
                    searchTerm: search.term
                },
                () => this.debouncedSearch()
            );
        }
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

    handleFilterOpen = () => {
        this.setState({ filterOpen: true });
    };

    handleFilterClose = (values: Object) => {
        if (!_.isEqual(values, this.state.filter)) {
            this.setState(
                {
                    filterOpen: false,
                    filter: values,
                    paging: {
                        ...this.state.paging,
                        skipCount: 0,
                        page: 0
                    }
                },
                () => this.debouncedSearch()
            );
        } else {
            this.setState({ filterOpen: false });
        }
    };

    updateExportData = (columns?: Array<Object>) => {
        const { intl, issuedTasks } = this.props;
        const rows = _.map(issuedTasks, tasks => {
            const obj = {};
            _.map(tasks, (prop, i) => {
                switch (i) {
                    case 'name':
                        obj[intl.formatMessage(messages.title)] = prop;
                        break;
                    case 'owner':
                        obj[intl.formatMessage(messages.nameOfCompany)] = prop;
                        break;
                    case 'progress':
                        obj[intl.formatMessage(messages.progress)] = _.filter(
                            TASK_PROGRESS_OPTS,
                            p => p.value === prop
                        )[0].label.defaultMessage;
                        break;
                    case 'status':
                        obj[intl.formatMessage(messages.status)] = _.filter(
                            TASK_STATUS_OPTS,
                            p => p.value === prop
                        )[0].label.defaultMessage;
                        break;
                    case 'start':
                        obj[intl.formatMessage(messages.submitted)] = moment(
                            prop
                        ).format('MMMM Do, YYYY');
                        break;
                    case 'due':
                        obj[intl.formatMessage(messages.deadline)] = moment(
                            prop
                        ).format('MMMM Do, YYYY');
                        break;
                    case 'completionProgress':
                        obj[intl.formatMessage(messages.completion)] = prop;
                        break;
                    case 'collaborators':
                        obj[intl.formatMessage(messages.collaborators)] = prop;
                        break;
                    default:
                        obj[i] = prop;
                        break;
                }
            });
            return obj;
        });

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
                            case 'name':
                                return intl.formatMessage(messages.title);
                            case 'owner':
                                return intl.formatMessage(
                                    messages.nameOfCompany
                                );
                            case 'progress':
                                return intl.formatMessage(messages.progress);
                            case 'status':
                                return intl.formatMessage(messages.status);
                            case 'start':
                                return intl.formatMessage(messages.submitted);
                            case 'due':
                                return intl.formatMessage(messages.deadline);
                            case 'completion':
                                return intl.formatMessage(
                                    messages.completion
                                );
                            case 'collaborators':
                                return intl.formatMessage(
                                    messages.collaborators
                                );
                            default:
                                return column.name;
                        }
                    }
                )
                : this.exportData.columns
        };

        this.exportData = exportData;
    };

    getExportData() {
        return this.exportData;
    }

    /**
     * Handlers for displaying the right click actions menu
     */
    handleContextMenuOpen = (
        event: Event & { clientX: number, clientY: number },
        dataIndex: number,
        task: Object
    ) => {
        event.preventDefault();
        const { issuedTasks } = this.props;
        const coords = { mouseX: event.clientX - 2, mouseY: event.clientY - 4 };
        this.setState({
            currentTask: {
                task: task || issuedTasks[dataIndex],
                coords
            }
        });
    };

    handleContextMenuClose = () => {
        this.setState(state => ({
            ...state,
            currentTask: {
                ...this.state.currentTask,
                coords: {
                    mouseX: null,
                    mouseY: null
                }
            }
        }));
    };

    handleDoubleClick = (row: Array<Object>, dataIndex: number) => {
        const { router, issuedTasks } = this.props;
        router.push(issuedTasks[dataIndex].link);
    };

    renderDate = (date: Date, dateText: string, renderTime?: boolean) => {
        const { intl } = this.props;
        if (!date) {
            return (
                <div>
                    <p>
                        {intl.formatMessage(messages.noDateAssigned, {
                            dateText
                        })}
                    </p>
                </div>
            );
        }
        return (
            <div>
                <Typography component="p">
                    {renderTime && moment(date).format('MMMM Do, YYYY (HH:mm)')}
                    {!renderTime && moment(date).format('MMMM Do, YYYY')}
                </Typography>
            </div>
        );
    };

    /**
     *  Render all rows
     */
    renderTasks = (allTasks: Array<Object>) => {
        const { columns } = this.state;
        const { classes, intl } = this.props;

        return _.map(allTasks, t => {
            return _.map(columns, col => {
                switch (col.property) {
                    case 'name': {
                        let urgentIcon = null;
                        if (parseInt(t.priority, 10) === 1) {
                            urgentIcon = (
                                <Tooltip
                                    title={intl.formatMessage(
                                        messages.urgentTask
                                    )}
                                    aria-label={intl.formatMessage(
                                        messages.urgentTask
                                    )}
                                >
                                    <clr-icon
                                        shape="error-standard"
                                        style={alertStyle}
                                    />
                                </Tooltip>
                            );
                        }

                        if (!_.isEmpty(t.errors)) {
                            urgentIcon = (
                                <Tooltip
                                    title={intl.formatMessage(
                                        t.errors[0].indexOf('intl:') === 0 &&
                                            messages[
                                                t.errors[0].replace('intl:', '')
                                            ]
                                            ? messages[
                                                t.errors[0].replace(
                                                    'intl:',
                                                    ''
                                                )
                                            ]
                                            : messages.errorTask
                                    )}
                                    aria-label={intl.formatMessage(
                                        messages.errorTask
                                    )}
                                >
                                    <clr-icon
                                        shape="times"
                                        style={alertStyle}
                                    />
                                </Tooltip>
                            );
                        }

                        return (
                            <span>
                                {urgentIcon}
                                {t[col.property]}
                            </span>
                        );
                    }

                    case 'start':
                        return this.renderDate(t.start, 'start date');
                    case 'due':
                        return this.renderDate(t.due, 'due date', true);

                    case 'collaborators':
                        return (
                            <div className={classes.avatar}>
                                {_.map(t.collaborators, collaborator => (
                                    <AvatarUserPopover
                                        avatarName={collaborator}
                                    />
                                ))}
                            </div>
                        );

                    case 'owner':
                        return (
                            <AvatarOrgPopover
                                showName
                                showNameAs="p"
                                shortName={t.owner}
                                initiator={t.initiator}
                            />
                        );
                    case 'progress': {
                        return messages[t[col.property]]
                            ? intl.formatMessage(messages[t[col.property]])
                            : `intl: ${t[col.property]}`;
                    }
                    case 'status': {
                        return messages[t[col.property]]
                            ? intl.formatMessage(messages[t[col.property]])
                            : `intl: ${t[col.property]}`;
                    }
                    case 'actions':
                        return (
                            <div className="align-right-stop">
                                <IconButton
                                    data-cy={t.name}
                                    onClick={e =>
                                        this.handleContextMenuOpen(e, -1, t)
                                    }
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </div>
                        );
                    default:
                        return t[col.property];
                }
            });
        });
    };

    /** Render errors  */
    renderError = () => {
        const { serverMessage } = this.props;
        return (
            <ErrorMessage
                icon="/css/img/icons/task-missing.svg"
                errors={serverMessage}
            />
        );
    };

    /**
     *  Render data list
     */
    render() {
        const {
            classes,
            issuedTasksIsLoading,
            serverMessage,
            formValues,
            issuedTotalTasks
        } = this.props;
        const {
            filterOpen,
            columns,
            paging,
            renderTasks,
            currentTask,
            filter
        } = this.state;

        const options = {
            ...configTable.options,
            page: paging.page,
            rowsPerPage: paging.maxItems,
            count: issuedTotalTasks
        };

        if (serverMessage && serverMessage.length > 0) {
            return <div className={classes.error}>{this.renderError()}</div>;
        }

        return (
            <div className={classes.root}>
                <HeaderTasks
                    issuedTasks
                    onSearch={this.handleSearch}
                    onFilter={this.handleFilterOpen}
                    currentData={this.exportData}
                    getExportData={() => this.getExportData()}
                    formName={FormName}
                    formValues={_.isEmpty(filter) ? formValues : filter}
                />

                <div id="bordered-thead">
                    <Table
                        isLoading={issuedTasksIsLoading}
                        columns={columns}
                        options={options}
                        data={renderTasks}
                        onChange={this.handleTableChange}
                        onDoubleClick={this.handleDoubleClick}
                        onContextMenuOpen={this.handleContextMenuOpen}
                        getExportData={this.updateExportData}
                        namespace={NAMESPACE_REQUEST_ISSUED}
                    />
                </div>

                <DrawerFilterIssuedTasks
                    open={filterOpen}
                    onClose={this.handleFilterClose}
                />

                {currentTask.task && (
                    <MenuTaskActions
                        issued
                        task={currentTask.task}
                        coords={currentTask.coords}
                        onClose={this.handleContextMenuClose}
                    />
                )}
            </div>
        );
    }
}

export default DataListIssuedTasks;
