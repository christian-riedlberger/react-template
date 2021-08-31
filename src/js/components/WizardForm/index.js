// @flow
import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { compose } from 'recompose';

import WizardStepper from 'components/WizardStepper';
import FormRegistry from 'constants/FormRegistry';
import FormComponents from 'constants/FormComponentRegistry';
import type {
    WizardForm as WizardFormType,
    SubmitFormProps
} from 'types/formTypes';

type DefaultProps = {
    location: Object
};

type Props = {
    formId: string
} & DefaultProps;

// Custom CSS Classes
const useStyles = makeStyles({
    root: {
        backgroundColor: 'white',
        'min-height': '95.5vh'
    },
    breadcrumb: {
        fontSize: '0.9em',
        paddingTop: '1em',
        paddingLeft: '1.5em',
        '& div::first-letter': {
            textTransform: 'uppercase'
        }
    },
    steps: {
        '& span::first-letter': {
            textTransform: 'uppercase'
        }
    }
});

/**
 * Wizard for the report creation
 * @param {*} props
 */
const WizardForm = (props: Props) => {
    let form: WizardFormType;
    const { location, formId } = props;
    const classes = useStyles();

    // Get formID from props
    if (formId) {
        form = _.find(FormRegistry, { formId });
    } else {
        form = _.find(FormRegistry, {
            formId: location.query.formId
        });
    }

    if (!form) return <div>Error: No form ID found for {formId}</div>;

    const { hideTracks, hideNavigation } = form;
    const { Form: FormSubmit } = FormComponents[form.submitComponent];
    const steps = _.map(form.steps, step => {
        const { formName, Form } = FormComponents[step.formComponent];
        return {
            ...step,
            formComponent: args => <Form {...args} onSubmit={() => null} />,
            formName
        };
    });
    const initialStep = Number(location.query.step) || 0;

    return (
        <div className={classes.root}>
            <FormSubmit>
                {({ handleFinish, isSubmitting }: SubmitFormProps) => (
                    <WizardStepper
                        steps={steps}
                        hideTracks={hideTracks}
                        hideNavigation={hideNavigation}
                        finishButtonLabel={form.finishButtonLabel}
                        onFinish={handleFinish}
                        initialStep={initialStep}
                        isSubmitting={isSubmitting}
                    />
                )}
            </FormSubmit>
        </div>
    );
};

export default compose(withRouter)(WizardForm);
