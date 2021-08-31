// @flow
import React, { useState } from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form } from 'redux-form';
import Typography from '@material-ui/core/Typography';

import * as theme from 'constants/Theme';
import messages from 'constants/Messages';
import { errorMessages } from 'utils/errorMessages';
import { initFromQuery } from 'utils/form';
import { certificateTypeOptions } from 'constants/Options';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import FieldRow from 'components/FieldRow';
import FieldListOptions from 'components/FieldListOptions';

type DefaultProps = {
    intl: intlShape,
    handleSubmit: Function,
    change: Function
};

type Props = {
    onSubmit: Function
} & DefaultProps;

const useStyles = makeStyles(t => ({
    root: {},
    title: {
        color: t.palette.primary.dark
    },
    field: {
        '& label::first-letter': {
            textTransform: 'uppercase'
        },
        width: 200,
        display: 'block'
    },
    dense: {
        marginTop: '2em'
    }
}));

/**
 * Form validation
 * @param {*} values
 */
function validate(values: Object) {
    const errors = {};

    if (!_.get(values, 'type', '')) {
        errors.type = 'required';
    }

    return errorMessages(errors);
}

/**
 * Form for certificate type
 * Used in request certificate wizard
 * @param {*} props
 */
const FormCertificateType = ({
    intl,
    handleSubmit,
    onSubmit,
    change
}: Props) => {
    const classes = useStyles();
    const [selectedOption, setOption] = useState(null);

    const options = _.map(certificateTypeOptions, opt => ({
        ...opt,
        nodeRef: opt.value,
        secondaryIcon:
            selectedOption && selectedOption.value === opt.value ? (
                <RadioButtonCheckedIcon style={{ color: theme.green }} />
            ) : (
                <RadioButtonUncheckedIcon />
            )
    }));

    const onChange = (option: String) => {
        setOption(_.find(options, { value: option }) || null);
        change('type', option);
    };

    return (
        <Form
            className={classes.root}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Typography variant="h6" color="textSecondary" gutterBottom>
                {intl.formatMessage(messages.selectCertificateType)}
            </Typography>

            <FieldRow>
                <Field
                    name="type"
                    input={{
                        onChange,
                        value: selectedOption ? selectedOption.value : null
                    }}
                    component={FieldListOptions}
                    options={options}
                />
            </FieldRow>
        </Form>
    );
};

/**
 * Define the form definition
 * Includes:
 * default values
 * dependency injection
 */
export const FormName = 'requestCertificateType';
export default compose(
    initFromQuery(),
    reduxForm({
        form: FormName,
        validate,
        enableReinitialize: true
    }),
    injectIntl
)(FormCertificateType);
