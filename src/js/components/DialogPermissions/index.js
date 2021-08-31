// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import messages from 'constants/Messages';
import Dialog from 'components/Dialog';
import type { RenderPropsArgs } from 'components/Dialog';
import FormPermissions, {
    FormName as PermissionsFormName
} from 'components/FormPermissions';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function
};

type Props = {
    title: string,
    nodeRef: string,
    passRef: Function,
    onSave?: string => void
} & DefaultProps;

// (theme: Object, props: Props) => {...}
const useStyles = makeStyles(() => ({
    root: {
        '& .MuiDialogTitle-root .MuiTypography-h6': {
            overflow: 'hidden',
            width: '22em',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    }
}));

const DialogPermissions = (props: Props) => {
    const { intl, title, passRef, dispatch, nodeRef, onSave } = props;
    const classes = useStyles();

    const handleSave = () => {
        dispatch(submit(PermissionsFormName));
    };

    return (
        <Dialog
            className={classes.root}
            intl={intl}
            ref={passRef}
            title={`${intl.formatMessage(messages.share)}: ${title}`}
            onSave={handleSave}
        >
            {({ modalMethods }: RenderPropsArgs) => (
                // $FlowFixMe
                <FormPermissions
                    nodeRef={nodeRef}
                    onSuccess={() => {
                        modalMethods.close();
                        if (onSave) onSave(nodeRef);
                    }}
                />
            )}
        </Dialog>
    );
};

export default injectIntl(connect()(DialogPermissions));
