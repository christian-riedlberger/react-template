// @flow
import _ from 'lodash';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';

import Dialog from 'components/Dialog';
import type { Node } from 'types/repoTypes';

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    passRef: Function, // handles `ref={r => { this.dial = r; }}`
    folder: Node,
    folders: Array<String>,
    onConfirm: Function
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const DialogFolderConfirm = (props: Props) => {
    const { intl, folder, folders, passRef, onConfirm } = props;
    const classes = useStyles();
    let message = '';

    if (folders && folders.length > 0) {
        message = (
            <div>
                {intl.formatMessage(messages.confirmDeleteItems)}

                <ul>
                    {_.map(folders, f => {
                        return <li>{f}</li>;
                    })}
                </ul>
            </div>
        );
    } else {
        message = intl.formatMessage(messages.confirmDelete, {
            name: folder.name
        });
    }

    return (
        <Dialog
            intl={intl}
            ref={passRef}
            title={intl.formatMessage(messages.delete)}
            onSave={onConfirm}
            primaryActionMessage="confirm"
            className={classes.root}
        >
            {message}
        </Dialog>
    );
};

export default injectIntl(DialogFolderConfirm);
