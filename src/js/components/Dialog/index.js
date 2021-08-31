// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { intlShape } from 'react-intl';
import messages from 'constants/Messages';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

import { renderChildren } from 'utils/render';

type DefaultProps = {
    classes: Object
};

type Props = {
    intl: intlShape,
    children: any,
    open: boolean,
    title: string,
    onSave: Function,
    primaryActionMessage?: string,
    secondaryActionMessage?: string,
    errorMessage?: string,
    onClose?: Function,
    className?: string,
    noPadding?: boolean,
    hideActions?: boolean,
    onOpen?: Function,
    saveOnEnter?: boolean,
    hideSave: boolean,
    isLoading: boolean,
    customActionsLeft: Array<any>
} & DefaultProps;

type State = {
    open: boolean
};

export type RenderPropsArgs = {
    modalState: State,
    modalProps: Props,
    modalMethods: {
        open: Function,
        close: Function
    }
};

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    noPadding: {
        padding: 0
    },
    actionsLeft: {
        marginRight: 'auto'
    }
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose, errorTxt } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {errorTxt && (
                <Typography
                    variant="subtitle2"
                    id="error"
                    className="serverError"
                >
                    {errorTxt}
                </Typography>
            )}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1)
    }
}))(MuiDialogActions);

class DialogCustom extends Component<Props, State> {
    static defaultProps = {
        open: false,
        onClose: null,
        primaryActionMessage: null,
        secondaryActionMessage: null,
        className: null,
        noPadding: false,
        hideActions: false,
        lifecycleCallback: null,
        onOpen: null,
        errorMessage: null,
        saveOnEnter: true
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            open: props.open
        };
    }

    open = () => {
        const { onOpen } = this.props;
        if (onOpen) onOpen();
        this.setState({ open: true });
    };

    close = () => {
        const { onClose } = this.props;

        if (onClose) {
            setTimeout(() => {
                // Allow for animation to close
                onClose();
            }, 750);
        }
        this.setState({ open: false });
    };

    onDoubleClick = (e: Object) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        return false;
    };

    keyPressed = (event: KeyboardEvent) => {
        const { onSave, saveOnEnter } = this.props;
        const inTextArea =
            document.activeElement &&
            document.activeElement.tagName === 'TEXTAREA';
        if (event.key === 'Enter' && onSave && saveOnEnter && !inTextArea) {
            event.preventDefault();
            if (onSave) onSave();
        }
    };

    render() {
        const {
            title,
            onSave,
            children,
            intl,
            primaryActionMessage,
            secondaryActionMessage,
            errorMessage,
            className,
            noPadding,
            classes,
            hideActions,
            hideSave,
            isLoading,
            customActionsLeft
        } = this.props;

        const primaryTxt =
            _.isString(primaryActionMessage) && messages[primaryActionMessage]
                ? intl.formatMessage(messages[primaryActionMessage])
                : primaryActionMessage;
        const secondaryTxt =
            _.isString(secondaryActionMessage) &&
            messages[secondaryActionMessage]
                ? intl.formatMessage(messages[secondaryActionMessage])
                : secondaryActionMessage;
        const errorTxt =
            _.isString(errorMessage) && messages[errorMessage]
                ? intl.formatMessage(messages[errorMessage])
                : errorMessage;

        return (
            <div onDoubleClick={this.onDoubleClick}>
                <Dialog
                    onClose={this.close}
                    onKeyPress={this.keyPressed}
                    className={`${className || ''}`}
                    aria-labelledby="customized-dialog-title"
                    open={this.props.open || this.state.open}
                >
                    <DialogTitle
                        id="customized-dialog-title"
                        onClose={this.close}
                        errorTxt={errorTxt}
                    >
                        {title}
                    </DialogTitle>
                    <DialogContent
                        dividers
                        className={clsx(
                            noPadding && classes.noPadding,
                            'cy-dialog'
                        )}
                    >
                        {renderChildren(children, {
                            modalState: this.state,
                            modalProps: this.props,
                            modalMethods: {
                                open: this.open,
                                close: this.close
                            }
                        })}
                    </DialogContent>
                    {!hideActions && (
                        <DialogActions>
                            {customActionsLeft &&
                                customActionsLeft.length > 0 && (
                                <div className={classes.actionsLeft}>
                                    {_.map(customActionsLeft)}
                                </div>
                            )}
                            <Button
                                className="cy-cancel"
                                onClick={this.close}
                                color="primary"
                                disabled={isLoading}
                            >
                                {secondaryTxt ||
                                    intl.formatMessage(messages.cancel)}
                            </Button>
                            {!hideSave && (
                                <Button
                                    className="cy-save"
                                    onClick={onSave}
                                    color="primary"
                                    disabled={isLoading}
                                >
                                    {primaryTxt ||
                                        intl.formatMessage(messages.save)}
                                </Button>
                            )}
                        </DialogActions>
                    )}
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(DialogCustom);
