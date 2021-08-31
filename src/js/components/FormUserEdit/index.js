// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { mapProps } from 'recompose';
import faker from 'faker';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router';
import { reduxForm, getFormSyncErrors, Form } from 'redux-form';
import * as EmailValidator from 'email-validator';
import { isURL } from 'validator';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import { textblack } from 'constants/Theme';
import { SHOW_MESSAGE } from 'constants/ActionTypes';
import { DEFAULT_PASSWORD_STRENGTH, PEOPLE_LINK } from 'constants/Config';
import messages from 'constants/Messages';

import Button from 'components/Button';
import FormUserEditError from 'components/FormUserEditError';
import FormUserAvatarModal from 'components/FormUserAvatarModal';
import CustomizedSnackbars from 'components/Snackbar';
import ErrorMessage from 'components/ErrorMessage';

import UserContainer from 'containers/UserContainer';
import { calculateStrength } from 'utils/people';

import FormAvatar from './FormAvatar';
import FormDetails from './FormDetails';
import FormLocation from './FormLocation';
import FormSocial from './FormSocial';
import FormCredentials from './FormCredentials';

type DefaultProps = {
    intl: intlShape,
    availableGroups: Array<Object>,
    formValues: Object | null,
    dispatch: Function,
    change: Function,
    initialValues?: Object,
    submitFailed: Boolean,
    clearGroupsForUser: Function,
    fetchGroupsForUser: Function,
    clearActiveUser: Function,
    editUser: Function,
    addUser: Function,
    uploadAvatar: Function,
    router: Object,
    formValues: Object,
    synchronousErrors: Object,
    handleSubmit: Function,
    reset: Function,
    serverMessage: Array<string>
};

type Props = {
    title: string,
    serverError?: string | null,
    userFormTest?: Object,
    userName: string,
    classes: Object,
    intl: intlShape
} & DefaultProps;

type State = {
    existingGroups: Array<Object>,
    username: string,
    isLoading: boolean
};

const styles = {
    root: {
        borderTop: '1px solid #e5e5e5',
        margin: '0 -2.2em',
        padding: '2em 2.2em 0 2.2em',

        '& .customTitle': {
            color: textblack,
            fontSize: '1.1em',
            fontWeight: 500
        },
        '& .customCollapseBody': {
            padding: '1em 0'
        }
    },
    headerButtons: {
        margin: '0 -1.7em',
        padding: '0 0 1em 1.5em',
        marginTop: '-.5em'
    },
    field: {
        '& label::first-letter': {
            textTransform: 'uppercase'
        },
        display: 'block'
    },
    avatarContainer: {
        marginTop: '2em',
        display: 'flex',
        justifyContent: 'left'
    },
    image: {
        marginRight: '2em',
        float: 'left'
    },
    link: {
        color: '#00C771'
    },
    avatar: {
        width: 100,
        height: 100
    },
    profileTitle: {
        paddingTop: '1.5em'
    },
    button: {
        background: '#ffffff',
        border: '1px solid lighten($primary0, 5 %)',
        color: 'lighten($primary0, 5 %)',
        textTransform: 'uppercase',
        margin: '20px',
        fontSize: '10px'
    },
    formControls: {
        marginTop: '1em',
        marginBottom: '3em',
        '& button:first-child': {
            marginLeft: '0!important'
        }
    }
};

const FACEBOOK_VALIDATION = {
    require_protocol: true,
    host_whitelist: ['facebook.com', 'www.facebook.com']
};

const TWITTER_VALIDATION = {
    require_protocol: true,
    host_whitelist: ['twitter.com', 'www.twitter.com']
};

const LINKEDIN_VALIDATION = {
    require_protocol: true,
    host_whitelist: ['linkedin.com', 'www.linkedin.com']
};

