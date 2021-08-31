// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {
        fontSize: '14px',
        color: '#868686',
        marginBottom: '0.5em'
    },
    yellow: {
        display: 'inline-block',
        height: 10,
        width: 10,
        background: '#EDC937',
        borderRadius: '10em',
        marginLeft: '0.25em'
    }
});

/**
 * Workflow Status Title
 * @todo implement actual status from workflow
 * @param {*} param0
 */
const WorkflowStatusTitle = ({ intl }: Props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {intl.formatMessage(messages.status)} - in progress{' '}
            <span className={classes.yellow} />
        </div>
    );
};

export default injectIntl(WorkflowStatusTitle);
