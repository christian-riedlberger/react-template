// @flow
/**
 * MESSAGE - global message
 * @type {string}
 */
export const SHOW_MESSAGE: string = 'SHOW_MESSAGE';
export const HIDE_MESSAGE: string = 'HIDE_MESSAGE';

/**
 * SEARCH - global earch
 * @type {string}
 */
export const FETCH_SEARCH: string = 'FETCH_SEARCH';
export const CLEAR_SEARCH: string = 'CLEAR_SEARCH';

/**
 * PREFERENCES - action types
 * @type {string}
 */
export const UPDATE_PREFERENCE: string = 'UPDATE_PREFERENCE';
export const FETCH_PREFERENCES: string = 'FETCH_PREFERENCES';
export const SET_ACTIVE_PREFERENCE: string = 'SET_ACTIVE_PREFERENCE';
export const CLEAR_ACTIVE_PREFERENCE: string = 'CLEAR_ACTIVE_PREFERENCE';

export const UPDATE_PREFERENCE_DASHBOARD: string =
    'UPDATE_PREFERENCE_DASHBOARD';
export const FETCH_PREFERENCES_DOCLIB: string = 'FETCH_PREFERENCES_DOCLIB';

/**
 * ANOMALIES - action types
 * @type {string}
 */
export const FETCH_ANOMALY: string = 'FETCH_ANOMALY';
export const FETCH_ANOMALIES: string = 'FETCH_ANOMALIES';
export const FETCH_ANOMALIES_OVERVIEW: string = 'FETCH_ANOMALIES_OVERVIEW';
export const CLEAR_ACTIVE_ANOMALY: string = 'CLEAR_ACTIVE_ANOMALY';

/**
 * ASSESSMENTS - action types
 * @type {string}
 */
export const FETCH_ASSESSMENT: string = 'FETCH_ASSESSMENT';
export const FETCH_ASSESSMENTS: string = 'FETCH_ASSESSMENTS';
export const FETCH_ASSESSMENTS_OVERVIEW: string = 'FETCH_ASSESSMENTS_OVERVIEW';
export const CLEAR_ACTIVE_ASSESSMENT: string = 'CLEAR_ACTIVE_ASSESSMENT';

/**
 * CANDIDATES - action types
 * @type {string}
 */
export const FETCH_CANDIDATE: string = 'FETCH_CANDIDATE';
export const FETCH_CANDIDATES: string = 'FETCH_CANDIDATES';
export const SET_ACTIVE_CANDIDATE: string = 'SET_ACTIVE_CANDIDATE';
export const CLEAR_ACTIVE_CANDIDATE: string = 'CLEAR_ACTIVE_CANDIDATE';

/**
 * EXAMS - action types
 * @type {string}
 */
export const FETCH_EXAM: string = 'FETCH_EXAM';
export const FETCH_EXAMS: string = 'FETCH_EXAMS';
export const CLEAR_ACTIVE_EXAM: string = 'CLEAR_ACTIVE_EXAM';

/**
 * INFRACTIONS - action types
 * @type {string}
 */
export const FETCH_INFRACTION: string = 'FETCH_INFRACTION';
export const FETCH_INFRACTIONS: string = 'FETCH_INFRACTIONS';
export const CLEAR_ACTIVE_INFRACTION: string = 'CLEAR_ACTIVE_INFRACTION';

/**
 * RELIABILITIES - action types
 * @type {string}
 */
export const FETCH_RELIABILITY: string = 'FETCH_RELIABILITY';
export const FETCH_RELIABILITIES: string = 'FETCH_RELIABILITIES';
export const FETCH_RELIABILITY_OVERVIEW: string = 'FETCH_RELIABILITY_OVERVIEW';
export const CLEAR_ACTIVE_RELIABILITY: string = 'CLEAR_ACTIVE_RELIABILITY';

/**
 * CLEANLINESS - action types
 * @type {string}
 */
export const FETCH_CLEANLINESS: string = 'FETCH_CLEANLINESS';
export const FETCH_CLEANLINESS_OVERVIEW: string = 'FETCH_CLEANLINESS_OVERVIEW';
export const CLEAR_ACTIVE_CLEANLINESS: string = 'CLEAR_ACTIVE_CLEANLINESS';
/**
 *
 * FETCH_INVIGILATORS - action types
 * @type {string}
 */
export const FETCH_INVIGILATOR: string = 'FETCH_INVIGILATOR';
export const FETCH_INVIGILATORS: string = 'FETCH_INVIGILATORS';
export const CLEAR_ACTIVE_INVIGILATOR: string = 'CLEAR_ACTIVE_INVIGILATOR';

