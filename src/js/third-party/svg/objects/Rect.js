import React from 'react';
import Icon from '../Icon';
import Vector from './Vector';

export default class Rect extends Vector {
    static meta = {
        icon: <Icon icon="rectangle" size={30} />,
        initial: {
            width: 5,
            height: 5,
            strokeWidth: 0,
            fill: 'blue',
            radius: 0,
            blendMode: 'normal',
            rotate: 0
        }
    };

    render() {
        const { object } = this.props;
        return (
            <rect style={this.getStyle()}
                {...this.getObjectAttributes()}
                rx={object.radius}
                width={object.width}
                height={object.height} />
        );
    }
}
