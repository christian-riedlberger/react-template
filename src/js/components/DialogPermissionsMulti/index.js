// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import _ from 'lodash';

import messages from 'constants/Messages';
import Dialog from 'components/Dialog';
import type { RenderPropsArgs } from 'components/Dialog';
import FormPermissionsMulti, {
    FormName as PermissionsFormName
} from 'components/FormPermissionsMulti';
import type { Node } from 'types/repoTypes';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function
};

type Props = {
    nodes: Array<Node>,
    passRef: Function,
    onSave?: (Array<Node>) => void,
    onClose?: () => void
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

const DialogPermissionsMulti = (props: Props) => {
    const { intl, passRef, dispatch, nodes, onSave, onClose } = props;
    const classes = useStyles();

    /**
     * Sumit permissions form
     */
    const handleSave = () => {
        dispatch(submit(PermissionsFormName));
    };

    const handleClose = () => {
        if (onClose) onClose();
    };

    if (_.isEmpty(nodes)) return null;
    return (
        <Dialog
            className={classes.root}
            intl={intl}
            ref={passRef}
            title={intl.formatMessage(messages.shareXItems, {
                value: nodes.length
            })}
            onSave={handleSave}
            onClose={handleClose}
        >
            {({ modalMethods }: RenderPropsArgs) => (
                // $FlowFixMe
                <FormPermissionsMulti
                    nodeRefs={_.map(nodes, 'nodeRef')}
                    onSuccess={() => {
                        if (onSave) onSave(nodes);
                        modalMethods.close();
                    }}
                />
            )}
        </Dialog>
    );
};

export default injectIntl(connect()(DialogPermissionsMulti));
