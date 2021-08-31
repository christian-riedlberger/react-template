import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import {
    fetchPreference,
    updatePreference,
    clearActivePreference
} from 'actions/ActionPreferences';

export type ContainerProps = {
    preference: Object,
    preferenceDashboard: Object,
    activePreference: Object,
    fetchPreference: Function,
    updatePreference: Function,
    clearActivePreference: Function
};

export type Args = {
    namespace: string,
    useCache?: boolean,
    omit?: Array<string>
};

/**
 * Preference container
 * @param {namespace, useCache, omit} props
 */
const PreferenceContainer = () =>
    compose(
        connect(
            (store, parentProps) => {
                const props = {
                    preference: store.preferences.preference,
                    activePreference: store.preferences.activePreference,
                    isLoading:
                        store.preferences.isLoading || parentProps.isLoading
                };

                return props;
            },
            {
                fetchPreference,
                updatePreference,
                clearActivePreference
            }
        ),
        lifecycle({})
    );

export default PreferenceContainer;
