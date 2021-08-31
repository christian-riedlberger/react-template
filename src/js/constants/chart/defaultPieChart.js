import _ from 'lodash';
import { CHART_GREEN_SCALE, CHART_RED, CHART_YELLOW } from 'constants/Config';

const config = {
    margin: { bottom: 80 },
    sortByValue: true,
    enableRadialLabels: false,
    slicesLabelsSkipAngle: 0,
    slicesLabelsTextColor: '#333333',
    colors: _.concat(CHART_GREEN_SCALE, [CHART_RED, CHART_YELLOW]),
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
    legends: [
        {
            anchor: 'top',
            direction: 'column',
            translateY: 200,
            translateX: -142,
            itemWidth: 100,
            itemHeight: 36,
            itemTextColor: '#999',
            symbolSize: 18,
            symbolShape: 'circle',
            overflow: 'scroll',
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemTextColor: '#000'
                    }
                }
            ]
        }
    ]
};

export default config;
