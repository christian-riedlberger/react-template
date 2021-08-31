// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Field, reduxForm, Form } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withSnackbar } from 'notistack';
import type { Node } from 'react';

import { renderMultiLineTextField } from 'constants/FormFields';
import CommentsContainer from 'containers/CommentsContainer';
import Button from 'components/Button';
import messages from 'constants/Messages';
import Loading from 'components/Loading';
import { SNACK_DELAY } from 'constants/Config';

type DefaultProps = {
    classes: Object,
    createComment: Function,
    clearUserComment: Function,
    fetchComments: Function,
    nodeRef: string,
    formValues: Object,
    activeFile: Object,
    handleSubmit: Function,
    enqueueSnackbar: (Node, Object) => string,
    closeSnackbar: string => void,
    intl: intlShape
};
type Props = {} & DefaultProps;

type State = {
    isSubmitting: boolean
};

const styles = () => ({
    root: {},
    inputContainer: {
        paddingTop: '2em'
    },
    buttonContainer: {
        padding: '2em 0'
    }
});

export const formName = 'formComments';

@CommentsContainer({})
@withStyles(styles)
@withSnackbar
@reduxForm({
    form: formName,
    enableReinitialize: true
})
@connect(store => ({
    formValues: _.get(store, `form.${formName}.values`, null),
    activeFile: _.get(store, `repo.activeFile`, null)
}))
@injectIntl
class FormComment extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isSubmitting: false
        };
    }

    // Add a comment
    onSubmit = () => {
        const {
            formValues,
            createComment,
            nodeRef,
            fetchComments,
            clearUserComment,
            enqueueSnackbar,
            closeSnackbar,
            intl
        } = this.props;

        const key = enqueueSnackbar(
            intl.formatMessage(messages.submittingComment),
            {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                },
                persist: true,
                action: () => <Loading height={20} />
            }
        );

        const pid = setInterval(() => {
            // prevent stale state by referencing `this`
            if (!this.state.isSubmitting) {
                closeSnackbar(key);
                clearInterval(pid);
            }
        }, SNACK_DELAY); // show fow at least a second before hidding

        this.setState({ isSubmitting: true }, () => {
            createComment(nodeRef, formValues.comment)
                .then(() => {
                    return fetchComments(nodeRef, true);
                })
                .then(() => {
                    clearUserComment();
                    return this.setState({ isSubmitting: false });
                })
                .catch(e => {
                    throw e;
                });
        });
    };

    render() {
        const { classes, handleSubmit, activeFile, formValues } = this.props;
        const { isSubmitting } = this.state;
        if (
            !activeFile ||
            !activeFile.permission ||
            !activeFile.permission.comment
        )
            return null;

        return (
            <Form onSubmit={handleSubmit(this.onSubmit)} autoComplete="off">
                <Grid item xs={12} className={classes.inputContainer}>
                    <Field
                        name="comment"
                        component={renderMultiLineTextField}
                        className={classes.textField}
                        label="Comment"
                        fullWidth
                        data-cy="comment"
                    />
                </Grid>
                <Grid item xs={12} className={classes.buttonContainer}>
                    <Button
                        text="addComment"
                        color="grey"
                        size="medium"
                        type="submit"
                        disabled={
                            _.get(formValues, 'comment.length', 0) === 0 ||
                            isSubmitting
                        }
                        data-cy="addComment"
                    />
                </Grid>
            </Form>
        );
    }
}

export default FormComment;
