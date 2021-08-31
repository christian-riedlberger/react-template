// @flow
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { extendFormReducer } from 'utils/form';

import AuthorityReducer from './reducerAuthorities';
import LoginReducer from './reducerLogin';
import UsersReducer from './reducerUsers';
import GroupsReducer from './reducerGroups';
import AccessReducer from './reducerAccess';
import MessageReducer from './reducerMessage';
import PaginationReducer from './reducerPagination';
import PreferenceReducer from './reducerPreferences';
import RepoReducer from './reducerRepo';
import TasksReducer from './reducerTasks';
import PickerReducer from './reducerPicker';
import CommentReducer from './reducerComments';
import VersionHistoryReducer from './reducerVersionHistory';
import RequestsReducer from './reducerRequests';
import SharedReducer from './reducerShared';
import BreadcrumbsReducer from './reducerBreadcrumb';
import InvitationsReducer from './reducerInvitations';
import SearchReducer from './reducerSearch';

/**
 *  Combine all app reducers
 *  into a singe application state
 */
export default combineReducers({
    login: LoginReducer,
    access: AccessReducer,
    authorities: AuthorityReducer,
    form: extendFormReducer(formReducer),
    groups: GroupsReducer,
    search: SearchReducer,
    message: MessageReducer,
    pagination: PaginationReducer,
    preferences: PreferenceReducer,
    users: UsersReducer,
    repo: RepoReducer,
    alltasks: TasksReducer,
    picker: PickerReducer,
    comments: CommentReducer,
    versionHistory: VersionHistoryReducer,
    allRequests: RequestsReducer,
    shared: SharedReducer,
    breadcrumbs: BreadcrumbsReducer,
    invitations: InvitationsReducer
});
