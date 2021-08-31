// @flow
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import {
    NAMESPACE,
    TASK_STATUS_OPTS,
    TASK_PROGRESS_OPTS
} from 'constants/Config';
import { FormName } from 'components/FormTasksFilter';

import Table from 'components/Table';
import AvatarUserPopover from 'components/AvatarUserPopover';
import AvatarOrgPopover from 'components/AvatarOrgPopover';
import DrawerFilterTasks from 'components/DrawerFilterTasks';
import HeaderTasks from 'components/HeaderTasks';
import MenuTaskActions from 'components/MenuTaskActions';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import TasksContainer from 'containers/TasksContainer';
import ErrorMessage from 'components/ErrorMessage';

import messages from 'constants/Messages';
import configTable from './config/configTable';

const NAMESPACE_REQUEST_RECEIVED = `${NAMESPACE}.request.received`;

// Set default enum
const DEFAULT_TASK_COLUMNS = _.map(configTable.columns, col => ({
    ...col,
    label: messages[col.label] ? (
        <FormattedMessage {...messages[col.label]} />
    ) : (
        `intl:${col.label}`
    )
}));

const DATE_FORMAT = 'MMMM Do, YYYY (HH:mm)';

type DefaultProps = {
    classes: Object,
    needsReset: boolean,
    activeOrg: Object,
    router: any,
    intl: intlShape,
    fetchReceivedTasks: Object => Promise<Object>,
    receivedTotalTasks: number,
    receivedTasks: Array<Object>,
    receivedTasksIsLoading: boolean,
    formValues: Object,
    serverMessage: Array<string>
};

type Props = {} & DefaultProps;

type State = {
    renderTasks: Array<Object>,
    columns: Array<Object>,
    sort: {
        name: string,
        direction: string
    },
    filter: Object,
    searchTerm: string,
    filterOpen: boolean,
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
        justifyContent: 'left',
        marginTop: '-1em'
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
@TasksContainer({ callingComponent: 'DataListTasks' })
@injectIntl
@connect(state => ({ formValues: _.get(state.form[FormName], 'values') }))
class DataListTasks extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            renderTasks: [],
            columns: DEFAULT_TASK_COLUMNS,
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

    componentDidUpdate(prevProps: Props) {
        // test for data changes to update table data
        if (!_.isEqual(prevProps.receivedTasks, this.props.receivedTasks)) {
            this.handleDataUpdate();
        }

        if (
            this.props.needsReset ||
            !_.isEqual(prevProps.activeOrg, this.props.activeOrg)
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

    debouncedSearch = _.debounce(() => {
        this.props.fetchReceivedTasks(this.getSearchParams());
    }, 500);

    /**
     *  Data update
     *  Update the data in state for the table
     */
    handleDataUpdate = () => {
        const renderTasks = this.renderTasks(this.props.receivedTasks);
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
            searchTerm: _.get(this.props.formValues, 'term'),
            activeOrg: _.get(this.props.activeOrg, 'shortName'),
            issuedTasks: false,
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
                    begin: _.get(this.props.formValues, 'dueDate.begin'),
                    end: _.get(this.props.formValues, 'dueDate.end')
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
        if (!_.isEqual(sort, this.state.sort)) {
            this.setState(
                state => ({
                    ...state,
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
                    filter: values
                },
                () => this.debouncedSearch()
            );
        } else {
            this.setState({ filterOpen: false });
        }
    };

    updateExportData = (columns?: Array<Object>) => {
        const { intl, receivedTasks } = this.props;

        const rows = _.map(receivedTasks, tasks => {
            const obj = {};
            _.map(tasks, (prop, i) => {
                switch (i) {
                    case 'issuingEntity':
                        obj[intl.formatMessage(messages.assignedBy)] = prop;
                        break;
                    case 'name':
                        obj[intl.formatMessage(messages.title)] = prop;
                        break;
                    case 'due':
                        obj[intl.formatMessage(messages.dueDate)] = moment(
                            prop
                        ).format(DATE_FORMAT);
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
                    case 'completionProgress':
                        obj[intl.formatMessage(messages.completion)] = prop;
                        break;
                    case 'collaborators':
                        obj[intl.formatMessage(messages.collaborators)] = prop;
                        break;
                    default:
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
                            case 'issuingEntity':
                                return intl.formatMessage(
                                    messages.assignedBy
                                );
                            case 'name':
                                return intl.formatMessage(messages.title);
                            case 'due':
                                return intl.formatMessage(messages.dueDate);
                            case 'progress':
                                return intl.formatMessage(messages.progress);
                            case 'status':
                                return intl.formatMessage(messages.status);
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
        event: SyntheticMouseEvent<>,
        dataIndex: number,
        task: Object
    ) => {
        event.preventDefault();
        const { receivedTasks } = this.props;
        const coords = { mouseX: event.clientX - 2, mouseY: event.clientY - 4 };
        this.setState({
            currentTask: {
                task: task || receivedTasks[dataIndex],
                coords
            }
        });
    };

    handleContextMenuClose = () => {
        this.setState({
            currentTask: {
                task: {},
                coords: {
                    mouseX: null,
                    mouseY: null
                }
            }
        });
    };

    handleDoubleClick = (row: Array<Object>, dataIndex: number) => {
        const { router, receivedTasks } = this.props;
        router.push(receivedTasks[dataIndex].link);
    };

    renderDate = (date: Date) => {
        const { intl } = this.props;
        if (!date) {
            return (
                <div>
                    <p>{intl.formatMessage(messages.na)}</p>
                </div>
            );
        }
        return (
            <div>
                <Typography component="p">
                    {moment(date).format(DATE_FORMAT)}
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
                    case 'due':
                        return this.renderDate(t.due);

                    case 'issuingEntity':
                        return (
                            <AvatarOrgPopover
                                showName
                                showNameAs="p"
                                shortName={t.issuingEntity}
                                initiator={t.initiator}
                            />
                        );

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
            receivedTotalTasks,
            receivedTasksIsLoading,
            serverMessage,
            formValues
        } = this.props;
        const {
            filterOpen,
            columns,
            renderTasks,
            currentTask,
            filter
        } = this.state;

        const options = {
            ...configTable.options,
            count: receivedTotalTasks
        };

        if (serverMessage && serverMessage.length > 0) {
            return <div className={classes.error}>{this.renderError()}</div>;
        }

        return (
            <div className={classes.root}>
                <HeaderTasks
                    onSearch={this.handleSearch}
                    onFilter={this.handleFilterOpen}
                    currentData={this.exportData}
                    getExportData={() => this.getExportData()}
                    formName={FormName}
                    formValues={_.isEmpty(filter) ? formValues : filter}
                />

                <div id="bordered-thead">
                    <Table
                        isLoading={receivedTasksIsLoading}
                        columns={columns}
                        options={options}
                        data={renderTasks}
                        onChange={this.handleTableChange}
                        onDoubleClick={this.handleDoubleClick}
                        onContextMenuOpen={this.handleContextMenuOpen}
                        getExportData={this.updateExportData}
                        namespace={NAMESPACE_REQUEST_RECEIVED}
                    />
                </div>

                <DrawerFilterTasks
                    open={filterOpen}
                    onClose={this.handleFilterClose}
                />

                {currentTask.task && (
                    <MenuTaskActions
                        isTask
                        task={currentTask.task}
                        coords={currentTask.coords}
                        onClose={this.handleContextMenuClose}
                    />
                )}
            </div>
        );
    }
}

export default DataListTasks;
