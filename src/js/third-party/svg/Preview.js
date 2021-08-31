import React, { Component } from 'react';
import Radium from 'radium';
import SVGRenderer from './SVGRenderer';
import { Text, Path, Rect, Circle } from './objects';

const styles = {
    container: {
        position: 'relative'
    }
};

class Preview extends Component {
    static defaultProps = {
        objectTypes: {
            text: Text,
            rectangle: Rect,
            circle: Circle,
            polygon: Path
        }
    };

    componentWillMount() {
        this.objectRefs = {  };
    }

    render() {
        const { width, height, objects, objectTypes } = this.props;

        const style = {
            ...styles.container,
            ...this.props.style,
            width,
            height
        };

        const canvas = {
            width,
            height,
            canvasWidth: width,
            canvasHeight: height
        };

        return (
            <div className="container" style={style}>
                <SVGRenderer
                    width={width}
                    height={height}
                    objects={objects}
                    objectRefs={this.objectRefs}
                    objectTypes={objectTypes}
                    canvas={canvas} />
            </div>
        );
    }
}

export default Radium(Preview);
