// @flow
import _ from 'lodash';
import { ZIP_API, ZIP_STATUS, DOWNLOAD_URL } from 'constants/ServiceURI';
import { ZIP_PENDING, ZIP_SUCCESS } from 'constants/ActionTypes';
import { xhr } from './xhr';

/**
 *  Check the staus of a zip download
 *  @param {object} data ZIP download resposne
 *  @param {string} name Download filename
 *  @param {object} dispatch Dispatcher
 */
export function checkStatus(data: Object, name: string, dispatch: Function) {
    const status = { PENDING: 'PENDING', IN_PROGRESS: 'IN_PROGRESS' };
    const nodeURL = data.nodeRef.replace('://', '/');
    const request = xhr.get(ZIP_STATUS.replace('NODEREF', nodeURL), {
        nodeRef: data.nodeRef
    });

    // Start zipping
    request
        .then(stat => {
            const check = stat.data;
            const progress = Math.floor((check.done / check.total) * 100);

            if (
                check.status === status.PENDING ||
                check.status === status.IN_PROGRESS
            ) {
                dispatch({ type: ZIP_PENDING, progress, ...check });
                checkStatus(data, name, dispatch);
            } else {
                dispatch({ type: ZIP_SUCCESS });

                window.location.href = DOWNLOAD_URL(data.nodeRef, name);
            }
            return stat;
        })
        .catch();
}

/**
 *  Download a ZIP file
 *  @param {array} nodeRefs Nodes to download
 *  @param {string} name Download filename
 *  @param {object} dispatch Dispatcher
 */
export function downloadZip(
    nodeRefs: Array<string>,
    name: string,
    dispatch: Function
) {
    const downloads = _.map(nodeRefs, nodeRef => {
        return { nodeRef };
    });
    const request = xhr.post(ZIP_API, downloads);

    // Start zipping
    request
        .then(zip => {
            dispatch({ type: ZIP_PENDING });
            checkStatus(zip.data, name, dispatch);
            return zip;
        })
        .catch();
}
