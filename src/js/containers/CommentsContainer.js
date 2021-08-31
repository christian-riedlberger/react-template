// @flow
import _ from 'lodash';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import {
    fetchComments,
    createComment,
    clearUserComment
} from 'actions/ActionComments';

export type Args = {
    nodeRef?: string,
    omit?: Array<string>,
    comment?: string
};

const CommentsContainer = (args: Args) =>
    compose(
        connect(
            (store, parentProps) => {
                const props = {
                    comments: store.comments.comments,
                    totalComments: store.comments.totalComments,
                    permission: store.comments.permission,
                    isLoading: store.comments.isLoading || parentProps.isLoading
                };

                return args && args.omit ? _.omit(props, args.omit) : props;
            },
            {
                fetchComments,
                createComment,
                clearUserComment
            }
        ),
        lifecycle({
            componentDidMount() {
                if (args) {
                    if (args.nodeRef) {
                        if (args.comment)
                            this.props.createComment(
                                args.nodeRef,
                                args.comment
                            );
                        this.props.fetchComments(args.nodeRef);
                    }
                }
            }
        })
    );

export default CommentsContainer;
