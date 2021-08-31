// @flow
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { withRouter, Route } from 'react-router';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { mapProps } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { FormName } from 'components/FormFilterFiles';

import Dialog from 'components/Dialog';
import MenuActionsRepo from 'components/MenuActionsRepo';
import Header from 'components/Header';
import HeaderDocuments from 'components/HeaderDocuments';
import DialogPermissions from 'components/DialogPermissions';
import DrawerFilterFiles from 'components/DrawerFilterFiles';
import Table from 'components/Table';

import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import SharedContainer from 'containers/SharedContainer';
import type { ContainerProps as SharedContainerProps } from 'containers/SharedContainer';
import MessageContainer from 'containers/MessageContainer';

import { loadingTable } from 'constants/styles/LoadingStyles';
import {
    REPO_SHARED,
    REPO_BUSINESS,
    REPO_PERSONAL,
    NAMESPACE
} from 'constants/Config';
import messages from 'constants/Messages';
import { getHashPaths, createHashPath } from 'utils/location';
import InformationPage from 'components/InformationPage';

import DialogFolder from 'components/DialogFolder';
import ErrorMessage from 'components/ErrorMessage';
import { renderBreadCrumb, renderFiles, getFileSizeType } from './sections';
import * as configTable from './config/configTable';
import CustomToolbarSelect from './config/CustomToolbarSelect';

const NAMESPACE_DOCLIB = `${NAMESPACE}.doclib`;

// Set default enum
const DEFAULT_FILE_COLUMNS = _.map(configTable.config.columns, col => ({
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
    router: Route,
    activeOrg: Object,
    pagination: Object,
    showMessage: Function,
    formValues: Object
} & RepoContainerProps &
    SharedContainerProps;

type Props = {
    nodeRef: string
} & DefaultProps;

type Paging = {
    maxItems: number,
    skipCount: number,
    page: number
};

type Sorting = {
    name: string,
    direction: string
};

type State = {
    renderData: {
        files: Array<Object>,
        labels: Object
    },
    data: Array<Array<string>>,
    columns: Array<Object>,
    paging: Paging,
    sort: Sorting,
    filter: Object,
    searchTerm: string,
    selectedFiles: Array<Object>,
    filterOpen: boolean,
    selectedNode: {
        name: string,
        nodeRef: string
    },
    contextMenuNode: Object,
    activeTab: number,
    hash: string,
    showHideColumns: boolean
};

const styles = theme => ({
    root: {
        pointerEvents: 'auto',
        '& .MuiTableBody-root': {
            '& .MuiTableRow-root': {
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    '& $shareButton': {
                        opacity: 1,
                        filter: 'alpha(opacity=1)'
                    }
                }
            }
        }
    },
    fileCell: {
        display: 'flex'
    },
    avatar: {
        width: '1.2em',
        height: '1.4em',
        color: '#fff',
        marginRight: '.5em',
        backgroundColor: 'transparent'
    },
    filename: {
        paddingTop: '.5em',
        paddingLeft: '.5em'
    },
    avatarIcon: { fontSize: '1.5em' },
    confirm: {
        minWidth: 250
    },
    userCell: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        '& clr-icon': {
            height: '25px',
            width: '25px'
        }
    },
    userCellStrong: {
        color: '#242528',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        '& clr-icon': {
            height: '25px',
            width: '25px'
        }
    },
    sharedIcon: {
        color: '#cbcbcb',
        paddingLeft: '.5em'
    },
    username: {
        paddingLeft: '.5em',
        paddingTop: '3px'
    },
    align: {
        display: 'flex'
    },
    permissionIcon: {
        color: '#bdc6d0',
        padding: 0,

        '& svg.MuiSvgIcon-root': {
            width: '1.25em',
            height: '1.25em'
        }
    },
    folderCell: {
        height: '25px',
        width: '25px'
    },
    shareButton: {
        paddingTop: '0.3em',
        paddingLeft: '1em',
        opacity: 0,
        filter: 'alpha(opacity=0)'
    },
    hidden: {
        opacity: 0,
        filter: 'alpha(opacity=0)'
    },
    circularProgress: {
        ...loadingTable
    }
});
/**
 *  Data list for files
 *  This datalist handles MUI datatable actions
 */
