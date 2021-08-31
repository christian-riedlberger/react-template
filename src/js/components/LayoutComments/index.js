// @flow

import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ListComments from 'components/ListComments';
import FormComment from 'components/FormComment';

type Props = {
    nodeRef: string,
    intl: intlShape
};

const styles = makeStyles({
    listComments: {
        overflowY: 'auto'
    },
    addComment: {
        paddingBottom: '2em'
    },
    root: {
        padding: '2em 1.6em 2em 2em'
    },
    header: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        flex: '1 100%',
        justifyContent: 'space-between',
        paddingBottom: '1em'
    },
    lineWrapper: {
        flexGrow: '1',
        position: 'relative',
        top: '-3px',
        marginLeft: '2em'
    },
    line: {
        background: '#BAC5D0',
        display: 'inline-block',
        width: '100%',
        height: '1px'
    },
    title: {
        fontSize: '20px',
        display: 'inline'
    }
});

const LayoutComments = (props: Props) => {
    const { nodeRef, intl } = props;
    const classes = styles();

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.title}>
                    <div className="customTitle">
                        {intl.formatMessage(messages.commentHeader)}
                    </div>
                </div>
                <div className={classes.lineWrapper}>
                    <div className={classes.line} />
                </div>
            </div>

            <Grid container>
                <Grid item xs={12} className={classes.listComments}>
                    <ListComments nodeRef={nodeRef} />
                </Grid>
            </Grid>
            <Grid container className={classes.addComment}>
                <Grid item xs={12}>
                    <FormComment nodeRef={nodeRef} />
                </Grid>
            </Grid>
        </div>
    );
};

export default injectIntl(LayoutComments);
