// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import messages from 'constants/Messages';
import FormInvitations, {
    FormName as InvitationFormName
} from 'components/FormInvitations';
import Drawer from 'components/Drawer';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function
};

type Props = {
    open: boolean,
    onClose: Function,
    onSuccess: Function
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const DrawerFilterTasks = (props: Props) => {
    const { intl, open, dispatch, onClose, onSuccess } = props;
    const classes = useStyles();

    const handleReset = () => {
        dispatch(reset(InvitationFormName));
    };

    return (
        <div className={classes.root}>
            <Drawer
                title={intl.formatMessage(messages.invtTitle)}
                noButton
                open={open}
                onReset={() => handleReset()}
                onClose={() => onClose()}
                width={400}
            >
                {/* $FlowFixMe */}
                <FormInvitations onSuccess={() => onSuccess()} />
            </Drawer>
        </div>
    );
};

// $FlowFixMe
export default connect()(injectIntl(DrawerFilterTasks));
