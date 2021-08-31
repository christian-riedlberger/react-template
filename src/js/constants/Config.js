import messages from './Messages';
import { log } from 'utils/logger';

// DEV vs TEST helpers
export const ENABLE_PAGE_HELPERS = true;
export const ENABLE_HEADER_LINKS = true;

// Browser downloads
export const WIN_BROWSER_URL =
    'https://storage.googleapis.com/prod-resource-bucket/browser/Greenfence%20Secure%201.3.1.msi';
export const OSX_BROWSER_URL =
    'https://storage.googleapis.com/prod-resource-bucket/browser/Greenfence%20Secure-1.3.1.dmg';

// Remove old subnav
export const DISABLE_SUBNAV = true;

/**
 * NAMESPACE - User preference
 */
export const NAMESPACE: string = 'com.greenfence';

// FEE
export const AUTHENTICATION_FEE = 100;

// @todo REMOVE ME
export const DELAY = 500;

// Default language
export const DEFAULT_LANG = 'en';

// Default password strength
export const DEFAULT_PASSWORD_STRENGTH = 6;

// User idle timer (minutes)
export const IDLETIMER = 60;

// Dates
export const DATEFORMAT = 'DD-MM-YYYY';

// Workflow pending stage
export const GROUP_ROOT = '/ROOT/children';

// Preauth checking
export const IGNORE_AUTH_PRECHECK = false;

// Chart legend closed count
export const CHART_LEGEND_SUMMARY = 3;

// DEV
export const ENABLE_WHY_DID_YOURENDER = false;

// snackbar interval delay
export const SNACK_DELAY = 1000;

// Root group
export const ROOT_GROUP = {
    shortName: 'ROOT',
    displayName: 'Home',
    nodeRef: 'ROOT'
};

// Root group
export const ORGANIZATION_GROUP = {
    shortName: 'ORGANIZATIONS',
    displayName: 'Organizations',
    nodeRef: 'ORGANIZATIONS'
};

export const WILDCARD_GROUP = {
    shortName: '',
    displayName: 'Search Results',
    nodeRef: ''
};

export const SEARCH_CATEGORIES = [
    { id: 'catEverything', value: 'all' },
    { id: 'catDocuments', value: 'documents' },
    { id: 'catPeople', value: 'people' },
    { id: 'catOrganizations', value: 'organizations' },
    { id: 'catRequests', value: 'requests' }
];

export const DEBOUNCE_DELAY = 500;

// Language options header
export const LANGUAGES = [
    { key: 1, flag: 'gb', value: 'en' },
    { key: 2, flag: 'nl', value: 'nl' },
    { key: 3, flag: 'us', value: 'en-US' },
    { key: 4, flag: 'ca', value: 'en-CA' }
];

// Pagination
export const DEFAULT_PAGE_SIZE = 5;
export const USER_PAGE_SIZE = 25;
export const GROUP_PAGE_SIZE = 10;
export const TASK_PAGE_SIZE = 25;
export const ACTIVITY_PAGE_SIZE = 5;
export const MULTILINE_FORM_ROWS = 3;

/**
 * @desc Group api params
 *
 * GROUPS_SORT_BY
 * - set to "authorityName" instead of "authorityDisplayName" due to solr indexing issue @bvincent1
 */
export const GROUPS_SORT_BY = 'authorityName';

/**
 *  MAIN MENU
 */
export const MAIN_MENU_LINKS = [
    {
        title: 'dashboard',
        link: 'dashboard',
        icon: 'HomeIcon',
        alwaysAccess: true
    },
    {
        title: 'requests',
        link: 'requests/received',
        icon: 'RequestsIcon',
        children: [
            {
                title: 'received',
                link: 'requests/received',
                icon: 'RequestsIcon',
                inheritParent: true
            },
            {
                title: 'issued',
                link: 'requests/issued',
                icon: 'RequestsIcon',
                inheritParent: true
            },
            {
                title: 'reports',
                link: 'requests/reports',
                icon: 'RequestsIcon',
                inheritParent: true
            },
            {
                title: 'assign',
                link: 'requests/drafts/start',
                icon: 'RequestsIcon',
                inheritParent: true
            }
        ]
    },
    {
        title: 'documents',
        link: 'documents#/business',
        icon: 'DocumentsIcon'
    },
    {
        title: 'people',
        link: 'people/users',
        icon: 'PeopleIcon',
        children: [
            {
                title: 'people',
                link: 'people/edit/?.*',
                icon: 'PeopleIcon',
                hideNav: true,
                inheritParent: false
            },
            {
                title: 'users',
                link: 'people/users',
                icon: 'PeopleIcon',
                inheritParent: true
            },
            {
                title: 'groups',
                link: 'people/groups',
                icon: 'PeopleIcon',
                inheritParent: true
            }
        ]
    },
    {
        title: 'styles',
        link: '/',
        icon: 'DashboardIcon'
    }
];

