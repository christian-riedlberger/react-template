// @flow
import React, { Component } from 'react';
import { intlShape } from 'react-intl';
import Modal from 'components/Modal';
import type { ImageInformation } from 'types/userTypes';
import FormUserAvatarEditor from 'components/FormUserAvatarEditor';
import Dialog from 'components/Dialog';
/* import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'; */

type Props = {
    intl: intlShape,
    passRef: Function,
    title: string,
    onAvatarSaving: Function,
    onAvatarCancel: Function,
    image: ImageInformation,
    open: boolean
};

export default class FormUserAvatarModal extends Component<Props> {
    modal: Modal;

    render() {
        const {
            intl,
            title,
            image,
            onAvatarSaving,
            onAvatarCancel,
            passRef,
            open
        } = this.props;

        return (
            <React.Fragment>
                <Dialog
                    intl={intl}
                    open={open}
                    ref={passRef}
                    title={title}
                    hideActions
                >
                    <FormUserAvatarEditor
                        newImage={image}
                        onClose={onAvatarCancel}
                        onAvatarSaving={onAvatarSaving}
                    />
                </Dialog>
            </React.Fragment>
        );
    }
}
