// @flow
import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { injectIntl, intlShape } from 'react-intl';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import messages from 'constants/Messages';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CopyIcon from '@material-ui/icons/FileCopy';
import InfoIcon from '@material-ui/icons/Info';
import MoveIcon from '@material-ui/icons/FolderOpen';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemText from '@material-ui/core/ListItemText';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import RepoContainer from 'containers/RepoContainer';
import { getHashPaths, createHashPath } from 'utils/location';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';

type DefaultProps = {
    intl: intlShape.nodeRef,
    router: Object,
    classes: Object,
    showMessage: Function
} & RepoContainerProps;

type Props = {
    selectedDocuments: Array<Object>,
    onMove: Function,
    onCopy: Function,
    onOpenProperties: Function,
    displayActionCopy: boolean,
    displayActionMove: boolean
} & DefaultProps;

const styles = {
    iconButton: {
        padding: '0.3em',

        '& .MuiSvgIcon-root': {
            fontSize: '1.1em'
        }
    }
};

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5'
    }
})(props => (
    <Menu
        elevation={1}
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

const StyledMenuItem = withStyles(() => ({
    root: {
        width: 179
    }
}))(MenuItem);

const MoreMenu = ({
    intl,
    onCopy,
    onMove,
    onOpenProperties,
    selectedDocuments,
    displayActionCopy,
    displayActionMove,
    setActiveFile,
    setActiveFolder,
    router,
    classes
}: Props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const node = selectedDocuments.length === 1 ? selectedDocuments[0] : null;
    const displayActionView = node && node.type !== 'cm:folder';
    const displayActionOpen = node && node.type === 'cm:folder';

    /**
     * Properties handler
     */
    const handleClickProperties = () => {
        onOpenProperties();
        handleClose();
    };

    /**
     * View file handler
     */
    const handleClickViewFile = () => {
        if (node) {
            setActiveFile(node);
            router.push(`/documents/details/${node.nodeRef.split('/').pop()}`);
        }
    };

    /**
     * View folder handler
     */
    const handleClickViewFolder = () => {
        if (node) {
            setActiveFolder(node);
            handleClose();
            router.push(
                createHashPath(
                    _.concat(getHashPaths(), node.shortname || node.name)
                )
            );
        }
    };

    return (
        <div style={{ display: 'inline-block' }}>
            <IconButton
                className={classes.iconButton}
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>

            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {displayActionView && (
                    <StyledMenuItem
                        onClick={() => {
                            handleClickViewFile();
                        }}
                    >
                        <ListItemIcon>
                            <OpenInNewIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.view)}
                        />
                    </StyledMenuItem>
                )}

                {displayActionOpen && (
                    <StyledMenuItem
                        onClick={() => {
                            handleClickViewFolder();
                        }}
                    >
                        <ListItemIcon>
                            <OpenInNewIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.openFolder)}
                        />
                    </StyledMenuItem>
                )}

                {node && (
                    <StyledMenuItem
                        onClick={() => {
                            handleClickProperties();
                        }}
                    >
                        <ListItemIcon>
                            <InfoIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.info)}
                        />
                    </StyledMenuItem>
                )}

                {node && <Divider />}

                {displayActionMove && (
                    <StyledMenuItem
                        onClick={() => {
                            onMove();
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <MoveIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.moveSelected)}
                        />
                    </StyledMenuItem>
                )}

                {displayActionCopy && (
                    <StyledMenuItem
                        onClick={() => {
                            onCopy();
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <CopyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.copySelected)}
                        />
                    </StyledMenuItem>
                )}
            </StyledMenu>
        </div>
    );
};

export default compose(
    withStyles(styles),
    withRouter,
    RepoContainer(),
    injectIntl
)(MoreMenu);
