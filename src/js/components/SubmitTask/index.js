// @flow
import React, { Component } from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';

import MessageContainer from 'containers/MessageContainer';
import TasksContainer from 'containers/TasksContainer';
import type { ContainerProps as TaskContainerProps } from 'containers/TasksContainer';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import { renderChildren } from 'utils/render';
import type { StepperProps } from 'components/WizardStepper';
import { log } from 'utils/logger';
import { getFormValues } from 'utils/form';

type DefaultProps = {
    forms: Object,
    router: Object,
    classes: Object,
    intl: intlShape,
    showMessage: Function
} & TaskContainerProps &
    RepoContainerProps;
type Props = {
    children: ({ handleFinish: () => void }) => Node
} & DefaultProps;

type State = {
    isSubmitting: boolean
};

// const styles = (theme: Object) => ({ ... })
const styles = () => ({
    root: {}
});

/**
 *  @desc Request onFinish handler component
 *  @author bvincent1
 */
@injectIntl
@withStyles(styles)
@withRouter
@TasksContainer({})
@MessageContainer()
@connect(state => ({ forms: state.form }))
class SubmitTask extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isSubmitting: false
        };
    }

    /**
     *  Finish user action
     */
    handleFinish = (args: StepperProps, forms: Object) => {
        const { router, updateTask, showMessage } = this.props;
        log('HANDLE FINISH', 'red', { args, forms });

        // agregate wizzard form data into single Object
        const fieldValues = _.reduce(
            _.map(forms, f => getFormValues(f, true)),
            (values, val) => ({
                ...values,
                ...val
            }),
            {}
        );
        showMessage({ message: 'assigningTask', variant: 'pending' });
        this.setState({ isSubmitting: true });

        updateTask(fieldValues)
            .then(() => {
                this.setState({ isSubmitting: false });
                router.push('/requests/issued');
                showMessage({
                    message: 'assigningTaskSuccess',
                    variant: 'success'
                });
                return null;
            })
            .catch(e => {
                throw new Error(e);
            });
    };

    render() {
        const { children, classes } = this.props;
        const { isSubmitting } = this.state;

        return (
            <div className={classes.root}>
                {renderChildren(children, {
                    handleFinish: this.handleFinish,
                    isSubmitting
                })}
            </div>
        );
    }
}

export default SubmitTask;
