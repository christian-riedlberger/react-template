// @flow
import React from 'react';
import { compose } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { Field, reduxForm, Form } from 'redux-form';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FieldFileUpload from 'components/FieldFileUpload';
import FieldRow from 'components/FieldRow';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import messages from 'constants/Messages';
import { errorMessages } from 'utils/errorMessages';
import { initFromQuery } from 'utils/form';

type DefaultProps = {
    intl: intlShape,
    handleSubmit: Function
} & RepoContainerProps;

type Props = {
    intl: intlShape,
    handleSubmit: Function,
    onSubmit: Function,
    activeOrg: Object
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
 * Form validation
 * @param {*} values
 */
function validate(values: Object) {
    const errors = {};
    if (
        _.get(values, 'documents.uploadedFiles.length', 0) === 0 &&
        _.get(values, 'documents.selectedFiles.length', 0) === 0
    ) {
        errors.documents = 'required';
    }

    return errorMessages(errors);
}

/**
 * Form for request basic details
 * Used in create request wizard and request table actions
 * @param {*} props
 */
const FormRequestDocument = (props: Props) => {
    const { intl, handleSubmit, onSubmit, activeOrg } = props;
    const classes = useStyles();

    const parentRef = _.get(activeOrg, 'businessRef');
    return (
        <Form
            className={classes.root}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Typography variant="h6" color="textSecondary" gutterBottom>
                {intl.formatMessage(messages.requestDocument)}
            </Typography>

            <FieldRow>
                <Field
                    fullWidth
                    documentPicker
                    multiple
                    name="documents"
                    label={intl.formatMessage(messages.name)}
                    component={FieldFileUpload}
                    parentRef={parentRef}
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
export const FormName = 'requestDocument';
export default compose(
    RepoContainer({ initDocumentNodes: true }),
    initFromQuery(),
    reduxForm({
        form: FormName,
        validate,
        enableReinitialize: true
    }),
    injectIntl
)(FormRequestDocument);
