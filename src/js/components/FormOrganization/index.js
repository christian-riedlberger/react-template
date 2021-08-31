// @flow
import React, { Component } from 'react';
import { mapProps } from 'recompose';
import { Field, reduxForm, Form, reset } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';
import _ from 'lodash';
import { connect } from 'react-redux';

// MUI
import { withStyles } from '@material-ui/core/styles';

// Containers
import MessageContainer from 'containers/MessageContainer';
import GroupsContainer from 'containers/GroupsContainer';
import type { ContainerProps as GroupProps } from 'containers/GroupsContainer';

// Constants
import { renderHiddenField } from 'constants/FormFields';
import { ORG_NAMES_BLACKLIST } from 'constants/Config';
import messages from 'constants/Messages';
import { GROUP_AVATAR } from 'constants/ServiceURI';

// Utils
import { errorMessages } from 'utils/errorMessages';
import { checkRequiredFields, renderFormErrorMessage } from 'utils/form';
import { nameRegex } from 'utils/string';

// Relative
import OrganizationTabs from './OrganizationTabs';
import { roles as GroupRoles } from './config';

type DefaultProps = {
    errors: Array<string> | null,
    submitFailed: boolean,
    submitting: boolean,
    handleSubmit: Function | null,
    change: Function,
    intl: intlShape,
    initialValues?: Object,
    error?: string,
    classes: Object,
    formValues: Object,
    syncErrors: Object,
    userProfile: Object,
    showMessage: Function
} & GroupProps;

type Props = {
    onSuccess: Function,
    dispatch: Function,
    setIsLoading: Function,
    displayName?: string, // onEdit -> pass displayName
    shortName?: string, // onEdit -> pass shortName
    parentName?: string // onNew -> pass parentName
} & DefaultProps;

type State = {
    errorState: Object,
    roles: Array<Object>
};

interface Organization {
    isNew: boolean;
    shortName: string;
    displayName: string;
    parentName: string;
    roles: Array<string>;
    country: string;
    address: string;
    city: string;
    postalcode: string;
    phone: string;
    website: string;
    sender: string;
    avatar?: File;
}

const styles = () => ({
    root: {}
});

const REQUIRED_FIELDS = [
    'displayName',
    'address',
    'city',
    'country',
    'postalcode',
    'phone'
];
const REQUIRED_MESSAGE_ID = 'requiredMissing';

const validate = values => {
    const errors: Object = { ...checkRequiredFields(REQUIRED_FIELDS, values) };

    if (
        nameRegex.test(values.displayName) ||
        _.endsWith(values.displayName, '.')
    ) {
        errors.displayNameChar = 'groupNameRestrictedChar';
    }
    if (values.displayName && values.displayName.length > 50)
        errors.displayNameLength = 'invalidLength50';

    if (
        values.displayName &&
        _.reduce(
            ORG_NAMES_BLACKLIST,
            (prev, curr) =>
                prev || values.displayName.toUpperCase().indexOf(curr) > -1,
            false
        )
    ) {
        errors.displayNameWord = 'groupNameRestrictedWord';
    }

    return errors;
};

export const FormName = 'organizationForm';

@withStyles(styles)
@MessageContainer()
@GroupsContainer({ shortName: props => props.shortName })
@mapProps(props => ({
    ...props,
    initialValues: {
        parentGroup: _.get(props, 'parentName'),
        ...props.activeGroup
    }
}))
@reduxForm({
    form: FormName,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    forceUnregisterOnUnmount: false,
    destroyOnUnmount: false,
    validate
})
@injectIntl
@connect(state => ({
    formValues: state.form[FormName].values,
    syncErrors: state.form[FormName].syncErrors
}))
class FormOrganization extends Component<Props, State> {
    constructor(props: Object) {
        super(props);
        this.state = {
            roles: _.map(GroupRoles, r => ({ ...r, active: false })),
            errorState: []
        };
    }

