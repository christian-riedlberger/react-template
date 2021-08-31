// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Field, reduxForm, Form } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import FieldAuthoritySelector from 'components/FieldAuthoritySelector';
import FieldMultiEmailTextField from 'components/FieldMultiEmailTextField';
import Button from 'components/Button';

import MessageContainer from 'containers/MessageContainer';
import InvitationsContainer from 'containers/InvitationsContainer';
import type { ContainerProps as InvitationProps } from 'containers/InvitationsContainer';

import {
    renderMultiLineTextField,
    renderSelectField,
    renderTextField
} from 'constants/FormFields';
import {
    invtRelationshipOptions,
    invtRoleOptions,
    translateOptions
} from 'constants/InvitationTypes';
import messages from 'constants/Messages';

import { errorMessages } from 'utils/errorMessages';
import { checkRequiredFields, renderFormErrorMessage } from 'utils/form';

// import { log } from 'utils/logger';

type DefaultProps = {
    change: Function,
    intl: intlShape,
    classes: Object,
    formValues: Object,
    syncErrors: Object,
    showMessage: Function
} & InvitationProps;

type Props = {
    onSuccess: Function
} & DefaultProps;

type State = {
    isLoading: boolean,
    hasErrors: boolean
};

const styles = () => ({
    root: {},
    section: {
        marginBottom: '10px'
    },
    button: {
        display: 'flex',
        justifyContent: 'center'
    }
});

const REQUIRED_FIELDS = ['organization', 'relationship', 'emails'];
const REQUIRED_MESSAGE_ID = 'requiredMissing';

const validate = values => {
    let errors = { ...checkRequiredFields(REQUIRED_FIELDS, values) };
    if (values.relationship === 'employee' && !values.role) {
        errors = { ...errors, role: 'required' };
    }

    return errors;
};

export const FormName = 'invitationForm';

@withStyles(styles)
@InvitationsContainer()
@MessageContainer()
@injectIntl
@reduxForm({
    form: FormName,
    destroyOnUnmount: false, // Remove me and redux form will delete form data when you leave the drawer
    enableReinitialize: true, // Remove me and redux form will delete form data when you move pages( will persist so long as you dont refresh browser)
    keepDirtyOnReinitialize: true, // **** ^^^ Same as above ^^^ ***
    validate
})
@connect(store => ({
    formValues: _.get(store, `form.${FormName}.values`, null),
    syncErrors: _.get(store, `form.${FormName}.syncErrors`, null)
}))
class FormInvitations extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            hasErrors: false
        };
    }

    componentDidUpdate = () => {
        const { formValues, activeOrg } = this.props;
        if (
            formValues &&
            formValues.relationship === 'employee' &&
            !activeOrg.userIsAdmin
        ) {
            formValues.relationship = null;
            formValues.role = null;
        }
    };

    setLoading = (isLoading: boolean) => {
        this.setState({
            isLoading
        });
    };

    onSubmit = () => {
        const {
            activeOrg,
            formValues,
            syncErrors,
            sendInvitations,
            onSuccess,
            showMessage
        } = this.props;

        const submitValues = { ...formValues };
        if (submitValues.organization === activeOrg.displayName) {
            submitValues.organization = activeOrg.shortName;
        }
        if (!syncErrors) {
            this.setLoading(true);
            showMessage({
                message: 'invtSending',
                variant: 'pending'
            });
            sendInvitations(submitValues)
                .then(resp => {
                    this.setLoading(false);
                    if (resp.action.payload.status === 200) {
                        if (onSuccess) onSuccess();
                        showMessage({
                            message: 'invtSendSuccess',
                            variant: 'success'
                        });
                        return resp;
                    }
                    showMessage({
                        message: 'invtSendError',
                        variant: 'error'
                    });
                    return false;
                })
                .catch(e => {
                    throw e;
                });
        } else {
            this.setState({
                hasErrors: true
            });
        }
    };

    render() {
        const {
            intl,
            classes,
            change,
            formValues,
            activeOrg,
            userProfile
        } = this.props;
        const { hasErrors, isLoading } = this.state;

        const relationshipOptions = activeOrg.userIsAdmin
            ? invtRelationshipOptions
            : _.filter(invtRelationshipOptions, o => {
                return o.value !== 'employee';
            });

        return (
            <Form
                onSubmit={this.onSubmit}
                className={classes.root}
                autoComplete="off"
            >
                {hasErrors &&
                    renderFormErrorMessage(
                        errorMessages([REQUIRED_MESSAGE_ID])
                    )}

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                        >
                            {intl.formatMessage(messages.invtLabelFrom)}
                        </Typography>
                        {userProfile.capabilities.isAdmin ? (
                            <Field
                                required
                                fullWidth
                                type="group"
                                name="organization"
                                parentName="ORGANIZATIONS"
                                component={FieldAuthoritySelector}
                            />
                        ) : (
                            <Field
                                required
                                fullWidth
                                disabled
                                change={change}
                                name="organization"
                                component={renderTextField}
                                initValue={activeOrg.displayName}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                        >
                            {intl.formatMessage(messages.invtLabelRelationship)}
                        </Typography>
                        <Field
                            required
                            name="relationship"
                            component={renderSelectField}
                            change={change}
                            className={classes.nameField}
                            options={translateOptions(
                                relationshipOptions,
                                intl
                            )}
                        />
                    </Grid>
                    {activeOrg.userIsAdmin &&
                        formValues &&
                        formValues.relationship === 'employee' && (
                        <Grid item xs={12}>
                            <Typography
                                variant="caption"
                                display="block"
                                gutterBottom
                            >
                                {intl.formatMessage(messages.invtLabelRole)}
                            </Typography>
                            <Field
                                name="role"
                                component={renderSelectField}
                                change={change}
                                className={classes.nameField}
                                options={translateOptions(
                                    invtRoleOptions,
                                    intl
                                )}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                        >
                            {intl.formatMessage(messages.invtLabelEmail)}
                        </Typography>
                        <Field
                            required
                            name="emails"
                            component={FieldMultiEmailTextField}
                            change={change}
                            className={classes.nameField}
                            label={intl.formatMessage(
                                messages.placeholderEmail
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                        >
                            {intl.formatMessage(messages.invtLabelMessage)}
                        </Typography>

                        <Field
                            fullWidth
                            name="message"
                            component={renderMultiLineTextField}
                            className={classes.nameField}
                            placeholder={intl.formatMessage(
                                messages.placeholderMessageHere
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.button}>
                            <Button
                                disabled={isLoading}
                                text="invtSubmit"
                                onClick={this.onSubmit}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Form>
        );
    }
}
export default FormInvitations;