/**
 * ITEMS - action types
 * @type {string}
 */
export const FETCH_ITEM: string = 'FETCH_ITEM';
export const FETCH_ITEMS: string = 'FETCH_ITEMS';
export const FETCH_ITEMS_OVERVIEW: string = 'FETCH_ITEMS_OVERVIEW';
export const CLEAR_ACTIVE_ITEM: string = 'CLEAR_ACTIVE_ITEM';

/**
 * FETCH_ORGANIZATIONS - action types
 * @type {string}
 */
export const FETCH_ORGANIZATION: string = 'FETCH_ORGANIZATION';
export const FETCH_ORGANIZATIONS: string = 'FETCH_ORGANIZATIONS';
export const FETCH_ORGANIZATIONS_OVERVIEW: string =
    'FETCH_ORGANIZATIONS_OVERVIEW';
export const CLEAR_ACTIVE_ORGANIZATION: string = 'CLEAR_ACTIVE_ORGANIZATION';

/**
 * Locations - action types
 */
export const FETCH_LOCATIONS: string = 'FETCH_LOCATIONS';
export const FETCH_LOCATION: string = 'FETCH_LOCATION';
export const FETCH_LOCATIONS_OVERVIEW: string = 'FETCH_LOCATIONS_OVERVIEW';

/**
 * QUARANTINES - action types
 * @type {string}
 */
export const FETCH_QUARANTINE: string = 'FETCH_QUARANTINE';
export const FETCH_QUARANTINES: string = 'FETCH_QUARANTINES';
export const FETCH_QUARANTINES_OVERVIEW: string = 'FETCH_QUARANTINES_OVERVIEW';
export const CLEAR_ACTIVE_QUARANTINE: string = 'CLEAR_ACTIVE_QUARANTINE';

/**
 * DOMAINS - action types
 * @type { string }
 */
export const SET_DOMAIN_LOCATIONS: string = 'SET_DOMAIN_LOCATIONS';
export const SET_DOMAIN_ORGANIZATIONS: string = 'SET_DOMAIN_ORGANIZATIONS';
export const SET_DOMAIN_ASSESSMENTS: string = 'SET_DOMAIN_ASSESSMENTS';
export const SET_DOMAIN_DATE_RANGE: string = 'SET_DOMAIN_DATE_RANGE';
export const CLEAR_DOMAIN_LOCATIONS: string = 'CLEAR_DOMAIN_LOCATIONS';
export const CLEAR_DOMAIN_ORGANIZATIONS: string = 'CLEAR_DOMAIN_ORGANIZATIONS';
export const CLEAR_DOMAIN_ASSESSMENTS: string = 'CLEAR_DOMAIN_ASSESSMENTS';
export const CLEAR_DOMAIN_DATE_RANGE: string = 'CLEAR_DOMAIN_DATE_RANGE';
export const HYDRATE_DOMAINS: string = 'HYDRATE_DOMAINS';

/**
 * REPORTS - action types
 * @type {string}
 */
export const FETCH_COMMENTS = 'FETCH_COMMENTS';
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const CLEAR_COMMENTS = 'CLEAR_COMMENTS';

/**
 * FOLDER - Repo action types
 * @type {string}
 */
