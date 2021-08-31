import React, { Component } from 'react';
import Radium from 'radium';

export const styles = {
    canvas: {
        backgroundSize: 400
    },
    grid: {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    }
};

class SVGRenderer extends Component {
    static defaultProps = {
        onMouseOver() {}
    };

    getObjectComponent = (type) => {
        const { objectTypes } = this.props;
        return objectTypes[type];
    }

    renderObject = (object, index) => {
        const { objectRefs, onMouseOver } = this.props;
        const Renderer = this.getObjectComponent(object.type);
        return (
            <Renderer onRender={(ref) => objectRefs[index] = ref}
                onMouseOver={e => onMouseOver(index, e)}
                object={object}    key={index} index={index} />
        );
    }

    render() {
        const { background, backgroundImage, objects, svgStyle, canvas, onMouseDown, onRender } = this.props;
        const { width, height, canvasOffsetX, canvasOffsetY } = canvas;

        const style = [
            styles.canvas,
            background ? {
                backgroundColor: background
            } : {
                ...styles.grid,
                backgroundImage: `url(/${backgroundImage})`
            },
            {
                ...svgStyle,
                marginTop: canvasOffsetY,
                marginLeft: canvasOffsetX
            }
        ];

        return (
            <svg onMouseDown={onMouseDown}
                ref={onRender}
                width={width}
                height={height}
                style={style}>
                {objects.map((o, i) => this.renderObject(o, i))}
            </svg>
        );
    }
}

export default Radium(SVGRenderer);
