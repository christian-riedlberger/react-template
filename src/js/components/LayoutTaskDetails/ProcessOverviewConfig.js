// @flow
export default [
    {
        label: 'processOverviewCertificate',
        status: 'you have selected "yes"',
        type: 'cert:supplierCertification',
        completed: true
    },
    {
        label: 'processOverviewUpload',
        status: 'documents attached',
        type: 'cert:supplierCertificationIntake'
    },
    {
        label: 'processOverviewDocument',
        status: 'completed by third-party',
        type: 'cert:pmaQuote'
    },
    {
        label: 'processOverviewPayment',
        status: 'standard $100.00 fee',
        type: 'cert:paymentReview'
    },
    {
        label: 'processOverviewAuthentication',
        status: 'deadline 10-10-2020',
        type: 'cert:pmaAuthenticate'
    }
];
