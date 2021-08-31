import React from 'react';
import Icon from '../Icon';
import Panel from './Panel';
import PropertyGroup from './PropertyGroup';
import Button from './Button';
import Columns from './Columns';
import Column from './Column';

export default class ArrangePanel extends Panel {
    render() {
        return (
            <PropertyGroup>
                <Columns label="Arrange">
                    <Column>
                        <Button onClick={() => { this.props.onArrange('back') }}>
                            <Icon icon="send-to-back" />
                            <span>send to back</span>
                        </Button>
                        <Button onClick={() => { this.props.onArrange('front') }}>
                            <Icon icon="bring-to-front" />
                            <span>bring to front</span>
                        </Button>
                    </Column>
                </Columns>
            </PropertyGroup>
        );
    }
}
