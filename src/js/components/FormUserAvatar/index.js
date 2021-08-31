// @flow
import React, { Component } from 'react';
import Modal from 'components/Modal';
import type { ImageInformation } from 'types/userTypes';
import UserAvatarEditor from 'components/FormUserAvatarEditor';

type Props = {
    title: string,
    description: string,
    onAvatarSaving: Function,
    image: ImageInformation
};

export default class FormUserAvatar extends Component<Props> {
    modal: Modal;

    open() {
        this.modal.open();
    }

    handleClose = () => {
        this.modal.close();
    };

    render() {
        const { title, description, image, onAvatarSaving } = this.props;

        return (
            <Modal
                className="users people"
                ref={c => {
                    if (c) this.modal = c;
                }}
                title={title}
                description={description}
            >
                <UserAvatarEditor
                    newImage={image}
                    onClose={this.handleClose}
                    onAvatarSaving={onAvatarSaving}
                />
            </Modal>
        );
    }
}
