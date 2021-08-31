// @flow
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import Dialog from 'components/Dialog';
import messages from 'constants/Messages';
import FormGroup, { FormName as GroupFormName } from 'components/FormGroup';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function
};

type Props = {
    passRef: Function, // handles `ref={r => { this.dial = r; }}`
    shortName?: string, // onEdit -> pass shortName
    parentName?: string, // onNew -> pass parentName
    groupRootOrganization?: string, // onNew -> pass groupRootOrganization
    onSave?: Function // callback function
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const DialogGroup = (props: Props) => {
    const {
        intl,
        onSave,
        parentName,
        groupRootOrganization,
        shortName,
        passRef,
        dispatch
    } = props;
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        dispatch(submit(GroupFormName));
    };

    const handleSuccess = (group, message) => {
        if (onSave) onSave(group, message);
    };

    return (
        <Dialog
            className={classes.root}
            intl={intl}
            ref={passRef}
            title={
                shortName
                    ? intl.formatMessage(messages.editGroup, {
                        groupName: shortName
                    })
                    : intl.formatMessage(messages.newGroup)
            }
            onSave={handleSave}
            isLoading={isLoading}
        >
            {({ modalMethods }) => (
                // $FlowFixMe
                <FormGroup
                    shortName={shortName}
                    onSuccess={(group, message) => {
                        handleSuccess(group, message);
                        modalMethods.close();
                    }}
                    parentName={parentName}
                    groupRootOrganization={groupRootOrganization}
                    setIsLoading={setIsLoading}
                />
            )}
        </Dialog>
    );
};

export default injectIntl(connect()(DialogGroup));
