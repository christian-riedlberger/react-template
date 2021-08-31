/* eslint-disable promise/always-return */
// @flow
import React, { Component } from 'react';
import { mapProps } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';
import _ from 'lodash';
import { renderFormErrorMessage } from 'utils/form';
import { connect } from 'react-redux';

import GroupsContainer from 'containers/GroupsContainer';
import MessageContainer from 'containers/MessageContainer';
import type { ContainerProps as GroupProps } from 'containers/GroupsContainer';
import { renderTextField, renderHiddenField } from 'constants/FormFields';
import messages from 'constants/Messages';
import { UPDATE_GROUP_LIST } from 'constants/ActionTypes';
import type { Group as GroupType } from 'types/groupTypes';
import CheckboxGroup from 'components/CheckboxGroup';
import { getReservedOrgName } from 'utils/string';
import { errorMessages } from 'utils/errorMessages';
import { roles as GroupRoles } from './config';

type DefaultProps = {
    error: Array<string> | null,
    submitFailed: boolean,
    submitting: boolean,
    handleSubmit: Function | null,
    change: Function,
    intl: intlShape,
    initialValues: Object,
    error?: Array<string>,
    classes: Object,
    formValues: Function,
    syncErrors: Object,
    dispatch: Function,
    showMessage: Function
} & GroupProps;

type Props = {
    onSuccess: Function,
    setIsLoading: Function,
    shortName?: string, // onEdit -> pass shortName
    parentName?: string // onNew -> pass parentName
} & DefaultProps;

type State = {
    roles: Array<Object>,
    prevDisplayName: string,
    prevDisplayNameValue: string
};

const styles = () => ({
    root: {
        width: 400,
        padding: 0,
        '& fieldset': {
            margin: 0
        },
        '& .MuiGrid-item': {
            padding: '0.7em 0'
        },
        '& fieldset.MuiFormControl-root': { width: '100%!important' },
        '& fieldset.MuiFormControl-root .MuiFormGroup-root': {
            width: '100%!important'
        }
    }
});

const validate = values => {
    const errors = {};
    const nonGroupChars = /[/\\:;|=+*?!#$%^`.,~'{}@"<>[\]]/;

    if (!values.displayName) {
        errors.displayName = 'required';
    } else if (nonGroupChars.test(values.displayName)) {
        errors.displayName = 'invalidFilename';
    } else if (values.displayName && values.displayName.length > 50)
        errors.displayName = 'invalidLength50';

    return errorMessages(errors);
};

export const FormName = 'groupForm';

@withStyles(styles)
@MessageContainer()
@GroupsContainer({
    shortName: props => props.shortName
})
@mapProps(props => ({
    ...props,
    initialValues: {
        parentGroup: _.get(props, 'parentName'),
        groupRootOrganization: _.get(props, 'groupRootOrganization'),
        ...props.activeGroup
    }
}))
@reduxForm({
    form: FormName,
    enableReinitialize: true,
    validate
})
@injectIntl
@connect(state => ({
    formValues: state.form[FormName].values,
    syncErrors: state.form[FormName].syncErrors
}))
class FormGroup extends Component<Props, State> {
    constructor(props: Object) {
        super(props);
        this.state = {
            roles: _.map(GroupRoles, r => ({
                ...r,
                active: false,
                disabled: false
            })),
            prevDisplayName: '',
            prevDisplayNameValue: ''
        };
    }

    componentDidUpdate(prevProps: Object) {
        const { initialValues, intl } = this.props;

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

                const inheritedIndex = initialValues
                    ? _.indexOf(initialValues.inheritedRoles, r.value)
                    : -1;
                if (inheritedIndex > -1) {
                    return {
                        ...r,
                        title: intl.formatMessage(messages.inheritedRoles, {
                            value: _.capitalize(r.value)
                        }),
                        active: true,
                        disabled: true
                    };
                }
                return r;
            });

            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                roles: newRoles
            });
        }

        if (
            !_.isEqual(
                _.get(prevProps, 'initialValues.displayName'),
                getReservedOrgName(_.get(initialValues, 'displayName'), intl)
            )
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                prevDisplayNameValue: _.get(initialValues, 'displayName'),
                prevDisplayName: getReservedOrgName(
                    _.get(initialValues, 'displayName'),
                    intl
                )
            });
            initialValues.displayName = getReservedOrgName(
                _.get(initialValues, 'displayName'),
                intl
            );
        }
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
            syncErrors,
            saveGroup,
            formValues,
            dispatch,
            setIsLoading,
            showMessage,
            intl
        } = this.props;
        const { prevDisplayName, prevDisplayNameValue } = this.state;
        let isValid = false;

        // Submit validation to ensure all required fields are filled.
        if (!_.isEmpty(syncErrors)) {
            isValid = false;
            showMessage({
                message: 'groupsCannotBeSaved',
                variant: 'error'
            });
        } else {
            isValid = true;
        }

        if (isValid) {
            const isEditMode = initialValues && initialValues.isEditMode;

            // $FlowFixMe
            const group: GroupType = {
                index: 0,
                isNew: !isEditMode,
                shortName: formValues.shortName,
                displayName: _.trim(
                    formValues.displayName === prevDisplayName
                        ? prevDisplayNameValue
                        : formValues.displayName
                ),
                parentName: formValues.parentGroup,
                groupRootOrganization: formValues.groupRootOrganization,
                roles: _.map(
                    _.filter(this.state.roles, {
                        active: true,
                        disabled: false
                    }),
                    'value'
                ),
                authorityType: 'GROUP',
                isOrganization: false,
                isRestricted: false
            };

            setIsLoading(true);
            showMessage({ message: 'groupSaving', variant: 'pending' });

            return saveGroup(group)
                .then(r => {
                    setIsLoading(false);
                    if (
                        r.value.data &&
                        r.value.data.error &&
                        r.value.data.error.length > 0
                    ) {
                        const error = r.value.data.error
                            ? r.value.data.error
                            : intl.formatMessage(messages.groupsCannotBeSaved);
                        showMessage({
                            message: 'groupsCannotBeSaved',
                            variant: 'error'
                        });
                        return dispatch({
                            type: '@@redux-form/UPDATE_SYNC_ERRORS',
                            meta: { form: FormName },
                            payload: { syncErrors: {}, error }
                        });
                    }

                    this.props.onSuccess(
                        group,
                        group.isNew ? 'groupCreated' : 'groupSaved'
                    );

                    if (group.isNew) {
                        dispatch({
                            type: UPDATE_GROUP_LIST,
                            payload: r
                        });
                    }
                })
                .catch(e => {
                    setIsLoading(false);
                    throw e;
                });
        }
    };

    render() {
        const { intl, classes, error } = this.props;
        const { roles } = this.state;

        return (
            <Form
                onSubmit={this.onSubmit}
                className={classes.root}
                autoComplete="off"
            >
                {renderFormErrorMessage(error, {
                    margin: '-1.2em -1.2em 1em -1.2em'
                })}

                <Field component={renderHiddenField} name="shortName" />
                <Field component={renderHiddenField} name="parentGroup" />
                <Field
                    component={renderHiddenField}
                    name="groupRootOrganization"
                />

                <Field
                    type="text"
                    name="displayName"
                    autoFocus
                    component={renderTextField}
                    label={intl.formatMessage(messages.name)}
                    fullWidth
                />

                <div style={{ marginTop: '1em' }}>
                    <CheckboxGroup
                        boxes={roles}
                        label={intl.formatMessage(messages.pageAccess)}
                        onToggle={this.handleToggle}
                    />
                </div>
            </Form>
        );
    }
}
export default FormGroup;
