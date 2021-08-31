// @flow
import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { Field } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { injectIntl, intlShape } from 'react-intl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import clsx from 'clsx';

import { renderHiddenField } from 'constants/FormFields';
import DialogDocumentPicker from 'components/DialogDocumentPicker';
import Button from 'components/Button';
import messages from 'constants/Messages';
import { grey1, green } from 'constants/Theme';

type DefaultProps = {
    name: string,
    label: string,
    input: {
        value: any,
        onChange: Function
    },
    meta: { touched: boolean, error: string },
    classes: Object,
    intl: intlShape,
    documentPicker?: boolean,
    multiple: boolean
};
type Props = {
    fullWidth?: boolean,
    nodeRef?: string, // target upload and search
    parentRef?: string
} & DefaultProps;

type State = {
    files: Array<File | { name: string, nodeRef: string, serverSide: true }>,
    uploadedFiles: Array<File>,
    selectedFiles: Array<{ name: string, nodeRef: string }>,
    hoveredIndex: number
};

const styles = theme => ({
    root: {},
    input: {
        display: 'none'
    },
    divider: {
        padding: '2em 0 2em 0',
        '& span,div': {
            color: grey1
        }
    },
    dividerLine: props => ({
        width: props.fullWidth ? '27%' : '11%'
    }),
    errorDividerLine: {
        '& hr': {
            backgroundColor: theme.palette.error.dark
        }
    },
    errorDividerText: {
        '& span': {
            color: theme.palette.error.dark
        }
    },
    right: {},
    iconSelect: {
        color: green
    }
});

/**
 *  Component
 *  @desc
 *  @author
 */
@injectIntl
@withStyles(styles)
class FieldFileUpload extends Component<Props, State> {
    dialog: DialogDocumentPicker;

    constructor(props: Props) {
        super(props);
        this.state = {
            files: [],
            uploadedFiles: [],
            selectedFiles: [],
            hoveredIndex: 0
        };
    }

    handleFileUpload = (e: Object) => {
        const { multiple } = this.props;
        const uploadedFiles = _.values(e.target.files);

        if (!multiple) {
            this.setState({ uploadedFiles }, () => {
                this.props.input.onChange(
                    _.pick(this.state, 'selectedFiles', 'uploadedFiles')
                );
            });
        } else {
            this.setState(
                {
                    uploadedFiles: _.concat(
                        this.state.uploadedFiles,
                        uploadedFiles
                    )
                },
                () => {
                    this.props.input.onChange(
                        _.pick(this.state, 'selectedFiles', 'uploadedFiles')
                    );
                }
            );
        }
    };

    handleDialogOpen = () => {
        this.dialog.open();
    };

    handleFileSelect = (files: Array<File>) => {
        const newFiles = _.filter(files, file => {
            return !file.disabled;
        });
        const allFiles = _.concat(
            this.state.selectedFiles,
            _.map(newFiles, file => _.pick(file, 'nodeRef', 'name'))
        );
        this.setState({ selectedFiles: allFiles }, () => {
            this.dialog.close();
            this.props.input.onChange(
                _.pick(this.state, 'selectedFiles', 'uploadedFiles')
            );
        });
    };

    handleSelectedRemove = (removedFile: File, index: Number) => {
        const {
            input: { onChange }
        } = this.props;
        const newFiles = _.values(_.omit(this.state.selectedFiles, index));
        this.setState(
            {
                selectedFiles: newFiles
            },
            () => onChange(_.pick(this.state, 'selectedFiles', 'uploadedFiles'))
        );
    };

    handleUploadedRemove = (removedFile: File, index: Number) => {
        const {
            input: { onChange }
        } = this.props;
        const newFiles = _.values(_.omit(this.state.uploadedFiles, index));
        this.setState(
            {
                uploadedFiles: newFiles
            },
            () => onChange(_.pick(this.state, 'selectedFiles', 'uploadedFiles'))
        );
    };

