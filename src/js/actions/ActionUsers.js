/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable compat/compat */
// @flow
import _ from 'lodash';
import axios from 'axios';
import { reset } from 'redux-form';
import {
    API_URL_CONFIGURATION,
    PASSWORD_CHANGE_URL,
    USER_API,
    PEOPLE_API,
    PEOPLE_DELETE_API,
    GROUPS_API,
    AVATAR_API,
    ACCESS_API
} from 'constants/ServiceURI';
import {
    FETCH_USERS,
    DELETE_USER,
    FETCH_USER,
    FETCH_USER_PROFILE,
    ADD_USER,
    EDIT_USER,
    CLEAR_SELECTED_USERS,
    CLEAR_ACTIVE_USER,
    FETCH_GROUPS_FOR_USER,
    CLEAR_GROUPS_FOR_USER,
    UPLOAD_AVATAR,
    SAVE_USER_PROFILE,
    SET_ACTIVE_ORGANIZATION,
    SET_ACTIVE_ORGANIZATION_DONE
} from 'constants/ActionTypes';
import type { Search } from 'types/userTypes';
import { log } from 'utils/logger';
import { xhr } from './xhr';

/**
 * Get all users
 * @method GET
 * @param params:{} filter
 * @return {{type, payload}}
 */
export function fetchUsers(params?: Search) {
    const { sort, paging, filter, searchTerm } = params || {};
    const config = {};

    // Search
    if (searchTerm) config.term = searchTerm.term;
    if (filter) config.filter = filter;

    // Paging
    if (paging) {
        config.maxItems = paging.maxItems;
        config.skipCount = paging.skipCount;
    }

    // Sorting
    if (sort) {
        config.sortBy = sort ? sort.name : 'lastName';
        config.dir = sort ? sort.direction : 'ascending';
    }

    // Send filter on org
    const activeOrganization = localStorage.getItem('org:active');
    if (activeOrganization) config.organizationID = activeOrganization;

    const request = xhr.get(USER_API, config);

    return {
        type: FETCH_USERS,
        payload: request
    };
}

/**
 * Get user information
 * @method GET
 * @return {Promise}
 */
export function fetchUserInfo(userName: string, isPublic: boolean) {
    return xhr.get(`${USER_API}/user`, { userName, isPublic });
}

export function fetchGroupsForUser(shortNameFilter: string) {
    const request = xhr.get(GROUPS_API, {
        shortNameFilter: `*${shortNameFilter}*`
    });

    return {
        type: FETCH_GROUPS_FOR_USER,
        payload: request
    };
}

export function clearGroupsForUser() {
    return {
        type: CLEAR_GROUPS_FOR_USER,
        payload: true
    };
}

export function fetchUser(userName: string) {
    if (!userName) return false;

    const request = xhr.get(`${PEOPLE_API}/${userName}`, {
        groups: true
    });
    return {
        type: FETCH_USER,
        payload: request
    };
}

export function fetchUserProfile() {
    const userName = localStorage.getItem('auth:username') || null;
    if (!userName) return false;

    const request = xhr.get(`${PEOPLE_API}/${userName}`, { groups: false });
    return {
        type: FETCH_USER_PROFILE,
        payload: request
    };
}

export function clearUserProfile() {
    return (dispatch: Function) => {
        dispatch(reset('userModalForm'));
    };
}

export function clearActiveUser() {
    return {
        type: CLEAR_ACTIVE_USER,
        payload: true
    };
}
export function clearSelectedUsers() {
    return {
        type: CLEAR_SELECTED_USERS,
        payload: true
    };
}

