import React, { Component } from 'react';
import { browserHistory, withRouter } from 'react-router';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import FileViewer from 'react-file-viewer';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Comments from 'components/LayoutComments';
import PDFViewer from 'components/PDFViewer';
import LayoutVersionHistory from 'components/LayoutVersionHistory';
import AlertLocked from 'components/AlertLocked';
import ErrorMessage from 'components/ErrorMessage';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps } from 'containers/RepoContainer';
import VersionContainer from 'containers/VersionContainer';
import type { ContainerProps as VersionProps } from 'containers/VersionContainer';
import SpreadsheetViewer from 'components/SpreadsheetViewer';
import * as theme from 'constants/Theme';

import {
    FILE_VIEW,
    DOCUMENT_PREVIEW_API,
    PDF_PREVIEW_API
} from 'constants/ServiceURI';
import { isPreviewable } from 'utils/mimetype';

import { renderProperties, renderHeader } from './sections';

type DefaultProps = {
    intl: intlShape,
    ...ContainerProps,
    ...VersionProps
};

type Props = {
    documentId: number
} & DefaultProps;

const styles = {
    root: {
        margin: '0 -2.25em'
    },
    head: {
        paddingLeft: '2.1em',
        marginTop: '-1.5em',
        paddingBottom: '1.5em',
        borderBottom: '1px solid #d0cece'
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
    fileViewer: {
        background: '#818181',
        width: '100%',
        height: '60vh',

        '& .photo-viewer-container': {
            margin: '0 auto'
        }
    },
    comments: {
        // comments div
    },
    details: {
        // right sidebar
        minHeight: '82vh',
        backgroundColor: '#F3F3F3',
        padding: '0.5em 0.5em 0 1.5em'
    },
    versionHistory: {
        paddingTop: '1.6em'
    },
    properties: {
        paddingLeft: '10px'
    },
    label: {
        color: theme.hue4,
        fontSize: '0.8em'
    },
    prop: {
        fontSize: '1.05em'
    },
    docName: {
        fontSize: '1.5em'
    },
    editDetails: {
        color: '#87888a',
        fontSize: '1em'
    },
    sidebarComponents: {}
};
@VersionContainer()
@RepoContainer({
    // documentRef used on mount to get file data and place in redux -> repo -> activeFile
    documentRef: (props: Props) => `workspace://SpacesStore/${props.documentId}`
})
@injectIntl
@withStyles(styles)
@withRouter
class LayoutDocumentDetails extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.versionHistory.length,
            cache: new Date().getTime()
        };
    }

    componentDidMount() {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
            id: this.props.versionHistory.length
        });
    }

    componentDidUpdate(prevProps) {
        const {
            versionHistory,
            fetchDocument,
            activeFile,
            forceVersionUpdate
        } = this.props;
        if (
            !_.isEmpty(prevProps.versionHistory) &&
            !_.isEmpty(versionHistory) &&
            prevProps.versionHistory.length !== versionHistory.length &&
            activeFile
        ) {
            fetchDocument(activeFile.nodeRef)
                .then(() =>
                    this.setState({
                        id: this.props.versionHistory.length,
                        cache: new Date().getTime()
                    })
                )
                .catch(e => {
                    throw e;
                });
        }

        if (forceVersionUpdate && activeFile) {
            fetchDocument(activeFile.nodeRef)
                .then(() =>
                    this.setState({
                        id: this.props.versionHistory.length,
                        cache: new Date().getTime()
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

    handleBackClick = () => {
        const { router } = this.props;

        if (window.history.length > 1) {
            return browserHistory.goBack();
        }

        return router.push('/documents#/business');
    };

    /**
     * Render document previewer
     * Implements PDFViewer, FileViewer, ExcelViewer
     */
    renderPreviewer = () => {
        const { id, cache } = this.state;
        const { activeFile, documentId, classes } = this.props;
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

        // Don't need transform if it is already PDF
        const PREVIEW_API =
            activeFile.mimetype === 'application/pdf'
                ? PDF_PREVIEW_API
                : DOCUMENT_PREVIEW_API;

        if (canPDFPreview)
            return <PDFViewer src={PREVIEW_API(activeFile.nodeRef, cache)} />;

        return (
            <div className={classes.fileViewer}>
                <FileViewer
                    fileType={type}
                    filePath={FILE_VIEW(documentId)}
                    key={id}
                />
            </div>
        );
    };

    /** Render errors  */
    renderError = () => {
        const { documentsError } = this.props;

        return (
            <ErrorMessage
                icon="/css/img/icons/document-missing.svg"
                errors={documentsError}
            />
        );
    };

    render() {
        const { activeFile, classes, intl, documentsError } = this.props;

        if (documentsError && documentsError.length > 0) {
            return <div className={classes.error}>{this.renderError()}</div>;
        }

        if (!activeFile || !activeFile.permission) return null;

        const isReadOnly = !activeFile.permission.create;
        const isLocked = activeFile.permission.lockdown && !activeFile.verified;

        if (isLocked) return <AlertLocked />;

        return (
            <div className={classes.root}>
                {activeFile && activeFile.nodeRef ? (
                    <div>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <div className={classes.head}>
                                    {renderHeader(
                                        activeFile,
                                        intl,
                                        classes,
                                        this.handleBackClick
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0}>
                            <Grid item xs={8} className={classes.page}>
                                <div className={classes.preview}>
                                    {this.renderPreviewer()}
                                </div>
                                <div className={classes.comments}>
                                    <Comments nodeRef={activeFile.nodeRef} />
                                </div>
                            </Grid>
                            <Grid item xs={4} style={{ background: '#f3f3f3' }}>
                                <div className={classes.details}>
                                    {renderProperties(activeFile, classes)}

                                    <LayoutVersionHistory
                                        activeFile={activeFile}
                                        isReadOnly={isReadOnly}
                                        nodeRef={activeFile.nodeRef}
                                        className={classes.versionHistory}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default LayoutDocumentDetails;
