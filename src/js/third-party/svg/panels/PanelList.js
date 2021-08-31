import React from 'react';
import Radium from 'radium';
import {  Portal  } from 'react-portal';
import styles from './styles';

const PanelList = (props) => {

    const { offset, objectComponent } = props;
    const style = {
        left: offset.width + offset.x,
        top: offset.y + window.scrollY
    };
    return (
        <Portal closeOnEsc closeOnOutsideClick isOpened>
            <div style={[styles.propertyPanel, style]}>
                { objectComponent.panels.map((Panel, i) => <Panel key={i} {...props} />)}
            </div>
        </Portal>
    );
};

export default Radium(PanelList);
