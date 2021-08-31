// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import messages from 'constants/Messages';
import Typography from '@material-ui/core/Typography';
import TasksContainer from 'containers/TasksContainer';
import { log } from 'utils/logger';

type DefaultProps = {
    activeTask: Object,
    isLoadingPackage: boolean,
    fetchPackage: Function,
    packages: Array<Object>,
    classes: Object,
    intl: intlShape
};
type Props = {} & DefaultProps;

type State = {};

const styles = () => ({
    root: {},
    packages: {
        border: '1px solid #C5C5C5',
        borderRadius: '4px'
    },
    package: {
        padding: '1em',
        lineHeight: '1.5em',
        borderBottom: '1px solid #F4F4F4',
        '& span': {
            fontWeight: 400,
            display: 'block'
        },
        '&:last-child': {
            borderBottom: 0
        }
    },
    tools: {
        float: 'right',
        '& a': {
            color: '#8E8E8E',
            margin: '0 1em',
            display: 'inline-block'
        },
        '& clr-icon': {
            color: '#555454',
            paddingRight: '.4em'
        }
    }
});

/**
 *  Component
 *  @desc
 *  @author
 */

@TasksContainer()
class WorkflowPackage extends Component<Props, State> {
    componentDidMount() {
        const { activeTask } = this.props;

        log('MOUNT PACKAGE ID', 'yellow', activeTask);
        if (activeTask) this.props.fetchPackage(activeTask.packageId);
    }

    /**
     *  Render a package document
     */
    renderPackage = (document: Object) => {
        const { intl, classes } = this.props;

        const docLink = `/documents/details/${document.nodeRef.replace(
            'workspace://SpacesStore/',
            ''
        )}`;

        return (
            <div className={classes.package}>
                <div className={classes.tools}>
                    <a href={docLink} target="_blank">
                        <clr-icon shape="talk-bubbles" />{' '}
                        {document.commentCount}{' '}
                        {intl.formatMessage(messages.comments)}:
                    </a>
                    <a href={docLink} target="_blank">
                        <clr-icon shape="pop-out" />{' '}
                        {intl.formatMessage(messages.viewFile)}:
                    </a>
                </div>
                <span>{document.name}</span>
            </div>
        );
    };

    renderDocuments = (packages: Array<Object>) => {
        const { intl, classes, isLoadingPackage, activeTask } = this.props;
        const { packageId } = activeTask;

        // It's loading
        if (isLoadingPackage) return null;

        // Missing package
        if (!packageId)
            return (
                <div className={classes.packages}>
                    <div className={classes.package}>
                        <span>No package ID</span>
                    </div>
                </div>
            );

        // Empty package
        if (!packages || packages.length === 0)
            return (
                <div className={classes.packages}>
                    <div className={classes.package}>
                        <span>
                            {intl.formatMessage(messages.noAttachedDocuments)}
                        </span>
                    </div>
                </div>
            );

        return (
            <div className={classes.packages}>
                {_.map(packages, document => {
                    return this.renderPackage(document);
                })}
            </div>
        );
    };

    /**
     *  Render workflow package component
     */
    render() {
        const { intl, classes, packages, isLoadingPackage } = this.props;

        return (
            <div className={classes.root}>
                <Typography variant="subtitle1">
                    {intl.formatMessage(messages.attachedDocuments)}:
                </Typography>

                {isLoadingPackage && (
                    <div>{intl.formatMessage(messages.loading)}</div>
                )}

                {this.renderDocuments(packages)}
            </div>
        );
    }
}

export default withStyles(styles)(injectIntl(WorkflowPackage));
