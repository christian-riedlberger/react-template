// @flow
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogIssuedTaskConfirm from 'components/DialogIssuedTaskConfirm';
import { fetchInstanceDetails } from 'actions/ActionTasks';
import _ from 'lodash';
import { compose } from 'recompose';
import TasksContainer from 'containers/TasksContainer';
import MessageContainer from 'containers/MessageContainer';
import DialogWorkflowProgress from 'components/DialogWorkflowProgress';

import messages from 'constants/Messages';

import { UPDATE_ISSUED_TASKS } from 'constants/ActionTypes';

const MENU_CLASSES =
    'MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters Mui-disabled';

type DefaultProps = {
    showMessage: Function,
    cancelWorkflowInstance: Function,
    dispatch: Function,
    diagramURL: string
};

type Props = {
    task: Object,
    isTask?: boolean,
    passRef?: HTMLButtonElement,
    coords: {
        mouseX: number | null,
        mouseY: number | null
    },
    onClose: Function,
    onCancel: Function,
    diagramURL: string,
    issued: boolean
} & DefaultProps;
/**
 *  Styled menu popup
 */
const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
        '& ul a': {
            color: 'rgba(0, 0, 0, 0.87)'
        }
    }
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
        }}
        {...props}
    />
));

/**
 *  Styled menu option
 */
const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white
            }
        }
    }
}))(MenuItem);

/**
 *  User actions menu component
 *  Main def
 */
const MenuTaskActions = (props: Props) => {
    const {
        task,
        coords,
        onClose,
        cancelWorkflowInstance,
        showMessage,
        passRef,
        dispatch,
        issued
    } = props;

    const dialogIssuedTaskConfirm = React.useRef(DialogIssuedTaskConfirm);
    const dialogWorkflowProgress = React.useRef(DialogWorkflowProgress);
    const [details, setDetails] = useState(null);
    const [diagramURL, setDiagramURL] = useState(null);

    useEffect(() => {
        if (task) {
            fetchInstanceDetails(task.wfInstanceId)
                .payload.then(resp => {
                    setDetails(resp.data.data.tasks);
                    setDiagramURL(task.diagramURL);
                    return null;
                })
                .catch(err => {
                    throw new Error(err);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleClickCancel = () => {
        dialogIssuedTaskConfirm.current.open();
        onClose();
    };

    const handleClickView = () => {
        dialogWorkflowProgress.current.open();
        onClose();
    };

    const handleConfirmCancel = () => {
        if (task && task.packageRefs)
            cancelWorkflowInstance({ packageRefs: task.packageRefs })
                .then(resp => {
                    if (resp.value.data && resp.value.data.status !== 200) {
                        showMessage({
                            message: 'messageWorkflowCancelError',
                            variant: 'error'
                        });
                        return null;
                    }
                    showMessage({
                        message: 'messageWorkflowCancelSuccess',
                        variant: 'success'
                    });
                    dispatch({
                        type: UPDATE_ISSUED_TASKS,
                        payload: { task }
                    });
                    return null;
                })
                .catch(e => {
                    showMessage({
                        message: 'messageWorkflowCancelError',
                        variant: 'error',
                        info: e
                    });
                });
        dialogIssuedTaskConfirm.current.close();
    };

    if (!task) return null;

    const isOpen = task && (passRef || (coords && coords.mouseY !== null));

    // should show view action?
    const showViewAction = !!task.title && task.title.indexOf('cert') === -1;

    /**
     * show backup message when no actions found
     * `!(showViewAction || otherTaskAction || otherAction)`
     */
    const showNone = !_.every([showViewAction]);
    return (
        <React.Fragment>
            {isOpen && (
                <StyledMenu
                    id="customized-menu"
                    keepMounted
                    open
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: coords.mouseY, left: coords.mouseX }}
                >
                    {showViewAction && (
                        <div>
                            <Link to={task.link}>
                                <StyledMenuItem>
                                    <ListItemText
                                        data-cy="view"
                                        primary={
                                            <FormattedMessage
                                                {...messages.view}
                                            />
                                        }
                                    />
                                </StyledMenuItem>
                            </Link>

                            <StyledMenuItem onClick={handleClickView}>
                                <ListItemText
                                    data-cy="viewWorkflow"
                                    primary={
                                        <FormattedMessage
                                            {...messages.viewWorkflow}
                                        />
                                    }
                                />
                            </StyledMenuItem>

                            {issued && (
                                <StyledMenuItem onClick={handleClickCancel}>
                                    <ListItemText
                                        data-cy="cancel"
                                        primary={
                                            <FormattedMessage
                                                {...messages.cancelWorkflow}
                                            />
                                        }
                                    />
                                </StyledMenuItem>
                            )}
                        </div>
                    )}

                    {showNone && (
                        <li className={MENU_CLASSES}>
                            <ListItemText
                                data-cy="noActionsAvailable"
                                primary={
                                    <FormattedMessage
                                        {...messages.noActionsAvailable}
                                    />
                                }
                            />
                        </li>
                    )}
                </StyledMenu>
            )}
            <DialogIssuedTaskConfirm
                passRef={dialogIssuedTaskConfirm}
                task={task}
                onConfirm={handleConfirmCancel}
            />
            <DialogWorkflowProgress
                passRef={dialogWorkflowProgress}
                diagramURL={diagramURL}
                details={details}
            />
        </React.Fragment>
    );
};

export default compose(
    connect(),
    TasksContainer(),
    MessageContainer()
)(MenuTaskActions);
