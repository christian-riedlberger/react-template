// @flow
import type { Flux } from 'types/reduxTypes';

export type FormName = string;
export type FieldName = string;

export type FormProps = {
    handleSubmit: Function,
    reset: Function,
    blur: Function,
    dirty: boolean,
    submitFailed: boolean,
    change: (FormName, FieldName, any) => void,
    dispatch: Flux => void
};

export type Field = {
    label?: string,
    meta: {
        touched: boolean,
        error: string | null,
        invalid: boolean,
        asyncValidating: boolean,
        warning: string | null
    },
    input: {
        value: any,
        onChange: Function,
        name: string
    },
    children?: any,
    autoFocus?: boolean,
    hideErrors?: boolean,
    fullWidth?: boolean,
    fields?: Array<any>,
    onEnterPress?: Function,
    help?: string,
    options?: Array<Object>
};

// component name as string, used in conjuction with registry
type Component = string;

export type WizardForm = {
    formId: string,
    type: 'request',
    titleLabel: string,
    descriptionLabel: string,
    workflowId: string,
    formTypes: Component,
    finishButtonLabel: string,
    steps: Array<{
        trackLabel: string,
        formComponent: Component
    }>
};

export type SubmitFormProps = {
    handleFinish: Object => Promise<Object>,
    isSubmitting: boolean
};
