// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';

import type { Node } from 'types/repoTypes';
import MenuActionsRepo from 'components/MenuActionsRepo';
import type { HandlerArgs } from 'components/MenuActionsRepo';
import { fetchFolders, fetchNode } from 'actions/ActionRepo';
import messages from 'constants/Messages';

import type { Props as iProps } from './index';

type NodeType = Node & { isOpen: boolean };

type Props = {
    parentPath: string,
    activeFolder: Object,
    toggleLoading: Function,
    resetCache: Function,
    breadcrumbs: Array<Object>,
    parentIndex: string,
    setFolders: Function,
    setCrumb: Function,
    parentRef: string,
    updateCrumb: Function,
    intl: intlShape
} & iProps;

export type State = {
    coords: {
        mouseX: number | null,
        mouseY: number | null
    },
    isNewParent: boolean
};

const styles = theme => ({
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
            maxWidth: '149px',
            '&:hover': {
                '&$readOnly': {
                    '& span': {
                        opacity: '1',
                        filter: 'alpha(opacity=100)'
                    }
                }
            }
        }
    },
    activeTreeItem: {
        color: '#404245',
        fontWeight: '400'
    },
    readOnly: {
        opacity: '0.5',
        filter: 'alpha(opacity = 50)',
        fontWeight: '400',
        '& span': {
            opacity: 0,
            filter: 'alpha(opacity=0)'
        }
    },
    icon: {
        width: 20,
        height: 20
    }
});

@injectIntl
@withStyles(styles)
export class TreeLibraryBase extends Component<Props, State> {
    initalCoords: Object;

    constructor(props: Props) {
        super(props);

        this.initalCoords = {
            mouseX: null,
            mouseY: null
        };

        this.state = {
            coords: this.initalCoords,
            isNewParent: false
        };
    }

    componentDidMount() {
        this.getFolders(() => {
            const {
                ignorePath,
                setActiveFolder,
                breadcrumbs,
                parentIndex = 0,
                directory,
                setFolders,
                parentRef,
                includeParent,
                updateCrumb
            } = this.props;
            if (ignorePath) return;

            let ref = parentRef;
            if (includeParent) ref = `${parentRef}-include`;

            const folders = _.get(directory, `${ref}.folders`, []);
            const currentHash = _.get(
                breadcrumbs,
                `breadcrumbs.${parentIndex}.link`,
                ''
            );
            if (folders.length > 0) {
                setFolders(
                    ref,
                    _.map(folders, f => {
                        if (
                            f.shortName === currentHash ||
                            f.name === currentHash
                        ) {
                            setActiveFolder(f);
                            updateCrumb(f, parentIndex);
                            return { ...f, isOpen: true };
                        }
                        return f;
                    })
                );
            }
        });
    }

