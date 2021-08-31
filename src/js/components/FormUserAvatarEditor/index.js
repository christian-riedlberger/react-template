// @flow
import React, { PureComponent } from 'react';
import Button from 'components/Button';
import AvatarEditor from 'react-avatar-editor';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import type { ImageInformation } from 'types/userTypes';

type Props = {
    onAvatarSaving: Function,
    onClose: Function,
    newImage: ImageInformation,
    hideButtons: boolean,
    classes: Object
};

type State = {
    rotate: number,
    scale: number
};

const styles = {
    avatarCropperContainer: {
        padding: '10px',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center'
    },
    canvas: {
        width: '200px',
        height: '200px'
    },
    avatarCropperActions: {
        display: 'flex',
        justifyContent: 'center'
    }
};

class FormUserAvatarEditor extends PureComponent<Props, State> {
    avatarEditor: AvatarEditor;

    constructor(props: Props) {
        super(props);

        this.state = {
            rotate: 0,
            scale: 2
        };
    }

    handleCancel = () => {
        this.props.onClose(false);
    };

    handleSave = () => {
        const canvas = this.avatarEditor.getImage();

        canvas.toBlob(blob => {
            const file = new File([blob], this.props.newImage.name);

            if (this.props.onAvatarSaving) {
                this.props.onAvatarSaving(file);
            }

            this.props.onClose(true);
        }, 'image/jpeg');
    };

    rotateImage = (degrees: number) => {
        this.setState(prevState => ({
            rotate: prevState.rotate + degrees
        }));
    };

    scaleImage = (e: Object) => {
        this.setState({
            scale: parseFloat(e.target.value)
        });
    };

    keyPressed = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            this.handleSave();
        }
    };

    render() {
        const { classes, hideButtons } = this.props;

        return (
            <div onKeyPress={this.keyPressed}>
                <div className="avatar-cropper">
                    <div className={classes.avatarCropperContainer}>
                        <AvatarEditor
                            ref={ref => {
                                this.avatarEditor = ref;
                            }}
                            image={
                                this.props.newImage
                                    ? this.props.newImage.dataUrl
                                    : ''
                            }
                            border={50}
                            color={[0, 0, 0, 0.3]} // RGBA
                            scale={this.state.scale}
                            rotate={this.state.rotate}
                        />
                    </div>
                    <div className={classes.avatarCropperActions}>
                        <RotateLeftIcon
                            onClick={() => this.rotateImage(-90)}
                            style={{ color: 'black' }}
                            size="large"
                            name="undo"
                        />
                        <input
                            type="range"
                            step="0.1"
                            min="1"
                            max="4"
                            defaultValue={this.state.scale}
                            onChange={this.scaleImage}
                        />
                        <RotateRightIcon
                            name="repeat"
                            size="large"
                            onClick={() => this.rotateImage(90)}
                        />
                    </div>
                </div>

                {!hideButtons && (
                    <div style={{ marginTop: '1em' }}>
                        <Button
                            text="cancel"
                            color="grey"
                            size="medium"
                            right
                            onClick={this.handleCancel}
                        />

                        <Button
                            left
                            text="saveChanges"
                            size="medium"
                            onClick={this.handleSave}
                        />
                    </div>
                )}
            </div>
        );
    }
}
export default injectIntl(withStyles(styles)(FormUserAvatarEditor));
