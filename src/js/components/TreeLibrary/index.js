// @flow
import React, { useEffect } from 'react';
import { intlShape } from 'react-intl';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import type { Node as NodeType } from 'types/repoTypes';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';

import Controller from './container';
import Component from './component';

type ParentRef = string;
type DefaultProps = {
    intl: intlShape,
    classes: Object,
    directory: {
        [ParentRef]: {
            folders: Array<NodeType>,
            isLoading: boolean,
            cache: number
        }
    },
    resetCache: string => void
};

export type Props = {
    activeFolder?: NodeType, // overide for RepoContainer's `activeFolder` & `setActiveFolder`
    setActiveFolder?: Function, // overide for RepoContainer's `activeFolder` & `setActiveFolder`

    parentRef?: ParentRef | Array<string>, // start from a predefined fodler instead of root
    includeParent?: boolean, // include provided parent folder in tree view

    className?: string, // add styling class
    hideContext?: boolean, // enable context (right) click options
    ignorePath?: boolean, // ignore the path in the url
    updateNodes?: Array<string>, // trigger update by changing cache

    overflowX?: string, // overide the overflow styling
    overflowY?: string // overide the overflow styling
} & DefaultProps &
    RepoContainerProps &
    RepoContainerProps;

const useStyles = makeStyles({
    root: {
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100%'
    }
});

const TreeLibrary = (props: Props) => {
    const classes = useStyles();

    useEffect(() => {
        if (props.treeNodes && props.treeNodes.length > 0) {
            _.map(props.treeNodes, props.resetCache);
            props.clearTreeNodes();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.treeNodes]);

    return (
        <div className={clsx(classes.root, props.className)}>
            {/* $FlowFixMe */}
            <Component {...props} />
        </div>
    );
};

export default Controller(TreeLibrary);
