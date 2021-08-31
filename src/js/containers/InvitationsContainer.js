// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
    sendInvitations,
    fetchInvitations,
    updateOnboardingUser,
    OnboardingDone
} from 'actions/ActionInvitations';

import { fetchUserProfile } from 'actions/ActionUsers';

/**
 * Selector function that returns a value from the component's own props
 * @arg Object - component's own props
 */

export type ContainerProps = {
    sendInvitations: Function,
    fetchInvitations: Function,
    updateOnboardingUser: Function,
    OnboardingDone: Function,
    fetchUserProfile: Function,
    invitations: Array<Object>,
    activeOrg: Object,
    userProfile: Object
};

const InvitationsContainer = () =>
    compose(
        connect(
            store => ({
                invitations: store.invitations.invitations,
                activeOrg: store.access.activeOrg,
                userProfile: store.users.userProfile
            }),
            {
                sendInvitations,
                fetchInvitations,
                updateOnboardingUser,
                OnboardingDone,
                fetchUserProfile
            }
        )
    );

export default InvitationsContainer;
