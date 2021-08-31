// @flow
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import SharedContainer from 'containers/SharedContainer';
import RepoContainer from 'containers/RepoContainer';
import BreadcrumbContainer from 'containers/BreadcrumbContainer';

import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import type { ContainerProps as SharedContainerProps } from 'containers/SharedContainer';
import type { ContainerProps as BreadcrumbContainerProps } from 'containers/BreadcrumbContainer';

import messages from 'constants/Messages';
import { REPO_SHARED } from 'constants/Config';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    ...RepoContainerProps,
    ...SharedContainerProps,
    ...BreadcrumbContainerProps
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    tree: {
        '& a:hover': {
            color: theme.palette.common.black
        },
        '& .MuiTreeItem-root:focus > .MuiTreeItem-content': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
        },
        '& .MuiTreeItem-content:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
        },
        '& .MuiTypography-root.MuiTreeItem-label > div': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '149px'
        }
    }
}));

const Icon = (props: { open: boolean }) => (
    <clr-icon shape={props.open ? 'folder-open' : 'folder'} />
);

const TreeLibraryShared = (props: Props) => {
    const {
        intl,
        fetchShared,
        clearShared,
        router,
        setCrumb,
        clearActiveFolder
    } = props;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(['0']);

    useEffect(() => {
        clearActiveFolder();
        if (router.location.hash) router.replace(router.location.pathname);
        return () => clearShared();
    }, [clearActiveFolder, clearShared, router]);

    // special breadcrumbs to show share root
    const fileCrumb = {
        link: intl.formatMessage(messages.files),
        onClick: () => {
            handleClick('0');
        }
    };
    const folderCrumb = {
        link: intl.formatMessage(messages.folders),
        onClick: () => {
            handleClick('1');
        }
    };

    // init shared + breadcrumbs
    useEffect(() => {
        setCrumb(fileCrumb);
        fetchShared({ type: 'content', includeChildren: true });
        // eslint-disable-next-line
    }, []);

    const handleClick = id => {
        if (id === '0') {
            setCrumb(fileCrumb);
            fetchShared({ type: 'content', includeChildren: true });
        } else if (id === '1') {
            setCrumb(folderCrumb);
            fetchShared({ type: 'folder' });
        }
        setExpanded([id]);
    };

    return (
        <div className={classes.root}>
            <TreeView className={classes.tree} expanded={expanded}>
                <TreeItem
                    nodeId="0"
                    onClick={() => handleClick('0')}
                    label={intl.formatMessage(messages.files)}
                    icon={<Icon open={_.indexOf(expanded, '0') > -1} />}
                />
                <TreeItem
                    nodeId="1"
                    onClick={() => handleClick('1')}
                    label={intl.formatMessage(messages.folders)}
                    icon={<Icon open={_.indexOf(expanded, '1') > -1} />}
                />
            </TreeView>
        </div>
    );
};

export default compose(
    RepoContainer(),
    SharedContainer(),
    BreadcrumbContainer({ ns: REPO_SHARED }),
    withRouter,
    injectIntl
)(TreeLibraryShared);
