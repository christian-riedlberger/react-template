// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Node } from 'react';
import ErrorMessage from 'components/ErrorMessage';

type DefaultProps = {
    children: Node,
    access: Object
};
type Props = {
    page: string
} & DefaultProps;

const PageAccess = ({ children, access, page }: Props) => {
    if (page !== 'always' && !access[page])
        return <ErrorMessage errors={['noPageAccess']} />;
    return children;
};

// $FlowFixMe
export default connect(store => ({
    isLoading: store.access.isLoading,
    access: store.access
}))(PageAccess);
