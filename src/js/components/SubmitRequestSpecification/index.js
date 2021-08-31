// @flow
import React, { Component } from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import moment from 'moment-timezone';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';

import MessageContainer from 'containers/MessageContainer';
import TasksContainer from 'containers/TasksContainer';
import type { ContainerProps as TaskContainerProps } from 'containers/TasksContainer';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import { renderChildren } from 'utils/render';
import type { StepperProps } from 'components/WizardStepper';
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

export const FormName = 'requestSpecificationFinish';
/**
 *  @desc Request onFinish handler component
 *  @author bvincent1
 */
@injectIntl
@withStyles(styles)
@withRouter
@TasksContainer({})
@RepoContainer({})
@MessageContainer()
@connect(state => ({ forms: state.form }))
class SubmitRequestSpecification extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isSubmitting: false
        };
    }

    /**
     *  Get properties for workflow
     */
    getWorkflowDetails = (fieldValues: Object, recipient: string) => {
        return {
            workflowId: fieldValues.workflowId,
            wfProperties: {
                'bpm:workflowDueDate': fieldValues.dueDate,
                'bpm:workflowDescription': fieldValues.name,
                'bpm:percentComplete': '0',
                'bpm:workflowPriority': fieldValues.urgent ? 1 : 2,
                'bpm:sendEMailNotifications': 'true',
                'bpm:status': 'Not Yet Started',
                'gfr:stage': 'REVIEW',
                'gfr:entity': recipient.replace('_ORGANIZATION', ''),
                'gfr:issuingEntity': fieldValues.issuingEntity.replace(
                    '_ORGANIZATION',
                    ''
                ),
                'gfr:additionalInfo': fieldValues.info,
                'gfr:details': fieldValues.description
            }
        };
    };

    /**
     *  Upload documents
     */
    uploadDocuments = (values: {
        documents: {
            uploadedFiles: Array<File>
        },
        issuingEntity: string,
        recipients: Array<string> | string
    }): Promise<Object> => {
        const { uploadFileRequest } = this.props;
        const files = values.documents.uploadedFiles;

        return uploadFileRequest(
            values.issuingEntity.replace('_ORGANIZATION', ''),
            values.recipients,
            _.compact(files)
        );
    };

    /**
     *  Upload documents
     */
    copyExistingDocuments = (values: {
        documents: {
            selectedFiles: Array<File>
        },
        issuingEntity: string,
        recipients: Array<string> | string
    }): Promise<Object> => {
        const { copyFileRequest } = this.props;
        const nodeRefs = values.documents.selectedFiles;

        return copyFileRequest(
            values.issuingEntity.replace('_ORGANIZATION', ''),
            values.recipients,
            _.map(nodeRefs, _.property('nodeRef'))
        );
    };

    /**
     *  Finish user action
     */
    handleFinish = (args: StepperProps) => {
        const { forms, createRequest, router, showMessage } = this.props;
        const formNames = _.map(args.nav, 'formName');

        // agregate wizzard form data
        const fieldValues = _.reduce(
            formNames,
            (values, name) => ({
                ...values,
                ...getFormValues(_.get(forms, name, {}), true)
            }),
            {}
        );

        // update due date to account for specific time (if set)
        if (fieldValues && fieldValues.dueTime) {
            // convert from 12 hour to 24 hour
            const dt = moment(fieldValues.dueTime, ['h:mm A']).format('HH:mm');

            fieldValues.dueDate = moment(fieldValues.dueDate)
                .set({
                    hour: moment(dt, 'HH:mm').get('hour'),
                    minute: moment(dt, 'HH:mm').get('minute')
                })
                .toDate();
        }

        // update due date to account for specific timezone (if set)
        if (fieldValues && fieldValues.timezone) {
            fieldValues.dueDate = moment(fieldValues.dueDate)
                .tz(fieldValues.timezone, true)
                .utc()
                .format();
        }

        showMessage({ message: 'assigningRequest', variant: 'pending' });

        this.setState({ isSubmitting: true });

        // First copy existing
        this.copyExistingDocuments(fieldValues)
            .then(r => {
                const existingNodeRefs = r.action.payload.data.nodeRefs;

                // Upload documents
                this.uploadDocuments(fieldValues)
                    .then(resp => {
                        const nodeRefs = _.flatten(
                            _.map(resp.action.payload, p => {
                                return p.data.nodeRefs;
                            })
                        );

                        // Create tasks
                        const taskRequestArray = _.map(
                            fieldValues.recipients,
                            recipient => {
                                const receiptNodes = _.compact(
                                    _.map(nodeRefs, n => {
                                        return n.organization === recipient
                                            ? n.nodeRef
                                            : null;
                                    })
                                );

                                const existingNodes = _.compact(
                                    _.map(existingNodeRefs, n => {
                                        return n.organization === recipient
                                            ? n.nodeRef
                                            : null;
                                    })
                                );

                                return {
                                    nodeRefs: _.concat(
                                        receiptNodes,
                                        existingNodes
                                    ),
                                    ...this.getWorkflowDetails(
                                        fieldValues,
                                        recipient
                                    )
                                };
                            }
                        );

                        // eslint-disable-next-line compat/compat
                        return Promise.all(
                            _.map(taskRequestArray, taskRequest =>
                                createRequest(taskRequest)
                            )
                        );
                    })
                    .then(() => {
                        this.setState({ isSubmitting: false });
                        router.push('/requests/issued');
                        showMessage({
                            message: 'assigningRequestSuccess',
                            variant: 'success'
                        });
                        return null;
                    })
                    .catch(e => {
                        throw new Error(e);
                    });

                return r;
            })
            .catch(e => {
                // eslint-disable-next-line no-alert
                alert(`There was a problem copying existing files: ${e}`);

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

export default SubmitRequestSpecification;
