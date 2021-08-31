// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

import CommentsContainer from 'containers/CommentsContainer';
import * as gfTheme from 'constants/Theme';
import { AVATAR } from 'constants/ServiceURI';

type DefaultProps = {
    classes: Object,
    fetchComments: Function,
    nodeRef: string
};
type Props = {
    comments: Array<Object>
} & DefaultProps;

type State = {
    comments: Array<Object>
};

const styles = () => ({
    root: {
        width: '100%',
        maxHeight: '20vh',
        overflowY: 'scroll',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
        }
    },
    inlineCommenter: {
        display: 'inline',
        color: gfTheme.textblack,
        fontSize: '1rem'
    },
    inlineDate: {
        display: 'inline',
        color: gfTheme.hue4,
        fontSize: '0.8rem',
        marginLeft: '1em'
    },
    content: {
        color: gfTheme.textblack,
        fontSize: '1rem',
        clear: 'both',
        display: 'inline-block',
        width: '100%'
    }
});

class ListComments extends Component<Props, State> {
    componentDidMount() {
        this.initializeComments();
    }

    componentDidUpdate = prevProps => {
        if (
            !_.isEqual(
                _.get(prevProps, 'nodeRef'),
                _.get(this.props, 'nodeRef')
            )
        )
            this.initializeComments();
    };

    initializeComments = () => {
        const { nodeRef, fetchComments } = this.props;
        if (nodeRef) fetchComments(nodeRef);
    };

    renderComments = commentsArr => {
        const { classes } = this.props;
        return _.map(commentsArr, (comment, i) => {
            return (
                <ListItem
                    alignItems="flex-start"
                    component="div"
                    key={`comment-${i}`}
                >
                    <ListItemAvatar>
                        <Avatar
                            className={classes.avatar}
                            src={AVATAR(comment.author.username)}
                            alt={`${comment.author.firstName} ${comment.author.lastName}`}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={comment.author.userName}
                        className={classes.primaryText}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    className={classes.inlineCommenter}
                                >
                                    {`${comment.author.firstName} ${comment.author.lastName}`}
                                </Typography>
                                <Typography
                                    component="span"
                                    className={classes.inlineDate}
                                >
                                    {moment(comment.createdOn).format('LLLL')}
                                </Typography>
                                <span className={classes.content}>
                                    {comment.content}
                                </span>
                            </React.Fragment>
                        }
                    />
                </ListItem>
            );
        });
    };

    render() {
        const { classes, comments } = this.props;
        return (
            <div className={clsx(classes.root, 'cy-comments')}>
                <List>{this.renderComments(comments)}</List>
            </div>
        );
    }
}

export default withStyles(styles)(
    CommentsContainer({})(injectIntl(ListComments))
);
