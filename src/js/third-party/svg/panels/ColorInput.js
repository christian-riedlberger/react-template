// @flow
import _ from 'lodash';
import React from 'react';
import reactCSS from 'reactcss';
import {  TwitterPicker  } from 'react-color';
import rgba from 'rgba-convert';

class ColorInput extends React.Component {

    state: {
        isVisible: boolean,
        color: Object
    }

    constructor(props) {
        super(props);

        const defColor = {
            r: '241',
            g: '112',
            b: '19',
            a: '1'
        };

        this.state = {
            isVisible: false,
            color: rgba.obj(this.props.value) || defColor
        };
    }

    componentWillReceiveProps(nextProps: Object) {
        if (!_.isEqual(this.state.value, rgba.obj(nextProps.value))) {
            const color = rgba.obj(this.props.value);
            this.setState({
                ...this.state,
                color
            });
        }
    }

    handleClick = () => {
        this.setState({  isVisible: !this.state.isVisible  })
    };

    handleClose = () => {
        this.setState({  isVisible: false  })
    };

    handleChange = (color) => {
        const { r, g, b, a } = color.rgb;
        this.setState({  color: color.rgb  });

        this.props.onChange(`rgba(${r}, ${g}, ${b}, ${a})`);
    };

    render() {
        const styles = reactCSS({
            default: {
                color: {
                    width: '10px',
                    height: '10px',
                    borderRadius: '100px',
                    background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`
                },
                swatch: {
                    padding: '3px',
                    background: '#fff',
                    borderRadius: '100px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer'
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2'
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px'
                }
            }
        });

        return (
            <div>
                <div style={styles.swatch} onClick={this.handleClick}>
                    <div style={styles.color} />
                </div>
                {  this.state.isVisible ? <div style={styles.popover}>
                    <div style={styles.cover} onClick={this.handleClose} />
                    <TwitterPicker triangle="hide" color={this.state.color} onChange={this.handleChange} />
                </div> : null }
            </div>
        )
    }
}

export default ColorInput;

