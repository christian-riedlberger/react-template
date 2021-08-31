// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';
import TasksContainer from 'containers/TasksContainer';
import { serializeTask } from 'actions/ActionTasks';
import { ENABLE_HEADER_LINKS } from 'constants/Config';
import HeaderLinks from 'components/HeaderLinks';
import Header from 'components/Header';
import BreadCrumbHeader from '../BreadCrumbHeader';
import HeaderProfile from '../HeaderProfile';

// Custom CSS Classes
const styles = {
    header: {
        textAlign: 'right',
        marginBottom: '1em'
    }
};

type DefaultProps = {
    intl: intlShape,
    workflowId: string,
    activeTask: Object,
    serverMessage: Array<string>
};
type Props = {
    fetchTask: Function,
    classes: Object
} & DefaultProps;

type State = {
    tasks: any,
    index: number,
    taskName: string,
    activeTask: Object
};

@TasksContainer()
@withStyles(styles)
/**
 * Header for the workflow details page
 *
 */
class HeaderWorkflowDetails extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            tasks: _.map(props.workflowId.split(','), taskString => ({
                isWorkflow: taskString.indexOf('workflow') > -1,
                id: taskString.split('$')[1]
            })),
            index: 0,
            taskName: '',
            activeTask: this.props.activeTask
        };
    }

    componentDidMount() {
        this.getTask()
            .then(r => {
                const data = serializeTask(r.action.payload.data.data);
                const taskName = _.get(data, 'name');
                this.setState({
                    ...this.state,
                    taskName
                });
                return taskName;
            })
            .catch(e => {
                throw e;
            });
    }

    componentDidUpdate(prevProps) {
        // Handle page change
        if (!_.isEqual(prevProps.activeTask, this.props.activeTask)) {
            this.setActiveTask();
        }
    }

    // Set the active task and taskName in state
    setActiveTask = () => {
        this.setState({
            ...this.state,
            activeTask: this.props.activeTask,
            taskName: this.props.activeTask.name
        });
    };

    // Get the task from the passed activiti id
    getTask = () => {
        const { tasks, index } = this.state;

        return this.props.fetchTask(
            `activiti$${tasks[index].id}`,
            _.pick(tasks[index], 'isWorkflow')
        );
    };

    // Get the path that is passed to the breadcrumb
    getPath = () => {
        const { taskName } = this.state;
        const { intl, workflowId } = this.props;
        const path = [];
        const basePath = '/requests/';
        let taskType = '';

        if (workflowId.indexOf('task') !== -1) {
            taskType = 'received';
        } else if (workflowId.indexOf('workflow') !== -1) {
            taskType = 'issued';
        }
        path.push({
            title: intl.formatMessage(messages.requests),
            link: `${basePath}received`
        });
        path.push({
            title: !_.isEmpty(messages[taskType])
                ? intl.formatMessage(messages[taskType])
                : taskType,
            link: `${basePath}${taskType}`
        });
        path.push({
            title: taskName,
            link: taskName
        });
        return path;
    };

    render() {
        const { classes, serverMessage } = this.props;

        if (serverMessage && serverMessage.length > 0) {
            return (
                <div className={classes.error}>
                    <Header />
                </div>
            );
        }

        return (
            <div className={classes.header}>
                <BreadCrumbHeader path={this.getPath()} disableLast />
                {ENABLE_HEADER_LINKS && <HeaderLinks />}
                <HeaderProfile />
            </div>
        );
    }
}

export default injectIntl(HeaderWorkflowDetails);
