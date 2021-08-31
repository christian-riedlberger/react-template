// @flow
const FormRegistry = [
    {
        formId: 'requestSpecification',
        type: 'request',
        titleLabel: 'requestSpecification',
        descriptionLabel: 'requestSpecificationDescription',
        workflowId: 'activiti$compliantWorkflow',
        submitComponent: 'SubmitRequestSpecification',
        isWorkflowPerDocument: true,
        steps: [
            {
                trackLabel: 'requestTitle',
                formComponent: 'FormRequestBasicDetails'
            },
            {
                trackLabel: 'requestIssuer',
                formComponent: 'FormRequestIssuer'
            },
            {
                trackLabel: 'requestRecipients',
                formComponent: 'FormRequestRecipients'
            },
            {
                trackLabel: 'requestDocument',
                formComponent: 'FormRequestDocument'
            },
            {
                trackLabel: 'requestDueDate',
                formComponent: 'FormRequestDueDate'
            },
            {
                trackLabel: 'requestAdditionalInfo',
                formComponent: 'FormRequestAdditionalInfo'
            },
            {
                trackLabel: 'requestReview',
                formComponent: 'FormRequestReview'
            }
        ]
    },
    {
        formId: 'requestCertification',
        type: 'request',
        titleLabel: 'requestCertification',
        descriptionLabel: 'requestCertificationDescription',
        workflowId: 'activiti$certificationRequest',
        submitComponent: 'SubmitRequestCertification',
        finishButtonLabel: 'issueRequest',
        steps: [
            {
                trackLabel: 'requestCertificateType',
                formComponent: 'FormCertificateType'
            },
            {
                trackLabel: 'requestTitle',
                formComponent: 'FormRequestBasicDetails'
            },
            {
                trackLabel: 'requestIssuer',
                formComponent: 'FormRequestIssuer'
            },
            {
                trackLabel: 'requestRecipients',
                formComponent: 'FormRequestRecipients'
            },
            {
                trackLabel: 'requestDueDate',
                formComponent: 'FormRequestDueDate'
            },

            {
                trackLabel: 'requestAdditionalInformation',
                formComponent: 'FormRequestInfoDocument'
            },
            {
                trackLabel: 'requestReview',
                formComponent: 'FormRequestReview'
            }
        ]
    },
    {
        formId: 'cert:supplierCertificationIntake',
        type: 'task',
        submitComponent: 'SubmitTask',
        hideTracks: true,
        hideNavigation: true,
        steps: [
            {
                formComponent: 'TaskSupplierCertificationIntake'
            }
        ]
    },
    {
        formId: 'cert:pmaQuote',
        type: 'task',
        submitComponent: 'SubmitTask',
        finishButtonLabel: 'sendQuote',
        hideTracks: true,
        steps: [
            {
                formComponent: 'TaskPmaQuote'
            }
        ]
    },
    {
        formId: 'cert:paymentReview',
        type: 'task',
        submitComponent: 'SubmitTask',
        finishButtonLabel: 'payNowButton',
        hideTracks: true,
        steps: [
            {
                formComponent: 'TaskPaymentReview'
            }
        ]
    },
    {
        formId: 'cert:pmaAuthenticate',
        type: 'task',
        submitComponent: 'SubmitTask',
        finishButtonLabel: 'authenticateButton',
        hideTracks: true,
        steps: [
            {
                formComponent: 'TaskPmaAuthenticate'
            }
        ]
    }
];

export default FormRegistry;