@withStyles(styles)
@RepoContainer({})
@SharedContainer({})
@MessageContainer()
@withRouter
@mapProps(props => {
    const paths = getHashPaths();

    if (paths[0] === REPO_SHARED) {
        return {
            ...props,
            documents: props.files,
            documentsIsLoading: props.fetchDocumentsIsLoading,
            fetchDataListDocuments: props.fetchSharedDocuments,
            activeFolder: {
                ...props.activeFolder,
                breadcrumb:
                    _.get(props, 'activeFolder.breadcrumb', []).length > 0
                        ? props.activeFolder.breadcrumb
                        : [{ name: 'shared', link: 'shared' }]
            }
        };
    }

    if (paths[0] === REPO_PERSONAL) {
        let breadcrumb: string | undefined = _.get(
            props,
            'activeFolder.breadcrumb'
        );

        if (_.isString(breadcrumb)) {
            // skip "personal" crumb, but add it to the crumb links
            const crumbs = breadcrumb.split('/');
            breadcrumb = _.map(crumbs.slice(1), (crumb, index) => ({
                name: crumb,
                link: `${crumbs.slice(0, index + 1).join('/')}/${crumb}`
            }));
        }

        return {
            ...props,
            activeFolder: {
                ...props.activeFolder,
                breadcrumb
            }
        };
    }
    return props;
})
@injectIntl
@connect(state => ({ formValues: _.get(state.form[FormName], 'values') }))
class DataListFiles extends PureComponent<Props, State> {
    dialogConfirm: Dialog;
    dialogPermissions: DialogPermissions;
    newDialogForm: DialogFolder;

    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            renderData: {
                files: [],
                labels: {}
            },
            columns: DEFAULT_FILE_COLUMNS,
            paging: {
                totalItems: 0,
                maxItems: configTable.config.options.rowsPerPage,
                skipCount: 0,
                page: 0
            },
            sort: {
                name: 'name',
                direction: 'ascending'
            },
            filter: [],
            searchTerm: '',
            selectedFiles: [],
            filterOpen: false,
            selectedNode: {
                name: '',
                nodeRef: ''
            },
            contextMenuNode: {
                node: '',
                coords: {
                    mouseX: null,
                    mouseY: null
                }
            },
            activeTab: 0,
            hash: props.router.location.hash,
            showHideColumns: true
        };
    }

    componentWillMount() {
        this.props.clearActiveFolder();
        this.props.clearDataListDocuments();
    }

    componentDidMount() {
        this.debouncedSearch();
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { needsFilesRefresh } = this.props;

        // test for data changes to update table data
        if (!_.isEqual(prevProps.documents, this.props.documents)) {
            return this.handleDataUpdate();
        }

        if (!_.isEqual(this.state.hash, this.props.router.location.hash)) {
            return this.handlePathUpdate();
        }

        // Search is params change
        if (
            (!_.isEqual(prevProps.activeOrg, this.props.activeOrg) &&
                getHashPaths()[0] !== REPO_PERSONAL) ||
            !_.isEqual(prevState.paging.page, this.state.paging.page) ||
            !_.isEqual(prevState.paging.maxItems, this.state.paging.maxItems) ||
            !_.isEqual(prevState.sort, this.state.sort) ||
            !_.isEqual(prevState.searchTerm, this.state.searchTerm)
        ) {
            return this.debouncedSearch();
        }

        // Refresh table after uploading file(s) into current folder
        if (needsFilesRefresh) {
            this.props.refreshFileFinish();
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

    exportData = {}; // Object used for print / csv

    debouncedSearch = _.debounce(() => {
        const { fetchDataListDocuments } = this.props;
        fetchDataListDocuments(this.getSearchParams());
    }, 500);

    handleDataUpdate = () => {
        const { documents, intl, classes, activeFolder } = this.props;
        const { columns } = this.state;

        const labels = configTable.getLabels(
            getHashPaths()[0] === REPO_SHARED ||
                !_.get(activeFolder, 'permission.create')
        );
        this.updateExportData();
        this.setState({
            renderData: {
                files: renderFiles({
                    columns,
                    files: documents,
                    intl,
                    classes,
                    handleClickPermissions: this.handleClickPermissions,
                    handleContextMenuOpen: this.handleContextMenuOpen
                }),
                labels
            }
        });
    };

    handlePathUpdate = () => {
        const { clearActiveFolder } = this.props;
        const paths = getHashPaths();

        if (paths.length === 1) {
            clearActiveFolder();
        }

        this.setState(
            {
                hash: this.props.router.location.hash,
                paging: {
                    ...this.state.paging,
                    skipCount: 0,
                    page: 0
                }
            },
            this.debouncedSearch
        );
    };

    /**
     * Get the parameters to send via REST
     */
    getSearchParams = () => {
        const pathContext = getHashPaths()[0];

        let orgName = localStorage.getItem('org:active');
        if (!orgName && _.has(this, 'props.activeOrg.shortName')) {
            orgName = _.get(this, 'props.activeOrg.shortName');
        }
        const searchParams = {
            paging: {
                ...this.state.paging,
                skipCount: this.state.paging.maxItems * this.state.paging.page
            },
            sort: _.get(this.state.sort, 'name'),
            desc: _.get(this.state.sort, 'direction'),
            term: _.get(this.state.filter, 'term'),
            maxItems: this.state.paging.maxItems,
            skipCount: this.state.paging.maxItems * this.state.paging.page,
            modifiedBy: _.map(
                _.get(this.state, 'filter.users.users', []),
                'shortName'
            ).join(','),
            modifiedStart: _.get(
                this.state,
                'filter.dateRange.begin',
                undefined
            ),
            modifiedEnd: _.get(this.state, 'filter.dateRange.end', undefined),
            includeFolders: true,
            pathContext,
            path:
                pathContext === REPO_BUSINESS && orgName
                    ? `/${orgName.replace('_ORGANIZATION', '')}/${getHashPaths()
                          .slice(1)
                          .join('/')}`
                    : `/${getHashPaths()
                          .slice(1)
                          .join('/')}`
        };

        if (pathContext === REPO_SHARED) {
            return {
                ...searchParams,
                includeChildren: false,
                parentRef:
                    getHashPaths().length === 2 &&
                    `workspace://SpacesStore/${getHashPaths()[1]}`
            };
        }

        return searchParams;
    };

    /**
     * Update search term
     */
    handleSearch = (search: { term: string }) => {
        const { searchTerm } = this.state;
        if (!_.isEqual(searchTerm, search.term)) {
            this.setState(
                state => {
                    return {
                        ...state,
                        searchTerm: search.term
                    };
                },
                () => {
                    this.debouncedSearch();
                }
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
                {
                    ...this.state,
                    paging: {
                        ...this.state.paging,
                        maxItems: _.isNumber(paging.maxItems)
                            ? paging.maxItems
                            : this.state.paging.maxItems,
                        page: _.isNumber(paging.page)
                            ? paging.page
                            : this.state.paging.page
                    },
                    sort: sort || this.state.sort
                },
                () => this.debouncedSearch()
            );
        }
    };

    /**
     * Filter documents handlers
     */

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

    /**
     * Update visible table columns and corresponding data to be used in print/csv
     */
    updateExportData = (columns?: Array<Object>, dataIndex?: Array<Object>) => {
        const { documents, intl } = this.props;

        const docs = _.map(dataIndex, i => {
            return documents[i];
        });

        this.setState({
            showHideColumns: !!_.isEmpty(dataIndex)
        });

        const rows = _.map(!_.isEmpty(docs) ? docs : documents, doc => {
            const obj = {};
            _.map(doc, (prop, i) => {
                switch (i) {
                    case 'name':
                        obj[intl.formatMessage(messages.documents)] = prop;
                        break;
                    case 'modifier':
                        obj[intl.formatMessage(messages.modifier)] = prop;
                        break;
                    case 'modified':
                        obj[intl.formatMessage(messages.modified)] = moment(
                            prop
                        ).format('MMMM Do, YYYY');
                        break;
                    case 'size':
                        obj[
                            intl.formatMessage(messages.size)
                        ] = getFileSizeType(doc.type, prop);
                        break;
                    default:
                        break;
                }
            });
            obj['File Size'] =
                doc.type === 'cm:folder'
                    ? getFileSizeType(doc.type, '')
                    : obj['File Size'];
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
                                  return intl.formatMessage(messages.documents);
                              case 'modifier':
                                  return intl.formatMessage(messages.modifier);
                              case 'modified':
                                  return intl.formatMessage(messages.modified);
                              case 'size':
                                  return intl.formatMessage(messages.size);
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
     * Return the current export data
     */
    getExportData() {
        return this.exportData;
    }

    /**
     *  Delete files handlers
     */

    // Calls the delete action for each of the files in selectedFiles state
    handleDeleteFiles = () => {
        this.props
            .deleteNode(_.map(this.state.selectedFiles, 'nodeRef'))
            .then(() => this.handleCloseDialog(true))
            .catch(e => {
                throw new Error(e);
            });
    };

    // Add selectedFiles to state and trigger dialog
    toggleConfirmDialog = (selectedIndexes: Array<Object>) => {
        const { documents } = this.props;
        const selectedFiles = _.map(selectedIndexes, index => {
            return documents[index.index];
        });
        this.setState(state => {
            return {
                ...state,
                selectedFiles
            };
        });
    };

    // Reset delete state after close
    handleCloseDialog = (refresh: boolean) => {
        this.setState(
            {
                selectedFiles: []
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
        node?: Object
    ) => {
        event.preventDefault();
        const { documents } = this.props;
        const coords = { mouseX: event.clientX, mouseY: event.clientY };
        this.setState({
            contextMenuNode: {
                node: node || documents[dataIndex],
                coords
            }
        });
    };

    handleContextMenuClose = (refresh: boolean) => {
        if (refresh) {
            this.debouncedSearch();
            this.setState({
                contextMenuNode: {
                    node: null,
                    coords: {
                        mouseX: null,
                        mouseY: null
                    }
                }
            });
        } else {
            this.setState(state => ({
                ...state,
                contextMenuNode: {
                    ...state.contextMenuNode,
                    coords: {
                        mouseX: null,
                        mouseY: null
                    }
                }
            }));
        }
    };

    handleDoubleClick = (row: Array<Object>, dataIndex: number) => {
        const { setActiveFile, router, documents } = this.props;
        if (_.get(documents, `${dataIndex}.type`) === 'cm:folder') {
            const paths = getHashPaths();
            const doc = _.get(documents, `${dataIndex}`);
            router.push(
                createHashPath(
                    paths[0] === REPO_SHARED
                        ? _.concat(
                              REPO_SHARED,
                              doc.nodeRef.split('/').slice(-1)
                          )
                        : _.concat(paths, doc.shortName || doc.name)
                )
            );
        } else {
            setActiveFile(documents[dataIndex]);
            router.push(
                `/documents/details/${documents[dataIndex].nodeRef
                    .split('/')
                    .pop()}`
            );
        }
    };

    handleDrop = (rows: Array<number>, targetIndex: number) => {
        const { documents, moveNode, showMessage } = this.props;
        const target = documents[targetIndex];
        const selectedNodes = _.map(rows, row => {
            return documents[row];
        });
        if (target.type === 'cm:folder' && target.permission.create) {
            showMessage({
                message: 'movePending',
                variant: 'pending'
            });
            moveNode(_.map(selectedNodes, 'nodeRef'), target.nodeRef)
                .then(response => {
                    if (response.value.data.status !== 200) {
                        showMessage({
                            message: response.value.data.error[0],
                            variant: 'error'
                        });
                    } else {
                        showMessage({
                            message: 'moveSuccess',
                            variant: 'success'
                        });
                    }
                    this.handleCloseDialog(true);
                    return null;
                })
                .catch(e => {
                    showMessage({
                        message: 'messageFolderCopyError',
                        variant: 'error',
                        info: e
                    });
                    throw e;
                });
        }
    };

    /**
     * Permissions Folders handlers
     */
    handleClickPermissions = (node: Object) => {
        this.setState({
            selectedNode: {
                name: node.name,
                nodeRef: node.nodeRef
            }
        });
        this.dialogPermissions.open();
    };

    /**
     * store active tab
     */
    handleTabChange = (index: number) => {
        this.setState({ activeTab: index });
    };

    /**
     * Create new folder
     */
    handleNewFolder = (event: SyntheticEvent<any>) => {
        event.preventDefault();
        this.newDialogForm.open();
    };

    /**
     * Save folder
     */
    handleNewSaveFolder = () => {
        this.newDialogForm.close();
    };

    /** Render errors  */
    renderError = () => {
        const { documentsError } = this.props;

        return (
            <ErrorMessage
                icon="/css/img/icons/node-missing.svg"
                errors={documentsError}
            />
        );
    };

    /**
     *  Render data list
     */
    render() {
        const {
            intl,
            classes,
            documentsIsLoading,
            pagination,
            activeFolder,
            documents,
            documentsError,
            activeRepo
        } = this.props;
        const {
            columns,
            renderData,
            filterOpen,
            selectedNode,
            contextMenuNode,
            filter,
            showHideColumns
        } = this.state;

        const options = {
            ...configTable.config.options,
            page: this.state.paging.page,
            count: _.get(pagination, 'totalItems'),
            rowsPerPage: this.state.paging.maxItems,
            textLabels: renderData.labels,
            customToolbarSelect: (
                selectedRows,
                displayData,
                setSelectedRows
            ) => (
                <CustomToolbarSelect
                    selectedRows={selectedRows}
                    displayData={displayData}
                    setSelectedRows={setSelectedRows}
                    documentList={documents}
                    debouncedSearch={this.debouncedSearch}
                    onSave={() => this.handleContextMenuClose(true)}
                    onClose={() => this.handleContextMenuClose(false)}
                />
            )
        };

        if (documentsError && documentsError.length > 0) {
            return (
                <div className={classes.error}>
                    <Header page="documents" />
                    {this.renderError()}
                </div>
            );
        }

        let menuActions = [
            'view',
            'edit',
            'move',
            'copy',
            'delete',
            'permissions',
            'download',
            'properties',
            'open'
        ];
        if (activeRepo === REPO_SHARED)
            menuActions = [
                'view',
                'edit',
                'copy',
                'delete',
                'permissions',
                'download',
                'properties',
                'open'
            ];

        return (
            <div className={classes.root}>
                <Header page="documents" disableBreadcrumb />

                <InformationPage
                    allowHide
                    limit={500}
                    fullWidth
                    customStyle="header-tip"
                    message="paymentReviewInformation"
                    namespace={NAMESPACE_DOCLIB}
                />

                <HeaderDocuments
                    onSearch={this.handleSearch}
                    onFilter={this.handleFilterOpen}
                    currentData={this.exportData}
                    getExportData={() => this.getExportData()}
                    handleNew={this.handleNewFolder}
                    formName={FormName}
                    formValues={filter}
                    showHideColumns={showHideColumns}
                />

                {renderBreadCrumb({
                    classes,
                    activeFolder,
                    handleClickPermissions: this.handleClickPermissions,
                    intl,
                    isLoading: documentsIsLoading
                })}

                <div id="bordered-thead">
                    <Table
                        isLoading={documentsIsLoading}
                        columns={columns}
                        options={options}
                        data={renderData.files}
                        onChange={this.handleTableChange}
                        onDoubleClick={this.handleDoubleClick}
                        onContextMenuOpen={this.handleContextMenuOpen}
                        onDragNDrop={this.handleDrop}
                        getExportData={this.updateExportData}
                        namespace={NAMESPACE_DOCLIB}
                    />
                </div>

                <DialogPermissions
                    passRef={r => {
                        this.dialogPermissions = r;
                    }}
                    title={selectedNode.name}
                    nodeRef={selectedNode.nodeRef}
                    onSave={() => this.handleContextMenuClose(true)}
                />

                <DrawerFilterFiles
                    open={filterOpen}
                    onClose={this.handleFilterClose}
                />
                <DialogFolder
                    passRef={r => {
                        this.newDialogForm = r;
                    }}
                    parentFolder={activeFolder}
                    onSave={this.handleNewSaveFolder}
                />
                <MenuActionsRepo
                    file={contextMenuNode.node}
                    onSave={() => this.handleContextMenuClose(true)}
                    onClose={() => this.handleContextMenuClose(false)}
                    coords={contextMenuNode.coords}
                    actions={menuActions}
                />
            </div>
        );
    }
}

export default DataListFiles;
