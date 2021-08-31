// @flow
import _ from 'lodash';
import { ALFRESCO_AUTH_OPTS } from 'constants/Config';

/**
 *  BASE URLS
 */
export const HOST = ALFRESCO_AUTH_OPTS.hostEcm || 'ERROR-DOMAIN';
export const SERVICE_URI = `${HOST}/alfresco/s/greenfence/api`;
export const ALFRESCO_SERVICE_URI = `${HOST}/alfresco/s/api`;

/**
 *  LOGIN API
 */
export const LOGIN_EXPIRES = 0.1; // 10 min ticket expiration
export const LOGIN_API = `${ALFRESCO_SERVICE_URI}/login`; // Alfresco Login API

/**
 *  API URIs
 */
export const AUTHORITY_API = `${SERVICE_URI}/authority`;
export const MY_ORGANIZATION_API = `${SERVICE_URI}/my/organization`;
export const ORGANIZATION_API = `${SERVICE_URI}/organization`;
export const AUTHORITY_AVATAR_API = `${SERVICE_URI}/authority/upload`;
export const OPERATION_API = `${SERVICE_URI}/operation`;
export const ACCESS_API = `${SERVICE_URI}/access`; // Access rights
export const PERMISSION_API = `${SERVICE_URI}/permission`;
export const USER_API = `${SERVICE_URI}/users`;
export const TASK_INSTANCE_API = `${SERVICE_URI}/task-instances`;
export const TASK_AUTHORITY_API = `${SERVICE_URI}/task-authority`;
export const UPLOAD_REQUEST_API = `${SERVICE_URI}/requests/upload`;
export const COPY_REQUEST_API = `${SERVICE_URI}/requests/upload-existing`;
export const REPORTS_API = `${SERVICE_URI}/reports`;
export const SHARED_API = `${SERVICE_URI}/shared`;
export const SHARED_API_USERS = `${SERVICE_URI}/shared/users`;
export const INVITATION_API = `${SERVICE_URI}/invitation`;
export const SEARCH_API = `${SERVICE_URI}/search`;
export const COPY_NODE_API = `${SERVICE_URI}/repo/copy`;
export const MOVE_NODE_API = `${SERVICE_URI}/repo/move`;
export const PEOPLE_DELETE_API = `${SERVICE_URI}/people`; // Custom delete user
export const RECENT_DOCUMENTS_API = `${SERVICE_URI}/documents/recent`;
export const RECENT_TASKS_API = `${SERVICE_URI}/tasks/recent`;

/**
 *  Alfresco built in APIS
 */
export const WORKFLOW_DEFINITION_API = `${ALFRESCO_SERVICE_URI}/workflow-definitions`;
export const PERMISSION_GET_API = `${HOST}/alfresco/s/slingshot/doclib/permissions/NODEREF`;
export const VERSION_API = `${ALFRESCO_SERVICE_URI}/version`;
export const REVERT_API = `${ALFRESCO_SERVICE_URI}/revert`;
export const ZIP_API = `${ALFRESCO_SERVICE_URI}/internal/downloads`;
export const ZIP_STATUS = `${ALFRESCO_SERVICE_URI}/internal/downloads/NODEREF/status`;
export const UPLOAD_FILE_API = `${ALFRESCO_SERVICE_URI}/upload`;
export const PREFERENCE_API = `${ALFRESCO_SERVICE_URI}/people/USER/preferences`;
export const TASK_API = `${ALFRESCO_SERVICE_URI}/task-instances`;
export const TASK_PROCESS_API = `${ALFRESCO_SERVICE_URI}/task/`;
export const STATS_API = `${SERVICE_URI}/stats`; // Stats
export const ACTIVITI_API = `${ALFRESCO_SERVICE_URI}/workflow/`;
export const ACTIVITI_DEFINITIONS = `${ALFRESCO_SERVICE_URI}/workflow-definitions?exclude=activiti$activitiInvitationModerated,activiti$activitiInvitationNominated,activiti$activitiInvitationNominatedAddDirect,activiti$activitiParallelReview,activiti$publishWebContent`;
export const RATINGS_URL = `${ALFRESCO_SERVICE_URI}/node/NODEREF/ratings`;
export const COMMENT_URL = `${ALFRESCO_SERVICE_URI}/node/NODEREF/comments`;
export const WORKFLOW_DIAGRAM_API = `${ALFRESCO_SERVICE_URI}/workflow-instances/WORKFLOWID/diagram`;
export const WORKFLOW_INSTANCE_API = `${ALFRESCO_SERVICE_URI}/workflow-instances`;
export const WF_PACKAGE_API = `${SERVICE_URI}/process/package`; // Workflow Package API
export const ALF_TASK_INSTANCE_API = `${ALFRESCO_SERVICE_URI}/task-instances`;
export const PASSWORD_CHANGE_API = `${ALFRESCO_SERVICE_URI}/person/changepassword/USERNAME`;
export const USER_INFO_API = `${SERVICE_URI}/person`; // User information
export const AUTHORITY_LOOKUP_API = `${SERVICE_URI}/authority/lookup`; // Lookup authority
export const HEALTH_API = `${SERVICE_URI}/health`; // System health check api
export const REPO_API = `${SERVICE_URI}/repo`; // Repo
export const LOCK_API = `${SERVICE_URI}/lock`; // Lock nodes
export const UNLOCK_API = `${SERVICE_URI}/unlock`; // Lock nodes
export const PEOPLE_API = `${ALFRESCO_SERVICE_URI}/people`; // People

