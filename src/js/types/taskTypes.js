// @flow

type Organization = string;

export type Task = {
    nodeRefs: Array<string>,
    workflowId: 'activiti$compliantWorkflow',
    wfProperties: {
        'bpm:workflowDueDate': Date,
        'bpm:workflowDescription': string,
        'bpm:percentComplete': string,
        'bpm:workflowPriority': '1' | '2' | '3',
        'bpm:sendEMailNotifications': Boolean,
        'bpm:status': 'Not Yet Started',
        'gfr:stage': 'REVIEW',
        'gfr:guidCount': 99,
        'gfr:entity': Organization
    }
};
