// @flow
import React from 'react';
import { compose } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form } from 'redux-form';
import { renderMultiLineTextField } from 'constants/FormFields';
import messages from 'constants/Messages';
import { initFromQuery } from 'utils/form';
import Typography from '@material-ui/core/Typography';
import FieldRow from 'components/FieldRow';

type DefaultProps = {
    intl: intlShape,
    handleSubmit: Function
};

type Props = {
    onSubmit: Function
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        color: theme.palette.primary.dark
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
 * Form for request additional information
 * Used in create request wizard and request table actions
 * @param {*} props
 */
const FormRequestAdditionalInfo = ({ intl, handleSubmit, onSubmit }: Props) => {
    const classes = useStyles();
    return (
        <Form
            className={classes.root}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Typography variant="h6" color="textSecondary" gutterBottom>
                {intl.formatMessage(messages.requestAdditionalInfoTitle)}
            </Typography>

            <FieldRow>
                <Field
                    fullWidth
                    name="info"
                    component={renderMultiLineTextField}
                    rows={10}
                    label={intl.formatMessage(messages.requestAdditionalInfo)}
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
export const FormName = 'requestAdditionalInfo';
export default compose(
    initFromQuery(),
    reduxForm({
        form: FormName,
        enableReinitialize: true
    }),
    injectIntl
)(FormRequestAdditionalInfo);