export function addUser(userInfo: Object) {
    const url = PEOPLE_API;
    let user = null;
    let request = null;
    const groups = [];

    _.forEach(userInfo.groups, group => {
        const groupName = group.itemName ? group.itemName : group.fullName;
        groups.push(groupName);
    });

    user = {
        userName: userInfo.userName,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName ? userInfo.lastName : '',
        address: userInfo.address,
        companyaddress2: userInfo.companyaddress2,
        country: userInfo.country,
        postalcode: userInfo.postalcode,
        facebook: userInfo.facebook,
        linkedin: userInfo.linkedin,
        twitter: userInfo.twitter,
        email: userInfo.email,
        telephone: userInfo.telephone,
        jobtitle: userInfo.jobtitle,
        disableAccount: false,
        isExternal: userInfo.isExternal,
        timezone: userInfo.timezone,
        mobile: userInfo.mobile,
        countrycode: userInfo.countrycode,
        countrycodeMobile: userInfo.countrycodeMobile,
        about: userInfo.about,
        city: userInfo.city,
        state: userInfo.state,
        quota: -1,
        password: userInfo.newPassword,
        groups,
        sender: userInfo.sender,
        emailVisible: userInfo.emailVisible,
        jobtitleVisible: userInfo.jobtitleVisible,
        telephoneVisible: userInfo.telephoneVisible,
        mobileVisible: userInfo.mobileVisible,
        aboutVisible: userInfo.aboutVisible,
        stateVisible: userInfo.stateVisible,
        countryVisible: userInfo.countryVisible,
        facebookVisible: userInfo.facebookVisible,
        twitterVisible: userInfo.twitterVisible,
        linkedinVisible: userInfo.linkedinVisible
    };

    request = xhr.post(url, user);

    return {
        type: ADD_USER,
        payload: request
    };
}

export function editUser(userInfo: Object, selfEditing: boolean) {
    let url = PEOPLE_API;
    let user = null;

    // Update password
    if (!selfEditing) {
        if (userInfo.newPassword && userInfo.newPassword.length > 1) {
            xhr.post(PASSWORD_CHANGE_URL(userInfo.userName), {
                newpw: userInfo.newPassword
            });
        }
    }

    const { userName } = userInfo;

    // $FlowFixMe
    const promise = new Promise((resolve, reject) => {
        // @todo WONDER
        xhr.get(`${PEOPLE_API}/${userName}`, { groups: true }).then(
            data => {
                const addGroups = [];
                const removeGroups = [];

                _.forEach(userInfo.groups, group => {
                    const groupId = group.itemName
                        ? group.itemName
                        : group.fullName;
                    const i = _.findIndex(data.data.groups, {
                        itemName: groupId
                    });
                    if (i === -1) {
                        addGroups.push(groupId);
                    }
                });
                _.forEach(data.data.groups, group => {
                    const i = _.findIndex(userInfo.groups, {
                        itemName: group.itemName
                    });
                    const l = _.findIndex(userInfo.groups, {
                        fullName: group.itemName
                    });

                    if (i === -1 && l === -1) {
                        removeGroups.push(group.itemName);
                    }
                });

                user = {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    email: userInfo.email,
                    disableAccount: false,
                    telephone: userInfo.telephone,
                    address: userInfo.address,
                    companyaddress2: userInfo.companyaddress2,
                    country: userInfo.country,
                    postalcode: userInfo.postalcode,
                    facebook: userInfo.facebook,
                    linkedin: userInfo.linkedin,
                    twitter: userInfo.twitter,
                    jobtitle: userInfo.jobtitle,
                    timezone: userInfo.timezone,
                    mobile: userInfo.mobile,
                    countrycode: userInfo.countrycode,
                    countrycodeMobile: userInfo.countrycodeMobile,
                    about: userInfo.about,
                    city: userInfo.city,
                    state: userInfo.state,
                    isExternal: userInfo.isExternal,
                    quota: userInfo.quota,
                    addGroups,
                    removeGroups,
                    emailVisible: userInfo.emailVisible,
                    jobtitleVisible: userInfo.jobtitleVisible,
                    telephoneVisible: userInfo.telephoneVisible,
                    mobileVisible: userInfo.mobileVisible,
                    aboutVisible: userInfo.aboutVisible,
                    stateVisible: userInfo.stateVisible,
                    countryVisible: userInfo.countryVisible,
                    facebookVisible: userInfo.facebookVisible,
                    twitterVisible: userInfo.twitterVisible,
                    linkedinVisible: userInfo.linkedinVisible
                };
                url = `${PEOPLE_API}/${userName}`;

                // $FlowFixMe
                xhr.put(url, user).then(
                    () => {
                        if (selfEditing && userInfo.newPassword) {
                            const changepasswordUrl = PASSWORD_CHANGE_URL(
                                userName
                            );
                            // eslint-disable-next-line promise/catch-or-return
                            xhr.post(changepasswordUrl, {
                                oldpw: userInfo.oldPassword,
                                newpw: userInfo.newPassword
                            })
                                // $FlowFixMe
                                .then(
                                    () => {
                                        clearUserProfile();
                                        resolve();
                                    },
                                    changePasswordReject => {
                                        reject(changePasswordReject);
                                    }
                                );
                        } else {
                            resolve();
                        }
                    },
                    changeUserReject => {
                        reject(changeUserReject);
                    }
                );
            },
            groupsReject => {
                reject(groupsReject);
            }
        );
    });

    return {
        type: EDIT_USER,
        payload: promise
    };
}

