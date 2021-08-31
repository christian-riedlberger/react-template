// @flow
import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import ProgressBar from 'components/ProgressBar';

type DefaultProps = {
    classes: Object
};

type Props = {
    nodeRef: string,
    files: Object,
    onComplete: Function,
    onError: Function,
    upload: Function
} & DefaultProps;

type State = {
    finished: number,
    queue: Array<any>,
    cancelled: Array<string>
};

const styles = {
    wrapper: {
        width: '100%'
    },
    progressbar: {
        maxHeight: '246px',
        overflowY: 'auto',
        overflowX: 'hidden'
    }
};

/**
 * @summary Wrapper component for ProgressBar components. Handles mapping and creating promises for each file upload and determining when all are completed
 */
class ProgressBarWrapper extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            finished: -1,
            queue: [],
            cancelled: []
        };
    }

    componentDidUpdate = prevProps => {
        const { queue } = this.state;
        if (prevProps.files.length !== this.props.files.length) {
            if (queue.length === 0) {
                const promise = this.uploadChain(
                    _.slice(this.props.files, prevProps.files.length)
                );
                promise();
                this.enqueue(promise);
            } else {
                const promise = this.uploadChain(
                    _.slice(this.props.files, prevProps.files.length)
                );
                this.enqueue(promise);
            }
        }
    };

    enqueue = (promise: any) => {
        this.setState({
            ...this.state,
            queue: _.concat(this.state.queue, promise)
        });
    };

    dequeue = () => {
        const { queue } = this.state;
        if (queue.length > 1) {
            this.setState(
                {
                    ...this.state,
                    queue: _.slice(this.state.queue, 1)
                },
                () => {
                    const next = this.state.queue[0];
                    next();
                }
            );
        } else {
            this.setState({
                ...this.state,
                queue: []
            });
        }
    };

    /**
     *
     * @param {string} id The id of the file you want to cancel
     * @summary Used to prevent future uploads from starting by adding the id to cancelled state array
     */
    handleCancel = (id: string) => {
        this.setState({
            ...this.state,
            cancelled: [...this.state.cancelled, id]
        });
    };

    /**
     *
     * @param {Object} currentFile The file currently being uploading in the chain
     * @returns The cancel token for the current file uploading in the promise chain
     */
    setToken = (currentFile: Object) => {
        if (currentFile) {
            return new axios.CancelToken(c => {
                // eslint-disable-next-line no-param-reassign
                currentFile.cancel = c;
            });
        }
    };

    /**
     *
     * @param {} files Array of files objects to be wrapped into a promise chain
     * @see actions/ActionRepo => uploadFile
     * @summary Creates a chain of promises using each file in the files array ensuring files are uploaded sequentially
     */
    uploadChain = (files: Array<Object>) => {
        const { upload, onError } = this.props;
        return () => {
            return files
                .reduce((chain, currentFile) => {
                    return chain
                        .catch(e => {
                            if (onError && !axios.isCancel(e)) {
                                onError(e);
                            } else {
                                throw e;
                            }
                        })
                        .finally(() => {
                            const isCancelled =
                                _.findIndex(this.state.cancelled, id => {
                                    return id === currentFile.id;
                                }) !== -1 ||
                                this.props.files[
                                    _.findIndex(this.props.files, file => {
                                        return file.id === currentFile.id;
                                    })
                                ].status === 'cancel';
                            // eslint-disable-next-line compat/compat
                            if (isCancelled) return Promise.resolve();
                            return upload(
                                currentFile.file,
                                currentFile.parent,
                                this.setToken(currentFile),
                                currentFile.id
                            );
                        });
                    // eslint-disable-next-line compat/compat
                }, Promise.resolve())
                .finally(() => this.dequeue());
        };
    };

    /**
     * @summary Callback when a file finishes uploading to determine if all files are complete (success or otherwise)
     */
    handleFinish = () => {
        const { files } = this.props;
        if (
            _.every(files, file => {
                return (
                    file.percentCompleted === 100 ||
                    file.percentCompleted === -1
                );
            })
        ) {
            if (this.props.onComplete) this.props.onComplete();
        }
    };

    /**
     * @summary Callback when you click the clear button in the ProgressBar, forces ProgressBar to refresh in order to reflect new state
     */
    handleRemove = () => {
        this.setState({ finished: Date.now() });
    };

    render() {
        const { nodeRef, files, classes } = this.props;
        const { finished } = this.state;

        return (
            <div className={classes.wrapper}>
                <div className={classes.progressbar}>
                    {files.map((fileObject, index) => (
                        <ProgressBar
                            // eslint-disable-next-line react/no-array-index-key
                            key={index + finished}
                            cancel={this.handleCancel}
                            nodeRef={nodeRef}
                            fileObject={fileObject}
                            onFinish={this.handleFinish}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ProgressBarWrapper);
