// @flow
import _ from 'lodash';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import messages from 'constants/Messages';

import HelpIcon from '@material-ui/icons/Help';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

type DefaultProps = {
    intl: intlShape,
    className: string
};

type Props = {
    id: string
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {
        cursor: 'pointer',
        display: 'inline-block',
        position: 'relative',
        top: '4px'
    },
    icon: {
        fontSize: '1.5em',
        marginLeft: '4px'
    },
    message: {
        maxWidth: 200,
        padding: theme.spacing(2)
    },
    title: {
        color: '$menuColor',
        fontWeight: 400,
        marginBottom: '1em'
    },
    desc: {
        fontSize: '0.9em'
    }
}));

const TooltipLong = (props: Props) => {
    const { id, intl, className } = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);

    const titleMessage = messages[`${id}Title`];
    const descMessage = messages[`${id}Desc`];

    const title = _.isEmpty(titleMessage)
        ? `${titleMessage}Title`
        : intl.formatMessage(titleMessage);
    const desc = _.isEmpty(descMessage)
        ? `${descMessage}Desc`
        : intl.formatMessage(descMessage);

    return (
        <div className={`${classes.root} ${className}`}>
            <HelpIcon onClick={handleClick} className={classes.icon} />

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <div className={classes.message}>
                    <Typography className={classes.title}>{title}</Typography>
                    <Typography className={classes.desc}>{desc}</Typography>
                </div>
            </Popover>
        </div>
    );
};

export default injectIntl(TooltipLong);
