// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import TasksContainer from 'containers/TasksContainer';
import type { ContainerProps as RepoProps } from 'containers/RepoContainer';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import WizardForm from 'components/WizardForm';
import FormRegistry from 'constants/FormRegistry';
import Hidden from '@material-ui/core/Hidden';
import ProcessPeople from 'components/ProcessPeople';
import ProcessOverview from 'components/ProcessOverview';
import ErrorMessage from 'components/ErrorMessage';

type DefaultProps = {
    activeTask: Object,
    clearActiveTask: Function,
    isLoadingFetchTask: boolean,
    classes: Object,
    fetchWorkflowDefinition: Function,
    serverMessage: Array<string>,
    location: Object
} & RepoProps;

type Props = {} & DefaultProps;

type State = {
    formId: string | null,
    steps: Array<Object>
};

const styles = {
    root: {}
};

/**
 * TODO - Remove supplierIntakeTaskMock once we have this step on the workflow - roadmap
 */
const supplierIntakeTaskMock = {
    type: 'cert:supplierCertification',
    completed: true,
    active: false,
    label: 'cert:supplierCertification'
};

@TasksContainer({
    // taskId used on mount to get file data and place in redux -> repo -> activeTask
    fetchTask: (props: Props) => `${props.taskId}`
})
@withStyles(styles)
@withRouter
class LayoutTaskDetails extends Component<Props, State> {
    static defaultProps: DefaultProps = {
        intl: {},
        classes: {}
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            formId: null,
            steps: []
        };
    }

    static getDerivedStateFromProps(props: any, state: any) {
        const { activeTask } = props;
        if (
            !_.isEmpty(activeTask) &&
            state.formId !== activeTask.definition.id
        ) {
            return {
                formId: activeTask.definition.id
            };
        }

        return state;
    }

    componentDidMount() {
        this.props.pushRecentTask(this.props.location.pathname);
    }

    componentDidUpdate(prevProps: Object, prevState: Object) {
        const { activeTask } = this.props;
        const { formId } = this.state;

        if (
            !_.isEmpty(activeTask) &&
            (formId && !_.isEqual(prevState.formId, formId))
        ) {
            const wrfDef = activeTask.definitionUrl.split('/').pop();

            this.props
                .fetchWorkflowDefinition(wrfDef)
                .then(def => {
                    const taskDefSteps = def.value.data.data.taskDefinitions;

                    /**
                     * TODO - Remove supplierIntakeTaskMock once we have this step on the workflow - roadmap
                     */
                    taskDefSteps.splice(0, 0, supplierIntakeTaskMock);

                    const currentStepIndex = _.findIndex(taskDefSteps, {
                        type: formId
                    });

                    const steps = _.map(taskDefSteps, (d, i) => {
                        return {
                            ...d,
                            completed: i < currentStepIndex,
                            active: i === currentStepIndex,
                            label: taskDefSteps[i].type
                        };
                    });

                    this.setState({
                        ...this.state,
                        steps
                    });

                    return null;
                })
                .catch(() => {});
        }
    }

    componentWillUnmount() {
        this.props.clearActiveTask();
    }

    /** Render errors  */
    renderError = () => {
        const { serverMessage } = this.props;
        return (
            <ErrorMessage
                icon="/css/img/icons/task-missing.svg"
                errors={serverMessage}
            />
        );
    };

    render() {
        const {
            classes,
            activeTask,
            isLoadingFetchTask,
            serverMessage
        } = this.props;
        const { formId, steps } = this.state;

        if (serverMessage && serverMessage.length > 0) {
            return <div className={classes.error}>{this.renderError()}</div>;
        }

        if (_.isEmpty(activeTask) || isLoadingFetchTask)
            return <div>Loading...</div>;

        // Filter on task definition
        const activeForm = _.find(FormRegistry, f => {
            return f.formId === formId;
        });
        return (
            <div className={classes.root}>
                <Grid container spacing={0}>
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={6}
                        className={classes.page}
                        spacing={2}
                    >
                        <WizardForm {...activeForm} />
                    </Grid>
                    <Hidden only={['xs']}>
                        <Grid item md={2} sm={1} />
                    </Hidden>
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        spacing={2}
                        style={{ borderLeft: '1px solid #ECECEC' }}
                    >
                        <ProcessPeople task={activeTask} />
                        <ProcessOverview steps={steps} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default LayoutTaskDetails;
