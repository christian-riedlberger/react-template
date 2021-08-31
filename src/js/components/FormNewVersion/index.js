import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, Form, getFormSyncErrors } from 'redux-form';
import messages from 'constants/Messages';
import { renderMultiLineTextField, renderSwitch } from 'constants/FormFields';
import MessageContainer from 'containers/MessageContainer';
import VersionContainer from 'containers/VersionContainer';
import FieldFileUpload from 'components/FieldFileUpload';
import FieldRow from 'components/FieldRow';

type DefaultProps = {
    classes: Object,
    showMessage: Function
};

type Props = {
    formValues: Object,
    uploadNewVersion: Function,
    fetchVersionHistory: Function,
    nodeRef: string,
    onSuccess: Function,
    modalMethods: Function
} & DefaultProps;

const styles = {
    root: {
        minWidth: '300px',
        '& .MuiTypography-body1': {
            fontSize: '1em'
        }
    }
};

const validate = (values, props: Props) => {
    const { intl } = props;
    const errors = {};

    if (!values.document)
        errors.document = intl.formatMessage(messages.requiredDocument);

    return errors;
};

export const formName = 'newDocumentVersion';

@withStyles(styles)
@VersionContainer()
@MessageContainer()
@reduxForm({
    form: formName,
    enableReinitialize: true,
    validate
})
@connect(store => ({
    formValues: _.get(store, `form.${formName}.values`, null),
    synchronousErrors: getFormSyncErrors(`${formName}`)(store)
}))
class FormNewVersion extends Component<Props> {
    onSubmit = () => {
        const {
            formValues,
            nodeRef,
            uploadNewVersion,
            fetchVersionHistory,
            onSuccess,
            showMessage,
            modalMethods
        } = this.props;

        if (
            formValues &&
            formValues.document &&
            !_.isEmpty(formValues.document.uploadedFiles)
        ) {
            const uploadNewVersionObj = {
                file: formValues.document.uploadedFiles[0],
                description: formValues.description,
                majorversion: formValues.majorversion,
                updatenoderef: nodeRef,
                updatenameandmimetype: true,
                overwrite: true,
                filename: formValues.document.uploadedFiles[0].name
            };
            if (modalMethods) {
                modalMethods.close();
            }
            showMessage({
                message: 'uploadingNewVersionPending',
                variant: 'pending'
            });
            return uploadNewVersion(uploadNewVersionObj)
                .then(() => {
                    fetchVersionHistory(nodeRef);
                    showMessage({
                        message: 'uploadingNewVersionSuccess',
                        variant: 'success'
                    });
                    return onSuccess(nodeRef);
                })
                .catch(e => {
                    throw e;
                });
        }

        if (modalMethods) {
            modalMethods.close();
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <Form
                onSubmit={this.onSubmit}
                className={classes.root}
                autoComplete="off"
            >
                <FieldRow>
                    <Field
                        name="document"
                        label="versionDocument"
                        component={FieldFileUpload}
                        fullWidth
                        documentPicker={false}
                        multiple={false}
                    />
                </FieldRow>
                <FieldRow>
                    <Field
                        name="description"
                        component={renderMultiLineTextField}
                        className={classes.textField}
                        label="Comment"
                        fullWidth
                    />
                </FieldRow>
                <FieldRow>
                    <Field
                        name="majorversion"
                        component={renderSwitch}
                        label="Major Version"
                    />
                </FieldRow>
            </Form>
        );
    }
}

export default injectIntl(FormNewVersion);
