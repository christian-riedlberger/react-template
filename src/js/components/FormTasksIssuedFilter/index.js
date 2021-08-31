// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Field, reduxForm, Form } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import messages from 'constants/Messages';
import FieldFilterSelector from 'components/FieldFilterSelector';
import FieldStatusList from 'components/FieldStatusList';
import DateRangeSelector from 'components/DateRangeSelector';
import Collapsable from 'components/Collapsable';
import TasksContainer from 'containers/TasksContainer';
import { renderTextField } from 'constants/FormFields';
import { globalCloseDrawer } from 'utils/dom';

import { TASK_STATUS_OPTS, TASK_PROGRESS_OPTS } from 'constants/Config';

// import { log } from 'utils/logger';

type DefaultProps = {
    change: Function,
    intl: intlShape,
    classes: Object,
    organizationsTo: Array<Object>,
    isLoadingTaskAuthorities: boolean
};

type Props = {} & DefaultProps;

type State = {
    error: string | null
};

const styles = () => ({
    root: {},
    loading: {
        alignItems: 'center',
        textAlign: 'center',
        paddingBottom: '2em'
    },
    search: {
        padding: '0 0 2.3em'
    }
});

export const FormName = 'taskFiltersIssuedForm';

@withStyles(styles)
@TasksContainer({ fetchTaskAuthorities: true, params: { issuedTasks: true } })
@injectIntl
@reduxForm({
    form: FormName,
    destroyOnUnmount: false, // Remove me and redux form will delete form data when you leave the drawer
    enableReinitialize: true, // Remove me and redux form will delete form data when you move pages( will persist so long as you dont refresh browser)
    keepDirtyOnReinitialize: true // **** ^^^ Same as above ^^^ ***
})
@connect(store => ({
    formValues: _.get(store, `form.${FormName}.values`, null)
}))
class FormTasksIssuedFilter extends Component<Props, State> {
    onSubmit = () => {};

    render() {
        const {
            intl,
            classes,
            change,
            organizationsTo,
            isLoadingTaskAuthorities
        } = this.props;

        return (
            <Form
                onSubmit={this.onSubmit}
                className={classes.root}
                autoComplete="off"
            >
                <Collapsable
                    nullOnHidden={false}
                    classes={classes}
                    title={intl.formatMessage(messages.filterTaskTitle)}
                    isOpen
                >
                    <div className={classes.search}>
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
                            label={`${intl.formatMessage(messages.searchTerm)}`}
                            className={classes.textField}
                            data-cy="title"
                        />
                    </div>
                </Collapsable>
                <Collapsable
                    nullOnHidden={false}
                    classes={classes}
                    title={intl.formatMessage(messages.sentTo)}
                    isOpen
                >
                    {isLoadingTaskAuthorities ? (
                        <div className={classes.loading}>
                            <CircularProgress size={30} />
                        </div>
                    ) : (
                        <Field
                            name="assignee"
                            component={FieldFilterSelector}
                            label={intl.formatMessage(messages.sentTo)}
                            className={classes.nameField}
                            organizations={organizationsTo}
                        />
                    )}
                </Collapsable>
                <Collapsable
                    nullOnHidden={false}
                    classes={classes}
                    title={intl.formatMessage(messages.deadline)}
                    isOpen
                >
                    <Field
                        name="dueDate"
                        component={DateRangeSelector}
                        change={change}
                        label={intl.formatMessage(messages.deadline)}
                        open
                        value={[]}
                        className={classes.nameField}
                    />
                </Collapsable>
                <Collapsable
                    nullOnHidden={false}
                    classes={classes}
                    title={intl.formatMessage(messages.status)}
                    isOpen
                >
                    <Field
                        name="status"
                        component={FieldStatusList}
                        change={change}
                        label={intl.formatMessage(messages.status)}
                        className={classes.nameField}
                        options={TASK_STATUS_OPTS}
                    />
                </Collapsable>
                <Collapsable
                    nullOnHidden={false}
                    classes={classes}
                    title={intl.formatMessage(messages.progress)}
                    isOpen
                >
                    <Field
                        name="progress"
                        component={FieldStatusList}
                        change={change}
                        label={intl.formatMessage(messages.progress)}
                        className={classes.nameField}
                        options={TASK_PROGRESS_OPTS}
                    />
                </Collapsable>
            </Form>
        );
    }
}
export default FormTasksIssuedFilter;
