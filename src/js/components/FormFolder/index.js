// @flow
import React, { Component, Fragment } from 'react';
import { mapProps } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { renderFormErrorMessage } from 'utils/form';
import RepoContainer from 'containers/RepoContainer';
import MessageContainer from 'containers/MessageContainer';
import FieldRow from 'components/FieldRow';
import type { ContainerProps as RepoProps } from 'containers/RepoContainer';
import { renderTextField, renderHiddenField } from 'constants/FormFields';
import messages from 'constants/Messages';
import { errorMessages } from 'utils/errorMessages';

type DefaultProps = {
    error: Array<string> | null,
    submitFailed: boolean,
    submitting: boolean,
    handleSubmit: Function | null,
    intl: intlShape,
    initialValues?: Object,
    error?: string,
    classes: Object,
    formValues: Object,
    activeFolder: Object,
    activeFile: Object,
    createFolder: Function,
    updateFolder: Function,
    dispatch: Function,
    fetchFolderIsLoading: Boolean,
    showMessage: Function,
    handleSubmit: ((Object) => Object) => void
} & RepoProps;

type Props = {
    onSuccess: Function,
    nodeRef?: string, // onEdit -> pass nodeRef
    parentRef?: string // onNew -> pass parentRef
} & DefaultProps;

type State = {
    error: string | null,
    roles: Array<string>
};

const styles = () => ({
    root: {},
    nameField: {
        width: '30em'
    },
    descriptionField: {
        width: '30em'
    }
});

const validate = values => {
    const errors = {};
    const fileRegex = /[/\\?%*:|"<>]/;
    const endRegex = /[.]$/;

    if (!values.name || values.name.length === 0) errors.name = 'required';
    if (fileRegex.test(values.name)) errors.name = 'invalidFilename';
    if (endRegex.test(values.name)) errors.name = 'invalidFileEndChar';
    if (values.name && values.name.length > 50) errors.name = 'invalidLength50';

    return errorMessages(errors);
};

export const FormName = 'folderForm';

@withStyles(styles)
@RepoContainer({ folderRef: props => props.nodeRef })
@MessageContainer()
@mapProps(props => ({
    ...props,
    initialValues: props.nodeRef ? { ...props.activeFolder } : {}
}))
@reduxForm({
    form: FormName,
    enableReinitialize: true,
    validate
})
@injectIntl
@connect(state => ({ formValues: state.form[FormName].values }))
class FormFolder extends Component<Props, State> {
    componentDidUpdate(prevProps: Object) {
        const { initialValues } = this.props;

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
    }

    onSubmit = () => {
        const {
            formValues,
            onSuccess,
            activeFolder,
            parentRef,
            nodeRef,
            createFolder,
            dispatch,
            updateFolder,
            showMessage
        } = this.props;

        if (parentRef) {
            showMessage({
                message: 'createPending',
                variant: 'pending'
            });
            createFolder(formValues, parentRef)
                .then(resp => {
                    if (
                        resp.value.data &&
                        resp.value.data.error &&
                        resp.value.data.error.length > 0
                    ) {
                        const error = resp.value.data.error
                            ? resp.value.data.error
                            : this.props.intl.formatMessage(
                                messages.groupsCannotBeSaved
                            );
                        dispatch({
                            type: '@@redux-form/UPDATE_SYNC_ERRORS',
                            meta: { form: FormName },
                            payload: { syncErrors: {}, error }
                        });
                        return null;
                    }
                    showMessage({
                        message: 'createSuccess',
                        variant: 'success'
                    });
                    return onSuccess({ ...formValues, parentRef });
                })
                .catch(e => {
                    throw e;
                });
        } else if (nodeRef) {
            showMessage({
                message: 'createPending',
                variant: 'pending'
            });
            updateFolder(formValues)
                .then(resp => {
                    if (
                        resp.value.data &&
                        resp.value.data.error &&
                        resp.value.data.error.length > 0
                    ) {
                        const error = resp.value.data.error
                            ? resp.value.data.error
                            : this.props.intl.formatMessage(
                                messages.groupsCannotBeSaved
                            );
                        dispatch({
                            type: '@@redux-form/UPDATE_SYNC_ERRORS',
                            meta: { form: FormName },
                            payload: { syncErrors: {}, error }
                        });
                        return null;
                    }
                    showMessage({
                        message: 'createSuccess',
                        variant: 'success'
                    });
                    return onSuccess(activeFolder);
                })
                .catch(e => {
                    throw e;
                });
        }
    };

    render() {
        const {
            intl,
            classes,
            // $FlowFixMe
            error,
            fetchFolderIsLoading,
            handleSubmit
        } = this.props;

        return (
            <Form
                onSubmit={handleSubmit(this.onSubmit)}
                className={classes.root}
                autoComplete="off"
            >
                <Grid>
                    {renderFormErrorMessage(
                        error,
                        {
                            margin: '-1.2em -1.1em 0 -1.2em'
                        },
                        true
                    )}

                    {fetchFolderIsLoading ? (
                        <CircularProgress
                            size={20}
                            className={classes.textProgress}
                        />
                    ) : (
                        <Fragment>
                            <Grid item>
                                <Field
                                    component={renderHiddenField}
                                    name="nodeRef"
                                />
                                <Field
                                    component={renderHiddenField}
                                    name="parentRef"
                                />

                                <FieldRow noMargin>
                                    <Field
                                        type="text"
                                        name="name"
                                        component={renderTextField}
                                        label={intl.formatMessage(
                                            messages.name
                                        )}
                                        autoFocus
                                        className={classes.nameField}
                                        onKeyDown={e => e.stopPropagation()}
                                    />
                                </FieldRow>
                            </Grid>

                            {/* <Grid item>
                                <FieldRow>
                                    <Field
                                        type="text"
                                        name="description"
                                        component={renderTextField}
                                        label={intl.formatMessage(
                                            messages.description
                                        )}
                                        className={classes.descriptionField}
                                        onKeyDown={e => e.stopPropagation()}
                                    />
                                </FieldRow>
                            </Grid> */}
                        </Fragment>
                    )}
                </Grid>
            </Form>
        );
    }
}
export default FormFolder;
