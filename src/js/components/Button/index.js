// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import clsx from 'clsx';
import { Button as MuiButton } from '@material-ui/core';
// import { shadeColor } from 'utils/color';

import messages from 'constants/Messages';
import * as theme from 'constants/Theme';

type DefaultProps = {
    intl: intlShape
};
type Props = {
    text: string,
    color: 'grey' | 'grey0' | 'blue' | 'orange' | 'blueOutline',
    icon?: any,
    iconPosition?: string,
    round?: boolean,
    size: 'micro' | 'small' | 'medium',
    type?: string,
    disabled: boolean,
    onClick: Function,
    component?: string | Function,
    className?: string
} & DefaultProps;

const styles = {
    button: {
        backgroundColor: theme.green,
        color: '#FFF',
        boxShadow: 'none',
        borderRadius: '2px',
        fontFamily: 'Roboto',
        fontWeight: 300,
        fontSize: '1.3em',
        padding: '.5em 2.23em',
        textTransform: 'initial',
        margin: '0 .75em'
    },
    grey: {
        backgroundColor: theme.hue4,
        color: '#FFF'
    },
    grey0: {
        backgroundColor: theme.hue3,
        color: '#FFF'
    },
    blue: {
        backgroundColor: theme.blue,
        color: '#FFF'
    },
    orange: {
        backgroundColor: theme.orange,
        color: '#FFF'
    },
    blueOutline: {
        backgroundColor: '#FFFFFF',
        border: `1px solid ${theme.blue}`,
        color: theme.blue
    },
    outline: {
        backgroundColor: '#FFFFFF',
        border: `1px solid ${theme.green}`,
        color: theme.green
    },
    disabled: {
        backgroundColor: theme.hue4,
        opacity: 0.5
    },
    round: {
        borderRadius: '10em',
        padding: '0.1em 2.02em'
    },
    micro: {
        fontSize: '0.8em',
        padding: '0em 0em',
        fontWeight: 400
    },
    small: {
        fontSize: '0.93em',
        padding: '0.1em 1.02em',
        fontWeight: 400
    },
    medium: {
        fontSize: '1.07em',
        padding: '0.36em 1.95em'
    },
    iconLeft: {
        height: '1.5em',
        marginTop: '-.5em',
        marginRight: '.4em',
        marginLeft: '-.4em'
    },
    iconRight: {
        height: '1.5em',
        marginTop: '-.5em',
        marginLeft: '.5em'
    }
};

/**
 * Avatar
 * @param {*} props
 */
const Button = ({
    text,
    // $FlowFixMe
    color,
    onClick,
    // $FlowFixMe
    round,
    size,
    icon,
    iconPosition,
    disabled,
    intl,
    type,
    component,
    className
}: Props) => {
    const iconLeft =
        icon && iconPosition === 'left' ? (
            <span style={styles.iconLeft}>{icon}</span>
        ) : (
            ''
        );
    const iconRight =
        icon && iconPosition === 'right' ? (
            <span style={styles.iconRight}>{icon}</span>
        ) : (
            ''
        );

    return (
        <MuiButton
            data-cy={text}
            variant="contained"
            onClick={onClick}
            disabled={disabled}
            component={component || undefined}
            type={type}
            style={{
                ...styles.button,
                ...(color === 'blue' ? styles.blue : {}),
                ...(color === 'grey' ? styles.grey : {}),
                ...(color === 'orange' ? styles.orange : {}),
                ...(color === 'grey0' ? styles.grey0 : {}),
                ...(color === 'outline' ? styles.outline : {}),
                ...(color === 'blueOutline' && styles.blueOutline),
                ...(size === 'medium' && styles.medium),
                ...(size === 'small' && styles.small),
                ...(size === 'micro' && styles.micro),
                ...(round && styles.round),
                ...(disabled ? styles.disabled : {})
            }}
            className={clsx(className)}
        >
            {iconLeft}
            {messages[text] ? intl.formatMessage(messages[text]) : `${text}`}
            {iconRight}
        </MuiButton>
    );
};

export default injectIntl(Button);
