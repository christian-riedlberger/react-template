// @flow
import _ from 'lodash';

import {
    SEND_INVITATIONS,
    FETCH_INVITATIONS,
    ONBOARD_USER,
    FETCH_ACCESS
} from 'constants/ActionTypes';
import {
    PEOPLE_API,
    INVITATION_API,
    PASSWORD_CHANGE_URL,
    TASK_PROCESS_API,
    WORKFLOW_INSTANCE_API,
    ACCESS_API
} from 'constants/ServiceURI';

import { xhr } from './xhr';

export function sendInvitations(body: Object) {
    const config = { ...body };
    if (!config.role) config.role = '';
    const request = xhr.post(`${INVITATION_API}/send`, config);

    return {
        type: SEND_INVITATIONS,
        payload: request
    };
}

export function fetchInvitations(user: string | null, filters: Object) {
    const config = { user, filters };
    const request = xhr.get(INVITATION_API, config);

    return {
        type: FETCH_INVITATIONS,
        payload: request
    };
}

export function updateOnboardingUser(userInfo: Object) {
    const { userName } = userInfo;
    const user = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        disableAccount: false,
        isExternal: true
    };

    const taskInfo = {
        workflowId: userInfo.workflowId,
        prop_transitions: 'Next'
    };

    const args = {
        includeTasks: true,
        noCache: Math.random()
    };

    const setUserUrl = `${PEOPLE_API}/${userName}`;
    const changepasswordUrl = PASSWORD_CHANGE_URL(userName);
    const workflowUrl = `${WORKFLOW_INSTANCE_API}/${taskInfo.workflowId}`;

    const request = xhr
        .put(setUserUrl, user)
        // $FlowFixMe
        .then(() => {
            xhr.post(changepasswordUrl, {
                oldpw: userInfo.oldPassword,
                newpw: userInfo.newPassword
            });
            return true;
        })
        .then(() => {
            const tasks = xhr.get(workflowUrl, args).then(resp => {
                const task = _.find(resp.data.data.tasks, t => {
                    return t.title === 'Invitation';
                });
                const PROCESSURL = `${TASK_PROCESS_API}${task.id}/formprocessor`;
                const taskRequest = xhr.post(PROCESSURL, taskInfo);
                return taskRequest;
            });
            return tasks;
        })
        .catch(e => {
            throw e;
        });

    return {
        type: ONBOARD_USER,
        payload: request
    };
}

export function OnboardingDone() {
    return (dispatch: Function) =>
        xhr
            .jsonp(ACCESS_API, {})
            .then(payload => {
                dispatch({ type: FETCH_ACCESS, payload });
                return true;
            })
            .catch(e => {
                throw e;
            });
}