export const FETCH_NODE: string = 'FETCH_NODE';
export const FETCH_DOCUMENTS: string = 'FETCH_DOCUMENTS';
export const FETCH_DOCUMENTS_USERS: string = 'FETCH_DOCUMENTS_USERS';
export const FETCH_NODE_VERSIONS: string = 'FETCH_NODE_VERSIONS';
export const FETCH_REPO_ROOT: string = 'FETCH_REPO_ROOT';
export const FETCH_FOLDERS: string = 'FETCH_FOLDERS';
export const FETCH_FOLDER: string = 'FETCH_FOLDER';
export const CREATE_FOLDER: string = 'CREATE_FOLDER';
export const UPDATE_FOLDER: string = 'UPDATE_FOLDER';
export const DELETE_NODE: string = 'DELETE_NODE';
export const CLEAR_ACTIVE_FOLDER: string = 'CLEAR_ACTIVE_FOLDER';
export const CLEAR_ACTIVE_FILE: string = 'CLEAR_ACTIVE_FILE';
export const TOGGLE_DOC_ITEM: string = 'TOGGLE_DOC_ITEM';
export const MOVE_FOLDER: string = 'MOVE_FOLDER';
export const UPLOAD_FILE: string = 'UPLOAD_FILE';
export const CHANGE_ACTIVE_FOLDER: string = 'CHANGE_ACTIVE_FOLDER';
export const UPLOAD_FILE_ADD: string = 'UPLOAD_FILE_ADD';
export const UPLOAD_FILE_REMOVE: string = 'UPLOAD_FILE_REMOVE';
export const UPLOAD_FILE_CANCEL: string = 'UPLOAD_FILE_CANCEL';
export const UPLOAD_FILE_ERROR: string = 'UPLOAD_FILE_ERROR';
export const UPLOAD_FILE_CLEAR: string = 'UPLOAD_FILE_CLEAR';
export const UPLOAD_FILE_PROGRESS: string = 'UPLOAD_FILE_PROGRESS';
export const UPLOAD_FILE_FINISH: string = 'UPLOAD_FILE_FINISH';
export const REFRESH_FILE_FINISH: string = 'REFRESH_FILE_FINISH';
export const LOADING: string = 'LOADING';
export const COPY_NODE: string = 'COPY_NODE';
export const MOVE_NODE: string = 'MOVE_NODE';
export const UPDATE_NODES: string = 'UPDATE_NODES';
export const RESET_REPO_FILES: string = 'RESET_REPO_FILES';
export const RESET_REPO_EXAM_FILES: string = 'RESET_REPO_EXAM_FILES';
export const CLEAR_DOC_ITEM: string = 'CLEAR_DOC_ITEM';
export const SET_ACTIVE_FOLDER: string = 'SET_ACTIVE_FOLDER';
export const TOGGLE_OPEN_FOLDER: string = 'TOGGLE_OPEN_FOLDER';
export const CLEAR_FOLDERS: string = 'CLEAR_FOLDERS';
export const SET_ACTIVE_FILE: string = 'SET_ACTIVE_FILE';
export const FETCH_DOCUMENT_NODES: string = 'FETCH_DOCUMENT_NODES';
export const UPDATE_NODE: string = 'UPDATE_NODE';
export const UPLOAD_FILE_REQUEST: string = 'UPLOAD_FILE_REQUEST';
export const COPY_FILE_REQUEST: string = 'COPY_FILE_REQUEST';
export const SET_ACTIVE_REPO: string = 'SET_ACTIVE_REPO';
export const TREE_NEEDS_REFRESH: string = 'TREE_NEEDS_REFRESH';
export const CLEAR_TREE_NODES: string = 'CLEAR_TREE_NODES';
export const FETCH_DATALIST_DOCUMENTS: string = 'FETCH_DATALIST_DOCUMENTS';
export const CLEAR_DATALIST_DOCUMENTS: string = 'CLEAR_DATALIST_DOCUMENTS';
export const PUSH_RECENT_DOCUMENT: string = 'PUSH_RECENT_DOCUMENT';
export const GET_RECENT_DOCUMENTS: string = 'GET_RECENT_DOCUMENTS';
export const CLEAR_RECENT_DOCUMENTS: string = 'CLEAR_RECENT_DOCUMENTS';
export const DELETE_RECENT_DOCUMENTS: string = 'DELETE_RECENT_DOCUMENTS';

/**
 * Global Content Search
 * @type {string}
 */
export const FETCH_RESULTS = 'FETCH_RESULTS';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';

/**
 *  Reports - action types
 */
export const CREATE_REPORT: string = 'CREATE_REPORT';
export const UPDATE_REPORT: string = 'UPDATE_REPORT';
export const FETCH_REPORT: string = 'FETCH_REPORT';
export const FETCH_REPORTS: string = 'FETCH_REPORTS';
export const DELETE_REPORT: string = 'DELETE_REPORT';
export const CLEAR_ACTIVE_REPORT: string = 'CLEAR_ACTIVE_REPORT';

/**
 * USER - action types
 * @type {string}
 */
export const FETCH_USERS: string = 'FETCH_USERS';
export const DELETE_USER: string = 'DELETE_USER';
export const TOGGLE_USER: string = 'TOGGLE_USER';
export const FETCH_USER: string = 'FETCH_USER';
export const ADD_USER: string = 'ADD_USER';
export const EDIT_USER: string = 'EDIT_USER';
export const CLEAR_ACTIVE_USER: string = 'CLEAR_ACTIVE_USER';
export const CLEAR_SELECTED_USERS: string = 'CLEAR_SELECTED_USERS';
export const SET_CURRENT_PAGE: string = 'SET_CURRENT_PAGE';
export const FETCH_GROUPS_FOR_USER: string = 'FETCH_GROUPS_FOR_USER';
export const CLEAR_GROUPS_FOR_USER: string = 'CLEAR_GROUPS_FOR_USER';
export const UPLOAD_AVATAR: string = 'UPLOAD_AVATAR';
export const FETCH_USER_PROFILE: string = 'FETCH_USER_PROFILE';
export const SAVE_USER_PROFILE: string = 'SAVE_USER_PROFILE';
export const SET_ACTIVE_ORGANIZATION: string = 'SET_ACTIVE_ORGANIZATION';
export const SET_ACTIVE_ORGANIZATION_DONE: string =
    'SET_ACTIVE_ORGANIZATION_DONE';

