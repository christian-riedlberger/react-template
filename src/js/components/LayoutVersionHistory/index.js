// @flow
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import DialogNewVersion from 'components/DialogNewVersion';
import Button from 'components/Button';
import CollapsableLine from 'components/CollapsableLine';
import ListVersionHistory from 'components/ListVersionHistory';
import Permission from 'components/Permission';
import messages from 'constants/Messages';

type DefaultProps = { intl: intlShape, classes: Object };

type Props = {
    activeFile: Object,
    nodeRef: string,
    isReadOnly: boolean,
    intl: intlShape
} & DefaultProps;

type State = {
    open: boolean
};

const styles = {
    root: {
        '& .MuiTypography-body1': {
            fontSize: '1em'
        }
    },
    dialog: {},
    header: {
        display: 'flex',
        flexFlow: 'row nowrap',
        flex: '1 100%',
        justifyContent: 'space-between',
        paddingBottom: '1em'
    },
    title: {
        fontSize: '20px',
        display: 'inline',
        marginLeft: '10px',
        position: 'relative',
        top: '15px'
    },
    paper: {
        width: 'auto'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto'
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    uploadButton: {
        verticalAlign: 'middle'
    }
};

@withStyles(styles)
class LayoutVersionHistory extends Component<Props, State> {
    state = {
        open: false
    };

    handleCloseDialog = () => {
        this.setState(state => {
            return {
                ...state,
                open: false
            };
        });
    };

    handleOnclick = () => {
        this.setState(state => {
            return {
                ...state,
                open: true
            };
        });
    };

    render() {
        const { intl, classes, isReadOnly, nodeRef, activeFile } = this.props;
        const { open } = this.state;

        return (
            <div>
                <div className={classes.root}>
                    <div className={classes.container}>
                        {/* $FlowFixMe */}
                        <CollapsableLine
                            title={intl.formatMessage(messages.historyTitle)}
                            button={
                                !isReadOnly && (
                                    <Permission
                                        permission={activeFile.permission}
                                        access="write"
                                    >
                                        <Button
                                            text="uploadNewVersion"
                                            size="micro"
                                            round
                                            onClick={this.handleOnclick}
                                            className={classes.uploadButton}
                                        />
                                    </Permission>
                                )
                            }
                            isOpen
                        >
                            <ListVersionHistory nodeRef={nodeRef} />
                        </CollapsableLine>
                    </div>
                </div>
                {open === true && (
                    <DialogNewVersion
                        intl={intl}
                        onClose={this.handleCloseDialog}
                        classes={classes}
                        nodeRef={nodeRef}
                        open
                    />
                )}
            </div>
        );
    }
}
export default injectIntl(LayoutVersionHistory);
