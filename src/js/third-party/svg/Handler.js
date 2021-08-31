import React, {  Component  } from 'react';
import Radium from 'radium';

const styles = {
    handler: {
        position: 'absolute',
        border: '2px solid #dedede',
        zIndex: 999999
    },
    anchor: {
        width: 10,
        height: 10,
        ':hover': {
            borderColor: 'gray'
        }
    },
    scaleAnchor: {
        marginTop: -3,
        borderRight: '2px solid #dedede',
        borderBottom: '2px solid #dedede',
        position: 'absolute',
        zIndex: -1
    },
    rotateAnchor: {
        marginTop: -8,
        borderRight: '2px solid #dedede',
        borderTop: '2px solid #dedede',
        position: 'absolute',
        borderTopRightRadius: 3,
        zIndex: -1
    }
};

function ScaleAnchor(props) {
    const { boundingBox } = props;
    const style = {
        marginTop: boundingBox.height - 4,
        marginLeft: boundingBox.width - 4
    };
    return (
        <div style={[styles.anchor, styles.scaleAnchor, style]}
            className="resize-anchor"
            onMouseDown={props.onMouseDown} />
    );
}

const XScaleAnchor = Radium(ScaleAnchor);

function RotateAnchor(props) {
    const style = {
        marginLeft: props.boundingBox.width - 3
    };
    return (
        <div style={[styles.anchor, styles.rotateAnchor, style]}
            className="rotate-anchor"
            onMouseDown={props.onMouseDown} />
    )
}

const XRotateAnchor = Radium(RotateAnchor);

class Handler extends Component {
    onMouseDown = (event) => {
        // event.preventDefault();

        if (event.target.classList.contains('handler')) {
            this.props.onDrag(event);
        }
    }

    render() {
        const { props } = this;
        const { boundingBox } = props;

        const handlerStyle = {
            ...styles.handler,
            ...boundingBox,
            left: boundingBox.left - 2,
            top: boundingBox.top - 2,
            transform: `rotate(${boundingBox.rotate}deg)`
        };

        return (
            <div className="handler"
                style={handlerStyle}
                onMouseLeave={props.onMouseLeave}
                onDoubleClick={props.onDoubleClick}
                onMouseDown={e => this.onMouseDown(e)}>
                { props.canRotate && <XRotateAnchor onMouseDown={props.onRotate} boundingBox={boundingBox} /> }
                { props.canResize && <XScaleAnchor onMouseDown={props.onResize} boundingBox={boundingBox} /> }
            </div>
        );
    }
}

export default Handler;
