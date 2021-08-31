import React, { useState } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { withRouter, Route } from 'react-router';
import _ from 'lodash';
import { compose } from 'recompose';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps } from 'containers/RepoContainer';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import TimeAgo from 'components/TimeAgo';

import messages from 'constants/Messages';
import { fileExtension } from 'utils/string';
import { hasThumbnail } from 'utils/mimetype';
import { DOCUMENT_THUMBNAIL_API } from 'constants/ServiceURI';

type DefaultProps = {
    intl: intlShape,
    router: Route,
    fetchDocument: Function
} & ContainerProps;

type Props = {
    recentDocuments: Array<Object>,
    cardMedia: Component,
    primaryText: string,
    secondaryText: String,
    onClick: Function
} & DefaultProps;

const useStyles = makeStyles({
    recentContainer: {
        paddingLeft: '1.5em'
    },
    cardContainer: {
        '& .MuiPaper-root': {
            borderRadius: '.75em',
            boxShadow: 'none!important',
            border: '1px solid #D9D9D9'
        }
    },
    cardTitle: {
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontSize: '1em!important',
        fontWeight: '400!important',
        marginBottom: '2px!important'
    },
    updatedTitle: {
        fontSize: '11px',
        color: '#898A8D'
    },
    cardContent: {
        backgroundColor: 'whitesmoke',
        padding: '16px 16px 0'
    },
    cardText: {
        background: '#fff',
        borderTop: '1px solid #D9D9D9'
    },
    icon: {
        height: '5.8em',
        overflow: 'hidden',
        paddingBottom: '16px',
        '& .MuiAvatar-root': {
            paddingTop: '1.5em',
            textAlign: 'center',
            margin: '0 auto'
        },
        '& .MuiAvatar-img': {
            background: 'none!important'
        }
    },
    thumbnail: {
        background: '#fff',
        height: '7em',
        overflow: 'hidden',
        boxShadow: '0px 0px 6px 1px #33333329',
        '& img': {
            width: '100%'
        }
    },
    smallIcon: {
        width: '13px',
        marginRight: '7px',
        position: 'relative',
        top: '2px'
    }
});

const QuickAccessCard = (props: Props) => {
    const classes = useStyles();
    const { onClick, cardMedia, primaryText } = props;

    return (
        <div className={classes.cardContainer}>
            <Card className={classes.card}>
                <CardActionArea onClick={onClick}>
                    <CardContent className={classes.cardContent}>
                        {cardMedia}
                    </CardContent>
                    <CardContent className={classes.cardText}>
                        <Typography
                            className={classes.cardTitle}
                            gutterBottom
                            variant="h5"
                            component="h2"
                        >
                            {primaryText}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
};

const QuickAccessList = (props: Props) => {
    const classes = useStyles();
    const { recentTasks, intl, router } = props;
    const [thumbnails, setThumbnails] = useState({});

    /**
     * Goto document details page
     */
    const handleClick = task => {
        router.push(`${task.url}`);
    };

    /**
     *
     * @param {Object} task Document in recentDocument array we want to render thumbnail for
     * @param {string} src Thumbnail image source (if the document can't render alfresco preview image)
     */
    const CardMedia = (task, src) => {
        // Use Alfresco preview
        if (hasThumbnail(task.mimetype)) {
            return thumbnails[task.nodeRef];
        }

        // default renders file type icon
        return (
            <div className={classes.icon}>
                <Avatar
                    className={classes.cardMedia}
                    src={src}
                    alt={`${task.name}`}
                    variant="square"
                >
                    F
                </Avatar>
            </div>
        );
    };

    if (!recentTasks) return null;

    return (
        <div>
            <div className={classes.recentContainer}>
                {recentTasks.length > 0 && (
                    <Typography style={{ marginBottom: '1em' }}>
                        {intl.formatMessage(messages.quickAccess)}
                    </Typography>
                )}

                <Grid container spacing={3}>
                    {_.map(recentTasks, task => {
                        const fileTypeIcon = `/css/img/mimetypes/${fileExtension(
                            task.name
                        )}.svg`;
                        if (!thumbnails[task.nodeRef]) {
                            if (hasThumbnail(task.mimetype)) {
                                const newThumbnails = {
                                    ...thumbnails
                                };
                                newThumbnails[task.nodeRef] = (
                                    <div className={classes.thumbnail}>
                                        <img
                                            src={DOCUMENT_THUMBNAIL_API(
                                                task.nodeRef,
                                                Date.now()
                                            )}
                                            alt={task.name}
                                        />
                                    </div>
                                );
                                setThumbnails(newThumbnails);
                            }
                        }
                        return (
                            <Grid item xs={2}>
                                <QuickAccessCard
                                    onClick={() => handleClick(task)}
                                    cardMedia={CardMedia(task, fileTypeIcon)}
                                    fileTypeIcon={fileTypeIcon}
                                    primaryText={task.name}
                                    secondaryText={
                                        <div>
                                            {task.modifier}{' '}
                                            {intl.formatMessage(
                                                messages.updated
                                            )}{' '}
                                            <TimeAgo date={task.modified} />
                                        </div>
                                    }
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
        </div>
    );
};

export default compose(
    injectIntl,
    RepoContainer({}),
    withRouter
)(QuickAccessList);
