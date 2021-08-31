// @flow
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import messages from 'constants/Messages';
import { Field, reduxForm, Form } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import type { ContainerProps as RepoProps } from 'containers/RepoContainer';
import FieldFilterSelector from 'components/FieldFilterSelector';
import DateRangeSelector from 'components/DateRangeSelector';
import Collapsable from 'components/Collapsable';
import SharedContainer from 'containers/SharedContainer';
import RepoContainer from 'containers/RepoContainer';
import { REPO_SHARED } from 'constants/Config';
import { globalCloseDrawer } from 'utils/dom';
import { renderTextField } from 'constants/FormFields';

type DefaultProps = {
    intl: intlShape,
    errors: Array<string> | null,
    submitFailed: boolean,
    submitting: boolean,
    handleSubmit: Function | null,
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

export const FormName = 'fileFiltersForm';

@RepoContainer({
    fetchDocumentsUsers: (props: Props) => _.get(props, 'activeFolder.nodeRef')
})
@SharedContainer({
    fetchSharedUsers: (props: Props) =>
        _.get(props, 'activeRepo') === REPO_SHARED
})
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
class FormFilterFiles extends Component<Props, State> {
    onSubmit = () => {
        const { onSubmit, formValues } = this.props;
        if (onSubmit) onSubmit(formValues);
    };

    render() {
        const {
            classes,
            intl,
            activeRepo,
            sharedModifiers,
            repoModifiers
        } = this.props;

        let modifiers = '';
        if (activeRepo === 'shared') {
            modifiers = sharedModifiers;
        } else {
            modifiers = repoModifiers;
        }

        return (
            <Form
                onSubmit={this.onSubmit}
                className={classes.root}
                autoComplete="off"
            >
                <Collapsable
                    nullOnHidden={false}
                    classes={classes}
                    title={intl.formatMessage(messages.filterRepo)}
                    isOpen
                >
                    <div className={classes.term}>
                        <Field
                            fullWidth
                            name="term"
                            autoFocus
                            autoComplete="new-password"
                            onEnterPress={() => {
                                setTimeout(() => {
                                    globalCloseDrawer();
                                }, 200);
                            }}
                            component={renderTextField}
                            label={intl.formatMessage(
                                messages.filterRepoPlaceholder
                            )}
                        />
                    </div>
                </Collapsable>

                <Collapsable
                    nullOnHidden={false}
                    classes={classes}
                    title={intl.formatMessage(messages.filterModifier)}
                    isOpen
                >
                    {this.props.fetchDocumentsUsersIsLoading ? (
                        <div className={classes.loading}>
                            <CircularProgress size={30} />
                        </div>
                    ) : (
                        <Field
                            name="users"
                            component={FieldFilterSelector}
                            className={classes.nameField}
                            users={modifiers}
                        />
                    )}
                </Collapsable>

                <Collapsable
                    nullOnHidden={false}
                    classes={classes}
                    title={intl.formatMessage(messages.filterCreated)}
                    isOpen
                >
                    <Field
                        name="dateRange"
                        component={DateRangeSelector}
                        label={intl.formatMessage(messages.dateRange)}
                        open
                    />
                </Collapsable>
            </Form>
        );
    }
}
export default FormFilterFiles;