    handleEnter = (index: number) => {
        this.setState({ hoveredIndex: index });
    };

    handleLeave = () => {
        this.setState({ hoveredIndex: 0 });
    };

    renderSelected = () => {
        const { uploadedFiles, selectedFiles, hoveredIndex } = this.state;

        const {
            intl,
            classes,
            meta: { touched, error }
        } = this.props;

        return (
            <Fragment>
                <Grid
                    container
                    item
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                    className={clsx(
                        classes.divider,
                        touched && error && classes.errorDividerLine
                    )}
                >
                    <Divider className={classes.dividerLine} />
                    <Grid item>
                        <div
                            className={clsx(
                                touched && error && classes.errorDividerText
                            )}
                        >
                            {touched && error ? (
                                <span>{error}</span>
                            ) : (
                                intl.formatMessage(messages.filesSelected, {
                                    count:
                                        uploadedFiles.length +
                                        selectedFiles.length
                                })
                            )}
                        </div>
                    </Grid>
                    <Divider className={classes.dividerLine} />
                </Grid>
                <List>
                    {_.map(uploadedFiles, (file, index) => (
                        <ListItem
                            key={file.name}
                            button
                            onMouseEnter={() => this.handleEnter(index)}
                            onMouseLeave={() => this.handleLeave()}
                            className={classes.selectedGroupsList}
                        >
                            <ListItemText primary={file.name} />
                            <ListItemIcon
                                className={classes.icon}
                                onClick={() =>
                                    this.handleUploadedRemove(file, index)
                                }
                            >
                                <CancelOutlinedIcon
                                    className={clsx(
                                        index === hoveredIndex &&
                                            classes.iconSelect
                                    )}
                                />
                            </ListItemIcon>
                        </ListItem>
                    ))}
                    {_.map(selectedFiles, (file, index) => (
                        <ListItem
                            key={file.name}
                            button
                            onClick={() =>
                                this.handleSelectedRemove(file, index)
                            }
                            onMouseEnter={() =>
                                this.handleEnter(uploadedFiles.length + index)
                            }
                            onMouseLeave={() => this.handleLeave()}
                            className={classes.selectedGroupsList}
                        >
                            <ListItemText primary={file.name} />
                            <ListItemIcon className={classes.icon}>
                                <CancelOutlinedIcon
                                    className={clsx(
                                        uploadedFiles.length + index ===
                                            hoveredIndex && classes.iconSelect
                                    )}
                                />
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            </Fragment>
        );
    };

    /**
     *  Default render
     */
    render() {
        const {
            input,
            label,
            classes,
            documentPicker,
            multiple,
            parentRef
        } = this.props;

        const { selectedFiles } = this.state;

        return (
            <div>
                <Fragment>
                    <Grid container>
                        <Field {...input} component={renderHiddenField} />
                        <Grid item xs={12} className="align-center">
                            <input
                                className={classes.input}
                                onChange={e => this.handleFileUpload(e)}
                                id="button-file"
                                multiple={multiple}
                                type="file"
                            />
                            <label htmlFor="button-file">
                                <Button
                                    component="span"
                                    id="button-file"
                                    text="uploadFile"
                                    size="medium"
                                    color="blue"
                                />
                            </label>
                            {documentPicker && (
                                <Button
                                    className={classes.right}
                                    onClick={this.handleDialogOpen}
                                    color="grey"
                                    size="medium"
                                    text="selectFile"
                                />
                            )}
                        </Grid>
                    </Grid>

                    {this.renderSelected()}
                </Fragment>
                {documentPicker && (
                    // $FlowFixMe
                    <DialogDocumentPicker
                        passRef={ref => {
                            this.dialog = ref;
                        }}
                        defaultValues={selectedFiles}
                        // $FlowFixMe
                        onClose={this.handleFileSelect}
                        parentRef={parentRef}
                    />
                )}
            </div>
        );
    }
}

export default FieldFileUpload;
