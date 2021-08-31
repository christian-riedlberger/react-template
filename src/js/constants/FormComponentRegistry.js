// @flow
import FormRequestBasicDetails, {
    FormName as BasicDetailsFormName
} from 'components/FormRequestBasicDetails';
import FormRequestDocument, {
    FormName as FormRequestDocumentFormName
} from 'components/FormRequestDocument';
import FormRequestRecipients, {
    FormName as RecipientsFormName
} from 'components/FormRequestRecipients';
import FormRequestDueDate, {
    FormName as RequestDueDate
} from 'components/FormRequestDueDate';
import FormRequestIssuer, {
    FormName as RequestIssuer
} from 'components/FormRequestIssuer';
import FormRequestAdditionalInfo, {
    FormName as RequestAdditional
} from 'components/FormRequestAdditionalInfo';
import SubmitRequestSpecification, {
    FormName as RequestSpecification
} from 'components/SubmitRequestSpecification';
import SubmitRequestCertification, {
    FormName as RequestCertification
} from 'components/SubmitRequestCertification';
import FormRequestReview, {
    FormName as RequestReview
} from 'components/FormRequestReview';
import FormCertificateType, {
    FormName as CertificateType
} from 'components/FormCertificateType';
import FormRequestInfoDocument, {
    FormName as RequestInfoDocument
} from 'components/FormRequestInfoDocument';
import TaskPmaAuthenticate, {
    FormName as FormPmaAuthenticate
} from 'components/TaskPmaAuthenticate';
import TaskPaymentReview, {
    FormName as FormTaskPaymentReview
} from 'components/TaskPaymentReview';
import TaskSupplierCertificationIntake, {
    FormName as FormTaskSupplierCertificationIntake
} from 'components/TaskSupplierCertificationIntake';
import TaskPmaQuote, {
    FormName as FormTaskPmaQuote
} from 'components/TaskPmaQuote';

import SubmitTask from 'components/SubmitTask';

export default {
    /**
     * Requests
     */
    FormRequestBasicDetails: {
        Form: FormRequestBasicDetails,
        formName: BasicDetailsFormName
    },
    FormRequestDocument: {
        Form: FormRequestDocument,
        formName: FormRequestDocumentFormName
    },
    FormRequestRecipients: {
        Form: FormRequestRecipients,
        formName: RecipientsFormName
    },
    FormRequestDueDate: {
        Form: FormRequestDueDate,
        formName: RequestDueDate
    },
    FormRequestIssuer: {
        Form: FormRequestIssuer,
        formName: RequestIssuer
    },
    FormRequestAdditionalInfo: {
        Form: FormRequestAdditionalInfo,
        formName: RequestAdditional
    },
    SubmitRequestSpecification: {
        Form: SubmitRequestSpecification,
        formName: RequestSpecification
    },
    SubmitTask: {
        Form: SubmitTask,
        formName: RequestCertification
    },
    FormRequestReview: {
        Form: FormRequestReview,
        formName: RequestReview
    },
    FormCertificateType: {
        Form: FormCertificateType,
        formName: CertificateType
    },
    FormRequestInfoDocument: {
        Form: FormRequestInfoDocument,
        formName: RequestInfoDocument
    },
    SubmitRequestCertification: {
        Form: SubmitRequestCertification
    },

    /**
     *  Tasks
     */
    TaskSupplierCertificationIntake: {
        Form: TaskSupplierCertificationIntake,
        formName: FormTaskSupplierCertificationIntake
    },
    TaskPmaQuote: {
        Form: TaskPmaQuote,
        formName: FormTaskPmaQuote
    },
    TaskPaymentReview: {
        Form: TaskPaymentReview,
        formName: FormTaskPaymentReview
    },
    TaskPmaAuthenticate: {
        Form: TaskPmaAuthenticate,
        formName: FormPmaAuthenticate
    }
};
