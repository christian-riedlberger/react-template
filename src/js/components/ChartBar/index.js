// @flow
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

type Props = {
    data: Object,
    config: Object,
    height: number,
    width: number
};

/**
 * Definition of a Bar chart
 * @param {*} param0
 */
const BarChart = ({ data, height, width, config }: Props) => {
    const style = {
        height: height || 400,
        width: width || 400
    };

    return (
        <div style={style}>
            <ResponsiveBar data={data} {...config} />
            <div>
                {config.axisBottom.legend}
            </div>
        </div>
    );
};

export default BarChart;
