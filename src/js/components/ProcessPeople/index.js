// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';

import { grey0 } from 'constants/Theme';
import AvatarOrgPopover from 'components/AvatarOrgPopover';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    task: {
        entity: string,
        issuingEntity: string,
        initiator: string
    },
    className?: string
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        padding: '1em',
        backgroundColor: 'white',
        color: '#f7f7f7',
        fontSize: '1em',
        '& hr': {
            backgroundColor: grey0,
            margin: '.5em 0'
        },
        '& p': {
            paddingBottom: '0'
        }
    },
    inline: {
        display: 'inline'
    },
    displayName: {
        fontSize: '1.4em',
        padding: '0'
    },
    list: {
        padding: '3px 0px',
        color: '#65676b'
    },
    avatar: {
        boxShadow: '0px 0px 2px #ccc'
    },
    headers: {
        marginBottom: '0px !important'
    }
});

// eslint-disable-next-line no-unused-vars
const ProcessPeople = (props: Props) => {
    const { task, className, intl } = props;
    const classes = useStyles();

    if (!task) return <div>{intl.formatMessage(messages.loading)}</div>;

    const { entity, issuingEntity, initiator } = task;
    return (
        <div className={clsx(className, classes.root)}>
            <List className={classes.list}>
                <ListItem>
                    <Typography
                        variant="subtitle1"
                        component="h6"
                        className={classes.headers}
                    >
                        {`${intl.formatMessage(messages.customer)}:`}
                    </Typography>
                </ListItem>
                <ListItem>
                    <AvatarOrgPopover
                        showName
                        disablePopover
                        orgLabel={initiator}
                        shortName={issuingEntity}
                    />
                </ListItem>
                <ListItem>
                    <Typography
                        variant="subtitle1"
                        component="h6"
                        className={classes.headers}
                    >
                        {`${intl.formatMessage(messages.assignedTo)}:`}
                    </Typography>
                </ListItem>
                <ListItem>
                    <AvatarOrgPopover
                        disablePopover
                        showName
                        orgLabel={intl.formatMessage(messages.organization)}
                        shortName={entity}
                    />
                </ListItem>
            </List>
        </div>
    );
};

export default injectIntl(ProcessPeople);