export function saveUserProfile(userInfo: Object) {
    const { userName } = userInfo;

    // $FlowFixMe
    const promise = new Promise((resolve, reject) => {
        const user = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            address: userInfo.address,
            companyaddress2: userInfo.companyaddress2,
            country: userInfo.country,
            postalcode: userInfo.postalcode,
            facebook: userInfo.facebook,
            linkedin: userInfo.linkedin,
            twitter: userInfo.twitter,
            organization: userInfo.organization,
            timezone: userInfo.timezone,
            mobile: userInfo.mobile,
            countrycode: userInfo.countrycode,
            countrycodeMobile: userInfo.countrycodeMobile,
            about: userInfo.about,
            city: userInfo.city,
            state: userInfo.state,
            disableAccount: false,
            telephone: userInfo.telephone,
            jobtitle: userInfo.jobtitle,
            isExternal: userInfo.isExternal,
            quota: userInfo.quota,
            emailVisible: userInfo.emailVisible,
            jobtitleVisible: userInfo.jobtitleVisible,
            telephoneVisible: userInfo.telephoneVisible,
            mobileVisible: userInfo.mobileVisible,
            aboutVisible: userInfo.aboutVisible,
            stateVisible: userInfo.stateVisible,
            countryVisible: userInfo.countryVisible,
            facebookVisible: userInfo.facebookVisible,
            twitterVisible: userInfo.twitterVisible,
            linkedinVisible: userInfo.linkedinVisible
        };

        xhr.put(`${PEOPLE_API}/${userName}`, user)
            // $FlowFixMe
            .then(
                () => {
                    if (userInfo.newpassword) {
                        const changepasswordUrl = PASSWORD_CHANGE_URL(userName);

                        xhr.post(changepasswordUrl, {
                            oldpw: userInfo.oldpassword,
                            newpw: userInfo.newpassword
                        })
                            // $FlowFixMe
                            .then(
                                () => {
                                    clearUserProfile();
                                    resolve();
                                },
                                changePasswordReject =>
                                    reject(changePasswordReject)
                            );
                    } else {
                        resolve();
                    }
                },
                changeUserReject => reject(changeUserReject)
            );
    });
    return {
        type: SAVE_USER_PROFILE,
        payload: promise
    };
}

export function deleteUser(userName: string | Array<string>) {
    if (!userName) return false;
    let request = null;
    const config = API_URL_CONFIGURATION();
    if (typeof userName === 'string') {
        request = axios.delete(`${PEOPLE_DELETE_API}/${userName}`, config);
    } else {
        const requests = [];
        _.forEach(userName, item => {
            requests.push(axios.delete(`${PEOPLE_DELETE_API}/${item}`, config));
        });
        request = axios.all(requests);
    }

    return (dispatch: Function) => {
        if (request) {
            return request
                .then(() => {
                    dispatch({
                        type: DELETE_USER
                    });
                })
                .catch(r => {
                    log('RESPONSE', 'red', { r });
                });
        }
    };
}

export function uploadAvatar(file: File, userName: string) {
    const data = new FormData();
    data.append('filedata', file);
    data.append('username', userName);

    const request = xhr.post(AVATAR_API, data);

    return {
        type: UPLOAD_AVATAR,
        payload: request
    };
}

export function setActiveOrganization(shortName: string) {
    const request = xhr.jsonp(ACCESS_API, {
        shortName
    });

    localStorage.setItem('org:active', shortName);

    return {
        type: SET_ACTIVE_ORGANIZATION,
        payload: request
    };
}

export function setActiveOrganizationDone() {
    return {
        type: SET_ACTIVE_ORGANIZATION_DONE
    };
}
