// @flow
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import messages from 'constants/Messages';
import { Field, reduxForm, Form } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import type { ContainerProps as RepoProps } from 'containers/RepoContainer';
import Collapsable from 'components/Collapsable';
import { globalCloseDrawer } from 'utils/dom';
import { renderTextField } from 'constants/FormFields';

type DefaultProps = {
    intl: intlShape,
    errors: Array<string> | null,
    submitFailed: boolean,
    submitting: boolean,
    handleSubmit: (() => void) => void,
    initialValues?: Object,
    error?: string,
    classes: Object,
    onSubmit: Function,
    formValues: Object,
    sharedModifiers: Array<string>,
    repoModifiers: Array<string>,
    fetchDocumentsUsersIsLoading: boolean
} & RepoProps;

type Props = {
    onSuccess: Function,
    nodeRef?: string, // onEdit -> pass nodeRef
    parentRef?: string // onNew -> pass parentRef
} & DefaultProps;

type State = {
    isLoading: boolean
};

const styles = () => ({
    root: {},
    authPicker: {},
    loading: {
        alignItems: 'center',
        textAlign: 'center'
    },
    term: {
        padding: '0 0 2.3em'
    }
});

const validate = (values: Object): Object => {
    const errors = {};
    if (values.term && _.get(values, 'term.length') <= 3)
        errors.term = 'termLengthInvalid';

    return errors;
};

export const FormName = 'usersFiltersForm';

@withStyles(styles)
@injectIntl
@reduxForm({
    form: FormName,
    destroyOnUnmount: false, // Remove me and redux form will delete form data when you leave the drawer
    enableReinitialize: true, // Remove me and redux form will delete form data when you move pages( will persist so long as you dont refresh browser)
    keepDirtyOnReinitialize: true, // **** ^^^ Same as above ^^^ ***
    validate
})
@connect(state => ({ formValues: _.get(state, `form.${FormName}.values`) }))
class FormFilterUsers extends Component<Props, State> {
    onSubmit = () => {
        const { onSubmit, formValues } = this.props;
        if (onSubmit) onSubmit(formValues);
    };

    render() {
        const { classes, intl, handleSubmit } = this.props;

        return (
            <Form
                onSubmit={handleSubmit(this.onSubmit)}
                className={classes.root}
                autoComplete="off"
            >
                <Collapsable
                    classes={classes}
                    title={intl.formatMessage(messages.filterUser)}
                    isOpen
                >
                    <div className={classes.term}>
                        <Field
                            fullWidth
                            name="term"
                            autoFocus
                            onEnterPress={() => {
                                setTimeout(() => {
                                    globalCloseDrawer();
                                }, 200);
                            }}
                            component={renderTextField}
                            label={intl.formatMessage(
                                messages.filterUserDetailPlaceholder
                            )}
                        />
                    </div>
                </Collapsable>
            </Form>
        );
    }
}
export default FormFilterUsers;
