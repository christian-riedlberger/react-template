// @flow
/* eslint-disable no-param-reassign */
import * as React from 'react';
import { compose } from 'recompose';
import Dropzone from 'react-dropzone';
// import axios from 'axios';
import _ from 'lodash';

import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import MessageContainer from 'containers/MessageContainer';

import { getUniqueId } from 'utils/unique';

type DefaultProps = {
    classes: Object,
    showMessage: Function
} & RepoContainerProps;

type Props = { disabled: boolean } & DefaultProps & { children: React.Node };
const FileDropzone = (props: Props) => {
    const {
        activeFolder,
        showMessage,
        uploadFileAdd,
        // $FlowFixMe
        fetchFolders,
        children,
        disabled
    } = props;

    const handleFileAdd = (acceptedFiles: Array<Object>) => {
        // get all existing folder names
        fetchFolders(activeFolder.nodeRef)
            .then(resp => {
                const existingFolders = _.map(resp.value.data.data, 'name');

                // update each file with the relative path
                const newFiles = _.map(acceptedFiles, file => {
                    if (file.path !== file.name) {
                        // split file path and remove any empty strings and the filename from list
                        file.pathArray = file.path.split('/').filter(x => x);
                        file.pathArray.pop();
                        // create unique folders if needed
                        if (
                            _.findIndex(existingFolders, f => {
                                return f === file.pathArray[0];
                            }) !== -1
                        ) {
                            file.pathArray[0] = createUniqueFolderName(
                                existingFolders,
                                file.pathArray[0]
                            );
                        }
                        for (let i = 0; i < file.pathArray.length; i += 1) {
                            file.pathArray[i] = file.pathArray[i].trim();
                        }

                        // create the relative path by rejoining the pathArray
                        file.relativePath = file.pathArray.join('/');
                        return {
                            file,
                            percentCompleted: 0,
                            parent: activeFolder.nodeRef,
                            id: getUniqueId()
                        };
                    }
                    return {
                        file,
                        percentCompleted: 0,
                        parent: activeFolder.nodeRef,
                        id: getUniqueId()
                    };
                });
                uploadFileAdd(newFiles);
                return resp;
            })
            .catch(e => {
                throw e;
            });
    };

    const createUniqueFolderName = (
        existingFolderNames: Array<string>,
        folderName: string
    ) => {
        let counter = 1;
        let tempName = '';
        do {
            tempName = `${folderName}-${counter}`;
            counter += 1;
        } while (existingFolderNames.includes(tempName));
        return tempName;
    };

    return (
        <React.Fragment>
            <Dropzone
                noClick
                onDrop={acceptedFiles => {
                    // @bug fixes disabled upload in DnD
                    if (
                        window.location.hash === '#/business' ||
                        window.location.hash === '#/shared' ||
                        disabled
                    ) {
                        showMessage({
                            message: 'cannotUploadLocation',
                            variant: 'warning'
                        });
                        return null;
                    }

                    if (
                        activeFolder &&
                        activeFolder.permission &&
                        !activeFolder.permission.create
                    ) {
                        showMessage({
                            message: 'accessDenied',
                            variant: 'warning'
                        });
                        return null;
                    }
                    handleFileAdd(acceptedFiles);
                }}
            >
                {({ getRootProps, getInputProps }) => (
                    <section data-cy="dropzone">
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {children}
                        </div>
                    </section>
                )}
            </Dropzone>
        </React.Fragment>
    );
};

export default compose(
    MessageContainer(),
    RepoContainer()
)(FileDropzone);
