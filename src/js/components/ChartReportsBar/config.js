// @flow

import messages from 'constants/Messages';
import { intlShape } from 'react-intl';
import _ from 'lodash';

// @flow

export const configBar = {
    keys: ['value'],
    indexBy: 'value', // required
    margin: { top: 50, right: 130, bottom: 50, left: 60 },
    padding: 0.3,
    colors: { scheme: 'paired' },
    colorBy: 'index',
    borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
    axisTop: null,
    axisRight: null,
    axisBottom: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0
        // legend: string,
        // legendPosition: 'middle' | 'left' | 'right',
        // legendOffset: number
    },
    axisLeft: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0
    },
    enableLabel: false,
    animate: true,
    motionStiffness: 90,
    motionDamping: 15
};

export type ConfigBarArgs = {
    legendBottom?: string, // can't be react element
    indexBy: string
};

export const getConfig = (args: ConfigBarArgs) => ({
    ...configBar,
    indexBy: args && args.indexBy ? args.indexBy : configBar.indexBy,
    axisBottom: {
        ...configBar.axisBottom,
        ...(args && args.legendBottom
            ? {
                legend: args.legendBottom,
                legendPosition: 'middle',
                legendOffset: 32
            }
            : null)
    }
});

/**
 * Convert requests to chart data format
 */
export const formatRequests = (
    requests: Array<Object>,
    property: string,
    intl: intlShape
) =>
    _.chain(requests)
        // sum by request property
        .reduce(
            (sum, request) => ({
                ...sum,
                [request[property]]: sum[request[property]] || 0 + 1
            }),
            {}
        )
        // convert to array
        .map((value, key) => ({
            [property]: key,
            value
        }))
        .sortBy(property)
        // add intl
        .map(bar => ({
            ...bar,
            [property]: messages[bar[property]]
                ? intl.formatMessage(messages[bar[property]])
                : `intl:${bar[property]}`
        }))
        .value();

export default { configBar, getConfig, formatRequests };
