// @flow
import _ from 'lodash';
import { GROUP_AVATAR } from 'constants/ServiceURI';

import type { Group } from 'types/groupTypes';

const formatShortName = (shortName: string) =>
    (shortName && shortName.indexOf('_ORGANIZATION') > -1
        ? shortName
        : `${shortName}_ORGANIZATION`).replace(/\s/g, '_');

export const getAvatarUrl = (group: Group | any, v?: string): string | null => {
    if (_.isEmpty(group)) {
        return null;
    }
    return GROUP_AVATAR(formatShortName(group.shortName), v);
};

export default { getAvatarUrl };
