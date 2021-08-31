import React from 'react';
import Radium from 'radium';
import styles from './styles';

const Button = ({ onClick, ...props }) => {
    const _onClick = (e, ...args) => {
        e.preventDefault();
        onClick(...args);
    }
    return (
        <a href="#" style={styles.button} onClick={_onClick}>
            { props.children }
        </a>
    );
}

export default Radium(Button);
