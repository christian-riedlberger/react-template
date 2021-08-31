import React from 'react';
import _ from 'lodash';
import Panel from './Panel';
import PropertyGroup from './PropertyGroup';
import Columns from './Columns';
import Column from './Column';

export default class SizePanel extends Panel {
    render() {
        const { object } = this.props;
        return (
            <PropertyGroup object={object}>
                {_.has(object, 'width', 'height') && <Columns label="Size">
                    <Column showIf={_.has(object, 'width')}
                        label="width" value={object.width}
                        onChange={e => this.props.onChange('width', e)} />
                    <Column showIf={_.has(object, 'height')} label="height"
                        value={object.height}
                        onChange={e => this.props.onChange('height', e)} />
                </Columns>}
                <Columns label="Position">
                    <Column
                        showIf={_.has(object, 'x')}
                        label="top"
                        value={object.x}
                        onChange={e => this.props.onChange('x', e)} />
                    <Column
                        showIf={_.has(object, 'y')}
                        label="top"
                        value={object.y}
                        onChange={e => this.props.onChange('y', e)} />
                </Columns>
                {_.has(object, 'rotate') && <Columns label="Rotation">
                    <Column
                        label="angle"
                        value={object.rotate}
                        onChange={e => this.props.onChange('rotate', e)} />
                </Columns>}
            </PropertyGroup>
        );
    }
}
