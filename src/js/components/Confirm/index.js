// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { intlShape } from 'react-intl';
import messages from 'constants/Messages';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

type Props = {
    intl: intlShape,
    children: any,
    open?: boolean,
    title: string,
    onConfirm: Function,
    onClose: Function
};

type State = {
    open: boolean
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
    }
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
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

export default class Confirm extends Component<Props, State> {
    static defaultProps = {
        open: false
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            open: !!props.open
        };
    }

    open = () => {
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

    render() {
        const { title, onConfirm, children, intl } = this.props;
        return (
            <div>
                <Dialog
                    onClose={this.close}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                >
                    <DialogTitle
                        id="customized-dialog-title"
                        onClose={this.close}
                    >
                        {title}
                    </DialogTitle>
                    <DialogContent dividers>{children}</DialogContent>
                    <DialogActions>
                        <Button
                            className="cy-cancel"
                            onClick={this.close}
                            color="primary"
                        >
                            {intl.formatMessage(messages.cancelConfirm)}
                        </Button>
                        <Button
                            className="cy-confirm"
                            onClick={onConfirm}
                            color="primary"
                        >
                            {intl.formatMessage(messages.confirm)}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
