// @flow
import React, { useEffect } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import _ from 'lodash';

import GroupsContainer from 'containers/GroupsContainer';
import type { ContainerProps } from 'containers/GroupsContainer';
import type { Group as GroupType } from 'types/groupTypes';
import GroupColumn from 'components/GroupColumn';
import OrganizationColumn from 'components/OrganizationColumn';

type DefaultProps = {
    ...ContainerProps
};

type Props = {} & DefaultProps;

const styles = {
    viewport: {
        overflowX: 'hidden',
        width: '67vw',
        padding: '12px 0px 24px 0px'
    },
    column: {
        width: '22vw',
        float: 'left',
        margin: '0 .75em'
    },
    slider: {
        position: 'relative',
        top: 0,
        width: 500000,
        margin: '0 -.5em'
    }
};

const ListCompany = (props: Props) => {
    const { history, clearFetchGroups, clearGroupHistory } = props;

    useEffect(
        () => () => {
            clearGroupHistory();
            clearFetchGroups();
        },
        [clearFetchGroups, clearGroupHistory]
    );

    const renderColumn = (group, index) => {
        const type = { isOrganization: false, isOperation: false };
        if (group.shortName.match(/^(?!\s*$)(?:ORGANIZATIONS)+$/gm)) {
            type.isOrganization = true;
            return (
                <OrganizationColumn
                    parentGroup={group}
                    index={index}
                    parentType={type}
                />
            );
        }

        return (
            <GroupColumn parentGroup={group} index={index} parentType={type} />
        );
    };

    return (
        <ContainerDimensions>
            {({ width }) => {
                let moveLeftSize = 0;
                const columnWidth = (width - 48) / 3;
                const reverseCount =
                    history && history.length > 3 ? history.length - 3 : 0;

                if (reverseCount > 0) {
                    moveLeftSize = `-${reverseCount * (columnWidth + 22)}px`;
                }

                return (
                    <div
                        style={{
                            ...styles.viewport,
                            width
                        }}
                    >
                        <div
                            style={{
                                ...styles.slider,
                                left: moveLeftSize
                            }}
                        >
                            <div className="clearfix">
                                {_.map(
                                    history,
                                    (group: GroupType, index: number) => (
                                        <div
                                            style={{
                                                ...styles.column,
                                                width: columnWidth
                                            }}
                                            key={`GroupColumn-${group.nodeRef}`}
                                        >
                                            {renderColumn(group, index)}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                );
            }}
        </ContainerDimensions>
    );
};

export default GroupsContainer()(ListCompany);