    componentDidMount() {
        const { shortName } = this.props;

        if (shortName) {
            // eslint-disable-next-line compat/compat
            fetch(GROUP_AVATAR(shortName))
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `${shortName}_AVATAR`);
                    this.props.change('avatar', file);
                    return true;
                })
                .catch(e => {
                    throw e;
                });
        }
    }

    componentDidUpdate(prevProps: Object) {
        const { initialValues, syncErrors } = this.props;
        const { errorState } = this.state;

        const nonRequiredValues = _.pickBy(syncErrors, value => {
            return value !== 'required';
        });

        if (
            !_.isEqual(
                _.get(prevProps, 'initialValues.roles'),
                _.get(initialValues, 'roles')
            )
        ) {
            const newRoles = _.map(this.state.roles, r => {
                const index = initialValues
                    ? _.indexOf(initialValues.roles, r.value)
                    : -1;
                if (index > -1) {
                    return {
                        ...r,
                        active: true
                    };
                }
                return r;
            });

            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                roles: newRoles
            });
        }

        if (!_.isEmpty(nonRequiredValues)) {
            // Handle displaying either sync errors or submission errors for the form
            if (_.isEmpty(errorState) || errorState[0] === REQUIRED_MESSAGE_ID)
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({
                    errorState: nonRequiredValues
                });
            if (
                !_.isEmpty(errorState) &&
                !_.isEqual(errorState, nonRequiredValues)
            )
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({
                    errorState: nonRequiredValues
                });
        } else if (!_.isEmpty(errorState) && !_.has(errorState, 'error')) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ errorState: {} });
        }
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(reset(FormName));
    }

    handleToggle = (value: string) => {
        const index = _.findIndex(this.state.roles, { value });
        if (index > -1)
            this.setState(state => ({
                roles: _.set(state.roles, `[${index}]`, {
                    ...state.roles[index],
                    active: !state.roles[index].active
                })
            }));
    };

    onSubmit = () => {
        const {
            initialValues,
            saveOrganization,
            saveGroup,
            uploadAvatar,
            formValues,
            syncErrors,
            dispatch,
            userProfile,
            setIsLoading,
            showMessage,
            intl
        } = this.props;
        const isEditMode = initialValues && initialValues.isEditMode;
        let isValid = false;
        const organization: Organization = {
            isNew: !isEditMode,
            shortName: formValues.shortName,
            displayName: _.trim(formValues.displayName),
            parentName: formValues.parentGroup,
            roles: _.map(_.filter(this.state.roles, 'active'), 'value'),
            country: formValues.country,
            address: formValues.address,
            city: formValues.city,
            postalcode: formValues.postalcode,
            phone: formValues.phone,
            website: formValues.website,
            avatar: formValues.avatar,
            sender: userProfile.userName
        };

        // Submit validation to ensure all required fields are filled.
        if (!_.isEmpty(syncErrors)) {
            isValid = false;
            if (!_.values(syncErrors).some(value => value !== 'required')) {
                this.setState({
                    errorState: { error: REQUIRED_MESSAGE_ID }
                });
            }
        } else {
            isValid = true;
        }

        if (isValid) {
            setIsLoading(true);
            showMessage({ message: 'organizationSaving', variant: 'pending' });
            if (isEditMode) {
                return saveGroup(organization)
                    .then(r => {
                        if (
                            r.value.data &&
                            r.value.data.error &&
                            r.value.data.error.length > 0
                        ) {
                            const error = r.value.data.error
                                ? r.value.data.error
                                : intl.formatMessage(
                                    messages.groupsCannotBeSaved
                                );
                            dispatch({
                                type: '@@redux-form/UPDATE_SYNC_ERRORS',
                                meta: { form: FormName },
                                payload: { syncErrors: { name: error } }
                            });
                        } else {
                            if (organization.avatar) {
                                uploadAvatar(
                                    organization.avatar,
                                    organization.shortName
                                );
                            }
                            this.props.onSuccess(
                                organization,
                                intl.formatMessage(messages.organizationSaved)
                            );
                        }
                        setIsLoading(false);
                        return null;
                    })
                    .catch(e => {
                        throw e;
                    });
            }

            return saveOrganization(organization)
                .then(r => {
                    if (
                        r.value.data &&
                        r.value.data.error &&
                        r.value.data.error.length > 0
                    ) {
                        const error = r.value.data.error
                            ? r.value.data.error
                            : intl.formatMessage(
                                messages.organizationCannotBeSaved
                            );
                        dispatch({
                            type: '@@redux-form/UPDATE_SYNC_ERRORS',
                            meta: { form: FormName },
                            payload: { syncErrors: { name: error } }
                        });
                    } else {
                        if (organization.avatar) {
                            uploadAvatar(
                                organization.avatar,
                                // need to append org suffix since it isn't on the return result
                                `${r.value.data.data.shortName}_ORGANIZATION`
                            );
                        }
                        this.props.onSuccess(
                            organization,
                            intl.formatMessage(messages.organizationCreated)
                        );
                    }
                    setIsLoading(false);
                    return null;
                })
                .catch(e => {
                    throw e;
                });
        }
    };

    render() {
        const { classes } = this.props;
        const { roles, errorState } = this.state;
        const errorMessage = errorMessages(errorState);

        return (
            <Form
                onSubmit={this.onSubmit}
                className={classes.root}
                autoComplete="off"
            >
                {!_.isEmpty(errorMessage) &&
                    renderFormErrorMessage(errorMessage)}
                <OrganizationTabs
                    {...this.props}
                    roles={roles}
                    onChangeRole={this.handleToggle}
                />

                <Field component={renderHiddenField} name="shortName" />
                <Field component={renderHiddenField} name="parentGroup" />
            </Form>
        );
    }
}
export default FormOrganization;