    componentDidUpdate(prevProps: Props) {
        const {
            directory,
            parentRef,
            resetCache,
            setActiveFolder
        } = this.props;
        const parent = _.get(directory, `${parentRef}-include`);
        const cache = _.get(directory, `${parentRef}.cache`);

        if (cache !== _.get(prevProps, `directory.${parentRef}.cache`)) {
            this.getFolders();
        }

        if (
            !_.isEqual(
                _.get(prevProps, 'parentRef'),
                _.get(this.props, 'parentRef')
            )
        ) {
            resetCache(parentRef);
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                isNewParent: true
            });
        }

        if (
            parent &&
            parent.folders &&
            parent.folders.length > 0 &&
            this.state.isNewParent
        ) {
            setActiveFolder(parent.folders[0]);
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                isNewParent: false
            });
        }
    }

    /**
     * @arg Function
     * @description fetch and update folders, optional callback
     */
    getFolders = (callback?: Function) => {
        const {
            parentRef,
            setFolders,
            toggleLoading,
            directory,
            includeParent
        } = this.props;

        if (includeParent) {
            const ref = `${parentRef}-include`;
            toggleLoading(ref);
            fetchNode({ nodeRef: parentRef })
                .payload.then(resp => {
                    toggleLoading(ref);
                    setFolders(ref, _.castArray(resp.data));
                    this.handleClick(resp.data, true);
                    return callback && callback();
                })
                .catch(e => {
                    throw new Error(e);
                });
        } else {
            toggleLoading(parentRef);
            fetchFolders(parentRef)
                .payload.then(resp => {
                    setFolders(
                        parentRef,
                        _.map(resp.data.data, folder => ({
                            ..._.find(
                                _.get(directory, `${parentRef}.folders`),
                                {
                                    nodeRef: folder.nodeRef
                                }
                            ),
                            ...folder
                        }))
                    );
                    toggleLoading(parentRef);
                    return callback && callback();
                })
                .catch(e => {
                    throw new Error(e);
                });
        }
    };

    handleRefresh = (parentRef: string) => {
        const { setFolders, toggleLoading, directory } = this.props;

        toggleLoading(parentRef);
        fetchFolders(parentRef)
            .payload.then(resp => {
                setFolders(
                    parentRef,
                    _.map(resp.data.data, folder => ({
                        ..._.find(_.get(directory, `${parentRef}.folders`), {
                            nodeRef: folder.nodeRef
                        }),
                        ...folder
                    }))
                );
                toggleLoading(parentRef);
                return true;
            })
            .catch(e => {
                throw new Error(e);
            });
    };

    /**
     * folder handlers
     */

    /**
     * @arg NodeType
     * @arg setActive
     * @description open /close clicked folder, and optionally set as `activeFolder`
     */
    handleClick = (clickedFolder: NodeType, setActive: boolean = false) => {
        const {
            parentIndex = 0,
            ignorePath,
            setActiveFolder,
            directory,
            setFolders,
            parentRef,
            includeParent,
            setCrumb,
            activeRepo
        } = this.props;
        const ref = includeParent ? `${parentRef}-include` : parentRef;
        setFolders(
            ref,
            _.map(_.get(directory, `${ref}.folders`), f => ({
                ...f,
                isOpen:
                    f.nodeRef === clickedFolder.nodeRef ? !f.isOpen : f.isOpen
            }))
        );
        if (setActive)
            setActiveFolder({
                folder: clickedFolder,
                refresh: () => this.handleRefresh(clickedFolder.nodeRef)
            });

        if (ignorePath) return;
        // mirror open folder path in location hash and update url
        setCrumb(
            {
                ...clickedFolder,
                link: clickedFolder.shortName || clickedFolder.name
            },
            parentIndex,
            activeRepo
        );
    };

    /**
     * dialog handlers
     */

    /**
     * @arg SyntheticMouseEvent
     * @arg NodeType
     * @description handle the context (right) click event
     */
    handleContext = (event: SyntheticMouseEvent<>, folder: NodeType) => {
        const { hideContext = false, setActiveFolder } = this.props;
        // prevent
        if (!hideContext) {
            event.preventDefault();
            this.setState(
                {
                    coords: {
                        mouseX: event.clientX - 2,
                        mouseY: event.clientY - 4
                    }
                },
                () => {
                    setActiveFolder(folder);
                }
            );
        }
    };

    /**
     * @description close the ActionRepo poper
     */
    handleClose = () => {
        this.setState({ coords: this.initalCoords });
    };

    /**
     * @arg HandlerArgs
     * @description Handle ActionRepo onSave events by updating folders
     */
    handleSave = ({ target, destination, action }: HandlerArgs) => {
        const { resetCache, parentRef } = this.props;

        switch (action) {
            case 'new':
            case 'delete':
                resetCache(parentRef);
                resetCache(target.parentRef);
                break;

            case 'move':
            case 'copy': {
                resetCache(target.parentRef);
                if (destination) {
                    resetCache(destination.parentRef);
                }
                break;
            }

            case 'edit':
                resetCache(parentRef);
                break;

            default:
                break;
        }
    };

    /**
     * @description render TreeView and children components
     */
    renderTree = (folder: NodeType) => {
        const {
            activeFolder = {},
            classes,
            parentPath = '#',
            parentIndex = 0,
            directory,
            includeParent,
            intl
        } = this.props;

        const readOnly = folder && !folder.permission.create;
        let infoIcon = null;

        let treeIcon = (
            <clr-icon
                shape="folder"
                className={clsx(
                    activeFolder.nodeRef === folder.nodeRef &&
                        classes.activeTreeItem,
                    classes.icon
                )}
                onClick={() => this.handleClick(folder)}
                onContextMenu={e => this.handleContext(e, folder)}
            />
        );
        if (folder.isOpen) {
            treeIcon = (
                <clr-icon
                    shape="folder-open"
                    className={clsx(
                        activeFolder.nodeRef === folder.nodeRef &&
                            classes.activeTreeItem,
                        classes.icon
                    )}
                    onClick={() => this.handleClick(folder)}
                    onContextMenu={e => this.handleContext(e, folder)}
                />
            );
        }
        if (readOnly) {
            infoIcon = (
                <Tooltip
                    title={intl.formatMessage(messages.readOnly)}
                    placement="right-start"
                >
                    <span className={classes.iconHidden}>
                        <clr-icon shape="error-standard" />
                    </span>
                </Tooltip>
            );
        }

        const ref = includeParent
            ? `${folder.nodeRef}-include`
            : folder.nodeRef;
        const isLoading = _.get(directory, `${ref}.isLoading`);
        if (isLoading) {
            treeIcon = (
                <CircularProgress
                    size={17}
                    className={clsx(
                        activeFolder.nodeRef === folder.nodeRef &&
                            classes.activeTreeItem,
                        classes.icon
                    )}
                    onClick={() => this.handleClick(folder)}
                    onContextMenu={e => this.handleContext(e, folder)}
                />
            );
        }

        return (
            <TreeItem
                id={folder.nodeRef}
                data-cy={folder.name}
                key={folder.nodeRef}
                nodeId={folder.nodeRef}
                icon={treeIcon}
                label={
                    <div
                        onClick={() => this.handleClick(folder, true)}
                        onContextMenu={e => this.handleContext(e, folder)}
                        className={clsx(
                            activeFolder.nodeRef === folder.nodeRef &&
                                classes.activeTreeItem,
                            readOnly && classes.readOnly
                        )}
                    >
                        {folder.name} {infoIcon}
                    </div>
                }
            >
                <TreeLibraryBase
                    {..._.omit(this.props, 'includeParent')}
                    parentRef={folder.nodeRef}
                    parentPath={`${parentPath}/${folder.name}`}
                    parentIndex={parentIndex + 1}
                />
            </TreeItem>
        );
    };

    render() {
        const {
            activeFolder = {},
            classes,
            directory,
            parentRef,
            includeParent,
            parentIndex = 0
        } = this.props;

        const { coords } = this.state;
        const ref = includeParent ? `${parentRef}-include` : parentRef;
        const folders = _.get(directory, `${ref}.folders`, []);
        const isLoading = _.get(directory, `${ref}.isLoading`);
        return (
            <div>
                {isLoading && _.isEmpty(folders) && parentIndex === 0 && (
                    <CircularProgress size={17} />
                )}
                <TreeView
                    className={classes.tree}
                    expanded={_.map(
                        _.filter(folders, {
                            isOpen: true
                        }),
                        'nodeRef'
                    )}
                >
                    {_.map(folders, this.renderTree)}
                </TreeView>
                <MenuActionsRepo
                    coords={coords}
                    folder={activeFolder}
                    onClose={this.handleClose}
                    onSave={this.handleSave}
                    actions={[
                        'new',
                        'edit',
                        'move',
                        'copy',
                        'delete',
                        'permissions'
                    ]}
                />
            </div>
        );
    }
}

export default TreeLibraryBase;
