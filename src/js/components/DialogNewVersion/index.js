// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import Dialog from 'components/Dialog';
import messages from 'constants/Messages';
import FormNewVersion, {
    formName as VersionFormName
} from 'components/FormNewVersion';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function
};

type Props = {
    passRef: Function, // handles `ref={r => { this.dial = r; }}`
    intl: Function,
    onClose: Function,
    onSave: Function, // callback function
    nodeRef: string,
    classes: Object,
    open: boolean
} & DefaultProps;

const DialogNewVersion = (props: Props) => {
    const {
        intl,
        onSave,
        onClose,
        nodeRef,
        classes,
        passRef,
        dispatch,
        open
    } = props;

    const handleSave = () => {
        dispatch(submit(VersionFormName));
    };

    const handleSuccess = () => {
        if (onSave) onSave(nodeRef);
    };

    return (
        <Dialog
            className={classes.dialog}
            intl={intl}
            ref={passRef}
            title={intl.formatMessage(messages.requestDocument)}
            onSave={handleSave}
            onClose={onClose}
            open={open}
        >
            {({ modalMethods }) => (
                <FormNewVersion
                    onSuccess={() => {
                        handleSuccess();
                    }}
                    nodeRef={nodeRef}
                    classes={classes}
                    modalMethods={modalMethods}
                />
            )}
        </Dialog>
    );
};

export default injectIntl(connect()(DialogNewVersion));
