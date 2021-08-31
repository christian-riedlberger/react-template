/* @flow */
import { VERSION_API, UPLOAD_FILE_API } from 'constants/ServiceURI';
import {
    FETCH_VERSION_HISTORY,
    UPLOAD_NEW_VERSION
} from 'constants/ActionTypes';
import { xhr } from './xhr';

// alfresco/s/api/upload
// alfresco/s/api/version?nodeRef

/**
 * Get version history for a node
 * @method GET
 * @param nodeRef:string Node Reference
 * @return {{type, payload}}
 */
export function fetchVersionHistory(nodeRef: string, inPlace?: boolean) {
    const tempURL = `${VERSION_API}?nodeRef=${nodeRef}`;
    const request = xhr.get(tempURL);

    return {
        type: FETCH_VERSION_HISTORY,
        payload: request,
        meta: {
            inPlace
        }
    };
}

/**
 * Upload a new version
 * @method POST
 * @param nodeRef:string Node Reference
 * @return {{type, payload}}
 */
export function uploadNewVersion(updateObj: Object) {
    const {
        file,
        updatenoderef,
        description,
        majorversion,
        filename,
        updatenameandmimetype,
        overwrite
    } = updateObj;

    const formdata = new FormData();
    formdata.append('updatenoderef', updatenoderef);
    formdata.append('description', description || '');
    formdata.append('majorversion', majorversion);
    formdata.append('filename', filename || '');
    formdata.append('updatenameandmimetype', updatenameandmimetype);
    formdata.append('overwrite', overwrite);
    formdata.append('filedata', file);

    const request = xhr.multipart(UPLOAD_FILE_API, formdata);

    return {
        type: UPLOAD_NEW_VERSION,
        payload: request
    };
}