export const ADMIN_MENU_LINKS = [];

// Quick links
export const HOME_PAGE_LINK = '/dashboard';
export const PEOPLE_LINK = '/people/users';

/**
 *  CHART COLORS
 */
export const CHART_RED = '#EA6A6A';
export const CHART_YELLOW = '#EA6A6A';
export const CHART_GREEN_SCALE = [
    '#EA6A6A',
    '#EFBB3A',
    '#1DE9B6',
    '#b9ebe7',
    '#97e1dc',
    '#74d7d0',
    '#52cdc5',
    '#41a49d'
];

export const CHART_BASE_GREEN = ['#3AE9B6', '#E8FDF8'];
export const CHART_BASE_YELLOW = ['#EFBB3A', '#FDF8EB'];
export const CHART_BASE_RED = ['#EB696A', '#FDF0F0'];

export const MIN_RED_THRESHOLD = 80;
export const MAX_RED_THRESHOLD = 100;
export const MIN_YELLOW_THRESHOLD = 60;
export const MAX_YELLOW_THRESHOLD = 79;
export const MIN_GREEN_THRESHOLD = 0;
export const MAX_GREEN_THRESHOLD = 59;

/**
 * Alfresco API login options
 */
export const ALFRESCO_AUTH_OPTS = {
    hostEcm: localStorage.getItem('greenfence.API_ROOT'),
    hostBpm: localStorage.getItem('greenfence.API_ROOT'),
    disableCsrf: true,
    withCredentials: true
};

// Default moment date format, eg: "12 Aug 19"
export const DATE_FORMAT = 'DD MMM YY';

export const DEFAULT_INHERIT_PERMISSIONS = true;

export const DEFAULT_PERMISSION_ROLE = 'secureconsumer';

export const AUTHORITY_ROLES = [
    'secureconsumer',
    'commentator',
    'collaborator',
    'coordinator'
];

export const TASK_STATUS_OPTS = [
    {
        label: messages.pending,
        value: 'pending',
        color: '#4caf50'
    },
    {
        label: messages.compliant,
        value: 'compliant',
        color: '#ffeb3b'
    },
    {
        label: messages.notCompliant,
        value: 'notCompliant',
        color: '#ffeb3b'
    },
    {
        label: messages.na,
        value: 'na',
        color: '#ffeb3b'
    }
];

export const TASK_PROGRESS_OPTS = [
    {
        label: messages.notStarted,
        value: 'notStarted',
        color: '#4caf50'
    },
    {
        label: messages.inprogress,
        value: 'inprogress',
        color: '#ffeb3b'
    },
    {
        label: messages.responded,
        value: 'responded',
        color: '#ffeb3b'
    },
    {
        label: messages.overdue,
        value: 'overdue',
        color: '#f44336'
    }
];
/**
 * Alfresco Document Root
 */
export const DOCLIB = 'Documents';

export const ORG_NAMES_BLACKLIST = [
    'ORGANIZATION',
    'SPECIFICATION_REVIEWERS',
    'MASTER_AUTHENTICATORS',
    'ADMINISTRATORS',
    'EMPLOYEES',
    'OPERATIONS',
    'SUPPLIERS'
];

/**
 * Repository types
 */
export const REPO_BUSINESS = 'business';
export const REPO_PERSONAL = 'personal';
export const REPO_SHARED = 'shared';

export const REPOS = {
    REPO_BUSINESS,
    REPO_PERSONAL,
    REPO_SHARED
};

export const GMAPS_API_KEY = '';
