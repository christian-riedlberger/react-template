// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import _ from 'lodash';

import Dialog from 'components/Dialog';
import messages from 'constants/Messages';
import FormNode, { FormName as NodeFormName } from 'components/FormNode';
import type { Node } from 'types/repoTypes';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function
};

type Props = {
    passRef: Function, // handles `ref={r => { this.dial = r; }}`
    intl: Function,
    node?: Node, // onEdit -> target folder
    parentFolder?: Node, // onNew -> parent folder
    onSave?: Function // callback function
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const DialogNode = (props: Props) => {
    const { intl, onSave, node, passRef, dispatch, parentFolder } = props;
    const classes = useStyles();

    const handleSave = () => {
        dispatch(submit(NodeFormName));
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
                node
                    ? intl.formatMessage(messages.editGroup, {
                        groupName: node.name
                    })
                    : intl.formatMessage(messages.newFolder)
            }
            onSave={handleSave}
        >
            {({ modalMethods }) =>
                parentFolder ? (
                    // $FlowFixMe
                    <FormNode
                        parentRef={_.get(parentFolder, 'nodeRef')}
                        onSuccess={group => {
                            handleSuccess(group);
                            modalMethods.close();
                        }}
                    />
                ) : (
                    // $FlowFixMe
                    <FormNode
                        nodeRef={_.get(node, 'nodeRef')}
                        onSuccess={group => {
                            handleSuccess(group);
                            modalMethods.close();
                        }}
                    />
                )
            }
        </Dialog>
    );
};

export default injectIntl(connect()(DialogNode));
