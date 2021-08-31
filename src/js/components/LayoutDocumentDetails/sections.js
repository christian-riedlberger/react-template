import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Tooltip from '@material-ui/core/Tooltip';
import MenuActionsRepoFlat from 'components/MenuActionsRepoFlat';
import messages from 'constants/Messages';
import CollapsableLine from 'components/CollapsableLine';

/*
 *   Display header of document viewer
 *   Contains filename and when it was last edited
 */
export const renderHeader = (
    activeFile: Object,
    intl: Object,
    classes: Object,
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
            <div cy-data="fileName">
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
 *   Display sidebar section with document properties
 */
export const renderProperties = (activeFile: Object, classes: Object) => {
    return (
        <div className={classes.sidebarComponents}>
            <CollapsableLine
                title={<FormattedMessage {...messages.documentActions} />}
                isOpen
            >
                <MenuActionsRepoFlat
                    file={activeFile}
                    onSave={() => {
                        window.location.reload();
                    }}
                    actions={[
                        'edit',
                        'move',
                        'copy',
                        'delete',
                        'permissions',
                        'download'
                    ]}
                />
            </CollapsableLine>

            <CollapsableLine
                title={<FormattedMessage {...messages.documentProperties} />}
                isOpen
            >
                <div style={{ marginLeft: '1em', marginBottom: '1.5em' }}>
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
