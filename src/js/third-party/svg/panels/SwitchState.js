import React from 'react';
import Radium from 'radium';
import Icon from '../Icon';

const SwitchState = (props) => {
    const selected = props.value !== props.defaultValue;
    const newValue = selected ? props.defaultValue : props.nextState;
    return (
        <Icon icon={props.icon} active={selected}
            onClick={() => props.onChange(newValue)} />
    );
}

export default Radium(SwitchState);
