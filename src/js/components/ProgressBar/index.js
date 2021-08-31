// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import messages from 'constants/Messages';
import RepoContainer from 'containers/RepoContainer';
import _ from 'lodash';
import { log } from 'utils/logger';

type DefaultProps = {
    classes: Object,
    intl: intlShape
};

type Props = {
    fileObject: any,
    cancel: Function,
    onFinish: Function,
    uploadFileRemove: Function,
    uploadFileCancel: Function,
    uploadFileError: Function
} & DefaultProps;

type State = {
    name: string,
    success: boolean,
    aborted: boolean,
    total: number,
    loaded: number,
    percent: number,
    unauthorized: boolean,
    error: Array<Object>,
    promise: any,
    progress: Object,
    cleared: boolean,
    cancelComplete: boolean
};

const styles = {
    progressbar: {
        display: 'flex',
        flexWrap: 'nowrap'
    },
    percent: {
        position: 'relative',
        top: '13px',
        paddingRight: '5px'
    },
    file: {
        flex: 3,
        width: '80%',
        alignSelf: 'center'
    },
    name: {
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'relative',
        zIndex: 9999
    },
    actions: {
        top: '15px'
    },
    progressCircle: {},
    error: {
        backgroundColor: '#ff7449',
        color: '#fff'
    }
};

type Response = {
    response: {
        status: Object,
        data: Object
    }
};

class ProgressBar extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            name: '',
            success: false,
            aborted: false,
            total: 0,
            loaded: 0,
            percent: 0,
            unauthorized: false,
            error: [],
            promise: null,
            progress: null,
            cleared: false,
            cancelComplete: false
        };
    }

    componentDidUpdate() {
        const { fileObject, onFinish, cancel, uploadFileCancel } = this.props;
        const { success, aborted, cancelComplete } = this.state;

        // Checks to see if the cancel all button has been pressed and we haven't already finished, sets the file up to be cancelled if true
        if (fileObject.status === 'abort' && !aborted && !success) {
            this.abort();
        }

        // Check to see if this file needs to be cancelled
        if (aborted && fileObject.percentCompleted !== -1) {
            if (fileObject.cancel) {
                fileObject.cancel();
            } else {
                cancel(fileObject.id);
            }
            uploadFileCancel(fileObject.id, false);
        }

        // Check to see if the file successfully completed
        if (fileObject.percentCompleted >= 100 && !success) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(
                {
                    ...this.state,
                    success: true
                },
                () => {
                    if (onFinish) onFinish();
                }
            );
        }

        // Enable the onFinish callback when we successfully cancel the upload
        if (fileObject.percentCompleted === -1 && !cancelComplete) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(
                {
                    ...this.state,
                    cancelComplete: true
                },
                () => {
                    if (onFinish) onFinish();
                }
            );
        }
    }

    // Cancel an upload
    abort = () => {
        this.setState({
            ...this.state,
            aborted: true,
            name: 'Aborted'
        });
    };

    // Remove a completed upload from the list
    clear = () => {
        const { fileObject, uploadFileRemove } = this.props;
        this.setState(
            {
                cleared: true
            },
            () => uploadFileRemove(fileObject.id)
        );
    };

    // Display error message to user
    onError = (e: Error | Response) => {
        const { intl, uploadFileError, fileObject, onFinish } = this.props;
        const { error } = this.state;
        const state = {
            ...this.state,
            success: false,
            error
        };

        log('error', 'blue', { e });

        if (_.get(e, 'response.status') === 403) {
            state.unauthorized = true;
        } else if (_.get(e, 'response.status') === 413) {
            error.push({
                response: {
                    statusText: intl.formatMessage(messages.maxSizeUploadLimit)
                }
            });
        } else if (
            _.has(e, 'response.status.name') &&
            _.has(e, 'response.data.message')
        ) {
            // $FlowFixMe
            const errorMessageArray = e.response.data.message.split(/\r?\n/);
            error.push({
                response: {
                    // $FlowFixMe
                    statusText: e.response.status.name,
                    statusDetails:
                        errorMessageArray[errorMessageArray.length - 1]
                }
            });
        } else {
            error.push({
                response: {
                    statusText: '',
                    statusDetails: ''
                }
            });
        }
        this.setState(state, () => {
            uploadFileError(fileObject);
            if (onFinish) onFinish();
        });
    };

    /**
     *  Render icon based on status
     */
    renderStatusText = () => {
        const { classes, fileObject } = this.props;
        const { success, aborted, unauthorized, error } = this.state;

        if (aborted) return <CancelIcon />;
        else if (unauthorized) return <ErrorIcon />;
        else if (error.length > 0) return <ErrorIcon />;
        else if (success) return <CheckCircleIcon />;

        return (
            <CircularProgress
                variant="static"
                value={fileObject.percentCompleted}
                size={19}
                thickness={5}
                className={classes.progressCircle}
            />
        );
    };

    /**
     *  Render file name
     *  Or render message
     */
    renderFileName = () => {
        const { fileObject, intl } = this.props;
        const { aborted, unauthorized, error } = this.state;
        if (unauthorized) {
            return intl.formatMessage(messages.errorUnauthorizedFolder);
        }

        if (error && error.length > 0) {
            return (
                <Tooltip
                    title={error[0].response.statusDetails}
                    placement="top"
                    style={{ cursor: 'default' }}
                >
                    <span>
                        {error[0].response.statusText ||
                            intl.formatMessage(messages.uploadFailed, {
                                filename: _.get(fileObject, 'file.name', '')
                            })}
                    </span>
                </Tooltip>
            );
        }

        if (aborted) {
            return intl.formatMessage(messages.cancelled);
        }

        return _.get(fileObject, 'file.name', '');
    };

    render() {
        const { success, aborted, unauthorized, error } = this.state;
        const { classes, intl, fileObject } = this.props;
        if (this.state.cleared || !fileObject.file) return null;
        return (
            <div className={classes.progressbar}>
                <div className={classes.percent}>{this.renderStatusText()}</div>
                <div className={classes.file}>
                    <div className={classes.name}>{this.renderFileName()}</div>
                </div>
                <div className={classes.actions}>
                    <span className="action">
                        <Tooltip
                            title={
                                success ||
                                aborted ||
                                unauthorized ||
                                error.length > 0
                                    ? intl.formatMessage(messages.clear)
                                    : intl.formatMessage(messages.cancel)
                            }
                            placement="right"
                        >
                            <IconButton
                                onClick={
                                    success ||
                                    aborted ||
                                    unauthorized ||
                                    error.length > 0
                                        ? () => this.clear()
                                        : () => this.abort()
                                }
                            >
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    </span>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(RepoContainer()(injectIntl(ProgressBar)));
