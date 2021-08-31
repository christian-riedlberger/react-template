// @flow
import React, { Fragment, Component } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import FileViewer from 'react-file-viewer';
import { withRouter, browserHistory } from 'react-router';

import Comments from 'components/LayoutComments';
import PDFViewer from 'components/PDFViewer';
import LayoutVersionHistory from 'components/LayoutVersionHistory';
import WorkflowActions from 'components/WorkflowActions';
import ErrorMessage from 'components/ErrorMessage';
import AlertLocked from 'components/AlertLocked';
import Loading from 'components/Loading';
import SpreadsheetViewer from 'components/SpreadsheetViewer';

import RepoContainer from 'containers/RepoContainer';
import TasksContainer from 'containers/TasksContainer';
import type { ContainerProps as RepoProps } from 'containers/RepoContainer';
import VersionContainer from 'containers/VersionContainer';
import type { ContainerProps as VersionProps } from 'containers/VersionContainer';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import * as theme from 'constants/Theme';
import { isPreviewable } from 'utils/mimetype';
import { serializeTask } from 'actions/ActionTasks';
import {
    FILE_VIEW,
    DOCUMENT_PREVIEW_API,
    PDF_PREVIEW_API
} from 'constants/ServiceURI';

import {
    renderDocumentDetails,
    renderHeader,
    renderWorkflowDetails,
    renderIssueingOrg
} from './sections';

type DefaultProps = {
    intl: intlShape,
    updateRequest: Function,
    serverMessage: Array<string>,
    location: Object,
    ...VersionProps
} & RepoProps;

type Props = {
    workflowId: number
} & DefaultProps;

type State = {
    tasks: Array<Object>,
    index: number,
    cache: number,
    id: number,
    loading: boolean
};

let singletonUpdateRequest = 0;
const styles = {
    root: {
        margin: '0 -2.3em'
    },
    head: {
        paddingLeft: '2.2em',
        marginTop: '-1.5em',
        paddingBottom: '1.5em'
    },
    header: {
        display: 'flex'
    },
    backButton: {
        marginRight: '1em',
        width: '0.5em',
        minWidth: 'auto',
        top: '4px',
        boxShadow: 'none!important',
        padding: '0.5em 1.1em',
        height: '44px',
        position: 'relative'
    },
    page: {
        // file viewer & comments
        width: '80vw'
    },
    preview: {
        // file viewer div
        margin: '0 auto'
    },
    comments: {
        // comments div
    },
    fileViewer: {
        background: '#818181',
        width: '100%',
        height: '60vh',

        '& .photo-viewer-container': {
            margin: '0 auto'
        }
    },
    details: {
        // right sidebar
        minHeight: '82vh',
        backgroundColor: '#F3F3F3',
        padding: '1.5em 0.5em 0 1.5em'
    },
    inline: {
        display: 'inline'
    },
    list: {
        '& li': {
            paddingLeft: '0'
        }
    },
    appbar: {
        backgroundColor: theme.hue2,
        height: '5vh'
    },
    sidebarComponents: {
        marginBottom: '1.2em'
    },
    docName: {
        fontSize: '1.5em'
    },
    label: {
        color: theme.hue4,
        fontSize: '0.8em'
    },
    prop: {
        fontSize: '1em'
    },
    editDetails: {
        color: '#87888a',
        fontSize: '1em'
    }
};
@VersionContainer({ pick: 'versionHistory' })
@RepoContainer()
@TasksContainer()
@injectIntl
@withStyles(styles)
@withRouter
class LayoutWorkflowDocumentDetails extends Component<Props, State> {
    constructor(props: Object) {
        super(props);
        this.state = {
            tasks: _.map(props.workflowId.split(','), taskString => ({
                isWorkflow: taskString.indexOf('workflow') > -1,
                id: taskString.split('$')[1],
                complete: false
            })),
            index: 0,
            cache: new Date().getTime(),
            id: this.props.versionHistory.length,
            loading: true
        };
    }

