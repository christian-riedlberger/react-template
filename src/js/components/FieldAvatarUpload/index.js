// @flow
import React, { Component } from 'react';
import { Field } from 'redux-form';
import _ from 'lodash';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import AvatarEditor from 'react-avatar-editor';

import CreateIcon from '@material-ui/icons/Create';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Dialog from 'components/Dialog';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { renderHiddenField } from 'constants/FormFields';
import messages from 'constants/Messages';

type DefaultProps = {
    name: string,
    label: string,
    input: Object,
    classes: Object,
    intl: intlShape,
    change: Function
};
type Props = {} & DefaultProps;

type State = {
    open: boolean,
    image: Object,
    scale: number,
    rotate: number,
    file: File
};

const styles = {
    avatarContainer: {
        display: 'flex'
    },
    image: props => ({
        width: props.imageWidth || '40px',
        height: props.imageHeight || '40px'
    }),
    buttonBlock: {
        position: 'relative',
        top: '-11px',
        '& label': {
            paddingBottom: '3px',
            cursor: 'pointer',
            '&:hover': {
                borderBottom: '1px solid #d5d3d3'
            }
        }
    },
    avatarButton: props => ({
        top: props.buttonTop,
        position: 'absolute',
        border: 'none',
        padding: '4px 6px',
        fontWeight: 'bold',
        color: '#515151',
        background: 'none',
        width: '10vw'
    }),
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
    },
    editIcon: {
        fontSize: '1.2em',
        position: 'relative',
        top: '2px'
    }
};

/**
 *  Field for redux form to upload an avatar
 *  @desc
 *  @author
 */
class FieldAvatarUpload extends Component<Props, State> {
    avatarEditor: AvatarEditor;

    constructor(props: Props) {
        super(props);

        this.state = {
            image: {
                url: '',
                name: ''
            },
            file: new File([], ''),
            open: false,
            scale: 1,
            rotate: 0
        };
    }

    // Lifecycle methods used to load avatar into component for editing from redux form
    componentDidMount() {
        const file = this.props.input.value;
        if (file) {
            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({
                file
            });
        }
    }

    componentDidUpdate = prevProps => {
        if (!_.isEqual(_.get(prevProps, 'input'), _.get(this.props, 'input')))
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                file: this.props.input.value
            });
    };

    handleSave = () => {
        const canvas = this.avatarEditor.getImage();

        // Set background color to white
        const context = canvas.getContext('2d');
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = 'rgba(255, 255, 255, 1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

        // Turn blob into file
        canvas.toBlob(blob => {
            const file = new File([blob], this.state.image.name);
            this.setState({
                file
            });
            this.props.change(this.props.input.name, file);
        }, 'image/jpeg');
        this.handleDialogClose();
    };

    handleDialogClose = () => {
        this.setState({
            open: false
        });
    };

    handleDialogOpen = () => {
        this.setState({
            open: true
        });
    };

    // Sets the selected image into state to be used in AvatarEditor component
    handleFileLoaded = (file: Object) => {
        this.setState({
            image: {
                url: file.dataUrl,
                name: file.name
            }
        });
        this.handleDialogOpen();
    };

    // Called when user selects file
    handleInputFile = (e: Object) => {
        const reader = new FileReader();
        const [file] = e.target.files;
        if (!file) return;

        reader.onload = (event: Object) => {
            this.handleFileLoaded({
                dataUrl: event.target.result,
                name: file.name
            });
        };
        reader.readAsDataURL(file);
    };

    // Helper function for AvatarEditor
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

    render() {
        const { classes, input, intl } = this.props;
        const { image, open, file } = this.state;
        const fileURL = file ? URL.createObjectURL(file) : null;

        return (
            <div>
                <Field {...input} component={renderHiddenField} />

                <div className={classes.avatarContainer}>
                    <div id="image" className={classes.imageContainer}>
                        {fileURL ? (
                            <Avatar src={fileURL} className={classes.image} />
                        ) : (
                            <a>
                                <AccountCircleIcon
                                    style={{
                                        color: '#bdc6d0'
                                    }}
                                    className={classes.image}
                                />
                            </a>
                        )}
                    </div>
                    <div className={classes.buttonBlock}>
                        <div
                            className={`upload-file-button ${classes.avatarButton}`}
                        >
                            <label
                                htmlFor="file-upload-input"
                                className="button custom-file-upload"
                            >
                                <CreateIcon className={classes.editIcon} />{' '}
                                <FormattedMessage
                                    {...messages.editAvatarTitle}
                                />
                            </label>
                            <input
                                id="file-upload-input"
                                type="file"
                                onChange={this.handleInputFile}
                                value=""
                                hidden
                            />
                        </div>
                    </div>
                </div>

                <Dialog
                    intl={intl}
                    open={open}
                    onClose={this.handleDialogClose}
                    onSave={this.handleSave}
                    style={{ zIndex: 9002 }}
                    title={intl.formatMessage(messages.modifyImage)}
                >
                    <div>
                        <div className="avatar-cropper">
                            <div className={classes.avatarCropperContainer}>
                                <AvatarEditor
                                    ref={ref => {
                                        this.avatarEditor = ref;
                                    }}
                                    image={image.url}
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
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(injectIntl(FieldAvatarUpload));
