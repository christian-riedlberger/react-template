// @flow
import React, { Fragment, Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import _ from 'lodash';

import Button from 'components/Button';
import Dialog from 'components/Dialog';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, Button as MUIButton } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import TasksContainer from 'containers/TasksContainer';
import { textgrey } from 'constants/Theme';
import messages from 'constants/Messages';

type Props = {
    taskType: Object,
    intl: intlShape,
    classes: Object,
    tasks: Array<{ id: string, isWorkflow: boolean, complete: boolean }>,
    index: number,
    setActiveIndex: Function,
    router: any,
    updateTask: Function
};

type State = {
    completeOpen: boolean,
    confirmOpen: boolean,
    confirmMessage: string
};

const styles = {
    root: {
        margin: '0em 0 0em 0em',
        padding: '1em 0em',
        paddingLeft: '2em',
        borderBottom: '1px solid #ccc'
    },
    buttonRoot: {
        color: textgrey
    },
    buttonContainer: {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    nextLink: {
        color: textgrey
    },
    orText: {
        display: 'flex',
        width: '44px',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignContent: 'space-between',
        padding: 0
    }
};
@withRouter
@TasksContainer()
class WorkflowActions extends Component<Props, State> {
    state = {
        completeOpen: false,
        confirmOpen: false,
        confirmMessage: ''
    };

    componentDidUpdate() {
        const { tasks } = this.props;
        const { completeOpen } = this.state;
        // trigger a modal to tell the user that they are done
        // Send the user to /requests/received on modal close
        if (_.every(tasks, ['complete', true]) && completeOpen === false) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(state => {
                return {
                    ...state,
                    completeOpen: true
                };
            });
        }
    }

    /** Render the next and previous buttons based on the position of the current task */
    renderNextAndPrevious = () => {
        const { setActiveIndex, tasks, index } = this.props;
        return (
            <Fragment>
                <MUIButton
                    disabled={index === 0}
                    onClick={() => setActiveIndex(index - 1, false)}
                >
                    <ChevronLeftIcon
                        style={{
                            lineHeight: '1em',
                            fontSize: '2em',
                            marginLeft: '0',
                            marginRight: '-.4em'
                        }}
                    />
                </MUIButton>
                <span>{`${index + 1} of ${tasks.length} documents`}</span>

                <MUIButton
                    disabled={index === tasks.length - 1}
                    onClick={() => setActiveIndex(index + 1, false)}
                >
                    <ChevronRightIcon
                        style={{
                            lineHeight: '1em',
                            fontSize: '2em',
                            marginLeft: '0',
                            marginRight: '-.4em'
                        }}
                    />
                </MUIButton>
            </Fragment>
        );
    };

    handleUpdateTask = taskObj => {
        const { setActiveIndex, tasks, index } = this.props;

        this.props
            .updateTask({
                ...taskObj,
                taskId: tasks[index].id,
                prop_gfr_stage: 'REVIEW',
                prop_transitions: 'Next'
            })
            .then(r => {
                this.setState(state => {
                    return {
                        ...state,
                        confirmOpen: false,
                        confirmMessage: ''
                    };
                });

                if (tasks.length - 1 > index) {
                    setActiveIndex(index + 1, true);
                } else if (tasks.length - 1 === index) {
                    setActiveIndex(-1, true);
                }
                return r;
            })
            .catch(e => {
                throw e;
            });
    };

    /**
     *  Send the request to update task
     */

    confirmAcknowledge = () => {
        this.setState(state => {
            return {
                ...state,
                confirmOpen: true,
                confirmMessage: 'acknowledgeConfirm'
            };
        });
    };
    handleAcknowledgeAccept = () => {
        this.handleUpdateTask({
            prop_gfr_approveRejectOutcome: 'compliant'
        });
    };

    /**
     * Handle revision
     */
    handleRevisionClick = () => {
        this.setState(state => {
            return {
                ...state,
                confirmOpen: true,
                confirmMessage: 'askForRevisionConfirm'
            };
        });
    };
    handleRevisionAccept = () => {
        this.handleUpdateTask({
            prop_gfr_approveRejectOutcome: 'Reject'
        });
    };

    /**
     * Handle acknowledge button click
     */
    confirmNotCompliant = () => {
        this.setState(state => {
            return {
                ...state,
                confirmOpen: true,
                confirmMessage: 'notCompliantConfirm'
            };
        });
    };
    handleNotCompliantAccept = () => {
        this.handleUpdateTask({
            prop_gfr_approveRejectOutcome: 'notCompliant'
        });
    };

    /**
     * Handle not applicable button click
     */
    confirmNA = () => {
        this.setState(state => {
            return {
                ...state,
                confirmOpen: true,
                confirmMessage: 'notApplicableConfirm'
            };
        });
    };
    handleNAAccept = () => {
        this.handleUpdateTask({
            prop_gfr_approveRejectOutcome: 'na'
        });
    };

    /**
     * Handle task done button click
     */
    handleTaskDoneClick = () => {
        this.handleUpdateTask();
    };

    /**
     * Handle closing of the dialog
     */
    handleClose = () => {
        const { router } = this.props;
        this.setState(state => {
            return {
                ...state,
                confirmOpen: false,
                completeOpen: false
            };
        });
        router.push('/requests/received');
    };

    /**
     * Handle canceling of confirm dialog
     */

    handleCancel = () => {
        this.setState(state => {
            return {
                ...state,
                confirmOpen: false,
                confirmMessage: ''
            };
        });
    };

    /**
     * Handle function calls when confirm dialog is accepted
     */
    handleAccept = () => {
        const { confirmMessage } = this.state;
        switch (confirmMessage) {
            case 'acknowledgeConfirm':
                this.handleAcknowledgeAccept();
                break;
            case 'askForRevisionConfirm':
                this.handleRevisionAccept();
                break;
            case 'notCompliantConfirm':
                this.handleNotCompliantAccept();
                break;
            case 'notApplicableConfirm':
                this.handleNAAccept();
                break;
            default:
                break;
        }
    };

    render() {
        const {
            taskType,
            intl,
            classes,
            tasks,
            index,
            setActiveIndex
        } = this.props;
        const { confirmOpen, confirmMessage, completeOpen } = this.state;

        return (
            <Fragment>
                <Grid container className={classes.root}>
                    <Grid item xs={9} className={classes.buttonRoot}>
                        {taskType === 'gfr:stdReview' && (
                            <div className={classes.buttonContainer}>
                                <Button
                                    data-cy="acknowledgeButton"
                                    text="acknowledgeButton"
                                    icon={
                                        <clr-icon
                                            shape="success-standard"
                                            size={20}
                                        />
                                    }
                                    size="medium"
                                    iconPosition="left"
                                    onClick={this.confirmAcknowledge}
                                />

                                {/* <Button
                                    text="askForRevision"
                                    icon={<clr-icon shape="undo" size={20} />}
                                    iconPosition="left"
                                    color="grey"
                                    size="medium"
                                    onClick={this.handleRevisionClick}
                                /> */}

                                <Button
                                    text="noButton"
                                    icon={<clr-icon shape="times" size={20} />}
                                    iconPosition="left"
                                    color="orange"
                                    size="medium"
                                    onClick={this.confirmNotCompliant}
                                />

                                <Typography className={classes.orText}>
                                    <span>-</span>
                                    <span>
                                        {intl.formatMessage(messages.buttonOr)}
                                    </span>
                                    <span>-</span>
                                </Typography>
                                <Button
                                    text="notApplicable"
                                    icon={<clr-icon shape="times" size={20} />}
                                    iconPosition="left"
                                    color="grey"
                                    size="medium"
                                    onClick={this.confirmNA}
                                />
                            </div>
                        )}
                        {taskType === 'gfr:stdTask' && (
                            <div className={classes.buttonContainer}>
                                <Button
                                    text="taskDone"
                                    color="grey"
                                    size="medium"
                                    onClick={this.handleTaskDoneClick}
                                />
                            </div>
                        )}
                        {taskType === 'notAssignee' && (
                            <div className={classes.buttonContainer}>
                                <Button
                                    text="waitingForRevision"
                                    color="blueOutline"
                                    size="medium"
                                />
                                {tasks[index + 1] && (
                                    <Link
                                        component="button"
                                        variant="body2"
                                        className={classes.nextLink}
                                        onClick={() =>
                                            setActiveIndex(index + 1, false)
                                        }
                                    >
                                        {intl.formatMessage(
                                            messages.nextDocument
                                        )}
                                    </Link>
                                )}
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        <div className="align-right">
                            {this.renderNextAndPrevious()}
                        </div>
                    </Grid>
                </Grid>
                {completeOpen && (
                    <Dialog
                        hideSave
                        intl={intl}
                        onClose={this.handleClose}
                        onSave={this.handleClose}
                        secondaryActionMessage="tasksCompleteClose"
                        title={intl.formatMessage(messages.workflowsComplete)}
                        open
                    >
                        {intl.formatMessage(messages.taskPackageComplete)}
                    </Dialog>
                )}
                {confirmOpen && (
                    <Dialog
                        intl={intl}
                        onClose={this.handleCancel}
                        onSave={this.handleAccept}
                        title={intl.formatMessage(messages.confirmation)}
                        primaryActionMessage="continue"
                        open
                    >
                        {intl.formatMessage(messages[confirmMessage])}
                    </Dialog>
                )}
            </Fragment>
        );
    }
}

export default withStyles(styles)(injectIntl(WorkflowActions));
