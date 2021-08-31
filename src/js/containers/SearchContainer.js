// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { fetchSearch, clearActiveSearch } from 'actions/ActionSearch';
import type { Node as NodeType } from 'types/repoTypes';

/**
 * Selector function that returns a value from the component's own props
 * @arg Object - component's own props
 */
type PropsSelector = Object => string;

export type ContainerArgs = {
    term?: string | PropsSelector
};

export type ContainerProps = {
    fetchSearch: (term: string) => Promise<NodeType>,
    clearActiveSearch: Function
};

const SearchContainer = () => {
    const selector = (store): Object => {
        const props = {
            results: store.search.results,
            isLoadingSearch: store.search.isLoading
        };
        return props;
    };

    const actions = {
        fetchSearch,
        clearActiveSearch
    };

    return compose(
        connect(
            selector,
            actions
        ),
        lifecycle({
            componentDidMount() {}
        })
    );
};

export default SearchContainer;
