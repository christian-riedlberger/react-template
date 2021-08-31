// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';

import Dialog from 'components/Dialog';

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    passRef: Function,
    task: Object,
    onConfirm: Function
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const DialogIssuedTaskConfirm = (props: Props) => {
    const { intl, task, passRef, onConfirm } = props;
    const classes = useStyles();

    const message = intl.formatMessage(messages.confirmCancel, {
        name: task.name
    });

    return (
        <Dialog
            intl={intl}
            ref={passRef}
            title={intl.formatMessage(messages.cancel)}
            onSave={onConfirm}
            primaryActionMessage="confirm"
            className={classes.root}
        >
            {message}
        </Dialog>
    );
};

export default injectIntl(DialogIssuedTaskConfirm);
