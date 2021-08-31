import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';

import messages from 'constants/Messages';
import { requestTypeOptions } from 'constants/Options';

import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import CollapsableLine from 'components/CollapsableLine';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AvatarUserPopover from 'components/AvatarUserPopover';
import AvatarOrgPopover from 'components/AvatarOrgPopover';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Tooltip from '@material-ui/core/Tooltip';

/*
 *   Display header of document viewer
 *   Contains filename and when it was last edited
 */
export const renderHeader = (
    activeFile: Object,
    classes: Object,
    intl: Object,
    handleBackClick: Function
) => {
    return (
        <div className={clsx(classes.header, 'cy-header')}>
            <Tooltip
                placement="bottom-end"
                title={intl.formatMessage(messages.back)}
            >
                <Button
                    className={classes.backButton}
                    variant="contained"
                    component="span"
                    onClick={handleBackClick}
                >
                    <ChevronLeftIcon />
                </Button>
            </Tooltip>
            <div>
                <Typography className={classes.docName}>
                    {activeFile.name}
                </Typography>
                <Typography className={classes.editDetails}>
                    {intl.formatMessage(messages.lastEdit, {
                        date: moment(activeFile.modified).format('LLL'),
                        user: activeFile.modifier
                    })}
                </Typography>
            </div>
        </div>
    );
};

/*
 *   Render the Issueing organization section with
 */
export const renderIssueingOrg = (activeTask: Object, classes: Object) => {
    if (!activeTask) return null;
    return (
        <div className={classes.sidebarComponents}>
            <CollapsableLine
                title={<FormattedMessage {...messages.issuingDetails} />}
                isOpen
            >
                <div
                    style={{
                        marginLeft: '1em',
                        marginTop: '-1em',
                        marginBottom: '-1em'
                    }}
                >
                    <List className={classes.list}>
                        <ListItem>
                            <ListItemAvatar>
                                <AvatarUserPopover
                                    avatarName={activeTask.initiatorUsername}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${activeTask.initiatorFirstName} ${activeTask.initiatorLastName}`}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {activeTask.initiatorUsername}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        {activeTask.issuingEntity && (
                            <ListItem>
                                <ListItemAvatar>
                                    <AvatarOrgPopover
                                        shortName={activeTask.issuingEntity}
                                        initiator={activeTask.initiator}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={activeTask.issuingEntity}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >
                                                {activeTask.issuingEntity}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        )}
                    </List>
                </div>
            </CollapsableLine>
        </div>
    );
};

/*
 *   Render document properties section for the sidebar
 */
export const renderDocumentDetails = (activeFile: Object, classes: Object) => {
    return (
        <div className={classes.sidebarComponents}>
            <CollapsableLine
                title={<FormattedMessage {...messages.documentDetails} />}
                isOpen
            >
                <div style={{ marginLeft: '1em' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography className={classes.label}>
                                <FormattedMessage {...messages.name} />
                            </Typography>
                            <Typography className={classes.prop}>
                                {activeFile.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography className={classes.label}>
                                <FormattedMessage {...messages.creator} />
                            </Typography>
                            <Typography className={classes.prop}>
                                {activeFile.creator}
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography className={classes.label}>
                                <FormattedMessage {...messages.created} />
                            </Typography>
                            <Typography className={classes.prop}>
                                {moment(activeFile.created).format('LLL')}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography className={classes.label}>
                                <FormattedMessage {...messages.modifier} />
                            </Typography>
                            <Typography className={classes.prop}>
                                {activeFile.modifier}
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography className={classes.label}>
                                <FormattedMessage {...messages.modified} />
                            </Typography>
                            <Typography className={classes.prop}>
                                {moment(activeFile.modified).format('LLL')}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </CollapsableLine>
        </div>
    );
};

/*
 *   Render workflow details for the sidebar
 */
export const renderWorkflowDetails = (activeTask: Object, classes: Object) => {
    const prop = _.find(requestTypeOptions, r => {
        if (r.value === activeTask.processId) {
            return r.text;
        }
    });

    return (
        <div className={classes.sidebarComponents}>
            <CollapsableLine
                title={<FormattedMessage {...messages.workflowDetails} />}
                isOpen
            >
                <div style={{ marginLeft: '1em' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography className={classes.label}>
                                <FormattedMessage {...messages.workflowType} />
                            </Typography>
                            <Typography className={classes.prop}>
                                {prop && prop.text ? (
                                    <FormattedMessage
                                        {...messages[prop.text]}
                                    />
                                ) : (
                                    '*!*!Depreciated Value!*!*'
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className={classes.label}>
                                <FormattedMessage
                                    {...messages.workflowAssigned}
                                />
                            </Typography>
                            <Typography className={classes.prop}>
                                {moment(activeTask.start).format('LLL')}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className={classes.label}>
                                <FormattedMessage {...messages.workflowDue} />
                            </Typography>
                            <Typography className={classes.prop}>
                                {moment(activeTask.due).format('LLL')}
                            </Typography>
                        </Grid>
                        {activeTask.details && (
                            <Grid item xs={12}>
                                <Typography className={classes.label}>
                                    <FormattedMessage
                                        {...messages.workflowDescription}
                                    />
                                </Typography>
                                <Typography className={classes.prop}>
                                    {activeTask.details}
                                </Typography>
                            </Grid>
                        )}
                        {activeTask.additionalInfo && (
                            <Grid item xs={12}>
                                <Typography className={classes.label}>
                                    <FormattedMessage
                                        {...messages.workflowAdditionalInfo}
                                    />
                                </Typography>
                                <Typography className={classes.prop}>
                                    {activeTask.additionalInfo}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </div>
            </CollapsableLine>
        </div>
    );
};
