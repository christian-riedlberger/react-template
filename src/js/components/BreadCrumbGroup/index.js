// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import _ from 'lodash';

import { ORGANIZATION_GROUP } from 'constants/Config';
import GroupsContainer from 'containers/GroupsContainer';
import type { ContainerProps as GroupProps } from 'containers/GroupsContainer';
import { getReservedOrgName } from 'utils/string';
import Crumb from './Crumb';

type DefaultProps = {
    intl: intlShape
} & GroupProps;

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    breadCrumbGroup: {
        borderBottom: '1px solid rgb(217, 222, 227)',
        background: '#fff',
        padding: '.75em 1.75em'
        // margin: -1em;
        // margin-bottom: 0;
    }
});

const BreadCrumbGroup = (props: Props) => {
    const { history, updateGroupAtIndex, intl } = props;
    const classes = useStyles();

    const handleClick = (group: Object, index: number) => {
        updateGroupAtIndex(group, index);
    };

    return (
        <div className={classes.breadCrumbGroup}>
            <Breadcrumbs maxItems={10} aria-label="breadcrumb">
                {_.map(history, (group, index) => (
                    <Crumb
                        key={group.shortName}
                        name={getReservedOrgName(group.displayName, intl)}
                        onClick={() => handleClick(group, index)}
                        inactive={index === history.length - 1}
                    />
                ))}
            </Breadcrumbs>
        </div>
    );
};

export default GroupsContainer({ initHistory: [ORGANIZATION_GROUP] })(
    injectIntl(BreadCrumbGroup)
);