    componentDidMount() {
        this.props.pushRecentTask(this.props.location.pathname);
        this.getTask()
            .then(r => {
                const data = serializeTask(r.action.payload.data.data);
                const packageNodeRef = _.get(data, 'package');
                return (
                    this.props
                        .fetchDocument(packageNodeRef)
                        // eslint-disable-next-line promise/always-return
                        .then(() => {
                            this.setState({
                                loading: false
                            });
                        })
                        .catch(e => {
                            throw e;
                        })
                );
            })
            .catch(e => {
                throw e;
            });
    }

    componentDidUpdate(prevProps: Object, prevState: Object) {
        const { activeFile, versionHistory, forceVersionUpdate } = this.props;
        const activePackage = activeFile; // Repo passes active package for workflow

        if (!activeFile) return null;

        // Handle page change
        if (!_.isEqual(prevState.index, this.state.index)) {
            this.getTask()
                // eslint-disable-next-line promise/always-return
                .then(r => {
                    const data = serializeTask(r.action.payload.data.data);
                    const packageNodeRef = _.get(data, 'package');
                    this.props
                        .fetchDocument(packageNodeRef)
                        // eslint-disable-next-line promise/always-return
                        .then(() => {
                            this.setState({
                                loading: false
                            });
                        })
                        .catch(e => {
                            throw e;
                        });
                })
                .catch(e => {
                    throw e;
                });
        }

        if (
            activePackage &&
            activePackage.files &&
            activePackage.files.length > 0
        ) {
            if (
                prevProps.activeFile &&
                prevProps.activeFile.nodeRef !== activePackage.nodeRef
            ) {
                singletonUpdateRequest = 0;
            }

            // Change status to seen
            // Only once when document is pending
            if (
                singletonUpdateRequest === 0 &&
                activePackage.files[0].status === 'pending'
            ) {
                singletonUpdateRequest += 1;
                this.props.updateRequest(activePackage.files[0].nodeRef, {});
            }
        }

        // handle new version upload / revert
        if (
            !_.isEmpty(prevProps.versionHistory) &&
            !_.isEmpty(versionHistory) &&
            prevProps.versionHistory.length !== versionHistory.length
        ) {
            this.props
                .fetchDocument(activePackage.nodeRef)
                // eslint-disable-next-line promise/always-return
                .then(() => {
                    this.setState({
                        cache: new Date().getTime(),
                        loading: false
                    });
                })
                .catch(e => {
                    throw e;
                });
        }

        if (forceVersionUpdate && activeFile) {
            this.props
                .fetchDocument(activeFile.nodeRef)
                .then(() =>
                    this.setState({
                        id: this.props.versionHistory.length,
                        cache: new Date().getTime(),
                        loading: false
                    })
                )
                .catch(e => {
                    throw e;
                });
        }
    }

    componentWillUnmount() {
        this.props.clearActiveFile();
    }

    getTask = () => {
        const { tasks, index } = this.state;

        return this.props.fetchTask(
            `activiti$${tasks[index].id}`,
            _.pick(tasks[index], 'isWorkflow')
        );
    };

    setActiveIndex = (newIndex: number, isComplete: boolean) => {
        const { index, tasks } = this.state;
        // check which tasks are already complete
        const temp = [...tasks];
        if (isComplete) temp[index].complete = isComplete;
        if (_.every(temp, ['complete', true])) {
            this.setState({
                tasks: temp
            });
        } else {
            this.setState({
                index:
                    newIndex === -1
                        ? _.findIndex(temp, ['complete', false])
                        : newIndex,
                tasks: temp
            });
        }
    };

    handleBackClick = () => {
        return browserHistory.goBack();
    };

