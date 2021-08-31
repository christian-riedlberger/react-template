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
import { fileExtension } from 'utils/string';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps as RepoProps } from 'containers/RepoContainer';
import { renderTextField, renderHiddenField } from 'constants/FormFields';
import messages from 'constants/Messages';

type DefaultProps = {
    errors: Array<string> | null,
    submitFailed: boolean,
    submitting: boolean,
    handleSubmit: Function | null,
    intl: intlShape,
    initialValues?: Object,
    error?: string,
    classes: Object,
    formValues: Object,
    activeNode: Object,
    createFolder: Object,
    dispatch: Object,
    updateNode: Object,
    fetchNodeIsLoading: Boolean
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

const validate = (values, props: Props) => {
    const errors = {};
    const fileRegex = /[/\\?%*:|"<>]/;
    const endRegex = /[.]$/;
    const filenameExtension = fileExtension(values.name);

    if (!values.name || values.name.length === 0) errors.name = 'required';
    if (fileRegex.test(values.name)) errors.name = 'invalidFilename';
    if (endRegex.test(values.name)) errors.name = 'invalidFileEndChar';
    if (values.name && values.name.length > 50) errors.name = 'invalidLength50';
    if (
        _.get(props, 'activeNode.type') !== 'cm:folder' &&
        _.get(filenameExtension, 'length', 0) === 0
    )
        errors.name = 'invalidExtension';

    return errors;
};

export const FormName = 'folderFile';

@withStyles(styles)
@RepoContainer({ nodeRef: props => props.nodeRef })
@mapProps(props => ({
    ...props,
    initialValues: props.nodeRef ? { ...props.activeNode } : {}
}))
@reduxForm({
    form: FormName,
    enableReinitialize: true,
    validate
})
@injectIntl
@connect(state => ({ formValues: state.form[FormName].values }))
class FormNode extends Component<Props, State> {
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
            activeNode,
            parentRef,
            nodeRef,
            createFolder,
            dispatch,
            updateNode
        } = this.props;

        if (parentRef) {
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
                    return onSuccess({ ...formValues, parentRef });
                })
                .catch(e => {
                    throw e;
                });
        } else if (nodeRef) {
            updateNode(formValues)
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
                    return onSuccess(activeNode);
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
            error,
            fetchNodeIsLoading,
            handleSubmit
        } = this.props;

        return (
            <Form
                onSubmit={
                    handleSubmit ? handleSubmit(this.onSubmit) : this.onSubmit
                }
                className={classes.root}
                autoComplete="off"
            >
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    {error && (
                        <Grid item className="serverError">
                            {error}
                        </Grid>
                    )}
                    {fetchNodeIsLoading ? (
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
                                <Field
                                    type="text"
                                    name="name"
                                    autoFocus
                                    component={renderTextField}
                                    label={intl.formatMessage(messages.name)}
                                    className={classes.nameField}
                                    onKeyDown={e => e.stopPropagation()}
                                />
                            </Grid>
                            {/* <Grid item>
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
                            </Grid> */}
                        </Fragment>
                    )}
                </Grid>
            </Form>
        );
    }
}
export default FormNode;
