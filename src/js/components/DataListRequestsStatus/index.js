// @flow
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
    NAMESPACE,
    TASK_STATUS_OPTS,
    TASK_PROGRESS_OPTS
} from 'constants/Config';
import Table from 'components/Table';
import AvatarOrgPopover from 'components/AvatarOrgPopover';
import DrawerFilterRequestTasks from 'components/DrawerFilterRequestTasks';
import HeaderTasks from 'components/HeaderTasks';
import TimeAgo from 'components/TimeAgo';
import ChartReportsPie from 'components/ChartReportsPie';
import RequestsContainer from 'containers/RequestsContainer';
import { FormName } from 'components/FormTasksRequestsFilter';

import { loadingTable } from 'constants/styles/LoadingStyles';
import { textgrey } from 'constants/Theme';
import messages from 'constants/Messages';

import configTable from './config/configTable';

const NAMESPACE_REQUEST_REPORT = `${NAMESPACE}.request.report`;

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
    allRequests: Array<Object>,
    isLoadingRequests: boolean,
    classes: Object,
    fetchFilteredRequests: Function,
    needsReset: boolean,
    totalRequests: number,
    activeOrg: Object,
    intl: intlShape,
    formValues: Object
};

type Props = {} & DefaultProps;

type State = {
    renderRequests: Array<Object>,
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
    filter: Object,
    searchTerm: string,
    filterOpen: boolean
};

const styles = {
    root: {
        marginTop: '-1.75em',
        '& .MuiAvatar-colorDefault': {
            color: '#bfbfbf',
            backgroundColor: '#ffffff'
        }
    },
    avatar: {
        width: '1.6em',
        height: '1.6em',
        color: '#fff',
        display: 'flex',
        justifyContent: 'left',
        marginTop: '-1em'
    },
    avatarContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    },
    entityField: {
        display: 'flex',
        textAlign: 'left',
        '& .entityName': {
            paddingLeft: '1.6em'
        }
    },
    userCellStrong: {
        color: '#242528',
        fontWeight: 400
    },
    receivingNameContainer: {
        display: 'flex',
        alignContent: 'center',
        paddingLeft: '1.6em'
    },
    receivingName: {
        alignSelf: 'center'
    },
    circularProgress: {
        ...loadingTable
    }
};
/**
 *  Data list for workflow tasks
 *  This datalist handles MUI datatable actions
 */