export const GROUPS_API = `${ALFRESCO_SERVICE_URI}/groups`; // Groups
export const AVATAR_API = `${HOST}/alfresco/service/slingshot/profile/uploadavatar`; // Avatar
export const CUSTOM_COMMENT_API = `${SERVICE_URI}/comment`; // Custom comment API
export const DOCUMENTS_API = `${SERVICE_URI}/documents`; // Custom comment API
export const TASK_REQUEST_API = `${SERVICE_URI}/workflow/start`;
export const WORKFLOW_CANCEL_API = `${SERVICE_URI}/workflow/cancel`; // Cancel a workflow
export const REQUEST_API = `${SERVICE_URI}/request`;
export const REPO_FILES_API = `${SERVICE_URI}/repo/files`;
export const REPO_API_USERS = `${SERVICE_URI}/repo/users`; // Repo
export const REPO_SHARED_FILES_API = `${SERVICE_URI}/shared`;
export const DOCUMENT_PREVIEW_URL = `${ALFRESCO_SERVICE_URI}/node/NODEREF/content/thumbnails/pdf?c=force`;
export const DOCUMENT_THUMBNAIL_URL = `${ALFRESCO_SERVICE_URI}/node/NODEREF/content/thumbnails/imgpreview?c=queue&ph=true`;
export const PDF_PREVIEW_URL = `${ALFRESCO_SERVICE_URI}/node/NODEREF/content/pdf?c=force`;

export const REQUEST_PASSWORD_RESET = (username: string) => {
    return `${HOST}/alfresco/api/-default-/public/alfresco/versions/1/people/${username}/request-password-reset`;
};

export const RESET_PASSWORD = (username: string): string => {
    return `${HOST}/alfresco/api/-default-/public/alfresco/versions/1/people/${username}/reset-password`;
};

export const PASSWORD_CHANGE_URL = (username: string) => {
    return PASSWORD_CHANGE_API.replace('USERNAME', username);
};

/**
 *  Download URL var function
 */
export const DOWNLOAD_URL = (nodeRef: string, name: string) => {
    const ticket = localStorage.getItem('auth:ticket');
    const nodeURL = nodeRef.replace('://', '/');
    return `${ALFRESCO_SERVICE_URI}/node/content/${nodeURL}/${name}.zip?alf_ticket=${ticket ||
        ''}`;
};

export const RATINGS_API = (nodeRef: string) => {
    return RATINGS_URL.replace('NODEREF', nodeRef.replace('://', '/'));
};

export const COMMENT_API = (nodeRef: string) => {
    return COMMENT_URL.replace('NODEREF', nodeRef.replace('://', '/'));
};

export const DOCUMENT_PREVIEW_API = (nodeRef: string, cache: number) => {
    const ticket = localStorage.getItem('auth:ticket') || '';
    return (
        DOCUMENT_PREVIEW_URL.replace('NODEREF', nodeRef.replace('://', '/')) +
        '&lastModified=pdf' +
        '&c=' +
        cache +
        '&alf_ticket=' +
        ticket
    );
};

export const DOCUMENT_THUMBNAIL_API = (nodeRef: string, cache: number) => {
    const ticket = localStorage.getItem('auth:ticket') || '';
    return (
        DOCUMENT_THUMBNAIL_URL.replace('NODEREF', nodeRef.replace('://', '/')) +
        '&lastModified=pre+' +
        cache +
        '&alf_ticket=' +
        ticket
    );
};

export const PDF_PREVIEW_API = (nodeRef: string, cache: number) => {
    const ticket = localStorage.getItem('auth:ticket') || '';
    return (
        PDF_PREVIEW_URL.replace('NODEREF', nodeRef.replace('://', '/')) +
        '&lastModified=pdf+' +
        cache +
        '&alf_ticket=' +
        ticket
    );
};

export const API_URL_CONFIGURATION = (): Object => {
    const ticket = localStorage.getItem('auth:ticket');
    return {
        params: {
            alf_ticket: ticket
        }
    };
};

export const AVATAR = (user: string) => {
    const d = new Date();
    const ticket = localStorage.getItem('auth:ticket') || '';
    return `${SERVICE_URI}/people/avatar/${user}?v=${d.getTime()}&alf_ticket=${ticket}`;
};

export const GROUP_AVATAR = (displayName: string, v?: string) => {
    const d = new Date();
    const ticket = localStorage.getItem('auth:ticket') || '';
    return `${SERVICE_URI}/authority/avatar/${_.toLower(displayName)}?v=${v ||
        d.getTime()}&alf_ticket=${ticket}`;
};

export const FILE_VIEW = (fileId: string, v?: any) => {
    const ticket = localStorage.getItem('auth:ticket') || 'NOTICKET';
    return `${HOST}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${fileId}/content?attachment=false&alf_ticket=${ticket}&v=${
        v ? v : Date.now()
    }`;
};

/**
 *  Process Diagram URL
 */
export const PROCESS_DIAGRAM_URL = (workflowId: string) => {
    const ticket = localStorage.getItem('auth:ticket');
    return `${WORKFLOW_DIAGRAM_API.replace(
        'WORKFLOWID',
        workflowId
    )}?alf_ticket=${ticket || ''}`;
};
