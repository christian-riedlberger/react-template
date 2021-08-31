// @flow
import React from 'react';
import { ResponsivePie } from '@nivo/pie';

type Props = {
    data: Object,
    height: number,
    maxHeight: number,
    width: number,
    config: Object
};

/**
 * Definition of a Pie chart
 * @param {*} param0
 */
const PieChart = (props: Props) => {
    const { data, height, maxHeight, width, config } = props;
    const style = {
        height,
        width,
        maxHeight
    };

    return (
        <div>
            <div style={style}>
                <ResponsivePie data={data} {...config} />
            </div>
        </div>
    );
};

export default PieChart;