    /**
     * Render document previewer
     * Implements PDFViewer, FileViewer, ExcelViewer
     */
    renderPreviewer = (activeFile: Object) => {
        const { cache, id } = this.state;
        const { classes } = this.props;
        if (!activeFile || !activeFile.nodeRef) return null;

        const type = activeFile.mimetype.split('/')[1];

        if (
            type === 'xlsx' ||
            type === 'csv' ||
            type === 'vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            type === 'vnd.ms-excel'
        )
            return (
                <div>
                    <SpreadsheetViewer
                        fileType={type}
                        nodeRef={activeFile.nodeRef}
                    />
                </div>
            );

        const canPDFPreview = isPreviewable(activeFile.mimetype);
        const nodeId = activeFile.nodeRef.split('/').pop();

        // Don't need transform if it is already PDF
        const PREVIEW_API =
            activeFile.mimetype === 'application/pdf'
                ? PDF_PREVIEW_API
                : DOCUMENT_PREVIEW_API;

        if (canPDFPreview)
            // $FlowFixMe
            return <PDFViewer src={PREVIEW_API(activeFile.nodeRef, cache)} />;

        return (
            <div className={classes.fileViewer}>
                <FileViewer
                    fileType={type}
                    filePath={FILE_VIEW(nodeId)}
                    key={id}
                />
            </div>
        );
    };

    /** Render errors  */
    renderError = (errorMessage: Array<string>) => {
        return (
            <ErrorMessage
                icon="/css/img/icons/task-missing.svg"
                errors={errorMessage}
            />
        );
    };

    render() {
        const {
            activeFile,
            classes,
            activeTask,
            intl,
            serverMessage,
            isLoadingFetchTask
        } = this.props;
        const { tasks, index, loading } = this.state;

        const activePackage = activeFile;
        const errorMessage = serverMessage;

        if (!isLoadingFetchTask && !loading) {
            if (!activePackage || !activePackage.files) {
                return <Loading height={50} />;
            }
        }

        if (errorMessage && errorMessage.length > 0) {
            return (
                <div className={classes.error}>
                    {this.renderError(errorMessage)}
                </div>
            );
        }

        let currentFile = {};
        let taskType = '';
        let isLocked = false;
        let isReadOnly = false;

        if (activePackage && activePackage.files) {
            currentFile = activePackage.files[0];
            isReadOnly = currentFile.permission.create === false;

            isLocked = currentFile.permission.lockdown && !currentFile.verified;
        }

        if (isLocked) return <AlertLocked />;

        if (activeTask)
            taskType = !activeTask.tskName ? 'notAssignee' : activeTask.tskName;

        return (
            <div className={classes.root}>
                {activePackage && activePackage.nodeRef ? (
                    <Fragment>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <div className={classes.head}>
                                    {renderHeader(
                                        currentFile,
                                        classes,
                                        intl,
                                        this.handleBackClick
                                    )}
                                </div>
                                <Divider />
                                <WorkflowActions
                                    taskType={taskType}
                                    tasks={tasks}
                                    index={index}
                                    setActiveIndex={this.setActiveIndex}
                                    activeTask={activeTask}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={0}>
                            <Grid item xs={8} className={classes.page}>
                                <div className={classes.preview}>
                                    {this.renderPreviewer(currentFile)}
                                </div>
                                <div className={classes.comments}>
                                    <Comments nodeRef={currentFile.nodeRef} />
                                </div>
                            </Grid>
                            <Grid item xs={4} style={{ background: '#f3f3f3' }}>
                                <div className={classes.details}>
                                    {renderIssueingOrg(activeTask, classes)}
                                    {renderWorkflowDetails(activeTask, classes)}
                                    {renderDocumentDetails(
                                        currentFile,
                                        classes
                                    )}
                                    <LayoutVersionHistory
                                        activeFile={activeFile}
                                        isReadOnly={isReadOnly}
                                        nodeRef={currentFile.nodeRef}
                                        className={classes.sidebarComponents}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Fragment>
                ) : null}
            </div>
        );
    }
}

export default LayoutWorkflowDocumentDetails;
