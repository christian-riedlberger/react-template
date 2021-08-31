// @flow
import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { injectIntl, intlShape } from 'react-intl';

// Typography
import HeaderText from 'components/HeaderText';
import Button from 'components/Button';
import FilterTags from 'components/TagFilters';
import { renderTagValues } from 'constants/Filters';

type DefaultProps = {
    access: Object,
    intl: intlShape
};

type Props = {
    onFilter: () => void,
    formName: string,
    formValues: Object
} & DefaultProps;

const HeaderGroups = (props: Props) => {
    const { access, onFilter, formName, formValues, intl } = props;
    const [tags, setTags] = useState([]);

    useEffect(() => {
        setTags(renderTagValues(formName, formValues, intl));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);

    return (
        <Fragment>
            <HeaderText
                flat
                buttonsLeft={
                    access.sysAdmin
                        ? [
                            <Link key="left-1" to="/people/new">
                                <Button text="createNew" size="small" round />
                            </Link>
                        ]
                        : []
                }
                buttonsRight={[
                    <Button
                        key="right-1"
                        text="filters"
                        size="small"
                        color="grey0"
                        iconPosition="right"
                        icon={
                            <clr-icon
                                shape="filter-2"
                                size={18}
                                style={{
                                    position: 'relative',
                                    top: '1px'
                                }}
                            />
                        }
                        round
                        onClick={onFilter}
                    />
                ]}
                buttonsBottom={[
                    <FilterTags key="bottom-1" border tags={tags} intl={intl} />
                ]}
                borderBottom
            />
        </Fragment>
    );
};

const mapStateToProps = state => ({
    access: state.access
});

export default injectIntl(connect(mapStateToProps)(HeaderGroups));