const validate = (values, props: Props) => {
    const errors = {};
    const { intl } = props;

    const nonNameChars = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/;

    if (_.isEmpty(_.trim(values.email))) {
        errors.email = intl.formatMessage(messages.usersEmailRequired);
    } else if (!EmailValidator.validate(values.email)) {
        errors.email = intl.formatMessage(messages.usersEmailInvalid);
    }

    if (_.isEmpty(_.trim(values.firstName))) {
        errors.firstName = intl.formatMessage(messages.usersFirstNameRequired);
    } else if (nonNameChars.test(values.firstName)) {
        errors.firstName = intl.formatMessage(messages.usersFirstNameInvalid);
    }

    if (
        !_.isEmpty(_.trim(values.lastName)) &&
        nonNameChars.test(values.lastName)
    ) {
        errors.lastName = intl.formatMessage(messages.usersLastNameInvalid);
    }

    if (_.isEmpty(values.userName)) {
        errors.userName = intl.formatMessage(messages.usersUserNameRequired);
        // eslint-disable-next-line no-useless-escape
    } else if (!/\w(\w|[\/`~,.<>;':"*?])*\w/.test(values.userName)) {
        errors.userName = intl.formatMessage(messages.usersUserNameInvalid);
    } else if (/[\\#?%]/.test(values.userName)) {
        errors.userName = intl.formatMessage(messages.usersUserNameInvalid);
    } else if (values.userName.length < 2) {
        errors.userName = intl.formatMessage(
            messages.usersUserNameValidationText
        );
    }

    if (!values.isEditMode && !values.newPassword) {
        errors.newPassword = intl.formatMessage(messages.usersPasswordRequired);
    } else if (values.newPassword && values.newPassword.length < 3) {
        errors.newPassword = intl.formatMessage(
            messages.usersPasswordValidationText
        );
    } else if (
        (!values.isEditMode &&
            calculateStrength(values.newPassword) <
                DEFAULT_PASSWORD_STRENGTH) ||
        (values.isEditMode &&
            values.newPassword &&
            values.newPassword.length > 0 &&
            calculateStrength(values.newPassword) < DEFAULT_PASSWORD_STRENGTH)
    ) {
        errors.newPassword = intl.formatMessage(messages.usersPasswordStrength);
    } else if (values.isEditMode && !values.oldPassword && values.newPassword) {
        errors.oldPassword = intl.formatMessage(messages.oldPasswordMissing);
    } else if (
        values.newPassword &&
        values.newPassword !== values.verifyPassword
    ) {
        errors.newPassword = intl.formatMessage(
            messages.usersPasswordVerificationText
        );
    }

    if (
        !_.isEmpty(values.facebook) &&
        !isURL(values.facebook, FACEBOOK_VALIDATION)
    ) {
        if (!isURL(`https://${values.facebook}`, FACEBOOK_VALIDATION))
            errors.facebook = intl.formatMessage(messages.invalidUrl);
    }

    if (
        !_.isEmpty(values.twitter) &&
        !isURL(values.twitter, TWITTER_VALIDATION)
    ) {
        if (!isURL(`https://${values.twitter}`, TWITTER_VALIDATION))
            errors.twitter = intl.formatMessage(messages.invalidUrl);
    }

    if (
        !_.isEmpty(values.linkedin) &&
        !isURL(values.linkedin, LINKEDIN_VALIDATION)
    ) {
        if (!isURL(`https://${values.linkedin}`, LINKEDIN_VALIDATION))
            errors.linkedin = intl.formatMessage(messages.invalidUrl);
    }
    return errors;
};

export const formName = 'formUserEdit';
@withStyles(styles)
@UserContainer({ userName: (props: Props) => props.userName })
@mapProps(props => ({
    ...props,
    initialValues: _.get(props, 'activeUser.isEditMode')
        ? props.activeUser
        : null
}))
@reduxForm({
    form: formName,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate
})
@connect(store => ({
    formValues: _.get(store, `form.${formName}.values`, null),
    synchronousErrors: getFormSyncErrors(`${formName}`)(store)
}))
@withRouter
class FormUserEdit extends Component<Props, State> {
    state: State;

    avatarModal: FormUserAvatarModal;

    constructor(props: Props) {
        super(props);
        this.state = {
            existingGroups: [],
            // eslint-disable-next-line react/no-unused-state
            username: props.initialValues ? props.initialValues.userName : '',
            isLoading: false
        };
    }

    static getDerivedStateFromProps(props: Object, state: Object) {
        let newGroups = null;
        const { groupsInitialized } = state;
        let newGroupsInit = groupsInitialized;
        if (props.initialValues) {
            if (!groupsInitialized) {
                newGroups = props.initialValues.groups;
                newGroupsInit = true;
            }
        }

        if (newGroups) {
            return {
                ...state,
                existingGroups: newGroups || state.existingGroups,
                username: props.initialValues
                    ? props.initialValues.userName
                    : '',
                groupsInitialized: newGroupsInit
            };
        }
        return null;
    }

    componentWillUnmount() {
        this.props.clearActiveUser();
    }

    handleDeleteGroup = (group: Object) => {
        const groupName = group.itemName ? group.itemName : group.fullName;
        const itemNameIndex = _.findIndex(this.state.existingGroups, {
            itemName: groupName
        });
        const fullNameIndex = _.findIndex(this.state.existingGroups, {
            fullName: groupName
        });
        const index = itemNameIndex !== -1 ? itemNameIndex : fullNameIndex;
        const newGroups = [...this.state.existingGroups];

        newGroups.splice(index, 1);

        this.setState({
            existingGroups: newGroups
        });
    };

    handleAddGroup = (e: Object, group: Object) => {
        this.setState(state => ({
            existingGroups: [...state.existingGroups, group]
        }));
    };

    onSubmit = (values: Object) => {
        const {
            intl,
            initialValues,
            editUser,
            addUser,
            dispatch,
            uploadAvatar,
            router,
            synchronousErrors
        } = this.props;
        this.setState({ ...this.state, isLoading: true });
        const { existingGroups } = this.state;
        const isEditMode = initialValues && initialValues.isEditMode;
        const loggedInUserName =
            localStorage.getItem('auth:username') || 'null';

        const user = {
            ...values,
            userName: values.userName ? values.userName.toLowerCase() : null,
            groups: existingGroups,
            organizations: _.isArray(values.organizations)
                ? values.organizations.join(',')
                : values.organizations,
            sender: loggedInUserName
        };

        if (
            !_.isEmpty(user.facebook) &&
            !isURL(user.facebook, FACEBOOK_VALIDATION)
        )
            user.facebook = `https://${user.facebook}`;
        if (
            !_.isEmpty(user.twitter) &&
            !isURL(user.twitter, TWITTER_VALIDATION)
        )
            user.twitter = `https://${user.twitter}`;
        if (
            !_.isEmpty(user.linkedin) &&
            !isURL(user.linkedin, LINKEDIN_VALIDATION)
        )
            user.linkedin = `https://${user.linkedin}`;

        const selfEditing = loggedInUserName === values.userName;
        const success = {
            message: intl.formatMessage(messages.saveSucceeded),
            variant: 'success',
            cache: faker.random.alphaNumeric(12)
        };
        if (_.isEmpty(synchronousErrors)) {
            if (isEditMode) {
                editUser(user, selfEditing)
                    .then(() => {
                        dispatch({
                            type: SHOW_MESSAGE,
                            payload: success
                        });
                        if (user.userAvatar) {
                            uploadAvatar(user.userAvatar, user.userName);
                        }

                        return {};
                    })
                    .then(() => {
                        window.history.back();
                        return {};
                    })
                    .catch(e => {
                        this.setState({ ...this.state, isLoading: false });
                        throw e;
                    });
            } else {
                addUser(user)
                    .then(() => {
                        dispatch({
                            type: SHOW_MESSAGE,
                            payload: success
                        });
                        if (user.userAvatar) {
                            uploadAvatar(user.userAvatar, user.userName);
                        }
                        return {};
                    })
                    .then(() => {
                        router.push(PEOPLE_LINK);
                        return {};
                    })
                    .catch(e => {
                        this.setState({ ...this.state, isLoading: false });
                        throw e;
                    });
            }
        }
    };

    handleCancel = () => {
        const { reset } = this.props;
        reset(formName);
        window.history.back();
    };

    renderFormControls = (customClass, submit) => {
        const { classes } = this.props;
        const { isLoading } = this.state;
        return (
            <div className={customClass || classes.formControls}>
                <Button
                    disabled={isLoading}
                    text="save"
                    type="submit"
                    size="medium"
                    style={{ marginLeft: 0 }}
                    onClick={submit}
                />

                <Button
                    text="cancel"
                    color="grey"
                    size="medium"
                    onClick={this.handleCancel}
                    style={{ marginLeft: 0 }}
                />
            </div>
        );
    };

    /** Render errors  */
    renderError = () => {
        const { serverMessage } = this.props;
        return <ErrorMessage errors={serverMessage} />;
    };

    render() {
        const {
            handleSubmit,
            classes,
            intl,
            serverError,
            synchronousErrors,
            submitFailed,
            change,
            serverMessage,
            userName
        } = this.props;

        if (serverMessage && serverMessage.length > 0) {
            return <div className={classes.error}>{this.renderError()}</div>;
        }

        const otherErrors = [];
        if (serverError) {
            if (serverError.includes('Access Denied')) {
                otherErrors.push(intl.formatMessage(messages.accessDenied));
            } else if (serverError.includes('already exists')) {
                otherErrors.push(
                    intl.formatMessage(messages.userAlreadyExists)
                );
            } else if (serverError.includes('OldPassword')) {
                otherErrors.push(intl.formatMessage(messages.wrongOldPassword));
            } else {
                otherErrors.push(intl.formatMessage(messages.serverError));
            }
        }

        if (submitFailed) {
            if (synchronousErrors) {
                _.map(synchronousErrors, error => {
                    otherErrors.push(error);
                });
            }
        }

        return (
            <div>
                {this.renderFormControls(
                    classes.headerButtons,
                    handleSubmit ? handleSubmit(this.onSubmit) : () => {}
                )}

                <div className={classes.root}>
                    <CustomizedSnackbars message="Saved changes" />

                    <div className="edit-form no-padding">
                        <Form
                            onSubmit={
                                handleSubmit
                                    ? handleSubmit(this.onSubmit)
                                    : () => {}
                            }
                            autoComplete="off"
                        >
                            <input
                                type="text"
                                id="name"
                                style={{
                                    position: 'fixed',
                                    top: '-100px',
                                    left: '-100px',
                                    width: '5px'
                                }}
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormUserEditError messages={otherErrors} />

                                    <FormAvatar
                                        userName={userName}
                                        change={change}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    container
                                    direction="column"
                                    spacing={1}
                                >
                                    <Grid container spacing={4}>
                                        <Grid
                                            item
                                            xl={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <FormDetails {...this.props} />
                                            <FormLocation {...this.props} />

                                            <Hidden smDown>
                                                {this.renderFormControls()}
                                            </Hidden>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <FormSocial {...this.props} />
                                            <FormCredentials {...this.props} />

                                            <Hidden mdUp>
                                                {this.renderFormControls()}
                                            </Hidden>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 *  Set defaults
 */
export default injectIntl(FormUserEdit);
