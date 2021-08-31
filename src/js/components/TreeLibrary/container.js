// @flow
import { compose, branch, withStateHandlers } from 'recompose';
import _ from 'lodash';

import RepoContainer from 'containers/RepoContainer';
import type { Node as NodeType } from 'types/repoTypes';
import BreadcrumbContainer from 'containers/BreadcrumbContainer';

type ParentRef = string;

export default compose(
    BreadcrumbContainer({
        ns: props => props.ns
    }),
    branch(
        props =>
            !_.isFunction(props.setActiveFolder) &&
            _.isUndefined(props.activeFolder),
        RepoContainer({
            pick: [
                'setActiveFolder',
                'activeFolder',
                'treeNodes',
                'clearTreeNodes'
            ]
        })
    ),
    withStateHandlers(
        { directory: {} },
        {
            /**
             * @arg ParentRef
             * @description toggle the loading state at parent index
             */
            toggleLoading: state => parentRef => {
                return {
                    ...state,
                    directory: {
                        ...state.directory,
                        [parentRef]: {
                            ...state.directory[parentRef],
                            isLoading: !_.get(
                                state,
                                `directory.${parentRef}.isLoading`,
                                false
                            )
                        }
                    }
                };
            },
            /**
             * @arg ParentRef
             * @arg Array<NodeType>
             * @description set the folders at parent index
             */
            setFolders: state => (
                parentRef: ParentRef,
                folders: Array<NodeType>
            ) => {
                return {
                    ...state,
                    directory: {
                        ...state.directory,
                        [parentRef]: {
                            ...state.directory[parentRef],
                            folders
                        }
                    }
                };
            },
            /**
             * @arg ParentRef
             * @description trigger an update for folders
             */
            resetCache: state => (parentRef: ParentRef) => {
                return {
                    ...state,
                    directory: {
                        ...state.directory,
                        [parentRef]: {
                            ...state.directory[parentRef],
                            cache: Math.random()
                        }
                    }
                };
            }
        }
    )
);