/**
 * GROUPS - action types
 * @type {string}
 */
export const FETCH_GROUPS: string = 'FETCH_GROUPS';
export const FETCH_GROUP: string = 'FETCH_GROUP';
export const SAVE_GROUP: string = 'SAVE_GROUP';
export const DELETE_GROUP: string = 'DELETE_GROUP';
export const CLEAR_ACTIVE_GROUP: string = 'CLEAR_ACTIVE_GROUP';
export const FETCH_GROUPS_BROWSE: string = 'FETCH_GROUPS_BROWSE';
export const FETCH_CHILDREN: string = 'FETCH_CHILDREN';
export const DELETE_ITEM_FROM_GROUP: string = 'DELETE_ITEM_FROM_GROUP';
export const ADD_TO_GROUP: string = 'ADD_TO_GROUP';
export const FETCH_GROUPS_FULL: string = 'FETCH_GROUPS_FULL';
export const CLEAR_BROWSE_GROUP: string = 'CLEAR_BROWSE_GROUP';
export const CLEAR_FETCH_GROUP: string = 'CLEAR_FETCH_GROUP';
export const CLEAR_GROUP_HISTORY: string = 'CLEAR_GROUP_HISTORY';
export const PUSH_GROUP_HISTORY: string = 'PUSH_GROUP_HISTORY';
export const UPDATE_GROUP_AT_INDEX: string = 'UPDATE_GROUP_AT_INDEX';
export const DELETE_GROUP_HISTORY: string = 'DELETE_GROUP_HISTORY';
export const UPDATE_SEARCH_TERM: string = 'UPDATE_SEARCH_TERM';
export const RESET_GROUPS: string = 'RESET_GROUPS';
export const UPDATE_GROUP_LIST: string = 'UPDATE_GROUP_LIST';

/**
 * ORGANIZATIONS - action types
 * @type {string}
 */
export const FETCH_ORG_CHILDREN: string = 'FETCH_ORG_CHILDREN';

/**
 * TASK - Action types
 * @type {string}
 */
export const FETCH_WORKFLOW_DEFINITION = 'FETCH_WORKFLOW_DEFINITION';
export const FETCH_WORKFLOW_INSTANCE_DETAIL = 'FETCH_WORKFLOW_INSTANCE_DETAIL';
export const FETCH_TASKS: string = 'FETCH_TASKS';
export const UPDATE_ISSUED_TASKS: string = 'UPDATE_ISSUED_TASKS';
export const FETCH_ALL_TASKS: string = 'FETCH_ALL_TASKS';
export const FETCH_TASK: string = 'FETCH_TASK';
export const FETCH_PACKAGE: string = 'FETCH_PACKAGE';
export const CREATE_TASK: string = 'CREATE_TASK';
export const UPDATE_TASK: string = 'UPDATE_TASK';
export const DELETE_TASK: string = 'DELETE_TASK';
export const FETCH_DEFINITIONS: string = 'FETCH_DEFINITIONS';
export const FETCH_WF_INSTANCE: string = 'FETCH_WF_INSTANCE';
export const FETCH_WF_INSTANCES: string = 'FETCH_WF_INSTANCES';
export const FETCH_WF_INST_DETAIL: string = 'FETCH_WF_INST_DETAIL';
export const FETCH_TASK_COUNT: string = 'FETCH_TASK_COUNT';
export const CLEAR_ACTIVE_TASK: string = 'CLEAR_ACTIVE_TASK';
export const CREATE_REQUEST_TASK: string = 'CREATE_REQUEST_TASK';
export const UPDATE_REQUEST: string = 'UPDATE_REQUEST';
export const FETCH_TASK_AUTHORITIES: string = 'FETCH_TASK_AUTHORITIES';
export const CLEAR_ALL_TASKS: string = 'CLEAR_ALL_TASKS';
export const FETCH_ALL_REQUESTS: string = 'FETCH_ALL_REQUESTS';
export const FETCH_RECEIVED_TASKS: string = 'FETCH_RECEIVED_TASKS';
export const CLEAR_RECEIVED_TASKS: string = 'CLEAR_RECEIVED_TASKS';
export const FETCH_ISSUED_TASKS: string = 'FETCH_ISSUED_TASKS';
export const CLEAR_ISSUED_TASKS: string = 'CLEAR_ISSUED_TASKS';
export const PUSH_RECENT_TASK: string = 'PUSH_RECENT_TASK';
export const GET_RECENT_TASKS: string = 'GET_RECENT_TASKS';
export const CLEAR_RECENT_TASKS: string = 'CLEAR_RECENT_TASKS';

