// @flow
import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import prettyBytes from 'pretty-bytes';
import Dialog from 'components/Dialog';
import messages from 'constants/Messages';
import type { Node } from 'types/repoTypes';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    passRef: Function, // handles `ref={r => { this.dial = r; }}`
    intl: Function,
    node: Node // onEdit -> target folder
} & DefaultProps;

const useStyles = makeStyles({
    root: {},
    field: {
        paddingBottom: '1em'
    }
});

const DialogProperties = (props: Props) => {
    const { intl, node, passRef } = props;
    const classes = useStyles();
    if (!node) return null;

    moment().format('MMMM Do, YYYY');
    const nodeCreated = `${node.creator} on ${moment(node.created).format(
        'MMMM Do, YYYY'
    )}`;
    const nodeUpdated = `${node.modifier} on ${moment(node.modified).format(
        'MMMM Do, YYYY'
    )}`;

    return (
        <Dialog
            className={classes.root}
            intl={intl}
            ref={passRef}
            title={
                node
                    ? intl.formatMessage(messages.propertiesName, {
                        name: node.name
                    })
                    : intl.formatMessage(messages.newFolder)
            }
            hideSave
        >
            <div className={classes.field}>
                {intl.formatMessage(messages.propertiesCreated, {
                    created: nodeCreated
                })}
            </div>
            <div className={classes.field}>
                {intl.formatMessage(messages.propertiesUpdated, {
                    updated: nodeUpdated
                })}
            </div>
            {node.size && node.type === 'cm:content' ? (
                <div className={classes.field}>
                    {intl.formatMessage(messages.propertiesFileSize, {
                        fileSize: prettyBytes(node.size)
                    })}
                </div>
            ) : null}
            <div className={classes.field}>
                {intl.formatMessage(messages.propertiesDescription, {
                    description: node.description
                })}
            </div>
        </Dialog>
    );
};

export default injectIntl(connect()(DialogProperties));
