// @flow

import { hue5 } from 'constants/Theme';
import messages from 'constants/Messages';
import { intlShape } from 'react-intl';
import _ from 'lodash';

export const configPie = {
    margin: { top: 40, right: 80, bottom: 80, left: 80 },
    innerRadius: 0.35,
    padAngle: 6,
    colors: { scheme: 'paired' },
    borderWidth: 1,
    borderColor: hue5,
    radialLabel: 'label',
    radialLabelsSkipAngle: 0,
    radialLabelsTextXOffset: 6,
    radialLabelsTextColor: { theme: 'labels.text.fill' },
    radialLabelsLinkOffset: 6,
    radialLabelsLinkDiagonalLength: 20,
    radialLabelsLinkHorizontalLength: 17,
    radialLabelsLinkStrokeWidth: 1,
    radialLabelsLinkColor: { theme: 'labels.text.fill' },
    enableSlicesLabels: false,
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
    isInteractive: false
};

export const getConfig = () => configPie;

/**
 * Convert requests to chart data format
 */
export const formatRequests = (
    requests: Array<Object>,
    property: string,
    intl: intlShape
): Array<{ id: string, value: Number, label: HTMLElement }> =>
    _.chain(requests)
        // sum by request property
        .reduce(
            (sum, request) => ({
                ...sum,
                [request[property]]: (sum[request[property]] || 0) + 1
            }),
            {}
        )
        // convert to array
        .map((value, key) => ({
            id: key,
            value: _.round((value / requests.length) * 100)
        }))
        .sortBy('id')
        // add intl
        .map(bar => ({
            ...bar,
            value: bar.value,
            label: `${
                messages[bar.id]
                    ? intl.formatMessage(messages[bar.id])
                    : `intl:${bar.id}`
            } (${bar.value}%)`
        }))
        .value();

export default { configPie, getConfig, formatRequests };
