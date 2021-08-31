// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import _ from 'lodash';

import Dialog from 'components/Dialog';
import messages from 'constants/Messages';
import FormFolder, { FormName as FolderFormName } from 'components/FormFolder';
import type { Node } from 'types/repoTypes';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function
};

type Props = {
    passRef: Function, // handles `ref={r => { this.dial = r; }}`
    intl: Function,
    folder?: Node, // onEdit -> target folder
    parentFolder?: Node, // onNew -> parent folder
    onSave?: Function // callback function
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const DialogFolder = (props: Props) => {
    const { intl, onSave, folder, passRef, dispatch, parentFolder } = props;
    const classes = useStyles();

    const handleSave = () => {
        dispatch(submit(FolderFormName));
    };

    const handleSuccess = group => {
        if (onSave) onSave(group);
    };

    return (
        <Dialog
            className={classes.root}
            intl={intl}
            ref={passRef}
            title={
                folder
                    ? intl.formatMessage(messages.editGroup, {
                        groupName: folder.name
                    })
                    : intl.formatMessage(messages.newFolder)
            }
            onSave={handleSave}
        >
            {({ modalMethods }) =>
                parentFolder ? (
                    // $FlowFixMe
                    <FormFolder
                        parentRef={_.get(parentFolder, 'nodeRef')}
                        onSuccess={group => {
                            handleSuccess(group);
                            modalMethods.close();
                        }}
                    />
                ) : (
                    // $FlowFixMe
                    <FormFolder
                        nodeRef={_.get(folder, 'nodeRef')}
                        onSuccess={group => {
                            handleSuccess(group);
                            modalMethods.close();
                        }}
                    />
                )
            }
        </Dialog>
    );
    /* flow-enable */
};

export default injectIntl(connect()(DialogFolder));
