// @flow
import React from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';

type DefaultProps = {
    height?: number,
    maxHeight?: number,
    width?: number
};

type Props = {
    data: Object,
    config: Object
} & DefaultProps;

/**
 * Definition of a Pie chart
 * @param {*} param0
 */
const SunburstChart = ({ data, height, maxHeight, width, config }: Props) => {
    const style = {
        height,
        width,
        maxHeight
    };

    return (
        <div>
            <div style={style}>
                <ResponsiveSunburst data={data} {...config} legends={[]} />
            </div>
        </div>
    );
};

export default SunburstChart;
