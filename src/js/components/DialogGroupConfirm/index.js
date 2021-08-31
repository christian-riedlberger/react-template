// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';

import Dialog from 'components/Dialog';
import type { Group as GroupType } from 'types/groupTypes';

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    passRef: Function, // handles `ref={r => { this.dial = r; }}`
    intl: Function,
    group: GroupType | null,
    onConfirm: Function,
    action: string
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const DialogGroupConfirm = (props: Props) => {
    const { intl, group, passRef, onConfirm, action } = props;
    const classes = useStyles();

    let dialogContent = null;
    let dialogTitle = '';

    // handle null group
    if (group) {
        if (action === 'delete') {
            dialogContent = intl.formatMessage(messages.confirmDelete, {
                name: group.shortName
            });
            dialogTitle = intl.formatMessage(messages.delete);
        } else {
            dialogContent = intl.formatMessage(messages.confirmRemove, {
                name: group.shortName
            });
            dialogTitle = intl.formatMessage(messages.remove);
        }
    }

    return (
        <Dialog
            intl={intl}
            ref={passRef}
            title={dialogTitle}
            onSave={onConfirm}
            primaryActionMessage="confirm"
            className={classes.root}
        >
            {dialogContent}
        </Dialog>
    );
};

export default injectIntl(DialogGroupConfirm);