/**
 * LOGIN - Login action types
 * @type {string}
 */
export const LOGGED_IN: string = 'LOGGED_IN';
export const LOADING_APP: string = 'LOADING_APP';

/**
 * Permissions - Editor Action Types
 * @type {string}
 */
export const FETCH_PERMISSION: string = 'FETCH_PERMISSION';
export const UPDATE_PERMISSION: string = 'UPDATE_PERMISSION';

/**
 * Authority (user and groups) - Editor Action Types
 * @type {string}
 */
export const FETCH_AUTHORITY: string = 'FETCH_AUTHORITY';
export const LOOKUP_AUTHORITY: string = 'LOOKUP_AUTHORITY';
export const CLEAR_AUTHORITY: string = 'CLEAR_AUTHORITY';

// Trashcan
export const DELETE_TRASHCAN_NODES: string = 'DELETE_TRASHCAN_NODES';
export const FETCH_TRASHCAN_NODES: string = 'FETCH_TRASHCAN_NODES';
export const RECOVER_TRASHCAN_NODES: string = 'RECOVER_TRASHCAN_NODES';
export const TOGGLE_TRASHCAN_NODE: string = 'TOGGLE_TRASHCAN_NODE';
export const EMPTY_TRASHCAN: string = 'EMPTY_TRASHCAN';
export const CLEAR_SELECTED_NODES: string = 'CLEAR_SELECTED_NODES';

/**
 * Fetch Application rights
 * @type {string}
 */
export const FETCH_ACCESS = 'FETCH_ACCESS';
export const FETCH_PAGE_ACCESS = 'FETCH_PAGE_ACCESS';
export const FETCH_ACCESS_PENDING = 'FETCH_ACCESS_PENDING';

/**
 * Export API Actions
 * @type {string}
 */
export const PACKAGE_PENDING: string = 'PACKAGE_PENDING';
export const PACKAGE_SUCCESS: string = 'PACKAGE_SUCCESS';
export const ZIP_STARTED: string = 'ZIP_STARTED';
export const ZIP_PENDING: string = 'ZIP_PENDING';
export const ZIP_SUCCESS: string = 'ZIP_SUCCESS';

// /**
//  * NODE ITEM - Board Action Types
//  * @type {string}
//  */
// export const FETCH_XS = 'FETCH_XS';
// export const FETCH_X  = 'FETCH_X';
// export const CREATE_X = 'CREATE_X';
// export const UPDATE_X = 'UPDATE_X';
// export const DELETE_X = 'DELETE_X';
// export const CLEAR_ACTIVE_X = 'CLEAR_ACTIVE_X';

/**
 * Export picker action types
 * @type {string}
 */
export const FETCH_PICKER_FOLDER = 'FETCH_PICKER_FOLDER';
export const ADD_PICKER_ITEM = 'ADD_PICKER_ITEM';
export const REMOVE_PICKER_ITEM = 'REMOVE_PICKER_ITEM';
export const CLEAR_PICKER_ACTIVE = 'CLEAR_PICKER_ACTIVE';

/**
 * Export version history action types
 * @type {string}
 */
export const FETCH_VERSION_HISTORY = 'FETCH_VERSION_HISTORY';
export const UPLOAD_NEW_VERSION = 'UPLOAD_NEW_VERSION';

/**
 * Export shared actions
 * @type {string}
 */
export const FETCH_SHARED: string = 'FETCH_SHARED';
export const FETCH_SHARED_USERS: string = 'FETCH_SHARED_USERS';
export const CLEAR_SHARED: string = 'CLEAR_SHARED';

/**
 * Export breadcrumb actions
 * @type {string}
 */
export const PUSH_CRUMB: string = 'PUSH_CRUMB';
export const POP_CRUMB: string = 'POP_CRUMB';
export const CLEAR_CRUMBS: string = 'CLEAR_CRUMBS';
export const SET_CRUMB: string = 'SET_CRUMB';
export const UPDATE_CRUMB: string = 'UPDATE_CRUMB';

/**
 * Export invitation/onboarding actions
 * @type {string}
 */

export const SEND_INVITATIONS: string = 'SEND_INVITATIONS';
export const FETCH_INVITATIONS: string = 'FETCH_INVITATIONS';
export const ONBOARD_USER: string = 'ONBOARD_USER';
