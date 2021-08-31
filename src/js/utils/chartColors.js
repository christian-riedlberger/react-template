// @flow
import _ from 'lodash';
import * as d3 from 'd3';
import {
    MIN_RED_THRESHOLD,
    MAX_RED_THRESHOLD,
    MIN_YELLOW_THRESHOLD,
    MAX_YELLOW_THRESHOLD,
    MIN_GREEN_THRESHOLD,
    MAX_GREEN_THRESHOLD,
    CHART_BASE_RED,
    CHART_BASE_YELLOW,
    CHART_BASE_GREEN
} from '../constants/Config';

export default function getChartColors(data) {
    const redScale = createColorScale(
        data,
        CHART_BASE_RED[0],
        CHART_BASE_RED[1],
        MIN_RED_THRESHOLD,
        MAX_RED_THRESHOLD
    );
    const yellowScale = createColorScale(
        data,
        CHART_BASE_YELLOW[0],
        CHART_BASE_YELLOW[1],
        MIN_YELLOW_THRESHOLD,
        MAX_YELLOW_THRESHOLD
    );
    const greenScale = createColorScale(
        data,
        CHART_BASE_GREEN[0],
        CHART_BASE_GREEN[1],
        MIN_GREEN_THRESHOLD,
        MAX_GREEN_THRESHOLD
    );
    const colorArr = [];
    let greenCounter = 0;
    let yellowCounter = 0;
    let redCounter = 0;

    _.map(data, dataPoint => {
        let color = '';

        if (
            dataPoint.suspicionLevel >= MIN_RED_THRESHOLD &&
            dataPoint.suspicionLevel <= MAX_RED_THRESHOLD
        ) {
            color = redScale[redCounter];
            redCounter += 1;
        } else if (
            dataPoint.suspicionLevel >= MIN_YELLOW_THRESHOLD &&
            dataPoint.suspicionLevel <= MAX_YELLOW_THRESHOLD
        ) {
            color = yellowScale[yellowCounter];
            yellowCounter += 1;
        } else {
            color = greenScale[greenCounter];
            greenCounter += 1;
        }
        colorArr.push(color);
    });

    return colorArr;
}

function createColorScale(
    data,
    baseColorStart,
    baseColorEnd,
    minThreshold,
    maxThreshold
) {
    const colorScale = [];
    let scaleMaxCounter = 1;

    _.map(data, dataPoint => {
        if (
            dataPoint.suspicionLevel >= minThreshold &&
            dataPoint.suspicionLevel <= maxThreshold
        ) {
            scaleMaxCounter += 1;
        }
    });

    const renderedColor = d3
        .scaleLinear()
        .domain([0, scaleMaxCounter])
        .range([d3.color(baseColorStart), d3.color(baseColorEnd)])
        .interpolate(d3.interpolateHcl);

    for (let i = 0; i < scaleMaxCounter; i += 1) {
        const color = renderedColor(i);
        colorScale.push(color);
    }
    return colorScale;
}
