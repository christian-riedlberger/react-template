// @flow
import _ from 'lodash';

/**
 * Data util function
 */
export default function normalizeForDataLists(
    data: Array<Object>,
    config: Object
) {
    const { columns } = config;

    const rows = _.map(data, row => {
        return _.map(columns, column => {
            return [row[column.name.toLowerCase()]];
        });
    });

    return rows;
}
