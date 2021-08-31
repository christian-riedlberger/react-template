// @flow
import React, { useState } from 'react';
import type { Node } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import messages from 'constants/Messages';
import { renderChildren } from 'utils/render';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    label: string,
    children: Node,
    disabled?: boolean,
    initialValue?: boolean,
    nullOnHidden?: boolean,
    open?: boolean,
    onClick?: Function
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {
        padding: '0.3em 0em'
    },
    red: {
        color: `${theme.palette.error.dark} !important`
    },
    body: props => {
        if (props.isOpen)
            return {
                padding: '1em 0em',
                color: theme.palette.secondary.light
            };

        return {
            display: 'none'
        };
    }
}));

const CheckboxExpansion = ({
    intl,
    label,
    children,
    disabled,
    initialValue,
    nullOnHidden,
    open,
    onClick
}: Props) => {
    const stateOpen = useState(initialValue || false);
    const [isOpen, setExpansion]: [boolean, Function] =
        typeof open === 'boolean' && onClick
            ? [open, () => onClick()]
            : stateOpen;
    const classes = useStyles({ isOpen });

    return (
        <div className={classes.root}>
            <FormControlLabel
                control={
                    <Checkbox
                        value={isOpen}
                        disabled={disabled}
                        className={isOpen ? classes.red : null}
                    />
                }
                label={
                    messages[label]
                        ? intl.formatMessage(messages[label])
                        : label
                }
                checked={isOpen}
                onChange={() => setExpansion(val => !val)}
            />
            {(!nullOnHidden || isOpen) && (
                <div className={classes.body}>
                    {renderChildren(children, { isOpen })}
                </div>
            )}
        </div>
    );
};

export default injectIntl(CheckboxExpansion);
