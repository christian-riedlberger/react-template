import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { intlShape, injectIntl } from 'react-intl';

import ProgressBarWrapper from 'components/ProgressBarWrapper';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerPops as RepoProps } from 'containers/RepoContainer';
import _ from 'lodash';
import messages from 'constants/Messages';

type Props = {
    open: boolean,
    title: string,
    files: Object,
    nodeRef: string,
    onClose: Function,
    onCancel: Function,
    onComplete: Function,
    onUpload: Function,
    onError: Function
};

const useStyles = makeStyles(theme => ({
    card: {
        position: 'fixed',
        bottom: 20,
        right: 20,
        maxWidth: 450,
        minWidth: 344
    },
    hidden: {
        visibility: 'hidden',
        display: 'none'
    },
    typography: {
        fontWeight: 'bold'
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
        backgroundColor: '#00C771'
    },
    icons: {
        marginLeft: 'auto'
    },
    expand: {
        padding: '8px 8px',
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: 'rotate(0deg)'
    },
    collapse: {
        padding: 16
    },
    checkIcon: {
        fontSize: 20,
        color: '#b3b3b3',
        paddingRight: 4
    },
    button: {
        padding: 0,
        textTransform: 'none'
    }
}));

const DialogUploadStatus = React.forwardRef((props: Props, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(true);
    const [complete, setComplete] = useState(false);

    const {
        title,
        nodeRef,
        onComplete,
        onClose,
        onCancel,
        onError,
        upload,
        files,
        open,
        intl
    } = props;

    useEffect(() => {
        if (
            files.length > 0 &&
            _.every(files, file => {
                return (
                    file.percentCompleted === 100 ||
                    file.percentCompleted === -1
                );
            }) &&
            !complete
        ) {
            setComplete(true);
        } else if (complete && files.length < 1) {
            setComplete(false);
        }
    }, [complete, files]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDismiss = () => {
        if (complete) {
            onClose();
            setExpanded(true);
            closeSnackbar();
        } else {
            onCancel();
        }
    };

    return (
        <React.Fragment>
            <Card
                className={`${open ? classes.card : classes.hidden}`}
                ref={ref}
            >
                <CardActions
                    className={classes.actions}
                    classes={{ root: classes.actionRoot }}
                >
                    <Typography
                        variant="subtitle2"
                        className={classes.typography}
                    >
                        {title}
                    </Typography>
                    <div className={classes.icons}>
                        <Tooltip
                            title={
                                expanded
                                    ? intl.formatMessage(messages.hide)
                                    : intl.formatMessage(messages.show)
                            }
                            placement="top"
                        >
                            <IconButton
                                aria-label="Show more"
                                onClick={handleExpandClick}
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: expanded
                                })}
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={
                                complete
                                    ? intl.formatMessage(messages.close)
                                    : intl.formatMessage(messages.cancelAll)
                            }
                            placement="top"
                        >
                            <IconButton
                                className={classes.expand}
                                onClick={handleDismiss}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </CardActions>
                <Collapse in={expanded} timeout="auto">
                    <Paper className={classes.collapse}>
                        <ProgressBarWrapper
                            nodeRef={nodeRef}
                            files={files}
                            onComplete={onComplete}
                            onClose={onClose}
                            onError={onError}
                            upload={upload}
                        />
                    </Paper>
                </Collapse>
            </Card>
        </React.Fragment>
    );
});

export const DialogUploadStatusContainer = injectIntl(
    RepoContainer()((props: RepoProps & { intl: intlShape }) => {
        useEffect(
            () => () => {
                props.uploadFileClear();
                props.uploadFileCancel(null, true);
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        );

        return (
            <DialogUploadStatus
                title={props.intl.formatMessage(messages.uploadingFiles)}
                files={props.uploadSelectedFiles}
                nodeRef={_.get(props, 'activeFolder.nodeRef')}
                open={props.uploadDialogShow}
                upload={props.uploadFile}
                onError={props.uploadFileError}
                onClose={() => props.uploadFileClear()}
                onCancel={() => props.uploadFileCancel(null, true)}
                onComplete={() => {
                    props.uploadFileFinish(
                        _.get(props, 'activeFolder.nodeRef')
                    );
                }}
                intl={props.intl}
            />
        );
    })
);

export default DialogUploadStatus;