@RequestsContainer({
    fetchFilteredRequests: true,
    params: {
        paging: {
            skipCount: 0,
            maxItems: configTable.options.rowsPerPage
        },
        initialize: true
    }
})
@withStyles(styles)
@injectIntl
@withRouter
@connect(state => ({ formValues: _.get(state.form[FormName], 'values') }))
class DataListRequestsStatus extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            renderRequests: [],
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
            filterOpen: false
        };
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        // test for data changes to update table data
        if (!_.isEqual(prevProps.allRequests, this.props.allRequests)) {
            this.handleDataUpdate();
        }

        if (
            this.props.needsReset ||
            !_.isEqual(prevProps.activeOrg, this.props.activeOrg) ||
            !_.isEqual(prevState.paging.page, this.state.paging.page) ||
            !_.isEqual(prevState.paging.maxItems, this.state.paging.maxItems) ||
            !_.isEqual(prevState.sort, this.state.sort) ||
            !_.isEqual(prevState.searchTerm, this.state.searchTerm)
        ) {
            this.debouncedSearch();
        }

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

    exportData = {};

    debouncedSearch = _.debounce(
        () => this.props.fetchFilteredRequests(this.getSearchParams()),
        500
    );

    /**
     *  Data update
     *  Update the data in state for the table
     */
    handleDataUpdate = () => {
        const renderRequests = this.renderRequests(this.props.allRequests);
        this.updateExportData();
        this.setState(state => {
            return {
                ...state,
                renderRequests
            };
        });
    };

    /**
     * Get the parameters to send via REST
     */
    getSearchParams = () => {
        const searchParams = {
            paging: {
                ...this.state.paging,
                skipCount: this.state.paging.maxItems * this.state.paging.page
            },
            sort: this.state.sort,
            searchTerm: _.get(this.state.filter, 'term', undefined),
            activeOrg: _.get(this.props.activeOrg, 'shortName'),
            filter: {
                assignedBy: {
                    users: _.map(
                        _.get(this.state.filter, 'assignedBy.users', []),
                        'shortName'
                    ),
                    groups: _.map(
                        _.get(
                            this.state.filter,
                            'assignedBy.organizations',
                            []
                        ),
                        'shortName'
                    )
                },
                assignee: {
                    users: _.map(
                        _.get(this.state.filter, 'assignee.users', []),
                        'shortName'
                    ),
                    groups: _.map(
                        _.get(this.state.filter, 'assignee.organizations', []),
                        'shortName'
                    )
                },
                status: _.get(this.state.filter, 'status', []),
                progress: _.get(this.state.filter, 'progress', []),
                dueDate: {
                    begin: _.get(this.state.filter, 'dueDate.begin', undefined),
                    end: _.get(this.state.filter, 'dueDate.end', undefined)
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
        const { intl, allRequests } = this.props;
        const rows = _.map(allRequests, request => {
            const obj = {};
            _.map(request, (prop, i) => {
                switch (i) {
                    case 'name':
                        obj[
                            intl.formatMessage(messages.requestDocuments)
                        ] = prop;
                        break;
                    case 'taskTitle':
                        obj[intl.formatMessage(messages.taskTitle)] = prop;
                        break;
                    case 'issuingEntity':
                        obj[intl.formatMessage(messages.initiator)] = prop;
                        break;
                    case 'dueDate':
                        obj[intl.formatMessage(messages.dueDate)] = moment(
                            prop
                        ).format('MMMM Do, YYYY');
                        break;
                    case 'receivingEntity':
                        obj[intl.formatMessage(messages.receiver)] = prop;
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
                                return intl.formatMessage(
                                    messages.requestDocuments
                                );
                            case 'taskTitle':
                                return intl.formatMessage(messages.taskTitle);
                            case 'issuingEntity':
                                return intl.formatMessage(messages.initiator);
                            case 'dueDate':
                                return intl.formatMessage(messages.dueDate);
                            case 'receiver':
                                return intl.formatMessage(messages.receiver);
                            case 'progress':
                                return intl.formatMessage(messages.progress);
                            case 'status':
                                return intl.formatMessage(
                                    messages.requestStatus
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
                    {moment(date).format('MMMM Do, YYYY')}
                </Typography>
                <Typography component="p" style={{ color: textgrey }}>
                    <TimeAgo date={date} />
                </Typography>
            </div>
        );
    };

    /**
     *  Render all rows
     */
    renderRequests = (allRequests: Array<Object>) => {
        const { columns } = this.state;
        const { intl, classes } = this.props;

        return _.map(allRequests, r => {
            return _.map(columns, col => {
                switch (col.property) {
                    case 'name':
                        return (
                            <div className={classes.userCellStrong}>
                                {r.name}
                            </div>
                        );
                    case 'taskTitle':
                        return (
                            <div className={classes.userCellStrong}>
                                {r.taskTitle}
                            </div>
                        );
                    case 'issuingEntity':
                        return (
                            <div className={classes.entityField}>
                                <div className={classes.avatarContainer}>
                                    <AvatarOrgPopover
                                        shortName={r.issuingEntity}
                                        className={classes.avatarContainer}
                                    />
                                </div>

                                <div
                                    className={`entityName ${classes.receivingNameContainer}`}
                                >
                                    <Typography
                                        component="p"
                                        className={classes.receivingName}
                                    >
                                        {r.issuingEntity}
                                    </Typography>
                                </div>
                            </div>
                        );

                    case 'receivingEntity':
                        return (
                            <div className={classes.entityField}>
                                <div className={classes.avatarContainer}>
                                    <AvatarOrgPopover
                                        shortName={r.receivingEntity}
                                    />
                                </div>

                                <div className={classes.receivingNameContainer}>
                                    <Typography
                                        component="p"
                                        className={classes.receivingName}
                                    >
                                        {r.receivingEntity}
                                    </Typography>
                                </div>
                            </div>
                        );
                    case 'progress':
                        return intl.formatMessage(messages[r.progress]);
                    case 'dueDate':
                        return this.renderDate(r.dueDate);
                    case 'status':
                        return intl.formatMessage(messages[r.status]);
                    default:
                        return r[col.property];
                }
            });
        });
    };

    /**
     *  Render data list
     */
    render() {
        const { classes, totalRequests, isLoadingRequests } = this.props;
        const {
            paging,
            filterOpen,
            columns,
            renderRequests,
            filter
        } = this.state;

        const options = {
            ...configTable.options,
            page: paging.page,
            rowsPerPage: paging.maxItems,
            count: totalRequests
        };

        return (
            <div className={classes.root}>
                <HeaderTasks
                    onSearch={this.handleSearch}
                    onFilter={this.handleFilterOpen}
                    currentData={this.exportData}
                    getExportData={() => this.getExportData()}
                    formName={FormName}
                    formValues={filter}
                />

                <div
                    style={{
                        paddingTop: '4em',
                        borderBottom: '1px solid #d9dee2'
                    }}
                >
                    <ChartReportsPie />
                </div>

                <div id="bordered-thead">
                    <Table
                        isLoading={isLoadingRequests}
                        columns={columns}
                        options={options}
                        data={renderRequests}
                        onChange={this.handleTableChange}
                        getExportData={this.updateExportData}
                        namespace={NAMESPACE_REQUEST_REPORT}
                    />
                </div>

                <DrawerFilterRequestTasks
                    open={filterOpen}
                    onClose={this.handleFilterClose}
                />
            </div>
        );
    }
}

export default DataListRequestsStatus;
