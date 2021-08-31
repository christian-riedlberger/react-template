// @flow
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import Dialog from 'components/Dialog';
import messages from 'constants/Messages';
import FormOrganization, {
    FormName as OrganizationFormName
} from 'components/FormOrganization';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function
};

type Props = {
    passRef: Function, // handles `ref={r => { this.dial = r; }}`
    intl: Function,
    displayName?: string, // onEdit -> pass displayName
    shortName?: string, // onEdit -> pass shortName
    parentName?: string, // onNew -> pass parentName
    onSave?: Function // callback function
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const DialogOrganization = (props: Props) => {
    const {
        intl,
        onSave,
        parentName,
        shortName,
        displayName,
        passRef,
        dispatch
    } = props;
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        dispatch(submit(OrganizationFormName));
    };

    const handleSuccess = (group, message) => {
        if (onSave) onSave(group, message);
    };

    return (
        <Dialog
            className={classes.root}
            intl={intl}
            ref={passRef}
            noPadding
            title={
                shortName
                    ? intl.formatMessage(messages.editGroup, {
                        groupName: shortName.replace('_ORGANIZATION', '')
                    })
                    : intl.formatMessage(messages.newOrganization)
            }
            onSave={handleSave}
            isLoading={isLoading}
        >
            {({ modalMethods }) => (
                // $FlowFixMe
                <FormOrganization
                    displayName={displayName}
                    shortName={shortName}
                    onSuccess={(group, message) => {
                        handleSuccess(group, message);
                        modalMethods.close();
                    }}
                    parentName={parentName}
                    setIsLoading={setIsLoading}
                />
            )}
        </Dialog>
    );
};

export default injectIntl(connect()(DialogOrganization));
