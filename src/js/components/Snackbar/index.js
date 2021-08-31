// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import clsx from 'clsx';
import { intlShape, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { hideMessage } from 'actions/ActionMessage';
import { log } from 'utils/logger';
import messages from 'constants/Messages';
import variantIcon from './variantIcon';

export type Variant = 'success' | 'warning' | 'error' | 'info' | 'pending';

type DefaultProps = {
    intl: intlShape,
    variant: string,
    message: string,
    info?: string,
    vertical?: string,
    horizontal?: string,
    classes: Object,
    hideMessage: Function
};

type Props = {} & DefaultProps;

type State = {
    open: boolean,
    cache: string
};

const useStyles1 = makeStyles(theme => ({
    default: {},
    success: {
        backgroundColor: green[600]
    },
    pending: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.main
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    }
}));

function MySnackbarContentWrapper(props: Object) {
    const classes = useStyles1();
    const { className, message, onClose, variant, info, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    {variant !== 'pending' ? (
                        <Icon
                            className={clsx(classes.icon, classes.iconVariant)}
                        />
                    ) : (
                        <CircularProgress
                            className={clsx(classes.icon, classes.iconVariant)}
                            color="inherit"
                            size={20}
                        />
                    )}
                    {message}
                    {info || null}
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>
            ]}
            {...other}
        />
    );
}

const useStyles2 = theme => ({
    margin: {
        margin: theme.spacing(1)
    }
});

class CustomizedSnackbars extends Component<Props, State> {
    static defaultProps = {
        vertical: 'bottom',
        horizontal: 'right'
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            open: false,
            // eslint-disable-next-line react/no-unused-state
            cache: ''
        };
    }

    static getDerivedStateFromProps(props, state) {
        let { open } = props;

        if (!_.isEqual(props.cache, state.cache) && !_.isEmpty(props.message))
            open = true;

        return {
            ...state,
            cache: props.cache,
            open
        };
    }

    componentWillUnmount() {
        log('HIDING!!!!!', 'red');
        this.props.hideMessage();
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        log('HIDING!!!!!', 'red');
        this.props.hideMessage();
        this.setState(state => {
            return {
                ...state,
                open: false
            };
        });
    };

    render() {
        const {
            intl,
            variant,
            message,
            vertical,
            horizontal,
            info
        } = this.props;
        const { open } = this.state;
        const { classes } = this.props;

        let intlMessage = message;
        if (_.isString(message) && message.indexOf(':') > -1) {
            const [key, value] = message.split(':');
            intlMessage = intl.formatMessage(messages[key], { value });
        } else if (messages[message]) {
            intlMessage = intl.formatMessage(messages[message]);
        }

        return (
            <div>
                {open && (
                    <Snackbar
                        anchorOrigin={{
                            vertical,
                            horizontal
                        }}
                        open={open}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                        onExited={this.handleClose}
                    >
                        <MySnackbarContentWrapper
                            className={classes.margin}
                            onClose={this.handleClose}
                            onExited={this.handleClose}
                            variant={variant || 'success'}
                            message={intlMessage}
                            info={info}
                        />
                    </Snackbar>
                )}
            </div>
        );
    }
}

export default compose(
    connect(
        (state): Object => {
            return {
                ...state.message
            };
        },
        {
            hideMessage
        }
    ),
    injectIntl,
    withStyles(useStyles2)
)(CustomizedSnackbars);
